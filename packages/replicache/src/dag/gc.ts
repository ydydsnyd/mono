import {assert, assertNumber} from 'shared/asserts.js';
import {skipGCAsserts} from '../config.js';
import {Hash, emptyHash} from '../hash.js';
import type {MaybePromise} from '../replicache.js';

export type HeadChange = {
  new: Hash | undefined;
  old: Hash | undefined;
};

type LoadedRefCountPromises = Map<Hash, Promise<number>>;

export interface RefCountUpdatesDelegate {
  getRefCount: (hash: Hash) => MaybePromise<number | undefined>;
  getRefs: (hash: Hash) => MaybePromise<readonly Hash[] | undefined>;
  /**
   * Should be implemented if the store lazily loads refs, returning whether
   * or not the chunks refs have already been counted (i.e. are reflected
   * in `getRefCount`).
   *
   * If defined then:
   *  - `getRefs` should return undefined for refs that have not been loaded,
   *    but should never return undefined for hashes in `putChunks`.
   *  - it is assumed that chunks in `putChunks` may have been reachable before
   *    the write, but may not have been counted.  This method is used to
   *    determine if they have been counted or not.  If they have not been
   *    counted, and are reachable with the write applied, the returned
   *    ref count updates will include updates for counting them.
   *
   * If undefined then:
   *  - `getRefs` should never return undefined
   *  - it is assumed that the refs of any chunks which were reachable before
   *    the write are already counted
   */
  areRefsCounted?: (hash: Hash) => boolean;
}

/**
 * Computes how ref counts should be updated when a dag write is committed.
 * Does not modify the dag store.
 * @param headChanges Heads that were changed by the dag write.
 * @param putChunks Chunks that were put by the dag write.
 * @param delegate Delegate used for getting ref information from the dag store.
 * @returns Map from chunk Hash to changed ref counts.  Chunks with a new ref
 * count of 0 should be deleted.  All hashes in `putChunks` will have an entry
 * (which will be zero if the newly put chunk is not reachable from any head).
 */
export function computeRefCountUpdates(
  headChanges: Iterable<HeadChange>,
  putChunks: ReadonlySet<Hash>,
  delegate: RefCountUpdatesDelegate,
): Promise<Map<Hash, number>> {
  return new RefCountUpdates(headChanges, putChunks, delegate).compute();
}

class RefCountUpdates {
  private readonly _newHeads: Hash[];
  private readonly _oldHeads: Hash[];
  private readonly _putChunks: ReadonlySet<Hash>;
  private readonly _delegate: RefCountUpdatesDelegate;
  private readonly _refsCounted: Set<Hash> | null;
  private readonly _refCountUpdates: Map<Hash, number>;
  private readonly _loadedRefCountPromises: LoadedRefCountPromises;
  private readonly _isLazyDelegate: boolean;

  constructor(
    headChanges: Iterable<HeadChange>,
    putChunks: ReadonlySet<Hash>,
    delegate: RefCountUpdatesDelegate,
  ) {
    const newHeads: Hash[] = [];
    const oldHeads: Hash[] = [];
    for (const changedHead of headChanges) {
      if (changedHead.old !== changedHead.new) {
        changedHead.old && oldHeads.push(changedHead.old);
        changedHead.new && newHeads.push(changedHead.new);
      }
    }
    this._newHeads = newHeads;
    this._oldHeads = oldHeads;
    this._putChunks = putChunks;
    this._delegate = delegate;
    this._refCountUpdates = new Map();
    // This map is used to ensure we do not load the ref count key more than once.
    // Once it is loaded we only operate on a cache of the ref counts.
    this._loadedRefCountPromises = new Map();
    this._isLazyDelegate = delegate.areRefsCounted !== undefined;
    this._refsCounted = this._isLazyDelegate ? new Set() : null;
  }

  async compute(): Promise<Map<Hash, number>> {
    for (const n of this._newHeads) {
      await this._changeRefCount(n, 1);
    }

    // Now go through the put chunks to ensure each has an entry in
    // refCountUpdates (zero for new chunks which are not reachable from
    // newHeads).
    await Promise.all(
      Array.from(this._putChunks.values(), hash =>
        this._ensureRefCountLoaded(hash),
      ),
    );

    if (this._isLazyDelegate) {
      assert(this._delegate.areRefsCounted);
      assert(this._refsCounted);
      let refCountsUpdated;
      do {
        refCountsUpdated = false;
        for (const hash of this._putChunks.values()) {
          if (
            !this._delegate.areRefsCounted(hash) &&
            !this._refsCounted.has(hash) &&
            this._refCountUpdates.get(hash) !== 0
          ) {
            await this._updateRefsCounts(hash, 1);
            refCountsUpdated = true;
            break;
          }
        }
      } while (refCountsUpdated);
    }

    for (const o of this._oldHeads) {
      await this._changeRefCount(o, -1);
    }

    if (!skipGCAsserts) {
      for (const [hash, update] of this._refCountUpdates) {
        assert(
          update >= 0,
          `ref count update must be non-negative. ${hash}:${update}`,
        );
      }
    }

    return this._refCountUpdates;
  }

  private async _changeRefCount(hash: Hash, delta: number): Promise<void> {
    // First make sure that we have the ref count in the cache. This is async
    // because it might need to load the ref count from the store (via the delegate).
    //
    // Once we have loaded the ref count all the updates to it are sync to
    // prevent race conditions.
    await this._ensureRefCountLoaded(hash);
    if (this._updateRefCount(hash, delta)) {
      await this._updateRefsCounts(hash, delta);
    }
  }

  private async _updateRefsCounts(hash: Hash, delta: number) {
    if (hash === emptyHash) {
      return;
    }
    const refs = await this._delegate.getRefs(hash);
    if (!skipGCAsserts) {
      assert(
        refs || (this._isLazyDelegate && !this._putChunks.has(hash)),
        'refs must be defined',
      );
    }

    if (refs !== undefined) {
      this._refsCounted?.add(hash);
      const ps = refs.map(ref => this._changeRefCount(ref, delta));
      await Promise.all(ps);
    }
  }

  private _ensureRefCountLoaded(hash: Hash): Promise<number> {
    // Only get the ref count once.
    let p = this._loadedRefCountPromises.get(hash);
    if (p === undefined) {
      p = (async () => {
        const value = (await this._delegate.getRefCount(hash)) || 0;
        this._refCountUpdates.set(hash, value);
        return value;
      })();
      this._loadedRefCountPromises.set(hash, p);
    }
    return p;
  }

  private _updateRefCount(hash: Hash, delta: number): boolean {
    const oldCount = this._refCountUpdates.get(hash);
    assertNumber(oldCount);
    assert(oldCount + delta >= 0, 'ref count must be non-negative');
    this._refCountUpdates.set(hash, oldCount + delta);
    return (oldCount === 0 && delta === 1) || (oldCount === 1 && delta === -1);
  }
}

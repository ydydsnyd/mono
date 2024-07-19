import type {ExperimentalNoIndexDiff} from 'replicache';
import {assert} from 'shared/src//asserts.js';
import type {AST} from '../ast/ast.js';
import type {Materialite} from '../ivm/materialite.js';
import type {SetSource} from '../ivm/source/set-source.js';
import type {Source} from '../ivm/source/source.js';
import type {PipelineEntity} from '../ivm/types.js';
import type {Entity} from '../schema/entity-schema.js';
import {mapIter} from '../util/iterables.js';
import type {Context, GotCallback, SubscriptionDelegate} from './context.js';

export type AddWatch = (name: string, cb: WatchCallback) => void;

export type WatchCallback = (changes: ExperimentalNoIndexDiff) => void;

export class ZeroContext implements Context {
  readonly materialite: Materialite;
  readonly #sourceStore: ZeroSourceStore;
  readonly #subscriptionDelegate: SubscriptionDelegate;

  constructor(
    materialite: Materialite,
    addWatch: AddWatch,
    subscriptionDelegate: SubscriptionDelegate,
  ) {
    this.materialite = materialite;
    this.#sourceStore = new ZeroSourceStore(materialite, addWatch);
    this.#subscriptionDelegate = subscriptionDelegate;
  }

  getSource<T extends PipelineEntity>(name: string): Source<T> {
    // TODO(mlaw): we should eventually evict sources that are no longer used.
    return this.#sourceStore.getSource(name) as unknown as Source<T>;
  }

  subscriptionAdded(ast: AST, gotCallback: GotCallback): () => void {
    return this.#subscriptionDelegate.subscriptionAdded(ast, gotCallback);
  }
}

/**
 * Forwards Replicache changes to ZQL sources so they can be fed into any
 * queries that may exist.
 */
class ZeroSourceStore {
  readonly #materialite: Materialite;
  readonly #sources = new Map<string, ZeroSource>();
  readonly #addWatch: AddWatch;

  constructor(materialite: Materialite, addWatch: AddWatch) {
    this.#materialite = materialite;
    this.#addWatch = addWatch;
  }

  getSource(name: string) {
    let source = this.#sources.get(name);
    if (source === undefined) {
      source = new ZeroSource(this.#materialite, name, this.#addWatch);
      this.#sources.set(name, source);
    }

    return source.get();
  }
}

class ZeroSource {
  readonly #canonicalSource: SetSource<Entity>;
  #receivedFirstDiff = false;

  constructor(materialite: Materialite, name: string, addWatch: AddWatch) {
    this.#canonicalSource = materialite.newSetSource<Entity>(
      [[[name, 'id'], 'asc']],
      name,
    );
    addWatch(name, this.#handleDiff);
  }

  #handleDiff = (changes: ExperimentalNoIndexDiff) => {
    // The first diff is the set of initial values
    // to seed the source. We call `seed`, rather than add,
    // to process these. `seed` will only send to changes
    // to views that have explicitly requested history whereas `add` will
    // send them to everyone as if they were changes happening _now_.
    if (this.#receivedFirstDiff === false) {
      this.#canonicalSource.seed(
        mapIter(changes, diff => {
          assert(diff.op === 'add');
          return diff.newValue as Entity;
        }),
      );
      this.#receivedFirstDiff = true;

      return;
    }
    for (const diff of changes) {
      if (diff.op === 'del' || diff.op === 'change') {
        this.#canonicalSource.delete(diff.oldValue as Entity);
      }
      if (diff.op === 'add' || diff.op === 'change') {
        this.#canonicalSource.add(diff.newValue as Entity);
      }
    }
  };

  get() {
    return this.#canonicalSource;
  }
}

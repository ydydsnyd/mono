import {expect} from '@esm-bundle/chai';
import {MutatorDefs, Replicache, BeginPullResult} from './replicache.js';
import type {
  ReplicacheOptions,
  ReplicacheInternalOptions,
  ReplicacheInternalAPI,
} from './replicache-options.js';
import * as kv from './kv/mod.js';
import {SinonFakeTimers, useFakeTimers} from 'sinon';
import * as sinon from 'sinon';
import type {JSONValue, ReadonlyJSONValue} from './json.js';

// fetch-mock has invalid d.ts file so we removed that on npm install.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import fetchMock from 'fetch-mock/esm/client';
import {uuid} from './uuid.js';
import type {WriteTransaction} from './transactions.js';
import {TEST_LICENSE_KEY} from '@rocicorp/licensing/src/client';
import type {DiffComputationConfig} from './sync/diff.js';
import type {ClientGroupID} from './sync/ids.js';
import type {ClientID} from './sync/ids.js';
import type {PatchOperation} from './puller.js';
import type {Hash} from './hash.js';
import {
  setupForTest as setupIDBDatabasesStoreForTest,
  teardownForTest as teardownIDBDatabasesStoreForTest,
} from './persist/idb-databases-store-db-name.js';
import {MemStore} from './kv/mem-store.js';
import {withRead, withWrite} from './kv/mod.js';

export class ReplicacheTest<
  // eslint-disable-next-line @typescript-eslint/ban-types
  MD extends MutatorDefs = {},
> extends Replicache<MD> {
  private readonly _internalAPI!: ReplicacheInternalAPI;

  constructor(options: ReplicacheOptions<MD>) {
    let internalAPI!: ReplicacheInternalAPI;
    super({
      ...options,
      exposeInternalAPI: (api: ReplicacheInternalAPI) => {
        internalAPI = api;
      },
    } as ReplicacheOptions<MD>);
    this._internalAPI = internalAPI;
  }

  beginPull(): Promise<BeginPullResult> {
    return super._beginPull();
  }

  maybeEndPull(syncHead: Hash, requestID: string): Promise<void> {
    return super._maybeEndPull(syncHead, requestID);
  }

  invokePush(): Promise<boolean> {
    return super._invokePush();
  }

  protected override _invokePush(): Promise<boolean> {
    // indirection to allow test to spy on it.
    return this.invokePush();
  }

  protected override _beginPull(): Promise<BeginPullResult> {
    return this.beginPull();
  }

  persist() {
    return this._internalAPI.persist();
    // return this[persistSymbol]();
  }

  schedulePersist() {
    // @ts-expect-error Property '_schedulePersist' is private
    return super._schedulePersist();
  }

  recoverMutationsSpy = sinon.spy(this, 'recoverMutations');

  recoverMutations(): Promise<boolean> {
    return super._recoverMutations();
  }

  protected override _recoverMutations(): Promise<boolean> {
    // indirection to allow test to spy on it.
    return this.recoverMutations();
  }

  licenseActive(): Promise<boolean> {
    return this._licenseActivePromise;
  }

  licenseValid(): Promise<boolean> {
    return this._licenseCheckPromise;
  }

  get perdag() {
    // @ts-expect-error Property '_perdag' is private
    return this._perdag;
  }

  get persistIsScheduled() {
    // @ts-expect-error Property '_persistIsScheduled' is private
    return this._persistIsScheduled;
  }

  get clientGroupID(): Promise<ClientGroupID | undefined> {
    // @ts-expect-error Property '_clientGroupIDPromise' is private
    return this._clientGroupIDPromise;
  }
}

export const reps: Set<ReplicacheTest> = new Set();
export async function closeAllReps(): Promise<void> {
  for (const rep of reps) {
    if (!rep.closed) {
      await rep.close();
    }
  }
  reps.clear();
}

/**
 * Additional closeables to close as part of teardown.
 * Likely kb.Store(s) or dag.Store(s), which should be closed before
 * deleting the underlying IndexedDB databases.  These are closed before
 * `dbsToDrop` are deleted.
 */
export const closeablesToClose: Set<{close: () => Promise<unknown>}> =
  new Set();
export async function closeAllCloseables(): Promise<void> {
  for (const closeable of closeablesToClose) {
    await closeable.close();
  }
  closeablesToClose.clear();
}

export const dbsToDrop: Set<string> = new Set();
export async function deleteAllDatabases(): Promise<void> {
  for (const name of dbsToDrop) {
    await kv.dropIDBStore(name);
  }
  dbsToDrop.clear();
}

type ReplicacheTestOptions<MD extends MutatorDefs> = Omit<
  ReplicacheOptions<MD>,
  'name' | 'licenseKey'
> & {
  onClientStateNotFound?: (() => void) | null | undefined;
  licenseKey?: string | undefined;
} & ReplicacheInternalOptions;

export async function replicacheForTesting<
  // eslint-disable-next-line @typescript-eslint/ban-types
  MD extends MutatorDefs = {},
>(
  name: string,
  options: ReplicacheTestOptions<MD> = {},
  testOptions: {
    useDefaultURLs?: boolean | undefined; // default true
    useUniqueName?: boolean | undefined; // default true
  } = {},
): Promise<ReplicacheTest<MD>> {
  const defaultURLs = {
    pullURL: 'https://pull.com/?name=' + name,
    pushURL: 'https://push.com/?name=' + name,
  };
  const {useDefaultURLs = true, useUniqueName = true} = testOptions;
  const {
    pullURL,
    pushDelay = 60_000, // Large to prevent interfering
    pushURL,
    licenseKey,
    onClientStateNotFound = () => {
      throw new Error(
        'Unexpected call to onClientStateNotFound. Did you forget to pass it as an option?',
      );
    },
    ...rest
  }: ReplicacheTestOptions<MD> = useDefaultURLs
    ? {...defaultURLs, ...options}
    : options;

  const rep = new ReplicacheTest<MD>({
    pullURL,
    pushDelay,
    pushURL,
    name: useUniqueName ? `${uuid()}:${name}` : name,
    licenseKey: licenseKey ?? TEST_LICENSE_KEY,
    ...rest,
  });
  dbsToDrop.add(rep.idbName);
  reps.add(rep);

  rep.onClientStateNotFound = onClientStateNotFound;

  // Wait for open to be done.
  const clientID = await rep.clientID;
  fetchMock.post(pullURL, makePullResponse(clientID, 0, [], null));
  fetchMock.post(pushURL, 'ok');
  await tickAFewTimes();
  return rep;
}

export let clock: SinonFakeTimers;

export function initReplicacheTesting(): void {
  fetchMock.config.overwriteRoutes = true;

  setup(() => {
    clock = useFakeTimers(0);
    setupIDBDatabasesStoreForTest();
  });

  teardown(async () => {
    clock.restore();
    fetchMock.restore();
    sinon.restore();
    await closeAllReps();
    await closeAllCloseables();
    await deleteAllDatabases();
    await teardownIDBDatabasesStoreForTest();
  });
}

export async function tickAFewTimes(n = 10, time = 10) {
  for (let i = 0; i < n; i++) {
    await clock.tickAsync(time);
  }
}

export async function tickUntil(f: () => boolean, msPerTest = 10) {
  while (!f()) {
    await clock.tickAsync(msPerTest);
  }
}

export class MemStoreWithCounters implements kv.Store {
  readonly store: kv.Store;
  readCount = 0;
  writeCount = 0;
  closeCount = 0;

  constructor(name: string) {
    this.store = new MemStore(name);
  }

  resetCounters() {
    this.readCount = 0;
    this.writeCount = 0;
    this.closeCount = 0;
  }

  read() {
    this.readCount++;
    return this.store.read();
  }

  withRead<R>(fn: (read: kv.Read) => R | Promise<R>): Promise<R> {
    this.readCount++;
    return withRead(this.store, fn);
  }

  write() {
    this.writeCount++;
    return this.store.write();
  }

  withWrite<R>(fn: (write: kv.Write) => R | Promise<R>): Promise<R> {
    this.writeCount++;
    return withWrite(this.store, fn);
  }

  async close() {
    this.closeCount++;
    await this.store.close();
  }

  get closed(): boolean {
    return this.store.closed;
  }
}

export async function addData(
  tx: WriteTransaction,
  data: {[key: string]: JSONValue},
) {
  for (const [key, value] of Object.entries(data)) {
    await tx.put(key, value);
  }
}

export function expectLogContext(
  consoleLogStub: sinon.SinonStub,
  index: number,
  rep: Replicache,
  expectedContext: string,
) {
  expect(consoleLogStub.callCount).to.greaterThan(index);
  const {args} = consoleLogStub.getCall(index);
  expect(args).to.have.length(2);
  expect(args[0]).to.equal(`name=${rep.name}`);
  expect(args[1]).to.equal(expectedContext);
}

export async function expectPromiseToReject(
  p: unknown,
): Promise<Chai.Assertion> {
  let e;
  try {
    await p;
  } catch (ex) {
    e = ex;
  }
  return expect(e);
}

export async function expectAsyncFuncToThrow(f: () => unknown, c: unknown) {
  (await expectPromiseToReject(f())).to.be.instanceof(c);
}

/**
 * SubscriptionsManagerOptions that always generates DiffsMaps.
 */
export const testSubscriptionsManagerOptions: DiffComputationConfig = {
  shouldComputeDiffs: () => true,
  shouldComputeDiffsForIndex: () => true,
};

export function makePullResponse(
  clientID: ClientID,
  lastMutationID: number,
  patch: PatchOperation[] = [],
  cookie: ReadonlyJSONValue = '',
) {
  if (DD31) {
    return {
      cookie,
      lastMutationIDChanges: {[clientID]: lastMutationID},
      patch,
    };
  }
  return {
    cookie,
    lastMutationID,
    patch,
  };
}

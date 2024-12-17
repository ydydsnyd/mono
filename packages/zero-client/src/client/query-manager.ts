import type {ClientID} from '../../../replicache/src/mod.js';
import type {ReplicacheImpl} from '../../../replicache/src/replicache-impl.js';
import {assert} from '../../../shared/src/asserts.js';
import {must} from '../../../shared/src/must.js';
import {hashOfAST} from '../../../zero-protocol/src/ast-hash.js';
import {normalizeAST, type AST} from '../../../zero-protocol/src/ast.js';
import type {
  ChangeDesiredQueriesMessage,
  QueriesPatchOp,
} from '../../../zero-protocol/src/mod.js';
import type {GotCallback} from '../../../zql/src/query/query-impl.js';
import type {ReadTransaction} from '../mod.js';
import {desiredQueriesPrefixForClient, GOT_QUERIES_KEY_PREFIX} from './keys.js';
import {findCover} from '../../../zql/src/cover/find-cover.js';

type QueryHash = string;
type QueryEntry = {normalized: AST; count: number; gotCallbacks: GotCallback[]};

/**
 * Tracks what queries the client is currently subscribed to on the server.
 * Sends `changeDesiredQueries` message to server when this changes.
 * Deduplicates requests so that we only listen to a given unique query once.
 */
export class QueryManager {
  readonly #clientID: ClientID;
  readonly #send: (change: ChangeDesiredQueriesMessage) => void;
  readonly #queries: Map<QueryHash, QueryEntry> = new Map();
  readonly #recentQueriesMaxSize: number;
  readonly #recentQueries: Set<QueryHash> = new Set();
  readonly #gotQueries: Set<QueryHash> = new Set();
  readonly #queriesByTable: Map<string, Map<QueryHash, QueryEntry>> = new Map();

  constructor(
    clientID: ClientID,
    send: (change: ChangeDesiredQueriesMessage) => void,
    experimentalWatch: InstanceType<typeof ReplicacheImpl>['experimentalWatch'],
    recentQueriesMaxSize: number,
  ) {
    this.#clientID = clientID;
    this.#recentQueriesMaxSize = recentQueriesMaxSize;
    this.#send = send;
    experimentalWatch(
      diff => {
        for (const diffOp of diff) {
          const queryHash = diffOp.key.substring(GOT_QUERIES_KEY_PREFIX.length);
          switch (diffOp.op) {
            case 'add':
              this.#gotQueries.add(queryHash);
              this.#fireGotCallbacks(queryHash, true);
              break;
            case 'del':
              this.#gotQueries.delete(queryHash);
              this.#fireGotCallbacks(queryHash, false);
              break;
          }
        }
      },
      {
        prefix: GOT_QUERIES_KEY_PREFIX,
        initialValuesInFirstDiff: true,
      },
    );
  }

  #fireGotCallbacks(queryHash: string, got: boolean) {
    const gotCallbacks = this.#queries.get(queryHash)?.gotCallbacks ?? [];
    for (const gotCallback of gotCallbacks) {
      gotCallback(got);
    }
  }

  /**
   * Get the queries that need to be registered with the server.
   *
   * An optional `lastPatch` can be provided. This is the last patch that was
   * sent to the server and may not yet have been acked. If `lastPatch` is provided,
   * this method will return a patch that does not include any events sent in `lastPatch`.
   *
   * This diffing of last patch and current patch is needed since we send
   * a set of queries to the server when we first connect inside of the `sec-protocol` as
   * the `initConnectionMessage`.
   *
   * While we're waiting for the `connected` response to come back from the server,
   * the client may have registered more queries. We need to diff the `initConnectionMessage`
   * queries with the current set of queries to understand what those were.
   */
  async getQueriesPatch(
    tx: ReadTransaction,
    lastPatch?: Map<string, QueriesPatchOp> | undefined,
  ): Promise<Map<string, QueriesPatchOp>> {
    const existingQueryHashes = new Set<string>();
    const prefix = desiredQueriesPrefixForClient(this.#clientID);
    for await (const key of tx.scan({prefix}).keys()) {
      existingQueryHashes.add(key.substring(prefix.length, key.length));
    }
    const patch: Map<string, QueriesPatchOp> = new Map();
    for (const hash of existingQueryHashes) {
      if (!this.#queries.has(hash)) {
        patch.set(hash, {op: 'del', hash});
      }
    }
    for (const [hash, {normalized}] of this.#queries) {
      if (!existingQueryHashes.has(hash)) {
        patch.set(hash, {op: 'put', hash, ast: normalized});
      }
    }

    if (lastPatch) {
      // if there are any `puts` in `lastPatch` that are not in `patch` then we need to
      // send a `del` event in `patch`.
      for (const [hash, {op}] of lastPatch) {
        if (op === 'put' && !patch.has(hash)) {
          patch.set(hash, {op: 'del', hash});
        }
      }
      // Remove everything from `patch` that was already sent in `lastPatch`.
      for (const [hash, {op}] of patch) {
        const lastPatchOp = lastPatch.get(hash);
        if (lastPatchOp && lastPatchOp.op === op) {
          patch.delete(hash);
        }
      }
    }

    return patch;
  }

  add(ast: AST, gotCallback?: GotCallback | undefined): () => void {
    const normalized = normalizeAST(ast);
    const astHash = hashOfAST(normalized);
    let entry = this.#queries.get(astHash);
    this.#recentQueries.delete(astHash);

    if (!entry) {
      // TODO: would be nice if we could constrain the first arg to preload queries only
      const covering = findCover(this.#queriesByTable, normalized);
      if (covering !== undefined) {
        if (gotCallback && this.#gotQueries.has(covering.hash)) {
          this.#gotQueries.add(astHash);
          gotCallback(true);
        }

        return () => {
          // TODO: if our covering query is removed we need to mark this query as no longer `got`.
          // This breaks our contract since queries should not go from `got` to `not got`.
          // We would need to have the server track covering queries to prevent this.
          this.#gotQueries.delete(astHash);
        };
      }

      entry = {
        normalized,
        count: 1,
        gotCallbacks: gotCallback === undefined ? [] : [gotCallback],
      };
      this.#set(astHash, entry);
      this.#send([
        'changeDesiredQueries',
        {
          desiredQueriesPatch: [{op: 'put', hash: astHash, ast: normalized}],
        },
      ]);
    } else {
      ++entry.count;
      if (gotCallback) {
        entry.gotCallbacks.push(gotCallback);
      }
    }

    if (gotCallback) {
      gotCallback(this.#gotQueries.has(astHash));
    }

    let removed = false;
    return () => {
      if (removed) {
        return;
      }
      removed = true;
      this.#remove(astHash, gotCallback);
    };
  }

  #set(astHash: string, entry: QueryEntry) {
    this.#queries.set(astHash, entry);
    let existing = this.#queriesByTable.get(entry.normalized.table);
    if (!existing) {
      existing = new Map();
      this.#queriesByTable.set(entry.normalized.table, existing);
    }
    existing.set(astHash, entry);
  }

  #remove(astHash: string, gotCallback: GotCallback | undefined) {
    const entry = must(this.#queries.get(astHash));
    if (gotCallback) {
      const index = entry.gotCallbacks.indexOf(gotCallback);
      entry.gotCallbacks.splice(index, 1);
    }
    --entry.count;
    if (entry.count === 0) {
      this.#recentQueries.add(astHash);
      if (this.#recentQueries.size > this.#recentQueriesMaxSize) {
        const lruAstHash = this.#recentQueries.values().next().value;
        assert(lruAstHash);
        this.#queries.delete(lruAstHash);
        this.#queriesByTable.get(entry.normalized.table)?.delete(lruAstHash);
        this.#recentQueries.delete(lruAstHash);

        // TODO: find out if we uncovered any queries and add those to the patch.
        // or.. if the server is tracking covering queries then we don't need to do this.
        // The server probably does need to track covering queries as mentioned in the earlier TODO

        this.#send([
          'changeDesiredQueries',
          {
            desiredQueriesPatch: [{op: 'del', hash: lruAstHash}],
          },
        ]);
      }
    }
  }
}

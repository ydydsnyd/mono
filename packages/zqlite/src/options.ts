import type {ReadonlyJSONObject} from 'shared/src/json.js';
import type {QueryDefs} from 'zero-client/src/client/zero.js';
import type {Database} from 'better-sqlite3';

export type QueryParseDefs<QD extends QueryDefs> = {
  readonly [K in keyof QD]: (value: ReadonlyJSONObject) => QD[K];
};

/**
 * Configuration for [[Zero]].
 */
export interface ZqlLiteZeroOptions<QD extends QueryDefs> {
  queries?: QueryParseDefs<QD> | undefined;
  db: Database;
}

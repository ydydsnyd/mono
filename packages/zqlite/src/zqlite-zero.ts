import {EntityQuery, FromSet} from 'zql/src/zql/query/entity-query.js';
import type {Entity} from 'zql/src/zql/schema/entity-schema.js';
import type {QueryParseDefs, ZqlLiteZeroOptions} from './options.js';
import type {Context as ZQLContext} from 'zql/src/zql/context/context.js';
import {createContext} from './context.js';
import {ZQLite} from './ZQLite.js';
import type {MaybePromise} from 'shared/src/types.js';
import type {ReadonlyJSONObject} from 'shared/src/json.js';
import type {
  CRUDOp,
  CRUDOpKind,
  CreateOp,
  DeleteOp,
  SetOp,
  UpdateOp,
} from 'zero-protocol/src/push.js';
import type {Database} from 'better-sqlite3';

export type Parse<E extends Entity> = (v: ReadonlyJSONObject) => E;
export type Update<E extends Entity> = Entity & Partial<E>;
export type QueryDefs = {
  readonly [name: string]: Entity;
};

type MakeEntityQueriesFromQueryDefs<QD extends QueryDefs> = {
  readonly [K in keyof QD]: EntityQuery<{[P in K]: QD[K]}, []>;
};

export type MakeCRUDMutate<QD extends QueryDefs> = BaseCRUDMutate<QD> &
  CRUDBatch<QD>;

export type BaseCRUDMutate<QD extends QueryDefs> = {
  [K in keyof QD]: EntityCRUDMutate<QD[K]>;
};

/**
 * This is the type of the generated mutate.<name>.<verb> function.
 */
type EntityCRUDMutate<E extends Entity> = {
  create: (value: E) => Promise<void>;
  set: (value: E) => Promise<void>;
  update: (value: Update<E>) => Promise<void>;
  delete: (value: E) => Promise<void>;
};

export type CRUDBatch<QD extends QueryDefs> = <R>(
  body: (m: BaseCRUDMutate<QD>) => MaybePromise<R>,
) => Promise<R>;

export class ZqlLiteZero<QD extends QueryDefs> {
  readonly zqlContext: ZQLContext;
  readonly query: MakeEntityQueriesFromQueryDefs<QD>;
  readonly zqlLite: ZQLite;
  readonly mutate: MakeCRUDMutate<QD>;

  constructor(options: ZqlLiteZeroOptions<QD>) {
    const {queries = {} as QueryParseDefs<QD>, db} = options;
    this.zqlLite = new ZQLite(db);
    this.zqlContext = createContext(this.zqlLite, db);
    this.query = this.#registerQueries(queries);
    this.mutate = this.#makeCRUDMutate<QD>(queries, db);
  }

  #registerQueries(
    queryDefs: QueryParseDefs<QD>,
  ): MakeEntityQueriesFromQueryDefs<QD> {
    const rv = {} as Record<string, EntityQuery<FromSet, []>>;
    const context = this.zqlContext;
    // Not using parse yet
    for (const name of Object.keys(queryDefs)) {
      rv[name] = new EntityQuery(context, name);
    }
    return rv as MakeEntityQueriesFromQueryDefs<QD>;
  }

  #makeCRUDMutate<QD extends QueryDefs>(
    queries: QueryParseDefs<QD>,
    db: Database,
  ): MakeCRUDMutate<QD> {
    let inBatch = false;

    const mutate = async <R>(
      body: (m: BaseCRUDMutate<QD>) => R,
    ): Promise<R> => {
      if (inBatch) {
        throw new Error('Cannot call mutate inside a batch');
      }
      inBatch = true;

      try {
        const ops: CRUDOp[] = [];
        const m = {} as Record<string, unknown>;
        for (const name of Object.keys(queries)) {
          m[name] = this.makeBatchCRUDMutate(name, ops);
        }

        const rv = await body(m as BaseCRUDMutate<QD>);
        //await zeroCRUD({ops});
        return rv;
      } finally {
        inBatch = false;
      }
    };

    const assertNotInBatch = (entityType: string, op: CRUDOpKind) => {
      if (inBatch) {
        throw new Error(
          `Cannot call mutate.${entityType}.${op} inside a batch`,
        );
      }
    };

    for (const name of Object.keys(queries)) {
      (mutate as unknown as Record<string, EntityCRUDMutate<Entity>>)[name] =
        this.makeEntityCRUDMutate(name, db, assertNotInBatch);
    }
    return mutate as MakeCRUDMutate<QD>;
  }

  /**
   * Creates the `{create, set, update, delete}` object for use inside a batch.
   */
  makeBatchCRUDMutate<E extends Entity>(
    entityType: string,
    ops: CRUDOp[],
  ): EntityCRUDMutate<E> {
    return {
      create: (value: E) => {
        const {id} = value;
        const op: CreateOp = {
          op: 'create',
          entityType,
          id: {id},
          value,
        };
        ops.push(op);
        return Promise.resolve();
      },
      set: (value: E) => {
        const {id} = value;
        const op: SetOp = {
          op: 'set',
          entityType,
          id: {id},
          value,
        };
        ops.push(op);
        return Promise.resolve();
      },
      update: (value: Update<E>) => {
        const {id} = value;
        const op: UpdateOp = {
          op: 'update',
          entityType,
          id: {id},
          partialValue: value,
        };
        ops.push(op);
        return Promise.resolve();
      },
      delete: (value: E) => {
        const {id} = value;
        const op: DeleteOp = {
          op: 'delete',
          entityType,
          id: {id},
        };
        ops.push(op);
        return Promise.resolve();
      },
    };
  }

  makeEntityCRUDMutate<E extends Entity>(
    entityType: string,
    db: Database,
    assertNotInBatch: (entityType: string, op: CRUDOpKind) => void,
  ): EntityCRUDMutate<E> {
    return {
      create: async (value: E) => {
        assertNotInBatch(entityType, 'create');
        const {id, ...rest} = value;
        const columns = Object.keys(rest).join(', ');
        const placeholders = Object.keys(rest)
          .map(() => '?')
          .join(', ');
        const stmt = db.prepare(
          `INSERT INTO ${entityType} (id, ${columns}) VALUES (?, ${placeholders})`,
        );
        await stmt.run(id, ...Object.values(rest));
      },
      set: async (value: E) => {
        assertNotInBatch(entityType, 'set');
        const {id, ...rest} = value;
        const columns = Object.keys(rest)
          .map(col => `${col} = ?`)
          .join(', ');
        const stmt = db.prepare(
          `REPLACE INTO ${entityType} SET id = ?, ${columns}`,
        );
        await stmt.run(id, ...Object.values(rest));
      },
      update: async (value: Update<E>) => {
        assertNotInBatch(entityType, 'update');
        const {id, ...rest} = value;
        const columns = Object.keys(rest)
          .map(col => `${col} = ?`)
          .join(', ');
        const stmt = db.prepare(
          `UPDATE ${entityType} SET ${columns} WHERE id = ?`,
        );
        await stmt.run(...Object.values(rest), id);
      },
      delete: async (value: E) => {
        assertNotInBatch(entityType, 'delete');
        const stmt = db.prepare(`DELETE FROM ${entityType} WHERE id = ?`);
        await stmt.run(value.id);
      },
    };
  }
}

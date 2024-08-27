import type {ZqlLiteZeroOptions} from './options.js';
import {
  BaseCRUDMutate,
  EntityCRUDMutate,
  makeBatchCRUDMutate,
  MakeCRUDMutate,
  Update,
} from 'zero-client/src/client/crud.js';
import type {CRUDOp, CRUDOpKind} from 'zero-protocol/src/push.js';
import type {Database} from 'better-sqlite3';
import type {EntityID} from 'zero-protocol/src/entity.js';
import {
  QueryDefs,
  MakeEntityQueriesFromQueryDefs,
} from 'zero-client/src/client/zero.js';
import {Host} from 'zql/src/zql/builder/builder.js';
import {SubscriptionDelegate} from 'zql/src/zql/context/context.js';
import {Query} from 'zero-client/src/mod.js';
import {Schema} from 'zql/src/zql/query2/schema.js';
import {newQuery} from 'zql/src/zql/query2/query-impl.js';
import {Row} from 'zql/src/zql/ivm2/data.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any;
export class ZqlLiteZero<QD extends QueryDefs> {
  readonly zqlContext: Host & SubscriptionDelegate;
  readonly query: MakeEntityQueriesFromQueryDefs<QD>;
  readonly mutate: MakeCRUDMutate<QD>;
  db: Database;

  constructor(options: ZqlLiteZeroOptions<QD>) {
    const {schemas = {} as QD, db} = options;
    this.db = db;
    this.zqlContext = {} as TODO;
    this.query = this.#registerQueries(schemas);
    this.mutate = this.#makeCRUDMutate<QD>(schemas, db);
  }

  #registerQueries(schemas: QD): MakeEntityQueriesFromQueryDefs<QD> {
    const rv = {} as Record<string, Query<Schema>>;
    const context = this.zqlContext;
    // Not using parse yet
    for (const [name, schema] of Object.entries(schemas)) {
      rv[name] = newQuery(context, schema);
    }
    return rv as MakeEntityQueriesFromQueryDefs<QD>;
  }

  #makeCRUDMutate<QD extends QueryDefs>(
    schemas: QD,
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
        for (const name of Object.keys(schemas)) {
          m[name] = makeBatchCRUDMutate(name, ops);
        }

        const rv = await body(m as BaseCRUDMutate<QD>);
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

    for (const name of Object.keys(schemas)) {
      (mutate as unknown as Record<string, EntityCRUDMutate<Row>>)[name] =
        this.makeEntityCRUDMutate(name, db, assertNotInBatch);
    }
    return mutate as MakeCRUDMutate<QD>;
  }

  makeEntityCRUDMutate<E extends Row>(
    entityType: string,
    db: Database,
    assertNotInBatch: (entityType: string, op: CRUDOpKind) => void,
  ): EntityCRUDMutate<E> {
    return {
      create: async (value: E) => {
        assertNotInBatch(entityType, 'create');
        const existingEntity = await db
          .prepare(`SELECT * FROM ${entityType} WHERE id = ?`)
          .get(value.id);
        if (existingEntity) return;
        //console.log('Adding', value);
        await this.zqlContext.getSource(entityType).push({
          type: 'add',
          row: value,
        });
      },
      set: async (value: E) => {
        assertNotInBatch(entityType, 'set');
        await this.zqlContext.getSource(entityType).push({
          type: 'add',
          row: value,
        });
      },
      update: async (value: Update<E>) => {
        assertNotInBatch(entityType, 'update');
        const existingEntity = await db
          .prepare(`SELECT * FROM ${entityType} WHERE id = ?`)
          .get(value.id);
        if (!existingEntity)
          throw new Error(`Entity with id ${value.id} not found`);
        const mergedValue = {...existingEntity, ...value};
        await this.zqlContext
          .getSource(entityType)
          .push({type: 'remove', row: existingEntity});
        await this.zqlContext
          .getSource(entityType)
          .push({type: 'add', row: mergedValue});
      },
      delete: async (id: EntityID) => {
        assertNotInBatch(entityType, 'delete');
        const existingEntity = await db
          .prepare(`SELECT * FROM ${entityType} WHERE id = ?`)
          .get(id);
        if (!existingEntity) throw new Error(`Entity with id ${id} not found`);
        await this.zqlContext
          .getSource(entityType)
          .push({type: 'remove', row: existingEntity});
      },
    };
  }
}

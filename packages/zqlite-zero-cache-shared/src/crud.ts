import type {Entity} from 'zql/src/zql/schema/entity-schema.js';
import type {ReadonlyJSONObject} from 'shared/src/json.js';
import type {EntityID} from 'zero-protocol/src/entity.js';
import type {
  CreateOp,
  CRUDOp,
  CRUDOpKind,
  DeleteOp,
  SetOp,
  UpdateOp,
} from 'zero-protocol/src/push.js';
import type {MaybePromise} from 'shared/src/types.js';
import type {EntityQuery} from 'zql/src/zql/query/entity-query.js';
import {promiseVoid} from 'shared/src/resolved-promises.js';

export type Parse<E extends Entity> = (v: ReadonlyJSONObject) => E;
export type Update<E extends Entity> = Entity & Partial<E>;
export type QueryDefs = {
  readonly [name: string]: Entity;
};

export interface EntityCRUDMutate<E extends Entity> {
  create: (value: E) => Promise<void>;
  set: (value: E) => Promise<void>;
  update: (value: Update<E>) => Promise<void>;
  delete: (id: EntityID) => Promise<void>;
}

export type AssertNotInBatchFn = (entityType: string, op: CRUDOpKind) => void;

export type MakeEntityQueriesFromQueryDefs<QD extends QueryDefs> = {
  readonly [K in keyof QD]: EntityQuery<{[P in K]: QD[K]}, []>;
};

export type BaseCRUDMutate<QD extends QueryDefs> = {
  [K in keyof QD]: EntityCRUDMutate<QD[K]>;
};

export type CRUDBatch<QD extends QueryDefs> = <R>(
  body: (m: BaseCRUDMutate<QD>) => MaybePromise<R>,
) => Promise<R>;

export type MakeCRUDMutate<QD extends QueryDefs> = BaseCRUDMutate<QD> &
  CRUDBatch<QD>;

/**
 * Creates the `{create, set, update, delete}` object for use inside a batch.
 */
export function makeBatchCRUDMutate<E extends Entity>(
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
      return promiseVoid;
    },
    set: (value: E) => {
      const {id} = value;
      const op: SetOp = {op: 'set', entityType, id: {id}, value};
      ops.push(op);
      return promiseVoid;
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
      return promiseVoid;
    },
    delete: (id: EntityID) => {
      const op: DeleteOp = {op: 'delete', entityType, id};
      ops.push(op);
      return promiseVoid;
    },
  };
}

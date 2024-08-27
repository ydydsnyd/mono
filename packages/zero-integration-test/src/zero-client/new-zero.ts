import {QueryDefs, Zero} from 'zero-client';
import {nanoid} from 'zero-client/src/util/nanoid.js';

export function newZero<QD extends QueryDefs>(schemas: QD): Zero<QD> {
  const z = new Zero({
    userID: 'user-' + nanoid(),
    schemas,
  });
  return z;
}

export type Z = ReturnType<typeof newZero>;

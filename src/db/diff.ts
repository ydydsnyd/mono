import type {Hash} from '../hash.js';
import type * as dag from '../dag/mod.js';
import type {DiffsMap} from '../sync/mod.js';
import {fromHash} from './commit.js';
import {diff as btreeDiff} from '../btree/diff';
import {allEntriesAsDiff, BTreeRead} from '../btree/read.js';
import {readIndexesForRead} from './read.js';
import type {InternalDiff} from '../btree/node.js';

/**
 * Diffs the state of the db at two different hashes.
 * It will include the primary indexes as well as all the secondary indexes.
 */
export async function diff(
  oldHash: Hash,
  newHash: Hash,
  read: dag.Read,
): Promise<DiffsMap> {
  const diffMap = new Map();

  const maybeAddToDiffs = (name: string, indexDiff: InternalDiff) => {
    if (indexDiff.length > 0) {
      diffMap.set(name, indexDiff);
    }
  };

  const [oldCommit, newCommit] = await Promise.all([
    fromHash(oldHash, read),
    fromHash(newHash, read),
  ]);

  const oldMap = new BTreeRead(read, oldCommit.valueHash);
  const newMap = new BTreeRead(read, newCommit.valueHash);
  const valueDiff = await btreeDiff(oldMap, newMap);
  maybeAddToDiffs('', valueDiff);

  const oldIndexes = readIndexesForRead(oldCommit, read);
  const newIndexes = readIndexesForRead(newCommit, read);

  // These can be done in parallel too but at this point we run this on the
  // memdag so it really has no benefit, and it makes the code harder to read.
  for (const [name, oldIndex] of oldIndexes) {
    const newIndex = newIndexes.get(name);
    if (!newIndex) {
      await allEntriesAsDiff(oldIndex.map, 'del');
    } else {
      const indexDiff = await btreeDiff(oldIndex.map, newIndex.map);
      maybeAddToDiffs(name, indexDiff);
    }
    newIndexes.delete(name);
  }

  for (const [name, newIndex] of newIndexes) {
    const indexDiff = await allEntriesAsDiff(newIndex.map, 'add');
    maybeAddToDiffs(name, indexDiff);
  }

  return diffMap;
}

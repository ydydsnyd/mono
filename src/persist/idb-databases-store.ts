import {assert, assertNumber, assertObject, assertString} from '../asserts';
import * as kv from '../kv/mod';

export const IDB_DATABASES_DB_NAME = 'replicache-dbs';
const KEY = 'dbs';

// TODO: make an opaque type
export type IndexedDBName = string;

export type IndexedDBDatabase = {
  name: IndexedDBName;
  replicacheFormatVersion: number;
  schemaVersion: string;
};

export type IndexedDBDatabaseRecord = Record<IndexedDBName, IndexedDBDatabase>;

function assertIndexedDBDatabaseRecord(
  value: unknown,
): asserts value is IndexedDBDatabaseRecord {
  assertObject(value);
  for (const [name, db] of Object.entries(value)) {
    assertString(name);
    assertIndexedDBDatabase(db);
    assert(name === db.name);
  }
}

function assertIndexedDBDatabase(
  value: unknown,
): asserts value is IndexedDBDatabase {
  assertObject(value);
  assertString(value.name);
  assertNumber(value.replicacheFormatVersion);
  assertString(value.schemaVersion);
}

export class IDBDatabasesStore {
  private readonly _kvStore: kv.Store;

  constructor(
    createKVStore: (name: string) => kv.Store = name => new kv.IDBStore(name),
  ) {
    this._kvStore = createKVStore(IDB_DATABASES_DB_NAME);
  }

  putDatabase(db: IndexedDBDatabase): Promise<IndexedDBDatabaseRecord> {
    return this._kvStore.withWrite(async write => {
      const dbRecord = await this._getDatabases(write);
      dbRecord[db.name] = db;
      await write.put(KEY, dbRecord);
      await write.commit();
      return dbRecord;
    });
  }

  clear(): Promise<void> {
    return this._kvStore.withWrite(async write => {
      await write.del(KEY);
      await write.commit();
    });
  }

  getDatabases(): Promise<IndexedDBDatabaseRecord> {
    return this._kvStore.withRead(async read => this._getDatabases(read));
  }

  close(): Promise<void> {
    return this._kvStore.close();
  }

  private async _getDatabases(read: kv.Read): Promise<IndexedDBDatabaseRecord> {
    let dbRecord = await read.get(KEY);
    if (!dbRecord) {
      dbRecord = {};
    }
    assertIndexedDBDatabaseRecord(dbRecord);
    return dbRecord;
  }
}

import Database from 'better-sqlite3';

export class DB {
  readonly transaction: Database.Database['transaction'];
  readonly prepare: Database.Database['prepare'];
  readonly #db: Database.Database;
  readonly #beginStmt: Database.Statement;
  readonly #commitStmt: Database.Statement;
  readonly #rollbackStmt: Database.Statement;

  constructor(sqliteDbPath: string) {
    this.#db = DB.open(sqliteDbPath);
    this.transaction = this.#db.transaction.bind(this.#db);
    this.prepare = this.#db.prepare.bind(this.#db);

    this.#beginStmt = this.#db.prepare('BEGIN');
    this.#commitStmt = this.#db.prepare('COMMIT');
    this.#rollbackStmt = this.#db.prepare('ROLLBACK');
  }

  get db(): Database.Database {
    return this.#db;
  }

  static ensureSchema(db: Database.Database) {
    db.exec(/*sql*/ `CREATE TABLE IF NOT EXISTS _zero_metadata (
        key TEXT PRIMARY KEY,
        value TEXT
      );`);
    db.exec(/*sql*/ `CREATE TABLE IF NOT EXISTS _zero_clients (
      "clientGroupID"  TEXT NOT NULL,
      "clientID"       TEXT NOT NULL,
      "lastMutationID" INTEGER,
      "userID"         TEXT,
      PRIMARY KEY ("clientGroupID", "clientID")
    )`);
  }

  static open(sqliteDbPath: string): Database.Database {
    const db = new Database(sqliteDbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    DB.ensureSchema(db);
    return db;
  }

  beginImperativeTransaction() {
    this.#beginStmt.run();
  }

  commitImperativeTransaction() {
    this.#commitStmt.run();
  }

  rollbackImperativeTransaction() {
    this.#rollbackStmt.run();
  }
}

export const queries = {
  setCommittedLsn: /*sql*/ `INSERT OR REPLACE INTO _zero_metadata (key, value) VALUES ('committed-lsn', ?);`,
  setIvmLsn: /*sql*/ `INSERT OR REPLACE INTO _zero_metadata (key, value) VALUES ('ivm-lsn', ?);`,
  getCommittedLsn: /*sql*/ `SELECT value FROM _zero_metadata WHERE key = 'committed-lsn';`,
  getIvmLsn: /*sql*/ `SELECT value FROM _zero_metadata WHERE key = 'ivm-lsn';`,
};

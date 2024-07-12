import {
  LogicalReplicationService,
  Pgoutput,
  PgoutputPlugin,
} from 'pg-logical-replication';
import fs from 'fs';
import type {LogContext} from '@rocicorp/logger';
import {PUBLICATION_NAME, SLOT_NAME} from '../consts.js';
import {copy} from './initial-sync.js';
import {MessageProcessor} from './message-processor.js';
import {DB} from '../internal/db.js';
import type {ServiceProvider} from '../services/service-provider.js';
import type {Materialite} from 'zql/src/zql/ivm/materialite.js';
import {createContext} from '../context.js';

/**
 * The replicator attaches to the Postgres replication slot and listens for changes.
 *
 * Those changes are applied to the SQLite DB in a 1:1 mapping. 1 PG transaction -> 1 SQLite transaction.
 * 1 PG write -> 1 SQLite write.
 *
 * The changes are also accumulated, formatted into difference events, and pushed down the IVM pipelines.
 */
export class Replicator {
  readonly #pgConnectionString: string;
  readonly #sqliteDbPath: string;
  readonly #materialite: Materialite;
  #replicationService: LogicalReplicationService | undefined;

  constructor(
    materialite: Materialite,
    pgConnectionString: string,
    sqliteDbPath: string,
  ) {
    this.#pgConnectionString = pgConnectionString;
    this.#sqliteDbPath = sqliteDbPath;
    this.#materialite = materialite;
  }

  async start(serviceProvider: ServiceProvider, lc: LogContext) {
    try {
      // TODO: the db will alrdy be open? Since we're sharing the same IVM context
      // between `Replicator` and `PipelineManager`
      // So replicator needs to check another way? Or Replicator can return the IVM context!
      await fs.promises.access(this.#sqliteDbPath);
    } catch (e) {
      lc.info?.('Starting initial sync to SQLite');
      await copy(lc, this.#pgConnectionString, this.#sqliteDbPath);
    }

    const db = new DB(this.#sqliteDbPath);

    const replicationService = (this.#replicationService =
      new LogicalReplicationService(
        {connectionString: this.#pgConnectionString},
        {acknowledge: {auto: false, timeoutSeconds: 0}},
      ));

    const ivmContext = createContext(this.#materialite, db.db);
    const messageProcessor = new MessageProcessor(
      serviceProvider,
      ivmContext,
      this.#sqliteDbPath,
    );
    this.#replicationService.on(
      'data',
      (lsn: string, message: Pgoutput.Message) => {
        lc.debug?.('DATA:', lsn, message);
        // TODO: if `processMessage` fails, kill the whole process.
        messageProcessor.processMessage(lc, lsn, message);
      },
    );
    this.#replicationService.on(
      'heartbeat',
      (_lsn: string, _time: number, shouldRespond: boolean) => {
        if (shouldRespond) {
          void replicationService.acknowledge(ivmContext.lsn);
        }
      },
    );

    await this.#replicationService.subscribe(
      new PgoutputPlugin({
        protoVersion: 1,
        publicationNames: [PUBLICATION_NAME],
      }),
      SLOT_NAME,
      ivmContext.lsn,
    );
    lc.info?.('Subscribed to Postgres changes');

    return ivmContext;
  }
}

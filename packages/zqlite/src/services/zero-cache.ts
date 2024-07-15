import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {LogContext, LogLevel, LogSink} from '@rocicorp/logger';
import {handleConnection, Connection} from './duped/connection.js';
import {CONNECT_URL_PATTERN, STATUS_URL_PATTERN} from './duped/paths.js';
import websocket, {WebSocket} from '@fastify/websocket';
import type {DurableStorage} from './duped/durable-storage.js';
import {ServiceProvider} from './service-provider.js';
import {must} from 'shared/src/must.js';

/**
 * Main entrypoint to ZeroCache.
 *
 * Starts up Fastify to accept web-socket connections
 * from clients.
 *
 * One client creates one connection.
 *
 * Client connections are serviced by ViewSyncers where
 * one ViewSyncer is created per client group. Many clients
 * can be a part of the same client group.
 *
 * The ServiceProvider is responsible for creating and
 * managing the lifecycle of ViewSyncers.
 */
export class ZeroCache {
  readonly #lc: LogContext;
  readonly #clientConnections = new Map<string, Connection>();
  readonly #serviceProvider: ServiceProvider;
  #fastify: FastifyInstance;

  constructor(logSink: LogSink, logLevel: LogLevel, state: DurableStorage) {
    const lc = new LogContext(logLevel, undefined, logSink).withContext(
      'component',
      'ServiceRunnerDO',
    );
    this.#lc = lc;

    this.#fastify = Fastify();
    this.#serviceProvider = new ServiceProvider(
      state,
      must(process.env.PG_CONNECTION_STRING),
      must(process.env.SQLITE_DB_PATH),
    );
  }

  #connect = async (socket: WebSocket, request: FastifyRequest) => {
    try {
      handleConnection(
        this.#lc,
        // service-runner will instantiate or return required view-syncer
        this.#serviceProvider,
        this.#clientConnections,
        socket,
        request,
      );
    } catch (error) {
      this.#lc.error?.('Error in connect handler:', error);
      await socket
        .status(500)
        .send(error instanceof Error ? error.message : String(error));
    }
  };

  #status = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      await reply.send(JSON.stringify({status: 'OK'}));
    } catch (error) {
      this.#lc.error?.('Error in status handler:', error);
      await reply
        .status(500)
        .send(error instanceof Error ? error.message : String(error));
    }
  };

  async start() {
    this.#lc.debug?.('Starting ZeroCache');
    const lc = this.#lc.withContext('component', 'serviceProvider');
    await this.#serviceProvider.start(lc);

    this.#lc.debug?.('Registering websocket');
    await this.#fastify.register(websocket);
    this.#lc.debug?.('Registered websocket');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#fastify.get(CONNECT_URL_PATTERN, {websocket: true}, this.#connect);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.#fastify.get(STATUS_URL_PATTERN, this.#status);

    this.#lc.debug?.('Registered routes');
    this.#fastify.listen({port: 3000}, (err, address) => {
      if (err) {
        this.#lc.error?.('Error starting server:', err);
        process.exit(1);
      }
      this.#lc.info?.(`Server listening at ${address}`);
    });
  }
}

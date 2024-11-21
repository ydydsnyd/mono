import {LogContext} from '@rocicorp/logger';
import {resolver} from '@rocicorp/resolver';
import assert from 'assert';
import {jwtVerify, type JWTPayload} from 'jose';
import {pid} from 'process';
import {MessagePort} from 'worker_threads';
import {WebSocketServer, type WebSocket} from 'ws';
import {must} from '../../../shared/src/must.js';
import {promiseVoid} from '../../../shared/src/resolved-promises.js';
import {type ZeroConfig} from '../config/zero-config.js';
import type {ConnectParams} from '../services/dispatcher/connect-params.js';
import {installWebSocketReceiver} from '../services/dispatcher/websocket-handoff.js';
import type {Mutagen} from '../services/mutagen/mutagen.js';
import type {ReplicaState} from '../services/replicator/replicator.js';
import {ServiceRunner} from '../services/runner.js';
import type {
  ActivityBasedService,
  Service,
  SingletonService,
} from '../services/service.js';
import {DrainCoordinator} from '../services/view-syncer/drain-coordinator.js';
import type {ViewSyncer} from '../services/view-syncer/view-syncer.js';
import type {Worker} from '../types/processes.js';
import {Subscription} from '../types/subscription.js';
import {Connection, sendError} from './connection.js';
import {createNotifierFrom, subscribeTo} from './replicator.js';
import {ErrorKind} from '../../../zero-protocol/src/error.js';
import {AuthError} from '../auth/error.js';

export type SyncerWorkerData = {
  replicatorPort: MessagePort;
};

/**
 * The Syncer worker receives websocket handoffs for "/sync" connections
 * from the Dispatcher in the main thread, and creates websocket
 * {@link Connection}s with a corresponding {@link ViewSyncer}, {@link Mutagen},
 * and {@link Subscription} to version notifications from the Replicator
 * worker.
 */
export class Syncer implements SingletonService {
  readonly id = `syncer-${pid}`;
  readonly #lc: LogContext;
  readonly #viewSyncers: ServiceRunner<ViewSyncer & ActivityBasedService>;
  readonly #mutagens: ServiceRunner<Mutagen & Service>;
  readonly #connections = new Map<string, Connection>();
  readonly #drainCoordinator = new DrainCoordinator();
  readonly #parent: Worker;
  readonly #wss: WebSocketServer;
  readonly #stopped = resolver();
  readonly #config: ZeroConfig;
  #jwtSecretBytes: Uint8Array | undefined;

  constructor(
    lc: LogContext,
    config: ZeroConfig,
    viewSyncerFactory: (
      id: string,
      sub: Subscription<ReplicaState>,
      drainCoordinator: DrainCoordinator,
      token: JWTPayload | undefined,
    ) => ViewSyncer & ActivityBasedService,
    mutagenFactory: (
      id: string,
      token: JWTPayload | undefined,
    ) => Mutagen & Service,
    parent: Worker,
  ) {
    this.#config = config;
    // Relays notifications from the parent thread subscription
    // to ViewSyncers within this thread.
    const notifier = createNotifierFrom(lc, parent);
    subscribeTo(lc, parent);

    this.#lc = lc;
    this.#viewSyncers = new ServiceRunner(
      lc,
      (id, token) =>
        viewSyncerFactory(
          id,
          notifier.subscribe(),
          this.#drainCoordinator,
          token,
        ),
      v => v.keepalive(),
    );
    this.#mutagens = new ServiceRunner(lc, mutagenFactory, mutagen =>
      mutagen.isStopped(),
    );
    this.#parent = parent;
    this.#wss = new WebSocketServer({noServer: true});

    if (config.jwtSecret) {
      this.#jwtSecretBytes = new TextEncoder().encode(config.jwtSecret);
    }

    installWebSocketReceiver(this.#wss, this.#createConnection, this.#parent);
  }

  readonly #createConnection = async (ws: WebSocket, params: ConnectParams) => {
    const {clientID, clientGroupID, auth, userID} = params;
    const existing = this.#connections.get(clientID);
    if (existing) {
      existing.close();
    }

    let decodedToken: JWTPayload | undefined;
    if (auth) {
      try {
        decodedToken = await decodeAndCheckToken(
          auth,
          this.#jwtSecretBytes,
          userID,
        );
      } catch (e) {
        const msg = 'Failed to decode auth token';
        sendError(this.#lc, ws, ['error', ErrorKind.AuthInvalidated, msg]);
        ws.close(3000, msg);
        return;
      }
    }

    try {
      const tokenData =
        auth === undefined || decodedToken === undefined
          ? undefined
          : {
              raw: auth,
              decoded: decodedToken,
            };
      const [viewSyncer, mutagen] = await Promise.all([
        this.#viewSyncers.getService(clientGroupID, tokenData),
        this.#mutagens.getService(clientGroupID, tokenData),
      ]);

      const connection = new Connection(
        this.#lc,
        this.#config,
        viewSyncer,
        mutagen,
        params,
        ws,
        () => {
          if (this.#connections.get(clientID) === connection) {
            this.#connections.delete(clientID);
          }
        },
      );

      viewSyncer.stop;

      viewSyncer.onStop(() => {
        connection.close();
      });
      mutagen.onStop(() => {
        connection.close();
      });

      this.#connections.set(clientID, connection);
      if (params.initConnectionMsg) {
        await connection.handleInitConnection(
          JSON.stringify(params.initConnectionMsg),
        );
      }
    } catch (e) {
      if (e instanceof AuthError) {
        sendError(this.#lc, ws, [
          'error',
          ErrorKind.AuthInvalidated,
          e.message,
        ]);
        ws.close(3000, e.message);
        return;
      }
      throw e;
    }
  };

  run() {
    return this.#stopped.promise;
  }

  /**
   * Graceful shutdown involves shutting down view syncers one at a time, pausing
   * for the duration of view syncer's hydration between each one. This paces the
   * disconnects to avoid creating a backlog of hydrations in the receiving server
   * when the clients reconnect.
   */
  async drain() {
    const start = Date.now();
    this.#lc.info?.(`draining ${this.#viewSyncers.size} view-syncers`);

    this.#drainCoordinator.drainNextIn(0);

    while (this.#viewSyncers.size) {
      await this.#drainCoordinator.forceDrainTimeout;

      // Pick an arbitrary view syncer to force drain.
      for (const vs of this.#viewSyncers.getServices()) {
        this.#lc.debug?.(`draining view-syncer ${vs.id} (forced)`);
        // When this drain or an elective drain completes, the forceDrainTimeout will
        // resolve after the next drain interval.
        void vs.stop();
        break;
      }
    }
    this.#lc.info?.(`finished draining (${Date.now() - start} ms)`);
  }

  stop() {
    this.#wss.close();
    this.#stopped.resolve();
    return promiseVoid;
  }
}

export async function decodeAndCheckToken(
  auth: string,
  secret: Uint8Array | undefined,
  userID: string,
) {
  assert(
    secret,
    'JWT secret was not set in `zero.config`. Set this to the secret that you use to sign JWTs.',
  );
  const decodedToken = (await jwtVerify(auth, secret)).payload;
  must(decodedToken, 'Failed to verify JWT');
  assert(
    decodedToken.sub === userID,
    'JWT subject does not match the userID that Zero was constructed with.',
  );
  assert(decodedToken.iat !== undefined, 'JWT must contain an issue time.');
  return decodedToken;
}

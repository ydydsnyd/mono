import {consoleLogSink, LogContext, TeeLogSink} from '@rocicorp/logger';
import {resolver} from '@rocicorp/resolver';
import {Lock} from '@rocicorp/lock';
import {nanoid} from 'nanoid';
import {
  MutatorDefs,
  Poke,
  PullerResult,
  ReadonlyJSONValue,
  ReadTransaction,
  Replicache,
  ReplicacheOptions,
  ExperimentalWatchNoIndexCallback,
  ExperimentalWatchOptions,
  ExperimentalWatchCallbackForOptions,
} from 'replicache';
import type {Downstream} from '../protocol/down.js';
import type {PingMessage} from '../protocol/ping.js';
import type {PokeBody} from '../protocol/poke.js';
import type {PushBody, PushMessage} from '../protocol/push.js';
import {NullableVersion, nullableVersionSchema} from '../types/version.js';
import {assert} from '../util/asserts.js';
import {sleep} from '../util/sleep.js';
import type {ReflectOptions} from './options.js';
import {Gauge, DID_NOT_CONNECT_VALUE, NopMetrics, Metric} from './metrics.js';
import {send} from '../util/socket.js';
import type {ConnectedMessage} from '../protocol/connected.js';
import {
  castToErrorKind,
  NumericErrorKind,
  errorKindToString,
  ErrorMessage,
} from '../protocol/error.js';

export const enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
}

export const WATCHDOG_INTERVAL_MS = 5000;

/**
 * `onClose` is called when the Reflect instance is closed.
 */
export type OnClose = {
  (ok: true): void;
  (ok: false, kind: string, reason: string): void;
};

export class Reflect<MD extends MutatorDefs> {
  private readonly _rep: Replicache<MD>;
  private readonly _socketOrigin: string;
  readonly userID: string;
  readonly roomID: string;

  // This is a promise because it is waiting for the clientID from the
  // Replicache instance.
  private readonly _l: Promise<LogContext>;

  private readonly _metrics: {
    timeToConnectMs: Gauge;
  };

  // Protects _handlePoke. We need pokes to be serialized, otherwise we
  // can cause out of order poke errors.
  private readonly _pokeLock = new Lock();

  private _lastMutationIDSent = -1;
  private _onPong: () => void = () => undefined;

  /**
   * `onOnlineChange` is called when the Reflect instance's online status
   * changes.
   */
  onOnlineChange: ((online: boolean) => void) | null | undefined = null;

  /**
   * Called when the Reflect instance is closed. This gets called with `ok:
   * true` when the instance is closed normally. It gets called with `ok: false`
   * when the instance is closed due to an unrecoverable error.
   *
   * For example, if the server responds with an `Unauthorized` error the
   * Reflect instance is closed and you will need to create a new one with an
   * updated {@link ReflectOptions.auth} token.
   */
  onClose: OnClose | null | undefined = null;

  private _connectResolver = resolver<WebSocket>();
  private _lastMutationIDReceived = 0;

  protected _socket: WebSocket | undefined = undefined;
  protected _connectionState: ConnectionState = ConnectionState.Disconnected;
  // See comment on _metrics.timeToConnectMs for how _connectingStart is used.
  protected _connectingStart: number | undefined = undefined;

  /**
   * Constructs a new Reflect client.
   */
  constructor(options: ReflectOptions<MD>) {
    if (options.userID === '') {
      throw new Error('ReflectOptions.userID must not be empty.');
    }
    const {socketOrigin} = options;
    if (socketOrigin) {
      if (
        !socketOrigin.startsWith('ws://') &&
        !socketOrigin.startsWith('wss://')
      ) {
        throw new Error(
          "ReflectOptions.socketOrigin must use the 'ws' or 'wss' scheme.",
        );
      }
    }

    this.onOnlineChange = options.onOnlineChange;
    this.onClose = options.onClose;

    const metrics = options.metrics ?? new NopMetrics();
    this._metrics = {
      // timeToConnectMs measures the time from the call to connect() to receiving
      // the 'connected' ws message. We record the DID_NOT_CONNECT_VALUE if the previous
      // connection attempt failed for any reason.
      //
      // We set the gauge using _connectingStart as follows:
      // - _connectingStart is undefined if we are disconnected or connected; it is
      //   defined only in the Connecting state, as a number representing the timestamp
      //   at which we started connecting.
      // - _connectingStart is set to the current time when connect() is called.
      // - When we receive the 'connected' message we record the time to connect and
      //   set _connectingStart to undefined.
      // - If disconnect() is called with a defined _connectingStart then we record
      //   DID_NOT_CONNECT_VALUE and set _connectingStart to undefined.
      //
      // TODO It's clear after playing with the connection code we should encapsulate
      // the ConnectionState along with its state transitions and possibly behavior.
      // In that world the metric gauge(s) and bookkeeping like _connectingStart would
      // be encapsulated with the ConnectionState. This will probably happen as part
      // of https://github.com/rocicorp/reflect-server/issues/255.
      timeToConnectMs: metrics.gauge(Metric.TimeToConnect),
    };
    this._metrics.timeToConnectMs.set(DID_NOT_CONNECT_VALUE);

    const replicacheOptions: ReplicacheOptions<MD> = {
      auth: options.auth,
      schemaVersion: options.schemaVersion,
      logLevel: options.logLevel,
      logSinks: options.logSinks,
      mutators: options.mutators,
      name: `reflect-${options.userID}-${options.roomID}`,
      pusher: (req: Request) => this._pusher(req),
      // TODO: Do we need these?
      // TODO: figure out backoff?
      pushDelay: 0,
      requestOptions: {
        maxDelayMs: 0,
        minDelayMs: 0,
      },
      licenseKey: 'reflect-client-static-key',
    };
    const replicacheInternalOptions = {
      enableLicensing: false,
      enableMutationRecovery: false,
    };

    this._rep = new Replicache({
      ...replicacheOptions,
      ...replicacheInternalOptions,
    });
    this._rep.getAuth = options.getAuth;
    this._socketOrigin = options.socketOrigin;
    this.roomID = options.roomID;
    this.userID = options.userID;
    this._l = getLogContext(options, this._rep);

    void this._watchdog();
  }

  /**
   * The name of the IndexedDB database in which the data of this
   * instance of Reflect is stored.
   */
  get idbName(): string {
    return this._rep.idbName;
  }

  /**
   * The schema version of the data understood by this application.
   * See [[ReflectOptions.schemaVersion]].
   */
  get schemaVersion(): string {
    return this._rep.schemaVersion;
  }

  /**
   * The client ID for this instance of Reflect. Each instance
   * gets a unique client ID.
   */
  get clientID(): Promise<string> {
    return this._rep.clientID;
  }

  /**
   * The authorization token used when opening a WebSocket connection to
   * the Reflect server.
   */
  get auth(): string {
    return this._rep.auth;
  }

  /**
   * The registered mutators (see [[ReflectOptions.mutators]]).
   */
  get mutate() {
    return this._rep.mutate;
  }

  /**
   * Whether this Reflect instance has been closed. Once a Reflect instance has
   * been closed it no longer syncs and you can no longer read or write data out
   * of it. After it has been closed it is pretty much useless and should not be
   * used any more.
   */
  get closed(): boolean {
    return this._rep.closed;
  }

  /**
   * Closes this Reflect instance.
   *
   * When closed all subscriptions end and no more read or writes are allowed.
   */
  async close(): Promise<void> {
    const lc = await this._l;
    const lc2 = this._socket
      ? addWebSocketIDFromSocketToLogContext(this._socket, lc)
      : lc;
    await this._close(lc2, true);
  }

  private async _close(
    lc: LogContext,
    ok: boolean,
    kind?: NumericErrorKind,
    reason?: string,
  ): Promise<void> {
    this._disconnect(lc);
    await this._rep.close();
    if (this.onClose) {
      if (ok) {
        this.onClose(true);
      } else {
        assert(kind !== undefined);
        assert(reason !== undefined);
        this.onClose(false, errorKindToString(kind), reason);
      }
    }
  }

  /**
   * Subscribe to changes to Reflect data. Every time the underlying data
   * changes `body` is called and if the result of `body` changes compared to
   * last time `onData` is called. The function is also called once the first
   * time the subscription is added.
   *
   * This returns a function that can be used to cancel the subscription.
   *
   * If an error occurs in the `body` the `onError` function is called if
   * present. Otherwise, the error is thrown.
   */
  subscribe<R extends ReadonlyJSONValue | undefined>(
    body: (tx: ReadTransaction) => Promise<R>,
    {
      onData,
      onError,
      onDone,
    }: {
      onData: (result: R) => void;
      onError?: (error: unknown) => void;
      onDone?: () => void;
    },
  ): () => void {
    return this._rep.subscribe(body, {
      onData,
      onError,
      onDone,
    });
  }

  /**
   * Transactionally read Reflect data.
   */
  query<R>(body: (tx: ReadTransaction) => Promise<R> | R): Promise<R> {
    return this._rep.query(body);
  }

  /**
   * Watches Reflect for changes.
   *
   * The `callback` gets called whenever the underlying data changes and the
   * `key` changes matches the
   * [[ExperimentalWatchNoIndexOptions|ExperimentalWatchOptions.prefix]]
   * if present. If a change occurs to the data but the change does not impact
   * the key space the callback is not called. In other words, the callback is
   * never called with an empty diff.
   *
   * This gets called after commit (a mutation or a rebase).
   *
   * @experimental This method is under development and its semantics will
   * change.
   */
  experimentalWatch(callback: ExperimentalWatchNoIndexCallback): () => void;
  experimentalWatch<Options extends ExperimentalWatchOptions>(
    callback: ExperimentalWatchCallbackForOptions<Options>,
    options?: Options,
  ): () => void;
  experimentalWatch<Options extends ExperimentalWatchOptions>(
    callback: ExperimentalWatchCallbackForOptions<Options>,
    options?: Options,
  ): () => void {
    return this._rep.experimentalWatch(callback, options);
  }

  private _onMessage = async (e: MessageEvent<string>) => {
    const l = await this._l;
    l.debug?.('received message', e.data);
    if (this.closed) {
      l.debug?.('ignoring message because already closed');
      return;
    }

    const data = JSON.parse(e.data);
    const downMessage = data as Downstream; //downstreamSchema.parse(data);

    switch (downMessage[0]) {
      case 'connected':
        this._handleConnectedMessage(l, downMessage);
        return;

      case 'error':
        this._handleErrorMessage(l, downMessage);

      // eslint does not know about return type never
      // eslint-disable-next-line no-fallthrough
      case 'pong':
        this._onPong();
        return;

      case 'poke':
        void this._handlePoke(l, downMessage[1]);
        return;
    }

    throw new Error(`Unexpected message: ${downMessage}`);
  };

  private _onClose = async (e: CloseEvent) => {
    const lc = addWebSocketIDFromSocketToLogContext(
      e.target as WebSocket,
      await this._l,
    );
    const {code, reason, wasClean} = e;
    const errorKind = castToErrorKind(code);
    if (errorKind) {
      lc.error?.(
        'Got socket close event with error',
        errorKindToString(errorKind),
        {
          code,
          reason,
          wasClean,
        },
      );
      // We close in case we got an error during the WebSocket close.
      await this._close(lc, false, errorKind, reason);
    } else {
      lc.info?.('Got socket close event', {code, reason, wasClean});
      // Otherwise we disconnect and rely on the watchdog to reconnect.
      this._disconnect(lc);
    }
  };

  private _handleErrorMessage(
    lc: LogContext,
    downMessage: ErrorMessage,
  ): never {
    const s = `${errorKindToString(downMessage[1])}: ${downMessage[2]}}`;
    lc.error?.(s);
    throw new Error(s);
  }

  private _handleConnectedMessage(
    lc: LogContext,
    downMessage: ConnectedMessage,
  ) {
    lc = addWebSocketIDToLogContext(downMessage[1].wsid, lc);
    lc.info?.('Connected', {
      navigatorOnline: navigator.onLine,
    });

    this._connectionState = ConnectionState.Connected;
    if (this._connectingStart === undefined) {
      lc.error?.(
        'Got connected message but connect start time is undefined. This should not happen.',
      );
    } else {
      this._metrics.timeToConnectMs.set(Date.now() - this._connectingStart);
      this._connectingStart = undefined;
    }

    this._lastMutationIDSent = -1;
    assert(this._socket);
    this._connectResolver.resolve(this._socket);
    this.onOnlineChange?.(true);
  }

  /**
   * _connect will throw an assertion error if the _connectionState is not
   * Disconnected. Callers MUST check the connection state before calling this
   * method and log an error as needed.
   */
  private async _connect(l: LogContext) {
    // All the callers check this state already.
    assert(this._connectionState === ConnectionState.Disconnected);

    const wsid = nanoid();
    l = addWebSocketIDToLogContext(wsid, l);
    l.info?.('Connecting...', {navigatorOnline: navigator.onLine});

    this._connectionState = ConnectionState.Connecting;
    if (this._connectingStart !== undefined) {
      l.error?.(
        'connect() called but connect start time is defined. This should not happen.',
      );
    }
    this._connectingStart = Date.now();

    const baseCookie = await getBaseCookie(this._rep);

    // TODO if connection fails with 401 use this._rep.getAuth to
    // try to refresh this._rep.auth and then retry connection
    const ws = createSocket(
      this._socketOrigin,
      baseCookie,
      await this._rep.clientID,
      this.roomID,
      this._rep.auth,
      this._lastMutationIDReceived,
      wsid,
    );

    ws.addEventListener('message', this._onMessage);
    ws.addEventListener('close', this._onClose);
    this._socket = ws;
  }

  private _disconnect(l: LogContext) {
    l.info?.('disconnecting', {navigatorOnline: navigator.onLine});
    switch (this._connectionState) {
      case ConnectionState.Connected: {
        if (this._connectingStart !== undefined) {
          l.error?.(
            'disconnect() called while connected but connect start time is defined. This should not happen.',
          );
          // this._connectingStart reset below.
        }

        // Only create a new resolver if the one we have was previously resolved,
        // which happens when the socket became connected.
        this._connectResolver = resolver();
        this.onOnlineChange?.(false);
        break;
      }
      case ConnectionState.Connecting: {
        if (this._connectingStart === undefined) {
          l.error?.(
            'disconnect() called while connecting but connect start time is undefined. This should not happen.',
          );
        } else {
          this._metrics.timeToConnectMs.set(DID_NOT_CONNECT_VALUE);
          // this._connectingStart reset below.
        }
        break;
      }
      case ConnectionState.Disconnected: {
        l.error?.('disconnect() called while disconnected');
      }
    }

    this._connectionState = ConnectionState.Disconnected;
    this._connectingStart = undefined;
    this._socket?.removeEventListener('message', this._onMessage);
    this._socket?.removeEventListener('close', this._onClose);
    this._socket?.close();
    this._socket = undefined;
    this._lastMutationIDSent = -1;
  }

  private async _handlePoke(lc: LogContext, pokeBody: PokeBody) {
    await this._pokeLock.withLock(async () => {
      lc = lc.addContext('requestID', pokeBody.requestID);
      lc.debug?.('Applying poke', pokeBody);

      const {lastMutationID, baseCookie, patch, cookie} = pokeBody;
      this._lastMutationIDReceived = lastMutationID;
      const p: Poke = {
        baseCookie,
        pullResponse: {
          lastMutationID,
          patch,
          cookie,
        },
      };

      try {
        await this._rep.poke(p);
      } catch (e) {
        if (String(e).indexOf('unexpected base cookie for poke') > -1) {
          lc.info?.('out of order poke, disconnecting');
          this._disconnect(lc);
          return;
        }
        throw e;
      }
    });
  }

  private async _pusher(req: Request) {
    if (this._connectionState === ConnectionState.Disconnected) {
      // Do not skip await here. We don't want errors to be swallowed.
      await this._connect(await this._l);
    }

    // If we are connecting we wait for the socket to be connected.

    const socket = await this._connectResolver.promise;

    // TODO(arv): With DD31 the Pusher type gets the requestID as an argument.
    const requestID = req.headers.get('X-Replicache-RequestID');
    assert(requestID);

    const pushBody = (await req.json()) as PushBody;

    for (const m of pushBody.mutations) {
      if (m.id > this._lastMutationIDSent) {
        this._lastMutationIDSent = m.id;

        const pushMessage: PushMessage = [
          'push',
          {
            ...pushBody,
            mutations: [m],
            timestamp: performance.now(),
            requestID,
          },
        ];
        send(socket, pushMessage);
      }
    }

    return {
      errorMessage: '',
      httpStatusCode: 200,
    };
  }

  private async _watchdog() {
    const lc = await this._l;
    const getLC = () =>
      this._socket
        ? addWebSocketIDFromSocketToLogContext(this._socket, lc)
        : lc;

    while (!this.closed) {
      try {
        const lc = getLC();
        lc.debug?.('watchdog fired');
        switch (this._connectionState) {
          case ConnectionState.Connected:
            await this._ping(lc);
            break;
          case ConnectionState.Connecting:
            break;
          case ConnectionState.Disconnected:
            await this._connect(lc);
            break;
        }

        await sleep(WATCHDOG_INTERVAL_MS);
      } catch (e) {
        const lc = getLC();
        lc.error?.('watchdog error', e);
      }
    }
  }

  private async _ping(l: LogContext) {
    l.debug?.('pinging');
    const {promise, resolve} = resolver();
    this._onPong = resolve;
    const pingMessage: PingMessage = ['ping', {}];
    const t0 = performance.now();
    assert(this._socket);
    send(this._socket, pingMessage);

    const connected = await Promise.race([
      promise.then(() => true),
      sleep(2000).then(() => false),
    ]);
    if (this._connectionState !== ConnectionState.Connected) {
      return;
    }
    const delta = performance.now() - t0;
    if (connected) {
      l.debug?.('ping succeeded in', delta, 'ms');
    } else {
      l.info?.('ping failed in', delta, 'ms - disconnecting');
      this._disconnect(l);
    }
  }
}

// Total hack to get base cookie
function getBaseCookie(rep: Replicache) {
  const {promise, resolve} = resolver<NullableVersion>();
  rep.puller = async (req): Promise<PullerResult> => {
    const val = await req.json();
    const parsed = nullableVersionSchema.parse(val.cookie);
    resolve(parsed);
    return {
      httpRequestInfo: {
        errorMessage: '',
        httpStatusCode: 200,
      },
    };
  };
  rep.pull();
  return promise;
}

export function createSocket(
  socketOrigin: string,
  baseCookie: NullableVersion,
  clientID: string,
  roomID: string,
  auth: string,
  lmid: number,
  wsid: string,
): WebSocket {
  const url = new URL(socketOrigin);
  url.pathname = '/connect';
  const {searchParams} = url;
  searchParams.set('clientID', clientID);
  searchParams.set('roomID', roomID);
  searchParams.set('baseCookie', baseCookie === null ? '' : String(baseCookie));
  searchParams.set('ts', String(performance.now()));
  searchParams.set('lmid', String(lmid));
  searchParams.set('wsid', wsid);
  // Pass auth to the server via the `Sec-WebSocket-Protocol` header by passing
  // it as a `protocol` to the `WebSocket` constructor.  The empty string is an
  // invalid `protocol`, and will result in an exception, so pass undefined
  // instead.  encodeURIComponent to ensure it only contains chars allowed
  // for a `protocol`.
  return new WebSocket(url, auth === '' ? undefined : encodeURIComponent(auth));
}

async function getLogContext<MD extends MutatorDefs>(
  options: ReflectOptions<MD>,
  rep: Replicache<MD>,
) {
  const {logSinks = [consoleLogSink]} = options;
  const logSink =
    logSinks.length === 1 ? logSinks[0] : new TeeLogSink(logSinks);
  return new LogContext(options.logLevel, logSink)
    .addContext('roomID', options.roomID)
    .addContext('clientID', await rep.clientID);
}

/**
 * Adds the wsid query parameter to the log context. If the URL does not
 * have a wsid we use a randomID instead.
 */
function addWebSocketIDFromSocketToLogContext(
  {url}: {url: string},
  lc: LogContext,
): LogContext {
  const wsid = new URL(url).searchParams.get('wsid') ?? nanoid();
  return addWebSocketIDToLogContext(wsid, lc);
}

function addWebSocketIDToLogContext(wsid: string, lc: LogContext): LogContext {
  return lc.addContext('wsid', wsid);
}

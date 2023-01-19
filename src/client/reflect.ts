import {consoleLogSink, LogContext, TeeLogSink} from '@rocicorp/logger';
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
import {Lock} from '../util/lock.js';
import {resolver} from '../util/resolver.js';
import {sleep} from '../util/sleep.js';
import type {ReflectOptions} from './options.js';
import {
  Gauge,
  DID_NOT_CONNECT_VALUE,
  NopMetrics,
  TIME_TO_CONNECT_METRIC,
} from '../types/metrics.js';
import {send} from '../util/socket.js';

export const enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
}

export const WATCHDOG_INTERVAL_MS = 5000;

export class Reflect<MD extends MutatorDefs> {
  private readonly _rep: Replicache<MD>;
  private readonly _socketOrigin: string;
  readonly userID: string;
  readonly roomID: string;
  private readonly _l: Promise<LogContext>;
  private readonly _metrics: {
    timeToConnectSec: Gauge;
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
  onOnlineChange: ((online: boolean) => void) | null = null;

  private _connectResolver = resolver<WebSocket>();
  private _lastMutationIDReceived = 0;

  protected _WSClass = WebSocket;
  protected _socket: WebSocket | undefined = undefined;
  protected _connectionState: ConnectionState = ConnectionState.Disconnected;
  // See comment on _metrics.timeToConnectSec for how _connectingStart is used.
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

    if (options.onOnlineChange) {
      this.onOnlineChange = options.onOnlineChange;
    }

    const metrics = options.experimentalMetrics ?? new NopMetrics();
    this._metrics = {
      // timeToConnectSec measures the time from the call to connect() to receiving
      // the 'connected' ws message. We record the DID_NOT_CONNECT_VALUE if the previous
      // connection attempt failed for any reason.
      //
      // We set the gauage using _connectingStart as follows:
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
      timeToConnectSec: metrics.gauge(TIME_TO_CONNECT_METRIC),
    };
    this._metrics.timeToConnectSec.set(DID_NOT_CONNECT_VALUE);

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
    this._disconnect(lc2);
    return this._rep.close();
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

    if (downMessage[0] === 'connected') {
      const lc = addWebSocketIDToLogContext(downMessage[1].wsid, l);
      lc.info?.(
        'Connected',
        JSON.stringify({
          navigatorOnline: navigator.onLine,
        }),
      );

      this._connectionState = ConnectionState.Connected;
      if (this._connectingStart === undefined) {
        lc.error?.(
          'Got connected message but connect start time is undefined. This should not happen.',
        );
      } else {
        this._metrics.timeToConnectSec.set(
          (Date.now() - this._connectingStart) / 1000,
        );
        this._connectingStart = undefined;
      }

      this._lastMutationIDSent = -1;
      assert(this._socket);
      this._connectResolver.resolve(this._socket);
      this.onOnlineChange?.(true);
      return;
    }

    if (downMessage[0] === 'error') {
      l.error?.(`Socket error: ${downMessage[1]}`);
      throw new Error(downMessage[1]);
    }

    if (downMessage[0] === 'pong') {
      this._onPong();
      return;
    }

    if (downMessage[0] !== 'poke') {
      throw new Error(`Unexpected message: ${downMessage}`);
    }

    const pokeBody = downMessage[1];
    void this._handlePoke(l, pokeBody);
  };

  private _onClose = async (e: CloseEvent) => {
    const l = addWebSocketIDFromSocketToLogContext(
      e.target as WebSocket,
      await this._l,
    );
    const {code, reason, wasClean} = e;
    l.info?.(
      'got socket close event',
      JSON.stringify({code, reason, wasClean}),
    );
    this._disconnect(l);
  };

  private async _connect(l: LogContext) {
    // TODO seems like we should also skip if this._connectionState === ConnectionState.Connected?
    // Or in other words, return if this._connectionState !== ConnectionState.Disconnected?
    // Seems like we should log an error if _connect() is called when already connected because
    // presumably anything calling connect() should check the connect state beforehand? Or perhaps
    // that check should be here in _connect(), in which case the call sites should stop
    // checking.
    if (this._connectionState === ConnectionState.Connecting) {
      l.debug?.('Skipping duplicate connect request');
      return;
    }

    const wsid = nanoid();
    l = addWebSocketIDToLogContext(wsid, l);
    l.info?.(
      'Connecting...',
      JSON.stringify({navigatorOnline: navigator.onLine}),
    );

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
      this._WSClass,
    );

    ws.addEventListener('message', this._onMessage);
    ws.addEventListener('close', this._onClose);
    this._socket = ws;
  }

  private _disconnect(l: LogContext) {
    l.info?.(
      'disconnecting',
      JSON.stringify({navigatorOnline: navigator.onLine}),
    );
    if (this._connectionState === ConnectionState.Connected) {
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
    } else if (this._connectionState === ConnectionState.Connecting) {
      if (this._connectingStart === undefined) {
        l.error?.(
          'disconnect() called while connecting but connect start time is undefined. This should not happen.',
        );
      } else {
        this._metrics.timeToConnectSec.set(DID_NOT_CONNECT_VALUE);
        // this._connectingStart reset below.
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
      lc.debug?.('Applying poke', JSON.stringify(pokeBody));

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
    // TODO seems like it would be more canonical to check
    // this._connectionState !== ConnectionState.Connected
    // instead of this._socket? There is actually a race here:
    // in _connect() we set this._connectionState, then await something,
    // and only *then* set this._socket. So it could be the case that
    // when we check this._socket here a _connect() is already in
    // progress (awaiting, having not yet set _socket) and we will end up
    // with two overlapping calls to _connect(). Dunno how that plays
    // out in practice but it's a bad smell.
    if (!this._socket) {
      void this._connect(await this._l);
    }

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
    while (!this.closed) {
      const lc = await this._l;
      const lc2 = this._socket
        ? addWebSocketIDFromSocketToLogContext(this._socket, lc)
        : lc;
      lc2.debug?.('watchdog fired');
      if (this._connectionState === ConnectionState.Connected) {
        await this._ping(lc2);
        // TODO do we really want to call _connect if we are already connecting?
      } else {
        void this._connect(lc2);
      }
      await sleep(WATCHDOG_INTERVAL_MS);
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
  wsClass: typeof WebSocket,
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
  return new wsClass(url, auth === '' ? undefined : encodeURIComponent(auth));
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

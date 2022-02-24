import {nanoid} from 'nanoid';
import type {MutatorDefs, Poke, PullerResult, Replicache} from 'replicache';
import type {Downstream} from '../protocol/down.js';
import type {PingMessage} from '../protocol/ping.js';
import type {PokeBody} from '../protocol/poke.js';
import type {PushBody, PushMessage} from '../protocol/push.js';
import {NullableVersion, nullableVersionSchema} from '../types/version.js';
import {assert} from '../util/asserts.js';
import {GapTracker} from '../util/gap-tracker.js';
import {Lock} from '../util/lock.js';
import {LogContext} from '../util/logger.js';
import {resolver} from '../util/resolver.js';
import {sleep} from '../util/sleep.js';

const enum ConnectionState {
  Disconnected,
  Connecting,
  Connected,
}

export class Client<M extends MutatorDefs> {
  private readonly _rep: Replicache<M>;
  private readonly _socketURL: string | undefined;
  private readonly _roomID: string;
  private readonly _l: LogContext;

  // Protects _handlePoke. We need pokes to be serialized, otherwise we
  // can cause out of order poke errors.
  private readonly _pokeLock = new Lock();

  private readonly _pushTracker: GapTracker;
  private readonly _updateTracker: GapTracker;
  private readonly _timestampTracker: GapTracker;

  private _socket: WebSocket | undefined = undefined;
  private _lastMutationIDSent = -1;
  private _state: ConnectionState = ConnectionState.Disconnected;
  private _onPong: () => void = () => undefined;
  private _connectResolver = resolver<WebSocket>();
  private _lastMutationIDReceived = 0;

  /**
   * Constructs a new reflect client.
   * @param rep Instance of replicache to use.
   * @param roomID RoomID we are in.
   * @param socketURL URL of web socket to connect to. This should be either a ws/wss protocol URL or undefined.
   * If undefined, we default to <scheme>://<host>:<port>/rs where host and port are the current page's host and port,
   * and scheme is "ws" if the current page is "http" or "wss" if the current page is "https".
   */
  constructor(rep: Replicache<M>, roomID: string, socketURL?: string) {
    this._rep = rep;
    this._rep.pusher = (req: Request) => this._pusher(req);

    this._socketURL = socketURL;
    this._roomID = roomID;
    this._l = new LogContext('debug').addContext('roomID', roomID);
    this._pushTracker = new GapTracker('push', this._l);
    this._updateTracker = new GapTracker('update', this._l);
    this._timestampTracker = new GapTracker('timestamp', this._l);
    void this._watchdog();
  }

  private _onMessage = (e: MessageEvent<string>) => {
    const l = this._l;
    l.addContext('req', nanoid());
    l.debug?.('received message', e.data);

    const data = JSON.parse(e.data);
    const downMessage = data as Downstream; //downstreamSchema.parse(data);

    if (downMessage[0] === 'connected') {
      l.info?.('Connected');

      this._state = ConnectionState.Connected;
      this._lastMutationIDSent = -1;
      assert(this._socket);
      this._connectResolver.resolve(this._socket);
      return;
    }

    if (downMessage[0] === 'error') {
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

  private _onClose = (e: CloseEvent) => {
    const l = this._l;
    l.info?.('got socket close event', e);
    this._disconnect();
  };

  private async _connect(l: LogContext) {
    if (this._state === ConnectionState.Connecting) {
      l.debug?.('Skipping duplicate connect request');
      return;
    }
    l.info?.('Connecting...');

    this._state = ConnectionState.Connecting;

    const baseCookie = await getBaseCookie(this._rep);
    // TODO if connection fails with 401 use this._rep.getAuth to
    // try to refresh this._rep.auth and then retry connection
    const ws = createSocket(
      this._socketURL,
      location.href,
      baseCookie,
      await this._rep.clientID,
      this._roomID,
      this._rep.auth,
      this._lastMutationIDReceived,
    );

    ws.addEventListener('message', this._onMessage);
    ws.addEventListener('close', this._onClose);
    this._socket = ws;
  }

  private _disconnect() {
    this._l.debug?.('disconnecting');
    if (this._state === ConnectionState.Connected) {
      // Only create a new resolver if the one we have was previously resolved,
      // which happens when the socket became connected.
      this._connectResolver = resolver();
    }
    this._state = ConnectionState.Disconnected;
    this._socket?.removeEventListener('message', this._onMessage);
    this._socket?.removeEventListener('close', this._onClose);
    this._socket = undefined;
    this._lastMutationIDSent = -1;
  }

  private async _handlePoke(l: LogContext, pokeBody: PokeBody) {
    await this._pokeLock.withLock(async () => {
      l.debug?.('Applying poke', pokeBody);

      this._updateTracker.push(performance.now());
      this._timestampTracker.push(pokeBody.timestamp);

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
          this._l.info?.('out of order poke, disconnecting');
          this._disconnect();
          return;
        }
        throw e;
      }
    });
  }

  private async _pusher(req: Request) {
    if (!this._socket) {
      void this._connect(this._l);
    }

    const socket = await this._connectResolver.promise;

    const pushBody = (await req.json()) as PushBody;
    const msg: PushMessage = ['push', pushBody];

    const newMutations = [];
    for (const m of msg[1].mutations) {
      if (m.id > this._lastMutationIDSent) {
        this._lastMutationIDSent = m.id;
        newMutations.push(m);
      }
    }

    if (newMutations.length > 0) {
      pushBody.mutations = newMutations;
      pushBody.timestamp = performance.now();
      this._pushTracker.push(performance.now());
      socket.send(JSON.stringify(msg));
    }

    return {
      errorMessage: '',
      httpStatusCode: 200,
    };
  }

  private async _watchdog() {
    for (;;) {
      const l = this._l.addContext('req', nanoid());
      l.debug?.('watchdog fired');
      if (this._state === ConnectionState.Connected) {
        await this._ping(l);
      } else {
        void this._connect(l);
      }
      await sleep(5000);
    }
  }

  private async _ping(l: LogContext) {
    l.debug?.('pinging');
    const {promise, resolve} = resolver();
    this._onPong = resolve;
    const pingMessage: PingMessage = ['ping', {}];
    const t0 = performance.now();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._socket!.send(JSON.stringify(pingMessage));
    const connected = await Promise.race([
      promise.then(() => true),
      sleep(2000).then(() => false),
    ]);
    const delta = performance.now() - t0;
    if (connected) {
      l.debug?.('ping succeeded in', delta, 'ms');
    } else {
      l.debug?.('ping failed in', delta, 'ms - disconnecting');
      this._disconnect();
    }
  }
}

// Total hack to get base cookie
async function getBaseCookie(rep: Replicache) {
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
  return await promise;
}

export function createSocket(
  socketURL: string | undefined,
  baseURL: string | undefined,
  baseCookie: NullableVersion,
  clientID: string,
  roomID: string,
  auth: string,
  lmid: number,
): WebSocket {
  let url: URL;
  if (socketURL) {
    url = new URL(socketURL);
  } else {
    assert(baseURL);
    url = new URL(baseURL);
    url.protocol = url.protocol.replace('http', 'ws');
    url.pathname = '/rs';
  }

  const {searchParams} = url;
  searchParams.set('clientID', clientID);
  searchParams.set('roomID', roomID);
  searchParams.set('baseCookie', baseCookie === null ? '' : String(baseCookie));
  searchParams.set('ts', String(performance.now()));
  searchParams.set('lmid', String(lmid));

  // Pass auth to the server via the `Sec-WebSocket-Protocol` header by passing
  // it as a `protocol` to the `WebSocket` constructor.  The empty string is an
  // invalid `protocol`, and will result in an exception, so pass undefined
  // instead.  encodeURIComponent to ensure it only contains chars allowed
  // for a `protocol`.
  return new WebSocket(
    url.toString(),
    auth === '' ? undefined : encodeURIComponent(auth),
  );
}

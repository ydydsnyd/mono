import type {MutatorDefs, ReadonlyJSONValue} from 'replicache';
import type {SinonFakeTimers} from 'sinon';
import type {ConnectedMessage} from '../protocol/connected.js';
import type {PokeBody, PokeMessage} from '../protocol/poke.js';
import type {PongMessage} from '../protocol/pong.js';
import {assert} from '../util/asserts.js';
import type {ReflectOptions} from './options.js';
import {Reflect} from './reflect.js';

export async function tickAFewTimes(clock: SinonFakeTimers, duration = 100) {
  const n = 10;
  const t = Math.ceil(duration / n);
  for (let i = 0; i < n; i++) {
    await clock.tickAsync(t);
  }
}

export class MockSocket extends EventTarget {
  readonly url: string | URL;
  args: unknown[] = [];
  messages: string[] = [];
  closed = false;

  constructor(url: string | URL, ...args: unknown[]) {
    super();
    this.url = url;
    this.args = args;
  }

  send(message: string) {
    this.messages.push(message);
  }

  close() {
    this.closed = true;
  }
}

export class TestReflect<MD extends MutatorDefs> extends Reflect<MD> {
  constructor(options: ReflectOptions<MD>) {
    super(options);
    // @ts-expect-error MockSocket is not compatible with WebSocket
    this._WSClass = MockSocket;
  }

  get connectionState() {
    return this._connectionState;
  }

  get connectingStart() {
    return this._connectingStart;
  }

  get socket() {
    return this._socket;
  }

  triggerMessage(data: ReadonlyJSONValue) {
    assert(this._socket);
    this._socket.dispatchEvent(
      new MessageEvent('message', {data: JSON.stringify(data)}),
    );
  }

  triggerConnected() {
    const msg: ConnectedMessage = ['connected', {wsid: 'wsidx'}];
    this.triggerMessage(msg);
  }

  triggerPong() {
    const msg: PongMessage = ['pong', {}];
    this.triggerMessage(msg);
  }

  triggerPoke(pokeBody: PokeBody) {
    const msg: PokeMessage = ['poke', pokeBody];
    this.triggerMessage(msg);
  }

  triggerClose() {
    assert(this._socket);
    this._socket.dispatchEvent(new CloseEvent('close'));
  }

  get pusher() {
    // @ts-expect-error Property '_pusher' is private
    return this._pusher;
  }

  async waitForSocket(clock: SinonFakeTimers): Promise<WebSocket> {
    for (let i = 0; i < 100; i++) {
      if (this._socket) {
        return this._socket;
      }
      await tickAFewTimes(clock);
    }
    throw new Error('Could not get socket');
  }
}

export const reflectForTest = <MD extends MutatorDefs>(
  options: Partial<ReflectOptions<MD>> = {},
): TestReflect<MD> => {
  const r = new TestReflect({
    socketOrigin: 'wss://example.com/',
    userID: 'test-user-id',
    roomID: 'test-room-id',
    auth: 'test-auth',
    ...options,
  });

  return r;
};

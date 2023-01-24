import {expect} from '@esm-bundle/chai';
import type {
  JSONValue,
  LogLevel,
  PushRequest,
  WriteTransaction,
} from 'replicache';
import * as sinon from 'sinon';
import {Mutation, pushMessageSchema} from '../protocol/push.js';
import type {NullableVersion} from '../types/version.js';
import {resolver} from '@rocicorp/resolver';
import {
  ConnectionState,
  createSocket,
  WATCHDOG_INTERVAL_MS,
} from './reflect.js';
import {
  MockSocket,
  reflectForTest,
  TestReflect,
  tickAFewTimes,
} from './test-utils.js';
// Why use fakes when we can use the real thing!
import {Metrics, gaugeValue, Gauge} from '@rocicorp/datadog-util';
import {DID_NOT_CONNECT_VALUE, Metric} from './metrics.js';
import {assertNumber} from '../util/asserts.js';
import {NumericErrorKind, errorKindToString} from '../protocol/error.js';

let clock: sinon.SinonFakeTimers;

setup(() => {
  clock = sinon.useFakeTimers();
  // @ts-expect-error MockSocket is not sufficiently compatible with WebSocket
  sinon.replace(globalThis, 'WebSocket', MockSocket);
});

teardown(() => {
  sinon.restore();
});

test('onOnlineChange callback', async () => {
  let onlineCount = 0;
  let offlineCount = 0;

  const r = reflectForTest({
    onOnlineChange: online => {
      if (online) {
        onlineCount++;
      } else {
        offlineCount++;
      }
    },
  });

  await r.waitForSocket(clock);

  expect(r.connectionState).to.equal(ConnectionState.Connecting);
  expect(onlineCount).to.equal(0);
  expect(offlineCount).to.equal(0);

  await tickAFewTimes(clock);
  r.triggerConnected();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connected);
  expect(onlineCount).to.equal(1);
  expect(offlineCount).to.equal(0);

  await tickAFewTimes(clock);
  r.triggerClose();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Disconnected);
  expect(onlineCount).to.equal(1);
  expect(offlineCount).to.equal(1);

  // let the watchdog timer fire
  await tickAFewTimes(clock, WATCHDOG_INTERVAL_MS);
  r.triggerConnected();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connected);
  expect(onlineCount).to.equal(2);
  expect(offlineCount).to.equal(1);

  r.onOnlineChange = null;
  await tickAFewTimes(clock);
  r.triggerClose();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Disconnected);
  expect(onlineCount).to.equal(2);
  expect(offlineCount).to.equal(1);

  await r.close();
});

test('onOnlineChange reflection on Reflect class', async () => {
  const f = () => 42;
  const r = reflectForTest({
    onOnlineChange: f,
  });
  await tickAFewTimes(clock);

  expect(r.onOnlineChange).to.equal(f);
  await r.close();
});

test('disconnects if ping fails', async () => {
  const url = 'ws://example.com';
  const watchdogInterval = WATCHDOG_INTERVAL_MS;
  const pingTimeout = 2000;
  const r = reflectForTest({
    socketOrigin: url,
    auth: '',
    userID: 'user-id',
    roomID: 'room-id',
  });

  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connecting);

  r.triggerConnected();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connected);

  await tickAFewTimes(clock, watchdogInterval);
  r.triggerPong();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connected);

  await tickAFewTimes(clock, watchdogInterval);
  r.triggerPong();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connected);

  await tickAFewTimes(clock, watchdogInterval);
  expect(r.connectionState).to.equal(ConnectionState.Connected);

  await tickAFewTimes(clock, pingTimeout);
  expect(r.connectionState).to.equal(ConnectionState.Disconnected);

  await r.close();
});

test('createSocket', () => {
  const nowStub = sinon.stub(performance, 'now').returns(0);

  const t = (
    socketURL: string,
    baseCookie: NullableVersion,
    clientID: string,
    roomID: string,
    auth: string,
    lmid: number,
    expectedURL: string,
    expectedProtocol?: string,
  ) => {
    const mockSocket = createSocket(
      socketURL,
      baseCookie,
      clientID,
      roomID,
      auth,
      lmid,
      'wsidx',
    ) as unknown as MockSocket;
    expect(`${mockSocket.url}`).equal(expectedURL);
    expect(mockSocket.args).deep.equal([expectedProtocol]);
  };

  t(
    'ws://example.com/',
    null,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/connect?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=0&wsid=wsidx',
  );

  t(
    'ws://example.com/',
    1234,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/connect?clientID=clientID&roomID=roomID&baseCookie=1234&ts=0&lmid=0&wsid=wsidx',
  );

  t(
    'ws://example.com/',
    null,
    'clientID',
    'roomID',
    '',
    123,
    'ws://example.com/connect?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=123&wsid=wsidx',
  );

  t(
    'ws://example.com/',
    null,
    'clientID',
    'roomID',
    'auth with []',
    0,
    'ws://example.com/connect?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=0&wsid=wsidx',
    'auth%20with%20%5B%5D',
  );

  nowStub.returns(456);
  t(
    'ws://example.com/',
    null,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/connect?clientID=clientID&roomID=roomID&baseCookie=&ts=456&lmid=0&wsid=wsidx',
  );
});

test('pusher sends one mutation per push message', async () => {
  const t = async (
    mutations: Mutation[],
    expectedMessages: number,
    requestID = 'request-id',
  ) => {
    const r = reflectForTest();
    await r.waitForSocket(clock);
    r.triggerConnected();
    const mockSocket = r.socket as unknown as MockSocket;

    const pushBody: PushRequest = {
      profileID: 'profile-id',
      clientID: 'client-id',
      pushVersion: 0,
      schemaVersion: '1',
      mutations,
    };

    const req = new Request('http://example.com/push', {
      body: JSON.stringify(pushBody),
      method: 'POST',
      headers: {'X-Replicache-RequestID': requestID},
    });

    await r.pusher(req);

    expect(mockSocket.messages).to.have.lengthOf(expectedMessages);

    for (const raw of mockSocket.messages) {
      const msg = pushMessageSchema.parse(JSON.parse(raw));
      expect(msg[1].mutations).to.have.lengthOf(1);
      expect(msg[1].requestID).to.equal(requestID);
    }

    await r.close();
  };

  await t([], 0);
  await t([{id: 1, name: 'mut1', args: {d: 1}, timestamp: 1}], 1);
  await t(
    [
      {id: 1, name: 'mut1', args: {d: 1}, timestamp: 1},
      {id: 2, name: 'mut1', args: {d: 2}, timestamp: 2},
      {id: 3, name: 'mut1', args: {d: 3}, timestamp: 3},
    ],
    3,
  );

  // skips ids already seen
  await t(
    [
      {id: 1, name: 'mut1', args: {d: 1}, timestamp: 1},
      {id: 1, name: 'mut1', args: {d: 2}, timestamp: 1},
    ],
    1,
  );
});

test('watchSmokeTest', async () => {
  const rep = reflectForTest({
    mutators: {
      addData: async (
        tx: WriteTransaction,
        data: {[key: string]: JSONValue},
      ) => {
        for (const [key, value] of Object.entries(data)) {
          await tx.put(key, value);
        }
      },
      del: async (tx: WriteTransaction, key: string) => {
        await tx.del(key);
      },
    },
  });

  const spy = sinon.spy();
  const unwatch = rep.experimentalWatch(spy);

  await rep.mutate.addData({a: 1, b: 2});

  expect(spy.callCount).to.equal(1);
  expect(spy.lastCall.args).to.deep.equal([
    [
      {
        op: 'add',
        key: 'a',
        newValue: 1,
      },
      {
        op: 'add',
        key: 'b',
        newValue: 2,
      },
    ],
  ]);

  spy.resetHistory();
  await rep.mutate.addData({a: 1, b: 2});
  expect(spy.callCount).to.equal(0);

  await rep.mutate.addData({a: 11});
  expect(spy.callCount).to.equal(1);
  expect(spy.lastCall.args).to.deep.equal([
    [
      {
        op: 'change',
        key: 'a',
        newValue: 11,
        oldValue: 1,
      },
    ],
  ]);

  spy.resetHistory();
  await rep.mutate.del('b');
  expect(spy.callCount).to.equal(1);
  expect(spy.lastCall.args).to.deep.equal([
    [
      {
        op: 'del',
        key: 'b',
        oldValue: 2,
      },
    ],
  ]);

  unwatch();

  spy.resetHistory();
  await rep.mutate.addData({c: 6});
  expect(spy.callCount).to.equal(0);
});

test('poke log context includes requestID', async () => {
  const url = 'ws://example.com/';
  const log: unknown[][] = [];

  const {promise: foundRequestIDFromLogPromise, resolve} = resolver<string>();
  const logSink = {
    log(_level: LogLevel, ...args: unknown[]) {
      for (const arg of args) {
        if (typeof arg === 'string' && arg.startsWith('requestID=')) {
          const foundRequestID = arg.slice('requestID='.length);
          resolve(foundRequestID);
        }
      }
    },
  };

  const reflect = new TestReflect({
    socketOrigin: url,
    auth: '',
    userID: 'user-id',
    roomID: 'room-id',
    logSinks: [logSink],
    logLevel: 'debug',
  });

  await reflect.waitForSocket(clock);

  log.length = 0;

  reflect.triggerPoke({
    baseCookie: null,
    cookie: 1,
    lastMutationID: 1,
    patch: [],
    timestamp: 123456,
    requestID: 'request-id-x',
  });

  const foundRequestID = await foundRequestIDFromLogPromise;
  expect(foundRequestID).to.equal('request-id-x');
});

test('timeToConnect updated when connected', async () => {
  const url = 'ws://example.com/';
  const m = new Metrics();
  const g = m.gauge(Metric.TimeToConnect);
  clock.setSystemTime(1000 * 1000);
  const r = reflectForTest({
    socketOrigin: url,
    auth: '',
    userID: 'user-id',
    roomID: 'room-id',
    metrics: m,
  });
  expect(val(g)).to.equal(DID_NOT_CONNECT_VALUE);

  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Connecting);
  const start = asNumber(r.connectingStart);

  clock.setSystemTime(start + 42 * 1000);
  r.triggerConnected();
  await tickAFewTimes(clock);
  expect(val(g)).to.equal(42 * 1000);

  // Ensure it gets set when we reconnect.
  r.triggerClose();
  await tickAFewTimes(clock);
  expect(r.connectionState).to.equal(ConnectionState.Disconnected);
  await tickAFewTimes(clock, WATCHDOG_INTERVAL_MS);
  expect(r.connectionState).to.equal(ConnectionState.Connecting);

  const restart = asNumber(r.connectingStart);
  clock.setSystemTime(restart + 666 * 1000);
  r.triggerConnected();
  await tickAFewTimes(clock);
  // Gauge value is in seconds.
  expect(val(g)).to.equal(666 * 1000);
});

function val(g: Gauge) {
  const v = gaugeValue(g.flush());
  if (v === undefined) {
    return v;
  }
  return v.value;
}

test('timeToConnect updated to DID_NOT_CONNECT when connect fails', async () => {
  const url = 'ws://example.com/';
  const m = new Metrics();
  const g = m.gauge(Metric.TimeToConnect);
  clock.setSystemTime(1000 * 1000);
  const r = reflectForTest({
    socketOrigin: url,
    auth: '',
    userID: 'user-id',
    roomID: 'room-id',
    metrics: m,
  });

  await tickAFewTimes(clock);
  r.triggerConnected();
  await tickAFewTimes(clock);
  expect(val(g)).to.not.equal(DID_NOT_CONNECT_VALUE);

  r.triggerClose();
  await tickAFewTimes(clock, WATCHDOG_INTERVAL_MS);
  expect(r.connectionState).to.equal(ConnectionState.Connecting);
  const start = asNumber(r.connectingStart);
  clock.setSystemTime(start + 42 * 1000);
  r.triggerClose();
  await tickAFewTimes(clock);
  expect(val(g)).to.equal(DID_NOT_CONNECT_VALUE);
});

function asNumber(v: unknown): number {
  assertNumber(v);
  return v;
}

test('Close with error should close instance and call onClose', async () => {
  const logSpy = sinon.spy();
  const onCloseSpy = sinon.spy();

  const r = reflectForTest({
    logSinks: [{log: logSpy}],
    logLevel: 'error',
    onClose: onCloseSpy,
  });
  await r.waitForSocket(clock);

  r.triggerClose({
    code: NumericErrorKind.ClientNotFound,
    reason: 'Client ~Found',
    wasClean: false,
  });
  await tickAFewTimes(clock);

  expect(r.closed).true;

  expect(logSpy.callCount).equal(1);
  expect(logSpy.lastCall.args).contain('roomID=test-room-id');
  expect(logSpy.lastCall.args).contain('Got socket close event with error');
  expect(logSpy.lastCall.args).contain('ClientNotFound');

  expect(onCloseSpy.callCount).equal(1);
  expect(onCloseSpy.lastCall.args).deep.equal([
    false,
    errorKindToString(NumericErrorKind.ClientNotFound),
    'Client ~Found',
  ]);
});

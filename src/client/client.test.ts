import {expect} from '@esm-bundle/chai';
import * as sinon from 'sinon';
import type {NullableVersion} from '../types/version.js';
import {createSocket} from './client.js';

teardown(() => {
  sinon.restore();
});

test('createSocket', () => {
  let mockSocket: MockSocket;

  class MockSocket {
    args: unknown[] = [];
    constructor(...args: unknown[]) {
      this.args = args;
      mockSocket = this;
    }
  }

  // @ts-expect-error MockSocket is not compatible with WebSocket
  sinon.replace(globalThis, 'WebSocket', MockSocket);

  const nowStub = sinon.stub(performance, 'now').returns(0);

  const t = (
    socketURL: string | undefined,
    baseURL: string | undefined,
    baseCookie: NullableVersion,
    clientID: string,
    roomID: string,
    auth: string,
    lmid: number,
    expectedURL: string,
    expectedProtocol?: string,
  ) => {
    createSocket(socketURL, baseURL, baseCookie, clientID, roomID, auth, lmid);
    expect(mockSocket.args).to.deep.equal([expectedURL, expectedProtocol]);
  };

  t(
    undefined,
    'http://example.com/',
    null,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/rs?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=0',
  );

  t(
    undefined,
    'https://example.com/',
    null,
    'clientID',
    'roomID',
    '',
    0,
    'wss://example.com/rs?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=0',
  );

  t(
    'ws://example.com/',
    undefined,
    null,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=0',
  );

  t(
    'ws://example.com/',
    undefined,
    1234,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/?clientID=clientID&roomID=roomID&baseCookie=1234&ts=0&lmid=0',
  );

  t(
    'ws://example.com/',
    undefined,
    null,
    'clientID',
    'roomID',
    '',
    123,
    'ws://example.com/?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=123',
  );

  t(
    'ws://example.com/',
    undefined,
    null,
    'clientID',
    'roomID',
    'auth with []',
    0,
    'ws://example.com/?clientID=clientID&roomID=roomID&baseCookie=&ts=0&lmid=0',
    'auth%20with%20%5B%5D',
  );

  nowStub.returns(456);
  t(
    'ws://example.com/',
    undefined,
    null,
    'clientID',
    'roomID',
    '',
    0,
    'ws://example.com/?clientID=clientID&roomID=roomID&baseCookie=&ts=456&lmid=0',
  );
});

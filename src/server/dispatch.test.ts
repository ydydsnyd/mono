import {test, expect} from '@jest/globals';
import type {LogContext} from '@rocicorp/logger';
import {dispatch, Handlers} from './dispatch.js';
import {createSilentLogContext} from '../util/test-utils.js';

const testAuthApiKey = 'TEST_REFLECT_AUTH_API_KEY_TEST';

function createThrowingHandlers() {
  return {
    createRoom: () => {
      throw new Error('unexpected call to createRoom handler');
    },
    connect: () => {
      throw new Error('unexpect call to connect handler');
    },
  };
}

async function testMethodNotAllowedValidationError(
  testRequestBadMethod: Request,
  allowedMethod: string,
) {
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    createSilentLogContext(),
    testAuthApiKey,
    createThrowingHandlers(),
  );
  expect(responseForBadMethod.status).toEqual(405);
  expect(await responseForBadMethod.text()).toEqual(
    `Method not allowed. Use "${allowedMethod}".`,
  );
}

async function testUnsupportedPathValidationError(
  requestWUnsupportedPath: Request,
  handlers: Handlers,
) {
  const response = await dispatch(
    requestWUnsupportedPath,
    createSilentLogContext(),
    undefined,
    handlers,
  );
  expect(response.status).toEqual(400);
  expect(await response.text()).toEqual('Unsupported path.');
}

test('unsupported path', async () => {
  await testUnsupportedPathValidationError(
    new Request('https://test.roci.dev/bad_path'),
    createThrowingHandlers(),
  );
});

test('unsupported path for optional handlers', async () => {
  const handlers: Handlers = createThrowingHandlers();
  await testUnsupportedPathValidationError(
    new Request('https://test.roci.dev/api/auth/v0/connections'),
    handlers,
  );
});

test('connect good request', async () => {
  const testRequest = new Request('ws://test.roci.dev/connect');
  const testResponse = new Response('');
  const response = await dispatch(
    testRequest,
    createSilentLogContext(),
    undefined,
    {
      ...createThrowingHandlers(),
      connect: (_lc: LogContext, request: Request, body: undefined) => {
        expect(request).toBe(testRequest);
        expect(body).toBeUndefined();
        return Promise.resolve(testResponse);
      },
    },
  );
  expect(response).toBe(testResponse);
});

test('connect request with validation errors', async () => {
  await testMethodNotAllowedValidationError(
    new Request('ws://test.roci.dev/connect', {
      method: 'post',
    }),
    'get',
  );
});

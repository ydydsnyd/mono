import {test, expect} from '@jest/globals';
import type {LogContext} from '@rocicorp/logger';
import {createAuthAPIHeaders} from './auth-api-headers.js';
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
    authInvalidateForUser: () => {
      throw new Error('unexpect call to authInvalidateForUser handler');
    },
    authInvalidateForRoom: () => {
      throw new Error('unexpect call to authInvalidateForRoom handler');
    },
    authConnections: () => {
      throw new Error('unexpect call to authConnections handler');
    },
    authRevalidateConnections: () => {
      throw new Error('unexpect call to authRevalidateConnections handler');
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

async function testApiKeyValidationErrors(baseRequest: Request) {
  const testRequestMissingAuthApiKey = baseRequest.clone();
  const responseForMissingAuthApiKey = await dispatch(
    testRequestMissingAuthApiKey,
    createSilentLogContext(),
    testAuthApiKey,
    createThrowingHandlers(),
  );
  expect(responseForMissingAuthApiKey.status).toEqual(401);
  expect(await responseForMissingAuthApiKey.text()).toEqual('Unauthorized');

  const testRequestWrongAuthApiKey = new Request(baseRequest, {
    headers: createAuthAPIHeaders('WRONG_API_KEY'),
  });
  const responseForWrongAuthApiKey = await dispatch(
    testRequestWrongAuthApiKey,
    createSilentLogContext(),
    testAuthApiKey,
    createThrowingHandlers(),
  );
  expect(responseForWrongAuthApiKey.status).toEqual(401);
  expect(await responseForWrongAuthApiKey.text()).toEqual('Unauthorized');
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
  delete handlers.authRevalidateConnections;
  delete handlers.authConnections;
  await testUnsupportedPathValidationError(
    new Request('https://test.roci.dev/api/auth/v0/reavalidateConnections'),
    handlers,
  );
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

test('authRevalidateConnections good request', async () => {
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/revalidateConnections`,
    {
      headers: createAuthAPIHeaders(testAuthApiKey),
      method: 'post',
    },
  );
  const testResponse = new Response('');
  const response = await dispatch(
    testRequest,
    createSilentLogContext(),
    testAuthApiKey,
    {
      ...createThrowingHandlers(),
      authRevalidateConnections: (
        _lc: LogContext,
        request: Request,
        body: undefined,
      ) => {
        expect(request).toBe(testRequest);
        expect(body).toBeUndefined();
        return Promise.resolve(testResponse);
      },
    },
  );
  expect(response).toBe(testResponse);
});

test('authRevalidateConnections request with validation errors', async () => {
  await testMethodNotAllowedValidationError(
    new Request(`https://test.roci.dev/api/auth/v0/revalidateConnections`, {
      headers: createAuthAPIHeaders(testAuthApiKey),
      method: 'put',
    }),
    'post',
  );

  await testApiKeyValidationErrors(
    new Request(`https://test.roci.dev/api/auth/v0/revalidateConnections`, {
      method: 'post',
    }),
  );
});

test('authConnections good request', async () => {
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/connections`,
    {
      headers: createAuthAPIHeaders(testAuthApiKey),
      method: 'get',
    },
  );
  const testResponse = new Response('');
  const response = await dispatch(
    testRequest,
    createSilentLogContext(),
    testAuthApiKey,
    {
      ...createThrowingHandlers(),
      authConnections: (_lc: LogContext, request: Request, body: undefined) => {
        expect(request).toBe(testRequest);
        expect(body).toBeUndefined();
        return Promise.resolve(testResponse);
      },
    },
  );
  expect(response).toBe(testResponse);
});

test('authConnections request with validation errors', async () => {
  await testMethodNotAllowedValidationError(
    new Request(`https://test.roci.dev/api/auth/v0/connections`, {
      headers: createAuthAPIHeaders(testAuthApiKey),
      method: 'post',
    }),
    'get',
  );
  await testApiKeyValidationErrors(
    new Request(`https://test.roci.dev/api/auth/v0/connections`, {
      method: 'get',
    }),
  );
});

test('auth api returns 401 for all requests when authApiKey is undefined', async () => {
  async function testUnauthorizedWhenAuthApiKeyIsUndefined(request: Request) {
    const response = await dispatch(
      request,
      createSilentLogContext(),
      undefined,
      createThrowingHandlers(),
    );
    expect(response.status).toEqual(401);
    expect(await response.text()).toEqual('Unauthorized');
  }
  await testUnauthorizedWhenAuthApiKeyIsUndefined(
    new Request(`https://test.roci.dev/api/auth/v0/revalidateConnections`, {
      method: 'post',
      headers: createAuthAPIHeaders(testAuthApiKey),
    }),
  );
  await testUnauthorizedWhenAuthApiKeyIsUndefined(
    new Request(`https://test.roci.dev/api/auth/v0/connections`, {
      method: 'get',
      headers: createAuthAPIHeaders(testAuthApiKey),
    }),
  );
});

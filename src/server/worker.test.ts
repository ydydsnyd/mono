import { test, expect } from "@jest/globals";
import type { LogLevel } from "../util/logger.js";
import { encodeHeaderValue } from "../util/headers.js";
import { Mocket } from "../util/test-utils.js";
import { USER_DATA_HEADER_NAME } from "./auth";
import { BaseWorkerEnv, createWorker, createWorkerInternal } from "./worker";

class TestExecutionContext implements ExecutionContext {
  waitUntil(_promise: Promise<unknown>): void {
    return;
  }
  passThroughOnException(): void {
    return;
  }
}

function createTestFixture() {
  const testRoomID = "testRoomID1";
  const testClientID = "testClientID1";
  const encodedTestAuth = "test%20auth%20token%20value%20%25%20encoded";
  const testAuth = "test auth token value % encoded";

  const headers = new Headers();
  headers.set("Sec-WebSocket-Protocol", encodedTestAuth);
  const testRequest = new Request(
    `ws://test.roci.dev/connect?roomID=${testRoomID}&clientID=${testClientID}`,
    {
      headers,
    }
  );

  const mocket = new Mocket();

  const testEnv = {
    server: {
      idFromName: (name: string) => {
        expect(name).toEqual(testRoomID);
        return "server-name-" + name;
      },
      get: (id: string) => {
        expect(id).toEqual("server-name-" + testRoomID);
        return {
          fetch: async (request: Request) => {
            expect(request.url).toEqual(testRequest.url);
            expect(request.headers.get(USER_DATA_HEADER_NAME)).toEqual(
              encodeHeaderValue(
                JSON.stringify({ userID: testAuth + ":" + testRoomID })
              )
            );
            expect(request.headers.get("Sec-WebSocket-Protocol")).toEqual(
              encodedTestAuth
            );
            return new Response(null, { status: 101, webSocket: mocket });
          },
        };
      },
    },
  } as unknown as BaseWorkerEnv;

  return {
    testAuth,
    testRoomID,
    testRequest,
    testEnv,
    mocket,
    encodedTestAuth,
  };
}

function createEnvThatThrowsIfFetchIsCalled() {
  return {
    server: {
      idFromName: (name: string) => {
        return "server-name-" + name;
      },
      get: (_id: string) => {
        return {
          fetch: async (_request: Request) => {
            throw new Error("Unexpected call to DO fetch");
          },
        };
      },
    },
  };
}

test("worker calls authHandler and sends returned user data in header to DO", async () => {
  const {
    testAuth,
    testRoomID,
    testRequest,
    testEnv,
    mocket,
    encodedTestAuth,
  } = createTestFixture();

  const workerNotMiniflare = createWorkerInternal(
    {
      authHandler: async (auth, roomID) => {
        expect(auth).toEqual(testAuth);
        expect(roomID).toEqual(testRoomID);
        return { userID: auth + ":" + roomID };
      },
    },
    false
  );

  if (!workerNotMiniflare.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  const response = await workerNotMiniflare.fetch(
    testRequest,
    testEnv,
    new TestExecutionContext()
  );

  expect(response.status).toEqual(101);
  expect(response.webSocket).toBe(mocket);
  expect(response.headers.get("Sec-WebSocket-Protocol")).toEqual(
    encodedTestAuth
  );

  const workerMiniflare = createWorkerInternal(
    {
      authHandler: async (auth, roomID) => {
        expect(auth).toEqual(testAuth);
        expect(roomID).toEqual(testRoomID);
        return { userID: auth + ":" + roomID };
      },
    },
    true
  );

  if (!workerMiniflare.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  const response2 = await workerMiniflare.fetch(
    testRequest,
    testEnv,
    new TestExecutionContext()
  );
  expect(response2.status).toEqual(101);
  expect(response2.webSocket).toBe(mocket);
  expect(response2.headers.get("Sec-WebSocket-Protocol")).toBeNull;
});

test("worker returns a 401 without calling DO if authHandler rejects", async () => {
  const testRoomID = "testRoomID1";
  const testClientID = "testClientID1";
  const testAuth = "testAuthTokenValue";

  const headers = new Headers();
  headers.set("Sec-WebSocket-Protocol", testAuth);
  const testRequest = new Request(
    `ws://test.roci.dev/connect?roomID=${testRoomID}&clientID=${testClientID}`,
    {
      headers,
    }
  );
  const env = createEnvThatThrowsIfFetchIsCalled();

  const worker = createWorker({
    authHandler: async (auth, roomID) => {
      expect(auth).toEqual(testAuth);
      expect(roomID).toEqual(testRoomID);
      throw new Error("Test authHandler reject");
    },
  });

  if (!worker.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  const response = await worker.fetch(
    testRequest,
    env as unknown as Bindings,
    new TestExecutionContext()
  );

  expect(response.status).toEqual(401);
  expect(response.webSocket).toBeUndefined();
});

test("worker returns a 401 without calling DO if Sec-WebSocket-Protocol header is not present", async () => {
  const testRoomID = "testRoomID1";
  const testClientID = "testClientID1";

  const headers = new Headers();
  const testRequest = new Request(
    `ws://test.roci.dev/connect?roomID=${testRoomID}&clientID=${testClientID}`,
    {
      headers,
    }
  );
  const env = createEnvThatThrowsIfFetchIsCalled();

  const worker = createWorker({
    authHandler: async (_auth, _roomID) => {
      throw new Error("Unexpected call to authHandler");
    },
  });

  if (!worker.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  const response = await worker.fetch(
    testRequest,
    env as unknown as Bindings,
    new TestExecutionContext()
  );

  expect(response.status).toEqual(401);
  expect(response.webSocket).toBeUndefined();
});

test("logging", async () => {
  const { testAuth, testRoomID, testRequest, testEnv } = createTestFixture();

  const waitUntilCalls: Promise<unknown>[] = [];
  const executionContext = {
    waitUntil: (promise: Promise<unknown>): void => {
      waitUntilCalls.push(promise);
      return;
    },
    passThroughOnException: (): void => {
      return;
    },
  };

  let createLoggerCallCount = 0;
  let getLogLevelCallCount = 0;
  let logCallCount = 0;
  const logFlushPromise = Promise.resolve();
  const workerNotMiniflare = createWorkerInternal(
    {
      authHandler: async (auth, roomID) => {
        expect(auth).toEqual(testAuth);
        expect(roomID).toEqual(testRoomID);
        return { userID: auth + ":" + roomID };
      },
      createLogger: (env) => {
        createLoggerCallCount++;
        expect(env).toBe(testEnv);
        return {
          log: (_level: LogLevel, ..._args: unknown[]): void => {
            logCallCount++;
          },
          flush: (): Promise<void> => {
            return logFlushPromise;
          },
        };
      },
      getLogLevel: (env) => {
        getLogLevelCallCount++;
        expect(env).toBe(testEnv);
        return "debug";
      },
    },
    false
  );

  if (!workerNotMiniflare.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  expect(createLoggerCallCount).toEqual(0);
  expect(getLogLevelCallCount).toEqual(0);
  expect(logCallCount).toEqual(0);

  const response = await workerNotMiniflare.fetch(
    testRequest,
    testEnv,
    executionContext
  );
  expect(response.status).toEqual(101);
  expect(createLoggerCallCount).toEqual(1);
  expect(getLogLevelCallCount).toEqual(1);
  const logCallCountAfterFirstFetch = logCallCount;
  expect(logCallCountAfterFirstFetch).toBeGreaterThan(0);
  expect(waitUntilCalls.length).toBe(1);
  expect(waitUntilCalls[0]).toBe(logFlushPromise);

  const response2 = await workerNotMiniflare.fetch(
    testRequest,
    testEnv,
    executionContext
  );
  expect(response2.status).toEqual(101);
  expect(createLoggerCallCount).toEqual(2);
  expect(getLogLevelCallCount).toEqual(2);
  expect(logCallCount).toBeGreaterThan(logCallCountAfterFirstFetch);
  expect(waitUntilCalls.length).toBe(2);
  expect(waitUntilCalls[1]).toBe(logFlushPromise);
});

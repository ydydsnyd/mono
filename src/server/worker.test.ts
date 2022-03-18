import { test, expect } from "@jest/globals";
import type { ReadonlyJSONObject } from "replicache";
import type { LogLevel } from "../util/logger.js";
import { Mocket, TestLogger } from "../util/test-utils.js";
import {
  createTestDurableObjectNamespace,
  TestDurableObjectId,
  TestDurableObjectStub,
} from "./do-test-utils.js";
import { BaseWorkerEnv, createWorker } from "./worker";

class TestExecutionContext implements ExecutionContext {
  waitUntil(_promise: Promise<unknown>): void {
    return;
  }
  passThroughOnException(): void {
    return;
  }
}

function createTestFixture(
  requestUrl: string,
  method = "get",
  body?: ReadonlyJSONObject
) {
  const testRequest = new Request(requestUrl, {
    method,
    body: JSON.stringify(body),
  });

  const authDOFetchResponses: Response[] = [];

  const testEnv: BaseWorkerEnv = {
    authDO: {
      ...createTestDurableObjectNamespace(),
      idFromName: (name: string) => {
        expect(name).toEqual("auth");
        return new TestDurableObjectId("test-auth-do-id");
      },
      get: (id: DurableObjectId) => {
        expect(id.name).toEqual("test-auth-do-id");
        return new TestDurableObjectStub(id, async (request: Request) => {
          expect(request).toBe(testRequest);
          const response = new Response(null, {
            status: 101,
            webSocket: new Mocket(),
          });
          authDOFetchResponses.push(response);
          return response;
        });
      },
    },
  };

  return {
    testRequest,
    testEnv,
    authDOFetchResponses,
  };
}

function createEnvThatThrowsIfAuthDOFetchIsCalled(): BaseWorkerEnv {
  return {
    authDO: {
      ...createTestDurableObjectNamespace(),
      idFromName: (name: string) => {
        return new TestDurableObjectId("test-auth-do-" + name);
      },
      get: (id: DurableObjectId) => {
        return new TestDurableObjectStub(id, async (_request: Request) => {
          throw new Error("Unexpected call to authDO fetch");
        });
      },
    },
  };
}

async function testForwardedToAuthDO(
  url: string,
  method = "get",
  body?: ReadonlyJSONObject
) {
  const { testRequest, testEnv, authDOFetchResponses } = createTestFixture(
    url,
    method,
    body
  );
  const worker = createWorker({
    createLogger: (_env) => new TestLogger(),
    getLogLevel: (_env) => "error",
  });
  if (!worker.fetch) {
    throw new Error("Expect fetch to be defined");
  }
  const response = await worker.fetch(
    testRequest,
    testEnv,
    new TestExecutionContext()
  );
  expect(authDOFetchResponses.length).toEqual(1);
  expect(response).toBe(authDOFetchResponses[0]);
}

async function testNotForwardedToAuthDO(url: string) {
  const testRequest = new Request(url);
  const worker = createWorker({
    createLogger: (_env) => new TestLogger(),
    getLogLevel: (_env) => "error",
  });
  if (!worker.fetch) {
    throw new Error("Expect fetch to be defined");
  }
  const response = await worker.fetch?.(
    testRequest,
    createEnvThatThrowsIfAuthDOFetchIsCalled(),
    new TestExecutionContext()
  );
  expect(response.status).toEqual(400);
}

test("worker forwards connect requests to authDO", async () => {
  await testForwardedToAuthDO("ws://test.roci.dev/connect");
});

test("worker does not forward connect requests with wrong protocol to authDO and returns statusCode 400", async () => {
  await testNotForwardedToAuthDO("https://test.roci.dev/connect");
});

test("worker forwards auth api requests to authDO", async () => {
  await testForwardedToAuthDO(
    "https://test.roci.dev/api/auth/v0/invalidateForUser",
    "post",
    { userID: "userID1" }
  );
  await testForwardedToAuthDO(
    "https://test.roci.dev/api/auth/v0/invalidateForRoom",
    "post",
    { roomID: "roomID1" }
  );
  await testForwardedToAuthDO(
    "https://test.roci.dev/api/auth/v0/invalidateAll",
    "post"
  );
});

test("worker does not forward auth api requests with wrong protocol to authDO and returns statusCode 400", async () => {
  await testNotForwardedToAuthDO(
    "http://test.roci.dev/api/auth/v0/invalidateForUser"
  );
  await testNotForwardedToAuthDO(
    "ws://test.roci.dev/api/auth/v0/invalidateForUser"
  );
});

test("worker does not forward unknown paths to authDO and returns statusCode 400", async () => {
  await testNotForwardedToAuthDO("ws://test.roci.dev/badPath");
});

test("logging", async () => {
  const { testRequest, testEnv } = createTestFixture(
    "ws://test.roci.dev/connect"
  );

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
  const worker = createWorker({
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
  });

  if (!worker.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  expect(createLoggerCallCount).toEqual(0);
  expect(getLogLevelCallCount).toEqual(0);
  expect(logCallCount).toEqual(0);

  const response = await worker.fetch(testRequest, testEnv, executionContext);
  expect(response.status).toEqual(101);
  expect(createLoggerCallCount).toEqual(1);
  expect(getLogLevelCallCount).toEqual(1);
  const logCallCountAfterFirstFetch = logCallCount;
  expect(logCallCountAfterFirstFetch).toBeGreaterThan(0);
  expect(waitUntilCalls.length).toBe(1);
  expect(waitUntilCalls[0]).toBe(logFlushPromise);

  const response2 = await worker.fetch(testRequest, testEnv, executionContext);
  expect(response2.status).toEqual(101);
  expect(createLoggerCallCount).toEqual(2);
  expect(getLogLevelCallCount).toEqual(2);
  expect(logCallCount).toBeGreaterThan(logCallCountAfterFirstFetch);
  expect(waitUntilCalls.length).toBe(2);
  expect(waitUntilCalls[1]).toBe(logFlushPromise);
});

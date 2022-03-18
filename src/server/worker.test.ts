import { test, expect } from "@jest/globals";
import type { ReadonlyJSONObject } from "replicache";
import type { LogLevel } from "../util/logger.js";
import { Mocket, TestLogger } from "../util/test-utils.js";
import { createAuthAPIHeaders } from "./auth-api-test-utils.js";
import {
  createTestDurableObjectNamespace,
  TestDurableObjectId,
  TestDurableObjectStub,
} from "./do-test-utils.js";
import { BaseWorkerEnv, createWorker } from "./worker";

const TEST_AUTH_API_KEY = "TEST_REFLECT_AUTH_API_KEY_TEST";

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
  headers?: Headers,
  body?: ReadonlyJSONObject
) {
  const testRequest = new Request(requestUrl, {
    method,
    headers: headers || new Headers(),
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    REFLECT_AUTH_API_KEY: TEST_AUTH_API_KEY,
  };

  return {
    testRequest,
    testEnv,
    authDOFetchResponses,
  };
}

async function testForwardedToAuthDO(
  url: string,
  body?: ReadonlyJSONObject,
  method = "post"
) {
  const { testRequest, testEnv, authDOFetchResponses } = createTestFixture(
    url,
    method,
    createAuthAPIHeaders(TEST_AUTH_API_KEY),
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

test("worker forwards connect requests to authDO", async () => {
  await testForwardedToAuthDO("ws://test.roci.dev/connect", undefined, "get");
});

test("worker forwards auth api requests to authDO", async () => {
  await testForwardedToAuthDO(
    "https://test.roci.dev/api/auth/v0/invalidateForUser",
    { userID: "userID1" }
  );
  await testForwardedToAuthDO(
    "https://test.roci.dev/api/auth/v0/invalidateForRoom",
    { roomID: "roomID1" }
  );
  await testForwardedToAuthDO(
    "https://test.roci.dev/api/auth/v0/invalidateAll"
  );
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

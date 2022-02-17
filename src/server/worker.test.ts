import { test, expect } from "@jest/globals";
import { encodeHeaderValue } from "../util/headers.js";
import { Mocket } from "../util/test-utils.js";
import { USER_DATA_HEADER_NAME } from "./auth";
import { createWorker } from "./worker";

class TestExecutionContext implements ExecutionContext {
  waitUntil(_promise: Promise<unknown>): void {
    return;
  }
  passThroughOnException(): void {
    return;
  }
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

  const mocket = new Mocket();

  const env = {
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
                JSON.stringify({ userID: "test" + testAuth + ":" + testRoomID })
              )
            );
            expect(request.headers.get("Sec-WebSocket-Protocol")).toEqual(
              testAuth
            );
            return new Response(null, { status: 101, webSocket: mocket });
          },
        };
      },
    },
  };

  const worker = createWorker(async (auth, roomID) => {
    expect(auth).toEqual(testAuth);
    expect(roomID).toEqual(testRoomID);
    return { userID: "test" + auth + ":" + roomID };
  });

  if (!worker.fetch) {
    throw new Error("Expect fetch to be defined");
  }

  const response = await worker.fetch(
    testRequest,
    env as unknown as Bindings,
    new TestExecutionContext()
  );

  expect(response.status).toEqual(101);
  expect(response.webSocket).toBe(mocket);
  expect(response.headers.get("Sec-WebSocket-Protocol")).toEqual(testAuth);
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

  const worker = createWorker(async (auth, roomID) => {
    expect(auth).toEqual(testAuth);
    expect(roomID).toEqual(testRoomID);
    throw new Error("Test authHandler reject");
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

  const worker = createWorker(async (_auth, _roomID) => {
    throw new Error("Unexpected call to authHandler");
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

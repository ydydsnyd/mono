import { test, expect } from "@jest/globals";
import { encodeHeaderValue } from "../util/headers.js";
import { Mocket, TestLogger } from "../util/test-utils.js";
import { USER_DATA_HEADER_NAME } from "./auth.js";
import {
  createTestDurableObjectNamespace,
  TestDurableObjectId,
  TestDurableObjectStub,
} from "./do-test-utils.js";
import { BaseAuthDO } from "./auth-do.js";

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

  const testRoomDO: DurableObjectNamespace = {
    ...createTestDurableObjectNamespace(),
    idFromName: (name: string) => {
      expect(name).toEqual(testRoomID);
      return new TestDurableObjectId("room-do-" + name);
    },
    get: (id: DurableObjectId) => {
      expect(id.name).toEqual("room-do-" + testRoomID);
      return new TestDurableObjectStub(id, async (request: Request) => {
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
      });
    },
  };

  return {
    testAuth,
    testRoomID,
    testRequest,
    testRoomDO,
    mocket,
    encodedTestAuth,
  };
}

function createRoomDOThatThrowsIfFetchIsCalled(): DurableObjectNamespace {
  return {
    ...createTestDurableObjectNamespace(),
    idFromName: (name: string) => {
      return new TestDurableObjectId("room-do-" + name);
    },
    get: (id: DurableObjectId) => {
      return new TestDurableObjectStub(id, async (request: Request) => {
        throw new Error("Unexpected call to Room DO fetch " + request.url);
      });
    },
  };
}

test("AuthDO calls authHandler and sends resolved UserData in header to Room DO", async () => {
  const {
    testAuth,
    testRoomID,
    testRequest,
    testRoomDO,
    mocket,
    encodedTestAuth,
  } = createTestFixture();

  const authDONonMiniflare = new BaseAuthDO(
    {
      roomDO: testRoomDO,
      state: {} as DurableObjectState,
      authHandler: async (auth, roomID) => {
        expect(auth).toEqual(testAuth);
        expect(roomID).toEqual(testRoomID);
        return { userID: auth + ":" + roomID };
      },
      logger: new TestLogger(),
      logLevel: "debug",
    },
    false
  );

  const response = await authDONonMiniflare.fetch(testRequest);

  expect(response.status).toEqual(101);
  expect(response.webSocket).toBe(mocket);
  expect(response.headers.get("Sec-WebSocket-Protocol")).toEqual(
    encodedTestAuth
  );

  const authDOMiniflare = new BaseAuthDO(
    {
      roomDO: testRoomDO,
      state: {} as DurableObjectState,
      authHandler: async (auth, roomID) => {
        expect(auth).toEqual(testAuth);
        expect(roomID).toEqual(testRoomID);
        return { userID: auth + ":" + roomID };
      },
      logger: new TestLogger(),
      logLevel: "debug",
    },
    true
  );

  const response2 = await authDOMiniflare.fetch(testRequest);
  expect(response2.status).toEqual(101);
  expect(response2.webSocket).toBe(mocket);
  expect(response2.headers.get("Sec-WebSocket-Protocol")).toBeNull();
});

test("AuthDO returns a 401 without calling Room DO if authHandler rejects", async () => {
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
  const authDO = new BaseAuthDO(
    {
      roomDO: createRoomDOThatThrowsIfFetchIsCalled(),
      state: {} as DurableObjectState,
      authHandler: async (auth, roomID) => {
        expect(auth).toEqual(testAuth);
        expect(roomID).toEqual(testRoomID);
        throw new Error("Test authHandler reject");
      },
      logger: new TestLogger(),
      logLevel: "debug",
    },
    false
  );

  const response = await authDO.fetch(testRequest);

  expect(response.status).toEqual(401);
  expect(response.webSocket).toBeUndefined();
});

test("AuthDO returns a 401 without calling Room DO if Sec-WebSocket-Protocol header is not present", async () => {
  const testRoomID = "testRoomID1";
  const testClientID = "testClientID1";

  const headers = new Headers();
  const testRequest = new Request(
    `ws://test.roci.dev/connect?roomID=${testRoomID}&clientID=${testClientID}`,
    {
      headers,
    }
  );

  const authDO = new BaseAuthDO(
    {
      roomDO: createRoomDOThatThrowsIfFetchIsCalled(),
      state: {} as DurableObjectState,
      authHandler: async (_auth, _roomID) => {
        throw new Error("Unexpected call to authHandler");
      },
      logger: new TestLogger(),
      logLevel: "debug",
    },
    false
  );

  const response = await authDO.fetch(testRequest);

  expect(response.status).toEqual(401);
  expect(response.webSocket).toBeUndefined();
});

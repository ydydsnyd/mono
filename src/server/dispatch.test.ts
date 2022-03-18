import { test, expect } from "@jest/globals";
import type {
  InvalidateForRoom,
  InvalidateForUser,
} from "../protocol/api/auth";
import { LogContext, SilentLogger } from "../util/logger";
import { dispatch } from "./dispatch";

function createThrowingHandlers() {
  return {
    connect: () => {
      throw new Error("unexpect call to connect handler");
    },
    authInvalidateForUser: () => {
      throw new Error("unexpect call to authInvalidateForUser handler");
    },
    authInvalidateForRoom: () => {
      throw new Error("unexpect call to authInvalidateForRoom handler");
    },
    authInvalidateAll: () => {
      throw new Error("unexpect call to authInvalidateAll handler");
    },
  };
}

test("unsupported path", async () => {
  const testRequest = new Request("https://test.roci.dev/bad_path");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(response.status).toEqual(400);
  expect(await response.text()).toEqual("Unsupported path.");
});

test("connect good request", async () => {
  const testRequest = new Request("ws://test.roci.dev/connect");
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    {
      ...createThrowingHandlers(),
      connect: (_lc: LogContext, request: Request, body: undefined) => {
        expect(request).toBe(testRequest);
        expect(body).toBeUndefined();
        return Promise.resolve(testResponse);
      },
    }
  );
  expect(response).toBe(testResponse);
});

test("connect request with validation errors", async () => {
  const testRequestBadProtocol = new Request("https://test.roci.dev/connect");
  const responseForBadProtocol = await dispatch(
    testRequestBadProtocol,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadProtocol.status).toEqual(400);
  expect(await responseForBadProtocol.text()).toEqual(
    'Unsupported protocol. Use "ws:".'
  );

  const testRequestBadMethod = new Request("ws://test.roci.dev/connect", {
    method: "post",
  });
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(400);
  expect(await responseForBadMethod.text()).toEqual(
    'Unsupported method. Use "get".'
  );
});

test("authInvalidateForUser good request", async () => {
  const testUserID = "testUserID1";
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    {
      ...createThrowingHandlers(),
      authInvalidateForUser: (
        _lc: LogContext,
        request: Request,
        body: InvalidateForUser
      ) => {
        expect(request).toBe(testRequest);
        expect(body).toEqual({
          userID: testUserID,
        });
        return Promise.resolve(testResponse);
      },
    }
  );
  expect(response).toBe(testResponse);
});

test("authInvalidateForUser request with validation errors", async () => {
  const testUserID = "testUserID1";
  const testRequestBadProtocol = new Request(
    `http://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const responseForBadProtocol = await dispatch(
    testRequestBadProtocol,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadProtocol.status).toEqual(400);
  expect(await responseForBadProtocol.text()).toEqual(
    'Unsupported protocol. Use "https:".'
  );

  const testRequestBadMethod = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "put",
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(400);
  expect(await responseForBadMethod.text()).toEqual(
    'Unsupported method. Use "post".'
  );

  const testRequestBadBody = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      body: JSON.stringify({
        roomID: testUserID,
      }),
    }
  );
  const responseForBadBody = await dispatch(
    testRequestBadBody,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadBody.status).toEqual(400);
  expect(await responseForBadBody.text()).toEqual(
    "Body schema error. At path: userID -- Expected a string, but received: undefined"
  );
});

test("authInvalidateForRoom good request", async () => {
  const testRoomID = "testRoomID1";
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    {
      ...createThrowingHandlers(),
      authInvalidateForRoom: (
        _lc: LogContext,
        request: Request,
        body: InvalidateForRoom
      ) => {
        expect(request).toBe(testRequest);
        expect(body).toEqual({
          roomID: testRoomID,
        });
        return Promise.resolve(testResponse);
      },
    }
  );
  expect(response).toBe(testResponse);
});

test("authInvalidateForRoom request with validation errors", async () => {
  const testRoomID = "testRoomID1";
  const testRequestBadProtocol = new Request(
    `http://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const responseForBadProtocol = await dispatch(
    testRequestBadProtocol,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadProtocol.status).toEqual(400);
  expect(await responseForBadProtocol.text()).toEqual(
    'Unsupported protocol. Use "https:".'
  );

  const testRequestBadMethod = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "put",
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(400);
  expect(await responseForBadMethod.text()).toEqual(
    'Unsupported method. Use "post".'
  );

  const testRequestBadBody = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      body: JSON.stringify({
        userID: testRoomID,
      }),
    }
  );
  const responseForBadBody = await dispatch(
    testRequestBadBody,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadBody.status).toEqual(400);
  expect(await responseForBadBody.text()).toEqual(
    "Body schema error. At path: roomID -- Expected a string, but received: undefined"
  );
});

test("authInvalidateAll good request", async () => {
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      method: "post",
    }
  );
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    {
      ...createThrowingHandlers(),
      authInvalidateAll: (
        _lc: LogContext,
        request: Request,
        body: undefined
      ) => {
        expect(request).toBe(testRequest);
        expect(body).toBeUndefined();
        return Promise.resolve(testResponse);
      },
    }
  );
  expect(response).toBe(testResponse);
});

test("authInvalidateAll request with validation errors", async () => {
  const testRequestBadProtocol = new Request(
    `http://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      method: "post",
    }
  );
  const responseForBadProtocol = await dispatch(
    testRequestBadProtocol,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadProtocol.status).toEqual(400);
  expect(await responseForBadProtocol.text()).toEqual(
    'Unsupported protocol. Use "https:".'
  );

  const testRequestBadMethod = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      method: "put",
    }
  );
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(400);
  expect(await responseForBadMethod.text()).toEqual(
    'Unsupported method. Use "post".'
  );
});

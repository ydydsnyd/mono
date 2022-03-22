import { test, expect } from "@jest/globals";
import type {
  InvalidateForRoom,
  InvalidateForUser,
} from "../protocol/api/auth";
import { LogContext, SilentLogger } from "../util/logger";
import { createAuthAPIHeaders } from "./auth-api-test-utils";
import { dispatch } from "./dispatch";

const testAuthApiKey = "TEST_REFLECT_AUTH_API_KEY_TEST";

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
    undefined,
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
    undefined,
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
  const testRequestBadMethod = new Request("ws://test.roci.dev/connect", {
    method: "post",
  });
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    undefined,
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(405);
  expect(await responseForBadMethod.text()).toEqual(
    'Method not allowed. Use "get".'
  );
});

test("authInvalidateForUser good request", async () => {
  const testUserID = "testUserID1";

  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
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
  const testRequestBadMethod = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "put",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(405);
  expect(await responseForBadMethod.text()).toEqual(
    'Method not allowed. Use "post".'
  );

  const testRequestBadBody = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        roomID: testUserID,
      }),
    }
  );
  const responseForBadBody = await dispatch(
    testRequestBadBody,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForBadBody.status).toEqual(400);
  expect(await responseForBadBody.text()).toEqual(
    "Body schema error. At path: userID -- Expected a string, but received: undefined"
  );

  const testRequestMissingAuthApiKey = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const responseForMissingAuthApiKey = await dispatch(
    testRequestMissingAuthApiKey,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForMissingAuthApiKey.status).toEqual(401);
  expect(await responseForMissingAuthApiKey.text()).toEqual("Unauthorized");

  const testRequestWrongAuthApiKey = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForUser`,
    {
      method: "post",
      headers: createAuthAPIHeaders("WRONG_API_KEY"),
      body: JSON.stringify({
        userID: testUserID,
      }),
    }
  );
  const responseForWrongAuthApiKey = await dispatch(
    testRequestWrongAuthApiKey,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForWrongAuthApiKey.status).toEqual(401);
  expect(await responseForWrongAuthApiKey.text()).toEqual("Unauthorized");
});

test("authInvalidateForRoom good request", async () => {
  const testRoomID = "testRoomID1";
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
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
  const testRequestBadMethod = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "put",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(405);
  expect(await responseForBadMethod.text()).toEqual(
    'Method not allowed. Use "post".'
  );

  const testRequestBadBody = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        userID: testRoomID,
      }),
    }
  );
  const responseForBadBody = await dispatch(
    testRequestBadBody,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForBadBody.status).toEqual(400);
  expect(await responseForBadBody.text()).toEqual(
    "Body schema error. At path: roomID -- Expected a string, but received: undefined"
  );

  const testRequestMissingAuthApiKey = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const responseForMissingAuthApiKey = await dispatch(
    testRequestMissingAuthApiKey,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForMissingAuthApiKey.status).toEqual(401);
  expect(await responseForMissingAuthApiKey.text()).toEqual("Unauthorized");

  const testRequestWrongAuthApiKey = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateForRoom`,
    {
      method: "post",
      headers: createAuthAPIHeaders("WRONG_API_KEY"),
      body: JSON.stringify({
        roomID: testRoomID,
      }),
    }
  );
  const responseForWrongAuthApiKey = await dispatch(
    testRequestWrongAuthApiKey,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForWrongAuthApiKey.status).toEqual(401);
  expect(await responseForWrongAuthApiKey.text()).toEqual("Unauthorized");
});

test("authInvalidateAll good request", async () => {
  const testRequest = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      headers: createAuthAPIHeaders(testAuthApiKey),
      method: "post",
    }
  );
  const testResponse = new Response("");
  const response = await dispatch(
    testRequest,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
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
  const testRequestBadMethod = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      headers: createAuthAPIHeaders(testAuthApiKey),
      method: "put",
    }
  );
  const responseForBadMethod = await dispatch(
    testRequestBadMethod,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForBadMethod.status).toEqual(405);
  expect(await responseForBadMethod.text()).toEqual(
    'Method not allowed. Use "post".'
  );

  const testRequestMissingAuthApiKey = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      method: "post",
    }
  );
  const responseForMissingAuthApiKey = await dispatch(
    testRequestMissingAuthApiKey,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForMissingAuthApiKey.status).toEqual(401);
  expect(await responseForMissingAuthApiKey.text()).toEqual("Unauthorized");

  const testRequestWrongAuthApiKey = new Request(
    `https://test.roci.dev/api/auth/v0/invalidateAll`,
    {
      method: "post",
      headers: createAuthAPIHeaders("WRONG_API_KEY"),
    }
  );
  const responseForWrongAuthApiKey = await dispatch(
    testRequestWrongAuthApiKey,
    new LogContext(new SilentLogger()),
    testAuthApiKey,
    createThrowingHandlers()
  );
  expect(responseForWrongAuthApiKey.status).toEqual(401);
  expect(await responseForWrongAuthApiKey.text()).toEqual("Unauthorized");
});

test("auth api returns 401 for all requests when authApiKey is undefined", async () => {
  async function testUnauthorizedWhenAuthApiKeyIsUndefined(request: Request) {
    const response = await dispatch(
      request,
      new LogContext(new SilentLogger()),
      undefined,
      createThrowingHandlers()
    );
    expect(response.status).toEqual(401);
    expect(await response.text()).toEqual("Unauthorized");
  }
  await testUnauthorizedWhenAuthApiKeyIsUndefined(
    new Request(`https://test.roci.dev/api/auth/v0/invalidateForUser`, {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        userID: "testUserID1",
      }),
    })
  );
  await testUnauthorizedWhenAuthApiKeyIsUndefined(
    new Request(`https://test.roci.dev/api/auth/v0/invalidateForRoom`, {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
      body: JSON.stringify({
        roomID: "testRoomID1",
      }),
    })
  );
  await testUnauthorizedWhenAuthApiKeyIsUndefined(
    new Request(`https://test.roci.dev/api/auth/v0/invalidateAll`, {
      method: "post",
      headers: createAuthAPIHeaders(testAuthApiKey),
    })
  );
});

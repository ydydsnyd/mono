import { encodeHeaderValue } from "../util/headers";
import { AuthHandler, UserData, USER_DATA_HEADER_NAME } from "./auth";

declare const MINIFLARE: boolean | undefined;

export interface Bindings {
  server: DurableObjectNamespace;
}

function createUnauthorizedResponse(message = "Unauthorized"): Response {
  return new Response(message, {
    status: 401,
  });
}

async function handleRequest(
  request: Request,
  env: Bindings,
  authHandler: AuthHandler,
  isMiniflare: boolean
): Promise<Response> {
  // Match route against pattern /:name/*action
  const url = new URL(request.url);

  if (url.pathname !== "/connect") {
    return new Response("unknown route", {
      status: 400,
    });
  }

  const roomID = url.searchParams.get("roomID");
  if (roomID === null || roomID === "") {
    return new Response("roomID parameter required", {
      status: 400,
    });
  }

  const clientID = url.searchParams.get("clientID");
  if (!clientID) {
    return new Response("clientID parameter required", {
      status: 400,
    });
  }

  const encodedAuth = request.headers.get("Sec-WebSocket-Protocol");
  if (!encodedAuth) {
    return createUnauthorizedResponse("auth required");
  }
  let auth: string | undefined;
  try {
    auth = decodeURIComponent(encodedAuth);
  } catch (e) {
    return createUnauthorizedResponse("invalid auth");
  }

  let userData: UserData | undefined;
  try {
    userData = await authHandler(auth, roomID);
  } catch (e) {
    return createUnauthorizedResponse();
  }
  if (!userData || !userData.userID) {
    return createUnauthorizedResponse();
  }

  // Forward the request to the named Durable Object...
  const { server } = env;
  const id = server.idFromName(roomID);
  const stub = server.get(id);
  const requestToDO = new Request(request);
  requestToDO.headers.set(
    USER_DATA_HEADER_NAME,
    encodeHeaderValue(JSON.stringify(userData))
  );
  const responseFromDO = await stub.fetch(requestToDO);
  const responseHeaders = new Headers(responseFromDO.headers);
  // While Sec-WebSocket-Protocol is just being used as a mechanism for
  // sending `auth` since custom headers are not supported by the browser
  // WebSocket API, the Sec-WebSocket-Protocol semantics must be followed.
  // Send a Sec-WebSocket-Protocol response header with a value
  // matching the Sec-WebSocket-Protocol request header, to indicate
  // support for the protocol, otherwise the client will close the connection.
  if (!isMiniflare) {
    // ...miniflare doesn't like it though. If we set this header under MF,
    // sending the response fails. See:
    // https://github.com/cloudflare/miniflare/issues/179
    responseHeaders.set("Sec-WebSocket-Protocol", encodedAuth);
  }

  const response = new Response(responseFromDO.body, {
    status: responseFromDO.status,
    statusText: responseFromDO.statusText,
    webSocket: responseFromDO.webSocket,
    headers: responseHeaders,
  });
  return response;
}

export function createWorker(
  authHandler: AuthHandler
): ExportedHandler<Bindings> {
  return createWorkerInternal(authHandler, typeof MINIFLARE !== "undefined");
}

// Exported for testing.
export function createWorkerInternal(
  authHandler: AuthHandler,
  isMiniflare: boolean
): ExportedHandler<Bindings> {
  return {
    fetch: async (request: Request, env: Bindings) => {
      console.debug("handling connection:", request.url);
      const resp = await handleRequest(request, env, authHandler, isMiniflare);
      console.debug(
        `Returning connect response: ${resp.status} ${resp.statusText}`
      );
      return resp;
    },
  };
}

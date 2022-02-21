import {
  consoleLogger,
  LogContext,
  Logger,
  LogLevel,
  OptionalLoggerImpl,
} from "../util/logger";
import { encodeHeaderValue } from "../util/headers";
import { AuthHandler, UserData, USER_DATA_HEADER_NAME } from "./auth";
import { randomID } from "../util/rand";

export interface WorkerOptions {
  authHandler: AuthHandler;
  logger?: Logger;
  logLevel?: LogLevel;
}

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
  lc: LogContext,
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

  lc = lc.addContext("client", clientID).addContext("room", roomID);

  const encodedAuth = request.headers.get("Sec-WebSocket-Protocol");
  if (!encodedAuth) {
    lc.info?.("auth not found in Sec-WebSocket-Protocol header.");
    return createUnauthorizedResponse("auth required");
  }
  let auth: string | undefined;
  try {
    auth = decodeURIComponent(encodedAuth);
  } catch (e) {
    lc.info?.("error decoding auth found in Sec-WebSocket-Protocol header.");
    return createUnauthorizedResponse("invalid auth");
  }

  let userData: UserData | undefined;
  try {
    userData = await authHandler(auth, roomID);
  } catch (e) {
    return createUnauthorizedResponse();
  }
  if (!userData || !userData.userID) {
    if (!userData) {
      lc.info?.("userData returned by authHandler is falsey.");
    } else if (!userData.userID) {
      lc.info?.("userData returned by authHandler has no userID.");
    }
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
  options: WorkerOptions
): ExportedHandler<Bindings> {
  return createWorkerInternal(options, typeof MINIFLARE !== "undefined");
}

// Exported for testing.
export function createWorkerInternal(
  options: WorkerOptions,
  isMiniflare: boolean
): ExportedHandler<Bindings> {
  const { authHandler, logger = consoleLogger, logLevel = "debug" } = options;
  const optionalLogger = new OptionalLoggerImpl(logger, logLevel);
  return {
    fetch: async (request: Request, env: Bindings) => {
      // TODO: pass request id through to DO so that requests can be
      // traced between worker and DO.
      const lc = new LogContext(optionalLogger).addContext("req", randomID());
      lc.debug?.("Handling connection:", request.url);
      const resp = await handleRequest(
        request,
        env,
        authHandler,
        lc,
        isMiniflare
      );
      lc.debug?.(
        `Returning connect response: ${resp.status} ${resp.statusText}`
      );
      return resp;
    },
  };
}

import { LogContext, LogSink, LogLevel } from "@rocicorp/logger";
import { encodeHeaderValue } from "src/util/headers";
import { randomID } from "../util/rand";
import { AuthHandler, UserData, USER_DATA_HEADER_NAME } from "./auth";

export interface NoAuthDOWorkerOptions<Env extends BaseNoAuthDOWorkerEnv> {
  getLogSink: (env: Env) => LogSink;
  getLogLevel: (env: Env) => LogLevel;
  authHandler: AuthHandler;
}

export interface BaseNoAuthDOWorkerEnv {
  roomDO: DurableObjectNamespace;
}

export function createNoAuthDOWorker<Env extends BaseNoAuthDOWorkerEnv>(
  options: NoAuthDOWorkerOptions<Env>,
  isMiniflare = typeof MINIFLARE !== "undefined"
): ExportedHandler<Env> {
  const { getLogSink, getLogLevel, authHandler } = options;
  return {
    fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
      return withLogContext(
        env,
        ctx,
        getLogSink,
        getLogLevel,
        (lc: LogContext) =>
          fetch(request, lc, env.roomDO, authHandler, isMiniflare)
      );
    },
    scheduled: async (
      _controller: ScheduledController,
      env: Env,
      ctx: ExecutionContext
    ) => {
      return withLogContext(
        env,
        ctx,
        getLogSink,
        getLogLevel,
        (lc: LogContext) => scheduled(env, lc)
      );
    },
  };
}

async function scheduled(
  _env: BaseNoAuthDOWorkerEnv,
  lc: LogContext
): Promise<void> {
  lc = lc.addContext("scheduled", randomID());
  lc.info?.("Ignoring scheduled event because not configured with AuthDO");
  return;
}

async function fetch(
  request: Request,
  lc: LogContext,
  roomDO: DurableObjectNamespace,
  authHandler: AuthHandler,
  isMiniflare: boolean
) {
  // TODO: pass request id through so request can be traced across
  // worker and DOs.
  lc = lc.addContext("req", randomID());
  lc.debug?.("Handling request:", request.url);
  try {
    const resp = await handleRequest(
      request,
      lc,
      roomDO,
      authHandler,
      isMiniflare
    );
    lc.debug?.(`Returning response: ${resp.status} ${resp.statusText}`);
    return resp;
  } catch (e) {
    lc.error?.("Unhandled exception in fetch", e);
    return new Response(e instanceof Error ? e.message : "Unexpected error.", {
      status: 500,
    });
  }
}

async function handleRequest(
  request: Request,
  lc: LogContext,
  roomDO: DurableObjectNamespace,
  authHandler: AuthHandler,
  isMiniflare: boolean
): Promise<Response> {
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
    lc.info?.("auth not found in Sec-WebSocket-Protocol header.");
    return createUnauthorizedResponse("auth required");
  }
  let decodedAuth: string | undefined;
  try {
    decodedAuth = decodeURIComponent(encodedAuth);
  } catch (e) {
    lc.info?.("error decoding auth found in Sec-WebSocket-Protocol header.");
    return createUnauthorizedResponse("invalid auth");
  }
  const auth = decodedAuth;

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
  // Forward the request to the Room Durable Object for roomID...
  const id = roomDO.idFromName(roomID);
  const stub = roomDO.get(id);
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

async function withLogContext<Env extends BaseNoAuthDOWorkerEnv, R>(
  env: Env,
  ctx: ExecutionContext,
  getLogSink: (env: Env) => LogSink,
  getLogLevel: (env: Env) => LogLevel,
  fn: (lc: LogContext) => Promise<R>
): Promise<R> {
  const logSink = getLogSink(env);
  const lc = new LogContext(getLogLevel(env), logSink).addContext("Worker");
  try {
    return await fn(lc);
  } finally {
    if (logSink.flush) {
      ctx.waitUntil(logSink.flush());
    }
  }
}

function createUnauthorizedResponse(message = "Unauthorized"): Response {
  return new Response(message, {
    status: 401,
  });
}

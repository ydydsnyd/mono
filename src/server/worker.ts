import { LogContext, LogSink, LogLevel } from "@rocicorp/logger";
import { Router } from "itty-router";
import { randomID } from "../util/rand";
import { createAuthAPIHeaders } from "./auth-api-headers";
import { dispatch, paths } from "./dispatch";
import { paths as authDOPaths } from "./auth-do-routes";
import { IttyRequest, requireAuthAPIKeyMatchesEnv } from "./middleware";

export interface WorkerOptions<Env extends BaseWorkerEnv> {
  getLogSink: (env: Env) => LogSink;
  getLogLevel: (env: Env) => LogLevel;
}

export interface BaseWorkerEnv {
  authDO: DurableObjectNamespace;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  REFLECT_AUTH_API_KEY?: string;
}

// Set up routes for authDO API calls that are not handled by
// dispatch.
const router = Router();
for (const path of authDOPaths()) {
  router.all(path, requireAuthAPIKeyMatchesEnv, sendToAuthDO);
}

export function createWorker<Env extends BaseWorkerEnv>(
  options: WorkerOptions<Env>
): ExportedHandler<Env> {
  const { getLogSink, getLogLevel } = options;
  return {
    fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
      return withLogContext(
        env,
        ctx,
        getLogSink,
        getLogLevel,
        (lc: LogContext) => fetch(request, env, lc)
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

async function scheduled(env: BaseWorkerEnv, lc: LogContext): Promise<void> {
  lc = lc.addContext("scheduled", randomID());
  lc.info?.("Handling scheduled event");
  if (!env.REFLECT_AUTH_API_KEY) {
    lc.debug?.(
      "Returning early because REFLECT_AUTH_API_KEY is not defined in env."
    );
    return;
  }
  lc.info?.(`Sending ${paths.authRevalidateConnections} request to AuthDO`);
  const resp = await sendToAuthDO(
    new Request(
      `https://unused-reflect-auth-do.dev${paths.authRevalidateConnections}`,
      {
        headers: createAuthAPIHeaders(env.REFLECT_AUTH_API_KEY),
        method: "POST",
      }
    ),
    env
  );
  lc.info?.(`Response: ${resp.status} ${resp.statusText}`);
}

async function fetch(request: Request, env: BaseWorkerEnv, lc: LogContext) {
  // TODO: pass request id through so request can be traced across
  // worker and DOs.
  lc = lc.addContext("req", randomID());
  lc.debug?.("Handling request:", request.url);
  try {
    // Try newfangled routing first.
    let resp = await router.handle(request, env);
    if (resp === undefined) {
      resp = await handleRequest(request, lc, env);
    }
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
  env: BaseWorkerEnv
): Promise<Response> {
  const forwardToAuthDO = (_lc: LogContext, request: Request) =>
    sendToAuthDO(request, env);
  return dispatch(request, lc, env.REFLECT_AUTH_API_KEY, {
    createRoom: forwardToAuthDO,
    connect: forwardToAuthDO,
    authInvalidateForUser: forwardToAuthDO,
    authInvalidateForRoom: forwardToAuthDO,
    authInvalidateAll: forwardToAuthDO,
  });
}

async function withLogContext<Env extends BaseWorkerEnv, R>(
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

function sendToAuthDO(
  request: IttyRequest,
  env: BaseWorkerEnv
): Promise<Response> {
  const { authDO } = env;
  const id = authDO.idFromName("auth");
  const stub = authDO.get(id);
  return stub.fetch(request as Request);
}

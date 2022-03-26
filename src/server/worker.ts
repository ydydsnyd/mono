import {
  LogContext,
  Logger,
  LogLevel,
  OptionalLoggerImpl,
} from "../util/logger";
import { randomID } from "../util/rand";
import { createAuthAPIHeaders } from "./auth-api-headers";
import { dispatch } from "./dispatch";

export interface WorkerOptions<Env extends BaseWorkerEnv> {
  createLogger: (env: Env) => Logger;
  getLogLevel: (env: Env) => LogLevel;
}

export interface BaseWorkerEnv {
  authDO: DurableObjectNamespace;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  REFLECT_AUTH_API_KEY?: string;
}

export function createWorker<Env extends BaseWorkerEnv>(
  options: WorkerOptions<Env>
): ExportedHandler<Env> {
  const { createLogger, getLogLevel } = options;
  return {
    fetch: async (request: Request, env: Env, ctx: ExecutionContext) => {
      return withLogContext(
        env,
        ctx,
        createLogger,
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
        createLogger,
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
  lc.info?.("Sending api/auth/v0/revalidateConnections requests to AuthDO");
  const resp = await sendToAuthDO(
    env,
    new Request(
      "https://unused-reflect-auth-do.dev/api/auth/v0/revalidateConnections",
      {
        headers: createAuthAPIHeaders(env.REFLECT_AUTH_API_KEY),
        method: "POST",
      }
    )
  );
  lc.info?.(`Response: ${resp.status} ${resp.statusText}`);
}

async function fetch(request: Request, env: BaseWorkerEnv, lc: LogContext) {
  // TODO: pass request id through so request can be traced across
  // worker and DOs.
  lc = lc.addContext("req", randomID());
  lc.debug?.("Handling request:", request.url);
  try {
    const resp = await handleRequest(request, lc, env);
    lc.debug?.(`Returning response: ${resp.status} ${resp.statusText}`);
    return resp;
  } catch (e) {
    lc.info?.("Unhandled exception", e);
    throw e;
  }
}

async function handleRequest(
  request: Request,
  lc: LogContext,
  env: BaseWorkerEnv
): Promise<Response> {
  const forwardToAuthDO = (_lc: LogContext, request: Request) =>
    sendToAuthDO(env, request);
  return dispatch(request, lc, env.REFLECT_AUTH_API_KEY, {
    connect: forwardToAuthDO,
    authInvalidateForUser: forwardToAuthDO,
    authInvalidateForRoom: forwardToAuthDO,
    authInvalidateAll: forwardToAuthDO,
  });
}

async function withLogContext<Env extends BaseWorkerEnv, R>(
  env: Env,
  ctx: ExecutionContext,
  createLogger: (env: Env) => Logger,
  getLogLevel: (env: Env) => LogLevel,
  fn: (lc: LogContext) => Promise<R>
): Promise<R> {
  const logger = createLogger(env);
  const optionalLogger = new OptionalLoggerImpl(logger, getLogLevel(env));
  const lc = new LogContext(optionalLogger).addContext("Worker");
  try {
    return await fn(lc);
  } finally {
    if (logger.flush) {
      ctx.waitUntil(logger.flush());
    }
  }
}

function sendToAuthDO(env: BaseWorkerEnv, request: Request): Promise<Response> {
  const { authDO } = env;
  const id = authDO.idFromName("auth");
  const stub = authDO.get(id);
  return stub.fetch(request);
}

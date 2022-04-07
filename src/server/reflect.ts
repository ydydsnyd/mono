import type { MutatorDefs } from "replicache";
import {
  consoleLogSink,
  LogSink,
  LogLevel,
  TeeLogSink,
} from "@rocicorp/logger";
import type { AuthHandler } from "./auth";
import { BaseAuthDO } from "./auth-do";
import { BaseRoomDO } from "./room-do";
import { createWorker } from "./worker";

export interface ReflectServerOptions<
  Env extends ReflectServerBaseEnv,
  MD extends MutatorDefs
> {
  mutators: MD;
  authHandler: AuthHandler;
  getLogSinks?: (env: Env) => LogSink[];
  getLogLevel?: (env: Env) => LogLevel;
}

function combineLogSinks(sinks: LogSink[]): LogSink {
  if (sinks.length === 1) {
    return sinks[0];
  }
  return new TeeLogSink(sinks);
}

export interface ReflectServerBaseEnv {
  roomDO: DurableObjectNamespace;
  authDO: DurableObjectNamespace;
  /**
   * If not bound the Auth API will be disabled.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  REFLECT_AUTH_API_KEY?: string;
}

export type DurableObjectCtor<Env> = new (
  state: DurableObjectState,
  env: Env
) => DurableObject;

export function createReflectServer<
  Env extends ReflectServerBaseEnv,
  MD extends MutatorDefs
>(
  options: ReflectServerOptions<Env, MD>
): {
  worker: ExportedHandler<Env>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  RoomDO: DurableObjectCtor<Env>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AuthDO: DurableObjectCtor<Env>;
} {
  const {
    authHandler,
    getLogSinks = (_env) => [consoleLogSink],
    getLogLevel = (_env) => "debug",
  } = options;

  const roomDOClass = class extends BaseRoomDO<MD> {
    constructor(state: DurableObjectState, env: Env) {
      super({
        mutators: options.mutators,
        state,
        authApiKey: env.REFLECT_AUTH_API_KEY,
        logSink: combineLogSinks(getLogSinks(env)),
        logLevel: getLogLevel(env),
      });
    }
  };

  const authDOClass = class extends BaseAuthDO {
    constructor(state: DurableObjectState, env: Env) {
      super({
        roomDO: env.roomDO,
        state,
        authHandler,
        authApiKey: env.REFLECT_AUTH_API_KEY,
        logSink: combineLogSinks(getLogSinks(env)),
        logLevel: getLogLevel(env),
      });
    }
  };

  const worker = createWorker<Env>({
    getLogSink: (env) => combineLogSinks(getLogSinks(env)),
    getLogLevel,
  });

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { worker, RoomDO: roomDOClass, AuthDO: authDOClass };
}

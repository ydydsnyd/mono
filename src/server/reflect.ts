import type { MutatorDefs } from "replicache";
import { consoleLogger, Logger, LogLevel } from "../util/logger";
import type { AuthHandler } from "./auth";
import { BaseAuthDO } from "./auth-do";
import { BaseRoomDO } from "./room-do";
import { createWorker } from "./worker";

export interface ReflectOptions<
  Env extends ReflectBaseEnv,
  MD extends MutatorDefs
> {
  mutators: MD;
  authHandler: AuthHandler;
  createLogger?: (env: Env) => Logger;
  getLogLevel?: (env: Env) => LogLevel;
}

export interface ReflectBaseEnv {
  roomDO: DurableObjectNamespace;
  authDO: DurableObjectNamespace;
}

export type DurableObjectCtor<Env> = new (
  state: DurableObjectState,
  env: Env
) => DurableObject;

export function createReflect<
  Env extends ReflectBaseEnv,
  MD extends MutatorDefs
>(
  options: ReflectOptions<Env, MD>
): {
  worker: ExportedHandler<Env>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  RoomDO: DurableObjectCtor<Env>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AuthDO: DurableObjectCtor<Env>;
} {
  const {
    authHandler,
    createLogger = (_env) => consoleLogger,
    getLogLevel = (_env) => "debug",
  } = options;

  const roomDOClass = class extends BaseRoomDO<MD> {
    constructor(state: DurableObjectState, env: Env) {
      super({
        mutators: options.mutators,
        state,
        logger: createLogger(env),
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
        logger: createLogger(env),
        logLevel: getLogLevel(env),
      });
    }
  };

  const worker = createWorker<Env>({
    createLogger,
    getLogLevel,
  });

  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { worker, RoomDO: roomDOClass, AuthDO: authDOClass };
}

import {
  InvalidateForRoom,
  invalidateForRoomSchema,
  InvalidateForUser,
  invalidateForUserSchema,
} from "../protocol/api/auth";
import { Struct, validate } from "superstruct";
import type { LogContext } from "../util/logger";

export type Handler<T = undefined> = (
  lc: LogContext,
  request: Request,
  body: T
) => Promise<Response>;

export interface Handlers {
  connect: Handler;
  authInvalidateForUser: Handler<InvalidateForUser>;
  authInvalidateForRoom: Handler<InvalidateForRoom>;
  authInvalidateAll: Handler;
}

export function dispatch(
  request: Request,
  lc: LogContext,
  handlers: Handlers
): Promise<Response> {
  const url = new URL(request.url);
  lc.debug?.("Dispatching path", url.pathname);

  async function validateAndDispatch<T>(
    handlerName: string,
    protocol: "https:" | "ws:",
    method: string,
    validateBody: (request: Request) => Promise<ValidateResult<T>>,
    handler: Handler<T>
  ): Promise<Response> {
    if (url.protocol.toLowerCase() !== protocol.toLowerCase()) {
      return new Response(`Unsupported protocol. Use "${protocol}".`, {
        status: 400,
      });
    }
    if (request.method.toLowerCase() !== method.toLowerCase()) {
      return new Response(`Unsupported method. Use "${method}".`, {
        status: 400,
      });
    }
    const validateResult = await validateBody(request);
    if (validateResult.errorResponse) {
      return validateResult.errorResponse;
    }
    lc.debug?.("Dispatching to handler", handlerName);
    return handler.call(handlers, lc, request, validateResult.value);
  }

  switch (url.pathname) {
    case "/connect":
      return validateAndDispatch(
        "connect",
        "ws:",
        "get",
        noOpValidateBody,
        handlers.connect
      );
    case "/api/auth/v0/invalidateForUser":
      return validateAndDispatch(
        "authInvalidateForUser",
        "https:",
        "post",
        (request) => validateBody(request, invalidateForUserSchema),
        handlers.authInvalidateForUser
      );
    case "/api/auth/v0/invalidateForRoom":
      return validateAndDispatch(
        "authInvalidateForRoom",
        "https:",
        "post",
        (request) => validateBody(request, invalidateForRoomSchema),
        handlers.authInvalidateForRoom
      );
    case "/api/auth/v0/invalidateAll":
      return validateAndDispatch(
        "authInvalidateForRoom",
        "https:",
        "post",
        noOpValidateBody,
        handlers.authInvalidateAll
      );
    default:
      return Promise.resolve(
        new Response("Unsupported path.", {
          status: 400,
        })
      );
  }
}

const noOpValidateBody = () =>
  Promise.resolve({ value: undefined, errorResponse: undefined });

type ValidateResult<T> =
  | { value: T; errorResponse: undefined }
  | { value: undefined; errorResponse: Response };

async function validateBody<T>(
  request: Request,
  struct: Struct<T>
): Promise<ValidateResult<T>> {
  let json;
  try {
    json = await request.json();
  } catch (e) {
    return {
      errorResponse: new Response("Body must be valid json.", { status: 400 }),
      value: undefined,
    };
  }
  const validateResult = validate(json, struct);
  if (validateResult[0]) {
    return {
      errorResponse: new Response(
        "Body schema error. " + validateResult[0].message,
        {
          status: 400,
        }
      ),
      value: undefined,
    };
  }
  return {
    value: validateResult[1],
    errorResponse: undefined,
  };
}

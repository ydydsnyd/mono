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

function createUnauthorizedResponse(message = "Unauthorized"): Response {
  return new Response(message, {
    status: 401,
  });
}

function createBadRequestResponse(message = "Bad Request"): Response {
  return new Response(message, {
    status: 400,
  });
}

export function dispatch(
  request: Request,
  lc: LogContext,
  authApiKey: string | undefined,
  handlers: Handlers
): Promise<Response> {
  const url = new URL(request.url);
  lc.debug?.("Dispatching path", url.pathname);

  async function validateAndDispatch<T>(
    handlerName: string,
    method: string,
    validateBody: (request: Request) => Promise<ValidateResult<T>>,
    handler: Handler<T>,
    apiKey?: "authApiKey"
  ): Promise<Response> {
    if (apiKey === "authApiKey") {
      if (authApiKey === undefined) {
        return createUnauthorizedResponse();
      }
      const authApiKeyHeaderValue = request.headers.get(
        "x-reflect-auth-api-key"
      );
      if (authApiKeyHeaderValue !== authApiKey) {
        return createUnauthorizedResponse();
      }
    }
    if (request.method.toLowerCase() !== method.toLowerCase()) {
      lc.debug?.(`Unsupported method ${request.method.toLowerCase()}`);
      return createBadRequestResponse(`Unsupported method. Use "${method}".`);
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
        "get",
        noOpValidateBody,
        handlers.connect
      );
    case "/api/auth/v0/invalidateForUser":
      return validateAndDispatch(
        "authInvalidateForUser",
        "post",
        (request) => validateBody(request, invalidateForUserSchema),
        handlers.authInvalidateForUser,
        "authApiKey"
      );
    case "/api/auth/v0/invalidateForRoom":
      return validateAndDispatch(
        "authInvalidateForRoom",
        "post",
        (request) => validateBody(request, invalidateForRoomSchema),
        handlers.authInvalidateForRoom,
        "authApiKey"
      );
    case "/api/auth/v0/invalidateAll":
      return validateAndDispatch(
        "authInvalidateForRoom",
        "post",
        noOpValidateBody,
        handlers.authInvalidateAll,
        "authApiKey"
      );
    default:
      return Promise.resolve(createBadRequestResponse("Unsupported path."));
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
    json = await request.clone().json();
  } catch (e) {
    return {
      errorResponse: new Response("Body must be valid json.", { status: 400 }),
      value: undefined,
    };
  }
  const validateResult = validate(json, struct);
  if (validateResult[0]) {
    return {
      errorResponse: createBadRequestResponse(
        "Body schema error. " + validateResult[0].message
      ),
      value: undefined,
    };
  }
  return {
    value: validateResult[1],
    errorResponse: undefined,
  };
}

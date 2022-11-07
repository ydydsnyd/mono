import {
  CreateRoomRequest,
  createRoomRequestSchema,
  InvalidateForRoomRequest,
  invalidateForRoomRequestSchema,
  InvalidateForUserRequest,
  invalidateForUserRequestSchema,
} from "../protocol/api/auth";
import { Struct, validate } from "superstruct";
import type { LogContext } from "@rocicorp/logger";

export type Handler<T = undefined> = (
  this: Handlers,
  lc: LogContext,
  request: Request,
  body: T
) => Promise<Response>;

// TODO This definition and dispatch() itself are used by *both* the
// authDO and the roomDO to route requests. This forces both DOs to
// implement exactly the same handlers and routes. It'd be better if each
// DO implemented its own dispatch, that way they could implement handlers
// that make sense for each. If we wanted to share dispatch implementation
// between DOs there'd be nothing stopping us from doing so, but we
// wouldn't be *forced* to have exact parity.
//
// TODO Also, we should probably use a routing library. Lots of this code
// can go away and what remains can become more DRY if we did. Two options
// that come to mind are itty router or express (itty more minimalist).
export interface Handlers {
  createRoom: Handler<CreateRoomRequest>;
  connect: Handler;
  authInvalidateForUser: Handler<InvalidateForUserRequest>;
  authInvalidateForRoom: Handler<InvalidateForRoomRequest>;
  authInvalidateAll: Handler;
  authRevalidateConnections?: Handler;
  authConnections?: Handler;
}

export const paths: Readonly<Record<keyof Handlers, string>> = {
  createRoom: "/createRoom",
  connect: "/connect",
  authInvalidateForUser: "/api/auth/v0/invalidateForUser",
  authInvalidateForRoom: "/api/auth/v0/invalidateForRoom",
  authInvalidateAll: "/api/auth/v0/invalidateAll",
  authRevalidateConnections: "/api/auth/v0/revalidateConnections",
  authConnections: "/api/auth/v0/connections",
};

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
  // If authApiKey is not provided, then the auth api is disabled.
  authApiKey: string | undefined,
  handlers: Handlers
): Promise<Response> {
  const url = new URL(request.url);
  lc.debug?.("Dispatching path", url.pathname);

  async function validateAndDispatch<T>(
    method: string,
    validateBody: (request: Request) => Promise<ValidateResult<T>>,
    handler: Handler<T> | undefined,
    // If set to 'authApiKey' then auth api auth is enforced on the handler. It
    // checks that the auth api key has been passed in Authorization. The idea is
    // that we could have multiple api keys, and this string would select which
    // to require.
    apiKey?: "authApiKey"
  ): Promise<Response> {
    if (!handler) {
      return createBadRequestResponse("Unsupported path.");
    }
    if (apiKey === "authApiKey") {
      // Auth API is disabled so everything is unauthorized.
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
      return Promise.resolve(
        new Response(`Method not allowed. Use "${method}".`, {
          status: 405,
        })
      );
    }
    const validateResult = await validateBody(request);
    if (validateResult.errorResponse) {
      return validateResult.errorResponse;
    }
    lc.debug?.("Calling handler");
    return handler.call(handlers, lc, request, validateResult.value);
  }

  switch (url.pathname) {
    case paths.createRoom:
      return validateAndDispatch(
        "post",
        (request) => validateBody(request, createRoomRequestSchema),
        handlers.createRoom,
        "authApiKey"
      );
    // TOOD(fritz) make a decision about auth key for createRoom
    // TODO(fritz) closeRoom. Must be authenticated.
    // TODO(fritz) deleteRoom. Must be authenticated.
    // TODO(fritz) migrate. Must be authenticated.
    case paths.connect:
      return validateAndDispatch("get", noOpValidateBody, handlers.connect);
    case paths.authInvalidateForUser:
      return validateAndDispatch(
        "post",
        (request) => validateBody(request, invalidateForUserRequestSchema),
        handlers.authInvalidateForUser,
        "authApiKey"
      );
    case paths.authInvalidateForRoom:
      return validateAndDispatch(
        "post",
        (request) => validateBody(request, invalidateForRoomRequestSchema),
        handlers.authInvalidateForRoom,
        "authApiKey"
      );
    case paths.authInvalidateAll:
      return validateAndDispatch(
        "post",
        noOpValidateBody,
        handlers.authInvalidateAll,
        "authApiKey"
      );
    case paths.authRevalidateConnections:
      return validateAndDispatch(
        "post",
        noOpValidateBody,
        handlers.authRevalidateConnections,
        "authApiKey"
      );
    case paths.authConnections:
      return validateAndDispatch(
        "get",
        noOpValidateBody,
        handlers.authConnections,
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

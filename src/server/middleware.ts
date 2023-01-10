import type {IRequest} from 'itty-router';

type Env = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  REFLECT_AUTH_API_KEY?: string | undefined;
};

// Middleware that requires the auth API key to match an argument. This is
// used in the authDO which does not have access to the env.
export function requireAuthAPIKeyMatches(
  authApiKey: string | undefined,
): (request: IRequest) => Response | undefined {
  return (request: IRequest) => {
    return requireAuthAPIKeyMatchesEnv(request, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      REFLECT_AUTH_API_KEY: authApiKey,
    });
  };
}

// Middleware that requires the auth API key in the env. This is used in the
// worker, which gets the key directly from the env.
export function requireAuthAPIKeyMatchesEnv(
  request: IRequest,
  env: Env,
): Response | undefined {
  const authHeader = request.headers.get('x-reflect-auth-api-key');
  if (authHeader === undefined || env.REFLECT_AUTH_API_KEY === undefined) {
    return newUnauthorizedResponse();
  }
  if (authHeader !== env.REFLECT_AUTH_API_KEY) {
    return newUnauthorizedResponse();
  }
  // Returning undefined is part of the itty contract: it says proceed in
  // processing the request by invoking the next handler.
  return undefined;
}

function newUnauthorizedResponse(msg = 'Unauthorized') {
  return new Response(msg, {
    status: 401,
  });
}

import type {LogContext} from '@rocicorp/logger';
import type {MaybePromise, ReadonlyJSONValue} from 'replicache';

export type Handler<Req, Resp> = (request: Req) => MaybePromise<Resp>;

export type Routed = Request & {
  parsedURL: URLPatternURLPatternResult;
  lc: LogContext;
};

type Route = {
  pattern: URLPattern;
  handler: Handler<Routed, Response>;
};

export function makeRouted(
  req: Request,
  parsedURL: URLPatternURLPatternResult,
  lc: LogContext,
): asserts req is Routed {
  const routed = req as Routed;
  routed.parsedURL = parsedURL;
  routed.lc = lc;
}

/**
 * Routes requests to a handler for processing and returns the response.
 *
 * Requests and responses are abstract, they don't need to be http `Request`.
 *
 * Handlers are typically chained together outside of router itself to create
 * "middleware", but that's convention. See below in this file for examples of
 * such middleware.
 */
export class Router {
  private _routes: Route[] = [];

  register(path: string, handler: Handler<Routed, Response>) {
    this._routes.push({
      pattern: new URLPattern({pathname: path}),
      handler,
    });
  }

  dispatch(
    request: Request,
    lc: LogContext,
  ): MaybePromise<Response | undefined> {
    const matches = this._routes
      .map(route => {
        const {pattern} = route;
        const result = pattern.exec(request.url);
        return {route, result};
      })
      .filter(({result}) => result);

    if (matches.length === 0) {
      lc.debug?.(`no matching route for ${request.url}`);
      return undefined;
    }

    const [match] = matches;
    const {route, result} = match;
    const {handler} = route;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    makeRouted(request, result!, lc);

    return handler(request);
  }
}

function requireMethod<Req extends Routed, Resp extends Response>(
  method: string,
  next: Handler<Req, Resp>,
) {
  return (request: Req) => {
    if (request.method !== method) {
      return new Response('unsupported method', {status: 405});
    }
    return next(request);
  };
}

export function get<Req extends Routed, Resp extends Response>(
  next: Handler<Req, Resp>,
) {
  return requireMethod('GET', next);
}

export function post<Req extends Routed, Resp extends Response>(
  next: Handler<Req, Resp>,
) {
  return requireMethod('POST', next);
}

export function requireAuthAPIKey<Req extends Routed, Resp>(
  required: () => string,
  next: Handler<Req, Resp>,
) {
  return (req: Req) => {
    const resp = checkAuthAPIKey(required(), req);
    if (resp) {
      return resp;
    }
    return next(req);
  };
}

export function checkAuthAPIKey<Req extends Request>(
  required: string,
  req: Req,
) {
  if (required === '') {
    throw new Error('Internal error: expected auth api key cannot be empty');
  }
  const authHeader = req.headers.get('x-reflect-auth-api-key');
  if (authHeader !== required) {
    return new Response('unauthorized', {
      status: 401,
    });
  }
  return undefined;
}

export type WithRoomID = Routed & {roomID: string};
export function withRoomID<Req extends Routed, Resp>(
  next: Handler<WithRoomID, Resp>,
) {
  return (req: Req) => {
    const {roomID} = req.parsedURL.pathname.groups;
    if (roomID === undefined) {
      throw new Error('Internal error: roomID not found by withRoomID');
    }
    const typed = req as unknown as WithRoomID;
    typed.roomID = roomID;
    return next(typed);
  };
}

export function asJSON<Req extends Routed>(
  next: Handler<Req, ReadonlyJSONValue>,
) {
  return async (req: Req) => new Response(JSON.stringify(await next(req)));
}

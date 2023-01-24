import type {LogContext} from '@rocicorp/logger';
import type {MaybePromise, ReadonlyJSONValue} from 'replicache';
import {createUnauthorizedResponse} from './create-unauthorized-response.js';

/**
 * Handles a request dispatched by router. Handlers are meant to be nested
 * in a chain, implementing the concept of "middleware" that validate and/or
 * compute additional parameters used by downstream handlers.
 *
 * Request is passed through the handler chain as-is, unmolested. Each
 * handler however can create a new, different `context` and pass this to
 * the next handler. This is how things like body validation are implemented.
 */
export type Handler<Context, Resp> = (
  context: Context,
  request: Request,
) => MaybePromise<Resp>;

export type WithLogContext = {
  lc: LogContext;
};

export type WithParsedURL = {
  parsedURL: URLPatternURLPatternResult;
};

export type BaseContext = WithLogContext & WithParsedURL;

type Route<Context> = {
  pattern: URLPattern;
  handler: Handler<Context, Response>;
};

/**
 * Routes requests to a handler for processing and returns the response.
 *
 * Requests and responses are abstract, they don't need to be http `Request`.
 *
 * Handlers are typically chained together outside of router itself to create
 * "middleware", but that's convention. See below in this file for examples of
 * such middleware.
 */
export class Router<InitialContext extends WithLogContext = WithLogContext> {
  private _routes: Route<InitialContext & WithParsedURL>[] = [];

  register(
    path: string,
    handler: Handler<InitialContext & WithParsedURL, Response>,
  ) {
    this._routes.push({
      pattern: new URLPattern({pathname: path}),
      handler,
    });
  }

  dispatch(
    request: Request,
    context: InitialContext,
  ): MaybePromise<Response | undefined> {
    const {lc} = context;
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
    return handler({...context, parsedURL: result!}, request);
  }
}

function requireMethod<Context extends BaseContext, Resp extends Response>(
  method: string,
  next: Handler<Context, Resp>,
) {
  return (context: Context, request: Request) => {
    if (request.method !== method) {
      return new Response('unsupported method', {status: 405});
    }
    return next(context, request);
  };
}

export function get<Context extends BaseContext, Resp extends Response>(
  next: Handler<Context, Resp>,
) {
  return requireMethod('GET', next);
}

export function post<Context extends BaseContext, Resp extends Response>(
  next: Handler<Context, Resp>,
) {
  return requireMethod('POST', next);
}

export function requireAuthAPIKey<Context extends BaseContext, Resp>(
  required: (context: Context) => string,
  next: Handler<Context, Resp>,
) {
  return (context: Context, req: Request) => {
    const resp = checkAuthAPIKey(required(context), req);
    if (resp) {
      return resp;
    }
    return next(context, req);
  };
}

export function checkAuthAPIKey(required: string | undefined, req: Request) {
  if (!required) {
    throw new Error('Internal error: expected auth api key cannot be empty');
  }
  const authHeader = req.headers.get('x-reflect-auth-api-key');
  if (authHeader !== required) {
    return createUnauthorizedResponse();
  }
  return undefined;
}

export type WithRoomID = {roomID: string};
export function withRoomID<Context extends BaseContext, Resp>(
  next: Handler<Context & WithRoomID, Resp>,
) {
  return (ctx: Context, req: Request) => {
    const {roomID} = ctx.parsedURL.pathname.groups;
    if (roomID === undefined) {
      throw new Error('Internal error: roomID not found by withRoomID');
    }
    return next({...ctx, roomID}, req);
  };
}

export function asJSON<Context extends BaseContext>(
  next: Handler<Context, ReadonlyJSONValue>,
) {
  return async (ctx: Context, req: Request) =>
    new Response(JSON.stringify(await next(ctx, req)));
}

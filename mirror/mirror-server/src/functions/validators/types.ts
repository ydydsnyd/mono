import type {CallableRequest} from 'firebase-functions/v2/https';

export type AsyncCallable<Request, Response> = (
  request: CallableRequest<Request>,
) => Promise<Response>;

export type AsyncHandler<Request, Response> = (
  request: Request,
  context: CallableRequest<Request>,
) => Promise<Response>;

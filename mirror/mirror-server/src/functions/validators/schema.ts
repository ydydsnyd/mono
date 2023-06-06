import {AsyncCallable, AsyncHandler} from './types';
import {CallableRequest} from 'firebase-functions/v2/https';
import * as v from 'shared/valitas.js';

export function withSchema<Request, Response>(
  requestSchema: v.Type<Request>,
  responseSchema: v.Type<Response>,
  handler: AsyncHandler<Request, Response>,
): AsyncCallable<Request, Response> {
  return async (req: CallableRequest<Request>) => {
    const res = await handler(requestSchema.parse(req.data), req);
    return responseSchema.parse(res);
  };
}

import type {AsyncCallable, AsyncHandler} from './types.js';
import {type CallableRequest, HttpsError} from 'firebase-functions/v2/https';
import * as v from 'shared/valitas.js';

export function withSchema<Request, Response>(
  requestSchema: v.Type<Request>,
  responseSchema: v.Type<Response>,
  handler: AsyncHandler<Request, Response>,
): AsyncCallable<Request, Response> {
  return async (req: CallableRequest<Request>) => {
    let payload: Request;
    try {
      payload = requestSchema.parse(req.data);
    } catch (e) {
      throw new HttpsError('invalid-argument', String(e));
    }
    const res = await handler(payload, req);
    return responseSchema.parse(res);
  };
}

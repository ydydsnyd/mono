import {HttpsError, type CallableRequest} from 'firebase-functions/v2/https';
import type * as v from 'shared/valita.js';
import {parse} from 'shared/valita.js';
import type {AsyncCallable, AsyncHandler} from './types.js';

export function withSchema<Request, Response>(
  requestSchema: v.Type<Request>,
  responseSchema: v.Type<Response>,
  handler: AsyncHandler<Request, Response>,
): AsyncCallable<Request, Response> {
  return async (req: CallableRequest<Request>) => {
    console.log('withSchema xxx');
    let payload: Request;
    try {
      payload = parse(req.data, requestSchema);
    } catch (e) {
      throw new HttpsError('invalid-argument', String(e));
    }
    const res = await handler(payload, req);
    return parse(res, responseSchema);
  };
}

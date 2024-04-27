import {createAPIHeaders} from 'shared/out/api/headers.js';
import type {ReadonlyJSONValue} from 'shared/out/json.js';

export function newAuthedPostRequest(
  url: URL,
  authApiKey: string,
  req?: ReadonlyJSONValue | undefined,
) {
  return new Request(url.toString(), {
    method: 'POST',
    headers: createAPIHeaders(authApiKey),
    body: req !== undefined ? JSON.stringify(req) : null,
  });
}

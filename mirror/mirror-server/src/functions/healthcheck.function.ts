import type * as functions from 'firebase-functions';

/**
 * Healthcheck function.
 */
export function healthcheck(
  _request: functions.Request,
  response: functions.Response,
): void {
  console.log('healthcheck xxx');
  const result = JSON.stringify({message: 'okz'});
  response.status(200);
  response.send(result);
}

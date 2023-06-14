import type {Request, Response} from 'firebase-functions';

/**
 * Healthcheck function.
 */
export function healthcheck(_request: Request, response: Response): void {
  response.json({message: 'ok'});
}

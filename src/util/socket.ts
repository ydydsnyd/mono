import type {LogContext} from '@rocicorp/logger';
import type {Downstream} from '../protocol/down.js';
import {ErrorKind, errorKindToString, ErrorMessage} from '../protocol/error.js';
import type {Socket} from '../types/client-state.js';

export function sendError(
  lc: LogContext,
  ws: Socket,
  kind: ErrorKind,
  message = '',
) {
  const data: ErrorMessage = ['error', kind, message];
  lc.debug?.('Sending error on socket', {
    kind: errorKindToString(kind),
    message,
  });
  send(ws, data);
}

/**
 * msg is optional and will be truncated to 123 bytes.
 */
export function closeWithError(
  lc: LogContext,
  ws: Socket,
  kind: ErrorKind,
  message = '',
) {
  // One problem here is that we cannot send arbitrary data on close. If we need that
  // we will need to send a message before the closing and hook that up on the client.
  lc.debug?.('Closing socket with error', {
    kind: errorKindToString(kind),
    message,
  });
  ws.close(kind, encodeReason(message));
}

// This function is a seam we can use to inject a mock socket pair
// for testing.
export function newWebSocketPair() {
  return new WebSocketPair();
}

export type NewWebSocketPair = () => InstanceType<typeof WebSocketPair>;

export function send(ws: Socket, data: Downstream) {
  ws.send(JSON.stringify(data));
}

export function encodeReason(msg: string): string {
  // WebSocket close reason length must be less than 123 bytes UTF-8 (RFC 6455)
  // We replace all non ascii characters in msg with '?'. We then encode the
  // reason as "kind: msg" and truncate to 123 bytes.

  msg = msg
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/gu, '?');

  if (msg.length > 123) {
    msg = msg.slice(0, 120) + '...';
  }

  return msg;
}

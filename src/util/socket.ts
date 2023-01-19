import type {Downstream} from '../protocol/down.js';
import type {ErrorKind, ErrorMessage} from '../protocol/error.js';
import type {Socket} from '../types/client-state.js';

export function sendError(ws: Socket, kind: ErrorKind, msg = '') {
  const message: ErrorMessage = ['error', kind, msg];
  send(ws, message);
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

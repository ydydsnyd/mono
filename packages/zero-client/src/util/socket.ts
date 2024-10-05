import type {Upstream} from 'zero-protocol/dist/up.js';

export function send(ws: WebSocket, data: Upstream) {
  ws.send(JSON.stringify(data));
}

import type {ClientMap} from '../types/client-state.js';
import type {LogContext} from '@rocicorp/logger';
import {sendError} from '../util/socket.js';

export function handleAuthInvalidate(
  clients: ClientMap,
  lc: LogContext,
  userID?: string,
): Response {
  let closedCount = 0;
  for (const clientState of clients.values()) {
    if (userID === undefined || userID === clientState.userData.userID) {
      sendError(clientState.socket, 'AuthInvalidated');
      clientState.socket.close();
      closedCount++;
    }
  }
  lc.debug?.('Closed', closedCount, 'connections.');
  return new Response('Success', {status: 200});
}

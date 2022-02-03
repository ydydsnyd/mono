import type { ClientID, ClientMap } from "../types/client-state.js";

export function handleClose(clients: ClientMap, clientID: ClientID) {
  clients.delete(clientID);
}

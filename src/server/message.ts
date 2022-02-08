import { type Upstream, upstreamSchema } from "../protocol/up.js";
import type { ClientID, ClientMap, Socket } from "../types/client-state.js";
import type { LogContext } from "../util/logger.js";
import { sendError } from "../util/socket.js";
import { handlePush, type ProcessUntilDone } from "./push.js";
import { handlePing } from "./ping.js";

/**
 * Handles an upstream message coming into the server by dispatching to the
 * appropriate handler.
 */
export function handleMessage(
  lc: LogContext,
  clientMap: ClientMap,
  clientID: ClientID,
  data: string,
  ws: Socket,
  processUntilDone: ProcessUntilDone
) {
  let message;
  try {
    message = getMessage(data);
  } catch (e) {
    lc.info?.("invalid message", e);
    sendError(ws, String(e));
    return;
  }

  switch (message[0]) {
    case "ping":
      handlePing(lc, ws);
      break;
    case "push":
      handlePush(
        lc,
        clientMap,
        clientID,
        message[1],
        ws,
        () => Date.now(),
        processUntilDone
      );
      break;
    default:
      throw new Error(`Unknown message type: ${message[0]}`);
  }
}

function getMessage(data: string): Upstream {
  const json = JSON.parse(data);
  return upstreamSchema.parse(json);
}

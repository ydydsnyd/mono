import { DurableStorage } from "../storage/durable-storage.js";
import {
  ClientRecord,
  clientRecordKey,
  getClientRecord,
} from "../types/client-record.js";
import type {
  ClientID,
  ClientMap,
  ClientState,
  Socket,
} from "../types/client-state.js";
import type { LogContext } from "../util/logger.js";
import type { ConnectedMessage } from "../protocol/connected.js";
import type { UserData } from "./auth.js";
import { USER_DATA_HEADER_NAME } from "./auth.js";
import { decodeHeaderValue } from "../util/headers.js";

export type MessageHandler = (
  clientID: ClientID,
  data: string,
  ws: Socket
) => void;

export type CloseHandler = (clientID: ClientID, ws: Socket) => void;

/**
 * Handles the connect message from a client, registering the client state in memory and updating the persistent client-record.
 * @param ws socket connection to requesting client
 * @param url raw URL of connect request
 * @param clients currently running clients
 * @param onMessage message handler for this connection
 * @param onClose callback for when connection closes
 * @returns
 */
export async function handleConnection(
  lc: LogContext,
  ws: Socket,
  durable: DurableObjectStorage,
  url: URL,
  headers: Headers,
  clients: ClientMap,
  onMessage: MessageHandler,
  onClose: CloseHandler
) {
  const sendError = (error: string) => {
    lc.info?.("invalid connection request", error);
    ws.send(JSON.stringify(["error", error]));
    ws.close();
  };

  const req = getConnectRequest(url, headers);
  const { result } = req;
  if (result === null) {
    const { error } = req;
    sendError(error);
    return;
  }

  lc = lc.addContext("client", result.clientID);
  lc.info?.("parsed request", { ...result, userData: "redacted" });

  const { clientID, baseCookie } = result;
  const storage = new DurableStorage(durable);
  const existingRecord = await getClientRecord(clientID, storage);
  lc.debug?.("Existing client record", existingRecord);
  const lastMutationID = existingRecord?.lastMutationID ?? 0;

  if (result.lmid > lastMutationID) {
    lc.info?.(
      "Unexepted lmid when connecting. Got",
      result.lmid,
      "old lastMutationID",
      lastMutationID
    );
    sendError("Unexpected lmid");
    return;
  }

  const record: ClientRecord = {
    baseCookie,
    lastMutationID,
  };
  await storage.put(clientRecordKey(clientID), record);
  lc.debug?.("Put client record", record);

  const existing = clients.get(clientID);
  if (existing) {
    lc.debug?.("Closing old socket");
    existing.socket.close();
  }

  ws.addEventListener("message", (event) =>
    onMessage(clientID, event.data.toString(), ws)
  );
  ws.addEventListener("close", () => onClose(clientID, ws));

  const client: ClientState = {
    socket: ws,
    clockBehindByMs: undefined,
    pending: [],
  };
  lc.debug?.("Setting client map entry", clientID, client);
  clients.set(clientID, client);

  const connectedMessage: ConnectedMessage = ["connected", {}];
  ws.send(JSON.stringify(connectedMessage));
}

export function getConnectRequest(url: URL, headers: Headers) {
  const getParam = (name: string, required: boolean) => {
    const value = url.searchParams.get(name);
    if (value === "" || value === null) {
      if (required) {
        throw new Error(`invalid querystring - missing ${name}`);
      }
      return null;
    }
    return value;
  };
  const getIntegerParam = (name: string, required: boolean) => {
    const value = getParam(name, required);
    if (value === null) {
      return null;
    }
    const int = parseInt(value);
    if (isNaN(int)) {
      throw new Error(
        `invalid querystring parameter ${name}, url: ${url}, got: ${value}`
      );
    }
    return int;
  };

  const getUserData = (headers: Headers): UserData => {
    const encodedValue = headers.get(USER_DATA_HEADER_NAME);
    if (!encodedValue) {
      throw new Error("missing user-data");
    }
    let jsonValue;
    try {
      jsonValue = JSON.parse(decodeHeaderValue(encodedValue));
    } catch (e) {
      throw new Error("invalid user-data - failed to decode/parse");
    }
    if (!jsonValue.userID) {
      throw new Error("invalid user-data - missing userID");
    }
    return jsonValue;
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const clientID = getParam("clientID", true)!;
    const baseCookie = getIntegerParam("baseCookie", false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const timestamp = getIntegerParam("ts", true)!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lmid = getIntegerParam("lmid", true)!;

    const userData = getUserData(headers);
    return {
      result: {
        clientID,
        userData,
        baseCookie,
        timestamp,
        lmid,
      },
      error: null,
    };
  } catch (e) {
    return {
      result: null,
      error: String(e),
    };
  }
}

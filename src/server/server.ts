import type { MutatorDefs } from "replicache";
import { processPending } from "../process/process-pending.js";
import type { MutatorMap } from "../process/process-mutation.js";
import type { ClientID, ClientMap, Socket } from "../types/client-state.js";
import { Lock } from "../util/lock.js";
import {
  Log,
  LoggerImpl,
  LogContext,
  LogLevel,
  type Logger,
  consoleLog,
} from "../util/logger.js";
import { handleClose } from "./close.js";
import { handleConnection } from "./connect.js";
import { handleMessage } from "./message.js";

export type Now = () => number;

export type ProcessHandler = (
  lc: LogContext,
  durable: DurableObjectStorage,
  clients: ClientMap,
  mutators: MutatorMap,
  startTime: number,
  endTime: number
) => Promise<void>;

export interface ServerOptions<MD extends MutatorDefs> {
  mutators: MD;
  state: DurableObjectState;
  log?: Log;
  logLevel?: LogLevel;
}
export class Server<MD extends MutatorDefs> {
  private readonly _clients: ClientMap = new Map();
  private readonly _lock = new Lock();
  private readonly _mutators: MutatorMap;
  private readonly _logger: Logger;
  private readonly _state: DurableObjectState;
  private _turnTimerID: ReturnType<typeof setInterval> | 0 = 0;

  constructor(options: ServerOptions<MD>) {
    const { mutators, state, log = consoleLog, logLevel = "debug" } = options;

    this._mutators = new Map([...Object.entries(mutators)]) as MutatorMap;
    this._state = state;
    this._logger = new LoggerImpl(log, logLevel);
    this._logger.info?.("Starting server");
  }

  async fetch(request: Request) {
    const url = new URL(request.url);

    if (url.pathname === "/connect") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("expected websocket", { status: 400 });
      }
      const pair = new WebSocketPair();
      void this._handleConnection(pair[1], url);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }

    throw new Error("unexpected path");
  }

  private async _handleConnection(ws: Socket, url: URL) {
    const lc = new LogContext(this._logger).addContext("req", randomID());

    lc.debug?.("connection request", url.toString(), "waiting for lock");
    ws.accept();

    await this._lock.withLock(async () => {
      lc.debug?.("received lock");
      await handleConnection(
        lc,
        ws,
        this._state.storage,
        url,
        this._clients,
        this._handleMessage,
        this._handleClose
      );
    });
  }

  private _handleMessage = async (
    clientID: ClientID,
    data: string,
    ws: Socket
  ): Promise<void> => {
    const lc = new LogContext(this._logger)
      .addContext("req", randomID())
      .addContext("client", clientID);
    lc.debug?.("handling message", data, "waiting for lock");

    await this._lock.withLock(async () => {
      lc.debug?.("received lock");
      handleMessage(lc, this._clients, clientID, data, ws, () =>
        this._processUntilDone()
      );
    });
  };

  private async _processUntilDone() {
    const lc = new LogContext(this._logger).addContext("req", randomID());
    lc.debug?.("handling processUntilDone");
    if (this._turnTimerID) {
      lc.debug?.("already processing, nothing to do");
      return;
    }
    this._turnTimerID = setInterval(() => {
      void this._processNext(lc);
    }, 1000 / 60);
  }

  private async _processNext(lc: LogContext) {
    lc.debug?.(
      `processNext - starting turn at ${Date.now()} - waiting for lock`
    );
    await this._lock.withLock(async () => {
      lc.debug?.(`received lock at ${Date.now()}`);

      if (!hasPendingMutations(this._clients)) {
        lc.debug?.("No pending mutations to process, exiting");
        if (this._turnTimerID) {
          clearInterval(this._turnTimerID);
          this._turnTimerID = 0;
        }
        return;
      }

      await processPending(
        lc,
        this._state.storage,
        this._clients,
        this._mutators,
        Date.now()
      );
    });
  }

  private _handleClose = async (clientID: ClientID): Promise<void> => {
    const lc = new LogContext(this._logger)
      .addContext("req", randomID())
      .addContext("client", clientID);
    lc.debug?.("handling close - waiting for lock");
    await this._lock.withLock(async () => {
      lc.debug?.("received lock");
      handleClose(this._clients, clientID);
    });
  };
}

function hasPendingMutations(clients: ClientMap) {
  for (const clientState of clients.values()) {
    if (clientState.pending.length > 0) {
      return true;
    }
  }
  return false;
}

function randomID(): string {
  return Math.random().toString(36).substring(2);
}

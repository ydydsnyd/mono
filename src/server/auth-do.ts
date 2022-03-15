import { encodeHeaderValue } from "../util/headers.js";
import { randomID } from "../util/rand.js";
import {
  Logger,
  OptionalLoggerImpl,
  LogContext,
  LogLevel,
} from "../util/logger.js";
import { version } from "../util/version.js";
import { AuthHandler, UserData, USER_DATA_HEADER_NAME } from "./auth.js";

export interface AuthDOOptions {
  roomDO: DurableObjectNamespace;
  state: DurableObjectState;
  authHandler: AuthHandler;
  logger: Logger;
  logLevel: LogLevel;
}
export class BaseAuthDO implements DurableObject {
  private readonly _roomDONamespace: DurableObjectNamespace;
  private readonly _authHandler: AuthHandler;
  private readonly _lc: LogContext;
  private readonly _isMiniflare: boolean;

  constructor(
    options: AuthDOOptions,
    isMiniflare = typeof MINIFLARE !== "undefined"
  ) {
    const { roomDO: roomDONamespace, authHandler, logger, logLevel } = options;
    this._roomDONamespace = roomDONamespace;
    this._authHandler = authHandler;
    this._lc = new LogContext(
      new OptionalLoggerImpl(logger, logLevel)
    ).addContext("AuthDO");
    this._isMiniflare = isMiniflare;
    this._lc.info?.("Starting server");
    this._lc.info?.("Version:", version);
  }

  async fetch(request: Request): Promise<Response> {
    // Match route against pattern /:name/*action
    const lc = new LogContext(this._lc).addContext("req", randomID());
    lc.debug?.("Handling request:", request.url);
    try {
      const resp = await this._handleRequest(request, lc);
      lc.debug?.(`Returning response: ${resp.status} ${resp.statusText}`);
      return resp;
    } catch (e) {
      lc.info?.("Unhandled exception", e);
      throw e;
    }
  }

  private async _handleRequest(
    request: Request,
    lc: LogContext
  ): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/connect") {
      return new Response("unknown route", {
        status: 400,
      });
    }

    const roomID = url.searchParams.get("roomID");
    if (roomID === null || roomID === "") {
      return new Response("roomID parameter required", {
        status: 400,
      });
    }

    const clientID = url.searchParams.get("clientID");
    if (!clientID) {
      return new Response("clientID parameter required", {
        status: 400,
      });
    }

    lc = lc.addContext("client", clientID).addContext("room", roomID);

    const encodedAuth = request.headers.get("Sec-WebSocket-Protocol");
    if (!encodedAuth) {
      lc.info?.("auth not found in Sec-WebSocket-Protocol header.");
      return createUnauthorizedResponse("auth required");
    }
    let auth: string | undefined;
    try {
      auth = decodeURIComponent(encodedAuth);
    } catch (e) {
      lc.info?.("error decoding auth found in Sec-WebSocket-Protocol header.");
      return createUnauthorizedResponse("invalid auth");
    }

    let userData: UserData | undefined;
    try {
      userData = await this._authHandler(auth, roomID);
    } catch (e) {
      return createUnauthorizedResponse();
    }
    if (!userData || !userData.userID) {
      if (!userData) {
        lc.info?.("userData returned by authHandler is falsey.");
      } else if (!userData.userID) {
        lc.info?.("userData returned by authHandler has no userID.");
      }
      return createUnauthorizedResponse();
    }

    // Forward the request to the Room Durable Object for roomID...
    const id = this._roomDONamespace.idFromName(roomID);
    const stub = this._roomDONamespace.get(id);
    const requestToDO = new Request(request);
    requestToDO.headers.set(
      USER_DATA_HEADER_NAME,
      encodeHeaderValue(JSON.stringify(userData))
    );
    const responseFromDO = await stub.fetch(requestToDO);
    const responseHeaders = new Headers(responseFromDO.headers);
    // While Sec-WebSocket-Protocol is just being used as a mechanism for
    // sending `auth` since custom headers are not supported by the browser
    // WebSocket API, the Sec-WebSocket-Protocol semantics must be followed.
    // Send a Sec-WebSocket-Protocol response header with a value
    // matching the Sec-WebSocket-Protocol request header, to indicate
    // support for the protocol, otherwise the client will close the connection.
    if (!this._isMiniflare) {
      // ...miniflare doesn't like it though. If we set this header under MF,
      // sending the response fails. See:
      // https://github.com/cloudflare/miniflare/issues/179
      responseHeaders.set("Sec-WebSocket-Protocol", encodedAuth);
    }

    const response = new Response(responseFromDO.body, {
      status: responseFromDO.status,
      statusText: responseFromDO.statusText,
      webSocket: responseFromDO.webSocket,
      headers: responseHeaders,
    });
    return response;
  }
}

function createUnauthorizedResponse(message = "Unauthorized"): Response {
  return new Response(message, {
    status: 401,
  });
}

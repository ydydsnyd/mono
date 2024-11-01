import type {IncomingHttpHeaders} from 'node:http2';
import {URLParams} from '../../types/url-params.js';
import {type InitConnectionMessage} from '../../../../zero-protocol/src/connect.js';

export type ConnectParams = {
  readonly clientID: string;
  readonly clientGroupID: string;
  readonly schemaVersion: number;
  readonly baseCookie: string | null;
  readonly timestamp: number;
  readonly lmID: number;
  readonly wsID: string;
  readonly debugPerf: boolean;
  readonly auth: string | undefined;
  readonly userID: string;
  readonly initConnectionMsg: InitConnectionMessage | undefined;
};

export function getConnectParams(
  url: URL,
  _headers: IncomingHttpHeaders,
):
  | {
      params: ConnectParams;
      error: null;
    }
  | {
      params: null;
      error: string;
    } {
  const params = new URLParams(url);

  try {
    const clientID = params.get('clientID', true);
    const clientGroupID = params.get('clientGroupID', true);
    const schemaVersion = params.getInteger('schemaVersion', true);
    const baseCookie = params.get('baseCookie', false);
    const timestamp = params.getInteger('ts', true);
    const lmID = params.getInteger('lmid', true);
    const wsID = params.get('wsid', false) ?? '';
    const userID = params.get('userID', false) ?? '';
    const debugPerf = params.getBoolean('debugPerf');
    /*
    const {initConnectionMessage, authToken} = decodeSecProtocols(
      must(headers['sec-websocket-protocol']),
    );
    */
    const initConnectionMessage = undefined;
    const authToken = undefined;

    return {
      params: {
        clientID,
        clientGroupID,
        schemaVersion,
        baseCookie,
        timestamp,
        lmID,
        wsID,
        debugPerf,
        initConnectionMsg: initConnectionMessage,
        auth: authToken,
        userID,
      },
      error: null,
    };
  } catch (e) {
    return {
      params: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

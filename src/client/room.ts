import { roomStatusByRoomIDPath } from "../server/auth-do-routes";
import { createAuthAPIHeaders } from "../server/auth-api-headers";
import type { RoomStatus } from "../server/rooms";
import type { CreateRoomRequest } from "src/protocol/api/room";

/**
 * createRoom creates a new room with the given roomID. If the room already
 * exists, an error is thrown. This call uses fetch(); you can get a Request
 * using newCreateRoomRequest.
 *
 * @param {string} reflectServerURL - The URL of the reflect server, e.g.
 *   "https://reflect.example.workers.dev".
 * @param {string} authApiKey - The auth API key for the reflect server.
 * @param {string} roomID - The ID of the room to create.
 * @param {boolean} [requireEUStorage=false] - Whether the room should be created in the EU.
 *   Do not set this to true unless you are sure you need it.
 */
export async function createRoom(
  reflectServerURL: string,
  authApiKey: string,
  roomID: string,
  requireEUStorage = false
): Promise<void> {
  const resp = await fetch(
    newCreateRoomRequest(reflectServerURL, authApiKey, roomID, requireEUStorage)
  );
  if (!resp.ok) {
    throw new Error(`Failed to create room: ${resp.status} ${resp.statusText}`);
  }
  return Promise.resolve(void 0);
}

/**
 * roomStatus returns the status of the room with the given roomID. This call
 * uses fetch(); you can get a Request using newRoomStatusRequest.
 *
 * @param {string} reflectServerURL - The URL of the reflect server, e.g.
 *   "https://reflect.example.workers.dev".
 * @param {string} authApiKey - The auth API key for the reflect server.
 * @param {string} roomID - The ID of the room to return status of.
 *
 * @returns {Promise<RoomStatus>} - The status of the room.
 */
export async function roomStatus(
  reflectServerURL: string,
  authApiKey: string,
  roomID: string
): Promise<RoomStatus> {
  const resp = await fetch(
    newRoomStatusRequest(reflectServerURL, authApiKey, roomID)
  );
  if (!resp.ok) {
    throw new Error(
      `Failed to get room status: ${resp.status} ${resp.statusText}`
    );
  }
  return resp.json();
}

/**
 * Returns a new Request for roomStatus.
 *
 * @param {string} reflectServerURL - The URL of the reflect server, e.g.
 *   "https://reflect.example.workers.dev".
 * @param {string} authApiKey - The auth API key for the reflect server.
 * @param {string} roomID - The ID of the room to return status of.
 * @returns {Request} - The Request to get room status.
 */
export function newRoomStatusRequest(
  reflectServerURL: string,
  authApiKey: string,
  roomID: string
) {
  if (reflectServerURL[reflectServerURL.length - 1] === "/") {
    reflectServerURL = reflectServerURL.slice(0, -1);
  }
  const path = roomStatusByRoomIDPath.replace(":roomID", roomID);
  return new Request(`${reflectServerURL}${path}`, {
    method: "get",
    headers: createAuthAPIHeaders(authApiKey),
  });
}

/**
 * Returns a new Request for createRoom.
 *
 * @param {string} reflectServerURL - The URL of the reflect server, e.g.
 *   "https://reflect.example.workers.dev".
 * @param {string} authApiKey - The auth API key for the reflect server.
 * @param {string} roomID - The ID of the room to create.
 * @param {boolean} [requireEUStorage=false] - Whether the room should be created in the EU.
 *   Do not set this to true unless you are sure you need it.
 * @returns {Request} - The Request to create the room.
 */
export function newCreateRoomRequest(
  reflectServerURL: string,
  authApiKey: string,
  roomID: string,
  requireEUStorage = false
) {
  if (reflectServerURL[reflectServerURL.length - 1] === "/") {
    reflectServerURL = reflectServerURL.slice(0, -1);
  }
  const req: CreateRoomRequest = { roomID, requireEUStorage };
  return new Request(`${reflectServerURL}/createRoom`, {
    method: "post",
    headers: createAuthAPIHeaders(authApiKey),
    body: JSON.stringify(req),
  });
}

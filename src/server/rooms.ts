import type { LogContext } from "@rocicorp/logger";
import type { CreateRoomRequest } from "../protocol/api/room.js";
import { RWLock } from "@rocicorp/lock";
import type { DurableStorage } from "../storage/durable-storage.js";
import * as s from "superstruct";

// TODO(fritz) rough GDRP TODO list:
// - add room close() and delete()
// - make a decision about auth api key
// - Enforce that roomIDs are A-Za-z0-9_-
// - get aaron to review APIs (don't worry too much about this
//   right now, we can fix it up later without too much work)
// - store roomID in RoomDO
// - actually take the jurisdiction bit in the CreateRoomRequest

// RoomRecord keeps information about the room, for example the Durable
// Object ID of the DO instance that has the room.
export type RoomRecord = {
  // roomID is the name of the room. It is externally visible, e.g.,
  // present in URLs.
  roomID: string;

  // objectIDString is the stringified Durable Object ID, the unique
  // identifier of the Durable Object instance that has this room.
  // It is not externally visible.
  //
  // In the past we derived the objectID from the roomID via idFromName, so
  // we didn't need to store the objectID. However in order to specify that
  // a DO should exist only in the EU for GDPR, we have to create objectIDs
  // via newUniqueId(). The unique ID is not derived from the roomID, so we
  // need to keep track of them eg when we receive connect() we need to
  // look the objectID up by roomID.
  objectIDString: string;

  status: RoomStatus;
};

export enum RoomStatus {
  // An open room can be used by users. We will accept connect()s to it.
  // We'll add closed and deleted statuses in the near future.
  Open = "open",
  Unknown = "unknown",
}

// The DruableStorage interface adds type-awareness to the DO Storage API. It
// requires a superstruct schema for values, which we define here. I've chosen
// the slightly non-DRY path of having a separate ts type definition and schema,
// instead of inferring the type from a schema, because frankly I like reading
// type definitions in the type definition language (ts) and want to keep goop
// (superstruct) from polluting the main ideas.
const roomStatusSchema = s.enums([RoomStatus.Open, RoomStatus.Unknown]);
const roomRecordSchema = s.object({
  roomID: s.string(),
  objectIDString: s.string(),
  status: roomStatusSchema,
});
// This assignment ensures that RoomRecord and roomRecordSchema stay in sync.
const RoomRecord: s.Describe<RoomRecord> = roomRecordSchema;

// We need a lock to prevent concurrent changes to a room.
const roomLock = new RWLock();

export async function createRoom(
  lc: LogContext,
  roomDO: DurableObjectNamespace,
  storage: DurableStorage,
  request: Request,
  validatedBody: CreateRoomRequest
): Promise<Response> {
  // Note: this call was authenticated by dispatch, so no need to check for
  // authApiKey here.
  const { roomID } = validatedBody;

  return roomLock.withWrite(async () => {
    // Check if the room already exists.
    if ((await roomRecordByRoomIDLocked(storage, roomID)) !== undefined) {
      return new Response("room already exists", {
        status: 400,
      });
    }

    // Instantiate it so it will be listed in the namespace by the CF API,
    // and also so that it can do whatever it needs to initialize itself.
    const objectID = await roomDO.newUniqueId();
    const newRoomDOStub = roomDO.get(objectID);
    const response = await newRoomDOStub.fetch(request);
    if (!response.ok) {
      lc.debug?.(
        `Received error response from ${roomID}. ${
          response.status
        } ${await response.clone().text()}`
      );
      return response;
    }

    // Write the record for the room only after it has been successfully
    // instantiated and initialized.
    const roomRecord: RoomRecord = {
      roomID,
      objectIDString: objectID.toString(),
      status: RoomStatus.Open,
    };
    const roomRecordKey = roomKeyToString(roomRecord);
    await storage.put(roomRecordKey, roomRecord);
    lc.debug?.(`created room ${JSON.stringify(roomRecord)}`);

    return new Response("ok");
  });
}

export async function objectIDByRoomID(
  storage: DurableStorage,
  roomDO: DurableObjectNamespace,
  roomID: string
) {
  const roomRecord = await roomRecordByRoomID(storage, roomID);
  if (roomRecord === undefined) {
    return undefined;
  }
  return roomDO.idFromString(roomRecord.objectIDString);
}

export async function roomRecordByRoomID(
  storage: DurableStorage,
  roomID: string
) {
  return roomLock.withRead(async () => {
    return roomRecordByRoomIDLocked(storage, roomID);
  });
}

async function roomRecordByRoomIDLocked(
  storage: DurableStorage,
  roomID: string
) {
  const roomRecordKey = roomKeyToString({ roomID });
  return await storage.get(roomRecordKey, roomRecordSchema);
}

export async function roomRecordByObjectID(
  storage: DurableStorage,
  objectID: DurableObjectId
) {
  // Sure, inefficient, but it works just fine for now.
  const roomRecords = await storage.list(
    { prefix: ROOM_KEY_PREFIX },
    roomRecordSchema
  );
  const needle = objectID.toString();
  for (const roomRecord of roomRecords.values()) {
    if (roomRecord.objectIDString === needle) {
      return roomRecord;
    }
  }
  return undefined;
}

export async function roomRecords(storage: DurableStorage) {
  return storage.list({ prefix: ROOM_KEY_PREFIX }, roomRecordSchema);
}

// Storage key types are intentionally not exported so that other modules
// don't know too much about the innards of the storage. They should use
// the exported functions to access the storage.
const ROOM_KEY_PREFIX = "room/";

type RoomKey = {
  roomID: string;
};

function roomKeyToString(key: RoomKey): string {
  return `${ROOM_KEY_PREFIX}${encodeURIComponent(key.roomID)}/`;
}

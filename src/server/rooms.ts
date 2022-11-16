import type { LogContext } from "@rocicorp/logger";
import type { CreateRoomRequest } from "../protocol/api/room.js";
import { Lock } from "@rocicorp/lock";
import type { DurableStorage } from "../storage/durable-storage.js";
import * as s from "superstruct";
import type { RociRequest } from "./middleware.js";

// TODO(fritz) rough GDRP TODO list:
// - get aaron to review APIs (don't worry too much about this
//   right now, we can fix it up later without too much work)
// - do we need to make changes to the client to support the
//   additional http codes returned by connect (404, 410)?

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

  // Indicates whether the room is pinned in the EU.
  jurisdiction: "" | "eu";

  status: RoomStatus;
};

export enum RoomStatus {
  // An Open room can be used by users. We will accept connect()s to it.
  Open = "open",
  // A Closed room cannot be used by users. We will reject connect()s to it.
  // Once closed, a room cannot be opened again.
  Closed = "closed",
  // A Deleted room is a Closed room that has had all its data deleted.
  Deleted = "deleted",

  Unknown = "unknown",
}

// The DurableStorage interface adds type-awareness to the DO Storage API. It
// requires a superstruct schema for values, which we define here. I've chosen
// the slightly non-DRY path of having a separate ts type definition and schema,
// instead of inferring the type from a schema, because frankly I like reading
// type definitions in the type definition language (ts) and want to keep goop
// (superstruct) from polluting the main ideas.
const roomStatusSchema = s.enums([
  RoomStatus.Open,
  RoomStatus.Closed,
  RoomStatus.Deleted,
  RoomStatus.Unknown,
]);
// Note setting jurisdictionSchmea to = s.union([s.literal(""), s.literal("eu")]);
// doesn't work for some reason.
const jurisdictionSchema = s.enums(["", "eu"]);
const roomRecordSchema = s.object({
  roomID: s.string(),
  objectIDString: s.string(),
  jurisdiction: jurisdictionSchema,
  status: roomStatusSchema,
});
// This assignment ensures that RoomRecord and roomRecordSchema stay in sync.
const RoomRecord: s.Describe<RoomRecord> = roomRecordSchema;

// We need a lock to prevent concurrent creation of the same room.
//
// TODO the fact that we're not locking updates to the RoomRecord or
// operations *on* the room like delete or invalidateAuth is suspect.
// It means we could have at least two kinds of problems:
//   1. Lost updates to RoomRecords. Eg, two concurrent operations O1 and O2
//      with a sequence like:
//        O1 reads a RoomRecord
//        O2 reads a RoomRecord
//        O1 updates the RoomRecord and writes it
//        O2 updates the RoomRecord and writes it
//      The result is that O1's update is lost. If the input gate is on then
//      this is not a problem.
//
//   2. Bad interactions between concurrent operations on the roomDO itself.
//      Eg, O1 is delete()ing the room while O2 is updating some state in it.
//      It's an accident of how auth is implemented that we don't have this
//      problem right now, but we should rationalize the model, like anything
//      that updates roomDO storage should be serialized at some point. Maybe
//      the solution is simply "enable input and output gates on the roomDO"
//      but if that's the solution we need to articulate it somewhere and
//      enforce that it is true.
const createRoomLock = new Lock();

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

  if (!roomID.match(/^[A-Za-z0-9_-]+$/)) {
    return new Response("Invalid roomID (must match [A-Za-z0-9_-]+)", {
      status: 400,
    });
  }

  return createRoomLock.withLock(async () => {
    // Check if the room already exists.
    if ((await roomRecordByRoomID(storage, roomID)) !== undefined) {
      return new Response("room already exists", {
        status: 400,
      });
    }

    const options: DurableObjectNamespaceNewUniqueIdOptions = {};
    if (validatedBody.jurisdiction === "eu") {
      options["jurisdiction"] = "eu";
    }

    // Instantiate it so it will be listed in the namespace by the CF API,
    // and also so that it can do whatever it needs to initialize itself.
    const objectID = await roomDO.newUniqueId(options);
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
      jurisdiction: validatedBody.jurisdiction ?? "",
      status: RoomStatus.Open,
    };
    const roomRecordKey = roomKeyToString(roomRecord);
    await storage.put(roomRecordKey, roomRecord);
    lc.debug?.(`created room ${JSON.stringify(roomRecord)}`);

    return new Response("success");
  });
}

// Note that closeRoom closes the room but does NOT log users out of it.
// The call to closeRoom should be followed by a call to authInvalidateForRoom.
export async function closeRoom(
  lc: LogContext,
  storage: DurableStorage,
  request: RociRequest
): Promise<Response> {
  const roomID = request.params?.roomID;
  if (roomID === undefined) {
    return new Response("Missing roomID", { status: 400 });
  }

  const roomRecord = await roomRecordByRoomID(storage, roomID);
  if (roomRecord === undefined) {
    return new Response("no such room", {
      status: 404,
    });
  }

  if (roomRecord.status === RoomStatus.Closed) {
    return new Response("success (room already closed)");
  } else if (roomRecord.status !== RoomStatus.Open) {
    return new Response("room is not open", {
      status: 400,
    });
  }

  roomRecord.status = RoomStatus.Closed;
  const roomRecordKey = roomKeyToString(roomRecord);
  await storage.put(roomRecordKey, roomRecord);
  lc.debug?.(`closed room ${JSON.stringify(roomRecord)}`);

  return new Response("success");
}

export async function deleteRoom(
  lc: LogContext,
  roomDO: DurableObjectNamespace,
  storage: DurableStorage,
  request: RociRequest
): Promise<Response> {
  const roomID = request.params?.roomID;
  if (roomID === undefined) {
    return new Response("Missing roomID", { status: 400 });
  }
  const roomRecord = await roomRecordByRoomID(storage, roomID);
  if (roomRecord === undefined) {
    return new Response("no such room", {
      status: 404,
    });
  }

  if (roomRecord.status === RoomStatus.Deleted) {
    return new Response("success (room already deleted)");
  } else if (roomRecord.status !== RoomStatus.Closed) {
    return new Response("room must first be closed", {
      status: 400,
    });
  }

  const objectID = roomDO.idFromString(roomRecord.objectIDString);
  const roomDOStub = roomDO.get(objectID);
  const response = await roomDOStub.fetch(request);
  if (!response.ok) {
    lc.debug?.(
      `Received error response from ${roomID}. ${
        response.status
      } ${await response.clone().text()}`
    );
    return response;
  }

  roomRecord.status = RoomStatus.Deleted;
  const roomRecordKey = roomKeyToString(roomRecord);
  await storage.put(roomRecordKey, roomRecord);
  lc.debug?.(`deleted room ${JSON.stringify(roomRecord)}`);
  return new Response("success");
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
  const roomRecordKey = roomKeyToString({ roomID });
  return await storage.get(roomRecordKey, roomRecordSchema);
}

export async function roomRecordByObjectIDForTest(
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

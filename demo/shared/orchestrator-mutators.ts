import type {WriteTransaction} from '@rocicorp/reflect';
import {COLOR_PALATE, ROOM_MAX_ACTORS} from './constants';
import {Env, OrchestratorActor} from './types';
import {string2Uint8Array} from './uint82b64';

export const ROOM_ID_KEY = 'current-room-id';
export const ROOM_COUNT_KEY = 'current-room-count';
export const COLOR_INDEX_KEY = 'color-index';

let env = Env.CLIENT;
let newRoomSecret: Uint8Array | undefined;
export const setEnv = (e: Env, secret?: Uint8Array) => {
  env = e;
  if (secret) {
    newRoomSecret = secret;
  }
};

export const orchestratorMutators = {
  removeOchestratorActor: async (tx: WriteTransaction, clientID: string) => {
    const key = `orchestrator-actor/${clientID}`;
    const actor = (await tx.get(key)) as OrchestratorActor;
    // Dunno who that is
    if (!actor) {
      return;
    }
    // Delete the actor
    await tx.del(key);
    const currentRoom = (await tx.get(ROOM_ID_KEY)) as string;
    if (!currentRoom || actor.room !== currentRoom) {
      // The room that the actor was in doesn't exist, no need to do any more.
      return;
    }
    // Decrement the room count, so that as long as we don't hit the ceiling, we'll
    // always use the same room.
    const roomCount = (await tx.get(ROOM_COUNT_KEY)) as number;
    if (!roomCount || roomCount < 0) {
      console.error("Can't remove an actor from an empty room...");
    }
    await tx.put(ROOM_COUNT_KEY, roomCount - 1);
  },
  createOrchestratorActor: async (
    tx: WriteTransaction,
    {
      fallbackId,
      lastRoom,
      lastColorIndex,
      forceNewRoomWithSecret,
    }: {
      fallbackId: string;
      lastRoom?: string;
      lastColorIndex?: number;
      forceNewRoomWithSecret?: string | null;
    },
  ) => {
    // We can't create actors/rooms on the client, because otherwise we'll get a
    // local room ID which we'll create, then the server will tell us a different
    // one that we'll need to connect to instead.
    if (env === Env.CLIENT) {
      return;
    }
    const key = `orchestrator-actor/${tx.clientID}`;
    const hasActor = await tx.has(key);
    if (hasActor) {
      // already exists
      console.log('exists', tx.clientID);
      return;
    }
    // Find the room we're currently filling
    const roomCount = (await tx.get(ROOM_COUNT_KEY)) as number | undefined;
    const existingRoom = (await tx.get(ROOM_ID_KEY)) as string | undefined;
    let selectedRoomId: string;
    let forceNewRoom = false;
    if (forceNewRoomWithSecret) {
      if (await isResetRoomSecret(forceNewRoomWithSecret)) {
        forceNewRoom = true;
      } else {
        console.warn(
          newRoomSecret
            ? `Attempted to reset room with invalid secret ${forceNewRoomWithSecret}.`
            : 'Attempted to reset room but secret is unset.',
        );
      }
    }
    if (
      forceNewRoom ||
      existingRoom === undefined ||
      (roomCount && roomCount >= ROOM_MAX_ACTORS)
    ) {
      // Make a new room for this user and start adding users to it
      console.log('creating new room');
      selectedRoomId = fallbackId;
      await tx.put(ROOM_ID_KEY, selectedRoomId);
      await tx.put(ROOM_COUNT_KEY, 1);
    } else if (lastRoom && lastRoom !== existingRoom) {
      // When we have a prior room and the new room has changed (likely due to being offline then reconnecting).
      // Keep us there so we don't see weird paint jumping.
      // This works because old rooms are never purged. If we start purging them, we
      // may need to rethink this (e.g. just show a clear or something)
      console.log(`user reconnected to old room ${lastRoom}`);
      // Subtle: we expect that lastColorIndex will always be set if lastRoom is set.
      // If not, we'll cause the main room to skip a color.
      selectedRoomId = lastRoom;
    } else {
      selectedRoomId = (await tx.get(ROOM_ID_KEY)) as string;
      const roomActorNum = (roomCount || 0) + 1;
      console.log('update room count to', roomActorNum);
      await tx.put(ROOM_COUNT_KEY, roomActorNum);
    }
    let colorIndex = lastColorIndex;
    if (colorIndex === undefined) {
      // NOTE: we just cycle through colors, so if COLOR_PALATE.length <
      // ROOM_MAX_ACTORS, we'll see cycling duplicates.
      // We do this independently of room count, because that way if someone enters
      // and leaves, each new user will still have a distinct color from the last N users.
      const nextColorNum =
        (((await tx.get(COLOR_INDEX_KEY)) as number) || 0) + 1;
      colorIndex = nextColorNum % COLOR_PALATE.length;
      await tx.put(COLOR_INDEX_KEY, nextColorNum);
    }
    const actor: OrchestratorActor = {
      id: tx.clientID,
      colorIndex,
      room: selectedRoomId,
    };
    console.log(`Created orchestrator actor for ${tx.clientID}`);
    await tx.put(key, actor);
  },
};

const isResetRoomSecret = async (secret: string) => {
  if (!newRoomSecret) {
    return false;
  }
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    string2Uint8Array(secret),
  );
  if (buffer.byteLength !== newRoomSecret.byteLength) {
    return false;
  }
  const view = new Uint8Array(buffer);
  for (const idx in newRoomSecret) {
    if (view[idx] !== newRoomSecret[idx]) {
      return false;
    }
  }
  return true;
};

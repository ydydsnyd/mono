import type {WriteTransaction} from '@rocicorp/reflect';
import {nanoid} from 'nanoid';
import {COLOR_PALATE, ROOM_MAX_ACTORS} from './constants';
import type {OrchestratorActor} from './types';

export const orchestratorMutators = {
  removeOchestratorActor: async (tx: WriteTransaction, actorId: string) => {
    const key = `actor/${actorId}`;
    const actor = (await tx.get(key)) as OrchestratorActor;
    // Dunno who that is
    if (!actor) {
      return;
    }
    // Delete the actor
    await tx.del(key);
    const currentRoom = (await tx.get('current-room-id')) as string;
    if (!currentRoom || actor.room !== currentRoom) {
      // The room that the actor was in doesn't exist, no need to do any more.
      return;
    }
    // Decrement the room count, so that as long as we don't hit the ceiling, we'll
    // always use the same room.
    const roomCount = (await tx.get('current-room-count')) as number;
    if (!roomCount) {
      throw new Error("Can't remove an actor from an empty room...");
    }
    await tx.put('current-room-count', roomCount - 1);
  },
  createOrchestratorActor: async (tx: WriteTransaction, actorId: string) => {
    const key = `actor/${actorId}`;
    const hasActor = await tx.has(key);
    if (hasActor) {
      // already exists
      return;
    }
    // Find the room we're currently filling
    const roomCount = (await tx.get('current-room-count')) as
      | number
      | undefined;
    let selectedRoomId: string;
    let roomActorNum: number;
    if (!roomCount || roomCount >= ROOM_MAX_ACTORS) {
      // Make a new room for this user and start adding users to it
      selectedRoomId = nanoid();
      await tx.put('current-room-id', selectedRoomId);
      await tx.put('current-room-count', 1);
      roomActorNum = 1;
    } else {
      selectedRoomId = (await tx.get('current-room-id')) as string;
      roomActorNum = roomCount + 1;
      await tx.put('current-room-count', roomActorNum);
    }

    // NOTE: we just cycle through colors, so if COLOR_PALATE.length <
    // ROOM_MAX_ACTORS, we'll see cycling duplicates.
    // We do this independently of room count, because that way if someone enters
    // and leaves, each new user will still have a distinct color from the last N users.
    const nextColorNum = (((await tx.get('color-index')) as number) || 0) + 1;
    const colorIndex = nextColorNum % COLOR_PALATE.length;
    await tx.put('color-index', nextColorNum);
    const actor: OrchestratorActor = {
      id: actorId,
      colorIndex,
      room: selectedRoomId,
    };
    await tx.put(key, actor);
  },
};

import type {ReadTransaction, WriteTransaction} from '@rocicorp/reflect';
import {
  ACTIVITY_TIMEOUT,
  BOT_RANDOM_LOCATIONS,
  BOT_RANDOM_SEED,
  COLOR_PALATE,
  FIND_LENGTH_RANGE,
  MAX_CLIENT_BROADCASTS,
  MAX_CONCURRENT_BOTS,
  MIN_BROWSE_FRAMES,
  MIN_FIND_OR_DRAG_FRAMES,
  PLACE_PIECE_PROBABILITY,
  ROOM_MAX_ACTORS,
} from './constants';
import {
  Cursor,
  Env,
  Actor,
  Broadcast,
  RecordingCursor,
  RecordingType,
  RecordingInfo,
  BroadcastQueue,
  RecordingBroadcast,
  PieceNumber,
  Position,
} from './types';
import {string2Uint8Array} from './string2Uint';
import {
  addRadians,
  chooseRandomWithSeed,
  cursorToRecordingCursor,
  getAngle,
  must,
  nextNumber,
  randomWithSeed,
  relative,
  rotatePosition,
  sortableKeyNum,
} from './util';
import {PUZZLE_PIECES} from './puzzle-pieces';

export const ROOM_ID_KEY = 'current-room-id';
export const ROOM_COUNT_KEY = 'current-room-count';
export const COLOR_INDEX_KEY = 'color-index';

const RECORDING_RANDOM_SEED = 9438;
const RECORDING_PIECE_SEED = 189;

let env = Env.CLIENT;
let newRoomSecret: Uint8Array | undefined;
export const setEnv = (e: Env, secret?: Uint8Array) => {
  env = e;
  if (secret) {
    newRoomSecret = secret;
  }
};

export const orchestratorMutators = {
  alive: async (
    tx: WriteTransaction,
    {timestamp, placedPieces}: {timestamp: number; placedPieces: PieceNumber[]},
  ) => {
    await tx.put(`alive/${tx.clientID}`, timestamp);
    const recordings = (await tx
      .scan({prefix: 'broadcasts/'})
      .values()
      .toArray()) as Broadcast[];
    let broadcastingCount = 0;
    for (const recording of recordings) {
      if (recording.broadcasterId === tx.clientID) {
        // Don't broadcast more than N bots at a time, as it can impact performance.
        if (++broadcastingCount > MAX_CLIENT_BROADCASTS) {
          return;
        }
      }
    }
    // We just chose a random number here, I don't know how probable this is, or how
    // to adjust probability more granularly than just making the number an order of
    // magnitude larger or prime.
    if (
      recordings.length < MAX_CONCURRENT_BOTS &&
      timestamp % BOT_RANDOM_SEED === 0
    ) {
      const actor = (await tx.get(`actor/${tx.clientID}`)) as Actor;
      await playRandomRecordings(
        tx,
        actor.room,
        actor.id,
        new Set(placedPieces),
        timestamp,
      );
    }
    // We also need to periodically clean up old users - do it randomly here too
    if (timestamp % 4) {
      await cleanupOldUsers(tx, timestamp);
    }
  },
  updateActorLocation: async (tx: WriteTransaction, location: string) => {
    const key = `actor/${tx.clientID}`;
    const actor = ((await tx.get(key)) as Actor | undefined) || {
      id: tx.clientID,
    };
    await tx.put(key, {...actor, location});
  },
  removeActor: async (
    tx: WriteTransaction,
    {clientID, timestamp}: {clientID: string; timestamp: number},
  ) => {
    // This mutator is also called when clients disconnect from non-orchestrator
    // rooms, so if we don't have an actor for this client, just ignore it.
    if (await tx.has(`actor/${clientID}`)) {
      serverLog(`Orchestrator client ${clientID} left, cleaning up.`);
      await removeActor(tx, clientID, timestamp);
    }
  },
  createActor: async (
    tx: WriteTransaction,
    args: {
      fallbackRoomId: string;
      lastRoom: string | null;
      lastColorIndex: number | null;
      forceNewRoomWithSecret: string | null;
      timestamp: number;
    },
  ) => {
    // We can't create actors/rooms on the client, because otherwise we'll get a
    // local room ID which we'll create, then the server will tell us a different
    // one that we'll need to connect to instead.
    if (env === Env.CLIENT) {
      return;
    }
    await createActor(tx, {...args, isBot: false});
  },
  finishBroadcast: async (
    tx: WriteTransaction,
    {
      broadcastId,
      recordingId,
      roomId,
      botId,
      timestamp,
      targetPiece,
      targetCoord,
    }: {
      broadcastId: string;
      recordingId: string;
      roomId: string;
      botId: string;
      timestamp: number;
      targetPiece: number | null;
      targetCoord: Position | null;
    },
  ) => {
    const queue = (await tx.get(
      `broadcast-queues/${roomId}/${botId}`,
    )) as BroadcastQueue;
    if (queue) {
      // If we're playing in a queue, find the next one and play it
      const finishedIndex = queue.recordings.findIndex(
        rb => rb.recordingId === recordingId,
      );
      if (finishedIndex > -1 && finishedIndex < queue.recordings.length - 1) {
        const nextRecording: RecordingBroadcast = {
          ...queue.recordings[finishedIndex + 1],
        };
        if (
          nextRecording.type === RecordingType.PLACE &&
          queue.recordings[finishedIndex].type === RecordingType.FIND
        ) {
          // When we transition to a drag, require that we send the prior piece and a
          // target coordinate for it, so we know where to go.
          nextRecording.pieceNum = must(
            targetPiece,
            'target piece must be provided when starting a FIND animation',
          );
          nextRecording.targetCoord = must(
            targetCoord,
            'target coordinate must be provided when starting a FIND animation',
          );
        }
        const bot = (await tx.get(`actor/${queue.botId}`)) as Actor;
        serverLog(
          `Finished broadcast broadcasts/${roomId}/${broadcastId}, starting next in queue.`,
        );
        await tx.del(`broadcasts/${roomId}/${broadcastId}`);
        playRecording(
          tx,
          bot,
          queue.roomId,
          nextRecording,
          queue.broadcasterId,
          timestamp,
        );
        return;
      } else if (queue.recordings[finishedIndex].type !== RecordingType.FIND) {
        console.warn(
          'DRAG recordings only allowed after FIND recordings. Deleting queue.',
        );
        await tx.del(`broadcast-queues/${roomId}/${botId}`);
      } else if (finishedIndex === queue.recordings.length - 1) {
        serverLog(
          `Finished broadcast broadcasts/${roomId}/${broadcastId}. Queue complete, deleting broadcast-queues/${roomId}/${botId}`,
        );
        await tx.del(`broadcast-queues/${roomId}/${botId}`);
      }
    }
    serverLog(`Delete broadcast broadcasts/${roomId}/${broadcastId}.`);
    const recording = (await tx.get(
      `broadcasts/${roomId}/${broadcastId}`,
    )) as Broadcast;
    if (recording) {
      await tx.del(`broadcaster/${recording.broadcasterId}/${recordingId}`);
      await tx.del(`controlled-bots/${recording.broadcasterId}/${botId}`);
      await tx.del(`broadcasts/${roomId}/${broadcastId}`);
      await removeActor(tx, botId, timestamp);
    }
  },
  deleteRecording: async (tx: WriteTransaction, recordingId: string) => {
    // TODO: permissions/secret
    await deleteRecording(tx, recordingId);
  },
  playRecording: async (
    tx: WriteTransaction,
    {
      roomId,
      recordingId,
      timestamp,
      placedPieces: placedPiecesArr,
      currentPiece,
      pieceCoordinates,
    }: {
      roomId: string;
      recordingId: string;
      timestamp: number;
      placedPieces: PieceNumber[] | null;
      currentPiece: PieceNumber | null;
      pieceCoordinates: Record<PieceNumber, Position>;
    },
  ) => {
    // TODO: permissions/secret
    const bot = await createBot(tx, tx.clientID, roomId, timestamp);
    const recordingInfo = (await tx.get(`recording-info/${recordingId}`)) as
      | RecordingInfo
      | undefined;
    if (!recordingInfo) {
      console.error(
        'Attempted playback of recording with no info',
        recordingId,
      );
      return;
    }
    const recording: RecordingBroadcast = {
      recordingId,
      type: recordingInfo.type,
    };
    if (recordingInfo.type === RecordingType.FIND) {
      const placedPieces = new Set(
        must(
          placedPiecesArr,
          'placedPieces is required when starting a FIND recording',
        ),
      );
      // Choose a random piece to find
      let pieceIdx = must(
        chooseRandomWithSeed(
          timestamp,
          RECORDING_PIECE_SEED,
          PUZZLE_PIECES,
          (_, i) => !placedPieces.has(i),
        ),
      )[1];
      recording.pieceNum = pieceIdx;
      recording.targetCoord = must(
        pieceCoordinates[pieceIdx],
        `pieceCoordinates was missing ${pieceIdx} when starting a FIND recording`,
      );
    } else if (recordingInfo.type === RecordingType.PLACE) {
      recording.pieceNum = must(
        currentPiece,
        'currentPiece is required when starting a PLACE recording',
      );
      const piece = PUZZLE_PIECES[recording.pieceNum];
      recording.targetCoord = {x: piece.dx, y: piece.dy};
    }
    await playRecording(tx, bot, roomId, recording, tx.clientID, timestamp);
  },
  addCursorRecording: async (
    tx: WriteTransaction,
    {
      priorRecordingId,
      recordingId,
      allocatedRecordingId,
      recordingType,
      cursor,
    }: {
      recordingType: RecordingType;
      recordingId: string;
      priorRecordingId: string | null;
      cursor: Cursor;
      allocatedRecordingId: string;
    },
  ) => {
    const recordingNumber = nextNumber(
      (await tx.get(`current-recording-frame/${recordingId}`)) as number,
    );
    if (priorRecordingId) {
      await finishRecording(tx, priorRecordingId);
    }
    if (!(await tx.has(`recording-info/${recordingId}`))) {
      // If we start a placing animation, slice off the last N frames into a FIND recording.
      if (recordingType === RecordingType.PLACE && priorRecordingId) {
        // To be able to make a FIND animation, our current recording needs to be
        // long enough to be split into a browse and a find animation.
        // Otherwise we'll just record the PLACE and no FIND.
        const {valid, frames} = await getAndValidateRecording(
          tx,
          priorRecordingId,
          MIN_FIND_OR_DRAG_FRAMES + MIN_BROWSE_FRAMES,
        );
        if (valid) {
          const count = randomWithSeed(
            allocatedRecordingId,
            1,
            FIND_LENGTH_RANGE[1],
            FIND_LENGTH_RANGE[0],
          );
          let frameNum = 1;
          for await (const [key, frame] of frames) {
            if (frameNum > count) {
              break;
            }
            await tx.put(
              `recordings/${allocatedRecordingId}/${sortableKeyNum(frameNum)}`,
              frame,
            );
            await tx.del(key);
          }
          // Do any post-recording cleanup necessary on the newly sliced recording
          await finishRecording(tx, allocatedRecordingId);
        }
      }
      // If we're just starting, record the start location
      console.log(`Start recording with cursor:`, cursor);
      await tx.put(`recording-info/${recordingId}`, {
        recordingType,
        startCoord: {x: cursor.x, y: cursor.y},
      });
    }
    await tx.put(
      `recordings/${recordingId}/${sortableKeyNum(recordingNumber)}`,
      cursorToRecordingCursor(cursor),
    );
    await tx.put(`current-recording-frame/${recordingId}`, recordingNumber);
    let index = [
      ...(((await tx.get(`recording-index/${recordingType}`)) as string[]) ||
        []),
    ];
    // O(n) but also we've got bigger problems if this gets too big to scan.
    if (!index.includes(recordingId)) {
      index.push(recordingId);
      await tx.put(`recording-index/${recordingType}`, index);
    }
  },
  finishRecording: async (
    tx: WriteTransaction,
    {recordingId}: {recordingId: string},
  ) => {
    await finishRecording(tx, recordingId);
  },
};

const serverLog = (...args: any[]) => {
  if (env === Env.SERVER) {
    console.log(...args);
  }
};

const cleanupOldUsers = async (tx: WriteTransaction, timestamp: number) => {
  const alives = (await tx.scan({prefix: 'alive/'}).entries().toArray()) as [
    string,
    number,
  ][];
  const actorsToRemove: string[] = [];
  const aliveIds: Set<string> = new Set();
  for await (const [key, lastPing] of alives) {
    const id = key.split('/')[1];
    aliveIds.add(id);
    if (timestamp - lastPing > ACTIVITY_TIMEOUT) {
      actorsToRemove.push(id);
    }
  }
  if (actorsToRemove.length > 0) {
    console.log('Removing actors due to inactivity:', actorsToRemove);
  }
  for (const actorID of actorsToRemove) {
    await removeActor(tx, actorID, timestamp, actorsToRemove);
  }
};

const createActor = async (
  tx: WriteTransaction,
  {
    fallbackRoomId,
    actorID,
    isBot,
    lastRoom,
    lastColorIndex,
    controller,
    location,
    forceNewRoomWithSecret,
    timestamp,
  }: {
    fallbackRoomId: string | null;
    actorID?: string;
    isBot: boolean;
    lastRoom: string | null;
    lastColorIndex?: number | null;
    controller?: string;
    location?: string;
    forceNewRoomWithSecret?: string | null;
    timestamp: number;
  },
) => {
  actorID = actorID || tx.clientID;
  serverLog(`Orchestrator creating ${actorID}`);
  const key = `actor/${actorID}`;
  const hasActor = await tx.has(key);
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
  // Must be set by all branches below.
  let roomActorNum: number;
  let actor: Actor;
  if (!hasActor) {
    if (
      forceNewRoom ||
      existingRoom === undefined ||
      (roomCount && roomCount >= ROOM_MAX_ACTORS)
    ) {
      if (!fallbackRoomId) {
        throw new Error(
          'Invariant violated: cannot create a new room without a fallback ID.',
        );
      }
      // Make a new room for this user and start adding users to it
      console.log('Creating new room', fallbackRoomId);
      selectedRoomId = fallbackRoomId;
      await tx.put(ROOM_ID_KEY, selectedRoomId);
      await tx.put(ROOM_COUNT_KEY, 1);
      roomActorNum = 1;
    } else if (lastRoom && lastRoom !== existingRoom) {
      // When we have a prior room and the new room has changed (likely due to being offline then reconnecting).
      // Keep us there so we don't see weird paint jumping.
      // This works because old rooms are never purged. If we start purging them, we
      // may need to rethink this (e.g. just show a clear or something)
      console.log(`User reconnected to old room ${lastRoom}`);
      // Subtle: we expect that lastColorIndex will always be set if lastRoom is set.
      // If not, we'll cause the main room to skip a color.
      selectedRoomId = lastRoom;
      // We don't know, so we just trigger a bot for now.
      roomActorNum = 1;
    } else {
      selectedRoomId = (await tx.get(ROOM_ID_KEY)) as string;
      roomActorNum = (roomCount || 0) + 1;
      await tx.put(ROOM_COUNT_KEY, roomActorNum);
    }
    // Create an index entry so we can look up users by room
    await tx.put(`actors/${selectedRoomId}/${actorID}`, actorID);
    let colorIndex = lastColorIndex;
    if (colorIndex === null || colorIndex === undefined) {
      // NOTE: we just cycle through colors, so if COLOR_PALATE.length <
      // ROOM_MAX_ACTORS, we'll see cycling duplicates.
      // We do this independently of room count, because that way if someone enters
      // and leaves, each new user will still have a distinct color from the last N users.
      const nextColorNum =
        (((await tx.get(COLOR_INDEX_KEY)) as number) || 0) + 1;
      colorIndex = nextColorNum % COLOR_PALATE.length;
      await tx.put(COLOR_INDEX_KEY, nextColorNum);
    }
    await tx.put(`alive/${actorID}`, timestamp);
    actor = {
      id: actorID,
      colorIndex,
      room: selectedRoomId,
      isBot,
      botController: controller || null,
      location: location || null,
    };
    await tx.put(key, actor);
  } else {
    // already exists
    serverLog(`${actorID} already exists.`);
    selectedRoomId = (await tx.get(ROOM_ID_KEY)) as string;
    roomActorNum = (await tx.get(ROOM_COUNT_KEY)) as number;
    actor = (await tx.get(key)) as Actor;
  }
  serverLog(
    `Current room: ${selectedRoomId}\nActors:\n${await (
      await tx
        .scan({prefix: `actors/${selectedRoomId}`})
        .values()
        .toArray()
    )
      .map(a => `${a}`)
      .join('\n')}`,
  );
  return actor;
};

const removeActor = async (
  tx: WriteTransaction,
  actorID: string,
  timestamp: number,
  alsoRemoving: string[] = [],
) => {
  const key = `actor/${actorID}`;
  console.log(`Remove orchestrator actor ${actorID}`);
  // Remove any recordings this actor was broadcasting
  const recordings = (await tx
    .scan({prefix: `broadcaster/${actorID}`})
    .entries()
    .toArray()) as [string, string][];
  for await (const [key, recordingSuffix] of recordings) {
    serverLog(`Delete broadcast broadcasts/${recordingSuffix}.`);
    await tx.del(`broadcasts/${recordingSuffix}`);
    await tx.del(key);
  }
  // Remove any bots we control
  const bots = (await tx
    .scan({prefix: `controlled-bots/${actorID}`})
    .entries()
    .toArray()) as [string, string][];
  for await (const [key, botId] of bots) {
    serverLog(`Delete bot ${botId}.`);
    await removeActor(tx, botId, timestamp, [actorID, ...alsoRemoving]);
    await tx.del(key);
  }
  await tx.del(`alive/${actorID}`);

  const actor = (await tx.get(key)) as Actor;
  // Dunno who that is
  if (!actor) {
    return;
  }
  // Delete the actor and the index entry for them
  await tx.del(key);
  await tx.del(`actors/${actor.room}/${actorID}`);

  const currentRoom = (await tx.get(ROOM_ID_KEY)) as string;
  if (!currentRoom || actor.room !== currentRoom) {
    // The room that the actor was in doesn't exist, no need to do any more.
    console.log('Actor from old room');
    return;
  }
  // Decrement the room count, so that as long as we don't hit the ceiling, we'll
  // always use the same room.
  const roomCount = (await tx.get(ROOM_COUNT_KEY)) as number;
  if (!roomCount || roomCount < 0) {
    console.error("Can't remove an actor from an empty room...");
    return;
  }
  await tx.put(ROOM_COUNT_KEY, roomCount - 1);
};

const playRandomRecordings = async (
  tx: WriteTransaction,
  roomId: string,
  broadcasterId: string,
  placedPieces: Set<number>,
  timestamp: number,
) => {
  const browseRecordings = (await tx.get(
    `recording-index/${RecordingType.BROWSE}`,
  )) as string[];
  if (!browseRecordings || !browseRecordings.length) {
    console.log('Asked to start a recording, but there were none.');
    return;
  }
  const recordings: RecordingBroadcast[] = [];
  recordings.push({
    recordingId: must(
      chooseRandomWithSeed(timestamp, RECORDING_RANDOM_SEED, browseRecordings),
    )[0],
    type: RecordingType.BROWSE,
  });
  if (randomWithSeed(timestamp, BOT_RANDOM_SEED) <= PLACE_PIECE_PROBABILITY) {
    const dragRecordings = (await tx.get(
      `recording-index/${RecordingType.PLACE}`,
    )) as string[];
    // const rotateRecordings = (await tx.get(
    //   `recording-index/${RecordingType.ROTATE}`,
    // )) as string[];
    if (
      dragRecordings &&
      dragRecordings.length
      /* && rotateRecordings && rotateRecordings.length */
    ) {
      // Choose a random piece to place.
      const [_, pieceIdx] = must(
        chooseRandomWithSeed(
          timestamp,
          RECORDING_PIECE_SEED,
          PUZZLE_PIECES,
          (_, i) => !placedPieces.has(i),
        ),
      );
      const piece = PUZZLE_PIECES[pieceIdx];
      // Find find and drag recordings
      recordings.push({
        recordingId: must(
          chooseRandomWithSeed(
            timestamp,
            RECORDING_RANDOM_SEED,
            dragRecordings,
          ),
        )[0],
        type: RecordingType.PLACE,
        pieceNum: pieceIdx,
        targetCoord: {x: piece.dx, y: piece.dy},
      });
      recordings.push({
        recordingId: must(
          chooseRandomWithSeed(
            timestamp,
            RECORDING_RANDOM_SEED,
            dragRecordings,
          ),
        )[0],
        type: RecordingType.PLACE,
        pieceNum: pieceIdx,
        targetCoord: {x: piece.dx, y: piece.dy},
      });
    } else {
      console.log(
        'Asked to place a piece, but there were no drag/rotate recordings.',
      );
    }
  }
  // Create a bot to play these recordings with
  const bot = await createBot(tx, broadcasterId, roomId, timestamp);
  // Create a queue of recordings for this bot
  const broadcastQueue: BroadcastQueue = {
    roomId,
    recordings,
    broadcasterId,
    botId: bot.id,
    colorIdx: bot.colorIndex,
  };
  await tx.put(`broadcast-queues/${roomId}/${bot.id}`, broadcastQueue);
  return await playRecording(
    tx,
    bot,
    roomId,
    recordings[recordings.length - 1],
    broadcasterId,
    timestamp,
  );
};

const getAndValidateRecording = async (
  tx: ReadTransaction,
  recordingId: string,
  minFrames?: number,
): Promise<
  | {
      valid: false;
      recordingInfo: RecordingInfo | undefined;
      frames: [string, RecordingCursor][];
    }
  | {
      valid: true;
      recordingInfo: RecordingInfo;
      frames: [string, RecordingCursor][];
    }
> => {
  const recordingInfo = (await tx.get(`recording-info/${recordingId}`)) as
    | RecordingInfo
    | undefined;
  if (!recordingInfo) {
    return {
      valid: false,
      recordingInfo,
      frames: [],
    };
  }
  const frames = (await tx
    .scan({prefix: `recordings/${recordingId}/`})
    .entries()
    .toArray()) as [string, RecordingCursor][];
  // TODO: also remove rotations that don't go at least π*2 rad
  let tooShort =
    ((recordingInfo.type === RecordingType.PLACE ||
      recordingInfo.type === RecordingType.FIND) &&
      frames.length < MIN_FIND_OR_DRAG_FRAMES) ||
    (recordingInfo.type === RecordingType.BROWSE &&
      frames.length < MIN_BROWSE_FRAMES);
  if (minFrames) {
    tooShort = frames.length < minFrames;
  }
  return {
    valid: !tooShort,
    recordingInfo,
    frames,
  };
};

const deleteRecording = async (tx: WriteTransaction, recordingId: string) => {
  const recordingKeys = await tx
    .scan({prefix: `recordings/${recordingId}`})
    .keys();
  for await (const k of recordingKeys) {
    await tx.del(k);
  }
  await tx.del(`current-recording-frame/${recordingId}`);
  const info = (await tx.get(`recording-info/${recordingId}`)) as
    | RecordingInfo
    | undefined;
  await tx.del(`recording-info/${recordingId}`);
  if (info) {
    let index =
      ((await tx.get(`recording-index/${info.type}`)) as string[]) || [];
    // O(n) but also we've got bigger problems if this gets too big to scan.
    index = index.filter(r => r !== recordingId);
    await tx.put(`recording-index`, index);
  }
};

const finishRecording = async (tx: WriteTransaction, recordingId: string) => {
  const {frames, recordingInfo, valid} = await getAndValidateRecording(
    tx,
    recordingId,
  );
  await tx.del(`current-recording-frame/${recordingId}`);
  if (!valid) {
    console.log('invalid recording, deleting.');
    await deleteRecording(tx, recordingId);
    return;
  }
  const lastFrame = frames[frames.length - 1][1];
  const endCoord = {x: lastFrame.x, y: lastFrame.y};
  if (recordingInfo.type === RecordingType.PLACE) {
    const startCoord = must(
      recordingInfo.startCoord,
      'recording start coordinate',
    );
    // When we record drags, we want to normalize their angles to 0 degrees, so we
    // can just rotate it directly to the final angle.
    const angle = getAngle(startCoord, endCoord);
    // Rotate all the coordinates so that the "angle" of this movement becomes 0
    for await (const [key, frame] of frames) {
      const newPosition = relative(
        rotatePosition(frame, endCoord, addRadians(0, -angle)),
        endCoord,
      );
      await tx.put(key, {...frame, ...newPosition});
    }
  } else if (recordingInfo.type === RecordingType.ROTATE) {
    // TODO: something similar for rotations
  }
  await tx.put(`recording-info/${recordingId}`, {
    ...recordingInfo,
    endCoord,
  });
};

const RANDOM_LOCATION_SEED = 239;
const createBot = async (
  tx: WriteTransaction,
  broadcasterId: string,
  roomId: string,
  timestamp: number,
) => {
  // 8 bits of entropy is enough.
  const botId = broadcasterId.slice(0, 8) + `-${timestamp}-bot`;
  const bot = await createActor(tx, {
    fallbackRoomId: null,
    // Always make the bot in the same room as the controller
    lastRoom: roomId,
    actorID: botId,
    isBot: true,
    controller: broadcasterId,
    location:
      BOT_RANDOM_LOCATIONS[
        Math.floor(
          randomWithSeed(
            timestamp,
            RANDOM_LOCATION_SEED,
            BOT_RANDOM_LOCATIONS.length,
          ),
        )
      ],
    timestamp,
  });
  serverLog(`create bot ${botId}`, bot, bot.colorIndex);
  await tx.put(`controlled-bots/${broadcasterId}/${botId}`, botId);
  return bot;
};

const playRecording = async (
  tx: WriteTransaction,
  bot: Actor,
  roomId: string,
  recording: RecordingBroadcast,
  broadcasterId: string,
  timestamp: number,
) => {
  const recordingId = recording.recordingId;
  const broadcastId = recordingId + `@${timestamp}`;
  const broadcast: Broadcast = {
    broadcastId,
    ...recording,
    roomId,
    broadcasterId,
    botId: bot.id,
    colorIdx: bot.colorIndex,
  };
  await tx.put(`broadcasts/${roomId}/${broadcastId}`, broadcast);
  await tx.put(
    `broadcaster/${broadcasterId}/${recordingId}`,
    `${roomId}/${broadcastId}`,
  );
  return broadcast;
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

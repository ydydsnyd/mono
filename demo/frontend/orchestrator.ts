import {Reflect} from '@rocicorp/reflect';
import {
  ACTIVITY_PING_FREQUENCY,
  ORCHESTRATOR_ROOM_ID,
  USER_ID,
} from '../shared/constants';
import {WORKER_HOST} from '../shared/urls';
import {
  Cursor,
  Actor,
  RecordingCursor,
  Broadcast,
  RecordingType,
  PieceNumber,
  Position,
  RecordingID,
} from '../shared/types';
import {
  COLOR_INDEX_KEY,
  orchestratorMutators,
  ROOM_COUNT_KEY,
  ROOM_ID_KEY,
} from '../shared/orchestrator-mutators';
import {nanoid} from 'nanoid';
import {now, recordingCursorToCursor, sortableKeyNum} from '../shared/util';
import {getData, isAddDiff} from './data-util';
import {loggingOptions} from './logging-options';

export const initRoom = async (
  onPlayRecording: (recording: Broadcast, frames: RecordingCursor[]) => void,
  onActorsChanged: (actorIDs: Actor[]) => void,
  onUpdateLocalActor: (actor: Actor) => void,
  onOnlineChange: (online: boolean) => void,
  getPlacedPieces: () => Promise<PieceNumber[]>,
) => {
  // Set up our connection to reflect
  console.log(`Orchestrator connecting to worker at ${WORKER_HOST}`);
  let actor: Actor | undefined;

  // Create a reflect client
  const orchestratorClient = new Reflect<typeof orchestratorMutators>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: async online => {
      console.log(`online: ${online}`);
      onOnlineChange(online);
      await orchestratorClient.mutate.createActor({
        lastColorIndex: actor?.colorIndex || null,
        fallbackRoomId: nanoid(),
        forceNewRoomWithSecret: null,
        lastRoom: actor?.room || null,
        timestamp: now(),
      });
      const newActor = await waitForActor(orchestratorClient);
      onUpdateLocalActor(newActor);
    },
    userID: USER_ID,
    roomID: ORCHESTRATOR_ROOM_ID,
    auth: JSON.stringify({
      userID: USER_ID,
      roomID: ORCHESTRATOR_ROOM_ID,
    }),
    mutators: orchestratorMutators,
    ...loggingOptions,
  });

  const recordingFrames = async (recordingId: RecordingID) => {
    return await orchestratorClient.query(
      async tx =>
        (await tx
          .scan({prefix: `recordings/${recordingId}/`})
          .toArray()) as RecordingCursor[],
    );
  };

  const mutations = orchestratorClient.mutate;

  // Create our actor, which also will assign us a room. We have to wait for this
  // to complete (in the subscription above) before we can connect
  const params = new URLSearchParams(window.location.search);
  console.log(
    `Create actor for ${await orchestratorClient.query(tx => tx.clientID)}`,
  );
  mutations.createActor({
    fallbackRoomId: nanoid(),
    forceNewRoomWithSecret: params.get('reset'),
    timestamp: now(),
    lastRoom: null,
    lastColorIndex: null,
  });
  actor = await waitForActor(orchestratorClient);
  onUpdateLocalActor(actor);
  orchestratorClient.experimentalWatch(
    async diffs => {
      for (const diff of diffs.values()) {
        if (diff.key.startsWith(`broadcasts/${actor!.room}`)) {
          if (isAddDiff(diff)) {
            const recording = getData<Broadcast>(diff);
            if (recording.broadcasterId === actor!.id) {
              onPlayRecording(
                recording,
                await recordingFrames(recording.recordingId),
              );
            }
          }
        } else if (diff.key.startsWith('actor/')) {
          const actors = await orchestratorClient.query(
            async tx =>
              (await tx.scan({prefix: 'actor/'}).values().toArray()) as Actor[],
          );
          onActorsChanged(actors);
        }
      }
    },
    {initialValuesInFirstDiff: true},
  );
  // Ping the orchestrator periodically. If we don't ping for 5 minutes, it'll
  // remove our user.
  setInterval(async () => {
    orchestratorClient.mutate.alive({
      timestamp: now(),
      placedPieces: await getPlacedPieces(),
    });
  }, ACTIVITY_PING_FREQUENCY);

  return {
    actor,
    recordCursor: async (
      recordingId: string,
      cursor: Cursor,
      recordingType: RecordingType,
      priorRecordingId?: string,
    ) => {
      await orchestratorClient.mutate.addCursorRecording({
        recordingId,
        recordingType,
        cursor: {...cursor},
        allocatedRecordingId: nanoid(),
        priorRecordingId: priorRecordingId || null,
      });
    },
    finishBroadcast: async (
      broadcastId: string,
      recordingId: string,
      roomId: string,
      botId: string,
      currentTargetPiece?: PieceNumber,
      targetPieceCoord?: Position,
    ) => {
      await orchestratorClient.mutate.finishBroadcast({
        broadcastId,
        recordingId,
        roomId,
        botId,
        timestamp: now(),
        targetPiece: currentTargetPiece || null,
        targetCoord: targetPieceCoord || null,
      });
    },
    finishRecording: async (recordingId: string) => {
      await orchestratorClient.mutate.finishRecording({recordingId});
    },
    updateActorLocation: orchestratorClient.mutate.updateActorLocation,
    deleteRecording: orchestratorClient.mutate.deleteRecording,
    playRecording: async (
      recordingId: string,
      roomId: string,
      pieceCoordinates: Record<PieceNumber, Position>,
      currentPiece?: number,
    ) => {
      orchestratorClient.mutate.playRecording({
        roomId,
        recordingId,
        timestamp: now(),
        placedPieces: await getPlacedPieces(),
        currentPiece: currentPiece || null,
        pieceCoordinates,
      });
    },
    getRecordingFrame: async (id: string, botId: string, frameNum: number) => {
      const frame = (await orchestratorClient.query(
        async tx =>
          await tx.get(`recordings/${id}/${sortableKeyNum(frameNum)}`),
      )) as RecordingCursor | undefined;
      if (!frame) {
        return undefined;
      }
      return recordingCursorToCursor(botId, frame);
    },
    getDebug: async () => {
      return await orchestratorClient.query(async tx => {
        const getRecordings = async (type: RecordingType) => {
          const recordings = (
            ((await tx.get(`recording-index/${type}`)) as string[]) || []
          ).map(id => {
            return {
              id,
              frames: 0,
              type,
            };
          });
          for await (const r of recordings) {
            r.frames = (await recordingFrames(r.id)).length;
          }
          return recordings;
        };
        const recordings = [
          ...(await getRecordings(RecordingType.BROWSE)),
          ...(await getRecordings(RecordingType.FIND)),
          ...(await getRecordings(RecordingType.PLACE)),
          ...(await getRecordings(RecordingType.ROTATE)),
        ];
        const activeRecordings = (await tx
          .scan({prefix: `broadcasts/${actor!.room}`})
          .values()
          .toArray()) as Broadcast[];
        const currentRoom = (await tx.get(ROOM_ID_KEY)) as string;
        const currentRoomCount = (await tx.get(ROOM_COUNT_KEY)) as number;
        const currentColorIdx = (await tx.get(COLOR_INDEX_KEY)) as number;
        return {
          recordings,
          activeRecordings,
          currentRoom,
          currentRoomCount,
          currentColorIdx,
        };
      });
    },
  };
};

const waitForActor = (
  client: Reflect<typeof orchestratorMutators>,
): Promise<Actor> => {
  return new Promise(async (resolve, reject) => {
    const actor = await client.query(async tx => {
      return (await tx.get(`actor/${tx.clientID}`)) as Actor | undefined;
    });
    if (actor) {
      resolve({...actor});
      return;
    }
    const unsubscribe = client.subscribe<Actor | undefined>(
      async tx => {
        return (await tx.get(`actor/${tx.clientID}`)) as Actor | undefined;
      },
      {
        onData: actor => {
          // We have to wait until an actor exists
          if (!actor) {
            return;
          }
          unsubscribe();
          resolve({...actor});
        },
        onError: error => {
          console.error(`init error: ${error}`);
          reject(error);
        },
      },
    );
  });
};

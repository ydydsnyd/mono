import {Reflect} from '@rocicorp/reflect';
import {
  ACTIVITY_PING_FREQUENCY,
  ORCHESTRATOR_ROOM_ID,
  USER_ID,
} from '../shared/constants';
import {WORKER_HOST} from '../shared/urls';
import type {
  Cursor,
  Actor,
  RecordingCursor,
  RoomRecording,
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
import {logLevel, logSinks} from './logging-options';

export const initRoom = async (
  onPlayRecording: (recording: RoomRecording) => void,
  onActorsChanged: (actorIds: Actor[]) => void,
  onUpdateLocalActor: (actor: Actor) => void,
  onOnlineChange: (online: boolean) => void,
): Promise<{
  actor: Actor;
  recordCursor: (recordingId: string, cursor: Cursor) => Promise<void>;
  deleteRecording: (recordingId: string) => Promise<void>;
  playRecording: (recordingId: string, roomId: string) => Promise<void>;
  updateActorLocation: (location: string) => Promise<void>;
  finishRecording: (
    recordingId: string,
    roomId: string,
    botId: string,
  ) => Promise<void>;
  getRecordingFrame: (
    id: string,
    botId: string,
    frame: number,
  ) => Promise<Cursor | undefined>;
  getDebug: () => Promise<{
    activeRecordings: RoomRecording[];
    recordings: {id: string; frames: number}[];
    currentRoom: string;
    currentRoomCount: number;
    currentColorIdx: number;
  }>;
}> => {
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
    logLevel,
    logSinks,
    mutators: orchestratorMutators,
  });

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
        if (diff.key.startsWith(`room-recordings/${actor!.room}`)) {
          if (isAddDiff(diff)) {
            const recording = getData<RoomRecording>(diff);
            if (recording.broadcasterId === actor!.id) {
              onPlayRecording(recording);
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
  setInterval(() => {
    orchestratorClient.mutate.alive(now());
  }, ACTIVITY_PING_FREQUENCY);

  return {
    actor,
    recordCursor: async (recordingId: string, cursor: Cursor) => {
      await orchestratorClient.mutate.addCursorRecording({
        recordingId,
        cursor,
      });
    },
    finishRecording: async (
      recordingId: string,
      roomId: string,
      botId: string,
    ) => {
      await orchestratorClient.mutate.finishRecording({
        recordingId,
        roomId,
        botId,
        timestamp: now(),
      });
    },
    updateActorLocation: orchestratorClient.mutate.updateActorLocation,
    deleteRecording: orchestratorClient.mutate.deleteRecording,
    playRecording: async (recordingId: string, roomId: string) => {
      orchestratorClient.mutate.playRecording({
        roomId,
        recordingId,
        timestamp: now(),
      });
    },
    getRecordingFrame: async (id: string, botId: string, frameNum: number) => {
      const idParts = id.split('@');
      const frame = (await orchestratorClient.query(
        async tx =>
          await tx.get(`recordings/${idParts[0]}/${sortableKeyNum(frameNum)}`),
      )) as RecordingCursor | undefined;
      if (!frame) {
        return undefined;
      }
      return recordingCursorToCursor(botId, frame);
    },
    getDebug: async () => {
      return await orchestratorClient.query(async tx => {
        const recordings = (
          ((await tx.get('recordings-index')) as string[]) || []
        ).map(id => {
          return {
            id,
            frames: 0,
          };
        });
        for await (const r of recordings) {
          r.frames = (await tx.get(
            `current-recording-frame/${r.id}`,
          )) as number;
        }
        const activeRecordings = (await tx
          .scan({prefix: `room-recordings/${actor!.room}`})
          .values()
          .toArray()) as RoomRecording[];
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

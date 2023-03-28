import {Reflect} from '@rocicorp/reflect';
import {ORCHESTRATOR_ROOM_ID, USER_ID} from '../shared/constants';
import {WORKER_HOST} from '../shared/urls';
import type {
  Cursor,
  OrchestratorActor,
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

export const initRoom = async (
  onPlayRecording: (recording: RoomRecording) => void,
  onBotCreated: (bot: OrchestratorActor) => void,
): Promise<{
  actor: OrchestratorActor;
  clientCount: () => Promise<number>;
  rebucket: (actor: OrchestratorActor) => Promise<void>;
  recordCursor: (recordingId: string, cursor: Cursor) => Promise<void>;
  deleteRecording: (recordingId: string) => Promise<void>;
  playRecording: (recordingId: string, roomId: string) => Promise<void>;
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

  // Make sure we have the orchestrator room
  if (process.env.NEXT_PUBLIC_CREATE_ROOMS) {
    const res = await fetch('/api/create-room', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({roomID: ORCHESTRATOR_ROOM_ID}),
    });
    if (!res.ok) {
      const message = await res.text();
      throw new Error(
        `Failed to connect to room ${ORCHESTRATOR_ROOM_ID}\n(${res.status}: ${message})`,
      );
    }
  }

  // Create a reflect client
  const orchestratorClient = new Reflect<typeof orchestratorMutators>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: online => {
      console.log(`online: ${online}`);
    },
    userID: USER_ID,
    roomID: ORCHESTRATOR_ROOM_ID,
    auth: JSON.stringify({
      userID: USER_ID,
      roomID: ORCHESTRATOR_ROOM_ID,
    }),
    logLevel: 'error',
    mutators: orchestratorMutators,
  });

  const mutations = orchestratorClient.mutate;

  // Create our actor, which also will assign us a room. We have to wait for this
  // to complete (in the subscription above) before we can connect
  const params = new URLSearchParams(window.location.search);
  console.log(
    `Create actor for ${await orchestratorClient.query(tx => tx.clientID)}`,
  );
  mutations.createOrchestratorActor({
    fallbackRoomId: nanoid(),
    forceNewRoomWithSecret: params.get('reset'),
    timestamp: now(),
  });
  const actor = await waitForActor(orchestratorClient);
  orchestratorClient.experimentalWatch(
    diffs => {
      for (const diff of diffs.values()) {
        if (diff.key.startsWith(`room-recordings/${actor.room}`)) {
          if (isAddDiff(diff)) {
            const recording = getData<RoomRecording>(diff);
            if (recording.broadcasterId === actor.id) {
              onPlayRecording(recording);
            }
          }
        } else if (diff.key.startsWith('orchestrator-actor/')) {
          if (isAddDiff(diff)) {
            const bot = getData<OrchestratorActor>(diff);
            if (bot.isBot && bot.botController === actor.id) {
              // This is our bot, we're responsible for making it in our reflect room.
              onBotCreated(bot);
            }
          }
        }
      }
    },
    {initialValuesInFirstDiff: true},
  );
  return {
    actor,
    clientCount: async () =>
      await orchestratorClient.query(
        async tx =>
          await (
            await tx.scan({prefix: 'orchestrator-actor/'}).toArray()
          ).length,
      ),
    rebucket: async actor => {
      await mutations.createOrchestratorActor({
        lastColorIndex: actor.colorIndex,
        fallbackRoomId: nanoid(),
        forceNewRoomWithSecret: null,
        lastRoom: actor.room,
        timestamp: now(),
      });
      const newActor = await waitForActor(orchestratorClient);
      // TODO: this isn't very clear - perhaps move to a more event-based API?
      actor.id = newActor.id;
      actor.room = newActor.room;
    },
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
          .scan({prefix: `room-recordings/${actor.room}`})
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
): Promise<OrchestratorActor> => {
  return new Promise(async (resolve, reject) => {
    const actor = await client.query(async tx => {
      return (await tx.get(`orchestrator-actor/${tx.clientID}`)) as
        | OrchestratorActor
        | undefined;
    });
    if (actor) {
      resolve({...actor});
      return;
    }
    const unsubscribe = client.subscribe<OrchestratorActor | undefined>(
      async tx => {
        return (await tx.get(`orchestrator-actor/${tx.clientID}`)) as
          | OrchestratorActor
          | undefined;
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

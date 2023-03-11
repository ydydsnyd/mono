import {Reflect} from '@rocicorp/reflect';
import {ORCHESTRATOR_ROOM_ID} from '../shared/constants';
import {WORKER_HOST} from '../shared/urls';
import type {OrchestratorActor} from '../shared/types';
import {orchestratorMutators} from '../shared/orchestrator-mutators';
import {nanoid} from 'nanoid';
import {now} from '../shared/util';

export const initRoom = async (): Promise<{
  actor: OrchestratorActor;
  alive: () => Promise<void>;
  getDebug: () => Promise<{
    currentRoom: string;
    currentRoomCount: number;
    currentColorIdx: number;
  }>;
}> => {
  // Set up our connection to reflect
  console.log(`Orchestrator connecting to worker at ${WORKER_HOST}`);

  // Make sure we have the orchestrator room
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

  // Create a reflect client
  const userID = nanoid();
  const orchestratorClient = new Reflect<typeof orchestratorMutators>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: online => {
      console.log(`online: ${online}`);
    },
    userID,
    roomID: ORCHESTRATOR_ROOM_ID,
    auth: JSON.stringify({
      userID,
      roomID: ORCHESTRATOR_ROOM_ID,
    }),
    logLevel: 'error',
    mutators: orchestratorMutators,
  });

  const mutations = orchestratorClient.mutate;

  return new Promise((resolve, reject) => {
    orchestratorClient.subscribe<OrchestratorActor>(
      async tx => (await tx.get(`actor/${tx.clientID}`)) as OrchestratorActor,
      {
        onData: actor => {
          // We have to wait until an actor exists
          if (!actor) {
            return;
          }
          resolve({
            actor,
            alive: () => mutations.deadClientSwitch(now()),
            getDebug: async () => {
              return await orchestratorClient.query(async tx => {
                const currentRoom = (await tx.get('current-room-id')) as string;
                const currentRoomCount = (await tx.get(
                  'current-room-count',
                )) as number;
                const currentColorIdx = (await tx.get('color-index')) as number;
                return {currentRoom, currentRoomCount, currentColorIdx};
              });
            },
          });
        },
        onError: error => reject(error),
      },
    );
    // Create our actor, which also will assign us a room. We have to wait for this
    // to complete (in the subscription above) before we can connect
    const params = new URLSearchParams(window.location.search);
    mutations.createOrchestratorActor({
      fallbackId: nanoid(),
      forceNewRoomWithSecret: params.get('reset'),
      currentTime: now(),
    });
  });
};

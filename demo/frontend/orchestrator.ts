import {Reflect} from '@rocicorp/reflect';
import {ORCHESTRATOR_ROOM_ID} from '../shared/constants';
import {WORKER_HOST} from '../shared/urls';
import type {OrchestratorActor} from '../shared/types';
import {
  COLOR_INDEX_KEY,
  orchestratorMutators,
  ROOM_COUNT_KEY,
  ROOM_ID_KEY,
} from '../shared/orchestrator-mutators';
import {nanoid} from 'nanoid';

export const initRoom = async (): Promise<{
  actor: OrchestratorActor;
  clientCount: () => Promise<number>;
  rebucket: (actor: OrchestratorActor) => Promise<void>;
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

  // Create our actor, which also will assign us a room. We have to wait for this
  // to complete (in the subscription above) before we can connect
  const params = new URLSearchParams(window.location.search);
  mutations.createOrchestratorActor({
    fallbackId: nanoid(),
    forceNewRoomWithSecret: params.get('reset'),
  });
  const actor = await waitForActor(orchestratorClient);
  return {
    actor,
    clientCount: async () =>
      await orchestratorClient.query(
        async tx => await (await tx.scan({prefix: 'actor/'}).toArray()).length,
      ),
    rebucket: async actor => {
      await mutations.createOrchestratorActor({
        lastColorIndex: actor.colorIndex,
        fallbackId: nanoid(),
        forceNewRoomWithSecret: null,
      });
      const newActor = await waitForActor(orchestratorClient);
      // TODO: this isn't very clear - perhaps move to a more event-based API?
      actor.id = newActor.id;
      actor.room = newActor.room;
    },
    getDebug: async () => {
      return await orchestratorClient.query(async tx => {
        const currentRoom = (await tx.get(ROOM_ID_KEY)) as string;
        const currentRoomCount = (await tx.get(ROOM_COUNT_KEY)) as number;
        const currentColorIdx = (await tx.get(COLOR_INDEX_KEY)) as number;
        return {currentRoom, currentRoomCount, currentColorIdx};
      });
    },
  };
};

const waitForActor = (
  client: Reflect<typeof orchestratorMutators>,
): Promise<OrchestratorActor> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = client.subscribe<OrchestratorActor>(
      async tx => (await tx.get(`actor/${tx.clientID}`)) as OrchestratorActor,
      {
        onData: actor => {
          // We have to wait until an actor exists
          if (!actor) {
            return;
          }
          unsubscribe();
          resolve(actor);
        },
        onError: error => reject(error),
      },
    );
  });
};

import {Reflect} from '@rocicorp/reflect';
import {ORCHESTRATOR_ROOM_ID, USER_ID} from '../shared/constants';
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
    fallbackId: nanoid(),
    forceNewRoomWithSecret: params.get('reset'),
  });
  const actor = await waitForActor(orchestratorClient);
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
        fallbackId: nanoid(),
        forceNewRoomWithSecret: null,
        lastRoom: actor.room,
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

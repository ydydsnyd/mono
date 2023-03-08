import {Reflect} from '@rocicorp/reflect';
import {ORCHESTRATOR_ROOM_ID} from '../shared/constants';
import {WORKER_HOST} from '../shared/urls';
import type {OrchestratorActor} from '../shared/types';
import {orchestratorMutators} from '../shared/orchestrator-mutators';

export const initRoom = async (userID: string) => {
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

  // Before allowing clients to perform mutations, make sure that we've written
  // our local actor to reflect.
  await mutations.createOrchestratorActor(userID);

  const actor = (await orchestratorClient.query(async tx => {
    return await tx.get(`actor/${userID}`);
  })) as OrchestratorActor;

  console.assert(actor);

  return {
    actor,
    removeActor: async () => await mutations.removeOchestratorActor(userID),
  };
};

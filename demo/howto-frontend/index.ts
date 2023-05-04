import {Reflect} from '@rocicorp/reflect';
import {loggingOptions} from '../frontend/logging-options';
import {mutators, M} from '../shared/mutators';
import {getWorkerHost} from '@/util/worker-host';

export const init = (roomID: string, userID: string): Reflect<M> => {
  // Set up our connection to reflect
  console.log(`Creating ${userID} room`);
  // Create a reflect client
  const reflectClient = new Reflect<M>({
    socketOrigin: getWorkerHost(),
    onOnlineChange: online => {
      console.log(`${userID} online: ${online}`);
    },
    userID,
    roomID,
    auth: JSON.stringify({
      userID,
      roomID,
    }),
    mutators,
    ...loggingOptions,
  });

  return reflectClient;
};

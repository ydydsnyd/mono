import {Reflect} from '@rocicorp/reflect';
import {mutators, M} from '../shared/mutators';

import {WORKER_HOST} from '../shared/urls';

export const init = (roomID: string, userID: string): Reflect<M> => {
  // Set up our connection to reflect
  console.log(`Creating ${userID} room`);
  // Create a reflect client
  const reflectClient = new Reflect<M>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: online => {
      console.log(`${userID} online: ${online}`);
    },
    userID,
    roomID,
    auth: JSON.stringify({
      userID,
      roomID,
    }),
    logLevel: 'error',
    mutators,
  });

  return reflectClient;
};

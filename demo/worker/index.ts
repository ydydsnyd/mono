import {createReflectServer} from '@rocicorp/reflect-server';
import {Env, mutators, setEnv} from '../shared/mutators.js';
import renderModule from '../../renderer/pkg/renderer_bg.wasm';
import initRenderer from '../../renderer/pkg';
import {clearBotmaster} from '../frontend/botmaster';

setEnv(Env.SERVER, async () => {
  await initRenderer(renderModule);
});

const authHandler = async (auth: string, roomID: string) => {
  // Note a real implementation should use signed and encrypted auth tokens,
  // or store the auth tokens in a session database for validation.
  const authJson = JSON.parse(auth);
  if (!authJson) {
    throw Error('Empty auth');
  }
  if (authJson.roomID !== roomID) {
    throw new Error('incorrect roomID');
  }
  if (!authJson.userID || typeof authJson.userID !== 'string') {
    throw new Error('Missing userID');
  }

  return {
    userID: authJson.userID,
  };
};

const {worker, RoomDO, AuthDO} = createReflectServer({
  mutators,
  authHandler,
  disconnectHandler: async write => {
    await mutators.removeActor(write, write.clientID);
    await clearBotmaster(write);
  },
  getLogLevel: () => 'info',
  allowUnconfirmedWrites: true,
});

export {worker as default, RoomDO, AuthDO};

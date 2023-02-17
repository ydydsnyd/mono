import {createReflectServer} from '@rocicorp/reflect-server';
/* @ts-ignore */
import rapier3dLib from '@dimforge/rapier3d-inject';
/* @ts-ignore */
import rapier3dModule from '../../node_modules/@dimforge/rapier3d-inject/rapier_wasm3d_bg.wasm';
import {Env, mutators, setEnv} from '../shared/mutators.js';
import renderModule from '../../renderer/pkg/renderer_bg.wasm';
import initRenderer from '../../renderer/pkg';
import type {Rapier3D} from '../shared/physics.js';

let rapier3d: Rapier3D;
const getPhysicsEngine = async () => {
  if (!rapier3d) {
    await rapier3dLib.init(rapier3dModule);
    rapier3d = rapier3dLib as unknown as Rapier3D;
  }
  return rapier3d;
};
setEnv(
  Env.SERVER,
  async () => {
    await initRenderer(renderModule);
  },
  getPhysicsEngine,
);

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
  },
  getLogLevel: () => 'info',
  allowUnconfirmedWrites: true,
});

export {worker as default, RoomDO, AuthDO};

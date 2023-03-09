import {
  createReflectServer,
  ReflectServerBaseEnv,
} from '@rocicorp/reflect-server';
import {mutators, setEnv} from '../shared/mutators';
import {
  orchestratorMutators,
  setEnv as setOrchestratorEnv,
} from '../shared/orchestrator-mutators';
import renderModule from '../../vendor/renderer/renderer_bg.wasm';
import initRenderer from '../../vendor/renderer';
import {Env} from '../shared/types';
import {ORCHESTRATOR_ROOM_ID} from '../shared/constants';

setEnv(Env.SERVER, async () => {
  await initRenderer(renderModule);
});

setOrchestratorEnv(Env.SERVER);

let globalRoomID = 'UNKNOWN';

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
  globalRoomID = roomID;
  console.log(`user ${authJson.userID} connected to ${roomID}`);
  return {
    userID: authJson.userID,
  };
};

const allMutators = {...mutators, ...orchestratorMutators};
const mCount = (o: object) => Object.keys(o).length;
if (mCount(mutators) + mCount(orchestratorMutators) !== mCount(allMutators)) {
  throw new Error(
    'Invalid mutators - all mutator names must be unique across frontend and orchestrator clients',
  );
}

const {worker, RoomDO, AuthDO} = createReflectServer({
  mutators: allMutators,
  authHandler,
  disconnectHandler: async write => {
    if (globalRoomID === ORCHESTRATOR_ROOM_ID) {
      await orchestratorMutators.removeOchestratorActor(write, write.clientID);
    } else {
      await mutators.removeActor(write, {
        roomID: globalRoomID,
        clientID: write.clientID,
      });
    }
  },
  getLogLevel: () => 'error',
  allowUnconfirmedWrites: true,
});

export {RoomDO, AuthDO};

const exports = {
  async fetch(
    request: Request,
    env: {NEW_ROOM_SECRET?: string} & ReflectServerBaseEnv,
    ctx: any,
  ) {
    if (env.NEW_ROOM_SECRET) {
      setOrchestratorEnv(
        Env.SERVER,
        new Uint8Array(
          env.NEW_ROOM_SECRET.split(',').map(n => parseInt(n, 10)),
        ),
      );
    }
    return worker.fetch!(request, env, ctx);
  },
};
export default exports;

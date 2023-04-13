import {
  consoleLogSink,
  createDatadogMetricsSink,
  createReflectServer,
  createWorkerDatadogLogSink,
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

type ReflectNetServerEnv = {
  NEW_ROOM_SECRET?: string;
  CLEAN_ROOM_UID?: string;
  DATADOG_METRICS_API_KEY?: string;
  DATADOG_LOGS_API_KEY?: string;
} & ReflectServerBaseEnv;

setEnv(Env.SERVER, async () => {
  await initRenderer(renderModule);
});

const CLEAN_ROOM_KEY = 'a-clean-room-key-that-is-unlikely-to-collide';

setOrchestratorEnv(Env.SERVER);

const allMutators = {...mutators, ...orchestratorMutators};
const mCount = (o: object) => Object.keys(o).length;
if (mCount(mutators) + mCount(orchestratorMutators) !== mCount(allMutators)) {
  throw new Error(
    'Invalid mutators - all mutator names must be unique across frontend and orchestrator clients',
  );
}

const DATADOG_SERVICE_LABEL = 'reflect.net';
const {
  worker,
  RoomDO: SuperRoomDO,
  AuthDO,
} = createReflectServer((env: ReflectNetServerEnv) => ({
  mutators: allMutators,
  disconnectHandler: async write => {
    await orchestratorMutators.removeActor(write, {
      clientID: write.clientID,
      timestamp: new Date().getTime(),
    });
  },
  metricsSink:
    env.DATADOG_METRICS_API_KEY !== undefined
      ? createDatadogMetricsSink({
          apiKey: env.DATADOG_METRICS_API_KEY,
          service: DATADOG_SERVICE_LABEL,
        })
      : undefined,
  logSinks:
    env.DATADOG_LOGS_API_KEY !== undefined
      ? [
          createWorkerDatadogLogSink({
            apiKey: env.DATADOG_LOGS_API_KEY,
            service: DATADOG_SERVICE_LABEL,
          }),
          consoleLogSink,
        ]
      : undefined,
  logLevel: 'info',
}));

class RoomDO extends SuperRoomDO {
  constructor(state: any, env: ReflectNetServerEnv) {
    super(state, env);
    if (env.CLEAN_ROOM_UID) {
      state.storage.get(CLEAN_ROOM_KEY).then((value: string) => {
        if (value !== env.CLEAN_ROOM_UID) {
          console.log('Clearing data...');
          state.storage
            .deleteAll()
            .catch((e: Error) => console.error('Failed clearing data', e));
          state.storage
            .put(CLEAN_ROOM_KEY, env.CLEAN_ROOM_UID)
            .catch((e: Error) => console.error('Failed updating clear key', e));
        }
      });
    }
    if (env.NEW_ROOM_SECRET) {
      setOrchestratorEnv(
        Env.SERVER,
        new Uint8Array(
          env.NEW_ROOM_SECRET.split(',').map(n => parseInt(n, 10)),
        ),
      );
    }
  }
}

export {RoomDO, AuthDO};
export default worker;

import {ServiceRunnerDO, ServiceRunnerEnv} from './runner.js';
import {createWorker} from './worker.js';

const DEFAULT_LOG_LEVEL = 'info';

const worker = createWorker((_env: ServiceRunnerEnv) => ({
  logLevel: DEFAULT_LOG_LEVEL,
  logSink: {
    log: (lc, level, message, details) => {
      console.log(lc, level, message, details);
    },
  },
}));

export {ServiceRunnerDO, worker as default};

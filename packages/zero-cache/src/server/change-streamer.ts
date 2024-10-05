import {must} from 'shared/dist/must.js';
import {getZeroConfig} from '../config/zero-config.js';
import {ChangeStreamerHttpServer} from '../services/change-streamer/change-streamer-http.js';
import {initializeStreamer} from '../services/change-streamer/change-streamer-service.js';
import {initializeChangeSource} from '../services/change-streamer/pg/change-source.js';
import {runOrExit} from '../services/runner.js';
import {pgClient} from '../types/pg.js';
import {
  parentWorker,
  singleProcessMode,
  type Worker,
} from '../types/processes.js';
import {createLogContext} from './logging.js';

const MAX_CHANGE_DB_CONNECTIONS = 5;

export default async function runWorker(parent: Worker) {
  const config = await getZeroConfig();
  const lc = createLogContext(config.log, {worker: 'change-streamer'});

  // Kick off DB connection warmup in the background.
  const changeDB = pgClient(lc, config.changeDbUri, {
    max: MAX_CHANGE_DB_CONNECTIONS,
  });
  void Promise.allSettled(
    Array.from({length: MAX_CHANGE_DB_CONNECTIONS}, () =>
      changeDB`SELECT 1`.simple().execute(),
    ),
  );

  // Note: This performs initial sync of the replica if necessary.
  const {changeSource, replicationConfig} = await initializeChangeSource(
    lc,
    config.upstreamUri,
    config.shard,
    config.replicaDbFile,
  );

  const changeStreamer = await initializeStreamer(
    lc,
    changeDB,
    changeSource,
    replicationConfig,
  );

  const changeStreamerWebServer = new ChangeStreamerHttpServer(
    lc,
    changeStreamer,
  );

  void runOrExit(lc, changeStreamer, changeStreamerWebServer);

  parent.send(['ready', {ready: true}]);
}

// fork()
if (!singleProcessMode()) {
  void runWorker(must(parentWorker));
}

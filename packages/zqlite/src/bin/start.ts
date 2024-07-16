import {consoleLogSink} from '@rocicorp/logger';
import {ZeroCache} from '../services/zero-cache.js';
import {DurableStorage} from '../services/duped/durable-storage.js';

const storage = new DurableStorage();
const cache = new ZeroCache(consoleLogSink, 'debug', storage);

await cache.start();

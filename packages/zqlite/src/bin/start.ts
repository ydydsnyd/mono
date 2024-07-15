import {consoleLogSink} from '@rocicorp/logger';
import {ZeroCache} from '../services/zero-cache.js';
import {DurableStorage} from '../services/duped/durable-storage.js';

console.log('CREATING DURABLE STORAGE');
const storage = new DurableStorage();
console.log('CREATED DURABLE STORAGE');
const cache = new ZeroCache(consoleLogSink, 'info', storage);
console.log('MADE CACHE');

await cache.start();

import {default as makeOptions} from './app-module-name.js';
import {createReflectServer} from './server-module-name.js';
import {
  newOptionsBuilder,
  logLevel,
  defaultConsoleLogSink,
  logFilter,
} from './server/options.js';
const optionsBuilder = newOptionsBuilder(makeOptions)
  .add(logLevel())
  .add(defaultConsoleLogSink())
  .add(logFilter((level, ctx) => level === 'error' || ctx?.['vis'] === 'app'))
  .build();
const {worker, RoomDO, AuthDO} = createReflectServer(optionsBuilder);
export {AuthDO, RoomDO, worker as default};

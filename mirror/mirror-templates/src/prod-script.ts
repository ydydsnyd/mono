import {default as makeOptions} from './app-module-name.js';
import {createReflectServer} from './server-module-name.js';
import {
  datadogLogging,
  datadogMetrics,
  defaultConsoleLogSink,
  logFilter,
  logLevel,
  newOptionsBuilder,
} from './server/options.js';
const optionsBuilder = newOptionsBuilder(makeOptions)
  .add(logLevel())
  .add(defaultConsoleLogSink())
  .add(logFilter((level, ctx) => level === 'error' || ctx?.['vis'] === 'app'))
  .add(datadogLogging('app-name.team-subdomain', 'app-script-name'))
  .add(datadogMetrics('app-name.team-subdomain', {script: 'app-script-name'}))
  .build();
const {worker, RoomDO, AuthDO} = createReflectServer(optionsBuilder);
export {AuthDO, RoomDO, worker as default};

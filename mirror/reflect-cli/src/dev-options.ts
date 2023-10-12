import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';

export function devOptions(yargs: CommonYargsArgv) {
  return (
    yargs
      // `port` is done in a pretty strange way to be able to detect if port was
      // provided or not
      .option('port', {
        alias: 'p',
        describe: 'Port to run the dev server on',
        type: 'number',
        requiresArg: true,
        default: 8080,
      })
      .option('silence-startup-message', {
        describe: 'Silence startup message',
        type: 'boolean',
        default: false,
      })
  );
}

export type DevHandlerArgs = YargvToInterface<ReturnType<typeof devOptions>>;

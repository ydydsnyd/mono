import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';

export function createOptions(yargs: CommonYargsArgv) {
  return yargs.option('name', {
    describe: 'Name of the app',
    type: 'string',
    demandOption: true,
  });
}

export type CreatedHandlerArgs = YargvToInterface<
  ReturnType<typeof createOptions>
>;

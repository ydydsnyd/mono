import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';

export function publishOptions(yargs: CommonYargsArgv) {
  return yargs.option('reflect-channel', {
    desc: 'Set the Reflect Channel for server updates',
    type: 'string',
    hidden: true,
  });
}

export type PublishHandlerArgs = YargvToInterface<
  ReturnType<typeof publishOptions>
>;

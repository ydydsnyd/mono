import type {CommonYargsArgv, YargvToInterface} from '../yarg-types.js';

export function tailOptions(yargs: CommonYargsArgv) {
  return yargs.option('room-id', {
    describe: 'The room ID of the room to tail',
    type: 'string',
    requiresArg: true,
    demandOption: true,
  });
}

export type TailHandlerArgs = YargvToInterface<ReturnType<typeof tailOptions>>;

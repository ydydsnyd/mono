import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';

export function deleteOptions(yargs: CommonYargsArgv) {
  return yargs
    .option('name', {
      describe: 'Name of the app to delete',
      type: 'string',
      conflicts: ['appID', 'all'],
    })
    .option('appID', {
      describe: 'Internal ID of the app',
      type: 'string',
      conflicts: ['all', 'name'],
      hidden: true,
    })
    .option('all', {
      describe:
        'Delete all of your apps, confirming for each one (unless --force is specified)',
      type: 'boolean',
      conflicts: ['name', 'appID'],
    })
    .option('force', {
      describe: 'Suppress the confirmation prompt',
      type: 'boolean',
      alias: 'f',
      default: false,
    });
}

export type DeleteHandlerArgs = YargvToInterface<
  ReturnType<typeof deleteOptions>
>;

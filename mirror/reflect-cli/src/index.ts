import {hideBin} from 'yargs/helpers';
import {
  CommandLineArgsError,
  createCLIParserBase,
} from './create-cli-parser.js';
import {CreatedHandlerArgs, createOptions} from './create-options.js';
import {DeleteHandlerArgs, deleteOptions} from './delete-options.js';
import {DevHandlerArgs, devOptions} from './dev-options.js';
import {handleWith} from './firebase.js';
import {initOptions} from './init-options.js';
import {PublishHandlerArgs, publishOptions} from './publish-options.js';
import {TailHandlerArgs, tailOptions} from './tail/tail-options.js';

async function main(argv: string[]): Promise<void> {
  const reflectCLI = createCLIParser(argv);

  try {
    await reflectCLI.parse();
  } catch (e) {
    if (e instanceof CommandLineArgsError) {
      console.log(e.message);
      await createCLIParser([...argv, '--help']).parse();
    } else {
      throw e;
    }
  }
}

function createCLIParser(argv: string[]) {
  const reflectCLI = createCLIParserBase(argv);

  // create
  reflectCLI.command(
    'create <name>',
    '🛠  Create a basic Reflect project',
    createOptions,
    handleWith(async (yargs: CreatedHandlerArgs) =>
      (await import('./create.js')).createHandler(yargs),
    ).andCleanup(),
  );

  // init
  reflectCLI.command(
    ['init', 'lfg'],
    '🚀 Add Reflect and basic mutators to an existing project',
    initOptions,
    handleWith(async yargs =>
      (await import('./init.js')).initHandler(yargs),
    ).andCleanup(),
  );

  // dev
  reflectCLI.command(
    'dev',
    '👷 Start a local dev server for your Reflect project',
    devOptions,
    handleWith(async (yargs: DevHandlerArgs) =>
      (await import('./dev.js')).devHandler(yargs),
    ).andCleanup(),
  );

  // login
  reflectCLI.command(
    'login',
    '🔓 Login to Reflect',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    handleWith(async yargs =>
      (await import('./login.js')).loginAndAuthenticateHandler(yargs),
    ).andCleanup(),
  );

  // publish
  reflectCLI.command(
    'publish',
    '🆙 Publish your Reflect project',
    publishOptions,
    handleWith(async (yargs: PublishHandlerArgs) =>
      (await import('./publish.js')).publishHandler(yargs),
    ).andCleanup(),
  );

  // tail
  reflectCLI.command(
    'tail',
    '🦚 Start a log tailing session',
    tailOptions,
    handleWith(async (yargs: TailHandlerArgs) =>
      (await import('./tail/index.js')).tailHandler(yargs),
    ).andCleanup(),
  );

  // delete
  reflectCLI.command(
    'delete',
    '🗑️  Delete one or more Apps and their associated data. If no flags are specified, defaults to the App of the current directory.',
    deleteOptions,
    handleWith(async (yargs: DeleteHandlerArgs) =>
      (await import('./delete.js')).deleteHandler(yargs),
    ).andCleanup(),
  );

  reflectCLI.command(
    'status',
    '📊 Show the status of current deployed app',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    handleWith(async yargs =>
      (await import('./status.js')).statusHandler(yargs),
    ).andCleanup(),
  );

  return reflectCLI;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main(hideBin(process.argv));

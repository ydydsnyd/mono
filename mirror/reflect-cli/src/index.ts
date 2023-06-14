import {ProxyAgent, setGlobalDispatcher} from 'undici';
import makeCLI from 'yargs';
import {hideBin} from 'yargs/helpers';
import {publishHandler, publishOptions} from './publish.js';
import {version} from './version.js';

const proxy =
  process.env.https_proxy ||
  process.env.HTTPS_PROXY ||
  process.env.http_proxy ||
  process.env.HTTP_PROXY ||
  undefined;

if (proxy) {
  setGlobalDispatcher(new ProxyAgent(proxy));
  console.log(
    `Proxy environment variables detected. We'll use your proxy for fetch requests.`,
  );
}

export class CommandLineArgsError extends Error {}

export function createCLIParser(argv: string[]) {
  // Type check result against CommonYargsOptions to make sure we've included
  // all common options
  const reflectCLI = makeCLI(argv)
    .strict()
    .showHelpOnFail(true)
    .fail((msg, error) => {
      if (!error || error.name === 'YError') {
        error = new CommandLineArgsError(msg);
      }
      throw error;
    })
    .scriptName(`npx @rocicorp/reflect`)
    .wrap(null)
    .version(false)
    .option('v', {
      describe: 'Show version number',
      alias: 'version',
      type: 'boolean',
    })
    .option('config', {
      alias: 'c',
      describe: 'Path to .toml configuration file',
      type: 'string',
      requiresArg: true,
    })
    .option('env', {
      alias: 'e',
      describe: 'Environment to use for operations and .env files',
      type: 'string',
      requiresArg: true,
    });

  reflectCLI.help().alias('h', 'help');

  reflectCLI.command(
    ['*'],
    false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    args => {
      if (args._.length > 0) {
        throw new CommandLineArgsError(`Unknown command: ${args._}.`);
      } else {
        if (args.v) {
          reflectCLI.showVersion();
        }
        reflectCLI.showHelp();
      }
    },
  );

  // init
  reflectCLI.command(
    'init [name]',
    '📥 Initialize a basic Reflect project, ',
    //initOptions,
    //initHandler
  );

  // dev
  reflectCLI.command(
    'dev [script]',
    '👂 Start a local server for developing your worker',
    // devOptions,
    // devHandler
  );

  // publish
  reflectCLI.command(
    'publish [script]',
    '🆙 Publish your reflect project',
    publishOptions,
    publishHandler,
  );

  // tail
  reflectCLI.command(
    'tail [worker]',
    '🦚 Starts a log tailing session running worker',
    // tailOptions,
    // tailHandler
  );

  // This set to false to allow overwrite of default behavior
  reflectCLI.version(false);

  // version
  reflectCLI.command(
    'version',
    false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
    () => {
      console.log(version);
    },
  );

  reflectCLI.exitProcess(false);

  return reflectCLI;
}

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

main(hideBin(process.argv)).catch(e => {
  console.error(e.message);
  process.exit(1);
});

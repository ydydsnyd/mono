import {SemVer} from 'semver';
import makeCLI, {Argv} from 'yargs';
import {initFirebase} from './firebase.js';
import {tryDeprecationCheck, version} from './version.js';
import Table from 'cli-table3';

export class CommandLineArgsError extends Error {}

export const scriptName = `npx reflect`;


function outputCommands(commands: (string | boolean)[][], options: (string | boolean)[][]): void {
  // Create a table instance with column headers
  const commandTable = new Table({
    head: ['Command', 'Description'],
    colWidths: [20, 60],
    wordWrap: true,
  });

  // Loop through each command and add it to the table
  for (const command of commands) {
    commandTable.push([command[0], command[1]]);
  }

  // Print the table to the console
  console.log(commandTable.toString());

    // Create a table instance with column headers
    const optionsTable = new Table({
      head: ['Option', 'Description'],
      colWidths: [20, 60],
      wordWrap: true,
    });
  
    // Loop through each command and add it to the table
    for (const option of options) {
      optionsTable.push([option[0], option[1]]);
    }
  
    // Print the table to the console
    console.log(optionsTable.toString());
}

export function createCLIParserBase(argv: string[]): Argv<{
  v: boolean | undefined;
  ['auth-key-from-env']: string | undefined;
  stack: string;
  local: boolean;
  runAs: string | undefined;
}> {
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
    .scriptName(scriptName)
    .wrap(null)
    .version(false) // This set to false to allow overwrite of default behavior
    .option('v', {
      describe: 'Show version number',
      alias: 'version',
      type: 'boolean',
    })
    .option('auth-key-from-env', {
      describe:
        'Authenticate with a value created with `npx reflect keys`, set in the specified environment variable',
      type: 'string',
      requiresArg: true,
    })
    .option('stack', {
      alias: 's',
      describe: 'prod or sandbox firebase stack',
      choices: ['prod', 'sandbox'],
      default: 'prod',
      requiresArg: true,
      hidden: true,
    })
    .option('local', {
      describe: 'run against a local auth login UI and cloud functions',
      type: 'boolean',
      default: false,
      hidden: true,
    })
    .option('runAs', {
      describe: 'User ID to run as, delegation permitting',
      type: 'string',
      requiresArg: true,
      hidden: true,
    });

  reflectCLI.help().alias('h', 'help');

  reflectCLI.command(['*'], false, {}, args => {
    if (args._.length > 0) {
      throw new CommandLineArgsError(`Unknown command: ${args._}.`);
    } else if (args.v) {
      console.log(version);
    } else {
      reflectCLI.showHelp((_msg: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const commands = (reflectCLI as any).getInternalMethods().getUsageInstance().getCommands();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = (reflectCLI as any).getOptions();
        console.log(options);
        outputCommands(commands, commands);
        
      });
    }
  });

  // version
  reflectCLI.command('version', false, {}, () => {
    console.log(version);
  });

  reflectCLI.middleware(() => {
    const nodeVersion = new SemVer(process.versions.node);
    if (nodeVersion.major < 18) {
      console.log(
        `\nNode.js v18 or higher is required. (Current: v${nodeVersion})`,
      );
      console.log('Please update to newer version.\n');
      process.exit(-1);
    }
  });

  reflectCLI.middleware(async argv => {
    await tryDeprecationCheck(argv);
  });

  reflectCLI.middleware(argv => initFirebase(argv));

  reflectCLI.exitProcess(false);

  return reflectCLI;
}

import {execSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import color from 'picocolors';
import validateProjectName from 'validate-npm-package-name';
import type {CreatedHandlerArgs} from './create-options.js';
import {logErrorAndExit} from './log-error-and-exit.js';
import {scaffold} from './scaffold.js';

export async function createHandler(createYargs: CreatedHandlerArgs) {
  const {name} = createYargs;

  const invalidPackageNameReason = isValidPackageName(name);
  if (invalidPackageNameReason) {
    logErrorAndExit(
      `Invalid project name: ${color.bgWhite(
        name,
      )} - (${invalidPackageNameReason})`,
    );
  }

  // Check if directory exists
  if (existsSync(name)) {
    logErrorAndExit(`Directory '${name}' already exists. Exiting.`);
  }

  await mkdir(name, {recursive: true});
  await scaffold(name, name);
  console.log(color.cyan(`Installing @rocicorp/reflect`));
  execSync(`npm install --silent`, {
    cwd: name,
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  console.log(color.green(`\nYou're all set! 🎉`));
  console.log(color.blue(`\nRun Reflect dev server and UI:`));
  console.log(color.reset(`\ncd ${name} && npm run watch\n`));
}

function isValidPackageName(projectName: string): string | void {
  const nameValidation = validateProjectName(projectName);
  if (!nameValidation.validForNewPackages) {
    return [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || []),
    ].join('\n');
  }
}

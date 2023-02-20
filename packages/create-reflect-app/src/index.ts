import {text, intro, outro, cancel, spinner, isCancel} from '@clack/prompts';
import color from 'picocolors';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const templateDir = path.resolve(
  fileURLToPath(import.meta.url),
  '../..',
  `template`,
);

async function main() {
  console.clear();
  intro(`${color.bgCyan(color.black('Reflect: create-reflect-app'))}`);

  const targetDir = await text({
    message: 'Where should we create your project?',
    placeholder: './my-reflect-app',
    validate: isValidPackageName,
  });

  if (isCancel(targetDir)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const copySpinner = spinner();
  copySpinner.start('Copying files');
  copyDir(templateDir, targetDir);
  copySpinner.stop('Copied files');

  outro(`${color.underline(color.cyan('https://reflect.net/contact'))}`);
}

function isValidPackageName(projectName: string): string | void {
  if (
    !/^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
      projectName,
    )
  ) {
    return 'Invalid project name.';
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, {recursive: true});
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

main().catch(console.error);

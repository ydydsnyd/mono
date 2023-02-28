import {text, intro, outro, cancel, spinner, isCancel} from '@clack/prompts';
import color from 'picocolors';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import validateProjectName from 'validate-npm-package-name';

const templateDir = path.resolve(
  fileURLToPath(import.meta.url),
  '../..',
  `template`,
);

async function main() {
  console.clear();
  intro(`${color.bgCyan(color.black('Reflect: create-reflect'))}`);

  const targetDir = await text({
    message: 'What should we name your app?',
    placeholder: 'my-reflect-app',
    validate: isValidPackageName,
  });

  if (isCancel(targetDir)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const copySpinner = spinner();
  copySpinner.start('Copying files');
  copyDir(templateDir, targetDir);
  updateProjectName(targetDir);
  copySpinner.stop('Copied files');

  outro(`${color.underline(color.cyan('https://reflect.net/contact'))}`);
}

function updateProjectName(targetDir: string) {
  const packageJsonPath = path.resolve(targetDir, 'package.json');
  const wranglerTomlPath = path.resolve(targetDir, 'wrangler.toml');

  editFile(packageJsonPath, content => {
    return content.replace(
      /"name": "reflect-template-example"/,
      `"name": "${targetDir}"`,
    );
  });
  editFile(wranglerTomlPath, content => {
    return content.replace(
      /name = "reflect-template-example"/,
      `name = "${targetDir}"`,
    );
  });
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

function editFile(file: string, callback: (content: string) => string) {
  const content = fs.readFileSync(file, 'utf-8');
  fs.writeFileSync(file, callback(content), 'utf-8');
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

main().catch(console.error);

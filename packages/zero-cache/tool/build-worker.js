// @ts-check

import {readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';

// The file binary-reader.js tries to use TextDecoder from the node:util package.
// This is not polyfilled by Cloudflare Workers, so it throws an error.
//
// Uncaught TypeError: util_1.TextDecoder is not a constructor
//   at null.<anonymous>
// (file:///Users/arv/src/rocicorp/mono/node_modules/pg-logical-replication/dist/output-plugins/pgoutput/binary-reader.js:6:21)
// in ../../node_modules/pg-logical-replication/dist/output-plugins/pgoutput/binary-reader.js
//
// We therefor hack this!

const require = createRequire(import.meta.url);

function getPathToFile() {
  return require.resolve(
    'pg-logical-replication/dist/output-plugins/pgoutput/binary-reader.js',
  );
}

const oldCode = `const util_1 = require("util");
// should not use { fatal: true } because ErrorResponse can use invalid utf8 chars
const textDecoder = new util_1.TextDecoder();`;

const newCode = `// const util_1 = require("util");
// should not use { fatal: true } because ErrorResponse can use invalid utf8 chars
const textDecoder = new TextDecoder();`;

const path = getPathToFile();
const code = await readFile(path, 'utf-8');

console.log('Patching ' + path);
if (code.includes(newCode)) {
  console.log('Already patched');
  process.exit(0);
}

if (!code.includes(oldCode)) {
  console.error('Could not find old code');
  process.exit(1);
}

const replacedCode = code.replace(oldCode, newCode);
await writeFile(path, replacedCode);
console.error('Patched');

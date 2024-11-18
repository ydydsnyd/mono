import path from 'node:path';
import type {AuthorizationConfig} from '../../../zero-schema/src/compiled-authorization.js';
import {fileURLToPath} from 'node:url';
import {tsImport} from 'tsx/esm/api';
import {writeFileSync} from 'node:fs';
import {gunzip} from 'node:zlib';
import {promisify} from 'node:util';

const gunzipAsync = promisify(gunzip);

let loadedConfig: Promise<AuthorizationConfig> | undefined;
let tempFilePath: string | undefined;

export async function decodeConfig(encodedConfig: string): Promise<string> {
  const compressed = Buffer.from(encodedConfig, 'base64');
  const decompressed = await gunzipAsync(compressed);
  return decompressed.toString('utf-8');
}

export async function getAuthorizationConfig(): Promise<AuthorizationConfig> {
  if (loadedConfig) {
    return loadedConfig;
  }

  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const configFile = process.env['ZERO_CONFIG_PATH'] ?? './schema.ts';
  const configString = process.env['ZERO_CONFIG'] ?? '';

  if (configString) {
    const decodedConfig = await decodeConfig(configString);
    tempFilePath = path.join(dirname, 'schema-temp.ts');
    writeFileSync(tempFilePath, decodedConfig);
  }
  const absoluteConfigPath = path.resolve(
    configString ? tempFilePath! : configFile
  );
  const relativePath = path.join(
    path.relative(dirname, path.dirname(absoluteConfigPath)),
    path.basename(absoluteConfigPath)
  );

  loadedConfig = tsImport(absoluteConfigPath, import.meta.url)
    .then(async module => (await module.authorization) as AuthorizationConfig)
    .catch(e => {
      console.error(
        `Failed to load zero schema from ${relativePath}: ${e}`,
      );
      throw e;
    });
  return loadedConfig;
}

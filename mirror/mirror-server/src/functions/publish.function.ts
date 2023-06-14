import {publishRequestSchema, publishResponseSchema} from 'mirror-protocol';
import type {CfModule} from '../cloudflare/create-worker-upload-form.js';
import {publish as publishToCloudflare} from '../cloudflare/publish.js';
import {withSchema} from './validators/schema.js';

/**
 * Publish function.
 * NOTE: This function will probably not use a multi/part form in the future and just handle a standard JSON payload.
 */
export const publish = withSchema(
  publishRequestSchema,
  publishResponseSchema,
  async publishRequest => {
    console.log('publishRequest', publishRequest);

    const appName = publishRequest.name;

    const config = {
      accountID: 'ACCOUNT_ID',
      scriptName: 'SCRIPT_NAME',
      apiToken: 'API_TOKEN',
    } as const;
    const sourceModule: CfModule = {
      ...publishRequest.source,
      type: 'esm',
    };
    const sourcemapModule: CfModule = {
      ...publishRequest.sourcemap,
      type: 'text',
    };

    console.log("Now calling Erik's code to publish!!");
    console.log({config, sourceModule, sourcemapModule, appName});
    if (Math.random() < 0) {
      await publishToCloudflare(config, sourceModule, sourcemapModule, appName);
    }

    return {success: true};
  },
);

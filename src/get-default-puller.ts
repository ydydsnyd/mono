import {
  isClientStateNotFoundResponse,
  isVersionNotSupportedResponse,
} from './error-responses.js';
import {
  isPullRequestDD31,
  PullRequestDD31,
  PullRequestSDD,
} from './sync/pull.js';
import type {
  Puller,
  PullerResultDD31,
  PullerResultSDD,
  PullResponseDD31,
  PullResponseOKDD31,
  PullResponseOKSDD,
  PullResponseSDD,
} from './puller.js';
import {assertNumber, assertObject, assertString} from './asserts.js';
import {assertPatchOperations} from './patch-operation.js';
import {assertJSONValue} from './json.js';

/**
 * This creates a default puller which uses HTTP POST to send the pull request.
 */

export function getDefaultPuller(rep: {pullURL: string; auth: string}): Puller {
  async function puller(
    requestBody: PullRequestDD31,
    requestID: string,
  ): Promise<PullerResultDD31>;
  async function puller(
    requestBody: PullRequestSDD,
    requestID: string,
  ): Promise<PullerResultSDD>;
  async function puller(
    requestBody: PullRequestDD31 | PullRequestSDD,
    requestID: string,
  ): Promise<PullerResultDD31 | PullerResultSDD>;
  async function puller(
    requestBody: PullRequestDD31 | PullRequestSDD,
    requestID: string,
  ): Promise<PullerResultDD31 | PullerResultSDD> {
    const init = {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Authorization': rep.auth,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-Replicache-RequestID': requestID,
      },
      body: JSON.stringify(requestBody),
      method: 'POST',
    };
    const request = new Request(rep.pullURL, init);
    const response = await fetch(request);
    const httpStatusCode = response.status;
    if (httpStatusCode !== 200) {
      return {
        httpRequestInfo: {
          httpStatusCode,
          errorMessage: await response.text(),
        },
      };
    }
    const result = await response.json();
    if (
      isClientStateNotFoundResponse(result) ||
      isVersionNotSupportedResponse(result)
    ) {
      return {
        response: result,
        httpRequestInfo: {httpStatusCode, errorMessage: ''},
      };
    }

    if (isPullRequestDD31(requestBody)) {
      assertPullResponseDD31(result);
    } else {
      assertPullResponseSDD(result);
    }
    return {
      response: result,
      httpRequestInfo: {httpStatusCode, errorMessage: ''},
    } as PullerResultDD31 | PullerResultSDD;
  }

  defaultPullers.add(puller);
  return puller;
}

export const defaultPullers = new WeakSet();

export function isDefaultPuller(puller: Puller): boolean {
  return defaultPullers.has(puller);
}

export function assertPullResponseSDD(
  v: unknown,
): asserts v is PullResponseSDD {
  if (typeof v !== 'object' || v === null) {
    throw new Error('PullResponse must be an object');
  }
  if (isClientStateNotFoundResponse(v) || isVersionNotSupportedResponse(v)) {
    return;
  }
  const v2 = v as Partial<PullResponseOKSDD>;
  if (v2.cookie !== undefined) {
    assertJSONValue(v2.cookie);
  }
  assertNumber(v2.lastMutationID);
  assertPatchOperations(v2.patch);
}

export function assertPullResponseDD31(
  v: unknown,
): asserts v is PullResponseDD31 {
  if (typeof v !== 'object' || v === null) {
    throw new Error('PullResponseDD31 must be an object');
  }
  if (isClientStateNotFoundResponse(v) || isVersionNotSupportedResponse(v)) {
    return;
  }
  const v2 = v as Partial<PullResponseOKDD31>;
  if (v2.cookie !== undefined) {
    assertJSONValue(v2.cookie);
  }
  assertLastMutationIDChanges(v2.lastMutationIDChanges);
  assertPatchOperations(v2.patch);
}

function assertLastMutationIDChanges(
  lastMutationIDChanges: unknown,
): asserts lastMutationIDChanges is Record<string, number> {
  assertObject(lastMutationIDChanges);
  for (const [key, value] of Object.entries(lastMutationIDChanges)) {
    assertString(key);
    assertNumber(value);
  }
}

import type {LogContext} from '@rocicorp/logger';
import {
  assert,
  assertArray,
  assertNumber,
  assertObject,
  assertString,
} from 'shared/src/asserts.js';
import type * as dag from '../dag/mod.js';
import {commitIsLocalDD31, commitIsLocalSDD} from '../db/commit.js';
import * as db from '../db/mod.js';
import {
  FrozenJSONValue,
  ReadonlyJSONObject,
  ReadonlyJSONValue,
  assertJSONValue,
} from '../json.js';
import {
  PushError,
  Pusher,
  PusherResult,
  assertPusherResult,
} from '../pusher.js';
import {toError} from '../to-error.js';
import {withRead} from '../with-transactions.js';
import type {ClientGroupID, ClientID} from './ids.js';

export const PUSH_VERSION_SDD = 0;
export const PUSH_VERSION_DD31 = 1;
export const PUSH_VERSION_V2 = 2;

/**
 * The JSON value used as the body when doing a POST to the [push
 * endpoint](/reference/server-push). This is the legacy version (V0) and it is
 * still used when recovering mutations from old clients.
 */
export type PushRequestV0 = {
  pushVersion: 0;
  /**
   * `schemaVersion` can optionally be used to specify to the push endpoint
   * version information about the mutators the app is using (e.g., format of
   * mutator args).
   */
  schemaVersion: string;
  profileID: string;

  clientID: ClientID;
  mutations: MutationV0[];
};

/**
 * The JSON value used as the body when doing a POST to the [push
 * endpoint](/reference/server-push).
 */
export type PushRequestV1 = {
  pushVersion: 1;
  /**
   * `schemaVersion` can optionally be used to specify to the push endpoint
   * version information about the mutators the app is using (e.g., format of
   * mutator args).
   */
  schemaVersion: string;
  profileID: string;

  clientGroupID: ClientGroupID;
  mutations: MutationV1[];
};

/**
 * The JSON value used as the body when doing a POST to the [push
 * endpoint](/reference/server-push).
 */
export type PushRequestV2 = {
  pushVersion: 2;
  /**
   * `schemaVersion` can optionally be used to specify to the push endpoint
   * version information about the mutators the app is using (e.g., format of
   * mutator args).
   */
  schemaVersion: string;
  profileID: string;

  clientGroupID: ClientGroupID;
  mutations: MutationV2[];
};

export type PushRequest = PushRequestV0 | PushRequestV1 | PushRequestV2;

function assertPushRequestBase(v: unknown): asserts v is ReadonlyJSONObject {
  assertObject(v);
  assertString(v.schemaVersion);
  assertString(v.profileID);
}

export function assertPushRequestV1(v: unknown): asserts v is PushRequestV1 {
  assertPushRequestBase(v);
  assertString(v.clientGroupID);
  assertArray(v.mutations);
  v.mutations.forEach(assertMutationsV1);
}

export function assertPushRequestV2(v: unknown): asserts v is PushRequestV2 {
  assertPushRequestBase(v);
  assertString(v.clientGroupID);
  assertArray(v.mutations);
  v.mutations.forEach(assertMutationsV2);
}

/**
 * Mutation describes a single mutation done on the client. This is the legacy
 * version (V0) and it is used when recovering mutations from old clients.
 */
export type MutationV0 = {
  readonly id: number;
  readonly name: string;
  readonly args: ReadonlyJSONValue;
  readonly timestamp: number;
};

/**
 * Mutation describes a single mutation done on the client.
 */
export type MutationV1 = {
  readonly id: number;
  readonly name: string;
  readonly args: ReadonlyJSONValue;
  readonly timestamp: number;
  readonly clientID: ClientID;
};

/**
 * Mutation describes a single mutation done on the client.
 */
export type MutationV2 = {
  readonly id: number;
  readonly name: string;
  readonly args: readonly ReadonlyJSONValue[];
  readonly timestamp: number;
  readonly clientID: ClientID;
};

function assertMutationsV0(v: unknown): asserts v is MutationV0 {
  assertObject(v);
  assertNumber(v.id);
  assertString(v.name);
  assertJSONValue(v.args);
  assertNumber(v.timestamp);
}

function assertMutationsV1(v: unknown): asserts v is MutationV1 {
  assertMutationsV0(v);
  assertString((v as Partial<MutationV1>).clientID);
}

function assertMutationsV2(v: unknown): asserts v is MutationV2 {
  assertObject(v);
  assertNumber(v.id);
  assertString(v.name);
  assertArray(v.args);
  v.args.forEach(assertJSONValue);
  assertNumber(v.timestamp);
  assertString(v.clientID);
}

type FrozenMutationV0 = Omit<MutationV0, 'args'> & {
  readonly args: FrozenJSONValue;
};

/**
 * Mutation describes a single mutation done on the client.
 */
type FrozenMutationV1 = FrozenMutationV0 & {
  readonly clientID: ClientID;
};

type FrozenMutationV2 = Omit<FrozenMutationV1, 'args'> & {
  readonly args: readonly FrozenJSONValue[];
};

function convertSDD(lm: db.LocalMetaSDD): FrozenMutationV0 {
  return {
    id: lm.mutationID,
    name: lm.mutatorName,
    args: lm.mutatorArgsJSON,
    timestamp: lm.timestamp,
  };
}

function convertDD31(lm: db.LocalMetaDD31): FrozenMutationV1 {
  return {
    id: lm.mutationID,
    name: lm.mutatorName,
    args: lm.mutatorArgsJSON,
    timestamp: lm.timestamp,
    clientID: lm.clientID,
  };
}

function convertVarArgs(lm: db.LocalMetaDD31): FrozenMutationV2 {
  return convertDD31(lm) as FrozenMutationV2;
}

export async function push(
  requestID: string,
  store: dag.Store,
  lc: LogContext,
  profileID: string,
  clientGroupID: ClientGroupID | undefined,
  clientID: ClientID,
  pusher: Pusher,
  schemaVersion: string,
  pushVersion:
    | typeof PUSH_VERSION_SDD
    | typeof PUSH_VERSION_DD31
    | typeof PUSH_VERSION_V2,
): Promise<PusherResult | undefined> {
  // Find pending commits between the base snapshot and the main head and push
  // them to the data layer.
  const pending = await withRead(store, async dagRead => {
    const mainHeadHash = await dagRead.getHead(db.DEFAULT_HEAD_NAME);
    if (!mainHeadHash) {
      throw new Error('Internal no main head');
    }
    return db.localMutations(mainHeadHash, dagRead);
    // Important! Don't hold the lock through an HTTP request!
  });

  if (pending.length === 0) {
    return undefined;
  }

  // Commit.pending gave us commits in head-first order; the bindings
  // want tail first (in mutation id order).
  pending.reverse();

  const pushReq = makePushRequest(
    pushVersion,
    pending,
    clientGroupID,
    profileID,
    schemaVersion,
    clientID,
  );
  lc.debug?.('Starting push...');
  const pushStart = Date.now();
  const pusherResult = await callPusher(pusher, pushReq, requestID);
  lc.debug?.('...Push complete in ', Date.now() - pushStart, 'ms');
  return pusherResult;
}

function makePushRequest(
  pushVersion: number,
  pending: db.Commit<db.LocalMetaSDD | db.LocalMetaDD31>[],
  clientGroupID: string | undefined,
  profileID: string,
  schemaVersion: string,
  clientID: string,
): PushRequest {
  if (pushVersion === PUSH_VERSION_V2) {
    const pushMutations: FrozenMutationV2[] = [];
    for (const commit of pending) {
      if (commitIsLocalDD31(commit)) {
        pushMutations.push(convertVarArgs(commit.meta));
      } else {
        throw new Error('Internal non local pending commit');
      }
    }
    assert(clientGroupID);
    return {
      profileID,
      clientGroupID,
      mutations: pushMutations,
      pushVersion: PUSH_VERSION_V2,
      schemaVersion,
    };
  }

  if (pushVersion === PUSH_VERSION_DD31) {
    const pushMutations: FrozenMutationV1[] = [];
    for (const commit of pending) {
      if (commitIsLocalDD31(commit)) {
        pushMutations.push(convertDD31(commit.meta));
      } else {
        throw new Error('Internal non local pending commit');
      }
    }
    assert(clientGroupID);
    return {
      profileID,
      clientGroupID,
      mutations: pushMutations,
      pushVersion: PUSH_VERSION_DD31,
      schemaVersion,
    };
  }

  assert(pushVersion === PUSH_VERSION_SDD);
  const pushMutations: FrozenMutationV0[] = [];
  for (const commit of pending) {
    if (commitIsLocalSDD(commit)) {
      pushMutations.push(convertSDD(commit.meta));
    } else {
      throw new Error('Internal non local pending commit');
    }
  }
  return {
    profileID,
    clientID,
    mutations: pushMutations,
    pushVersion: PUSH_VERSION_SDD,
    schemaVersion,
  };
}

async function callPusher(
  pusher: Pusher,
  body: PushRequest,
  requestID: string,
): Promise<PusherResult> {
  try {
    const pusherResult = await pusher(body, requestID);
    assertPusherResult(pusherResult);
    return pusherResult;
  } catch (e) {
    throw new PushError(toError(e));
  }
}

import type {WriteTransaction} from '@rocicorp/reflect';
import {Actor, Cursor, Env, Letter, Position, Splatter, Vector} from './types';
import {randomWithSeed} from './util';
import {chunk} from './chunks';
import type {OrchestratorActor} from '../shared/types';
import {LETTERS} from './letters';

export const UNINITIALIZED_CACHE_SENTINEL = 'uninitialized-cache-sentinel';
export const UNINITIALIZED_CLEARED_SENTINEL = 'uninitialized-clear-sentinel';

export const splatterId = (s: Splatter) =>
  `${s.u}${s.t}${s.x.toFixed(1) + s.y.toFixed(1)}}`;

export type M = typeof mutators;

let env = Env.CLIENT;
export const setEnv = (e: Env) => {
  env = e;
};

// Seeds are used for creating pseudo-random values that are stable across
// server and client. (see: randomWithSeed)
const Seeds = {
  splatterAnimation: 2398,
  splatterRotation: 9847,
};

export const mutators = {
  initialize: async (tx: WriteTransaction) => {
    // We'd like to prevent drawing our local client until we load the server cache
    // - so when a client initializes, write a sentinel value into all the caches,
    // then replace it with empty data or the real cache on the server. This allows
    // us to prevent interactivity until all the caches are non-sentinel.
    if (env === Env.CLIENT) {
      for await (const letter of LETTERS) {
        await chunk(tx, `cache/${letter}`, UNINITIALIZED_CACHE_SENTINEL);
      }
      await tx.put('cleared', UNINITIALIZED_CLEARED_SENTINEL);
    }
    // Doing nothing on the server is equivalent to throwing out the sentinel value.
  },
  updateCursor: async (tx: WriteTransaction, cursor: Cursor) => {
    if (await tx.has(`actor/${cursor.actorId}`)) {
      await tx.put(`cursor/${cursor.actorId}`, cursor);
    }
  },
  removeActor: async (tx: WriteTransaction, clientID: string) => {
    const actorId = await tx.get(`client-actor/${clientID}`);
    if (actorId) {
      await tx.del(`actor/${actorId}`);
      await tx.del(`cursor/${actorId}`);
      await tx.del(`client-actor/${clientID}`);
    }
  },
  guaranteeActor: async (tx: WriteTransaction, actor: OrchestratorActor) => {
    const key = `actor/${actor.id}`;
    const hasActor = await tx.has(key);
    if (hasActor) {
      // already exists
      return;
    }
    // Make sure there's only one actor per client
    const existingActor = await tx.get(`client-actor/${tx.clientID}`);
    if (existingActor) {
      await tx.del(`actor/${existingActor}`);
      await tx.del(`cursor/${existingActor}`);
    }
    await tx.put(`client-actor/${tx.clientID}`, actor.id);
    await tx.put(key, actor);
  },
  updateActorLocation: async (
    tx: WriteTransaction,
    {actorId, location}: {actorId: string; location: string},
  ) => {
    const key = `actor/${actorId}`;
    const actor = (await tx.get(key)) as Actor;
    if (actor) {
      await tx.put(key, {
        ...actor,
        location,
      });
    }
  },
  clearTextures: async (tx: WriteTransaction, time: number) => {
    const cacheKeys = await tx.scan({prefix: `cache/`}).keys();
    for await (const k of cacheKeys) {
      await tx.del(k);
    }
    const splatters = (await tx
      .scan({prefix: 'splatter/'})
      .keys()
      .toArray()) as string[];
    for await (const k of splatters) {
      await tx.del(k);
    }
    // To provide a synced animation and to deal with the case where some clients
    // may only have local cached splatters which we can't clean up individually
    // (because they are already rendered), we also add a "cleared" timestamp which
    // will let us run an animation on all the clients when they receive it.
    await tx.put('cleared', time);
  },
  addSplatter: async (
    tx: WriteTransaction,
    {
      letter,
      actorId,
      colorIndex,
      texturePosition,
      timestamp,
      large,
    }: {
      letter: Letter;
      actorId: string;
      colorIndex: number;
      texturePosition: Position;
      timestamp: number;
      large: boolean;
      hitPosition: Vector;
    },
  ) => {
    const {x, y} = texturePosition;
    const splatter: Splatter = {
      x,
      y,
      u: actorId,
      c: colorIndex,
      s: large ? 1 : 0,
      t: timestamp,
      a: Math.floor(randomWithSeed(timestamp, Seeds.splatterAnimation, 5)),
      r: Math.floor(randomWithSeed(timestamp, Seeds.splatterRotation, 4)),
    };
    // Because data is returned in key order rather than insert order, we need to
    // increment a global counter.
    // Because of string ordering, we also need to limit this to 0xFFFF, since there
    // are no characters beyond that. This also means that our keys will be out of
    // order if we store more than 65535 splatters per letter, but that should be
    // very unlikely due to flattening and other performance implications.
    const splatterNum =
      ((((await tx.get(`splatter-num/${letter}`)) as number | undefined) || 0) %
        0xffff) +
      1;
    await tx.put(
      `splatter/${letter}/${String.fromCharCode(splatterNum)}/${actorId}`,
      splatter,
    );
    await tx.put(`splatter-num/${letter}`, splatterNum);
  },
  updateCache: async (
    tx: WriteTransaction,
    {
      letter,
      newCache,
      flattenedKeys,
    }: {letter: Letter; newCache: string; flattenedKeys: string[]},
  ) => {
    await chunk(tx, `cache/${letter}`, newCache);
    for await (const key of flattenedKeys) {
      await tx.del(key);
    }
  },

  nop: async (_: WriteTransaction) => {},
};

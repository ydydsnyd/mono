import type {WriteTransaction} from '@rocicorp/reflect';
import {SPLATTER_FLATTEN_FREQUENCY, SPLATTER_MAX_AGE} from './constants';
import {getCache, updateCache} from './renderer';
import {Actor, Cursor, Env, Letter, Position, Splatter, Vector} from './types';
import {randomWithSeed} from './util';
import {chunk, unchunk} from './chunks';
import type {OrchestratorActor} from '../shared/types';
import {LETTERS} from './letters';

export const UNINITIALIZED_CACHE_SENTINEL = 'uninitialized-cache-sentinel';
export const UNINITIALIZED_CLEARED_SENTINEL = 'uninitialized-clear-sentinel';

export const splatterId = (s: Splatter) =>
  `${s.u}${s.t}${s.x.toFixed(1) + s.y.toFixed(1)}}`;

export type M = typeof mutators;

let env = Env.CLIENT;
let _initRenderer: (() => Promise<void>) | undefined;
export const setEnv = (e: Env, initRenderer: () => Promise<void>) => {
  env = e;
  _initRenderer = initRenderer;
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
    await Promise.all(splatters.map(async k => await tx.del(k)));
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
    }: {
      letter: Letter;
      actorId: string;
      colorIndex: number;
      texturePosition: Position;
      timestamp: number;
      hitPosition: Vector;
    },
  ) => {
    const {x, y} = texturePosition;
    const splatter: Splatter = {
      x,
      y,
      u: actorId,
      c: colorIndex,
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
      ((((await tx.get(`splatter-num`)) as number | undefined) || 0) % 0xffff) +
      1;
    await tx.put(
      `splatter/${letter}/${String.fromCharCode(splatterNum)}/${actorId}`,
      splatter,
    );
    await tx.put(`splatter-num`, splatterNum);

    // On the server, do some "flattening":
    // This takes any splatters that are no longer animating and draws them directly
    // to a png. We can then use this png as the initial state for new clients,
    // which means they won't need to draw as many splatters, and the storage space
    // for infinite splatters will be limited to the number of pixels in the png as
    // opposed to infinitely growing.
    if (env == Env.SERVER) {
      try {
        // Perform operations
        await flattenTexture(tx, letter, timestamp);
      } catch (e) {
        console.error((e as Error).stack);
        console.log(`Flattening failed with error ${(e as Error).message}`);
      }
    }
  },

  nop: async (_: WriteTransaction) => {},
};

const flattenTexture = async (
  tx: WriteTransaction,
  letter: Letter,
  timestamp: number,
) => {
  // To prevent infinite growth of the list of splatters, we need to periodically
  // "flatten" our textures to a pixel map. This is a fast operation, but
  // transferring the new pixel map data to clients can be slow - so we limit
  // its frequency.
  const lastFlatten = (await tx.get(`last-flatten/${letter}`)) as
    | number
    | undefined;
  const now = new Date().getTime();
  if (lastFlatten && lastFlatten >= now - SPLATTER_FLATTEN_FREQUENCY) {
    return;
  }
  await tx.put(`last-flatten/${letter}`, now);

  await _initRenderer!();

  // Get all the splatters for this letter
  const splatters = (await (await tx.scan({prefix: `splatter/${letter}`}))
    .entries()
    .toArray()) as [string, Splatter][];
  // And find any splatters which are "old"
  const oldSplatters: [string, Splatter][] = splatters.filter(
    s => timestamp - s[1].t >= SPLATTER_MAX_AGE,
  );
  // Now if we have any cacheable splatters, draw them and move our last cached key
  if (oldSplatters.length > 0) {
    console.log(`${letter}: flatten ${oldSplatters.length} splatters`);
    // Draw them on top of the last cached image
    const cache = await unchunk(tx, `cache/${letter}`);
    if (cache) {
      updateCache(letter, cache);
    }
    const newCache = getCache(
      letter,
      oldSplatters.map(s => s[1]),
    );
    // And write it back to the cache
    await chunk(tx, `cache/${letter}`, newCache);
    // Then delete any old splatters we just drew
    for await (const s of oldSplatters) {
      await tx.del(s[0]);
    }
  }
};

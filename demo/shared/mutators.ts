import type {WriteTransaction} from '@rocicorp/reflect';
import {SPLATTER_MAX_AGE} from './constants';
import {getCache, updateCache} from './renderer';
import {
  Actor,
  ActorID,
  ClientStatus,
  Cursor,
  Env,
  Letter,
  Position,
  Splatter,
  Vector,
} from './types';
import {randomWithSeed} from './util';
import {chunk, unchunk} from './chunks';
import type {OrchestratorActor} from '../shared/types';

export const splatterId = (s: Splatter) =>
  `${s.u}${s.t}${s.x.toFixed(1) + s.y.toFixed(1)}}`;

const splatterKey = (
  letter: Letter,
  step: number,
  actorId: ActorID,
  x: number,
  y: number,
) =>
  // This mod is here just to keep us from having massive keys due to large
  // numbers. Collision is unlikely anyway.
  `splatter/${letter}/${
    x.toFixed(1) + y.toFixed(1) + (step % 1000)
  }/${actorId}`;

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
    // To make sure that we've done at least one server round trip, set this value
    // on each client when it initializes an empty local state. When the server
    // flips it to SERVER_CONFIRMED, we know that our local state has been synced
    // with an initial state from the server (or will be very soon).
    tx.put(
      `client-status/${tx.clientID}`,
      env === Env.SERVER
        ? ClientStatus.SERVER_CONFIRMED
        : ClientStatus.INITIALIZING,
    );
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
    // (because they are already rendered), we also add a "cleared" timnestamp which
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
    await tx.put(splatterKey(letter, timestamp, actorId, x, y), splatter);

    // On the server, do some "flattening":
    // This takes any splatters that are no longer animating and draws them directly
    // to a png. We can then use this png as the initial state for new clients,
    // which means they won't need to draw as many splatters, and the storage space
    // for infinite splatters will be limited to the number of pixels in the png as
    // opposed to infinitely growing.
    if (env == Env.SERVER) {
      // Our flattening operations both use our wasm renderer, so make sure it's available.
      try {
        await _initRenderer!();
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
  // transferring the new pixel map data to clients can be slow - so we only
  // perform it when we've hit a certain threshold, and we use a sequence number
  // to make sure that we don't perform the operation on old data.

  // Get all the splatters for this letter
  const points = (await (
    await tx.scan({prefix: `splatter/${letter}`})
  ).toArray()) as Splatter[];
  // And find any splatters which are "old"
  const oldSplatters: Splatter[] = points.filter(
    p => timestamp - p.t >= SPLATTER_MAX_AGE,
  );
  // Now if we have any cacheable splatters, draw them and move our last cached key
  if (oldSplatters.length > 0) {
    console.log(`${letter}: flatten ${oldSplatters.length} splatters`);
    // Draw them on top of the last cached image
    const cache = await unchunk(tx, `cache/${letter}`);
    if (cache) {
      updateCache(letter, cache);
    }
    const newCache = getCache(letter, oldSplatters);
    // And write it back to the cache
    await chunk(tx, `cache/${letter}`, newCache);
    // Then delete any old splatters we just drew
    await Promise.all(
      oldSplatters.map(
        async s => await tx.del(splatterKey(letter, s.t, s.u, s.x, s.y)),
      ),
    );
  }
};

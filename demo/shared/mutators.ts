import type {WriteTransaction} from '@rocicorp/reflect';
import {
  COLOR_PALATE,
  COLOR_PALATE_END,
  SPLATTER_MAX_AGE,
  SPLATTER_FLATTEN_MIN,
} from './constants';
import {getCache, updateCache} from './renderer';
import type {
  Actor,
  ActorID,
  Color,
  ColorPalate,
  Cursor,
  Impulse,
  Letter,
  Position,
  Splatter,
  Vector,
} from './types';
import {randomWithSeed} from './util';
import {chunk, unchunk} from './chunks';

export const impulseId = (i: Impulse) =>
  `${i.u}${i.s}${i.x.toFixed(1) + i.y.toFixed(1) + i.z.toFixed(1)}`;
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

export enum Env {
  CLIENT,
  SERVER,
}
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
  updateCursor: async (tx: WriteTransaction, cursor: Cursor) => {
    await tx.put(`cursor/${cursor.actorId}`, cursor);
  },
  removeActor: async (tx: WriteTransaction, actorId: ActorID) => {
    await tx.del(`actor/${actorId}`);
    await tx.del(`cursor/${actorId}`);
    await tx.del(`tool/${actorId}`);
  },
  setColors: async (tx: WriteTransaction, {colors}: {colors: ColorPalate}) => {
    for (const color in colors) {
      await tx.put(`colors/${color}/start`, colors[color][0].join('/'));
      await tx.put(`colors/${color}/end`, colors[color][1].join('/'));
    }
  },
  guaranteeActor: async (
    tx: WriteTransaction,
    {actorId, isBot}: {actorId: string; isBot?: boolean | undefined},
  ) => {
    const key = `actor/${actorId}`;
    const hasActor = await tx.has(key);
    if (hasActor) {
      // already exists
      return;
    }

    // Keep a counter of how many actors we've created rather than counting current ones.
    // If we count current ones, we can get duplicate colors if people join and leave around
    // same time.
    const actorNum = ((await tx.get('actor-count')) as number) ?? 0;
    await tx.put('actor-count', actorNum + 1);

    // NOTE: we just cycle through colors, so if we don't cap the room size we'll get duplicates.
    const colorIndex = actorNum % COLOR_PALATE.length;
    const actor: Actor = {
      id: actorId,
      colorIndex,
      location: 'Unknown Location',
      isBot: Boolean(isBot),
    };
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
      step: number;
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
    // Every time we add a splatter, also add an "impulse". This is what we use to
    // compute the physics of the letters.
    // const impulse: Impulse = {
    //   u: actorId,
    //   s: step,
    //   ...hitPosition,
    // };
    // await tx.put(`impulse/${letter}/${impulseId(impulse)}`, impulse);

    // On the server, do some "flattening".
    // 1. We periodically compute state as a function of many inputs. In the case of
    // splatters, this state is a texture image. In the case of impulses, this state
    // is a serialized physics state.
    // 2. We then delete any of the inputs we used for the computation, and store
    // the "step" that the state was computed at. A "step" is just a relative frame
    // count, and can be used to sync clients.
    // 3. The computed states are then synced to the client via reflect. When a
    // client receives a new origin, it can just start computing its local
    // physics/textures from that origin instead of the prior one (or from zero).
    // This means that the client only stores a "window" of data, which is
    // everything that happened since the server last sent an origin. This window
    // contains real time data as well, so for the most part will work regardless of
    // rollback. However, the rollback is necessary for 2 reasons - 1, to prevent
    // the number of impulses and splatters from growing infinitely, and 2, to
    // deterministically order events so that the result is identical on all
    // clients.
    // NOTE that during the client window, things could become desynced - e.g. a
    // splatter may appear on top when the server will put it behind another
    // splatter, or the physics could be differently positioned. As such, clients
    // may need to compensate for sudden changes in the origin. The larger the
    // window, the less expensive the server computation will be (because it is less
    // frequent), but the larger the potential desync will be.
    if (env == Env.SERVER) {
      // Our flattening operations both use our wasm renderer, so make sure it's available.
      try {
        await _initRenderer!();
        // Perform operations
        // await flattenPhysics(tx, step);
        await flattenTexture(tx, letter, timestamp);
      } catch (e) {
        console.error((e as Error).stack);
        console.log(`Flattening failed with error ${(e as Error).message}`);
      }
    }
  },

  nop: async (_: WriteTransaction) => {},
};

// const flattenPhysics = async (tx: WriteTransaction, step: number) => {
//   const state = (await unchunk(tx, 'physics/state')) as string;
//   const originStep = (await tx.get('physics/step')) as number;
//   const renderedSteps = originStep ? step - originStep : step;
//   if (renderedSteps > MIN_PHYSICS_FLATTENING_STEPS) {
//     const impulses = await asyncLetterMap<Impulse[]>(async letter => {
//       const impulses = await tx.scan({
//         prefix: `impulse/${letter}/`,
//       });
//       return (await impulses.toArray()) as Impulse[];
//     });

//     await _initRenderer!();
//     const newStep = Math.max(step - MAX_PHYSICS_FLATTENING_STEPS, 0);
//     console.log(`Flattening physics until step ${newStep}`);
//     const newState = update_physics_state(
//       state ? decode(state) : undefined,
//       originStep || 0,
//       newStep,
//       ...impulses2Physics(impulses),
//     );
//     await chunk(tx, 'physics/state', encode(newState));
//     await tx.put('physics/step', newStep);
//     // Remove impulses that are integrated into the above snapshot
//     await asyncLetterMap(async letter => {
//       await impulses[letter].map(async impulse => {
//         if (impulse.s >= step) {
//           await tx.del(`impulse/${letter}/${impulseId(impulse)}`);
//         }
//       });
//     });
//   }
// };

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

  // Get our current colors
  const colors: ColorPalate = [
    [COLOR_PALATE[0], COLOR_PALATE_END[0]],
    [COLOR_PALATE[1], COLOR_PALATE_END[1]],
    [COLOR_PALATE[2], COLOR_PALATE_END[2]],
    [COLOR_PALATE[3], COLOR_PALATE_END[3]],
    [COLOR_PALATE[4], COLOR_PALATE_END[4]],
  ];
  for (let idx in colors) {
    const start = (await tx.get(`colors/${letter}/start`)) as
      | string
      | undefined;
    const end = (await tx.get(`colors/${letter}/end`)) as string | undefined;
    if (start) {
      colors[idx][0] = start.split('/').map(c => parseInt(c, 10)) as Color;
    }
    if (end) {
      colors[idx][0] = end.split('/').map(c => parseInt(c, 10)) as Color;
    }
  }
  // Get all the splatters for this letter
  const points = (await (
    await tx.scan({prefix: `splatter/${letter}`})
  ).toArray()) as Splatter[];
  // And find any splatters which are "old"
  const oldSplatters: Splatter[] = points.filter(
    p => timestamp - p.t >= SPLATTER_MAX_AGE,
  );
  // Now if we have enough cacheable splatters, draw them and move our last cached key
  if (oldSplatters.length > SPLATTER_FLATTEN_MIN) {
    console.log(`${letter}: flatten ${oldSplatters.length} splatters`);
    // Draw them on top of the last cached image
    const cache = await unchunk(tx, `cache/${letter}`);
    if (cache) {
      updateCache(letter, cache);
    }
    const newCache = getCache(letter, oldSplatters, colors);
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

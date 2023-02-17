import type {WriteTransaction} from '@rocicorp/reflect';
import rapier3d from '@dimforge/rapier3d';
import {
  COLOR_PALATE,
  COLOR_PALATE_END,
  MAX_RENDERED_STEPS,
  SPLATTER_ANIM_DURATION,
  SPLATTER_FLATTEN_MIN,
} from './constants';
import {getCache, updateCache} from './renderer';
import {Rapier3D, getPhysics, impulseId, impulsesToSteps} from './physics';
import type {
  Actor,
  ActorID,
  Color,
  ColorPalate,
  Cursor,
  Impulse,
  Letter,
  LetterCache,
  Physics,
  Position,
  Splatter,
  Vector,
} from './types';
import {asyncLetterMap, randomWithSeed} from './util';
import {encode} from './uint82b64';

export type M = typeof mutators;

export enum Env {
  CLIENT,
  SERVER,
}
let env = Env.CLIENT;
let _initRenderer: (() => Promise<void>) | undefined;
let getPhysicsEngine = (): Promise<Rapier3D> => Promise.resolve(rapier3d);
export const setEnv = (
  e: Env,
  initRenderer: () => Promise<void>,
  physicsEngine?: () => Promise<Rapier3D>,
) => {
  env = e;
  _initRenderer = initRenderer;
  if (physicsEngine) {
    getPhysicsEngine = physicsEngine;
  }
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
    const actorNum = ((await tx.get('actorCount')) as number) ?? 0;
    await tx.put('actorCount', actorNum + 1);

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
      ts,
      sequence,
      step,
      hitPosition,
    }: {
      letter: Letter;
      actorId: string;
      colorIndex: number;
      texturePosition: Position;
      ts: number;
      sequence: number;
      step: number;
      hitPosition: Vector;
    },
  ) => {
    const key = `splatter/${letter}/${ts}/${actorId}`;
    const splatter: Splatter = {
      x: texturePosition.x,
      y: texturePosition.y,
      u: actorId,
      t: ts,
      c: colorIndex,
      // TODO: should be the number of available animations
      a: Math.floor(randomWithSeed(ts, Seeds.splatterAnimation, 0)),
      r: randomWithSeed(ts, Seeds.splatterRotation, Math.PI * 2),
    };
    await tx.put(key, splatter);

    // On the server, add impulses and flatten textures.
    // We don't add impulses on the client because the client mutations are
    // optimistic, and we will often be "in the future" according to other clients.
    if (env == Env.SERVER) {
      // To make sure that we don't add impulses that we can no longer render, we need an origin.
      const origin = (await tx.get('physics-origin')) as unknown as
        | Physics
        | undefined;

      // Make sure that the client isn't in too distant the past. If the step we drew
      // on was before the origin, we don't add an impulse, since the clients only
      // render since the origin step.
      if (!origin || step >= origin.step) {
        const impulse: Impulse = {
          u: actorId,
          s: step,
          ...hitPosition,
        };
        await tx.put(`impulse/${letter}/${impulseId(impulse)}`, impulse);
      }
      // Perform any flattening necessary (if we're not in the past)
      const currentSeq = await tx.get(`seq/${letter}`);
      if (currentSeq !== undefined && sequence !== currentSeq) {
        return;
      }
      // Update our sequence # to effectively take a lock on this operation.
      await tx.put(`seq/${letter}`, (currentSeq || 0) + 1);
      // Perform operations
      await flattenPhysics(tx, origin, step);
      // await flattenTexture(tx, letter, ts);
    }
  },

  nop: async (_: WriteTransaction) => {},
};

const flattenPhysics = async (
  tx: WriteTransaction,
  origin: Physics | undefined,
  step: number,
) => {
  // In addition, we have to keep our renderable set fairly reasonable. If we have
  // too many steps, flatten them and reset the origin.
  const renderedSteps = origin ? step - origin.step : step;
  if (renderedSteps > MAX_RENDERED_STEPS || !origin) {
    const impulses = await asyncLetterMap<Impulse[]>(async letter => {
      const impulses = await tx.scan({
        prefix: `impulse/${letter}/`,
      });
      return (await impulses.toArray()) as Impulse[];
    });

    const physicsEngine = await getPhysicsEngine();
    const [_, world, handles] = getPhysics(
      physicsEngine,
      origin,
      impulses,
      // Render a step in the past, otherwise local physics will jerk.
      Math.max(step - MAX_RENDERED_STEPS, 0),
    );
    console.log(
      step,
      'SNAPSHOTTING AT ',
      Math.max(step - MAX_RENDERED_STEPS, 0),
    );
    const newOrigin: Physics = {
      state: encode(world.takeSnapshot()),
      step,
      handles,
    };
    await tx.put('origin', newOrigin);
    // Remove impulses that are integrated into the above snapshot
    const impulseSteps = impulsesToSteps(impulses);
    const keys = Object.keys(impulseSteps);
    for (const k of keys) {
      if (Number(k) >= step) {
        break;
      }
      for (const i of impulseSteps[Number(k)]) {
        await tx.del(`impulse/${i.letter}/${impulseId(i)}`);
      }
    }
  }
};

const flattenTexture = async (
  tx: WriteTransaction,
  letter: Letter,
  ts: number,
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
  // And find any splatters whose animations are finished
  const oldSplatters: Splatter[] = points.filter(
    p => ts - p.t >= SPLATTER_ANIM_DURATION,
  );
  // Now if we have enough cacheable splatters, draw them and move our last cached key
  if (oldSplatters.length > SPLATTER_FLATTEN_MIN) {
    console.log(`${letter}: flatten ${oldSplatters.length} splatters`);
    await _initRenderer!();
    // Draw them on top of the last cached image
    const cache = (await tx.get(`cache/${letter}`)) as LetterCache;
    if (cache && cache.cache) {
      updateCache(letter, cache.cache);
    }
    const newCache = getCache(letter, oldSplatters, colors);
    // And write it back to the cache
    await tx.put(`cache/${letter}`, {letter, cache: newCache});
    // Then delete any old points we just drew
    await Promise.all(
      oldSplatters.map(
        async p => await tx.del(`splatter/${letter}/${p.t}/${p.u}`),
      ),
    );
  }
};

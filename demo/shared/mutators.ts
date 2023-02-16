import type {WriteTransaction} from '@rocicorp/reflect';
import rapier3d from '@dimforge/rapier3d';
import {guaranteeBotmaster} from '../frontend/botmaster';
import {
  COLOR_PALATE,
  COLOR_PALATE_END,
  MAX_RENDERED_STEPS,
  MAX_SCALE,
  MIN_SCALE,
  POINT_AGE_MAX,
  POINT_CLEANUP_MIN,
  SPLATTER_COUNT_MAX,
  SPLATTER_MAX_DISTANCE,
  SPLATTER_MAX_SIZE,
  SPLATTER_MIN_SIZE,
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
  LetterOwner,
  Physics,
  Point,
  Position,
  Rotation,
  Splatter,
  Vector,
} from './types';
import {Tool} from './types';
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
  sCount: 789721, // Splatter count seed
  sPos: 424378, // Splatter position seed
  sPosTh: 93487, // Splatter angle seed
  sSiz: 209107, // Splatter size seed
};

const splatterPosition = (rand: number): Position => {
  const r = SPLATTER_MAX_DISTANCE * Math.sqrt(randomWithSeed(rand, Seeds.sPos));
  const theta = randomWithSeed(rand, Seeds.sPosTh) * 2 * Math.PI;
  const xdiff = r * Math.cos(theta);
  const ydiff = r * Math.sin(theta);
  return {
    x: xdiff,
    y: ydiff,
  };
};

const splatter = (random: number): Splatter[] => {
  const count = Math.floor(
    randomWithSeed(random, Seeds.sCount, SPLATTER_COUNT_MAX),
  );
  const splatters: Splatter[] = [];
  for (let i = 0; i < count; i++) {
    const position = splatterPosition(random);
    splatters.push({
      ...position,
      s: randomWithSeed(
        random,
        Seeds.sSiz,
        SPLATTER_MAX_SIZE,
        SPLATTER_MIN_SIZE,
      ),
    });
  }
  return splatters;
};

export const mutators = {
  updateCursor: async (tx: WriteTransaction, cursor: Cursor) => {
    await tx.put(`cursor/${cursor.actorId}`, cursor);
  },
  switchToTool: async (
    tx: WriteTransaction,
    {actorId, tool}: {actorId: string; tool: Tool},
  ) => {
    await tx.put(`tool/${actorId}`, tool);
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
    await tx.put(`tool/${actor.id}`, Tool.PAINT);
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
  updateLetterScale: async (
    tx: WriteTransaction,
    {letter, scale}: {letter: Letter; scale: number},
  ) => {
    scale = Math.max(Math.min(scale, MAX_SCALE), MIN_SCALE);
    await tx.put(`scale/${letter}`, {letter, scale});
  },
  updateLetterRotation: async (
    tx: WriteTransaction,
    {letter, rotation}: {letter: Letter; rotation: Rotation},
  ) => {
    await tx.put(`rotation/${letter}`, {letter, rotation});
  },
  updateLetterPosition: async (
    tx: WriteTransaction,
    {letter, position}: {letter: Letter; position: Position},
  ) => {
    await tx.put(`position/${letter}`, {
      letter,
      position,
    });
  },
  takeOwner: async (
    tx: WriteTransaction,
    {letter, actorId}: {letter: Letter; actorId: ActorID},
  ) => {
    const owner = (await tx.get(`owner/${letter}`)) as LetterOwner;
    if (owner && owner.actorId !== actorId) {
      // Already owned, reject
      return;
    }
    await tx.put(`owner/${letter}`, {letter, actorId});
  },
  freeOwner: async (
    tx: WriteTransaction,
    {letter, actorId}: {letter: Letter; actorId: ActorID},
  ) => {
    const owner = (await tx.get(`owner/${letter}`)) as LetterOwner;
    if (!owner || owner.actorId !== actorId) {
      // Not owned by us or not already freed
      return;
    }
    await tx.del(`owner/${letter}`);
  },
  Owner: async (
    tx: WriteTransaction,
    {letter, actorId}: {letter: Letter; actorId: ActorID},
  ) => {
    const currentOwner = await tx.get(`owner/${letter}`);
    if (currentOwner && currentOwner !== actorId) {
      // Already owned, reject
      return;
    }
    await tx.put(`owner/${letter}`, actorId);
  },
  addPoint: async (
    tx: WriteTransaction,
    {
      letter,
      actorId,
      colorIndex,
      texturePosition,
      scale,
      ts,
      sequence,
      group,
      step,
      hitPosition,
    }: {
      letter: Letter;
      actorId: string;
      colorIndex: number;
      texturePosition: Position;
      scale: number;
      ts: number;
      sequence: number;
      group: number;
      step: number;
      hitPosition: Vector;
    },
  ) => {
    const key = `point/${letter}/${ts}/${actorId}`;
    const point: Point = {
      x: texturePosition.x,
      y: texturePosition.y,
      u: actorId,
      t: ts,
      c: colorIndex,
      s: scale,
      p: splatter(ts),
      g: group,
    };
    await tx.put(key, point);
    // On the server, periodically "flatten" our points to a pixel map. This is a
    // fast operation, but transferring the new pixel map data to clients can be
    // slow - so we only perform it when we've hit a certain threshold, and we use a
    // sequence number to make sure that we don't perform the operation on old data.
    if (env === Env.SERVER) {
      const currentSeq = await tx.get(`seq/${letter}`);
      if (currentSeq !== undefined && sequence !== currentSeq) {
        return;
      }

      // on the server, also add an impulse for this point. We don't add impulses on
      // the client because the client mutations are optimistic, and we will often be
      // "in the future" according to other clients.

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
        const end = (await tx.get(`colors/${letter}/end`)) as
          | string
          | undefined;
        if (start) {
          colors[idx][0] = start.split('/').map(c => parseInt(c, 10)) as Color;
        }
        if (end) {
          colors[idx][0] = end.split('/').map(c => parseInt(c, 10)) as Color;
        }
      }
      // Update our sequence # to effectively take a lock on this operation.
      await tx.put(`seq/${letter}`, (currentSeq || 0) + 1);
      // Get all the points for this letter
      const points = (await (
        await tx.scan({prefix: `point/${letter}`})
      ).toArray()) as Point[];
      // And find any points that are cacheable
      const oldPoints: Point[] = points.filter(p => ts - p.t >= POINT_AGE_MAX);
      // Now if we have enough cacheable points, draw them and move our last cached key
      if (oldPoints.length > POINT_CLEANUP_MIN) {
        console.log(`${letter}: clean up ${oldPoints.length} points`);
        await _initRenderer!();
        // Draw them on top of the last cached image
        const cache = (await tx.get(`cache/${letter}`)) as LetterCache;
        if (cache && cache.cache) {
          updateCache(letter, cache.cache);
        }
        const newCache = getCache(letter, oldPoints, colors);
        // And write it back to the cache
        await tx.put(`cache/${letter}`, {letter, cache: newCache});
        // Then delete any old points we just drew
        await Promise.all(
          oldPoints.map(
            async p => await tx.del(`point/${letter}/${p.t}/${p.u}`),
          ),
        );
      }
    }
  },

  guaranteeBotmaster: async (tx: WriteTransaction) => {
    if (env === Env.SERVER) {
      await guaranteeBotmaster(tx);
    }
  },

  nop: async (_: WriteTransaction) => {},
};

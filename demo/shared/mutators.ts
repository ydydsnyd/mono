import type {ReadTransaction, WriteTransaction} from '@rocicorp/reflect';
import {
  Actor,
  AnyActor,
  Cursor,
  Env,
  Letter,
  Position,
  Splatter,
  Vector,
} from './types';
import {nextNumber, randomWithSeed, sortableKeyNum} from './util';
import {chunk} from './chunks';
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

const clientConsoleMap = new Map<string, (log: string) => void>();

export function registerClientConsole(
  clientId: string,
  log: (log: string) => void,
) {
  clientConsoleMap.set(clientId, log);
}

export function deregisterClientConsole(clientId: string) {
  clientConsoleMap.delete(clientId);
}

const logsPrefix = 'refect-server-log';
export const entriesPrefix = `${logsPrefix}/entries/`;
export const entriesCountKey = `${logsPrefix}/count`;

function entriesKey(count: number): string {
  return `${entriesPrefix}${count.toString().padStart(10, '0')}`;
}

export async function getServerLogCount(tx: WriteTransaction): Promise<number> {
  return ((await tx.get(entriesCountKey)) as number) ?? 0;
}

export async function getServerLogs(tx: ReadTransaction): Promise<string[]> {
  return (await tx
    .scan({prefix: entriesPrefix})
    .values()
    .toArray()) as string[];
}

export async function addServerLog(tx: WriteTransaction, log: string) {
  if (tx.environment !== 'server') {
    return;
  }
  const count = await getServerLogCount(tx);
  await tx.put(entriesKey(count), log);
  await tx.put(entriesCountKey, count + 1);
}
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
  removeBot: async (tx: WriteTransaction, botId: string) => {
    await removeBot(tx, botId);
  },
  removeActor: async (tx: WriteTransaction, clientID: string) => {
    await removeActor(tx, clientID);
  },
  guaranteeActor: async (tx: WriteTransaction, actor: AnyActor) => {
    const key = `actor/${actor.id}`;
    const hasActor = await tx.has(key);
    if (hasActor) {
      // already exists
      return;
    }
    if (actor.isBot) {
      await tx.put(`bot-controller/${tx.clientID}/${actor.id}`, actor.id);
    } else {
      // Make sure there's only one actor per client
      await removeActor(tx, tx.clientID);
      await tx.put(`room-actor/${tx.clientID}`, actor.id);
    }
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
    const splatterNum = nextNumber(
      (await tx.get(`splatter-num/${letter}`)) as number,
    );
    // Convert to hex so that it will sort correctly
    await tx.put(
      `splatter/${letter}/${sortableKeyNum(splatterNum)}/${actorId}`,
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
  removeActorsExcept: async (tx: WriteTransaction, ids: string[]) => {
    const clients = (await tx
      .scan({prefix: 'room-actor/'})
      .values()
      .toArray()) as string[];
    const keepIds = new Set(ids);
    for (const clientID of clients) {
      if (!keepIds.has(clientID)) {
        await removeActor(tx, clientID);
      }
    }
  },
  // These mutators are for the how it works demos
  increment: async (
    tx: WriteTransaction,
    {key, delta}: {key: string; delta: number},
  ) => {
    const prev = ((await tx.get(key)) as number) ?? 0;
    const next = prev + delta;
    await tx.put(key, next);
    clientConsoleMap.get(tx.clientID)?.(
      `Running mutation ${tx.mutationID} from ${tx.clientID} on client: ${prev} → ${next}`,
    );
    await addServerLog(
      tx,
      `Running mutation ${tx.mutationID} from ` +
        `${tx.clientID} on ${tx.environment}: ` +
        `${prev} → ${next}`,
    );
  },

  addServerLog,
  getServerLogs,
  getServerLogCount,
  nop: async (_: WriteTransaction) => {},
};

const removeActor = async (tx: WriteTransaction, clientID: string) => {
  const actorId = await tx.get(`room-actor/${clientID}`);
  if (!actorId) {
    // Since we don't know which room onDisconnect is called in, we call
    // removeOchestratorActor and removeActor mutators. If we don't have a record of
    // this clientID, it's probably an orchestrator one.
    return;
  }
  serverLog(`Client ${clientID} (${actorId}) left room, cleaning up.`);
  const botIds = (await tx
    .scan({prefix: `bot-controller/${tx.clientID}`})
    .values()
    .toArray()) as string[];
  for await (const id of botIds) {
    await removeBot(tx, id);
  }
  if (actorId) {
    await tx.del(`actor/${actorId}`);
    await tx.del(`cursor/${actorId}`);
    await tx.del(`room-actor/${clientID}`);
  }
};

const removeBot = async (tx: WriteTransaction, botId: string) => {
  serverLog(`Delete room bot ${botId}.`);
  await tx.del(`actor/${botId}`);
  await tx.del(`cursor/${botId}`);
};

const serverLog = (...args: string[]) => {
  if (env === Env.SERVER) {
    console.log(...args);
  }
};

import {
  Reflect,
  ReadTransaction,
  ExperimentalDiffOperation,
} from '@rocicorp/reflect';
import {letterMap, now} from '../shared/util';
import type {
  Actor,
  Cursor,
  Debug,
  Letter,
  Splatter,
  State,
} from '../shared/types';
import {
  mutators,
  M,
  UNINITIALIZED_CACHE_SENTINEL,
  UNINITIALIZED_CLEARED_SENTINEL,
} from '../shared/mutators';
import {LETTERS} from '../shared/letters';
import {getData, isChangeDiff, isDeleteDiff} from './data-util';
import {updateCache} from '../shared/renderer';
import {WORKER_HOST} from '../shared/urls';
import {unchunk} from '../shared/chunks';
import type {OrchestratorActor} from '../shared/types';
import {
  SPLATTER_ANIM_FRAMES,
  SPLATTER_FLATTEN_FREQUENCY,
  SPLATTER_MAX_AGE,
  USER_ID,
} from '../shared/constants';
import {decode, encode} from '../shared/uint82b64';
import {draw_cache_png} from '@/vendor/renderer/renderer';
import {splatters2Render} from '../shared/wasm-args';

const CACHE_DEBOUNCE_MS = 100;

export const initialize = async (
  actor: OrchestratorActor,
  orchestratorActorIds: string[],
  onlineChange: (online: boolean) => void,
  rebucket: (actor: OrchestratorActor) => Promise<void>,
  debug: Debug,
) => {
  // Set up our connection to reflect
  console.log(`Connecting to room ${actor.room} on worker at ${WORKER_HOST}`);

  if (process.env.NEXT_PUBLIC_CREATE_ROOMS) {
    // Make sure we have the room we'll be connecting to
    const res = await fetch('/api/create-room', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({roomID: actor.room}),
    });
    if (!res.ok) {
      const message = await res.text();
      throw new Error(
        `Failed to connect to room ${actor.room}\n(${res.status}: ${message})`,
      );
    }
  }

  // Create a reflect client
  const reflectClient = new Reflect<M>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: async online => {
      if (online) {
        await rebucket(actor);
        await reflectClient.mutate.guaranteeActor({...actor});
      }
      onlineChange(online);
    },
    userID: USER_ID,
    roomID: actor.room,
    auth: JSON.stringify({
      userID: USER_ID,
      roomID: actor.room,
    }),
    logLevel: 'error',
    mutators,
  });

  // Do a cleanup whenever we make a new client
  reflectClient.mutate.removeActorsExcept(orchestratorActorIds);

  // To handle only doing an operation when something changes, we allow
  // registering listeners for a given key prefix.
  const listeners: Map<
    string,
    ((data: any, deleted: boolean, keyParts: string[]) => void)[]
  > = new Map();
  const addListener = <T>(
    opName: string,
    handler: (data: T, deleted: boolean, keyParts: string[]) => void,
  ) => {
    const existing = listeners.get(opName) || [];
    existing.push(handler);
    listeners.set(opName, existing);
  };

  const getCache = async (letter: Letter) =>
    await reflectClient.query(async tx => await unchunk(tx, `cache/${letter}`));

  // Set up a local state - this is used to cache values that we don't want to
  // read every frame (and that will be updated via subscription instead)
  const localState: State = await reflectClient.query(
    stateInitializer(actor.id, debug),
  );

  let cacheTimeouts = letterMap<number | null>(() => null);

  const triggerHandlers = (
    keyParts: string[],
    diff: ExperimentalDiffOperation<string>,
  ) => {
    const handlers = listeners.get(keyParts[0]);
    if (handlers) {
      handlers.forEach(h => h(getData(diff), isDeleteDiff(diff), keyParts));
    }
  };

  reflectClient.experimentalWatch(diffs => {
    diffs.forEach(async diff => {
      const keyParts = diff.key.split('/');
      switch (keyParts[0]) {
        case 'actor':
          const actor = getData<Actor>(diff);
          if (isDeleteDiff(diff)) {
            delete localState.actors[actor.id];
          } else {
            localState.actors[actor.id] = actor;
          }
          break;
        case 'cursor':
          const cursor = getData<Cursor>(diff);
          if (isDeleteDiff(diff)) {
            delete localState.cursors[cursor.actorId];
          } else {
            localState.cursors[cursor.actorId] = cursor;
          }
          break;
        case 'cache':
          const letter = keyParts[1] as Letter;
          // Because cache is chunked, we'll get one update per key, which means we'll get
          // a ton of partial updates. Since we trigger semi expensive operations on cache
          // updates, we need to debounce them so that we don't draw bad caches or do a
          // ton of unnecessary work.
          if (cacheTimeouts[letter]) {
            clearTimeout(cacheTimeouts[letter]!);
          }
          cacheTimeouts[letter] = window.setTimeout(async () => {
            const cache = await getCache(letter);
            if (cache === UNINITIALIZED_CACHE_SENTINEL) {
              return;
            }
            if (cache) {
              updateCache(letter, cache, debug);
            }
            triggerHandlers(keyParts, diff);
          }, CACHE_DEBOUNCE_MS);
          // Return so that we don't trigger handlers. We'll do so after the debounce.
          return;
        case 'cleared':
          // Ignore both the initial (client) and second (first sync) value for 'cleared',
          // so that we only fire handlers when we get a value and it's a new value that
          // we're seeing in real time.
          const d = await getData(diff);
          if (
            d === UNINITIALIZED_CLEARED_SENTINEL ||
            (isChangeDiff(diff) &&
              diff.oldValue === UNINITIALIZED_CLEARED_SENTINEL)
          ) {
            return;
          }
          break;
        case 'splatter-num':
          const splatterNum = await getData<number>(diff);
          if (splatterNum % SPLATTER_FLATTEN_FREQUENCY === 0) {
            const letter = keyParts[1] as Letter;
            const [newCache, flattenedKeys] = await reflectClient.query(
              async tx => await flattenCache(tx, letter),
            );
            reflectClient.mutate.updateCache({letter, newCache, flattenedKeys});
          }
      }
      triggerHandlers(keyParts, diff);
    });
  });

  const getState = async (): Promise<State> => {
    return {...localState};
  };

  const mutations = reflectClient.mutate;

  await mutations.initialize();

  const getSplatters = async (letter: Letter) => {
    return await reflectClient.query(async tx => {
      return (await tx
        .scan({prefix: `splatter/${letter}`})
        .toArray()) as Splatter[];
    });
  };

  let sawUninitialized = new Set();
  const cachesLoaded = async () => {
    let loadedLetters = new Set();
    await reflectClient.query(async tx => {
      for await (const letter of LETTERS) {
        if (loadedLetters.has(letter)) {
          continue;
        }
        const cacheVal = await unchunk(tx, `cache/${letter}`);
        if (cacheVal === UNINITIALIZED_CACHE_SENTINEL) {
          sawUninitialized.add(letter);
        }
        if (
          sawUninitialized.has(letter) &&
          cacheVal !== UNINITIALIZED_CACHE_SENTINEL
        ) {
          loadedLetters.add(letter);
        }
      }
    });
    return LETTERS.every(l => loadedLetters.has(l));
  };

  const createActorIfMissing = async () => {
    if (!localState.actors[actor.id]) {
      await rebucket(actor);
      await mutations.guaranteeActor({...actor});
      return true;
    }
    return false;
  };

  return {
    ...mutations,
    createActorIfMissing,
    cachesLoaded,
    getState,
    addListener,
    getSplatters,
    reflectClient,
  };
};

const flattenCache = async (
  tx: ReadTransaction,
  letter: Letter,
): Promise<[string, string[]]> => {
  // Get all the splatters for this letter
  const splatters = (await (await tx.scan({prefix: `splatter/${letter}`}))
    .entries()
    .toArray()) as [string, Splatter][];
  const timestamp = now();

  // And find any splatters which are "old"
  const oldSplatters: [string, Splatter][] = splatters.filter(
    s => timestamp - s[1].t >= SPLATTER_MAX_AGE,
  );
  // Now if we have any cacheable splatters, draw them to the cache
  // Draw them on top of the last cached image
  const png = await unchunk(tx, `cache/${letter}`);
  const decoded = png ? decode(png) : undefined;
  const newCache = draw_cache_png(
    decoded,
    ...splatters2Render(
      oldSplatters.map(s => s[1]),
      // When we draw a cache, we just want the "finished" state of all the
      // animations, as they're presumed to be complete and immutable.
      oldSplatters.map(() => SPLATTER_ANIM_FRAMES),
    ),
  );
  return [encode(newCache), oldSplatters.map(s => s[0])];
};

const stateInitializer =
  (actorId: string, debug: Debug) =>
  async (tx: ReadTransaction): Promise<State> => {
    const actorList = (await tx.scan({prefix: 'actor/'}).toArray()) as Actor[];
    const actors = actorList.reduce((actors, actor) => {
      actors[actor.id] = actor;
      return actors;
    }, {} as State['actors']);
    const cursorList = (await tx
      .scan({prefix: 'cursor/'})
      .toArray()) as Cursor[];
    const cursors = cursorList.reduce((cursors, cursor) => {
      cursors[cursor.actorId] = cursor;
      return cursors;
    }, {} as State['cursors']);
    for await (const letter of LETTERS) {
      const cache = await unchunk(tx, `cache/${letter}`);
      if (cache && cache !== UNINITIALIZED_CACHE_SENTINEL) {
        updateCache(letter, cache, debug);
      }
    }
    return {
      actorId,
      actors,
      cursors,
    };
  };

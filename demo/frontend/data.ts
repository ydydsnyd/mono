import {
  Reflect,
  ReadTransaction,
  ExperimentalDiffOperation,
} from '@rocicorp/reflect';
import {letterMap} from '../shared/util';
import type {
  Actor,
  Cursor,
  Debug,
  Impulse,
  Letter,
  Splatter,
  State,
} from '../shared/types';
import {mutators, M} from '../shared/mutators';
import {LETTERS} from '../shared/letters';
import {getData, isAddDiff, isChangeDiff, isDeleteDiff} from './data-util';
import {setPhysics, updateCache} from '../shared/renderer';
import {WORKER_HOST} from '../shared/urls';
import {unchunk} from '../shared/chunks';
import type {OrchestratorActor} from '../shared/types';

const CACHE_DEBOUNCE_MS = 100;

export const initialize = async (
  actor: OrchestratorActor,
  onlineChange: (online: boolean) => void,
  rebucket: (actor: OrchestratorActor) => Promise<void>,
  debug: Debug,
) => {
  // Set up our connection to reflect
  console.log(`Connecting to room ${actor.room} on worker at ${WORKER_HOST}`);

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

  // Create a reflect client
  const reflectClient = new Reflect<M>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: async online => {
      if (online) {
        await rebucket(actor);
        await reflectClient.mutate.guaranteeActor(actor);
      }
      onlineChange(online);
    },
    userID: actor.id,
    roomID: actor.room,
    auth: JSON.stringify({
      userID: actor.id,
      roomID: actor.room,
    }),
    logLevel: 'error',
    mutators,
  });

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
  setPhysics(localState.physicsStep, localState.physicsState);

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
        case 'physics':
          if (keyParts[1] === 'step') {
            if (isChangeDiff(diff) || isAddDiff(diff)) {
              const step = getData<number>(diff);
              localState.physicsStep = step;
              const state = await reflectClient.query(
                async tx => await unchunk(tx, `physics/state`),
              );
              localState.physicsState = state;
              setPhysics(step, state);
            }
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
            if (cache) {
              updateCache(letter, cache, debug);
            }
            triggerHandlers(keyParts, diff);
          }, CACHE_DEBOUNCE_MS);
          // Return so that we don't trigger handlers. We'll do so after the debounce.
          return;
      }
      triggerHandlers(keyParts, diff);
    });
  });

  const getState = (): Promise<State> =>
    reflectClient.query(async (tx: ReadTransaction) => {
      // Impulses are sometimes modified in quite large ways (e.g. we delete tons at a
      // time on the server) - to avoid having to maintain a local index, just read
      // them all from reflect on each frame.
      const impulses: State['impulses'] = letterMap(() => []);
      await Promise.all([
        ...LETTERS.map(async letter => {
          const letterImpulses = (await tx
            .scan({prefix: `impulse/${letter}`})
            .toArray()) as Impulse[];
          impulses[letter] = letterImpulses;
        }),
      ]);
      return {
        ...localState,
        impulses,
      };
    });

  const mutations = reflectClient.mutate;

  const initialSplatters: Record<Letter, Splatter[]> = letterMap(() => []);
  await reflectClient.query(async tx => {
    await Promise.all([
      ...LETTERS.map(async letter => {
        const splatters = (await tx
          .scan({prefix: `splatter/${letter}`})
          .toArray()) as Splatter[];
        initialSplatters[letter] = splatters;
      }),
    ]);
  });

  const getSplatters = async (letter: Letter) => {
    return await reflectClient.query(async tx => {
      return (await tx
        .scan({prefix: `splatter/${letter}`})
        .toArray()) as Splatter[];
    });
  };

  return {
    ...mutations,
    getState,
    addListener,
    getSplatters,
    reflectClient,
    initialSplatters,
  };
};

const stateInitializer =
  (userID: string, debug: Debug) =>
  async (tx: ReadTransaction): Promise<State> => {
    const actorList = (await tx.scan({prefix: 'actor/'}).toArray()) as Actor[];
    const actors = actorList.reduce((actors, actor) => {
      actors[actor.id] = actor;
      return actors;
    }, {} as State['actors']);
    const cursorList = (await tx
      .scan({prefix: 'cursor/'})
      .toArray()) as Cursor[];
    const physicsStep = ((await tx.get('physics/step')) as number) || 0;
    const physicsState = (await tx.get('physics/state')) as string | undefined;
    const cursors = cursorList.reduce((cursors, cursor) => {
      cursors[cursor.actorId] = cursor;
      return cursors;
    }, {} as State['cursors']);
    const impulses: State['impulses'] = letterMap(() => []);
    await Promise.all([
      ...LETTERS.map(async letter => {
        const letterImpulses = (await tx
          .scan({
            prefix: `impulse/${letter}/`,
          })
          .toArray()) as Impulse[];
        impulses[letter] = letterImpulses;
      }),
      ...LETTERS.map(async letter => {
        const cache = await unchunk(tx, `cache/${letter}`);
        if (cache) {
          updateCache(letter, cache, debug);
        }
      }),
    ]);
    return {
      actorId: userID,
      actors,
      cursors,
      impulses,
      physicsState,
      physicsStep,
    };
  };

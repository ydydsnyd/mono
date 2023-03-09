import {Reflect, ReadTransaction} from '@rocicorp/reflect';
import {asyncLetterMap, letterMap} from '../shared/util';
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
import {DEBUG_TEXTURES} from './constants';

export const initialize = async (actor: OrchestratorActor, debug: Debug) => {
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
    onOnlineChange: online => {
      console.log(`online: ${online}`);
      const dot = document.querySelector('.online-dot');
      if (dot) {
        if (online) {
          dot.classList.remove('offline');
        } else {
          dot.classList.add('offline');
        }
      }
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

  // Set up a local state - this is used to cache values that we don't want to
  // read every frame (and that will be updated via subscription instead)
  const localState: State = await reflectClient.query(
    stateInitializer(actor.id),
  );
  setPhysics(localState.physicsStep, localState.physicsState);
  if (DEBUG_TEXTURES) {
    await asyncLetterMap(async letter => {
      debug.serverCaches[letter] =
        (await reflectClient.query(
          async tx => (await unchunk(tx, `cache/${letter}`)) as string,
        )) || '';
    });
  }

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
          if (DEBUG_TEXTURES) {
            const letter = keyParts[1] as Letter;
            const cache = await reflectClient.query(
              async tx => await unchunk(tx, `cache/${letter}`),
            );
            debug.serverCaches[letter] = cache || '';
          }
          break;
      }
      const handlers = listeners.get(keyParts[0]);
      if (handlers) {
        handlers.forEach(h => h(getData(diff), isDeleteDiff(diff), keyParts));
      }
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

  // Before allowing clients to perform mutations, make sure that we've written
  // our local actor to reflect.
  await mutations.guaranteeActor(actor);

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

  return {...mutations, getState, addListener, reflectClient, initialSplatters};
};

const stateInitializer =
  (userID: string) =>
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
          updateCache(letter, cache);
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

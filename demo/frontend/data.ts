import {Reflect, ReadTransaction} from '@rocicorp/reflect';
import {letterMap} from '../shared/util';
import {
  Actor,
  Cursor,
  Letter,
  LetterCache,
  LetterOwner,
  LetterPosition,
  LetterRotation,
  LetterScale,
  Point,
  State,
  Tool,
} from '../shared/types';
import {mutators, M} from '../shared/mutators';
import {LETTERS} from '../shared/letters';
import {getData, isAddDiff, isChangeDiff, isDeleteDiff} from './data-util';
import {updateCache} from '../shared/renderer';
import {getWorkerHost} from '../shared/urls';

export const initialize = async (roomID: string, userID: string) => {
  // Set up our connection to reflect
  const workerHost = getWorkerHost(process.env as Record<string, string>);
  console.log(`Connecting to worker at ${workerHost}`);
  // Create a reflect client
  const reflectClient = new Reflect<M>({
    socketOrigin: workerHost,
    onOnlineChange: online => {
      console.log(`online: ${online}`);
    },
    userID,
    roomID: roomID,
    auth: JSON.stringify({
      userID,
      roomID: roomID,
    }),
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
  const localState: State = await reflectClient.query(stateInitializer(userID));

  reflectClient.experimentalWatch(diffs => {
    diffs.forEach(diff => {
      const keyParts = diff.key.split('/');
      switch (keyParts[0]) {
        case 'seq':
          const letter = keyParts[1] as Letter;
          const seq = getData<number>(diff);
          localState.sequences[letter] = seq;
          break;
        case 'actor':
          const actor = getData<Actor>(diff);
          if (isDeleteDiff(diff)) {
            delete localState.actors[actor.id];
          } else {
            localState.actors[actor.id] = actor;
          }
          break;
        case 'tool':
          if (isChangeDiff(diff) || isAddDiff(diff)) {
            const actorId = keyParts[1];
            localState.tools[actorId] = getData<Tool>(diff);
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
        case 'position':
          if (isChangeDiff(diff) || isAddDiff(diff)) {
            const pos = getData<LetterPosition>(diff);
            localState.positions[pos.letter] = pos.position;
          }
          break;
        case 'scale':
          if (isChangeDiff(diff) || isAddDiff(diff)) {
            const pos = getData<LetterScale>(diff);
            localState.scales[pos.letter] = pos.scale;
          }
          break;
        case 'rotation':
          if (isChangeDiff(diff) || isAddDiff(diff)) {
            const rot = getData<LetterRotation>(diff);
            localState.rotations[rot.letter] = rot.rotation;
          }
          break;
        case 'cache':
          if (isChangeDiff(diff) || isAddDiff(diff)) {
            const letter = keyParts[1] as Letter;
            const cache = getData<LetterCache>(diff);
            localState.rawCaches[letter] = cache.cache;
            updateCache(letter, cache.cache);
          }
          break;
        case 'owner': {
          const letter = keyParts[1] as Letter;
          if (isChangeDiff(diff) || isAddDiff(diff)) {
            const data = getData<LetterOwner>(diff);
            localState.owners[letter] = data.actorId;
          } else if (isDeleteDiff(diff)) {
            localState.owners[letter] = undefined;
          }
        }
      }
      const handlers = listeners.get(keyParts[0]);
      if (handlers) {
        handlers.forEach(h => h(getData(diff), isDeleteDiff(diff), keyParts));
      }
    });
  });

  const getState = (): Promise<State> =>
    reflectClient.query(async (tx: ReadTransaction) => {
      // Points are sometimes modified in quite large ways (e.g. we delete tons at a
      // time on the server) - to avoid having to maintain a local index, just read
      // them all from reflect on each frame.
      const points: State['points'] = letterMap(() => []);
      await Promise.all([
        ...LETTERS.map(async letter => {
          const letterPoints = (await tx
            .scan({prefix: `point/${letter}`})
            .toArray()) as Point[];
          points[letter] = letterPoints;
        }),
      ]);
      return {
        ...localState,
        points,
      };
    });

  const mutations = reflectClient.mutate;

  // Before allowing clients to perform mutations, make sure that we've written
  // our local actor to reflect.
  await mutations.guaranteeActor({actorId: userID});

  return {...mutations, getState, addListener, reflectClient};
};

const stateInitializer =
  (userID: string) =>
  async (tx: ReadTransaction): Promise<State> => {
    const actorList = (await tx.scan({prefix: 'actor/'}).toArray()) as Actor[];
    const actors = actorList.reduce((actors, actor) => {
      actors[actor.id] = actor;
      return actors;
    }, {} as State['actors']);
    const tools = actorList.reduce((actors, actor) => {
      actors[actor.id] = Tool.PAINT;
      return actors;
    }, {} as State['tools']);
    // Proactively create our local tool since we won't be in the actors list yet
    tools[userID] =
      ((await tx.get(`tool/${userID}`)) as Tool | undefined) || Tool.PAINT;
    const cursorList = (await tx
      .scan({prefix: 'cursor/'})
      .toArray()) as Cursor[];
    const cursors = cursorList.reduce((cursors, cursor) => {
      cursors[cursor.actorId] = cursor;
      return cursors;
    }, {} as State['cursors']);
    const points: State['points'] = letterMap(() => []);
    const rawCaches: State['rawCaches'] = letterMap(() => '');
    const positions: State['positions'] = letterMap(() => ({
      x: 0,
      y: 0,
    }));
    const scales: State['scales'] = letterMap(() => 1);
    const rotations: State['rotations'] = letterMap(() => 0);
    const sequences: State['sequences'] = letterMap(() => -1);
    const owners: State['owners'] = letterMap(() => undefined);
    await Promise.all([
      ...LETTERS.map(async letter => {
        const letterPoints = (await tx
          .scan({
            prefix: `point/${letter}/`,
          })
          .toArray()) as Point[];
        points[letter] = letterPoints;
      }),
      ...LETTERS.map(async letter => {
        const cacheData = (await tx.get(`cache/${letter}`)) as
          | LetterCache
          | undefined;
        if (cacheData?.cache) {
          rawCaches[letter] = cacheData.cache;
          updateCache(letter, cacheData.cache);
        }
      }),
      ...LETTERS.map(async letter => {
        const positionData = (await tx.get(`position/${letter}`)) as
          | LetterPosition
          | undefined;
        if (positionData) {
          positions[letter] = positionData.position;
        }
      }),
      ...LETTERS.map(async letter => {
        const positionData = (await tx.get(`rotation/${letter}`)) as
          | LetterRotation
          | undefined;
        if (positionData) {
          rotations[letter] = positionData.rotation;
        }
      }),
      ...LETTERS.map(async letter => {
        const scaleData = (await tx.get(`scale/${letter}`)) as
          | LetterScale
          | undefined;
        scales[letter] = scaleData?.scale || 1;
      }),
      ...LETTERS.map(async letter => {
        sequences[letter] = ((await tx.get(`seq/${letter}`)) as number) || 0;
      }),
      ...LETTERS.map(async letter => {
        const ownerData =
          ((await tx.get(`owner/${letter}`)) as LetterOwner) || undefined;
        owners[letter] = ownerData && ownerData.actorId;
      }),
    ]);
    return {
      actorId: userID,
      actors,
      cursors,
      points,
      rawCaches,
      positions,
      scales,
      rotations,
      sequences,
      tools,
      owners,
    };
  };

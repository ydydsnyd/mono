import {
  Reflect,
  ReadTransaction,
  ExperimentalDiffOperation,
} from '@rocicorp/reflect';
import {consoleLogSink, OptionalLoggerImpl} from '@rocicorp/logger';
import type {
  Actor,
  Cursor,
  State,
  ActivePuzzlePiece,
  PieceOrder,
  PieceNumber,
} from '../shared/types';
import {mutators, M} from '../shared/mutators';
import {OP, getData, isDeleteDiff, op} from './data-util';
import {WORKER_HOST} from '../shared/urls';
import {USER_ID} from '../shared/constants';
import {loggingOptions} from './logging-options';
import {DataDogBrowserLogSink} from './data-dog-browser-log-sink';

export const initialize = async (
  actor: Actor,
  randomPieces: ActivePuzzlePiece[],
  onlineChange: (online: boolean) => void,
) => {
  // Set up our connection to reflect
  console.log(`Connecting to room ${actor.room} on worker at ${WORKER_HOST}`);

  const logSink = consoleLogSink;
  const logger = new OptionalLoggerImpl(logSink);
  const logSinks = [logSink];
  if (process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN !== undefined) {
    logSinks.push(new DataDogBrowserLogSink());
  }

  // Create a reflect client
  const reflectClient = new Reflect<M>({
    socketOrigin: WORKER_HOST,
    onOnlineChange: async online => {
      onlineChange(online);
    },
    userID: USER_ID,
    roomID: actor.room,
    auth: JSON.stringify({
      userID: USER_ID,
      roomID: actor.room,
    }),
    mutators,
    ...loggingOptions,
  });

  // To handle only doing an operation when something changes, we allow
  // registering listeners for a given key prefix.
  const listeners: Map<
    string,
    ((data: any, op: OP, keyParts: string[]) => void)[]
  > = new Map();
  const addListener = <T>(
    opName: string,
    handler: (data: T, op: OP, keyParts: string[]) => void,
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

  const triggerHandlers = (
    keyParts: string[],
    diff: ExperimentalDiffOperation<string>,
  ) => {
    const handlers = listeners.get(keyParts[0]);
    if (handlers) {
      handlers.forEach(h => h(getData(diff), op(diff.op), keyParts));
    }
  };

  reflectClient.experimentalWatch(diffs => {
    diffs.forEach(async diff => {
      const keyParts = diff.key.split('/');
      switch (keyParts[0]) {
        case 'cursor':
          const cursor = getData<Cursor>(diff);
          if (isDeleteDiff(diff)) {
            delete localState.cursors[cursor.actorID];
          } else {
            localState.cursors[cursor.actorID] = cursor;
          }
          break;
        case 'piece':
          // We never delete pieces, so we don't need to handle that here.
          const num = parseInt(keyParts[1], 10);
          localState.pieces[num] = getData<ActivePuzzlePiece>(diff);
          break;
      }
      triggerHandlers(keyParts, diff);
    });
  });

  await reflectClient.mutate.initializePuzzle({
    force: false,
    pieces: randomPieces,
  });

  const getPieceOrder = async () => {
    const orders = await reflectClient.query(
      async tx =>
        (await tx.scan({prefix: 'piece-order/'}).entries().toArray()) as [
          string,
          PieceOrder,
        ][],
    );
    const orderMap = orders.reduce((o, e) => {
      const num = parseInt(e[0].split('/')[1], 10) as PieceNumber;
      o[num] = e[1];
      return o;
    }, {} as Record<PieceNumber, PieceOrder>);
    const getOrder = (number: PieceNumber) =>
      orderMap[number] === undefined ? -1 : orderMap[number];
    return [...Array(localState.pieces.length).keys()].sort((a, b) => {
      const ao = getOrder(a);
      const bo = getOrder(b);
      return ao === bo ? 0 : ao > bo ? -1 : 1;
    });
  };

  const getPlacedPieces = () => {
    let placed = [];
    for (const piece of localState.pieces) {
      if (piece.placed) {
        placed.push(piece.number);
      }
    }
    return placed;
  };

  return {
    mutators: reflectClient.mutate,
    state: localState,
    addListener,
    reflectClient,
    logger,
    getPieceOrder,
    getPlacedPieces,
  };
};

const stateInitializer =
  (actorID: string) =>
  async (tx: ReadTransaction): Promise<State> => {
    const cursorList = (await tx
      .scan({prefix: 'cursor/'})
      .toArray()) as Cursor[];
    const cursors = cursorList.reduce((cursors, cursor) => {
      cursors[cursor.actorID] = cursor;
      return cursors;
    }, {} as State['cursors']);
    const pieces = (await tx
      .scan({prefix: 'piece/'})
      .toArray()) as ActivePuzzlePiece[];
    return {
      actorID,
      cursors,
      pieces,
    };
  };

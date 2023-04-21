import type {
  MutatorDefs,
  ReadTransaction,
  WriteTransaction,
} from '@rocicorp/reflect';
import type {
  ActivePuzzlePiece,
  ActorID,
  Cursor,
  PieceNumber,
  Position,
} from './types';
import {ACTIVITY_TIMEOUT} from './constants';

export type M = typeof mutators;

type _Mutators<MD extends MutatorDefs> = {
  readonly [P in keyof MD]: MD[P] extends infer T
    ? T extends MD[P]
      ? T extends (tx: WriteTransaction, ...args: infer Args) => infer Ret
        ? (...args: Args) => Ret extends Promise<unknown> ? Ret : Promise<Ret>
        : never
      : never
    : never;
};

const pieceKey = (num: number) => `piece/${num.toString().padStart(4)}`;

export type Mutators = _Mutators<M>;

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
  const count = await getServerLogCount(tx);
  await tx.put(entriesKey(count), log);
  await tx.put(entriesCountKey, count + 1);
}

export const mutators = {
  setPresentActors: async (tx: WriteTransaction, actors: ActorID[]) => {
    const allCursors = (await tx
      .scan({prefix: 'cursor/'})
      .entries()
      .toArray()) as [string, Cursor][];
    const actorIDs = new Set(actors);
    for await (const [key, cursor] of allCursors) {
      if (!actorIDs.has(cursor.actorID)) {
        await tx.del(key);
      }
    }
  },
  updateCursor: async (tx: WriteTransaction, cursor: Cursor) => {
    await tx.put(`cursor/${cursor.actorID}`, {...cursor});
  },
  initializePuzzle: async (
    tx: WriteTransaction,
    {force, pieces}: {force: boolean; pieces: ActivePuzzlePiece[]},
  ) => {
    if (!force && (await tx.get('puzzle-exists'))) {
      console.log('puzzle already exists, skipping non-force initialization');
      return;
    }
    for (const [index, piece] of pieces.entries()) {
      await tx.put(pieceKey(index), piece);
    }
    await tx.put('puzzle-exists', true);
  },
  movePiece: async (
    tx: WriteTransaction,
    {
      actorID,
      pieceNum,
      position,
    }: {actorID: ActorID; pieceNum: PieceNumber; position: Position},
  ) => {
    const key = pieceKey(pieceNum);
    const piece = (await tx.get(key)) as ActivePuzzlePiece;
    if (piece.placed) {
      // Can't change placed pieces
      return;
    }
    if (piece.moverID && piece.moverID !== actorID) {
      // Someone is already moving this piece
      return;
    }
    if (
      position.x > 2 ||
      position.y > 2 ||
      position.x < -1 ||
      position.y < -1
    ) {
      // Don't allow moving pieces outside of interactive area
      return;
    }
    const newPiece: ActivePuzzlePiece = {
      ...piece,
      ...position,
      moverID: actorID,
    };
    await tx.put(key, newPiece);
  },
  finishMoving: async (
    tx: WriteTransaction,
    {pieceNum}: {pieceNum: PieceNumber},
  ) => {
    const key = pieceKey(pieceNum);
    const piece = (await tx.get(key)) as ActivePuzzlePiece;
    const newPiece = await placePieceIfClose({...piece});
    newPiece.moverID = '';
    await tx.put(key, newPiece);
  },
  setPieceActive: async (
    tx: WriteTransaction,
    {
      actorID,
      pieceNum,
      ts,
    }: {actorID: ActorID; pieceNum: number; ts: PieceNumber},
  ) => {
    // The goal here is to always show pieces on top that have been interacted with most recently.
    const order = ts % ACTIVITY_TIMEOUT;
    await tx.put(`piece-order/${pieceNum}`, order);
    const cursorKey = `cursor/${actorID}`;
    const cursor = (await tx.get(cursorKey)) as Cursor;
    if (cursor) {
      await tx.put(cursorKey, {...cursor, activePiece: pieceNum});
    }
  },
  setPieceInactive: async (
    tx: WriteTransaction,
    {actorID}: {actorID: ActorID; pieceNum: PieceNumber},
  ) => {
    const cursorKey = `cursor/${actorID}`;
    const cursor = (await tx.get(cursorKey)) as Cursor;
    if (cursor) {
      await tx.put(cursorKey, {...cursor, activePiece: -1});
    }
  },
  rotatePiece: async (
    tx: WriteTransaction,
    {
      actorID,
      pieceNum,
      rotation,
      handlePosition,
    }: {
      actorID: ActorID;
      pieceNum: PieceNumber;
      rotation: number;
      handlePosition: Position;
    },
  ) => {
    const key = pieceKey(pieceNum);
    const piece = (await tx.get(key)) as ActivePuzzlePiece;
    if (piece.placed) {
      // Can't change placed pieces
      return;
    }
    if (piece.rotatorID && piece.rotatorID !== actorID) {
      // Someone is already rotating this piece
      return;
    }
    await tx.put(key, {
      ...piece,
      rotation,
      rotatorID: actorID,
      handlePosition,
    });
  },
  finishRotating: async (
    tx: WriteTransaction,
    {pieceNum}: {pieceNum: PieceNumber},
  ) => {
    const key = pieceKey(pieceNum);
    const piece = (await tx.get(key)) as ActivePuzzlePiece;

    const newPiece = await placePieceIfClose({
      ...piece,
      rotation: piece.rotation,
    });
    newPiece.rotatorID = '';
    newPiece.handlePosition = {x: -1, y: -1};
    await tx.put(key, newPiece);
  },

  // These mutators are for the how it works demos
  increment: async (
    tx: WriteTransaction,
    {key, delta}: {key: string; delta: number},
  ) => {
    const prev = ((await tx.get(key)) as number) ?? 0;
    const next = prev + delta;
    await tx.put(key, next);

    const prevStr = prev % 1 === 0 ? prev.toString() : prev.toFixed(2);
    const nextStr = next % 1 === 0 ? next.toString() : next.toFixed(2);
    const msg = `Running ${tx.clientID}@${tx.mutationID} on ${tx.environment}: ${prevStr} → ${nextStr}`;

    if (tx.environment === 'client') {
      if (tx.reason !== 'rebase') {
        clientConsoleMap.get(tx.clientID)?.(msg);
      }
    } else {
      await addServerLog(tx, msg);
    }
  },
  addServerLog,
  getServerLogs,
  getServerLogCount,
  nop: async (_: WriteTransaction) => {},
};

const rotationFuzzy = Math.PI / 6;
const placementFuzzy = 0.025;
const placePieceIfClose = async (
  piece: ActivePuzzlePiece,
): Promise<ActivePuzzlePiece> => {
  const xDistance = Math.abs(piece.dx - piece.x);
  const yDistance = Math.abs(piece.dy - piece.y);
  if (
    (piece.rotation < rotationFuzzy ||
      piece.rotation > Math.PI * 2 - rotationFuzzy) &&
    xDistance < placementFuzzy &&
    yDistance < placementFuzzy
  ) {
    piece.placed = true;
    piece.x = piece.dx;
    piece.y = piece.dy;
    piece.rotation = 0;
  }
  return piece;
};

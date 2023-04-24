import type {ReadTransaction, WriteTransaction} from '@rocicorp/reflect';
import {PieceModel, putPiece, updatePiece} from '../alive/piece-model';
import {putClient, updateClient} from '../alive/client-model';

export type M = typeof mutators;

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
  resetRoom: async (tx: WriteTransaction) => {
    for (const key of await tx.scan().keys().toArray()) {
      await tx.del(key);
    }
  },

  // alive mutators
  initializePuzzle: async (
    tx: WriteTransaction,
    {force, pieces}: {force: boolean; pieces: PieceModel[]},
  ) => {
    if (tx.environment === 'client') {
      if (!force) {
        console.debug(
          'client cannot initialize puzzle, skipping non-force optimistic mutation',
        );
        return;
      }
    }
    if (!force && (await tx.get('puzzle-exists'))) {
      console.debug('puzzle already exists, skipping non-force initialization');
      return;
    }
    for (const piece of pieces) {
      await putPiece(tx, piece);
    }
    await tx.put('puzzle-exists', true);
  },

  putClient,
  updateClient,
  updatePiece,

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
    const msg = `Running mutation ${tx.clientID}@${tx.mutationID} on ${tx.environment}: ${prevStr} → ${nextStr}`;

    if (tx.environment === 'client') {
      if (tx.reason !== 'rebase') {
        clientConsoleMap.get(tx.clientID)?.(msg);
      }
    } else {
      await addServerLog(tx, msg);
    }
  },
  degree: async (
    tx: WriteTransaction,
    {key, deg}: {key: string; deg: number},
  ) => {
    await tx.put(key, deg);
    const msg = `Running mutation ${tx.clientID}@${tx.mutationID} on ${tx.environment}: ${deg}`;

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

import type {LogContext} from '@rocicorp/logger';
import {IDBStore} from './idb-store.js';
import {MemStore} from './mem-store.js';
import type {Read, Store, Write} from './store.js';

/**
 * This store uses an {@link IDBStore} by default. If the {@link IDBStore} fails
 * to open the DB with an exception that matches
 * {@link isFirefoxPrivateBrowsingError} we switch out the implementation to use
 * a {@link MemStore} instead.
 *
 * The reason this is relatively complicated is that when {@link IDBStore} is
 * created, it calls `openDatabase` synchronously, but that returns a `Promise`
 * that will reject in the case of Firefox private browsing. We don't await this
 * promise until we call `read` or `write` so we cannot do the switch until
 * then.
 */

export class IDBStoreWithMemFallback implements Store {
  private readonly _lc: LogContext;
  private readonly _name: string;
  private _store: Store;
  constructor(lc: LogContext, name: string) {
    this._lc = lc;
    this._name = name;
    this._store = new IDBStore(name);
  }

  read(): Promise<Read> {
    return this._withBrainTransplant(s => s.read());
  }

  write(): Promise<Write> {
    return this._withBrainTransplant(s => s.write());
  }

  private async _withBrainTransplant<T extends Read>(
    f: (store: Store) => Promise<T>,
  ): Promise<T> {
    try {
      return await f(this._store);
    } catch (e) {
      if (isFirefoxPrivateBrowsingError(e)) {
        // It is possible that we end up with multiple pending read/write and
        // they all reject. Make sure we only replace the implementation once.
        if (this._store instanceof IDBStore) {
          this._lc.info?.(
            'Switching to MemStore because of Firefox private browsing error',
          );
          this._store = new MemStore(this._name);
        }
        return f(this._store);
      }
      throw e;
    }
  }

  close(): Promise<void> {
    return this._store.close();
  }

  get closed(): boolean {
    return this._store.closed;
  }
}

function isFirefoxPrivateBrowsingError(e: unknown): e is DOMException {
  return (
    isFirefox() &&
    e instanceof DOMException &&
    e.name === 'InvalidStateError' &&
    e.message ===
      'A mutation operation was attempted on a database that did not allow mutations.'
  );
}

function isFirefox(): boolean {
  return navigator.userAgent.includes('Firefox');
}

export function newIDBStoreWithMemFallback(
  lc: LogContext,
  name: string,
): Store {
  if (isFirefox()) {
    return new IDBStoreWithMemFallback(lc, name);
  }
  return new IDBStore(name);
}

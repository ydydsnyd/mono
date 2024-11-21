import {LogContext} from '@rocicorp/logger';
import type {Service} from './service.js';
import type {JWTPayload} from 'jose';
import {wrapIterable} from '../../../shared/src/iterables.js';
import {AuthError} from '../auth/error.js';

export type Auth =
  | {
      raw: string;
      decoded: JWTPayload;
    }
  | undefined;
/**
 * Manages the creation and lifecycle of objects that implement
 * {@link Service}.
 */
export class ServiceRunner<S extends Service> {
  readonly #lc: LogContext;
  readonly #instances = new Map<
    string,
    {
      auth: Auth;
      service: S;
    }
  >();
  readonly #create: (id: string, token: JWTPayload | undefined) => S;
  readonly #isValid: (existing: S) => boolean;

  constructor(
    lc: LogContext,
    factory: (id: string, token: JWTPayload | undefined) => S,
    isValid: (existing: S) => boolean,
  ) {
    this.#lc = lc;
    this.#create = factory;
    this.#isValid = isValid;
  }

  /**
   * Creates and runs the Service with the given `id`, returning
   * an existing one if it is still running a valid.
   */
  async getService(id: string, auth: Auth): Promise<S> {
    const existing = this.#instances.get(id);

    // If the token in the request does not match the token for the service,
    // we need to either reject the connection request or stop the existing
    // service and create a new one with the new token.
    // This is because we enforce that all clients in a client group use the same
    // auth token. If we allow tokens to diverge then we'd need to:
    // 1. Update the server to allow an AST to transform into many other ASTs after applying read rules
    // 2. Somehow deal with the fact that different tabs, with the same user id, could have different permissions and thus
    // would need different data stores.
    if (existing && existing.auth?.raw !== auth?.raw) {
      const newIat = auth?.decoded?.iat;
      const existingIat = existing.auth?.decoded?.iat;
      if (newIat === undefined) {
        // new token is undefined but there is an existing client
        // with a token.
        throw new AuthError(
          'No auth token was provided but an existing tab/window is connected with the same user id and an authentication token',
        );
      }
      // existing token is undefined or new token is newer
      if (existingIat === undefined || newIat > existingIat) {
        // stopping the service will make it invalid and it will be recreated
        await existing.service.stop();
      } else if (newIat < existingIat) {
        throw new AuthError(
          'An existing tab/window is connected with the same user id and newer authentication token',
        );
      } else {
        throw new AuthError(
          'Cannot determine which token to take. Tokens do not match but have the same issued at time.',
        );
      }
    }

    if (existing && this.#isValid(existing.service)) {
      return existing.service;
    }
    const service = this.#create(id, auth?.decoded);
    this.#instances.set(id, {
      auth,
      service,
    });
    void service
      .run()
      .catch(e => {
        this.#lc.error?.(
          `Error running ${service.constructor?.name} ${service.id}`,
          e,
        );
        this.#lc.info?.(e.toString());
      })
      .finally(() => {
        this.#instances.delete(id);
      });
    return service;
  }

  get size() {
    return this.#instances.size;
  }

  getServices(): Iterable<S> {
    return wrapIterable(this.#instances.values()).map(({service}) => service);
  }
}

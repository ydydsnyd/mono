import type {LogLevel, MutatorDefs} from 'replicache';

/**
 * Configuration for [[ReflectClient]].
 */
export interface ReflectClientOptions<MD extends MutatorDefs> {
  /**
   * Origin for WebSocket connections to the Reflect server. This must have a
   * `'ws'` or `'wss'` scheme.
   */
  socketOrigin: string;

  /**
   * The authentication/authorization token to use when opening a WebSocket
   * connection to the Reflect server.
   *
   * This token is used initially, but if an authentication error occurs
   * it will be replaced by calling [[ReflectClientOptions.getAuth]].
   * [[ReflectClient.auth]] will return the current token.
   *
   * The `authHandler` you provide to the Reflect server will be used
   * to validate this token on the server.
   */
  auth: string;

  /**
   * A function used to reauthenticate when the WebSocket connection to the
   * Reflect server fails to open, or is closed, due to an authentication error.
   *
   * Set this to a function that will ask your user to reauthenticate and
   * return a promise that resolves to the authorization token to use
   * for future WebSocket connections.
   */
  getAuth?: () => Promise<string | null | undefined>;

  /**
   * A unique identifier for the user authenticated by
   * [[ReflectClientOptions.auth]]. Must be non-empty.
   *
   * This must be the same as the `userID` returned by the `authHandler` you
   * provide to the Reflect server.
   *
   * For efficiency, a new ReflectClient instance will initialize its state from
   * the persisted state of an existing ReflectClient instance with the same
   * `userID`, `roomID`, domain and browser profile.
   *
   * Mutations from one ReflectClient instance may be pushed using the
   * [[ReflectClient.auth]] of another ReflectClient instance with the same
   * `userID`, `roomID`, domain and browser profile.
   */
  userID: string;

  /**
   * A unique identifier for the room.
   *
   * For efficiency, a new ReflectClient instance will initialize its state from
   * the persisted state of an existing ReflectClient instance with the same
   * `userID`, `roomID`, domain and browser profile.
   *
   * Mutations from one ReflectClient instance may be pushed using the
   * [[ReflectClient.auth]] of another ReflectClient instance with the same
   * `userID`, `roomID`, domain and browser profile.
   */
  roomID: string;

  /**
   * The schema version of the data understood by this application. This enables
   * versioning of mutators and the client view.
   */
  schemaVersion?: string;

  /**
   * Determines how much logging to do. When this is set to `'debug'`,
   * `'info'` and `'error'` messages are also logged. When set to
   * `'info'` we log `'info'` and `'error'` but not `'debug'`. When set to
   * `'error'` we only log `'error'` messages.
   * Default is `'info'`.
   */
  logLevel?: LogLevel;

  /**
   * An object used as a map to define the *mutators* for this application.
   *
   * *Mutators* are used to make changes to the Reflect data.
   *
   * The registered *mutations* are reflected on the
   * [[ReflectClient.mutate|mutate]] property of the [[ReflectClient]] instance.
   *
   * #### Example
   *
   * ```ts
   * const reflectClient = new ReflectClient({
   *   socketOrigin: 'wss://example.com/',
   *   userID: 'user-id',
   *   roomID: 'room-id',
   *   mutators: {
   *     async createTodo(tx: WriteTransaction, args: JSONValue) {
   *       const key = `/todo/${args.id}`;
   *       if (await tx.has(key)) {
   *         throw new Error('Todo already exists');
   *       }
   *       await tx.put(key, args);
   *     },
   *     async deleteTodo(tx: WriteTransaction, id: number) {
   *       ...
   *     },
   *   },
   * });
   * ```
   *
   * This will create the function to later use:
   *
   * ```ts
   * await reflectClient.mutate.createTodo({
   *   id: 1234,
   *   title: 'Make things realtime',
   *   complete: true,
   * });
   * ```
   *
   * #### Replays
   *
   * *Mutators* run once when they are initially invoked, but they might also be
   * *replayed* multiple times during sync. As such *mutators* should not modify
   * application state directly. Also, it is important that the set of
   * registered mutator names only grows over time. If Reflect syncs and a
   * needed *mutator* is not registered, it will substitute a no-op mutator, but
   * this might be a poor user experience.
   *
   * #### Server application
   *
   * During sync, a description of each mutation is sent to the server where it
   * is applied. Once the *mutation* has been applied successfully, the local
   * version of the *mutation* is removed. See the [design
   * doc](https://doc.replicache.dev/design#commits) for additional details on
   * the sync protocol.
   *
   * #### Transactionality
   *
   * *Mutators* are atomic: all their changes are applied together, or none are.
   * Throwing an exception aborts the transaction. Otherwise, it is committed.
   * As with [[query]] and [[subscribe]] all reads will see a consistent view of
   * the cache while they run.
   */
  mutators?: MD;
}

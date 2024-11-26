import type {Immutable} from '../../../shared/src/immutable.js';

export type ResultType = 'unknown' | 'complete';

export type Completable = {
  setComplete(): void;
};

/**
 * Called when the view changes. The received data should be considered
 * immutable. Caller must not modify it. Passed data is valid until next
 * time listener is called.
 */
export type Listener<T> = (data: Immutable<T>, resultType: ResultType) => void;

export type TypedView<T> = Completable & {
  addListener(listener: Listener<T>): () => void;
  destroy(): void;
  readonly data: T;
};

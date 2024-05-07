export function genMap<T, U>(s: Iterable<T>, cb: (x: T) => U) {
  return {
    *[Symbol.iterator]() {
      for (const x of s) {
        yield cb(x);
      }
    },
  };
}

export function genFilter<S extends T, T>(
  s: Iterable<T>,
  f: (x: T) => x is S,
): {
  [Symbol.iterator](): Generator<S, void, unknown>;
};
export function genFilter<T>(
  s: Iterable<T>,
  f: (x: T) => boolean,
): {
  [Symbol.iterator](): Generator<T, void, unknown>;
};
export function genFilter<S extends T, T>(
  s: Iterable<T>,
  cb: (x: T) => boolean,
): {
  [Symbol.iterator](): Generator<S, void, unknown>;
} {
  return {
    *[Symbol.iterator]() {
      for (const x of s) {
        if (cb(x)) {
          yield x as S;
        }
      }
    },
  };
}

/**
 * Flat maps the items returned from the iterable.
 *
 * finallyCb is provided so people can clean up resources when the iterator is
 * done being consumed.
 */
export function genFlatMap<T, U>(
  iter: () => Iterable<T>,
  f: (t: T, index: number) => Iterable<U>,
  finallyCb?: (() => void) | undefined,
) {
  return {
    *[Symbol.iterator]() {
      let index = 0;
      try {
        for (const t of iter()) {
          yield* f(t, index++);
        }
      } finally {
        if (finallyCb) {
          finallyCb();
        }
      }
    },
  };
}

export function* mapIter<T, U>(
  iter: Iterable<T>,
  f: (t: T, index: number) => U,
): Iterable<U> {
  let index = 0;
  for (const t of iter) {
    yield f(t, index++);
  }
}

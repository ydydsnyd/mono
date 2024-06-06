export type CbIteratorResult<T, E> =
  | {
      done?: undefined;
      error: E;
      value?: undefined;
    }
  | {
      done?: undefined;
      error?: undefined;
      value: T;
    }
  | {
      done: true;
      error?: undefined;
      value?: undefined;
    };

export type CbIterator<T, E> = (
  cb: (result: CbIteratorResult<T, E>) => void,
) => void;
export function newCbIterator<
  T,
  C extends Record<string, unknown> | undefined = undefined,
  E = unknown,
>(
  context: C,
  fn: (
    ctx: C,
    yld: (value: T) => void,
    rtrn: () => void,
    thrw: (err: E) => void,
    // stage: number,
  ) => void,
): CbIterator<T, E> {
  return (cb: (result: CbIteratorResult<T, E>) => void) => {
    const yld = (value: T) => cb({value});
    const thrw = (error: E) => cb({error});
    const rtrn = () => cb({done: true});
    fn(context, yld, rtrn, thrw);
  };
}

export function map<T, R, E>(
  cbIterator: CbIterator<T, E>,
  fn: (value: T) => R,
) {
  return newCbIterator(undefined, (_ctx, yld, rtrn, thrw) => {
    cbIterator(r => {
      if (r.done !== undefined) {
        rtrn();
        return;
      }
      if (r.error !== undefined) {
        thrw(r.error);
        return;
      }
      yld(fn(r.value!));
    });
  });
}

/**
 * Invoking a generator returns an iterator.
 *
 * Can we do `newCbIterator` where the callback is the same every time?
 * So we don't re-create yld, thrw, rtrn for every iteration.
 *
 * How can we compose the above?
 */

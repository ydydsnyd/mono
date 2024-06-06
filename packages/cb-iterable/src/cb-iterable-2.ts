// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TODO = any;
export type CB = (value: TODO, done: boolean) => void;

export class CustomCallbackGenerator {
  readonly #generatorFunction;
  readonly #state;
  #done;

  constructor(generatorFunction: (state: TODO, callback: CB) => void) {
    this.#generatorFunction = generatorFunction;
    this.#state = {};
    this.#done = false;
  }

  next(callback: CB) {
    if (this.#done) {
      callback(null, true);
    } else {
      this.#generatorFunction(this.#state, (value, done) => {
        this.#done = done;
        callback(value, done);
      });
    }
  }
}

export function map(
  generator: CustomCallbackGenerator,
  mapFunction: (value: TODO) => TODO,
) {
  return new CustomCallbackGenerator((_state, callback) => {
    generator.next((value, done) => {
      if (!done) {
        callback(mapFunction(value), false);
      } else {
        callback(null, true);
      }
    });
  });
}

export function filter(
  generator: CustomCallbackGenerator,
  filterFunction: (value: TODO) => boolean,
) {
  return new CustomCallbackGenerator((_state, callback) => {
    const getNext = () => {
      generator.next((value, done) => {
        if (!done) {
          if (filterFunction(value)) {
            callback(value, false);
          } else {
            getNext();
          }
        } else {
          callback(null, true);
        }
      });
    };
    getNext();
  });
}

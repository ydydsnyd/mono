import {assert} from 'shared/src/asserts.js';
import {must} from 'shared/src/must.js';
import type {Entity} from '../../entity.js';
import {
  buildPipeline,
  getValueFromEntity,
  selectorsToQualifiedColumns,
} from '../ast-to-ivm/pipeline-builder.js';
import type {AST} from '../ast/ast.js';
import type {Context} from '../context/context.js';
import {compareEntityFields} from '../ivm/compare.js';
import type {DifferenceStream} from '../ivm/graph/difference-stream.js';
import {MutableTreeView} from '../ivm/view/tree-view.js';
import type {Source} from '../ivm/source/source.js';
import type {View} from '../ivm/view/view.js';
import type {MakeHumanReadable} from './entity-query.js';

export interface IStatement<TReturn> {
  subscribe(cb: (value: MakeHumanReadable<TReturn>) => void): () => void;
  exec(): PromiseLike<MakeHumanReadable<TReturn>>;
  destroy(): void;
}

export class Statement<Return> implements IStatement<Return> {
  readonly #ast;
  readonly #context;
  #materialization?:
    | PromiseLike<View<Return extends [] ? Return[number] : Return>>
    | undefined = undefined;

  constructor(context: Context, ast: AST) {
    this.#ast = ast;
    this.#context = context;
  }

  #getMaterialization(): PromiseLike<View<Return>> {
    if (this.#materialization === undefined) {
      this.#createMaterilization();
    }
    return this.#materialization as PromiseLike<View<Return>>;
  }

  #createMaterilization() {
    assert(this.#materialization === undefined);

    const usedSources: Source<Entity>[] = [];
    const pipeline = buildPipeline(<T extends Entity>(sourceName: string) => {
      const source = this.#context.getSource(sourceName);
      const ret = source.stream as unknown as DifferenceStream<T>;
      usedSources.push(source);
      return ret;
    }, this.#ast);

    // We need to await seeding since sources can be ready at different times.
    // If someone queries for Table A in one query then
    // queries for Table A join Table B, Table A will be immediately ready.
    // Since we optimisitcally run joins, we'll return an incomplete result
    // as Table B hasn't returned from `watch` yet.
    //
    // This waits for all sources to have been loaded into memory
    // before creating the view.
    this.#materialization = Promise.all(
      usedSources.filter(s => !s.isSeeded()).map(s => s.awaitSeeding()),
    ).then(() => {
      const view = new MutableTreeView<
        Return extends [] ? Return[number] : never
      >(
        this.#context,
        this.#ast,
        pipeline as unknown as DifferenceStream<
          Return extends [] ? Return[number] : never
        >,
        makeComparator<readonly string[], Record<string, unknown>>(
          must(this.#ast.orderBy)[0],
          must(this.#ast.orderBy)[1],
        ),
        this.#ast.orderBy,
        this.#ast.limit,
      ) as unknown as View<Return extends [] ? Return[number] : Return>;
      view.pullHistoricalData();
      return view;
    });
  }

  subscribe(
    cb: (value: MakeHumanReadable<Return>) => void,
    initialData = true,
  ) {
    const materialization = this.#getMaterialization();
    const cleanupPromise = materialization.then(view =>
      view.on(cb, initialData),
    );
    const cleanup = () => {
      void cleanupPromise.then(p => p());
    };

    return cleanup;
  }

  // Note: should we provide a version that takes a callback?
  // So it can resolve in the same micro task?
  // since, in the common case, the data will always be available.
  async exec() {
    const materialization = await this.#getMaterialization();

    if (materialization.hydrated) {
      return Promise.resolve(materialization.value) as Promise<
        MakeHumanReadable<Return>
      >;
    }

    return new Promise<MakeHumanReadable<Return>>(resolve => {
      const cleanup = materialization.on(value => {
        resolve(value as MakeHumanReadable<Return>);
        cleanup();
      }, true);
    }) as Promise<MakeHumanReadable<Return>>;
  }

  // For savvy users that want to subscribe directly to diffs.
  // onDifference();

  destroy() {
    void this.#materialization?.then(v => v.destroy());
  }
}

export function makeComparator<
  Keys extends ReadonlyArray<keyof T>,
  T extends object,
>(sortKeys: Keys, direction: 'asc' | 'desc'): (l: T, r: T) => number {
  const qualifiedColumns = selectorsToQualifiedColumns(
    sortKeys as unknown as string[],
  );
  const comparator = (l: T, r: T) => {
    let comp = 0;
    for (const qualifiedColumn of qualifiedColumns) {
      comp = compareEntityFields(
        getValueFromEntity(l as Record<string, unknown>, qualifiedColumn),
        getValueFromEntity(r as Record<string, unknown>, qualifiedColumn),
      );
      if (comp !== 0) {
        return comp;
      }
    }

    return comp;
  };

  return direction === 'asc' ? comparator : (l, r) => comparator(r, l);
}

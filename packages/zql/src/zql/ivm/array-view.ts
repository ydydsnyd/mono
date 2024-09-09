import {
  assert,
  assertNotUndefined,
  assertObject,
  unreachable,
} from 'shared/src/asserts.js';
import {Immutable} from 'shared/src/immutable.js';
import {must} from 'shared/src/must.js';
import {assertOrderingIncludesPK} from '../builder/builder.js';
import {Change} from './change.js';
import {Comparator, Row, Value} from './data.js';
import {Input, Output} from './operator.js';
import {Schema} from './schema.js';

/**
 * Called when the view changes. The received data should be considered
 * immutable. Caller must not modify it. Passed data is valid until next
 * time listener is called.
 */
export type Listener = (entries: Immutable<View>) => void;

export type Format = ['single' | 'multiple', {[key: string]: Format}];

/**
 * Implements a materialized view of the output of an operator.
 *
 * It might seem more efficient to use an immutable b-tree for the
 * materialization, but it's not so clear. Inserts in the middle are
 * asymptotically slower in an array, but can often be done with zero
 * allocations, where changes to the b-tree will often require several allocs.
 *
 * Also the plain array view is more convenient for consumers since you can dump
 * it into console to see what it is, rather than having to iterate it.
 */
export class ArrayView implements Output {
  readonly #input: Input;
  readonly #root: Entry;
  readonly #listeners = new Set<Listener>();
  readonly #schema: Schema;
  readonly #format: Format;

  onDestroy: (() => void) | undefined;

  #hydrated = false;
  #dirty = false;

  constructor(input: Input, format: Format) {
    this.#input = input;
    this.#schema = input.getSchema();
    this.#input.setOutput(this);
    this.#format = format;
    this.#root = {'': format[0] === 'single' ? undefined : []};
    assertOrderingIncludesPK(this.#schema.sort, this.#schema.primaryKey);
  }

  get data() {
    return this.#root[''];
  }

  addListener(listener: Listener) {
    assert(!this.#listeners.has(listener), 'Listener already registered');
    this.#listeners.add(listener);
    if (this.#hydrated) {
      listener(this.data as View);
    }

    return () => {
      this.#listeners.delete(listener);
    };
  }

  #fireListeners() {
    for (const listener of this.#listeners) {
      listener(this.data as View);
    }
  }

  destroy() {
    this.#input.destroy();
    this.onDestroy?.();
  }

  hydrate() {
    if (this.#hydrated) {
      throw new Error("Can't hydrate twice");
    }
    this.#hydrated = true;
    for (const node of this.#input.fetch({})) {
      this.#dirty = true;
      applyChange(
        this.#root,
        {type: 'add', node},
        this.#schema,
        '',
        this.#format,
      );
    }
    this.flush();
  }

  push(change: Change): void {
    this.#dirty = true;
    applyChange(this.#root, change, this.#schema, '', this.#format);
  }

  flush() {
    if (!this.#dirty) {
      return;
    }
    this.#dirty = false;
    this.#fireListeners();
  }
}

export type View = EntryList | Entry;
export type EntryList = Entry[];
export type Entry = {[key: string]: Value | View};

function applyChange(
  parentEntry: Entry,
  change: Change,
  schema: Schema,
  relationship: string,
  format: Format,
) {
  assertNotUndefined(relationship);

  if (schema.isHidden) {
    switch (change.type) {
      case 'add':
      case 'remove': {
        for (const [relationship, children] of Object.entries(
          change.node.relationships,
        )) {
          const childSchema = must(schema.relationships?.[relationship]);
          for (const node of children) {
            applyChange(
              parentEntry,
              {type: change.type, node},
              childSchema,
              relationship,
              format,
            );
          }
        }
        return;
      }
      case 'child': {
        const relationship = change.child.relationshipName;
        const childSchema = must(schema.relationships?.[relationship]);
        applyChange(
          parentEntry,
          change.child.change,
          childSchema,
          relationship,
          format,
        );
        return;
      }
      default:
        unreachable(change);
    }
  }

  const [formatKind, childFormats] = format;
  if (change.type === 'add') {
    const newEntry: Entry = {
      ...change.node.row,
    };
    if (formatKind === 'single') {
      assert(
        typeof parentEntry[relationship] === 'undefined',
        'single output already exists',
      );
      parentEntry[relationship] = newEntry;
    } else {
      const view = parentEntry[relationship];
      assert(Array.isArray(view));
      const {pos, found} = binarySearch(view, newEntry, schema.compareRows);
      assert(!found, 'node already exists');
      view.splice(pos, 0, newEntry);
    }

    for (const [relationship, children] of Object.entries(
      change.node.relationships,
    )) {
      // TODO: Is there a flag to make TypeScript complain that dictionary access might be undefined?
      const childSchema = must(schema.relationships?.[relationship]);
      const childFormat = must(childFormats[relationship]);
      const newView =
        childFormat[0] === 'single' ? undefined : ([] as EntryList);
      newEntry[relationship] = newView;
      for (const node of children) {
        applyChange(
          newEntry,
          {type: 'add', node},
          childSchema,
          relationship,
          childFormat,
        );
      }
    }
  } else if (change.type === 'remove') {
    if (formatKind === 'single') {
      assert(!Array.isArray(parentEntry[relationship]));
      parentEntry[relationship] = undefined;
    } else {
      assert(Array.isArray(parentEntry[relationship]));
      const view = parentEntry[relationship];
      const {pos, found} = binarySearch(
        view,
        change.node.row,
        schema.compareRows,
      );
      assert(found, 'node does not exist');
      view.splice(pos, 1);
    }
  } else {
    change.type satisfies 'child';
    let existing: Entry;
    if (formatKind === 'single') {
      assertObject(parentEntry[relationship]);
      existing = parentEntry[relationship];
    } else {
      assert(Array.isArray(parentEntry[relationship]));
      const list = parentEntry[relationship];
      const {pos, found} = binarySearch(list, change.row, schema.compareRows);
      assert(found, 'node does not exist');
      existing = list[pos];
    }

    const childSchema = must(
      schema.relationships?.[change.child.relationshipName],
    );
    applyChange(
      existing,
      change.child.change,
      childSchema,
      change.child.relationshipName,
      format,
    );
  }
}

function binarySearch(view: EntryList, target: Entry, comparator: Comparator) {
  let low = 0;
  let high = view.length - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    const comparison = comparator(view[mid] as Row, target as Row);
    if (comparison < 0) {
      low = mid + 1;
    } else if (comparison > 0) {
      high = mid - 1;
    } else {
      return {pos: mid, found: true};
    }
  }
  return {pos: low, found: false};
}

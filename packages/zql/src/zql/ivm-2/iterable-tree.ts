import type {Entity} from './types.js';

/**
 * An `Entry` may have any number of user-defined properties.
 * To ensure we do not collide with user-defined properties,
 * we use symbols to denote the properties we use.
 *
 * The `entity` symbol is used to denote the entity in the entry.
 * The `event` symbol is used to denote the event that occurred on the entity.
 */
export const event = Symbol();
export const entity = Symbol();

export type Event = Add | Remove | NoOp;
export const ADD = 1;
export const REMOVE = -1;
export const NOP = 0;

export type Add = typeof ADD;
export type Remove = typeof REMOVE;
export type NoOp = typeof NOP;

/**
 * Please see: https://www.notion.so/replicache/NestedIterable-5123f11b877e41b7bc9f00486d491d8b?pm=c
 */
export type Entry<Type = Entity> = {
  [entity]: Type;
  [event]: Event;
  [children: string]: Iterable<Entry>;
};
export type IterableTree<T> = Iterable<Entry<T>>;

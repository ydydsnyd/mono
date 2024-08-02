import type {PipelineEntity} from '../ivm/types.js';

export const event = Symbol();
export const node = Symbol();
export type Event = Add | Remove | NoOp;
export const ADD = 1;
export const REMOVE = -1;
export const NO_OP = 0;

export type Add = typeof ADD;
export type Remove = typeof REMOVE;
export type NoOp = typeof NO_OP;
export type Entry<Type = PipelineEntity> = {
  [node]: Type;
  [event]: Event;
  [children: string]: Iterable<Entry>;
};
export type IterableTree<T> = Iterable<Entry<T>>;

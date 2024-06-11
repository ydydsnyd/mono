import {ConcurrentModificationException} from './error.js';
import type {INode, ITree} from './types.js';

export class TreeIterator<T> implements IterableIterator<T> {
  readonly #tree;
  readonly ancestors;
  readonly #treeVersion;
  readonly #primed;
  readonly #reversed;
  #first = true;
  cursor;

  constructor(
    tree: ITree<T>,
    reversed: boolean,
    primed: boolean = true,
    ancestors: INode<T>[] = [],
    cursor?: INode<T> | undefined,
  ) {
    this.#tree = tree;
    this.ancestors = ancestors;
    this.cursor = cursor;
    this.#treeVersion = tree.version;
    this.#primed = primed;
    this.#reversed = reversed;
  }

  get data() {
    return this.cursor !== undefined ? this.cursor.value : undefined;
  }

  [Symbol.iterator](): IterableIterator<T> {
    // Return a new copy of this iterator so we don't exhaust the iterator
    // when other people want to iterate it.
    return new TreeIterator(
      this.#tree,
      this.#reversed,
      this.#primed,
      [...this.ancestors],
      this.cursor,
    );
  }

  next(): IteratorResult<T> {
    if (this.#tree.version !== this.#treeVersion) {
      throw new ConcurrentModificationException(
        `Tree modified during iteration which is not allowed.`,
      );
    }

    // So we can respect JS behavior for iterators. Where `next` must be called to move to the first element
    // and an iterator should not already be on the first element.
    if (this.#primed && this.#first) {
      this.#first = false;
      return {
        done: this.cursor === undefined ? true : false,
        value: this.cursor !== undefined ? this.cursor.value : undefined,
      } as IteratorResult<T>;
    }

    if (this.cursor === undefined) {
      const {root} = this.#tree;
      if (root !== undefined) {
        if (this.#reversed) {
          this.#maxNode(root);
        } else {
          this.#minNode(root);
        }
      }
    } else {
      if (this.cursor.right === undefined) {
        let save: INode<T> | undefined;
        do {
          save = this.cursor;
          if (this.ancestors.length) {
            this.cursor = this.ancestors.pop()!;
          } else {
            this.cursor = undefined;
            break;
          }
        } while (this.cursor.right === save);
      } else {
        this.ancestors.push(this.cursor);
        this.#minNode(this.cursor.right);
      }
    }
    return {
      done: this.cursor === undefined,
      value: this.cursor !== undefined ? this.cursor.value : undefined,
    } as IteratorResult<T>;
  }

  #minNode(start: INode<T>) {
    while (start.left !== undefined) {
      this.ancestors.push(start);
      start = start.left;
    }
    this.cursor = start;
  }

  #maxNode(start: INode<T>) {
    while (start.right !== undefined) {
      this.ancestors.push(start);
      start = start.right;
    }
    this.cursor = start;
  }
}

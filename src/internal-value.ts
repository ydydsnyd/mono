import {deepClone, JSONValue, ReadonlyJSONValue} from './json';
import * as json from './json';
import {skipInternalValueAsserts} from './config';

// By using declare we tell the type system that there is a unique symbol.
// However, there is no such symbol but the type system does not care.
declare const internalValueTag: unique symbol;

// We use a class with a private field to prevent plain objects to look like
// InternalValueObjects.
declare class InternalValueObject {
  private [internalValueTag]: true;
}

/**
 * Opaque type representing a JSON value that we store inside Replicache. These
 * must never escape.
 *
 * Example usages of these values are:
 * - B+Tree values
 * - Mutation args
 * - Cookies
 */
export type InternalValue =
  | InternalValueObject
  | string
  | number
  | boolean
  | null;

// We keep track of the internal values for debugging purposes.
const internalValues = new WeakSet();

function isObject(v: unknown): v is object {
  return typeof v === 'object' && v !== null;
}

export function assertInternalValue(v: unknown): asserts v is InternalValue {
  if (skipInternalValueAsserts) {
    return;
  }
  if (isObject(v) && !internalValues.has(v)) {
    throw new Error('Internal value expected');
  }
}

export const enum ToInternalValueReason {
  Test,
  CookieFromResponse,
  ApplyPatch,
  WriteTransactionPut,
  WriteTransactionMutateArgs,
}

export function toInternalValue(
  v: ReadonlyJSONValue,
  _reason: ToInternalValueReason,
): InternalValue {
  if (skipInternalValueAsserts) {
    return deepClone(v) as unknown as InternalValue;
  }

  if (isObject(v)) {
    if (internalValues.has(v)) {
      throw new Error('Unexpected internal value');
    }
    const clone = deepClone(v);
    internalValues.add(clone as object);
    return clone as unknown as InternalValue;
  }
  return v as unknown as InternalValue;
}

export const enum FromInternalValueReason {
  Test,
  WatchDiff,
  WriteTransactionScan,
  WriteTransactionGet,
  WriteTransactionMutateArgs,
}

export function fromInternalValue(
  v: InternalValue,
  _reason: FromInternalValueReason,
): JSONValue {
  if (isObject(v)) {
    assertInternalValue(v);
    return deepClone(v as unknown as ReadonlyJSONValue);
  }
  return v as unknown as JSONValue;
}

export function deepEqual(a: InternalValue, b: InternalValue): boolean {
  return json.deepEqual(safeCast(a), safeCast(b));
}

export const enum CastReason {
  EvaluateJSONPointer,
  CookieToRequest,
  CompareCookies,
  ReadTransactionScan,
  ReadTransactionGet,
}

function safeCast(v: InternalValue): ReadonlyJSONValue {
  assertInternalValue(v);
  return v as unknown as ReadonlyJSONValue;
}

export function safeCastToJSON(
  v: InternalValue,
  _castReason: CastReason,
): ReadonlyJSONValue {
  return safeCast(v);
}

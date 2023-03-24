import type {ReadonlyJSONValue} from 'shared/json.js';
import type {Cookie, FrozenCookie} from './cookies.js';
import type {FrozenJSONValue} from './frozen-json.js';
import {deepFreeze as deepFreeze2} from './frozen-json.js';
export * from 'shared/json.js';
export * from './frozen-json.js';

/**
 * Recursively freezes the passed in value (mutates it) and returns it.
 *
 * This is controlled by `skipFreeze` which is true in release mode.
 */
export function deepFreeze(v: undefined): undefined;
export function deepFreeze(v: Cookie): FrozenCookie;
export function deepFreeze(v: ReadonlyJSONValue): FrozenJSONValue;
export function deepFreeze(
  v: ReadonlyJSONValue | undefined,
): FrozenJSONValue | undefined;
export function deepFreeze(
  v: ReadonlyJSONValue | undefined,
): FrozenJSONValue | undefined {
  return deepFreeze2(v);
}

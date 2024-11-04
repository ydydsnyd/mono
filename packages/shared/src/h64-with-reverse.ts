import {reverseString} from './reverse-string.js';
import {type H64} from './xxhash.js';

/**
 * xxhash only computes 64-bit values. Run it on the forward and reverse string
 * to get better collision resistance.
 */
export function h64WithReverse(str: string, h64: H64): string {
  const forward = h64(str);
  const backward = h64(reverseString(str));
  const full = (forward << 64n) + backward;
  return full.toString(36);
}

import {reverseString} from './reverse-string.js';
import {h32} from './xxhash.js';

/**
 * xxhash only computes 64-bit values. Run it on the forward and reverse string
 * to get better collision resistance.
 */
export function h64WithReverse(str: string): string {
  return h32(str).toString(36) + h32(reverseString(str)).toString(36);
}

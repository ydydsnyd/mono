import type {Entry} from '../../multiset.js';
import type {Version} from '../../types.js';
import type {DifferenceStream} from '../difference-stream.js';
import {UnaryOperator} from './unary-operator.js';

/**
 * Allows someone to observe all data flowing through a spot
 * in a pipeline. Forwards the data with no changes made to it.
 */
export class DebugOperator<T extends object> extends UnaryOperator<T, T> {
  constructor(
    input: DifferenceStream<T>,
    output: DifferenceStream<T>,
    onMessage: (v: Version, data: Entry<T>) => void,
  ) {
    const inner = (
      version: Version,
      data: Entry<T>,
      out: DifferenceStream<T>,
    ) => {
      onMessage(version, data);
      out.newDifference(version, data);
    };
    super(input, output, inner);
  }
}

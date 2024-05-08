import type {Entry} from '../../multiset.js';
import type {Version} from '../../types.js';
import type {DifferenceStream} from '../difference-stream.js';
import {LinearUnaryOperator} from './linear-unary-operator.js';

export class MapOperator<
  I extends object,
  O extends object,
> extends LinearUnaryOperator<I, O> {
  constructor(
    input: DifferenceStream<I>,
    output: DifferenceStream<O>,
    f: (input: I) => O,
  ) {
    const inner = (
      version: Version,
      entry: Entry<I>,
      out: DifferenceStream<O>,
    ) => out.newDifference(version, [f(entry[0]), entry[1]] as const);
    super(input, output, inner);
  }
}

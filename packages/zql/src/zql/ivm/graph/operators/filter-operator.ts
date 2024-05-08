import type {DifferenceStream} from '../difference-stream.js';
import {LinearUnaryOperator} from './linear-unary-operator.js';

export class FilterOperator<I extends object> extends LinearUnaryOperator<
  I,
  I
> {
  constructor(
    input: DifferenceStream<I>,
    output: DifferenceStream<I>,
    f: (input: I) => boolean,
  ) {
    super(input, output, (version, data, out) => {
      const keep = f(data[0]);
      if (keep) {
        out.newDifference(version, data);
      }
    });
  }
}

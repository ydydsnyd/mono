import {type Attributes, type Tracer, context} from '@opentelemetry/api';

export function span<T>(tracer: Tracer, name: string, cb: () => T): T {
  return tracer.startActiveSpan(name, span => {
    try {
      return cb();
    } finally {
      span.end();
    }
  });
}

export function manualSpan(
  tracer: Tracer,
  name: string,
  durationMs: number,
  attributes?: Attributes,
): void {
  const startTime = Date.now() * 1000000 - durationMs * 1000000;
  const span = tracer.startSpan(name, {startTime}, context.active());
  if (attributes) {
    span.setAttributes(attributes);
  }
  span.end(startTime + durationMs * 1000000);
}

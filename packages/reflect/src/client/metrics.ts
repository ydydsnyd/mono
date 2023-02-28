import type {LogContext} from '@rocicorp/logger';
import type {MaybePromise} from 'replicache';

export enum MetricName {
  TimeToConnectMs = 'time_to_connect_ms',
  LastConnectError = 'last_connect_error',
}

// camelToSnake is used to convert a protocol ErrorKind into a suitable
// metric name, eg AuthInvalidated => auth_invalidated. It converts
// both PascalCase and camelCase to snake_case.
export function camelToSnake(s: string): string {
  return s
    .split(/\.?(?=[A-Z])/)
    .join('_')
    .toLowerCase();
}

// This value is used to indicate that the client's last connection attempt
// failed. We don't make this -1 becuase we want to stack this never connected
// state in a graph on top of actual connection times, so it should be greater
// than any other value.
export const DID_NOT_CONNECT_VALUE = 100 * 1000;

export const REPORT_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

export const REPORT_DESTINATION_PATH = '/api/metrics/v0/report';

export type Fetch = (
  url: string,
  init: {method: string; body: string; keepalive: boolean},
) => Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  text: () => Promise<string>;
}>;

export type Clock = {
  getTime: () => number;
  setInterval: (callback: () => void, ms: number) => number;
  clearInterval: (id: number) => void;
};

export type MetricManagerOptions = {
  destinationOrigin: URL;
  fetch: Fetch;
  clock: Clock;
  lc: MaybePromise<LogContext>;
  tags?: Map<string, string> | undefined;
};

/**
 * MetricsManager tracks the set of metrics in use and periodically flushes to
 * a reporter.
 */
export class MetricManager {
  constructor(opts: MetricManagerOptions) {
    this._destinationOrigin = opts.destinationOrigin;
    this._fetch = opts.fetch;
    this._clock = opts.clock;
    this._lc = opts.lc;
    this._tags = opts.tags ?? new Map();

    this._timerID = this._clock.setInterval(() => {
      void this.flush();
    }, REPORT_INTERVAL_MS);
  }

  private _destinationOrigin: URL;
  private _fetch: Fetch;
  private _clock: Clock;
  private _lc: MaybePromise<LogContext>;
  private _tags: Map<string, string>;
  private _timerID: number | null;
  private _metrics: Metric[] | null = [];

  add<T extends Metric>(metric: T) {
    if (this._metrics === null) {
      throw new Error("Can't add metrics after close");
    }
    if (this._metrics.find(m => m.name === metric.name)) {
      throw new Error(`Cannot create duplicate metric: ${metric.name}`);
    }
    this._metrics.push(metric);
    return metric;
  }

  // Flushes all metrics to an array of time series (plural), one Series
  // per metric.
  // TODO: Since this is not needed by anything but the unit test it should
  // become private and the test should test via the actual interface
  // (timers).
  async flush() {
    if (this._metrics === null) {
      throw new Error('Unexpected flush after close');
    }
    const allSeries: Series[] = [];
    for (const metric of this._metrics) {
      const series = metric.flush(this._clock.getTime());
      if (series !== undefined) {
        if (this._tags.size > 0) {
          series.tags = [...this._tags.entries()].map(([k, v]) => `${k}:${v}`);
        }
        allSeries.push(series);
      }
    }
    const lc = await this._lc;
    if (allSeries.length === 0) {
      lc.debug?.('No metrics to report');
      return;
    }
    try {
      await this._report(allSeries);
    } catch (e) {
      lc.error?.(`Error reporting metrics: ${e}`);
    }
  }

  stopReporting() {
    if (this._timerID !== null) {
      this._clock.clearInterval(this._timerID);
      this._timerID = null;
    }
    this._metrics = null;
  }

  private async _report(allSeries: Series[]) {
    const body = JSON.stringify({series: allSeries});
    const url = new URL(REPORT_DESTINATION_PATH, this._destinationOrigin);
    const res = await this._fetch(url.toString(), {
      method: 'POST',
      body,
      keepalive: true,
    });
    if (!res.ok) {
      const maybeBody = await res.text();
      throw new Error(
        `unexpected response: ${res.status} ${res.statusText} body: ${maybeBody}`,
      );
    }
  }
}

// These two types are infuenced by Datadog's API's needs. We could change what
// we use internally if necessary, but we'd just have to convert to/from before
// sending to DD. So for convenience we go with their format.

/** Series is a time series of points for a single metric. */
export type Series = {
  metric: string;
  points: Point[];
  tags?: string[];
};
/**
 * A point is a second-resolution timestamp and a set of values for that
 * timestamp. A point represents exactly one second in time and the values
 * are those recorded for that second. The first element of this array
 * is the timestamp and the second element is an array of values.
 */
export type Point = [number, number[]];

function makePoint(ts: number, value: number): Point {
  return [ts, [value]];
}

interface Metric {
  readonly name: string;
  flush(now: number): Series | undefined;
}

/**
 * Gauge is a metric type that represents a single value that can go up and
 * down. It's typically used to track discrete values or counts eg the number
 * of active users, number of connections, cpu load, etc. A gauge retains
 * its value when flushed.
 *
 * We use a Gauge to sample at the client. If we are interested in tracking
 * a metric value *per client*, the client can note the latest value in
 * a Gauge metric. The metric is periodically reported via Reporter. On the
 * server, we graph the value of the metric rolled up over the periodic
 * reporting period, that is, counted over a span of time equal to the
 * reporting period. The result is ~one point per client per reporting
 * period.
 */
export class Gauge {
  private _value: number | undefined = undefined;

  constructor(readonly name: string) {}

  public set(value: number) {
    this._value = value;
  }

  public flush(now: number): Series {
    // Gauge reports the timestamp at flush time, not at the point the value was
    // recorded.
    const points =
      this._value === undefined ? [] : [makePoint(now, this._value)];
    return {metric: this.name, points};
  }
}

export function gaugeValue(series: Series):
  | {
      metric: string;
      tsSec: number; // We use ms everywhere for consistency but Datadog uses seconds :(
      value: number;
    }
  | undefined {
  if (series.points.length === 0) {
    return undefined;
  }
  return {
    metric: series.metric,
    tsSec: series.points[0][0],
    value: series.points[0][1][0],
  };
}

/**
 * State is a metric type that represents a specific state that the system is
 * in, for example the state of a connection which may be 'open' or 'closed'.
 * The state is given a name at construction time (eg 'connection') and
 * then can be set to a specific state (eg 'open'). The name is prepended to
 * the set state (eg, 'connection_open') and a value of 1 is reported.
 * Unset/cleared states are not reported.
 *
 * Example:
 *   const s = new State('connection');
 *   s.set('open');
 *   s.flush(); // returns {metric: 'connection_open', points: [[now(), [1]]]}
 */
export class State {
  private readonly _clearOnFlush: boolean;
  private _current: string | undefined = undefined;

  constructor(readonly name: string, clearOnFlush = false) {
    console.info('constructing', name);
    this._clearOnFlush = clearOnFlush;
  }

  public set(state: string) {
    this._current = state;
  }

  public clear() {
    this._current = undefined;
  }

  public flush(now: number): Series | undefined {
    if (this._current === undefined) {
      return undefined;
    }
    const gauge = new Gauge([this.name, this._current].join('_'));
    gauge.set(1);
    const series = gauge.flush(now);
    if (this._clearOnFlush) {
      this.clear();
    }
    return series;
  }
}

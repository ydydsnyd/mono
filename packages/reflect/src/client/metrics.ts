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

const REPORT_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

type MetricsReporter = (metrics: Series[]) => MaybePromise<void>;

/**
 * Metrics keeps track of the set of metrics in use and flushes them
 * to a format suitable for reporting.
 */
export class MetricManager {
  constructor(
    private readonly _reporter: MetricsReporter,
    private readonly _lc: Promise<LogContext> | undefined,
  ) {
    setInterval(() => {
      void this.flush();
    }, REPORT_INTERVAL_MS);
  }

  private _metrics: Map<string, Flushable> = new Map();

  // gauge returns a gauge with the given name. If a gauge with that name
  // already exists, it is returned.
  public gauge(name: string) {
    const m = new Gauge(name);
    this._stashMetric(name, m);
    return m;
  }

  // state returns a state with the given name. If a state with that name
  // already exists, it is returned.
  public state(name: string, clearOnFlush = false) {
    const m = new State(name, clearOnFlush);
    this._stashMetric(name, m);
    return m;
  }

  // Flushes all metrics to an array of time series (plural), one Series
  // per metric.
  public async flush() {
    const allSeries: Series[] = [];
    for (const metric of this._metrics.values()) {
      const series = metric.flush();
      if (series !== undefined) {
        allSeries.push(series);
      }
    }
    const lc = await this._lc;
    if (allSeries.length === 0) {
      lc?.debug?.('No metrics to report');
      return;
    }
    try {
      await this._reporter(allSeries);
    } catch (e) {
      lc?.error?.(`Error reporting metrics: ${e}`);
    }
  }

  private _stashMetric(name: string, metric: Flushable) {
    if (this._metrics.has(name)) {
      throw new Error(`Cannot create duplicate metric: ${name}`);
    }
    this._metrics.set(name, metric);
    return metric;
  }
}

// These two types are infuenced by Datadog's API's needs. We could change what
// we use internally if necessary, but we'd just have to convert to/from before
// sending to DD. So for convenience we go with their format.

/** Series is a time series of points for a single metric. */
export type Series = {
  metric: string; // We call this 'name' bc 'metric' is overloaded in code.
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

type Flushable = {
  flush(): Series | undefined;
};

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
  private readonly _name: string;
  private _value: number | undefined = undefined;

  constructor(name: string) {
    this._name = name;
  }

  public set(value: number) {
    this._value = value;
  }

  public flush(): Series {
    // Gauge reports the timestamp at flush time, not at the point the value was
    // recorded.
    const points =
      this._value === undefined ? [] : [makePoint(t(), this._value)];
    return {metric: this._name, points};
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

function t() {
  return Math.round(Date.now() / 1000);
}

/**
 * State is a metric type that represents a specific state that the system is
 * in, for example the state of a connection which may be 'open' or 'closed'.
 * The state is given a name/prefix at construction time (eg 'connection') and
 * then can be set to a specific state (eg 'open'). The prefix is prepended to
 * the set state (eg, 'connection_open') and a value of 1 is reported.
 * Unset/cleared states are not reported.
 *
 * Example:
 *   const s = new State('connection');
 *   s.set('open');
 *   s.flush(); // returns {metric: 'connection_open', points: [[now(), [1]]]}
 */
export class State {
  private readonly _prefix: string;
  private readonly _clearOnFlush: boolean;
  private _current: string | undefined = undefined;

  constructor(prefix: string, clearOnFlush = false) {
    this._prefix = prefix;
    this._clearOnFlush = clearOnFlush;
  }

  public set(state: string) {
    this._current = state;
  }

  public clear() {
    this._current = undefined;
  }

  public flush(): Series | undefined {
    if (this._current === undefined) {
      return undefined;
    }
    const gauge = new Gauge([this._prefix, this._current].join('_'));
    gauge.set(1);
    const series = gauge.flush();
    if (this._clearOnFlush) {
      this.clear();
    }
    return series;
  }
}

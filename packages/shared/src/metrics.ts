import type {LogContext} from '@rocicorp/logger';

type MetricsReporter = (metrics: Series[]) => void | Promise<void>;

export type Metrics = {
  readonly [name: string]: Flushable;
};

export type MetricManagerOptions = {
  reportIntervalMs: number;
  host: string;
  source: string;
  reporter: MetricsReporter;
  lc: Promise<LogContext>;
};

/**
 * MetricManager keeps track of the set of metrics in use and flushes them
 * to a format suitable for reporting.
 */
export class MetricManager {
  private _metrics: Flushable[];
  private _reportIntervalMs: number;
  private _host: string;
  private _reporter: MetricsReporter;
  private _lc: Promise<LogContext>;
  private _timerID: number | null;

  constructor(metrics: Metrics, opts: MetricManagerOptions) {
    this._metrics = [...Object.values(metrics)];
    this._reportIntervalMs = opts.reportIntervalMs;
    this._host = opts.host;
    this._reporter = opts.reporter;
    this._lc = opts.lc;

    this.tags.push(`source:${opts.source}`);

    this._timerID = Number(
      setInterval(() => {
        void this.flush();
      }, this._reportIntervalMs),
    );
  }

  /**
   * Tags to include in all metrics.
   */
  readonly tags: string[] = [];

  // Flushes all metrics to an array of time series (plural), one Series
  // per metric.
  public async flush() {
    const lc = await this._lc;
    if (this._timerID === null) {
      lc.error?.('MetricManager.flush() called but already stopped');
      return;
    }
    const allSeries: Series[] = [];
    for (const metric of this._metrics) {
      const series = metric.flush();
      if (series !== undefined) {
        allSeries.push({
          ...series,
          host: this._host,
          tags: this.tags,
        });
      }
    }
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

  public stop() {
    if (this._timerID === null) {
      void this._lc.then(l =>
        l.error?.('MetricManager.stop() called but already stopped'),
      );
      return;
    }
    clearInterval(this._timerID);
    this._timerID = null;
  }
}

// These two types are influenced by Datadog's API's needs. We could change what
// we use internally if necessary, but we'd just have to convert to/from before
// sending to DD. So for convenience we go with their format.

/** Series is a time series of points for a single metric. */
export type Series = {
  host: string;
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
  flush(): Pick<Series, 'metric' | 'points'> | undefined;
};

/**
 * Gauge is a metric type that represents a single value that can go up and
 * down. It's typically used to track discrete values or counts eg the number
 * of active users, number of connections, cpu load, etc. A gauge retains
 * its value when flushed.
 */
export class Gauge implements Flushable {
  private readonly _name: string;
  private _value: number | undefined;

  constructor(name: string, initialValue?: number) {
    this._name = name;
    this._value = initialValue;
  }

  public set(value: number) {
    this._value = value;
  }

  public flush() {
    // Gauge reports the timestamp at flush time, not at the point the value was
    // recorded.
    const points =
      this._value === undefined ? [] : [makePoint(t(), this._value)];
    return {metric: this._name, points};
  }
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
export class State implements Flushable {
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

  public flush() {
    if (this._current === undefined) {
      return undefined;
    }
    const gauge = new Gauge([this._prefix, this._current].join('_'), 1);
    const series = gauge.flush();
    if (this._clearOnFlush) {
      this.clear();
    }
    return series;
  }
}

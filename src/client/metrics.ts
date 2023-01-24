/**
 * Metrics is passed in from the app and used to record stats in
 * the client, e.g., the time to connect. A simple implementation
 * that reports to datadog can be found at
 * https://github.com/rocicorp/datadog-util.
 */
export interface Metrics {
  gauge(name: string): Gauge;
}

export interface Gauge {
  set(value: number): void;
}

/** NopMetrics are used if no Metrics are passed in the options. */
export class NopMetrics implements Metrics {
  gauge(_name: string): Gauge {
    return nopGauge;
  }
}

export const nopGauge: Gauge = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  set(_value: number): void {},
};

export enum Metric {
  TimeToConnect = 'time_to_connect_ms',
}

// This value is used to indicate that the client's last connection attempt
// failed. We don't make this -1 becuase we want to stack this never connected
// state in a graph on top of actual connection times, so it should be greater
// than any other value.
export const DID_NOT_CONNECT_VALUE = 100 * 1000;

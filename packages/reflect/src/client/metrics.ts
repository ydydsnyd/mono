import {Gauge, State} from 'shared/metrics.js';

export enum MetricName {
  TimeToConnectMs = 'time_to_connect_ms',
  LastConnectError = 'last_connect_error',
}

// This value is used to indicate that the client's last connection attempt
// failed. We don't make this -1 because we want to stack this never connected
// state in a graph on top of actual connection times, so it should be greater
// than any other value.
export const DID_NOT_CONNECT_VALUE = 100 * 1000;

export const REPORT_INTERVAL_MS = 5_000;

// We use Gauges to sample at the client. If we are interested in tracking
// a metric value *per client*, the client can note the latest value in
// a Gauge metric. The metric is periodically reported via Reporter. On the
// server, we graph the value of the metric rolled up over the periodic
// reporting period, that is, counted over a span of time equal to the
// reporting period. The result is ~one point per client per reporting
// period.
export const ClientMetrics = {
  // timeToConnectMs measures the time from the call to connect() to receiving
  // the 'connected' ws message. We record the DID_NOT_CONNECT_VALUE if the previous
  // connection attempt failed for any reason.
  //
  // We set the gauge using _connectingStart as follows:
  // - _connectingStart is undefined if we are disconnected or connected; it is
  //   defined only in the Connecting state, as a number representing the timestamp
  //   at which we started connecting.
  // - _connectingStart is set to the current time when connect() is called.
  // - When we receive the 'connected' message we record the time to connect and
  //   set _connectingStart to undefined.
  // - If disconnect() is called with a defined _connectingStart then we record
  //   DID_NOT_CONNECT_VALUE and set _connectingStart to undefined.
  //
  // TODO It's clear after playing with the connection code we should encapsulate
  // the ConnectionState along with its state transitions and possibly behavior.
  // In that world the metric gauge(s) and bookkeeping like _connectingStart would
  // be encapsulated with the ConnectionState. This will probably happen as part
  // of https://github.com/rocicorp/reflect-server/issues/255.
  //
  timeToConnectMs: new Gauge(MetricName.TimeToConnectMs, DID_NOT_CONNECT_VALUE),

  // lastConnectError records the last error that occurred when connecting,
  // if any. It is cleared when connecting successfully or when reported, so this
  // state only gets reported if there was a failure during the reporting period and
  // we are still not connected.
  lastConnectError: new State(
    MetricName.LastConnectError,
    true, // clearOnFlush
  ),
};

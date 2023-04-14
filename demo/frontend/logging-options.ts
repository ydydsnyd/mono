import {consoleLogSink, LogLevel, LogSink} from '@rocicorp/logger';
import {createClientDatadogLogSink} from '@rocicorp/reflect';

const DATADOG_SERVICE_LABEL = 'reflect.net';
const errorConsoleLogSink: LogSink = {
  log(level: LogLevel, ...args: unknown[]) {
    if (level === 'error') {
      consoleLogSink.log(level, ...args);
    }
  },
  flush(): Promise<void> {
    return consoleLogSink.flush?.() || Promise.resolve();
  },
};

function getLogSinks() {
  // empty for next SSR
  if (typeof window === 'undefined') {
    return [];
  }
  if (process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN === undefined) {
    console.warn(
      'Not enabling datadog logging because process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN is undefined',
    );
    return [errorConsoleLogSink];
  }
  return [
    createClientDatadogLogSink({
      clientToken: process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN,
      service: DATADOG_SERVICE_LABEL,
    }),
    errorConsoleLogSink,
  ];
}

export const loggingOptions: {logLevel: LogLevel; logSinks: LogSink[]} = {
  logLevel: 'info',
  logSinks: getLogSinks(),
};

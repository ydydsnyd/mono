import {
  consoleLogSink,
  createClientDatadogLogSink,
  LogLevel,
  LogSink,
} from '@rocicorp/reflect';

const DATADOG_SERVICE_LABEL = 'reflect.net';

export const logLevel = 'info';
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
export const logSinks: LogSink[] =
  process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN !== undefined
    ? [
        createClientDatadogLogSink({
          clientToken: process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN,
          service: DATADOG_SERVICE_LABEL,
        }),
        errorConsoleLogSink,
      ]
    : [errorConsoleLogSink];

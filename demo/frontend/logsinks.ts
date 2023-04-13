import {consoleLogSink, createClientDatadogLogSink} from '@rocicorp/reflect';

const DATADOG_SERVICE_LABEL = 'reflect.net';

export const logSinks =
  process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN !== undefined
    ? [
        createClientDatadogLogSink({
          clientToken: process.env.NEXT_PUBLIC_DATADOG_LOGS_CLIENT_TOKEN,
          service: DATADOG_SERVICE_LABEL,
        }),
        consoleLogSink,
      ]
    : undefined;

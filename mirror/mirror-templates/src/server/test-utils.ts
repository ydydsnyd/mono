import {Context, LogContext, LogLevel, LogSink} from '@rocicorp/logger';

export class TestLogSink implements LogSink {
  messages: [LogLevel, Context | undefined, unknown[]][] = [];

  log(level: LogLevel, context: Context | undefined, ...args: unknown[]): void {
    this.messages.push([level, context, args]);
  }
}

export class SilentLogSink implements LogSink {
  log(_l: LogLevel, _c: Context | undefined, ..._args: unknown[]): void {
    return;
  }
}

export function createSilentLogContext() {
  return new LogContext('error', undefined, new SilentLogSink());
}

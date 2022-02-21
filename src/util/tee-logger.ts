import type { Logger, LogLevel } from "./logger.js";

/**
 * A [[Logger]] implementation that logs to multiple loggers.
 */
export class TeeLogger implements Logger {
  private readonly _loggers: readonly Logger[];

  constructor(loggers: readonly Logger[]) {
    this._loggers = loggers;
  }

  log(level: LogLevel, ...args: unknown[]): void {
    for (const logger of this._loggers) {
      logger.log(level, ...args);
    }
  }

  async flush(): Promise<void> {
    await Promise.all(this._loggers.map((logger) => logger.flush?.()));
  }
}

import type { Log, LogLevel } from "./logger.js";

/**
 * A [[Log]] implementation that logs to multiple loggers.
 */
export class TeeLog implements Log {
  private readonly _logs: readonly Log[];

  constructor(loggers: readonly Log[]) {
    this._logs = loggers;
  }

  log(level: LogLevel, ...args: unknown[]): void {
    for (const logger of this._logs) {
      logger.log(level, ...args);
    }
  }
}

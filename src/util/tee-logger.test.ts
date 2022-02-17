import { test, expect } from "@jest/globals";
import type { Logger, LogLevel } from "./logger.js";
import { TeeLogger } from "./tee-logger.js";

class TestLogger implements Logger {
  messages: [LogLevel, ...unknown[]][] = [];

  log(level: LogLevel, ...args: unknown[]): void {
    this.messages.push([level, ...args]);
  }
}

test("tee logger", () => {
  const l1 = new TestLogger();
  const l2 = new TestLogger();
  const tl = new TeeLogger([l1, l2]);

  expect(l1.messages).toEqual([]);
  expect(l2.messages).toEqual([]);

  tl.log("info", 1, 2);
  expect(l1.messages).toEqual([["info", 1, 2]]);
  expect(l2.messages).toEqual([["info", 1, 2]]);

  tl.log("debug", 3);
  expect(l1.messages).toEqual([
    ["info", 1, 2],
    ["debug", 3],
  ]);
  expect(l2.messages).toEqual([
    ["info", 1, 2],
    ["debug", 3],
  ]);

  tl.log("error", 4, 5, 6);
  expect(l1.messages).toEqual([
    ["info", 1, 2],
    ["debug", 3],
    ["error", 4, 5, 6],
  ]);
  expect(l2.messages).toEqual([
    ["info", 1, 2],
    ["debug", 3],
    ["error", 4, 5, 6],
  ]);
});

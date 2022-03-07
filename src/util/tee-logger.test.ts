import { test, expect } from "@jest/globals";
import type { LogLevel } from "./logger.js";
import { TeeLogger } from "./tee-logger.js";
import { TestLogger } from "./test-utils.js";

class TestLoggerWithFlush extends TestLogger {
  messages: [LogLevel, ...unknown[]][] = [];
  flushCount = 0;

  log(level: LogLevel, ...args: unknown[]): void {
    this.messages.push([level, ...args]);
  }

  flush(): Promise<void> {
    this.flushCount++;
    return Promise.resolve();
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

test("tee logger flush", async () => {
  const l1 = new TestLoggerWithFlush();
  const l2 = new TestLogger();
  const l3 = new TestLoggerWithFlush();
  const tl = new TeeLogger([l1, l2, l3]);

  expect(l1.flushCount).toEqual(0);
  expect(l3.flushCount).toEqual(0);
  await tl.flush();
  expect(l1.flushCount).toEqual(1);
  expect(l3.flushCount).toEqual(1);
});

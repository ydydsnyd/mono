import { jest, afterEach, test, expect } from "@jest/globals";
import { ConsoleLogger, LogContext, type LogLevel } from "./logger.js";

const mockConsoleMethod = (level: LogLevel) =>
  jest.spyOn(console, level).mockImplementation(() => void 0);

afterEach(() => {
  jest.restoreAllMocks();
});

test("level to method", () => {
  const mockDebug = mockConsoleMethod("debug");
  const mockInfo = mockConsoleMethod("info");
  const mockError = mockConsoleMethod("error");

  {
    const l = new ConsoleLogger("error");
    expect(l.debug).toBeUndefined();
    expect(l.info).toBeUndefined();
    expect(l.error).toBeInstanceOf(Function);

    l.debug?.("aaa");
    l.info?.("bbb");
    l.error?.("ccc");
    expect(mockDebug).toHaveBeenCalledTimes(0);
    expect(mockInfo).toHaveBeenCalledTimes(0);
    expect(mockError).toHaveBeenCalledWith("ccc");
  }

  {
    jest.resetAllMocks();
    const l = new ConsoleLogger("info");
    expect(l.debug).toBeUndefined();
    expect(l.info).toBeInstanceOf(Function);
    expect(l.error).toBeInstanceOf(Function);

    l.debug?.("ddd");
    l.info?.("eee");
    l.error?.("fff");
    expect(mockDebug).toHaveBeenCalledTimes(0);
    expect(mockInfo).toHaveBeenCalledWith("eee");
    expect(mockError).toHaveBeenCalledWith("fff");
  }

  {
    jest.resetAllMocks();
    const l = new ConsoleLogger("debug");
    expect(l.debug).toBeInstanceOf(Function);
    expect(l.info).toBeInstanceOf(Function);
    expect(l.error).toBeInstanceOf(Function);

    l.debug?.("ggg");
    l.info?.("hhh");
    l.error?.("iii");
    expect(mockDebug).toHaveBeenCalledWith("ggg");
    expect(mockInfo).toHaveBeenCalledWith("hhh");
    expect(mockError).toHaveBeenCalledWith("iii");
  }
});

test("LogContext formatting", () => {
  const mockDebug = mockConsoleMethod("debug");

  const lc = new LogContext("debug");
  lc.debug?.("aaa");
  expect(mockDebug).toHaveBeenLastCalledWith("", "aaa");

  const lc2 = new LogContext("debug", "bbb");
  lc2.debug?.("ccc");
  expect(mockDebug).toHaveBeenLastCalledWith("bbb", "ccc");

  const lc3 = lc2.addContext("ddd");
  lc3.debug?.("eee");
  expect(mockDebug).toHaveBeenLastCalledWith("bbb ddd", "eee");

  const lc4 = lc2.addContext("fff", "ggg");
  lc4.debug?.("hhh");
  expect(mockDebug).toHaveBeenLastCalledWith("bbb fff=ggg", "hhh");
});

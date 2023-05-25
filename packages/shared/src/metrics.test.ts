import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';

import {LogContext} from '@rocicorp/logger';
import {SinonFakeTimers, useFakeTimers, mock} from 'sinon';
import {Gauge, MetricManager, Point, Series, State} from './metrics.js';

const DID_NOT_CONNECT_VALUE = 100 * 1000;

const REPORT_INTERVAL_MS = 5_000;

let clock: SinonFakeTimers;
beforeEach(() => {
  clock = useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

describe('Gauge', () => {
  type Case = {
    name: string;
    value: number | undefined;
    time: number;
    expected: Point[];
  };

  const cases: Case[] = [
    {
      name: 'undefined',
      value: undefined,
      time: 100 * 1000,
      expected: [],
    },
    {
      name: 'val-10',
      value: 10,
      time: 200 * 1000,
      expected: [[200, [10]]],
    },
    {
      name: 'val-20',
      value: 20,
      time: 500 * 1000,
      expected: [[500, [20]]],
    },
  ];

  const g = new Gauge('mygauge');

  for (const c of cases) {
    test(c.name, () => {
      clock.setSystemTime(c.time);
      if (c.value !== undefined) {
        g.set(c.value);
      }
      const series = g.flush();
      expect(series).toEqual({metric: 'mygauge', points: c.expected});
    });
  }
});

describe('State', () => {
  type Case = {
    name: string;
    state: string | undefined;
    time: number;
    expected: ReturnType<State['flush']>;
  };

  const cases: Case[] = [
    {
      name: 'undefined',
      state: undefined,
      time: 100 * 1000,
      expected: undefined,
    },
    {
      name: 'state-foo',
      state: 'foo',
      time: 200 * 1000,
      expected: {
        metric: 'mygauge_foo',
        points: [[200, [1]]],
      },
    },
    {
      name: 'state-bar',
      state: 'bar',
      time: 500 * 1000,
      expected: {
        metric: 'mygauge_bar',
        points: [[500, [1]]],
      },
    },
  ];

  for (const c of cases) {
    test(c.name, () => {
      clock.setSystemTime(c.time);

      const m1 = new State('mygauge');
      if (c.state !== undefined) {
        m1.set(c.state);
      }
      const s1 = m1.flush();
      expect(s1).toEqual(c.expected);
      const s2 = m1.flush();
      expect(s2).toEqual(c.expected);

      const m2 = new State('mygauge', true);
      if (c.state !== undefined) {
        m2.set(c.state);
      }
      const s3 = m2.flush();
      expect(s3).toEqual(c.expected);
      const s4 = m2.flush();
      expect(s4).toEqual(undefined);
    });
  }
});

test('MetricManager', async () => {
  const reporter = mock().returns(Promise.resolve());
  const m = {
    timeToConnectMs: new Gauge('time_to_connect_ms', DID_NOT_CONNECT_VALUE),
    lastConnectError: new State('last_connect_error', true),
  };
  const mm = new MetricManager(m, {
    reportIntervalMs: REPORT_INTERVAL_MS,
    host: 'test-host',
    source: 'test-source',
    reporter,
    lc: Promise.resolve(new LogContext()),
  });

  type Case = {
    name: string;
    timeToConnect?: number | undefined;
    lastConnectError?: string | undefined;
    extraTags?: string[];
    expected: Series[];
  };

  const cases: Case[] = [
    {
      name: 'no metrics',
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[REPORT_INTERVAL_MS / 1000, [DID_NOT_CONNECT_VALUE]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
      ],
    },
    {
      name: 'ttc-1',
      timeToConnect: 2,
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[(REPORT_INTERVAL_MS * 2) / 1000, [2]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
      ],
    },
    {
      name: 'ttc-2',
      timeToConnect: 1,
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[(REPORT_INTERVAL_MS * 3) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
      ],
    },
    {
      name: 'lce-bonk',
      lastConnectError: 'bonk',
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[(REPORT_INTERVAL_MS * 4) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
        {
          metric: 'last_connect_error_bonk',
          points: [[(REPORT_INTERVAL_MS * 4) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
      ],
    },
    {
      name: 'lce-nuts',
      lastConnectError: 'nuts',
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[(REPORT_INTERVAL_MS * 5) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
        {
          metric: 'last_connect_error_nuts',
          points: [[(REPORT_INTERVAL_MS * 5) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
      ],
    },
    {
      name: 'lce-unchanged',
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[(REPORT_INTERVAL_MS * 6) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source'],
        },
      ],
    },
    {
      name: 'extra-tags',
      extraTags: ['foo:bar', 'hotdog'],
      expected: [
        {
          metric: 'time_to_connect_ms',
          points: [[(REPORT_INTERVAL_MS * 7) / 1000, [1]]],
          host: 'test-host',
          tags: ['source:test-source', 'foo:bar', 'hotdog'],
        },
      ],
    },
  ];

  for (const c of cases) {
    if (c.timeToConnect !== undefined) {
      m.timeToConnectMs.set(c.timeToConnect);
    }
    if (c.lastConnectError !== undefined) {
      m.lastConnectError.set(c.lastConnectError);
    }
    if (c.extraTags !== undefined) {
      mm.tags.push(...c.extraTags);
    }

    await clock.tickAsync(REPORT_INTERVAL_MS);

    expect(reporter.calledOnceWithExactly(c.expected)).toBe(true);

    mm.tags.length = 1;

    reporter.resetHistory();
  }
});

test('MetricManager.stop', async () => {
  const reporter = mock().returns(Promise.resolve());
  const m = {
    timeToConnectMs: new Gauge('time_to_connect_ms', DID_NOT_CONNECT_VALUE),
    lastConnectError: new State('last_connect_error', true),
  };
  const mm = new MetricManager(m, {
    reportIntervalMs: REPORT_INTERVAL_MS,
    host: 'test-host',
    source: 'test-source',
    reporter,
    lc: Promise.resolve(new LogContext()),
  });

  m.timeToConnectMs.set(100);
  m.lastConnectError.set('bonk');

  await clock.tickAsync(REPORT_INTERVAL_MS);

  expect(
    reporter.calledOnceWithExactly([
      {
        metric: 'time_to_connect_ms',
        points: [[REPORT_INTERVAL_MS / 1000, [100]]],
        host: 'test-host',
        tags: ['source:test-source'],
      },
      {
        metric: 'last_connect_error_bonk',
        points: [[REPORT_INTERVAL_MS / 1000, [1]]],
        host: 'test-host',
        tags: ['source:test-source'],
      },
    ]),
  ).toBe(true);

  reporter.resetHistory();
  mm.stop();

  await clock.tickAsync(REPORT_INTERVAL_MS * 2);
  expect(reporter.notCalled);
});

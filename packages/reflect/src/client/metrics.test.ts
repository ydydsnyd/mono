import {MetricManager, Gauge, State, gaugeValue} from './metrics.js';
import sinon from 'sinon';
import {consoleLogSink, LogContext} from '@rocicorp/logger';
import {expect} from '@esm-bundle/chai';
import {sleep} from '../util/sleep.js';

// TODO: Change this to use basic asserts, not BDD syntax throughout.
// Chai supports both: https://devhints.io/chai

const destinationOrigin = new URL('https://test.com/');

test('Manager throws on duplicate metric', () => {
  const m = new MetricManager({
    destinationOrigin,
    fetch: sinon.fake(),
    clock: {
      getTime: sinon.fake.returns(0),
      setInterval: sinon.fake.returns(0),
      clearInterval: sinon.fake(),
    },
    lc: new LogContext('debug', consoleLogSink),
  });
  m.add(new Gauge('name'));

  expect(() => m.add(new Gauge('name'))).throws(
    'Cannot create duplicate metric: name',
  );
});

test('Manager reports', async () => {
  type Case = {
    name: string;
    hasData: boolean;
    reportResponse: null | {status: number} | {error: string};
    expectedLog: string | null;
  };
  const cases: Case[] = [
    {
      name: 'normal',
      hasData: true,
      reportResponse: {status: 200},
      expectedLog: null,
    },
    {
      name: 'no data',
      hasData: false,
      reportResponse: null,
      expectedLog: null,
    },
    {
      name: 'httpError',
      hasData: true,
      reportResponse: {status: 500},
      expectedLog:
        'Error reporting metrics: Error: unexpected response: 500  body: done',
    },
    {
      name: 'networkError',
      hasData: true,
      reportResponse: {error: 'network error'},
      expectedLog: 'Error reporting metrics: Error: network error',
    },
  ];

  for (const c of cases) {
    const logFake = sinon.fake();
    const logSink = {log: logFake};
    const lc = new LogContext('debug', logSink);

    const fetchFake = sinon.spy((_method: unknown, _init: unknown) => {
      if (c.reportResponse === null) {
        throw new Error('unexpected call to fetchFake');
      }
      if ('status' in c.reportResponse) {
        return Promise.resolve(
          new Response('done', {status: c.reportResponse.status}),
        );
      }
      return Promise.reject(new Error(c.reportResponse.error));
    });

    const clock = {
      getTime: sinon.fake.returns(10),
      setInterval: sinon.fake.returns(0),
      clearInterval: sinon.fake(),
    };

    const mm = new MetricManager({
      destinationOrigin,
      fetch: fetchFake,
      clock,
      lc,
    });

    if (c.hasData) {
      mm.add(new Gauge('name')).set(1);
    }

    sinon.assert.calledOnceWithMatch(
      clock.setInterval,
      sinon.match.func,
      sinon.match.number,
    );

    // Call the setInterval callback.
    await clock.setInterval.firstCall.args[0]();

    // Need to wait for promise from fetch to resolve.
    await sleep(1);

    if (c.reportResponse === null) {
      sinon.assert.notCalled(fetchFake);
      sinon.assert.calledOnceWithExactly(
        logFake,
        'debug',
        'No metrics to report',
      );
      continue;
    }

    sinon.assert.calledOnceWithExactly(
      fetchFake,
      'https://test.com/api/metrics/v0/report',
      {
        method: 'POST',
        body: '{"series":[{"metric":"name","points":[[10,[1]]]}]}',
        keepalive: true,
      },
    );

    if ('status' in c.reportResponse) {
      if (c.reportResponse.status === 200) {
        sinon.assert.notCalled(logFake);
      } else {
        sinon.assert.calledOnceWithExactly(
          logFake,
          'error',
          'Error reporting metrics: Error: unexpected response: 500  body: done',
        );
      }
    } else {
      sinon.assert.calledOnceWithExactly(
        logFake,
        'error',
        'Error reporting metrics: Error: network error',
      );
    }
  }
});

test('Manager stops reporting when stop is called', async () => {
  const fetchFake = sinon.fake.resolves(new Response('ok', {status: 200}));

  const clock = {
    getTime: sinon.fake.returns(10),
    setInterval: sinon.fake.returns(42),
    clearInterval: sinon.fake(),
  };

  const mm = new MetricManager({
    destinationOrigin,
    fetch: fetchFake,
    clock,
    lc: new LogContext('debug', consoleLogSink),
  });

  mm.add(new Gauge('name')).set(1);

  // setInterval gets called at startup.
  sinon.assert.calledOnceWithMatch(
    clock.setInterval,
    sinon.match.func,
    sinon.match.number,
  );

  // When the interval fires, fetch is called.
  clock.setInterval.getCall(0).args[0]();
  await sleep(100);
  sinon.assert.calledOnce(fetchFake);

  // When stop is called, the interval should be cleared.
  mm.stopReporting();
  sinon.assert.calledOnceWithExactly(clock.clearInterval, 42);
});

test('Metrics.endtoend', async () => {
  const fetchFake = sinon.fake.resolves(new Response('ok', {status: 200}));

  let currentTime = 42;

  const clock = {
    getTime: sinon.fake(() => currentTime),
    setInterval: sinon.fake.returns(42),
    clearInterval: sinon.fake(),
  };

  const mm = new MetricManager({
    destinationOrigin,
    fetch: fetchFake,
    clock,
    lc: new LogContext('debug', consoleLogSink),
  });

  // No gauges.
  await mm.flush();
  await sleep(10);
  sinon.assert.notCalled(fetchFake);

  // One gauge.
  const g = mm.add(new Gauge('name'));
  g.set(3);
  await mm.flush();

  sinon.assert.calledOnceWithExactly(
    fetchFake,
    'https://test.com/api/metrics/v0/report',
    {
      method: 'POST',
      body: JSON.stringify({
        series: [
          {
            metric: 'name',
            points: [[42, [3]]],
          },
        ],
      }),
      keepalive: true,
    },
  );

  // Change the system time and add a new gauge.
  // Both gauges should have the current time.
  currentTime = 424;
  fetchFake.resetHistory();

  const g2 = mm.add(new Gauge('other-name'));
  g2.set(4);

  await mm.flush();
  sinon.assert.calledOnceWithExactly(
    fetchFake,
    'https://test.com/api/metrics/v0/report',
    {
      method: 'POST',
      body: JSON.stringify({
        series: [
          {
            metric: 'name',
            points: [[424, [3]]],
          },
          {
            metric: 'other-name',
            points: [[424, [4]]],
          },
        ],
      }),
      keepalive: true,
    },
  );

  // Change the system time and change old gauge.
  currentTime = 4242;
  fetchFake.resetHistory();

  g.set(5);
  await mm.flush();
  sinon.assert.calledOnceWithExactly(
    fetchFake,
    'https://test.com/api/metrics/v0/report',
    {
      method: 'POST',
      body: JSON.stringify({
        series: [
          {
            metric: 'name',
            points: [[4242, [5]]],
          },
          {
            metric: 'other-name',
            points: [[4242, [4]]],
          },
        ],
      }),
      keepalive: true,
    },
  );

  // Ensure states are included.
  const s1 = mm.add(new State('s1'));
  s1.set('1');
  const s2 = mm.add(new State('s2'));
  s2.set('2');
  mm.add(new State('s3'));

  fetchFake.resetHistory();

  await mm.flush();
  sinon.assert.calledOnceWithExactly(
    fetchFake,
    'https://test.com/api/metrics/v0/report',
    {
      method: 'POST',
      body: JSON.stringify({
        series: [
          {
            metric: 'name',
            points: [[4242, [5]]],
          },
          {
            metric: 'other-name',
            points: [[4242, [4]]],
          },
          {
            metric: 's1_1',
            points: [[4242, [1]]],
          },
          {
            metric: 's2_2',
            points: [[4242, [1]]],
          },
        ],
      }),
      keepalive: true,
    },
  );
});

test('Metrics.flush inserts tags', async () => {
  const fetchFake = sinon.fake.resolves(new Response('ok', {status: 200}));

  const clock = {
    getTime: sinon.fake.returns(42),
    setInterval: sinon.fake.returns(42),
    clearInterval: sinon.fake(),
  };

  const mm = new MetricManager({
    destinationOrigin,
    fetch: fetchFake,
    clock,
    lc: new LogContext('debug', consoleLogSink),
    tags: new Map([['tag', 'value']]),
  });

  const g1 = mm.add(new Gauge('name1'));
  g1.set(1);
  const g2 = mm.add(new Gauge('name2'));
  g2.set(2);

  await mm.flush();
  // TODO: We should insert tags by default for ie host, env, whatever we can.
  sinon.assert.calledOnceWithExactly(
    fetchFake,
    'https://test.com/api/metrics/v0/report',
    {
      method: 'POST',
      body: JSON.stringify({
        series: [
          {
            metric: 'name1',
            points: [[42, [1]]],
            tags: ['tag:value'],
          },
          {
            metric: 'name2',
            points: [[42, [2]]],
            tags: ['tag:value'],
          },
        ],
      }),
      keepalive: true,
    },
  );
});

test('Gauge', () => {
  const g = new Gauge('name');
  expect(g.flush(42)).deep.eq({
    metric: 'name',
    points: [],
  });

  g.set(3);
  expect(g.flush(42)).deep.eq({
    metric: 'name',
    points: [[42, [3]]],
  });

  g.set(4);
  expect(g.flush(42)).deep.eq({
    metric: 'name',
    points: [[42, [4]]],
  });

  // Ensure it doesn't alias its internal state.
  const hopefullyNotAnAlias = g.flush(42);
  hopefullyNotAnAlias.points[0][0] = 5;
  hopefullyNotAnAlias.points[0][1] = [5];
  expect(g.flush(42)).deep.eq({
    metric: 'name',
    points: [[42, [4]]],
  });
});

test('gaugeValue', () => {
  const g = new Gauge('name');
  expect(gaugeValue(g.flush(42))).undefined;

  g.set(3);
  expect(gaugeValue(g.flush(42))).deep.eq({
    metric: 'name',
    tsSec: 42,
    value: 3,
  });
});

test('State', () => {
  const s = new State('foo');
  expect(s.flush(42)).undefined;

  // Clearing an empty state should not add anything.
  s.clear();
  expect(s.flush(42)).undefined;

  // Set a state.
  s.set('1');
  expect(s.flush(42)).deep.eq({
    metric: 'foo_1',
    points: [[42, [1]]],
  });
  // Ensure it is not cleared on flush.
  expect(s.flush(42)).deep.eq({
    metric: 'foo_1',
    points: [[42, [1]]],
  });

  // Set it again at a later time.
  s.set('1');
  expect(s.flush(43)).deep.eq({
    metric: 'foo_1',
    points: [[43, [1]]],
  });

  // Set a different state.
  s.set('2');
  expect(s.flush(43)).deep.eq({
    metric: 'foo_2',
    points: [[43, [1]]],
  });

  // Clear it.
  s.clear();
  expect(s.flush(43)).undefined;

  // Test clearOnFlush.
  const s2 = new State('foo', true /* clearOnFlush */);
  s2.set('1');
  expect(s2.flush(43)).deep.eq({
    metric: 'foo_1',
    points: [[43, [1]]],
  });
  expect(s2.flush(43)).undefined;
});

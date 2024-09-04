// This test file is loaded by worker.test.ts

import {assert} from 'shared/src/asserts.js';
import {deepEqual} from 'shared/src/json.js';
import sinon from 'sinon';
import {MockSocket, zeroForTest} from './test-utils.js';
import {version} from './version.js';
import {Resolver, resolver} from '@rocicorp/resolver';

onmessage = async (e: MessageEvent) => {
  const {userID} = e.data;
  try {
    sinon.replace(
      globalThis,
      'WebSocket',
      MockSocket as unknown as typeof WebSocket,
    );
    await testBasics(userID);
    postMessage(undefined);
  } catch (ex) {
    postMessage(String(ex));
  } finally {
    sinon.restore();
  }
};

async function testBasics(userID: string) {
  console.log('testBasics', WebSocket, version);

  type E = {
    id: string;
    value: number;
  };

  const r = zeroForTest({
    userID,
    schemas: {
      e: {
        tableName: 'e',
        columns: {
          id: {type: 'string'},
          value: {type: 'number'},
        },
        primaryKey: ['id'],
      },
    },
  });

  const q = r.query.e.select('id', 'value').limit(1);
  const view = q.materialize();
  view.hydrate();
  const log: (readonly E[])[] = [];
  const removeListener = view.addListener(rows => {
    log.push([...rows]);
  });

  await r.triggerConnected();

  await r.mutate.e.set({id: 'foo', value: 1});
  assert(
    deepEqual(log, [[], [{id: 'foo', value: 1}]]),
    `log has foo value 1 ${JSON.stringify(log)}`,
  );

  await r.mutate.e.set({id: 'foo', value: 2});
  assert(
    deepEqual(log, [[], [{id: 'foo', value: 1}], [{id: 'foo', value: 2}]]),
    `log has foo value 1 and foo value 2 ${JSON.stringify(log)}`,
  );

  removeListener();

  await r.mutate.e.set({id: 'foo', value: 3});
  assert(
    deepEqual(log, [[], [{id: 'foo', value: 1}], [{id: 'foo', value: 2}]]),
    `log unchanged after listener removed ${JSON.stringify(log)}`,
  );

  const view2 = q.materialize();
  view2.hydrate();
  const data: Resolver<E[]> = resolver();
  view2.addListener(rows => {
    data.resolve([...rows]);
  });
  assert(
    deepEqual(await data.promise, [{id: 'foo', value: 3}]),
    `data has foo value 3 ${JSON.stringify(data)}`,
  );
}

import {runAll} from './store-test-util.js';
import {expect} from '@esm-bundle/chai';
import {clearAllMemStoresForTesting, MemStore} from './mem-store.js';
import {resolver} from '@rocicorp/resolver';

runAll('MemStore', () => new MemStore('test'));

setup(() => {
  clearAllMemStoresForTesting();
});

test('Creating multiple with same name shares data', async () => {
  const store = new MemStore('test');
  await store.withWrite(async wt => {
    await wt.put('foo', 'bar');
    await wt.commit();
  });

  const store2 = new MemStore('test');
  await store2.withRead(async rt => {
    expect(await rt.get('foo')).equal('bar');
  });
});

test('Creating multiple with different name gets unique data', async () => {
  const store = new MemStore('test');
  await store.withWrite(async wt => {
    await wt.put('foo', 'bar');
    await wt.commit();
  });

  const store2 = new MemStore('test2');
  await store2.withRead(async rt => {
    expect(await rt.get('foo')).equal(undefined);
  });
});

test('Multiple reads at the same time', async () => {
  const store = new MemStore('test');
  await store.withWrite(async wt => {
    await wt.put('foo', 'bar');
    await wt.commit();
  });

  const {promise, resolve} = resolver();

  let readCounter = 0;
  const p1 = store.withRead(async rt => {
    expect(await rt.get('foo')).equal('bar');
    await promise;
    expect(readCounter).equal(1);
    readCounter++;
  });
  const p2 = store.withRead(async rt => {
    expect(readCounter).equal(0);
    readCounter++;
    expect(await rt.get('foo')).equal('bar');
    resolve();
  });
  expect(readCounter).equal(0);
  await Promise.all([p1, p2]);
  expect(readCounter).equal(2);
});

test('Single write at a time', async () => {
  const store = new MemStore('test');
  await store.withWrite(async wt => {
    await wt.put('foo', 'bar');
    await wt.commit();
  });

  const {promise: promise1, resolve: resolve1} = resolver();
  const {promise: promise2, resolve: resolve2} = resolver();

  let writeCounter = 0;
  const p1 = store.withWrite(async wt => {
    await promise1;
    expect(await wt.get('foo')).equal('bar');
    expect(writeCounter).equal(0);
    writeCounter++;
  });
  const p2 = store.withWrite(async wt => {
    await promise2;
    expect(writeCounter).equal(1);
    expect(await wt.get('foo')).equal('bar');
    writeCounter++;
  });

  // Doesn't matter that resolve2 is called first, because p2 is waiting on p1.
  resolve2();
  resolve1();

  await Promise.all([p1, p2]);
  expect(writeCounter).equal(2);
});

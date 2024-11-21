import {resolver} from '@rocicorp/resolver';
import {createSilentLogContext} from '../../../shared/src/logging-test-utils.js';
import {sleep} from '../../../shared/src/sleep.js';
import {describe, expect, test} from 'vitest';
import {ServiceRunner} from './runner.js';
import type {Service} from './service.js';

describe('services/runner', () => {
  class TestService implements Service {
    readonly id: string;
    resolver = resolver<void>();
    valid = true;

    constructor(id: string) {
      this.id = id;
    }

    run(): Promise<void> {
      return this.resolver.promise;
    }

    // eslint-disable-next-line require-await
    async stop(): Promise<void> {
      this.resolver.resolve();
    }
  }

  const runner = new ServiceRunner<TestService>(
    createSilentLogContext(),
    (id: string) => new TestService(id),
    (s: TestService) => s.valid,
  );

  test('caching', async () => {
    const [s1, s2, s3] = await Promise.all(
      ['foo', 'bar', 'foo'].map(id => runner.getService(id, undefined)),
    );

    expect(s1).toBe(s3);
    expect(s1).not.toBe(s2);
  });

  test('stopped', async () => {
    const s1 = await runner.getService('foo', undefined);
    s1.resolver.resolve();

    await sleep(1);
    const s2 = await runner.getService('foo', undefined);
    expect(s1).not.toBe(s2);
  });

  test('fails', async () => {
    const s1 = await runner.getService('foo', undefined);
    s1.resolver.reject('foo');

    await sleep(1);
    const s2 = await runner.getService('foo', undefined);
    expect(s1).not.toBe(s2);
  });

  test('validity', async () => {
    const s1 = await runner.getService('foo', undefined);
    s1.valid = false;

    const s2 = await runner.getService('foo', undefined);
    expect(s1).not.toBe(s2);
  });
});

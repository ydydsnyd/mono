import {expect} from '@esm-bundle/chai';
import * as valita from 'shared/valita.js';
import {compareCookies, Cookie, cookieSchema} from './cookies.js';

test('compareCookies', () => {
  const t = (a: Cookie, b: Cookie, expected: number) => {
    expect(compareCookies(a, b)).to.equal(expected, `${a} < ${b}`);
    expect(compareCookies(b, a)).to.equal(-expected);
  };

  t(null, null, 0);
  t(null, 'a', -1);
  t('a', 'b', -1);
  t('a', 'a', 0);
  t('a', 1, 1);
  t(2, 1, 1);
  t(3, 0, 3);
  t(1, 1, 0);
  t(1, 'a', -1);
  t('a', {order: 'a'}, 0);
  t({order: 'a'}, {order: 'b'}, -1);
  t({order: 'a'}, {order: 'a'}, 0);
  t({order: 'a'}, 1, 1);
});

test('cookieSchema', () => {
  const ok = (v: unknown) => {
    expect(valita.test(v, cookieSchema)).to.deep.equal({
      ok: true,
      value: v,
    });
  };

  const notOK = (v: unknown, error: string) => {
    expect(valita.test(v, cookieSchema)).to.deep.equal({
      ok: false,
      error,
    });
  };

  ok(null);
  ok('a');
  ok(1);
  ok({order: 'a'});
  ok({order: 1});
  ok({order: 'a', a: 1});

  notOK(true, 'Expected object. Got true');
  notOK([], 'Expected object. Got array');
  notOK({}, 'Missing property order');
  notOK({order: true}, 'Expected string or number at order. Got true');
  notOK({order: null}, 'Expected string or number at order. Got null');
  notOK({order: 1, key: Symbol()}, 'Not a JSON value at key. Got symbol');
});

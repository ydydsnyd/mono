import {expect} from 'chai';
import * as valita from 'shared/src/valita.js';
import {
  Hash,
  STRING_LENGTH,
  emptyHash,
  fakeHash,
  hashRange,
  hashSchema,
  isHash,
  makeNewFakeHashFunction,
  newUUIDHash,
  parse,
  splitHashRanges,
} from './hash.js';

const emptyUUID = '00000000-0000-4000-8000-000000000000';

function hashes() {
  return [
    newUUIDHash(),
    fakeHash(''),
    fakeHash('a'),
    // old native hashes
    '0123456789abcdefghijklmnopqrstuv',
    // old uuid hashes
    '23691827-e581-46b9-afb7-f764938b66c1',
    emptyUUID,
  ];
}

test('isHash', () => {
  expect(isHash(emptyHash)).to.be.true;

  for (const h of hashes()) {
    expect(isHash(h)).to.be.true;
    expect(isHash(h + 'a')).to.be.true;
    expect(isHash(String(h).slice(0, -1))).to.be.true;
  }
});

test('parse', () => {
  for (const h of hashes()) {
    expect(parse(String(emptyHash))).to.equal(emptyHash);
    expect(parse(String(h))).to.equal(h);
    expect(parse(h + 'a')).to.equal(h + 'a');
    expect(parse(String(h).slice(0, -1))).to.equal(String(h).slice(0, -1));
  }
});

test.skip('type checking only', () => {
  {
    const h = newUUIDHash();
    // Should not be an error
    const s: string = h;
    console.log(s);

    // @ts-expect-error Should be an error
    const h2: Hash = 'abc';
    console.log(h2);
  }
});

test('makeNewFakeHashFunction', () => {
  {
    const f = makeNewFakeHashFunction('a');
    expect(f()).to.equal('a0000000000040008000000000000000' + '000000000000');
    expect(f()).to.equal('a0000000000040008000000000000000' + '000000000001');
    expect(f()).to.equal('a0000000000040008000000000000000' + '000000000002');
  }
  {
    const f = makeNewFakeHashFunction('b');
    expect(f()).to.equal('b0000000000040008000000000000000' + '000000000000');
    expect(f()).to.equal('b0000000000040008000000000000000' + '000000000001');
    expect(f()).to.equal('b0000000000040008000000000000000' + '000000000002');
  }
  {
    const f = makeNewFakeHashFunction();
    expect(f()).to.equal('face0000000040008000000000000000' + '000000000000');
    expect(f()).to.equal('face0000000040008000000000000000' + '000000000001');
    expect(f()).to.equal('face0000000040008000000000000000' + '000000000002');
  }
  {
    const f = makeNewFakeHashFunction('');
    expect(f()).to.equal('00000000000040008000000000000000' + '000000000000');
    expect(f()).to.equal('00000000000040008000000000000000' + '000000000001');
    expect(f()).to.equal('00000000000040008000000000000000' + '000000000002');
  }
  expect(() => makeNewFakeHashFunction('x')).to.throw();
  expect(() => makeNewFakeHashFunction('000000000')).to.throw();
});

test('fakeHash', () => {
  expect(String(fakeHash('aa')).length).to.equal(STRING_LENGTH);
  expect(fakeHash('aa')).to.equal(fakeHash('aa'));
  expect(fakeHash('aa')).to.equal(
    'face0000000040008000000000000000' + '0000000000aa',
  );
});

test('valita schema', () => {
  for (const h of hashes()) {
    expect(valita.is(h, hashSchema)).to.be.true;
  }
  expect(valita.is('xyz', hashSchema)).to.be.false;

  for (const h of hashes()) {
    expect(() => valita.assert(h, hashSchema)).not.to.throw();
  }
  expect(() => valita.assert('xyz', hashSchema)).to.throw(TypeError);
  expect(() => valita.assert('xyz', hashSchema)).to.throw(
    'Invalid hash. Got "xyz"',
  );
});

test('hashRanges', () => {
  const t = (input: string[], expected: [string, string][]) => {
    expect([...splitHashRanges(input.map(fakeHash))]).to.deep.equal(
      expected.map(([a, b]) => [fakeHash(a), fakeHash(b)]),
    );
  };

  t([], []);
  t(['1'], [['1', '1']]);
  t(['1', '2'], [['1', '2']]);
  t(['1', '2', '3'], [['1', '3']]);
  t(
    ['1', '3'],
    [
      ['1', '1'],
      ['3', '3'],
    ],
  );
  t(
    ['1', '3', '4'],
    [
      ['1', '1'],
      ['3', '4'],
    ],
  );
  t(
    ['1', '3', '4', '5'],
    [
      ['1', '1'],
      ['3', '5'],
    ],
  );
  t(
    ['1', '3', '4', '5', '7'],
    [
      ['1', '1'],
      ['3', '5'],
      ['7', '7'],
    ],
  );
  t(
    ['1', '3', '4', '5', '7', '8'],
    [
      ['1', '1'],
      ['3', '5'],
      ['7', '8'],
    ],
  );
  t(
    ['1', '3', '4', '5', '7', '8', '9'],
    [
      ['1', '1'],
      ['3', '5'],
      ['7', '9'],
    ],
  );
  t(
    ['3', '4', '5', '7', '8', '9', '10'],
    [
      ['3', '5'],
      ['7', '10'],
    ],
  );
});

test('hashRange', () => {
  const t = (start: string, end: string, expected: string[]) => {
    expect([...hashRange(fakeHash(start), fakeHash(end))]).to.deep.equal(
      expected.map(fakeHash),
    );
  };

  t('1', '1', ['1']);
  t('1', '2', ['1', '2']);
  t('1', '5', ['1', '2', '3', '4', '5']);
  t('5', '5', ['5']);
  t('500', '505', ['500', '501', '502', '503', '504', '505']);
});

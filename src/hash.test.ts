import {expect} from '@esm-bundle/chai';
import {
  assertNotTempHash,
  emptyHash,
  isHash,
  isTempHash,
  newTempHash,
  parse,
  newUUIDHash,
  isUUIDHash,
  makeNewFakeHashFunction,
  fakeHash,
  STRING_LENGTH,
  makeNewTempHashFunction,
} from './hash';

const emptyUUID = '00000000-0000-4000-8000-000000000000';

function hashes() {
  return [
    emptyUUID,
    newUUIDHash(),
    newTempHash(),
    fakeHash(''),
    fakeHash('a'),

    // Old temp hashes
    't/000000000000000000000000000000',
    't/000000000000000000000000001234',

    // old native hashes
    '0123456789abcdefghijklmnopqrstuv',
  ];
}

test('isHash', () => {
  expect(isHash(emptyHash)).to.be.true;

  for (const h of hashes()) {
    expect(isHash(h)).to.be.true;
    expect(isHash(h + 'a')).to.be.false;
    expect(isHash(String(h).slice(0, -1))).to.be.false;
  }
});

test('parse', () => {
  for (const h of hashes()) {
    expect(parse(String(emptyHash))).to.equal(emptyHash);
    expect(parse(String(h))).to.equal(h);
    expect(() => parse(h + 'a')).to.throw(Error);
    expect(() => parse(String(h).slice(0, -1))).to.throw(Error);
  }
});

test('temp hash', () => {
  const t = newTempHash();
  const c = fakeHash('c');

  expect(String(t).length, 'temp hash length').to.equal(String(c).length);
  expect(isTempHash(t)).true;
  expect(isTempHash(c)).false;

  expect(() => assertNotTempHash(t)).to.throw();

  const f = fakeHash('a');
  const f2 = fakeHash('');
  expect(isTempHash(f)).false;
  expect(isTempHash(f2)).false;

  // Old format
  expect(isTempHash('t/000000000000000000000000000000')).true;
  expect(isTempHash('t/000000000000000000000000001234')).true;

  // Old format
  expect(isTempHash('00000000000000000000000000000000')).false;
  expect(isTempHash('00000000000000000000000000001234')).false;
});

test('makeNewTempHashFunction', () => {
  const f = makeNewTempHashFunction();
  expect(f()).equal('t/0000000000000000000000000000000000');
  expect(f()).equal('t/0000000000000000000000000000000001');
  expect(f()).equal('t/0000000000000000000000000000000002');
  expect(f()).equal('t/0000000000000000000000000000000003');
});

test.skip('type checking only', () => {
  {
    const h = newUUIDHash();
    // @ts-expect-error Should be an error
    const s: string = h;
    console.log(s);

    // @ts-expect-error Should be an error
    const h2: Hash = 'abc';
    console.log(h2);
  }
  {
    const h = newTempHash();
    // @ts-expect-error Should be an error
    const s: string = h;
    console.log(s);

    // @ts-expect-error Should be an error
    const h2: Hash = 'abc';
    console.log(h2);
  }
});

test('uuid hash', () => {
  const h1 = fakeHash('f1');
  const h2 = fakeHash('f2');
  expect(h1).to.not.equal(h2);
  expect(isHash(h1)).to.be.true;
  expect(isHash(h2)).to.be.true;
  assertNotTempHash(h1);
  assertNotTempHash(h2);
  expect(isUUIDHash(h1)).to.be.true;
  expect(isUUIDHash(h2)).to.be.true;
});

test('makeNewFakeHashFunction', () => {
  {
    const f = makeNewFakeHashFunction('a');
    expect(f()).to.equal('a0000000-0000-4000-8000-000000000000');
    expect(f()).to.equal('a0000000-0000-4000-8000-000000000001');
    expect(f()).to.equal('a0000000-0000-4000-8000-000000000002');
  }
  {
    const f = makeNewFakeHashFunction('b');
    expect(f()).to.equal('b0000000-0000-4000-8000-000000000000');
    expect(f()).to.equal('b0000000-0000-4000-8000-000000000001');
    expect(f()).to.equal('b0000000-0000-4000-8000-000000000002');
  }
  {
    const f = makeNewFakeHashFunction();
    expect(f()).to.equal('face0000-0000-4000-8000-000000000000');
    expect(f()).to.equal('face0000-0000-4000-8000-000000000001');
    expect(f()).to.equal('face0000-0000-4000-8000-000000000002');
  }
  {
    const f = makeNewFakeHashFunction('');
    expect(f()).to.equal('00000000-0000-4000-8000-000000000000');
    expect(f()).to.equal('00000000-0000-4000-8000-000000000001');
    expect(f()).to.equal('00000000-0000-4000-8000-000000000002');
  }
  expect(() => makeNewFakeHashFunction('x')).to.throw();
  expect(() => makeNewFakeHashFunction('000000000')).to.throw();
});

test('fakeHash', () => {
  expect(String(fakeHash('aa')).length).to.equal(STRING_LENGTH);
  expect(fakeHash('aa')).to.equal(fakeHash('aa'));
  expect(fakeHash('aa')).to.equal('face0000-0000-4000-8000-0000000000aa');
});

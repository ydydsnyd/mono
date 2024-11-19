import {expect, test} from 'vitest';
import {getLikePredicate} from './like.js';

type Case = {
  pattern: string;
  flags: 'i' | '';
  inputs: [string, boolean][];
};

export const cases: Case[] = [
  {
    pattern: 'foo',
    flags: '',
    inputs: [
      ['foo', true],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', false],
      ['afoo', false],
      ['afoob', false],
    ],
  },
  {
    pattern: 'foo',
    flags: 'i',
    inputs: [
      ['foo', true],
      ['bar', false],
      ['Foo', true],
      ['FOO', true],
      ['fo', false],
      ['fooa', false],
      ['afoo', false],
      ['afoob', false],
    ],
  },
  {
    pattern: 'foo%',
    flags: '',
    inputs: [
      ['foo', true],
      ['foobar', true],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', true],
      ['afoo', false],
      ['afoob', false],
    ],
  },
  {
    pattern: 'foo%',
    flags: 'i',
    inputs: [
      ['foo', true],
      ['foobar', true],
      ['bar', false],
      ['Foo', true],
      ['FOO', true],
      ['fo', false],
      ['fooa', true],
      ['afoo', false],
      ['afoob', false],
      ['foo\nbar', true],
      ['foobar\nbaz', true],
    ],
  },
  {
    pattern: 'foo_',
    flags: '',
    inputs: [
      ['foo', false],
      ['foobar', false],
      ['foob', true],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['afoo', false],
      ['afoob', false],
      ['fooa\nbar', true],
    ],
  },
  {
    pattern: 'foo\\%',
    flags: '',
    inputs: [
      ['foo%', true],
      ['foobar', false],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', false],
      ['afoo', false],
      ['afoob', false],
    ],
  },
  {
    pattern: 'foo\\%',
    flags: 'i',
    inputs: [
      ['foo%', true],
      ['FOO%', true],
      ['foobar', false],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', false],
      ['afoo', false],
      ['afoob', false],
    ],
  },
  {
    pattern: 'foo\\_',
    flags: '',
    inputs: [
      ['foo_', true],
      ['FOO_', false],
      ['foobar', false],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', false],
      ['afoo', false],
      ['afoob', false],
    ],
  },
  {
    pattern: '%foo',
    flags: '',
    inputs: [
      ['foo', true],
      ['foobar', false],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', false],
      ['afoo', true],
      ['afoob', false],
      ['monkey\nfoo', true],
      ['mon\nkeyfoo', true],
    ],
  },
  {
    pattern: '%foo%',
    flags: '',
    inputs: [
      ['foo', true],
      ['foobar', true],
      ['bar', false],
      ['Foo', false],
      ['FOO', false],
      ['fo', false],
      ['fooa', true],
      ['afoo', true],
      ['afoob', true],
      ['mon\nfoo\nkey', true],
      ['m\nonfooke\ny', true],
    ],
  },
  {
    pattern: '%foo\nbar%',
    flags: '',
    inputs: [
      ['foo\nbar', true],
      ['foo\nbar\n', true],
      ['foo\nbar\nbaz', true],
      ['monkey\nfoo\nbar', true],
    ],
  },
];

const more: Case[] = [
  {
    pattern: 'ǆ',
    flags: '',
    inputs: [
      ['ǆ', true],
      ['ǅ', false],
      ['Ǆ', false],
    ],
  },
  {
    pattern: 'ǆ',
    flags: 'i',
    inputs: [
      ['ǆ', true],
      ['ǅ', true],
      ['Ǆ', true],
    ],
  },

  {
    pattern: 'ǅ',
    flags: '',
    inputs: [
      ['ǆ', false],
      ['ǅ', true],
      ['Ǆ', false],
    ],
  },
  {
    pattern: 'ǅ',
    flags: 'i',
    inputs: [
      ['ǆ', true],
      ['ǅ', true],
      ['Ǆ', true],
    ],
  },

  {
    pattern: 'Ǆ',
    flags: '',
    inputs: [
      ['ǆ', false],
      ['ǅ', false],
      ['Ǆ', true],
    ],
  },
  {
    pattern: 'Ǆ',
    flags: 'i',
    inputs: [
      ['ǆ', true],
      ['ǅ', true],
      ['Ǆ', true],
    ],
  },
];

cases.push(...more);
// Also test with '%' because that triggers the RegExp path.
cases.push(
  ...more.map(c => ({
    ...c,
    pattern: '%' + c.pattern + '%',
  })),
);

test('basics', () => {
  for (const {pattern, flags, inputs} of cases) {
    const op = getLikePredicate(pattern, flags);
    for (const [input, expected] of inputs) {
      expect(op(input), JSON.stringify({pattern, flags, input})).equal(
        expected,
      );
    }
  }
});

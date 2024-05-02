import {describe, expect, it} from 'vitest';
import {
  format,
  formatWithArray,
  quoteIdent,
  quoteLiteral,
  quoteString,
} from './index.js';

//
// Original source from https://github.com/segmentio/pg-escape
//

const testDate = new Date(Date.UTC(2012, 11, 14, 13, 6, 43, 152));
const testArray = ['abc', 1, true, null, testDate];
const testIdentArray = ['abc', 'AbC', 1, true, testDate];
const testObject = {a: 1, b: 2};
const testNestedArray = [
  [1, 2],
  [3, 4],
  [5, 6],
];

describe('format(fmt, ...)', () => {
  describe('%s', () => {
    it('should format as a simple string', () => {
      expect(format('some %s here', 'thing')).toBe('some thing here');
      expect(format('some %s thing %s', 'long', 'here')).toBe(
        'some long thing here',
      );
    });

    it('should format array of array as simple string', () => {
      expect(format('many %s %s', 'things', testNestedArray)).toBe(
        'many things (1, 2), (3, 4), (5, 6)',
      );
    });

    it('should format string using position field', () => {
      expect(format('some %1$s', 'thing')).toBe('some thing');
      expect(format('some %1$s %1$s', 'thing')).toBe('some thing thing');
      expect(format('some %1$s %s', 'thing', 'again')).toBe('some thing again');
      expect(format('some %1$s %2$s', 'thing', 'again')).toBe(
        'some thing again',
      );
      expect(format('some %1$s %2$s %1$s', 'thing', 'again')).toBe(
        'some thing again thing',
      );
      expect(format('some %1$s %2$s %s %1$s', 'thing', 'again', 'some')).toBe(
        'some thing again some thing',
      );
    });

    it('should not format string using position 0', () => {
      expect(() => {
        format('some %0$s', 'thing');
      }).toThrow(Error);
    });

    it('should not format string using position field with too few arguments', () => {
      expect(() => {
        format('some %2$s', 'thing');
      }).toThrow(Error);
    });
  });

  describe('%%', () => {
    it('should format as %', () => {
      expect(format('some %%', 'thing')).toBe('some %');
    });

    it('should not eat args', () => {
      expect(format('just %% a %s', 'test')).toBe('just % a test');
    });

    it('should not format % using position field', () => {
      expect(format('%1$%', 'thing')).toBe('%1$%');
    });
  });

  describe('%I', () => {
    it('should format as an identifier', () => {
      expect(format('some %I', 'foo/bar/baz')).toBe('some "foo/bar/baz"');
    });

    it('should not format array of array as an identifier', () => {
      expect(() => {
        format('many %I %I', 'foo/bar/baz', testNestedArray);
      }).toThrow(Error);
    });

    it('should format identifier using position field', () => {
      expect(format('some %1$I', 'thing')).toBe('some thing');
      expect(format('some %1$I %1$I', 'thing')).toBe('some thing thing');
      expect(format('some %1$I %I', 'thing', 'again')).toBe('some thing again');
      expect(format('some %1$I %2$I', 'thing', 'again')).toBe(
        'some thing again',
      );
      expect(format('some %1$I %2$I %1$I', 'thing', 'again')).toBe(
        'some thing again thing',
      );
      expect(format('some %1$I %2$I %I %1$I', 'thing', 'again', 'huh')).toBe(
        'some thing again huh thing',
      );
    });

    it('should not format identifier using position 0', () => {
      expect(() => {
        format('some %0$I', 'thing');
      }).toThrow(Error);
    });

    it('should not format identifier using position field with too few arguments', () => {
      expect(() => {
        format('some %2$I', 'thing');
      }).toThrow(Error);
    });
  });

  describe('%L', () => {
    it('should format as a literal', () => {
      expect(format('%L', "Tobi's")).toBe("'Tobi''s'");
    });

    it('should format array of array as a literal', () => {
      expect(format('%L', testNestedArray)).toBe(
        "('1', '2'), ('3', '4'), ('5', '6')",
      );
    });

    it('should format literal using position field', () => {
      expect(format('some %1$L', 'thing')).toBe("some 'thing'");
      expect(format('some %1$L %1$L', 'thing')).toBe("some 'thing' 'thing'");
      expect(format('some %1$L %L', 'thing', 'again')).toBe(
        "some 'thing' 'again'",
      );
      expect(format('some %1$L %2$L', 'thing', 'again')).toBe(
        "some 'thing' 'again'",
      );
      expect(format('some %1$L %2$L %1$L', 'thing', 'again')).toBe(
        "some 'thing' 'again' 'thing'",
      );
      expect(format('some %1$L %2$L %L %1$L', 'thing', 'again', 'some')).toBe(
        "some 'thing' 'again' 'some' 'thing'",
      );
    });

    it('should not format literal using position 0', () => {
      expect(() => {
        format('some %0$L', 'thing');
      }).toThrow(Error);
    });

    it('should not format literal using position field with too few arguments', () => {
      expect(() => {
        format('some %2$L', 'thing');
      }).toThrow(Error);
    });
  });
});

describe('withArray(fmt, args)', () => {
  describe('%s', () => {
    it('should format as a simple string', () => {
      expect(formatWithArray('some %s here', ['thing'])).toBe(
        'some thing here',
      );
      expect(formatWithArray('some %s thing %s', ['long', 'here'])).toBe(
        'some long thing here',
      );
    });

    it('should format array of array as simple string', () => {
      expect(formatWithArray('many %s %s', ['things', testNestedArray])).toBe(
        'many things (1, 2), (3, 4), (5, 6)',
      );
    });
  });

  describe('%%', () => {
    it('should format as %', () => {
      expect(formatWithArray('some %%', ['thing'])).toBe('some %');
    });

    it('should not eat args', () => {
      expect(formatWithArray('just %% a %s', ['test'])).toBe('just % a test');
      expect(
        formatWithArray('just %% a %s %s %s', ['test', 'again', 'and again']),
      ).toBe('just % a test again and again');
    });
  });

  describe('%I', () => {
    it('should format as an identifier', () => {
      expect(formatWithArray('some %I', ['foo/bar/baz'])).toBe(
        'some "foo/bar/baz"',
      );
      expect(formatWithArray('some %I and %I', ['foo/bar/baz', '#hey'])).toBe(
        'some "foo/bar/baz" and "#hey"',
      );
    });

    it('should not format array of array as an identifier', () => {
      expect(() => {
        formatWithArray('many %I %I', ['foo/bar/baz', testNestedArray]);
      }).toThrow(Error);
    });
  });

  describe('%L', () => {
    it('should format as a literal', () => {
      expect(formatWithArray('%L', ["Tobi's"])).toBe("'Tobi''s'");
      expect(formatWithArray('%L %L', ["Tobi's", 'birthday'])).toBe(
        "'Tobi''s' 'birthday'",
      );
    });

    it('should format array of array as a literal', () => {
      expect(formatWithArray('%L', [testNestedArray])).toBe(
        "('1', '2'), ('3', '4'), ('5', '6')",
      );
    });
  });
});

describe('quoteString(val)', () => {
  it('should coerce to a string', () => {
    expect(quoteString(undefined)).toBe('');
    expect(quoteString(null)).toBe('');
    expect(quoteString(true)).toBe('t');
    expect(quoteString(false)).toBe('f');
    expect(quoteString(0)).toBe('0');
    expect(quoteString(15)).toBe('15');
    expect(quoteString(-15)).toBe('-15');
    expect(quoteString(45.13)).toBe('45.13');
    expect(quoteString(-45.13)).toBe('-45.13');
    expect(quoteString('something')).toBe('something');
    expect(quoteString(testArray)).toBe('abc,1,t,2012-12-14 13:06:43.152+00');
    expect(quoteString(testNestedArray)).toBe('(1, 2), (3, 4), (5, 6)');
    expect(quoteString(testDate)).toBe('2012-12-14 13:06:43.152+00');
    expect(quoteString(testObject)).toBe('{"a":1,"b":2}');
  });
});

describe('quoteIdent(val)', () => {
  it('should quote when necessary', () => {
    expect(quoteIdent('foo')).toBe('foo');
    expect(quoteIdent('_foo')).toBe('_foo');
    expect(quoteIdent('_foo_bar$baz')).toBe('_foo_bar$baz');
    expect(quoteIdent('test.some.stuff')).toBe('"test.some.stuff"');
    expect(quoteIdent('test."some".stuff')).toBe('"test.""some"".stuff"');
  });

  it('should quote reserved words', () => {
    expect(quoteIdent('desc')).toBe('"desc"');
    expect(quoteIdent('join')).toBe('"join"');
    expect(quoteIdent('cross')).toBe('"cross"');
  });

  it('should quote', () => {
    expect(quoteIdent(true)).toBe('"t"');
    expect(quoteIdent(false)).toBe('"f"');
    expect(quoteIdent(0)).toBe('"0"');
    expect(quoteIdent(15)).toBe('"15"');
    expect(quoteIdent(-15)).toBe('"-15"');
    expect(quoteIdent(45.13)).toBe('"45.13"');
    expect(quoteIdent(-45.13)).toBe('"-45.13"');
    expect(quoteIdent(testIdentArray)).toBe(
      'abc,"AbC","1","t","2012-12-14 13:06:43.152+00"',
    );
    expect(() => {
      quoteIdent(testNestedArray);
    }).toThrow(Error);
    expect(quoteIdent(testDate)).toBe('"2012-12-14 13:06:43.152+00"');
  });

  it('should throw when undefined', () => {
    try {
      quoteIdent(undefined);
    } catch (err) {
      expect((err as Error).message).toBe(
        'SQL identifier cannot be null or undefined',
      );
    }
  });

  it('should throw when null', () => {
    try {
      quoteIdent(null);
    } catch (err) {
      expect((err as Error).message).toBe(
        'SQL identifier cannot be null or undefined',
      );
    }
  });

  it('should throw when object', () => {
    try {
      quoteIdent({});
    } catch (err) {
      expect((err as Error).message).toBe('SQL identifier cannot be an object');
    }
  });
});

describe('quoteLiteral(val)', () => {
  it('should return NULL for null', () => {
    expect(quoteLiteral(null)).toBe('NULL');
    expect(quoteLiteral(undefined)).toBe('NULL');
  });

  it('should quote', () => {
    expect(quoteLiteral(true)).toBe("'t'");
    expect(quoteLiteral(false)).toBe("'f'");
    expect(quoteLiteral(0)).toBe("'0'");
    expect(quoteLiteral(15)).toBe("'15'");
    expect(quoteLiteral(-15)).toBe("'-15'");
    expect(quoteLiteral(45.13)).toBe("'45.13'");
    expect(quoteLiteral(-45.13)).toBe("'-45.13'");
    expect(quoteLiteral('hello world')).toBe("'hello world'");
    expect(quoteLiteral(testArray)).toBe(
      "'abc','1','t',NULL,'2012-12-14 13:06:43.152+00'",
    );
    expect(quoteLiteral(testNestedArray)).toBe(
      "('1', '2'), ('3', '4'), ('5', '6')",
    );
    expect(quoteLiteral(testDate)).toBe("'2012-12-14 13:06:43.152+00'");
    expect(quoteLiteral(testObject)).toBe('\'{"a":1,"b":2}\'::jsonb');
  });

  it('should format quotes', () => {
    expect(quoteLiteral("O'Reilly")).toBe("'O''Reilly'");
  });

  it('should format backslashes', () => {
    expect(quoteLiteral('\\whoop\\')).toBe("E'\\\\whoop\\\\'");
  });
});

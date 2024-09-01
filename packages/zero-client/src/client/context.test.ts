import {expect, test} from 'vitest';
import {AddQuery, ZeroContext} from './context.js';
import {MemorySource} from 'zql/src/zql/ivm/memory-source.js';
import {ENTITIES_KEY_PREFIX} from './keys.js';
import {Catch} from '../../../zql/src/zql/ivm/catch.js';
import {Join} from 'zql/src/zql/ivm/join.js';
import {MemoryStorage} from 'zql/src/zql/ivm/memory-storage.js';
import {ExperimentalNoIndexDiff} from 'replicache';

test('getSource', () => {
  const schemas = {
    users: {
      fields: {
        id: {type: 'string'},
        name: {type: 'string'},
      },
      primaryKey: ['id'],
      table: 'users',
    },
    userStates: {
      fields: {
        userID: {type: 'string'},
        stateCode: {type: 'string'},
      },
      primaryKey: ['userID', 'stateCode'],
      table: 'userStates',
    },
  } as const;

  const context = new ZeroContext(schemas, null as unknown as AddQuery);

  const source = context.getSource('users');

  expect((source as MemorySource).getSchemaInfo()).toEqual({
    tableName: 'users',
    columns: {
      id: 'string',
      name: 'string',
    },
    primaryKey: ['id'],
  });

  // Calling again should cache first value.
  expect(context.getSource('users')).toBe(source);

  expect(() => context.getSource('nonexistent')).toThrow(
    'No schema found for table nonexistent',
  );

  // Should work for other table too.
  const source2 = context.getSource('userStates');
  expect((source2 as MemorySource).getSchemaInfo()).toEqual({
    tableName: 'userStates',
    columns: {
      userID: 'string',
      stateCode: 'string',
    },
    primaryKey: ['userID', 'stateCode'],
  });
});

test('processChanges', () => {
  const schemas = {
    t1: {
      fields: {
        id: {type: 'string'},
        name: {type: 'string'},
      },
      primaryKey: ['id'],
      table: 't1',
    },
  } as const;

  const context = new ZeroContext(schemas, null as unknown as AddQuery);
  const out = new Catch(context.getSource('t1').connect([['name', 'desc']]));

  context.processChanges([
    {
      key: `${ENTITIES_KEY_PREFIX}t1/e1`,
      op: 'add',
      newValue: {id: 'e1', name: 'name1'},
    },
    {
      key: `${ENTITIES_KEY_PREFIX}t1/e2`,
      op: 'add',
      newValue: {id: 'e2', name: 'name2'},
    },
    {
      key: `${ENTITIES_KEY_PREFIX}t1/e1`,
      op: 'change',
      oldValue: {id: 'e1', name: 'name1'},
      newValue: {id: 'e1', name: 'name1.1'},
    },
  ]);

  expect(out.pushes).toEqual([
    {type: 'add', node: {row: {id: 'e1', name: 'name1'}, relationships: {}}},
    {type: 'add', node: {row: {id: 'e2', name: 'name2'}, relationships: {}}},
    {type: 'remove', node: {row: {id: 'e1', name: 'name1'}, relationships: {}}},
    {type: 'add', node: {row: {id: 'e1', name: 'name1.1'}, relationships: {}}},
  ]);

  expect(out.fetch({})).toEqual([
    {row: {id: 'e2', name: 'name2'}, relationships: {}},
    {row: {id: 'e1', name: 'name1.1'}, relationships: {}},
  ]);
});

test('transactions', () => {
  const schemas = {
    server: {
      fields: {
        id: {type: 'string'},
      },
      primaryKey: ['id'],
      table: 'server',
    },
    flair: {
      fields: {
        id: {type: 'string'},
        serverID: {type: 'string'},
        description: {type: 'string'},
      },
      primaryKey: ['id'],
      table: 'flair',
    },
  } as const;

  const context = new ZeroContext(schemas, null as unknown as AddQuery);
  const servers = context.getSource('server');
  const flair = context.getSource('flair');
  const join = new Join({
    parent: servers.connect([['id', 'asc']]),
    child: flair.connect([['id', 'asc']]),
    storage: new MemoryStorage(),
    parentKey: 'id',
    childKey: 'serverID',
    hidden: false,
    relationshipName: 'flair',
  });
  const out = new Catch(join);

  const changes: ExperimentalNoIndexDiff = [
    {
      key: `${ENTITIES_KEY_PREFIX}server/s1`,
      op: 'add',
      newValue: {id: 's1', name: 'joanna'},
    },
    {
      key: `${ENTITIES_KEY_PREFIX}server/s2`,
      op: 'add',
      newValue: {id: 's2', name: 'brian'},
    },
    ...new Array(15).fill(0).map((_, i) => ({
      key: `${ENTITIES_KEY_PREFIX}flair/f${i}`,
      op: 'add' as const,
      newValue: {id: `f${i}`, serverID: 's1', description: `desc${i}`},
    })),
    ...new Array(37).fill(0).map((_, i) => ({
      key: `${ENTITIES_KEY_PREFIX}flair/f${15 + i}`,
      op: 'add' as const,
      newValue: {
        id: `f${15 + i}`,
        serverID: 's2',
        description: `desc${15 + i}`,
      },
    })),
  ];

  let transactions = 0;

  const remove = context.onTransactionCommit(() => {
    ++transactions;
  });
  remove();

  context.onTransactionCommit(() => {
    ++transactions;
  });

  context.processChanges(changes);

  expect(transactions).eq(1);
  const result = out.fetch({});
  expect(result).length(2);
  expect(result[0].row).toEqual({id: 's1', name: 'joanna'});
  expect(result[0].relationships.flair).length(15);
  expect(result[1].row).toEqual({id: 's2', name: 'brian'});
  expect(result[1].relationships.flair).length(37);
});

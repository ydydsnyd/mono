/**
 * Benchmarks ZQL against the theoretically fastest possible implementation.
 *
 * This is done by:
 * 1. Asking ZQL to do a query
 * 2. Crafting the fastest possible way to run that query by hand. E.g., direct array lookup.
 */

import {bench, describe, expect} from 'vitest';
import {TestContext} from '../context/test-context.js';
import {EntityQuery} from '../query/entity-query.js';
import BTree from 'btree';
import {Treap} from '@vlcn.io/ds-and-algos/Treap';
import {PersistentTreap} from '@vlcn.io/ds-and-algos/PersistentTreap';

type Issue = {
  id: string;
  title: string;
};

describe.each([
  /*
  - We have an optimization in ZQL that allows us to look up an entity by id in O(1) time.
  Results as of 86bfe06a5d0d0f868c31449fb90c1f1d8bb4ee86:
  ✓ [Hydration Planner] 'lookup by primary key' (3) 2992ms
     name                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · prepare and run        235,978.00  0.0000  0.9000  0.0042  0.0000  0.1000  0.1000  0.1000  ±3.51%   117989   slowest
   · previously prepared  3,035,744.85  0.0000  0.4000  0.0003  0.0000  0.0000  0.0000  0.1000  ±2.80%  1518176
   · theory               8,491,861.63  0.0000  0.2000  0.0001  0.0000  0.0000  0.0000  0.1000  ±2.77%  4246780   fastest
  */
  {
    name: 'lookup by primary key',
    getZql: (context: TestContext) =>
      new EntityQuery<{issue: Issue}>(context, 'issue')
        .select('id')
        .where('id', '=', '005000'),
    zqlExpected: (_: Issue[]) => {},
    theoryQuery: (collection: Map<string, Issue>) => collection.get('005000'),
  },
  /*
  Results as of 86bfe06a5d0d0f868c31449fb90c1f1d8bb4ee86:
  ✓ [Hydration Planner] 'table scan with lookup on an un-index…' (3) 2101ms
     name                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · prepare and run          2,937.65  0.2000  0.5000  0.3404  0.4000  0.5000  0.5000  0.5000  ±0.93%     1470   slowest
   · previously prepared  3,221,025.80  0.0000  0.2000  0.0003  0.0000  0.0000  0.0000  0.1000  ±2.77%  1610835   fastest
   · theory                  24,607.08  0.0000  0.2000  0.0406  0.1000  0.2000  0.2000  0.2000  ±2.23%    12306

  TODO: "Prepare and run" is off by 1 order of magnitude from theory. Seems like we can do better here.
  */
  {
    name: 'table scan with lookup on an un-indexed field',
    getZql: (context: TestContext) =>
      new EntityQuery<{issue: Issue}>(context, 'issue')
        .select('id')
        .where('title', '=', 'Issue 5000'),
    zqlExpected: (_: Issue[]) => {},
    theoryQuery: (collection: Map<string, Issue>) => {
      const ret: Issue[] = [];
      for (const issue of collection.values()) {
        if (issue.title === 'Issue 5000') {
          ret.push(issue);
        }
      }
    },
  },
  /*
  ✓ [Hydration Planner] 'table scan with no comparisons' (3) 2098ms
     name                           hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · prepare and run            164.26  5.8000  6.5000  6.0880  6.1000  6.5000  6.5000  6.5000  ±0.41%       83   slowest
   · previously prepared  3,164,980.00  0.0000  2.6000  0.0003  0.0000  0.0000  0.0000  0.1000  ±2.94%  1582490   fastest
   · theory                  43,495.30  0.0000  0.2000  0.0230  0.0000  0.1000  0.1000  0.2000  ±2.46%    21752

   omg... wtf is going on here. 2 orders of magnitude off!?
  */
  {
    name: 'table scan with no comparisons',
    getZql: (context: TestContext) =>
      new EntityQuery<{issue: Issue}>(context, 'issue').select('id'),
    zqlExpected: (_: Issue[]) => {},
    theoryQuery: (collection: Map<string, Issue>) => {
      const ret: Issue[] = [];
      for (const issue of collection.values()) {
        ret.push(issue);
      }
    },
  },
])(`[Hydration Planner] $name`, async ({getZql, zqlExpected, theoryQuery}) => {
  const context = new TestContext();
  const source = context.getSource<Issue>('issue');
  const theory = new Map<string, Issue>();

  for (let i = 0; i < 10_000; ++i) {
    const issue = {id: i.toString().padStart(6, '0'), title: `Issue ${i}`};
    source.add(issue);
    theory.set(issue.id, issue);
  }

  const prepared = await getZql(context).prepare();

  bench('prepare and run', async () => {
    const stmt = getZql(context).prepare();
    const result = await stmt.exec();
    zqlExpected(result as Issue[]);
    stmt.destroy();
  });

  bench('previously prepared', async () => {
    const result = await prepared.exec();
    zqlExpected(result as Issue[]);
  });

  // Make sure we _actually_ cleaned up statements.
  // Prior versions of this benchmark forgot to clean up statements which caused
  // horribly wrong results.
  // This raises a good point thought:
  // We do, at some point, need to add query-deduplication and argument indices to our operators so
  //  1 million point queries do not take 1 million iterations.
  prepared.destroy();
  expect(source.stream.numDownstreams).toBe(0);
  source.stream.destroy();

  bench('theory', () => {
    theoryQuery(theory);
  });
});

describe('is the btree just trash?', () => {
  const limit = 10_000;
  bench('create and iterate 10k item tree', () => {
    let tree = new BTree<string, Issue>();
    for (let i = 0; i < limit; ++i) {
      const issue = {id: i.toString().padStart(6, '0'), title: `Issue ${i}`};
      tree = tree.with(issue.id, issue);
    }
    const ret: Issue[] = [];
    for (const issue of tree.values()) {
      ret.push(issue);
    }
  });

  bench('create and iterate 10k item map', () => {
    const map = new Map<string, Issue>();
    for (let i = 0; i < limit; ++i) {
      const issue = {id: i.toString().padStart(6, '0'), title: `Issue ${i}`};
      map.set(issue.id, issue);
    }
    const ret: Issue[] = [];
    for (const issue of map.values()) {
      ret.push(issue);
    }
  });

  bench('create and iterate 10k item treap', () => {
    const treap = new Treap<Issue>((l, r) => l.id.localeCompare(r.id));
    for (let i = 0; i < limit; ++i) {
      const issue = {id: i.toString().padStart(6, '0'), title: `Issue ${i}`};
      treap.add(issue);
    }
    const ret: Issue[] = [];
    for (const issue of treap) {
      ret.push(issue);
    }
  });

  bench('create and iterate 10k item persistent treap', () => {
    let treap = new PersistentTreap<Issue>((l, r) => l.id.localeCompare(r.id));
    for (let i = 0; i < limit; ++i) {
      const issue = {id: i.toString().padStart(6, '0'), title: `Issue ${i}`};
      treap = treap.add(issue);
    }
    const ret: Issue[] = [];
    for (const issue of treap) {
      ret.push(issue);
    }
  });
});

// table scan with limit 1

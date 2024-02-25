---
title: Dynamic Pull
slug: /byob/dynamic-pull
---

Even though in the previous step we're making persistent changes in the database, we still aren't _serving_ that data in the pull endpoint – it's still static 🤣. Let's fix that now.

The implementation of pull will depend on the backend strategy you are using. For the [Reset Strategy](/strategies/reset) strategy we're using, the steps are trivial:

1. Open an exclusive (serializable) transaction
1. Build the response patch (`op:clear` followed by `op:put` for all items in client view)
1. Build a map of `lastMutationID` values for all clients
1. Return the patch, `lastMutationID` values, and the current timestamp as a cookie

:::info

Experienced developers may be wondering if it's safe to rely on the server clock this way.

Because this strategy returns the entire dataset in each pull response, clock skew can't cause many problems. The worst case is if the clock jumps backward. In that case, Replicache will ignore pull responses until the cookie passes the last value that Replicache saw. But no data will be corrupted.

:::

## Implement Pull

Replace the contents of `pages/api/replicache-pull.ts` with this code:

```ts
import {NextApiRequest, NextApiResponse} from 'next';
import {serverID, tx, Transaction} from '../../db';
import {PatchOperation, PullResponse} from 'replicache';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const pull = req.body;
  console.log(`Processing pull`, JSON.stringify(pull));
  const {clientGroupID} = pull;
  const fromVersion = pull.cookie ?? 0;
  const t0 = Date.now();

  try {
    // Read all data in a single transaction so it's consistent.
    await tx(async t => {
      // Get lmids for requesting client groups.
      const lastMutationIDChanges = await getLastMutationIDChanges(
        t,
        clientGroupID,
      );

      // Get all domain objects.
      const changed = await t.manyOrNone<{
        id: string;
        sender: string;
        content: string;
        ord: number;
      }>('select id, sender, content, ord from message', fromVersion);

      // Build and return response.
      const patch: PatchOperation[] = [{op: 'clear'}];

      for (const row of changed) {
        const {id, sender, content, ord} = row;
        patch.push({
          op: 'put',
          key: `message/${id}`,
          value: {
            from: sender,
            content: content,
            order: ord,
          },
        });
      }

      const body: PullResponse = {
        lastMutationIDChanges: lastMutationIDChanges ?? {},
        cookie: Date.now(),
        patch,
      };
      res.json(body);
      res.end();
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  } finally {
    console.log('Processed pull in', Date.now() - t0);
  }
}

async function getLastMutationIDChanges(t: Transaction, clientGroupID: string) {
  const rows = await t.manyOrNone<{id: string; last_mutation_id: number}>(
    `select id, last_mutation_id
    from replicache_client
    where client_group_id = $1`,
    [clientGroupID],
  );
  return Object.fromEntries(rows.map(r => [r.id, r.last_mutation_id]));
}
```

Because the previous pull response was hard-coded and not really reading from the database, you'll now have to clear your browser's application data to see consistent results. On Chrome/OSX for example: **cmd+opt+j → Application tab -> Storage -> Clear site data**.

Once you do that, you can make a change in one browser and then refresh a different browser and see them round-trip:

<p class="text--center">
  <img src="/img/setup/manual-sync.webp" width="650"/>
</p>

Also notice that if we go offline for awhile, make some changes, then come back online, the mutations get sent when possible.

We don't have any conflicts in this simple data model, but Replicache makes it easy to reason about most conflicts. See the [How Replicache Works](/concepts/how-it-works) for more details.

The only thing left is to make it live — we obviously don't want the user to have to manually refresh to get new data 🙄.

## Next

The [next section](./poke.md) implements realtime updates.

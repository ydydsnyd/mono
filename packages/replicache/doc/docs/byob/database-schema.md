---
title: Remote Schema
slug: /byob/remote-schema
---

There are a number of ways to implement Replicache backends.

The Replicache client doesn't actually care _how_ your backend works internally — it only cares that you provide correctly implemented [push](/reference/server-push.md) and [pull](/reference/server-pull.md) endpoints.

This walkthrough implements the [Reset](/strategies/reset) backend strategy, which is very simple and a good way to learn Replicache. See [Backend Strategies](/strategies/overview) for information on strategies commonly used with production Replicache apps.

## Define the Schema

Let's define our Postgres schema. As suggested in the [Reset Strategy](/strategies/reset) doc, we'll track:

- **Clients:** Clients that have connected to the server, and the last mutationID processed from each. This is used during push to ensure mutations are processed only once, and in the order they happened on the client. We also store each client's `clientGroupID`, which is needed to correctly implement `pull`.
- **ClientGroups:** A group of clients that share storage. This is basically all clients within one browser profile.
- **Domain Data:** The user data the application stores to do its job.

Modify `db.ts` so that `initDb` looks like:

```ts
async function initDB() {
  console.log('initializing database...');
  const db = newDb().adapters.createPgPromise();
  await tx(async t => {
    // Stores last mutationID processed for each Replicache client.
    await t.none(`create table replicache_client (
        id varchar(36) primary key not null,
        client_group_id varchar(36) not null,
        last_mutation_id integer not null)`);

    // Stores chat messages.
    await t.none(`create table message (
        id text primary key not null,
        sender varchar(255) not null,
        content text not null,
        ord integer not null)`);

    // TODO: indexes
  }, db);
  return db;
}
```

## Next

The [next section](./remote-mutations.md) implements remote mutations, so that our optimistic changes can become persitent.

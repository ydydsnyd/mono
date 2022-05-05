---
title: Frequently Asked Questions
slug: /faq
---

## How does the client know when to sync? Does it poll?

Typically, servers send a _poke_ (a content-less hint) over a websocket to tell the client to sync. There are many services you can use for this, and since no content flows over the socket there is no security/privacy concern. See the [integration guide](/guide/poke) for more information.

Replicache also polls at a low interval (60s by default) in case the poke mechanism fails or for applications that don't require low latency updates. You can adjust this using the [`pullInterval`](api/interfaces/ReplicacheOptions#pullInterval) field.

## What if I don’t have a dedicated backend? I use serverless functions for my backend

No problem. You can implement the integration points as serverless functions. Our samples are all implemented this way.

## How can I programmatically prevent Replicache from syncing?

Options:

- Set `pullURL` and `pushURL` to `''`. These are read/write so clearing them prevents next push/pull.
- Set a large delay: setting a large `pushDelay` will prevent automatically pushing after a mutation. Setting `pullInterval` will increase the time to the next pull.
- You could implement a custom `puller`/`pusher`.

If you would like better / more first-class support for this please [file an issue](https://github.com/rocicorp/replicache/issues/new).

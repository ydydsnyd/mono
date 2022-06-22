---
title: Deploy to Production
slug: /deploy
---

The todo app is just a standard Next.js app with a dependency on Postgres.

So when you're ready to ship, you can deploy it basically anywhere you can run a Next.js app. One easy option we like is [Render](https://render.com/), and we've included a `render.yaml` file to make this easy.

:::note

You can even deploy Replicache apps on serverless platforms like [Vercel](https://vercel.com/), but there are some caveats:

- The amount of data you can sync in each Replicache instance is typically limited to about 5 MB, because limits on [function payload sizes](https://vercel.com/docs/concepts/limits/overview#serverless-function-payload-size-limit).
- These platforms don't natively support any way to implement the ["poke" message](/how-it-works#poke-optional) that Replicache needs. So you'll need to use a pubsub service like [Pusher](https://pusher.com/).

We will add documentation on how to deploy to serverless platforms, but for now, please [Contact Us](https://replicache.dev/#contact) if you have questions on this.

:::

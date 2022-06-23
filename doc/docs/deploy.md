---
title: Deploy to Production
slug: /deploy
---

The todo app is just a standard [Next.js](https://nextjs.org/) app with a Postgres database. So when you're ready to ship, you can deploy it basically anywhere you can run a Node app.

One especially easy option we like is [Render](https://render.com/). To deploy there:

1. Fork [rocicorp/replicache-todo](https://github.com/rocicorp/replicache-todo) into your own repository.
1. [Create a Render account](https://dashboard.render.com/register).
1. Create a new Blueprint instance and link to the forked repo.
1. In the web server settings, set the `NEXT_PUBLIC_REPLICACHE_LICENSE_KEY` environment variable to your license key.

But you can also deploy on Heroku, AWS, or other places you can run Next.js/Postgres apps.

:::note

You can even deploy Replicache apps on serverless platforms like [Vercel](https://vercel.com/), but there are some caveats:

- The amount of data you can sync in each Replicache instance is typically limited to about 5 MB, because limits on [function payload sizes](https://vercel.com/docs/concepts/limits/overview#serverless-function-payload-size-limit).
- These platforms don't natively support any way to implement the ["poke" message](/how-it-works#poke-optional) that Replicache needs. So you'll need to use a pubsub service like [Pusher](https://pusher.com/).

We will add documentation on how to deploy to serverless platforms, but for now, please [Contact Us](https://replicache.dev/#contact) if you have questions on this.

:::

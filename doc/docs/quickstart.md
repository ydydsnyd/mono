---
title: Quickstart
slug: /
---

The easiest way to get started is with our Todo starter app. This app is a good way to play with Replicache, but it is _also_ a great foundation on which to build your own app using Replicache. Since it is simple and has all the pieces you'll need already in place, you can clone it and then start evolving it to suit your own needs.

# Prerequisites

You'll need [Node.js](https://nodejs.dev/) v14.19.1 or greater.

# Install

```bash
# Get the code and install
npx degit rocicorp/replicache-todo myapp
cd myapp
npm install

# Get a Replicache license key. The command below will ask you a few quick
# questions and then print out your key.
npx replicache get-license

export NEXT_PUBLIC_REPLICACHE_LICENSE_KEY="<your license key>"

npm run dev
```

# 🎉 Tada!

You now have a simple todo app powered by Replicache, <a href="https://nextjs.org/">Next.js</a>, and <a href="https://www.postgresql.org/">Postgres</a>.

<p class="text--center">
  <img src="/img/setup/todo.webp" width="650"/>
</p>

Open the app in a browser window, copy the resulting url, and open a second browser window to it. With the two windows side-by-side, add some items in one window and see them reflected in the other. Woo!

:::note

By default the dev backend stores data in memory, so if you restart the server, the data is lost. See [Local Postgres](/local-postgres) for setting up local persistence.

:::

# Other Things to Try

- Open the web inspector in one window and throttle the network. Notice that the UI still responds instantly.
- Open the web inspector in one window and completely disable the network. When the network comes back, everything syncs up!
- Disable the network and engineer a conflict. For example, delete a todo in the online tab, and edit the same todo in the offline tab. When the offline tab comes back both todos will be deleted.

The thing to understand is that **you do not have to write _any_ code to get these behaviors**. You write your Replicache app almost entirely client-side, and you get:

- Optimistic mutations everywhere, automatically.
- Correct rollback and reconciliaton when server mutation is different than optimistic.
- Instant UI, even when network is slow.
- Offline support.

# Next

The [next sections](/app-structure) walk you through the basic structure of this starter app, and explain how Replicache provides these benefits.

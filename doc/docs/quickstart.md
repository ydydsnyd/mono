---
title: Quickstart
slug: /
---

The easiest way to get started is with our Todo starter app. This app is a good way to play with Replicache, but it is _also_ a great foundation on which to build your own app using Replicache. Since it is simple and has all the pieces you'll need already in place, you can clone it and then start evolving it to suit your own needs.

# Prerequisites

1. [Node.js](https://nodejs.dev/) v14.19.1 or greater. Check which version you have by running `node --version` on the command line. If you don't have Node or the version is old, install at https://nodejs.dev/download.
2. [Sign up for a free pusher.com account](https://pusher.com/) and create a new "channels" app.

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

# Get the Pusher environment variables from the "App Keys" section
# of the Pusher App UI. See: https://i.imgur.com/7DNmTKZ.png
export NEXT_PUBLIC_PUSHER_APP_ID=<appid>
export NEXT_PUBLIC_PUSHER_KEY=<pusherkey>
export NEXT_PUBLIC_PUSHER_SECRET=<pushersecret>
export NEXT_PUBLIC_PUSHER_CLUSTER=<pushercluster>

npm run dev
```

You now have a simple todo app powered by Replicache, <a href="https://nextjs.org/">Next.js</a>, <a href="https://www.postgresql.org/">Postgres</a>, and <a href="https://pusher.com/">Pusher</a>.

<p class="text--center">
  <img src="/img/setup/todo.webp" width="650"/>
</p>

Open the app in a browser window, copy the resulting url, and open a second browser window to it. With the two windows side-by-side, add some items in one window and see them reflected in the other. Tada! Instant UI and Realtime Sync!

By default the dev backend stores data in memory, so if you restart the server, the data is lost. See [Local Postgres](/local-postgres) for setting up local persistence.

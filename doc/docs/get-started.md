---
title: Get Started
slug: /
---

The easiest way to get started is with our Todo starter app. This app is a good way to play with Replicache, but it is _also_ a great foundation on which to build your own app using Replicache. Since it is simple and has all the pieces you'll need already in place, you can clone it and then start evolving it to suit your own needs.

For information about the license key step, see [Licensing](/licensing).

```bash
# Get a Replicache license key
npx replicache get-license

# Clone the repo if you have not already
git clone https://github.com/rocicorp/replicache-todo my-app
cd my-app
npm install

# install supabase cli if necessary
# (MacOS, for other platforms: https://github.com/supabase/cli#getting-started)
brew install supabase/tap/supabase

supabase init

# Docker is required for supabase
# If the supabase server is already running, run `supabase stop` before
# running the following command (so we can grab config values)
supabase start

# Use license key printed out by `npx replicache get-license`
export NEXT_PUBLIC_REPLICACHE_LICENSE_KEY="<license key>"

# Use URLs and keys printed out by `supabase start`
export DATABASE_URL="<DB URL>"
export NEXT_PUBLIC_SUPABASE_URL="<API URL>"
export NEXT_PUBLIC_SUPABASE_KEY="<anon key>"
npm run dev
```

You now have a simple todo app powered by Replicache, <a href="https://nextjs.org/">Next.js</a>, and <a href="https://supabase.com/">Supabase</a>.

<p class="text--center">
  <img src="/img/setup/todo.webp" width="650"/>
</p>

You can start modifying this app to build something new with Replicache. For starters, open the app in a browser window and then copy the url and open a new browser window to it. With the windows side-by-side, add some items in one window and see them reflected in the other. Tada! Instant UI and Realtime Sync!

## A Quick Tour of the Starter App

- **[`frontend/`](https://github.com/rocicorp/replicache-todo/blob/main/frontend)** contains the UI. This is mostly a standard React/Next.js application.
- **[`frontend/mutators.ts`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/mutators.ts)** defines the _mutators_ for this application. This is how you write data using Replicache. Call these functions from the UI to add or modify data. The mutations will be pushed to the server in the background automatically.
- **[`frontend/app.tsx`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/app.tsx)** subscribes to all the todos in Replicache using `useSubscribe()`. This is how you typically build UI using Replicache: the hook will re-fire when the result of the subscription changes, either due to local (optimistic) changes, or changes that were synced from the server.
- **[`backend/`](https://github.com/rocicorp/replicache-todo/blob/main/backend)** contains a simple, generic Replicache server that stores data in Supabase. You probably don't need to worry about this directory for now. The mutators defined for the client-side (frontend) are re-used by backend / server, so unless you want them to diverge in behavior you shouldn't need to touch these files. If that sentence doesn't make sense, don't worry, you can learn more at [How Replicache Works](how-it-works.md).

## Next

To understand the big picture of how to use Replicache, see [How Replicache Works](./how-it-works.md).

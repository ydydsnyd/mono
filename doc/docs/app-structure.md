---
title: App Structure
slug: /app-structure
---

# A Quick Tour of the Starter App

- **[`backend/`](https://github.com/rocicorp/replicache-todo/blob/main/backend)** contains a simple, generic Replicache server that stores data in Postgres. You don't need to worry about this directory for now -- you only need to modify it for more advanced cases. If you're curious, you can learn more at [How Replicache Works](how-it-works.md).
- **[`frontend/`](https://github.com/rocicorp/replicache-todo/blob/main/frontend)** contains the UI. This is mostly a standard React/Next.js application.
- **[`frontend/todo.ts`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/todo.ts)** defines the `Todo` entity and a simple crud interface for reading and writing it.
- **[`frontend/mutators.ts`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/mutators.ts)** defines the _mutators_ for this application. This is how you write data using Replicache. Call these functions from the UI to add or modify data. The mutations will be pushed to the server in the background automatically.
- **[`frontend/app.tsx`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/app.tsx)** subscribes to all the todos in the app using `useSubscribe()`. This is how you typically build UI using Replicache: the hook will re-fire when the result of the subscription changes, either due to local (optimistic) changes, or changes that were synced from the server. This app is simple so it just has one subscription, but bigger apps will often have a handful — one for each major view.

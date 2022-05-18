---
title: Get Started
slug: /
---

The easiest way to get started is with our Todo starter app. This app is a good way to play with Replicache, but it is _also_ a great foundation on which to build your own app using Replicache. Since it is simple and has all the pieces you'll need already in place, you can clone it and then start evolving it to suit your own needs.

For information about the license key step, see [Licensing](/licensing).

# Prerequisites

The following software must be installed to use the starter app:

- Docker: https://docs.docker.com/engine/install/
- Supabase CLI: https://github.com/supabase/cli#getting-started

# Install

```bash
# Get the code and install
npx degit rocicorp/replicache-todo my-app
cd my-app
npm install

# Get a Replicache license key.
npx replicache get-license

# Initialize supabase.
supabase init

# Start supabase. If you are already running supabase for another
# application, first run `supabase stop` before running the
# following command so it will output the config values.
supabase start

# Use license key printed out by `npx replicache get-license`.
export NEXT_PUBLIC_REPLICACHE_LICENSE_KEY="<license key>"
# Use URLs and keys printed out by `supabase start`.
export DATABASE_URL="<DB URL>"
export NEXT_PUBLIC_SUPABASE_URL="<API URL>"
export NEXT_PUBLIC_SUPABASE_KEY="<anon key>"
npm run dev
```

You now have a simple todo app powered by Replicache, <a href="https://nextjs.org/">Next.js</a>, and <a href="https://supabase.com/">Supabase</a>.

<p class="text--center">
  <img src="/img/setup/todo.webp" width="650"/>
</p>

Open the app in a browser window, copy the resulting url, and open a second browser window to it. With the two windows side-by-side, add some items in one window and see them reflected in the other. Tada! Instant UI and Realtime Sync!

## A Quick Tour of the Starter App

- **[`frontend/`](https://github.com/rocicorp/replicache-todo/blob/main/frontend)** contains the UI. This is mostly a standard React/Next.js application.
- **[`frontend/app.tsx`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/app.tsx)** subscribes to all the todos in the app using `useSubscribe()`. This is how you typically build UI using Replicache: the hook will re-fire when the result of the subscription changes, either due to local (optimistic) changes, or changes that were synced from the server. This app is simple so it just has one subscription, but bigger apps will often have a handful — one for each major view.
- **[`frontend/mutators.ts`](https://github.com/rocicorp/replicache-todo/blob/main/frontend/mutators.ts)** defines the _mutators_ for this application. This is how you write data using Replicache. Call these functions from the UI to add or modify data. The mutations will be pushed to the server in the background automatically.
- **[`backend/`](https://github.com/rocicorp/replicache-todo/blob/main/backend)** contains a simple, generic Replicache server that stores data in Supabase. You probably don't need to worry about this directory for now. The mutators defined for the client-side (frontend) are re-used by backend / server automatically, so unless you want them to diverge in behavior you shouldn't need to touch these files. If that sentence doesn't make sense, don't worry, you can learn more at [How Replicache Works](how-it-works.md).

## My First Replicache Feature

Let's see how easy it is to add a full-stack feature using Replicache. We will add an "urgent" flag to our Todos, and the ability to toggle and persist this property.

### Modify the Model

First let's add the `urgent` boolean to the Todo model. The example app uses [zod](https://github.com/colinhacks/zod) to describe the shape of the domain objects.

```ts title="frontend/todo.ts"
export const todoSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  sort: z.number(),

  // add this property
  urgent: z.optional(z.boolean()),
});
```

### Add a Mutator

We need to ensure that we have a mutator that can handle the new logic. In this case, we are simply persisting a field on `Todo`, so we can reuse our existing `updateTodo` mutator. This pattern of writing a general `update` mutator and reusing it for simple actions is common in Replicache apps — specific mutators are written to handle more specialized logic.

```ts title="frontend/mutators.ts"
export const mutators = {
  ...

  // Nothing to do! This mutator already exists in the sample app and does what we need!
  updateTodo: async (
    tx: WriteTransaction,
    {
      id,
      changes,
    }: {
      id: string;
      changes: Omit<Partial<Todo>, "id">;
    }
  ): Promise<void> => {
    const todo = await getTodo(tx, id);
    if (todo === undefined) {
      console.info(`Todo ${id} not found`);
      return;
    }
    const changed = { ...todo, ...changes };
    await putTodo(tx, changed);
  },
}

```

### Add a Toggle Button

We need to add a UI element so that the user can toggle the "urgent" flag. This is simple to do since the mutator we need is already available in this component as `onUpdate`.

```tsx title="frontend/todo-item.tsx"
<div className="view">
  ...
  <button
    style={{all: 'revert'}}
    onClick={() => onUpdate({urgent: !todo.urgent})}
  >
    !
  </button>
  ...
  <button className="destroy" onClick={() => onDelete()} />
</div>
```

At this point, we have actually finished the basic plumbing of our feature. Clicking on this button will: 1) change the state of our app (immediately), 2) persist that change, and 3) cause that change to be synchronized _in real time_ to other browsers.

### Show the "urgent" flag in the UI

Just to prove to ourselves that this is happening, let's render some text when the `urgent` flag is set:

```tsx title="frontend/todo-item.tsx"
<label onDoubleClick={handleDoubleClick}>
  {todo.text} {todo.urgent && '(URGENT!)'}
</label>
```

It's not beautiful, but you get the idea. In summary, developers can often implement a feature by writing relatively simple code in one place. The data changes associated with that feature will automatically be full-stack and synchronized to other instances of the app.

## Next

To understand the big picture of how to use Replicache, see [How Replicache Works](./how-it-works.md).

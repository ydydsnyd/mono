---
title: Deploy to Production
slug: /deploy
---

The todo app is a standard [Next.js](https://nextjs.org/) app with a Postgres database backend, and can therefore be deployed just about anywhere a Node app can be deployed.

The one slightly tricky bit is that Replicache needs the server to send a server-to-client [poke message](https://doc.replicache.dev/how-it-works) when something has changed, telling Replicache to pull again.

A few recommended deployment targets are described below.

<details>
  <summary><h2>Deploy on Render</h2></summary>

[Render](https://render.com) is a modern Heroku-like service for stateful servers. We include a `render.yaml` file in this quickstart app that makes it easy to deploy there.

### Step 1: Create Render Project from Blueprint

- Push your app to GitHub
- [Create a Render account](https://dashboard.render.com/register), then a new Blueprint
- Choose the GitHub project you pushed

<p class="text--center">
  <video src="/img/deploy/render-create-project.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

### Step 2: Add license key environment variable

- In the web server settings, set the `NEXT_PUBLIC_REPLICACHE_LICENSE_KEY` environment variable to your [Replicache License Key](/licensing).

<p class="text--center">
  <video src="/img/deploy/render-license-key.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

### Step 3: 🎉

When the deploy finishes, you should have a working app live on Render!

<p class="text--center">
  <video src="/img/deploy/render-success.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

</details>

<details>
  <summary><h2>Deploy on Vercel and Supabase</h2></summary>

You can host Replicache apps on serverless platforms like [Vercel](https://vercel.com).

We recommend pairing with [Supabase](https://supabase.com) for storage, since Supabase also has realtime features that can be used for the poke message.

### Step 1: Create Supabase Project

- Create a new project at [Supabase](https://supabase.com).
- Create in `East US` because that's where Vercel functions are deployed by default, and they should be close.
- **Important:** Don't forget to copy the password you choose to some scratch file. You'll need that later and can't retrieve it after this screen.

<p class="text--center">
  <video src="/img/deploy/vercel-create-supabase-project.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

### Step 2: Create Vercel Project

- Push your Replicache app to GitHub.
- Create a new project at [Vercel](https://vercel.com) and link to the GitHub project.
- **Note:** This will deploy but the app will not run yet. We will fix that next.

<p class="text--center">
  <video src="/img/deploy/vercel-create-project.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

### Step 3: Add Supabase Integration to Vercel Project

- From your Vercel project's dashboard, go to Settings > Integrations.
- Add the Supabase integration and connect to your Supabase project.
- This will add several environment variables to your project (you may have to refresh the page before they appear).
- **Note:** It still won't quite work. One more step to go.

<p class="text--center">
  <video src="/img/deploy/vercel-integrate-supabase.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

### Step 4: Add Final Environment Variables

- From your Vercel project's dashboard, go to Settings > Environment Variables.
- Add `NEXT_PUBLIC_REPLICACHE_LICENSE_KEY` with your [Replicache License Key](/licensing).
- Add `SUPABASE_DATABASE_PASSWORD` with the password you copied from your Supabase setup in Step 1.
- Go to Deployments and redeploy the latest build to pick up the new variables.

<p class="text--center">
  <video src="/img/deploy/vercel-final-env-vars.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

### Step 5: 🎉

When the deploy finishes, you should have a working app live on Vercel and Supabase!

<p class="text--center">
  <video src="/img/deploy/vercel-success.m4v" autoplay="true" loop="true" style={{width: "100%", maxWidth:700}} controls="true" muted="true"/>
</p>

</details>

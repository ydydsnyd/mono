---
title: Deploy to Production
slug: /deploy
---

The todo app is just a standard Next.js app with a dependency on Postgres and Pusher.

So when you're ready to ship, you can deploy it basically anywhere you can run a Next.js app. One easy option we like is [Heroku](https://heroku.com/):

1. Create a Heroku account and create a new app.
2. Add the Heroku Postgres Add-on.
3. Configure the Pusher environment variables.
4. Push the code to Heroku.

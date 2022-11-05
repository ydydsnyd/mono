---
title: Sync
slug: /sync
---

<div style={{'border-color':'gray','border':'1px'}}>
<iframe src="https://codesandbox.io/embed/replicache-sync-m24968?autoresize=1&fontsize=12&hidenavigation=0&theme=light&highlights=12,13,14,15,20,21,33,34,35,36,37,38,39,40,41,42,43&codemirror=1&view=split"
     style={{'width':'100%','height':'525px', 'border':0,'border-radius': '4px', 'overflow':'hidden'}}
     title="replicache-sync"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
</div>

Finally, let’s start syncing our changes to the server.

Replicache can sync with any server that implements the Replicache sync protocol. You will learn how to build such a server in the Server Tutorial (don’t worry — it’s surprisingly easy!).

For now, we’ll just connect to an existing server that’s already running at [https://replicache-counter.onrender.com](https://replicache-counter.onrender.com) by adding `pushURL` and `pullURL` parameters to the constructor.

To support realtime updates, most Replicache server support an optional _poke channel_. Replicache **pokes** are zero-length messages that serve as a hint from server to clients that a space has changed and that the clients should pull again soon. This sample server implements a poke channel using [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

We also introduce the concept of **spaces** in this sample. Spaces are a way to partition data in Replicache. We currently generate a spaceID and associate each push/pull/poke to the created space. Spaces are useful for multi-tenant applications where you want to isolate data for different users.

:::tip
If you open the preview URL (i.e. xxxxx.csb.app/space/s-123) side-by-side and click increment in one, you will see that they are syncing.
:::

## Challenge

Replicache mutators are not required to compute the same result on the client as the server.

This is a feature! The server can have different or better information than the client. Also, this prevents clients from lying or cheating.

Try modifying your increment mutator to compute an incorrect result. You will see the incorrect result momentarily on the client or for as long as you are offline. But after sync, the clients snaps into alignment with the correct answer from the server automatically.

#### [Next: Next Steps &rarr;](/next-steps)

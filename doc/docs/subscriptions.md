---
title: Subscriptions
slug: /subscriptions
---

<iframe src="https://codesandbox.io/embed/replicache-subscriptions-9opr53?fautoresize=1&fontsize=12&hidenavigation=0&theme=light&highlights=19,20,21&codemirror=1&view=split"
     style={{'width':'100%','height':'500px', 'border':0,'border-radius': '4px', 'overflow':'hidden'}}
     title="replicache-front-end-only"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

_Subscriptions_ work similarly to other reactive JS frameworks.

You can subscribe to a _query_ of Replicache and you will get notified when that query changes for any reason — either because of local optimistic changes, or because of sync.
:::info
Performance notes: Replicache only calls the query function (the parameter to subscribe) when any of the keys it accessed last time change. And the onData callback is only called when the result of the query function changes. Finally, Replicache will usually return objects with the same identity across queries, so you can use things like React’s useMemo to avoid re-renders.
:::

## Challenge

Modify the sample to add an `<input type="number">` to specify the amount to increment by. Verify that when you increment by zero, no log message appears.

#### [Next: Sync &rarr;](/sync)

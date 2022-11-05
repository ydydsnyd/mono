---
title: Adding Mutators
slug: /adding-mutators
---

<iframe src="https://codesandbox.io/embed/replicache-mutators-yb4jqj?autoresize=1&fontsize=12&hidenavigation=0&theme=light&highlights=10,11,12,13,14,15&codemirror=1&view=split"
     style={{'width':'100%','height':'525px', 'border':0,'border-radius': '4px', 'overflow':'hidden'}}
     title="replicache-sync"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

_Mutators_ are how you change data in Replicache.

Mutators are arbitrary functions that run once on the client immediately (aka “optimistically”), **and then run again later on the server** (”authoritatively”) during sync.

Replicache queues mutations locally until the server acknowledged them during sync. Once the authoritative server result is known, Replicache reverts the optimistic version completely.

## Challenge

Try adding your own multiply mutator.

#### [Next: Subscriptions &rarr;](/subscriptions)

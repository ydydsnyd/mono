---
title: Constructing Replicache
slug: /constructing-replicache
---

<iframe src="https://codesandbox.io/embed/replicache-constructing-f9z2c3?autoresize=1&fontsize=12&hidenavigation=0&theme=light&highlights=19,20,21&codemirror=1&view=split"
     style={{'width':'100%','height':'525px', 'border':0,'border-radius': '4px', 'overflow':'hidden'}}
     title="replicache-sync"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

The Replicache constructor requires a _name_ and _licenseKey._

Replicache instances in different tabs that have the same name share storage. You can create any number of such names.

For licenseKey, you can use the TEST_LICENSE_KEY as this sample does, but it only works for five minutes.

## Challenge

To use Replicache for longer, get your own license key and use it here instead of TEST_LICENSE_KEY. (Don’t worry, it’s fast, easy, and free for many cases including tire-kicking).

#### [Next: Mutators &rarr;](/adding-mutators)

---
title: Overview
slug: /concepts/diff/overview
---

# Backend Strategies

Replicache defines [push](/reference/server-push.md) and [pull](/reference/server-pull.md) endpoints that servers must implement to sync. There are a number of possible strategies to implement these endpoints.

The main difference is how they calcuate the `patch` required by the pull endpoint. Different approaches to calculating this patch require different state to be stored in the backend database, and also affects the logic of the push endpoint.

This section summarizes some common approaches, and their differences. They are arranged in increasing order of complexity and build on each other. So it's worth reading through them all, even if you think you know the one you will use.

Our general recommendation is to start with the [Global Version](/concepts/diff/global-version) strategy and move to [Row Versioning](/concepts/diff/row-version) when you need either increased flexibility or throughput.

<table>
    <thead>
        <tr>
            <th>Strategy</th>
            <th>Correct?</th>
            <th>Performance</th>
            <th>Implementation</th>
            <th>Flexibility</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td align="center" nowrap="true"><a href="/concepts/diff/reset"><b>🤪 Reset</b></a></td>
            <td align="center">✅</td>
            <td>😅 Really just useful for understanding Replicache or for very tiny applications.</td>
            <td align="center" nowrap="true">👍🏼 Trivial</td>
            <td>👍🏼 Very flexible – supports deletes, auth changes automatically.</td>
        </tr>
        <tr>
            <td align="center" nowrap="true"><a href="/concepts/diff/global-version"><b>🌏 Global Version</b></a></td>
            <td align="center">✅</td>
            <td>🤷🏻 Limits write throughput across application to about 50 pushes/second</td>
            <td align="center" nowrap="true">👍🏼 Trivial</td>
            <td>🤷🏻 Requires soft-deletes and special care to support auth changes and incremental sync.</td>
        </tr>
        <tr>
            <td align="center" nowrap="true"><a href="/concepts/diff/per-space-version"><b>🛸 Per-Space Version</b></a></td>
            <td align="center">✅</td>
            <td>🤷🏻 Limits write throughput per-space to about 50 pushes/second</td>
            <td align="center" nowrap="true">🤷🏻 Moderately difficult</td>
            <td>😅 Same issues as global version, plus must partition data into spaces.</td>
        </tr>
        <tr>
            <td align="center" nowrap="true"><a href="/concepts/diff/row-version"><b>🚣 Row Versioning</b></a></td>
            <td align="center">✅</td>
            <td>👍🏼 Increased read and write load in pull, but no contention anywhere so quite scalable</td>
            <td align="center" nowrap="true">😅 More difficult</td>
            <td>👍🏼 Very flexible – supports deletes, auth changes, and incremental sync easily.</td>
        </tr>
    </tbody>
</table>

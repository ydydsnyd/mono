---
title: Performance
slug: /performance
---

## Performance Intuitions

Your intuition should be that Replicache has "memory-fast" performance for common operations. Here are some rough rules of thumb you that should serve you well.

| Operation                              | Expectation            |
| -------------------------------------- | ---------------------- |
| Read 1 value                           | < 1ms                  |
| Read (scan) keys in order              | > 500 MB/s             |
| Write 1 value and commit tx            | < 1ms                  |
| Write 1KB values in bulk and commit tx | > 20 MB/s              |
| Start from disk                        | First 100KB in < 150ms |

## Typical Workload

Here are some axes along which you could measure the workload that Replicache is designed to work with. These are not hard constraints, they give ranges in which we would expect Replicache to work without caveats. If you want to operate outside of these ranges, it's probably a good idea to talk to us.

| Axis                                 | Expectation                               |
| ------------------------------------ | ----------------------------------------- |
| Total data size                      | < 64MB per Replicache instance            |
| Typical key-value size               | < 100KB                                   |
| Max key-value size                   | < 1MB (see also [blobs](recipe-blobs.md)) |
| Average push-pull round trip latency | 100's of ms                               |
| Number of indexes                    | < 10                                      |

## Specific Performance Metrics

Below find specific performance metrics that Replicache meets or exceeds. Automated performance testing is part of our continuous integration strategy, so these performance metrics are monitored for every change we make to the codebase.
<br><br>

TODO

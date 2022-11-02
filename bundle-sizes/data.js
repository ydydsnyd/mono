window.BENCHMARK_DATA = {
  "lastUpdate": 1667400159112,
  "repoUrl": "https://github.com/rocicorp/replicache-internal",
  "entries": {
    "Bundle Sizes": [
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da05aa3319dedf3ad93862c2349cc097e41d9382",
          "message": "feat: Add Brotli compressed bundle sizes to Bundle Sizes dashboard (#679)\n\n### Problem\r\nBundle Size dashboard https://rocicorp.github.io/replicache/bundle-sizes/ and associated alerts currently only track non-compressed sizes of bundles.  What we really care about is Brotli compressed size.\r\n\r\n### Solution\r\nAdd Brotli compressed sizes of bundles to dashboard and alert.\r\nTo do this needed to move from `self-hosted` runner to `ubuntu-latest` as `brotli` command was not available in the `self-hosted` environment (but is in `ubuntu-latest`).  This is fine as we don't care about cpu/memory isolation for this benchmark as we do for the performance benchmarks, because we are just measuring byte size.",
          "timestamp": "2021-11-09T08:59:18-08:00",
          "tree_id": "e6c7667d804131fff367901c076321d5c4d8751a",
          "url": "https://github.com/rocicorp/replicache/commit/da05aa3319dedf3ad93862c2349cc097e41d9382"
        },
        "date": 1636477222293,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184990,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184636,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34659,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6996df2a55e0ad54d319dc1ee71c2dca19658eb3",
          "message": " docs: Add Bundle Sizes dashboard to HACKING.md (#680)",
          "timestamp": "2021-11-09T22:00:36Z",
          "tree_id": "1430b464de31793607ce754674c6881cbe62252d",
          "url": "https://github.com/rocicorp/replicache/commit/6996df2a55e0ad54d319dc1ee71c2dca19658eb3"
        },
        "date": 1636495296507,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184990,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184636,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34659,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "10153e05a9c8101428580a739f37524a639a9896",
          "message": "add checklist item for passing name to constructor",
          "timestamp": "2021-11-11T16:15:40-10:00",
          "tree_id": "802a122c7481f65a65e03f6f941c85c94a7dd81c",
          "url": "https://github.com/rocicorp/replicache/commit/10153e05a9c8101428580a739f37524a639a9896"
        },
        "date": 1636683415761,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184990,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184636,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34659,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9533421da8c2dcd39a206bac26788f7e69e71ebc",
          "message": "feat: Functionality for managing the ClientMap needed for Simplified Dueling Dags (#683)\n\nIn the Simplified Dueling Dags design for Realtime Persistence, each tab is a `client` and has its own `perdag` - an instance of `dag.Store` backed by IDB.  All tabs' `perdag` instances are backed by the same IDB object store, thus they share physical storage. \r\n\r\nTo keep track of each client's current `headHash` (and additional metadata such as heartbeatTimestampMS used for garbage collection of client perdags), a new `ClientMap` data structure is introduced.  The `ClientMap` is stored in a chunk in the `perdag` at the head `'clients'`.  This `ClientMap` chunk contains refs to each client's `headHash`.\r\n\r\nThis change implements helpers for reading and writing the `ClientMap`.     \r\n\r\nSee larger design at https://www.notion.so/Simplified-DD1-1ed242a8c1094d9ca3734c46d65ffce4\r\n\r\nPart of #671",
          "timestamp": "2021-11-12T14:36:39-08:00",
          "tree_id": "d91a7c4eefbaedecebc2f6b84af8e5f307d2df6d",
          "url": "https://github.com/rocicorp/replicache/commit/9533421da8c2dcd39a206bac26788f7e69e71ebc"
        },
        "date": 1636756664638,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34683,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "debd66e99de171002dbfef9310b135b628c08f31",
          "message": "fix: improve test description grammar in clients.test.ts (#684)",
          "timestamp": "2021-11-12T22:46:14Z",
          "tree_id": "2393949e016e01ee7f832025b2c1bd05591879a3",
          "url": "https://github.com/rocicorp/replicache/commit/debd66e99de171002dbfef9310b135b628c08f31"
        },
        "date": 1636757240192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34683,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5dcc0e1bfb263bac50b27775730a12b40c81eeaa",
          "message": "chore: Allow unused vars starting with underscore (#691)",
          "timestamp": "2021-11-16T00:48:44Z",
          "tree_id": "0aa4e7f3dfbe6460cd65527115c86e9affe08c2e",
          "url": "https://github.com/rocicorp/replicache/commit/5dcc0e1bfb263bac50b27775730a12b40c81eeaa"
        },
        "date": 1637023801445,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34683,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "02a55e50e969d1e1a8e1d7f0a5ad5e731640c01c",
          "message": "chore: Address review comments on commit 9533421 (#693)\n\nSee https://github.com/rocicorp/replicache/pull/683",
          "timestamp": "2021-11-16T16:38:06Z",
          "tree_id": "e02c7eb284ca8f71fc67ffab2f1cf6919f5902a7",
          "url": "https://github.com/rocicorp/replicache/commit/02a55e50e969d1e1a8e1d7f0a5ad5e731640c01c"
        },
        "date": 1637080751187,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185006,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34830,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184652,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34709,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6b18ad07e3c3afd2978c8c37e0a57ae34c8d16c1",
          "message": "feat: Implement heartbeats mechanism needed for Client state garbage collection for Simplified Dueling Dags\n\nSimplified Dueling Dags requires a mechanism for collecting the perdag state for Clients (i.e. tabs) which have been closed.\r\n\r\nA Client (i.e. tab) that has been closed cannot reliably clean up its own state (due to crashes and force closes).  It is difficult for other Client (i.e. tabs) to determine if a tab has been closed and is gone for ever, or just has been frozen for a long time.  The approach taken here is to have each Client update a heartbeatTimestampMS once per minute while it is active.  Other Client's then collect a Client only if it hasn't been active for a very long time (current plan is 1 week).\r\n\r\nA client's heartbeat time is also updated when its memdag is persisted to the perdag.  This way the \"newest\" client state is roughly the state of the client with the most recent heartbeat time, which is useful for determining which client state a new client should choose for bootstrapping. \r\n\r\nA timestamp is used (as opposed to a heartbeat counter) in order to support expiration periods much longer than a typical session (e.g. 7 days).\r\n\r\nSee larger design at https://www.notion.so/Simplified-DD1-1ed242a8c1094d9ca3734c46d65ffce4\r\n\r\nPart of #671",
          "timestamp": "2021-11-16T16:54:14Z",
          "tree_id": "866491cc5cf051f5787bad2d3151b26e9be3405c",
          "url": "https://github.com/rocicorp/replicache/commit/6b18ad07e3c3afd2978c8c37e0a57ae34c8d16c1"
        },
        "date": 1637081717532,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185006,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34830,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184652,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34709,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9a4a5100173ac577e167f5838c6b35d4a7b60cf1",
          "message": "feat: Implements Client state Garbage Collection for Simplified Dueling Dags (#689)\n\nSimplified Dueling Dags requires a mechanism for collecting the perdag state for Clients (i.e. tabs) which have been closed.\r\n\r\nEvery **five minutes**, each Client collects any Clients that haven't updated their heartbeat timestamp **for at least seven days**. \r\n\r\nSee larger design at https://www.notion.so/Simplified-DD1-1ed242a8c1094d9ca3734c46d65ffce4\r\n\r\nPart of #671",
          "timestamp": "2021-11-16T17:26:47Z",
          "tree_id": "57bd8b69d05ccce9336b15c615de5c24a9ada2c0",
          "url": "https://github.com/rocicorp/replicache/commit/9a4a5100173ac577e167f5838c6b35d4a7b60cf1"
        },
        "date": 1637083672990,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185006,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34830,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184652,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34709,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ee9ed0ded7638b9881c487a0814e60cfabd2ddf4",
          "message": "refactor: Skip creating a Chunk & Commit in migrate (#694)\n\nThese extra objects are not needed here and makes other things harder to\r\nachieve.",
          "timestamp": "2021-11-16T19:35:39Z",
          "tree_id": "54dcd7f6326037bbc924d0226f6b0b4b510061c1",
          "url": "https://github.com/rocicorp/replicache/commit/ee9ed0ded7638b9881c487a0814e60cfabd2ddf4"
        },
        "date": 1637091409965,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184996,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34808,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184642,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34713,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "123687f2b772e8255894fb5820aaf12d831e9b4e",
          "message": "refactor: Make the hash function a property of the dag store (#695)\n\nThe dag store now takes the function to use when computing the hash of a\r\nchunk. This is needed because we want to use differn hash functions for\r\nmemdag and perdag.\r\n\r\nTowards #671",
          "timestamp": "2021-11-16T13:34:20-08:00",
          "tree_id": "f5ef20ab65404b9695d9151f722b46301da67cba",
          "url": "https://github.com/rocicorp/replicache/commit/123687f2b772e8255894fb5820aaf12d831e9b4e"
        },
        "date": 1637098524749,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185761,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185407,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34797,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "63a05379b317a84e7ad80fb5624370619e3e790a",
          "message": "fix: Fix bug where pusher/puller/pushURL/pullURL set after construction are ignored if initially none set. (#696)\n\nAlso updates tests to cover these cases.\r\n\r\nFixes #685",
          "timestamp": "2021-11-16T23:19:53Z",
          "tree_id": "0acd8b7078c5237cdf8a3543315696191fe046f4",
          "url": "https://github.com/rocicorp/replicache/commit/63a05379b317a84e7ad80fb5624370619e3e790a"
        },
        "date": 1637104855244,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34875,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185150,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34736,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d85d41e12214c88c9d7a9cfa7976ede120379fd8",
          "message": "refactor: Do not use temp hash as a sign of mutability in B+Tree (#697)\n\nWe used to use isTempHash to determine if the B+Tree node was mutable or\r\nnot (isTempHash === true => mutable). This is not going to work when the\r\nwhole MemDag is going to use temp hashes. Instead, use a flag on the\r\nnode.\r\n\r\nTowards #671",
          "timestamp": "2021-11-16T23:28:45Z",
          "tree_id": "2b022f710fa27dc85aa2024bf2d2a08af9d64efc",
          "url": "https://github.com/rocicorp/replicache/commit/d85d41e12214c88c9d7a9cfa7976ede120379fd8"
        },
        "date": 1637105384344,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185606,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34910,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185252,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34746,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "126b6a7e1918544d691bcd1a79f5ddae2f8dca0c",
          "message": "refactor: Make assertValidChunk part of dag Store (#698)\n\nFor memdag we will allow temp hashes but for perdag we will not.\r\n\r\nTowards #671",
          "timestamp": "2021-11-17T00:44:32Z",
          "tree_id": "5092a6fdda5e931512d51568d3954760d9a9bb66",
          "url": "https://github.com/rocicorp/replicache/commit/126b6a7e1918544d691bcd1a79f5ddae2f8dca0c"
        },
        "date": 1637109924751,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185875,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34884,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185521,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7ad07333fb6ea30a0e431a74aa942b3a5efe9997",
          "message": "refactor: Move createChunk to dag.Write (#699)\n\nIt was not needed on dag.Read.\r\n\r\nFollowup to #695",
          "timestamp": "2021-11-17T18:30:26Z",
          "tree_id": "611160eae10e771db88caa74c996b8e28f2f1ec0",
          "url": "https://github.com/rocicorp/replicache/commit/7ad07333fb6ea30a0e431a74aa942b3a5efe9997"
        },
        "date": 1637173893837,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185811,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34937,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34775,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "78c046eb0a372a03b64cdfda1f47a14e3a637ad8",
          "message": "refactor: Rename _kvr to _tx (#700)\n\nSince it is either a kv.Read or a kv.Write transaction.\r\n\r\nFollowup to #698",
          "timestamp": "2021-11-17T18:38:55Z",
          "tree_id": "4ef7b82fef552d81542061cae911535c52e96384",
          "url": "https://github.com/rocicorp/replicache/commit/78c046eb0a372a03b64cdfda1f47a14e3a637ad8"
        },
        "date": 1637174399505,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185790,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34921,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185436,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34783,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "268c15c4d6043a93763c89b15941cde1580e96e5",
          "message": "refactor: Add back parse to dag/key.ts (#701)\n\nI need it for a test I'm writing...",
          "timestamp": "2021-11-17T20:25:51Z",
          "tree_id": "925063e5e1fb7037ce2085ee200eaa448f62396b",
          "url": "https://github.com/rocicorp/replicache/commit/268c15c4d6043a93763c89b15941cde1580e96e5"
        },
        "date": 1637180806946,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186070,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34973,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185716,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "71d5cbee735b4e55ab03fa1ad4b1da043d23b250",
          "message": "Update HACKING.md",
          "timestamp": "2021-11-17T15:03:56-08:00",
          "tree_id": "98955436162abc5380c12335eb0fa5ba13e1dec2",
          "url": "https://github.com/rocicorp/replicache/commit/71d5cbee735b4e55ab03fa1ad4b1da043d23b250"
        },
        "date": 1637190296158,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186070,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34973,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185716,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "e9da6cfdbe765d23d9719760bc4fc54df6c5af10",
          "message": "remove weblock test",
          "timestamp": "2021-11-17T17:12:43-10:00",
          "tree_id": "7ae962619ddfb419f29909ae36807ca30149c19f",
          "url": "https://github.com/rocicorp/replicache/commit/e9da6cfdbe765d23d9719760bc4fc54df6c5af10"
        },
        "date": 1637205226509,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186070,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34973,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185716,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8c50cb4dce1267fdf89c9bf67ce2e3b00df128b0",
          "message": "fix: Fix migraion of head (#708)\n\nThe migration from v1 to v2 was not updating the head so the migrated\r\ndag was GC'ed and the old dag was being kept.\r\n\r\nFixes #704",
          "timestamp": "2021-11-18T21:37:11Z",
          "tree_id": "f481b8d22633ae0b0d4544e2395fae3e45ed7dd9",
          "url": "https://github.com/rocicorp/replicache/commit/8c50cb4dce1267fdf89c9bf67ce2e3b00df128b0"
        },
        "date": 1637271499749,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186129,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34951,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185775,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34884,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f0c31e44c1d45be7a3382f6899cca9ad4bd80f3e",
          "message": "fix: Write the empty BTree node to the dag store (#709)\n\nPreviously we used the empty hash and didn't write this chunk. It meant\r\nthat there were refs that were the empty hash and the system had to be\r\nresilient to the valueHash being an empty hash etc.",
          "timestamp": "2021-11-18T21:45:31Z",
          "tree_id": "11c04e445113a25530dbb21cfc193a0423808496",
          "url": "https://github.com/rocicorp/replicache/commit/f0c31e44c1d45be7a3382f6899cca9ad4bd80f3e"
        },
        "date": 1637271994228,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186270,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185916,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34858,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4bcae282030d4ce84e2ef5cb3fc45f16e152be22",
          "message": "refactor: Add PersistGatherVisitor (#702)\n\nAdd a DB/Dag Visitor -- This walks the entire dag using a semantic\r\nvisitor, which knows what each chunk represents.\r\n\r\nThen implement the PersistGatherVisitor as a visitor of the Dag Visitor\r\nwhich stops the traversal when it finds a non temp hash. It collects all\r\nthe chunks it sees and exposes them as a property.\r\n\r\nTowards #671",
          "timestamp": "2021-11-18T18:01:41-08:00",
          "tree_id": "c4956185616bada4ed21491ce0942334b5dd7531",
          "url": "https://github.com/rocicorp/replicache/commit/4bcae282030d4ce84e2ef5cb3fc45f16e152be22"
        },
        "date": 1637287367817,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186447,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35103,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186093,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34960,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "f63c28be2033af13c3dd6bc0c1fc272596b38480",
          "message": "address code review comments",
          "timestamp": "2021-11-18T20:46:37-10:00",
          "tree_id": "ee51c3f62b883eb3bdc7f044965b4d27ac756787",
          "url": "https://github.com/rocicorp/replicache/commit/f63c28be2033af13c3dd6bc0c1fc272596b38480"
        },
        "date": 1637304459481,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187025,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35162,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186671,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35000,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1fbcba8027a7a7aea04e3d6844b43128837ad422",
          "message": "refactor: remove default value of Meta for Commit's  M type param to improve typing of Commit (#715)\n\n### Problem\r\nHaving a default value of Meta for Commit's M type param led to less specific typing in many places. \r\n\r\n### Solution\r\nRemove the default and make typing more specific where possible.",
          "timestamp": "2021-11-19T12:20:41-08:00",
          "tree_id": "955289bad92a5f1b732439ac32d077b978ce5ff6",
          "url": "https://github.com/rocicorp/replicache/commit/1fbcba8027a7a7aea04e3d6844b43128837ad422"
        },
        "date": 1637353310708,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186946,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186592,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34990,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "186bb707de1b2d421b61d291a3bc010b05c74b22",
          "message": "fix: Provide more details to logger when push or pull fails (#716)\n\n### Problem\r\nPush and pull error logging lacks sufficient detail to debug errors.\r\n\r\nA pull failure currently logs to info (and a push error logs essentially the same):\r\n`Pull returned: PullError: Failed to pull`\r\n\r\nNot the most useful logging.  However, our `PushError` and `PullError` classes have a `cause?: Error` property with details on the underlying cause, it is just not logged.\r\n\r\n### Solution\r\nIf the error is a `PushError` or `PullError`, log the cause.\r\n\r\nUpdate log format to include stack traces for both the error, and cause.\r\n\r\nAlso update to use `error` instead of `info` logging.\r\n\r\nCloses #690",
          "timestamp": "2021-11-19T13:13:11-08:00",
          "tree_id": "950b3b51a836e7bd7295f81a785b14d499788f5d",
          "url": "https://github.com/rocicorp/replicache/commit/186bb707de1b2d421b61d291a3bc010b05c74b22"
        },
        "date": 1637356451353,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187112,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35140,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186758,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35019,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "15703ca4396be61447be6e572600e6b7fac5b9d6",
          "message": "refactor: Optimize scan (#717)\n\nThere are two kinds of optimizations in here:\r\n\r\n1. Get rid of intermediate for await loops.\r\n2. Get rid of yield*\r\n\r\nBoth of these adds extra Promise and IteratorResult objects.\r\n\r\nBy passing the convertEntry function all the way down into the BTree\r\niterator we do not need the intermediate for await loops.\r\n\r\nIn a few places we can return the async iterable iterator instead of\r\nyield* it. This only works if the function/method is not `async` of\r\n`async *`.\r\n\r\nTowards #711",
          "timestamp": "2021-11-19T20:42:54-08:00",
          "tree_id": "669656b5ed75ea43a0f7410caeb8b92d1d61bb32",
          "url": "https://github.com/rocicorp/replicache/commit/15703ca4396be61447be6e572600e6b7fac5b9d6"
        },
        "date": 1637383432096,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187327,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35199,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186973,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35042,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e9c2d7da548fc6e9c61c3b714390d0f5e10cf3c4",
          "message": "fix: Remove log spew from test (#720)\n\nThe mock fetch was returning `{}` which is not a valid PullResponse",
          "timestamp": "2021-11-22T10:50:17-08:00",
          "tree_id": "a614d776b75d54cb4781a0f9dbeb38cbd2d90d73",
          "url": "https://github.com/rocicorp/replicache/commit/e9c2d7da548fc6e9c61c3b714390d0f5e10cf3c4"
        },
        "date": 1637607071671,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187327,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35199,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186973,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35042,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "08ef17fa16e66267077de90e305fffdb44eb06b2",
          "message": "fix: correct log levels for push and pull errors to follow style guidelines (#719)\n\n### Problem\r\nPush and pull errors are being logged at level `error`, which violates our style guide for log levels: https://github.com/rocicorp/replicache/blob/main/CONTRIBUTING.md#style-general\r\n\r\n### Solution\r\nUpdate to use `info` level instead.",
          "timestamp": "2021-11-22T11:29:05-08:00",
          "tree_id": "68940fa618c677811048c59fab22c8225708931d",
          "url": "https://github.com/rocicorp/replicache/commit/08ef17fa16e66267077de90e305fffdb44eb06b2"
        },
        "date": 1637609399689,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187325,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35149,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186971,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35103,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b549045d3da37eb5b47d61a5c37d7b6997f6c4f4",
          "message": "fix: Silence and check error message (#722)\n\nThe test was hitting `console.error` which is good because it means the\r\ncode works. But we do not want errors to escape the tests. Instead\r\ninstall a stub for console.error and check that it was called.",
          "timestamp": "2021-11-22T21:11:48Z",
          "tree_id": "f296eae1275ee8d80c4c91aef2daa89927141929",
          "url": "https://github.com/rocicorp/replicache/commit/b549045d3da37eb5b47d61a5c37d7b6997f6c4f4"
        },
        "date": 1637615569327,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187325,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35149,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186971,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35103,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "981248bf0caefd60754db4a64eb59524250dda8b",
          "message": "feat: Simplified Dueling Dags - Implement initing a new client including bootstraping from existing client state. (#712)\n\nSimplified Dueling Dags always creates a new Client for each new tab.  To enable fast startup of new tabs utilizing previous stored data Simplified Dueling Dags bootstraps new clients by forking an existing Client's state. \r\n\r\nWhen forking from another Client, the fork should be based on the existing Client's most recent base snapshot (which may not be its latest head).  This is necessary because pending mutations (LocalMutationCommits) cannot be forked as the last mutation id series is different per client.\r\n\r\nIt is important that the last mutation id for the new client be set to 0, since a replicache server implementation will start clients for which they do not have a last mutation id stored at last mutation id 0.  If the server receives a request from a client with a non-0 last mutation id, for which it does not have a last mutation id stored, it knows that it is unsafe for it to execute mutations form the client, as it could result in re-running mutations or otherwise failing to guarantee sequential execution of mutations.  This tells the server that this is an old client that it has GC'd (we need some way to signal this to the client so it can reset itself, see https://github.com/rocicorp/replicache/issues/335). \r\n\r\nWhen choosing a Client to bootstrap from, it is safe to pick any Client, but it is ideal to chose the Client with the most recent snapshot from the server.  Currently the age of snapshots is not stored, so this implementation uses a heuristic of choosing the base snapshot of the Client with the newest heartbeat timestamp. \r\n\r\nSee larger design at https://www.notion.so/Simplified-DD1-1ed242a8c1094d9ca3734c46d65ffce4#64e4299105dd490a9ffbc6c9c771f5d2\r\n\r\nPart of #671",
          "timestamp": "2021-11-22T14:54:58-08:00",
          "tree_id": "0438301398305ead0cb6f1d1ea6a99ef4ef18d2d",
          "url": "https://github.com/rocicorp/replicache/commit/981248bf0caefd60754db4a64eb59524250dda8b"
        },
        "date": 1637621764722,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187325,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35149,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186971,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35103,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "058d17429a8b96780776bd2f39b1213094df5e16",
          "message": "feat: Add Persist Writer (#723)\n\nUse a Transformer to transform one dag tree into another.\r\n\r\nThen use this to implement a Persist Writer which uses the previous\r\ngathered chunks to determine what to write.\r\n\r\nTowards #671",
          "timestamp": "2021-11-23T16:40:01-08:00",
          "tree_id": "ab7f320030d3b25f28a7a938d93a08c786cfb06d",
          "url": "https://github.com/rocicorp/replicache/commit/058d17429a8b96780776bd2f39b1213094df5e16"
        },
        "date": 1637714469999,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187327,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35162,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186973,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35036,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c1daafb647a418aac0dbd9f524bc9fc81c2fddab",
          "message": "feat: Add Persist Fixup Transformer (#726)\n\nThis is another transformer that changes the hashes in a DAG. It walks\r\ndown the DAG and \"rewrites\" chunks with a new hash, provided as a\r\nmapping from old hash to new hash. The old chunks will get garbage\r\ncollected as usual.\r\n\r\nTowards #671",
          "timestamp": "2021-11-29T12:58:34-08:00",
          "tree_id": "a4efe0191a8af00489944c95df1913d8ac67972e",
          "url": "https://github.com/rocicorp/replicache/commit/c1daafb647a418aac0dbd9f524bc9fc81c2fddab"
        },
        "date": 1638219575390,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187347,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35234,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186993,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35066,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c62688fa2b642e9cb30f99c9e8941b2c2b325814",
          "message": "refactor: Rename HashType -> HashRefType (#728)",
          "timestamp": "2021-11-29T21:51:24Z",
          "tree_id": "feae4c9d117afa0b36577f017436a81a313d26b6",
          "url": "https://github.com/rocicorp/replicache/commit/c62688fa2b642e9cb30f99c9e8941b2c2b325814"
        },
        "date": 1638222749137,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187375,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35189,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187021,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35094,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "595e2080c81118598507f71b339718cc17f34980",
          "message": "feat: A transformer that computes the chunk hash (#727)\n\nThis does not need a `dag.Read` or `dag.Write`. It only operates on the\r\ngathered chunks in the map from the previous step.\r\n\r\nThe input is a `Map<TempHash, Chunk<TempHash>>` and the output is the\r\nsame logical map but the hashes have been computed based on the chunk\r\ndata; `Map<PerHash, Chunk<PerHash>>`\r\n\r\nTowards Implement Dueling Dags #671",
          "timestamp": "2021-11-29T22:04:23Z",
          "tree_id": "68e2ed63093fd5546b9ac01b375e73cdb1a350ec",
          "url": "https://github.com/rocicorp/replicache/commit/595e2080c81118598507f71b339718cc17f34980"
        },
        "date": 1638223544600,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187415,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35216,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35083,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9481c4c9c98824eb61351652590e2a76fbb8243d",
          "message": "refactor: Rename hash in db transformer (#729)\n\nUse NewHash and OldHash type aliases",
          "timestamp": "2021-11-29T14:19:36-08:00",
          "tree_id": "3a14d318369964c4e54758ef112ce6571e37a420",
          "url": "https://github.com/rocicorp/replicache/commit/9481c4c9c98824eb61351652590e2a76fbb8243d"
        },
        "date": 1638224441684,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187415,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35216,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35083,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "764f55e3acad523db351d26814241fedd5c6aa5d",
          "message": "feat: Add mappings to db.Transformer (#730)\n\nThis writes the `Map<OldHash, NewHash>` as the transformer writes new\r\nchunks\r\n\r\nTowards #671",
          "timestamp": "2021-11-29T14:50:12-08:00",
          "tree_id": "3c2429d283df9c2b6ed9890a5ab349da773ccc61",
          "url": "https://github.com/rocicorp/replicache/commit/764f55e3acad523db351d26814241fedd5c6aa5d"
        },
        "date": 1638226275930,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187415,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35216,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35083,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d9a71bc9bba229c02820b228492aed80055a4232",
          "message": "chore: Update to TS 4.5 (#731)",
          "timestamp": "2021-11-29T23:13:02Z",
          "tree_id": "489d506acefea690ec4c97348b3998013d5728b6",
          "url": "https://github.com/rocicorp/replicache/commit/d9a71bc9bba229c02820b228492aed80055a4232"
        },
        "date": 1638227653034,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34908,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34813,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b57c94ff9a0f6be3c8eb902c7bd3b09f4635f526",
          "message": "chore: Update web test runner and deps (#732)",
          "timestamp": "2021-11-29T23:29:34Z",
          "tree_id": "757f1d3f3ef72908e4af5571c5ff92eb9a294381",
          "url": "https://github.com/rocicorp/replicache/commit/b57c94ff9a0f6be3c8eb902c7bd3b09f4635f526"
        },
        "date": 1638228641090,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34908,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34813,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "5e4afe41b36cb118680a72bcee25d5e0be2713c4",
          "message": "refactor: Rename classes",
          "timestamp": "2021-11-29T15:45:37-08:00",
          "tree_id": "3b032c8809033402712d8cc34c3268e331629ea7",
          "url": "https://github.com/rocicorp/replicache/commit/5e4afe41b36cb118680a72bcee25d5e0be2713c4"
        },
        "date": 1638229598330,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34908,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34813,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "febb5b7850e578fcb9d28ac34c40ec826511c1f5",
          "message": "fix: Persist Write Transformer should preserve hashes (#734)\n\nNow we precompute the hashes of the chunks we are going to write so we\r\nneed to preserve the hashes of the chunks passed in.\r\n\r\nTowards #671",
          "timestamp": "2021-11-30T11:47:50-08:00",
          "tree_id": "0b72a243a323014e3ceabd33be923e97d9ef8975",
          "url": "https://github.com/rocicorp/replicache/commit/febb5b7850e578fcb9d28ac34c40ec826511c1f5"
        },
        "date": 1638301727334,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34925,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34839,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1bb8f57514f85290571577bf8aeabf33d53326c3",
          "message": "feat: Add nativeHashOf (#736)\n\nAnd change type signature of hashOf to take a JSON value as well.",
          "timestamp": "2021-11-30T15:22:04-08:00",
          "tree_id": "445490f7a5b19347bd0a94806fd43ac58289c941",
          "url": "https://github.com/rocicorp/replicache/commit/1bb8f57514f85290571577bf8aeabf33d53326c3"
        },
        "date": 1638314589881,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34894,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34790,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "56f34dbd0ca3b49551b6fd9e53ea64f67c2257ab",
          "message": "refactor: Move sync/client to persist (#737)",
          "timestamp": "2021-11-30T23:27:25Z",
          "tree_id": "fd6253a068d52e058d36ec36d7f919f194684d9e",
          "url": "https://github.com/rocicorp/replicache/commit/56f34dbd0ca3b49551b6fd9e53ea64f67c2257ab"
        },
        "date": 1638314900258,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34894,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34790,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7769f098922ccfaf05275834f1d179dce35f1941",
          "message": "feat: Add top level persist function (#738)\n\nThis combines the different persist steps into a single function.\r\n\r\nTowards #671",
          "timestamp": "2021-11-30T16:16:44-08:00",
          "tree_id": "a7b57fc71e057a964a7595442ddd2d42d7907619",
          "url": "https://github.com/rocicorp/replicache/commit/7769f098922ccfaf05275834f1d179dce35f1941"
        },
        "date": 1638317875307,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34894,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34790,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3774ee574c60dadfd0d1838cad772bbbd07f4d1d",
          "message": "refactor: Remove persist WriteTransformer (#739)\n\nTurns out that we can just write the chunks since we computed the hashes\r\nin an earlier step.\r\n\r\nPersist ComputeTransformer now takes over some of the work of\r\nWriteTransformer.\r\n\r\nTowards #671",
          "timestamp": "2021-11-30T16:42:02-08:00",
          "tree_id": "b2f1822cbff505e219d07816cf59e822c8a3b80f",
          "url": "https://github.com/rocicorp/replicache/commit/3774ee574c60dadfd0d1838cad772bbbd07f4d1d"
        },
        "date": 1638319382280,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34894,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34790,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5aa948f4d672290172792aa86ce02d83d51c77b4",
          "message": "feat!: Include versions in IDB name (#741)\n\nFor Simplified Dueling Dags we need to ensure that different tabs\r\nrunning different versions of Replicache do not interact with IDB data\r\nit does not know how to read/write.\r\n\r\nTo achieve this the name if the IDB database now contains the\r\n`REPLICACHE_FORMAT_VERSION` (which is currently at `3`).\r\n\r\nThe IDB name also contains the `schemaVersion` som if the schema changes\r\na fresh IDB database is used. The motivation is the same. Multiple tabs\r\nwith different schemaVersions should not interact with the same IDB\r\ndatabase.\r\n\r\nBREAKING CHANGE\r\n\r\nTowards #671",
          "timestamp": "2021-12-02T11:10:18-08:00",
          "tree_id": "67017af060aaec2267e5b8a4364522faad25ad08",
          "url": "https://github.com/rocicorp/replicache/commit/5aa948f4d672290172792aa86ce02d83d51c77b4"
        },
        "date": 1638472288919,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186627,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34966,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34850,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6b6d213bb554525a6834ce2cb8e5b76ebfa7f934",
          "message": "refactor: Use abstract db transformer (#744)\n\nThe old code was pretty silly and used runtime type checks. Now we use\r\nan abstract base class and static type checking.",
          "timestamp": "2021-12-02T19:40:31Z",
          "tree_id": "2f8163c1d1660a21218ef59c2eeae2a1e1e41b3c",
          "url": "https://github.com/rocicorp/replicache/commit/6b6d213bb554525a6834ce2cb8e5b76ebfa7f934"
        },
        "date": 1638474094681,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186627,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34966,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34850,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9b0af12031ba19b1c27b5372ba3f18f60df2307d",
          "message": "refactor: persist test to usa a suite (#745)",
          "timestamp": "2021-12-02T20:00:31Z",
          "tree_id": "25f5e4a33cbd87f1332df015bed6c573c0e4679d",
          "url": "https://github.com/rocicorp/replicache/commit/9b0af12031ba19b1c27b5372ba3f18f60df2307d"
        },
        "date": 1638475302301,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186627,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34966,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34850,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f2d0d0c6cfdbcaf351ab71b29060314bfa9f6731",
          "message": "refactor: Make commit statics module functions (#749)\n\nStatic methods are generally an anti-pattern in JS. They are sometimes\r\nnice from an API perspective, but tree shaking generally has problems\r\nwith them.\r\n\r\nThe only real valid use case I can think of is when you need to inherit\r\nstatic methods. In other words when your statics references `this`.",
          "timestamp": "2021-12-02T16:26:52-08:00",
          "tree_id": "3bd6ea9d57c96a9ad5c85867bac2be7dda672472",
          "url": "https://github.com/rocicorp/replicache/commit/f2d0d0c6cfdbcaf351ab71b29060314bfa9f6731"
        },
        "date": 1638491279135,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186385,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35014,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34912,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3d65d8110a477049d5b8afdbc179702e7c26434d",
          "message": "chore: Add sync head test for persist (#750)\n\nTest that the sync head is updated correctly when doing persist",
          "timestamp": "2021-12-02T16:32:36-08:00",
          "tree_id": "0cf779260f27312cb1f8897bfa61c99420160aba",
          "url": "https://github.com/rocicorp/replicache/commit/3d65d8110a477049d5b8afdbc179702e7c26434d"
        },
        "date": 1638491616129,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186385,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35014,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34912,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "alexandru_turcanu@ymail.com",
            "name": "Alexandru Turcanu",
            "username": "Pondorasti"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5d0a073a6bcc111c869219e284e4c083f3b46ad9",
          "message": "Update sample-replidraw.md (#751)",
          "timestamp": "2021-12-06T14:37:10-08:00",
          "tree_id": "2e810c3a48d20e7f48f1994dd845f02590bf0d72",
          "url": "https://github.com/rocicorp/replicache/commit/5d0a073a6bcc111c869219e284e4c083f3b46ad9"
        },
        "date": 1638830287214,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186385,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35014,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34912,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c47eff4dcd846bb28bca07308a0b572869861679",
          "message": "feat: Move all client map updating to retrying updateClients pattern that enables using async native hashing outside of perdag transaction  (#752)\n\n### Problem\r\nFor Simplified Dueling Dags we want to allow using an async native hash\r\nfunction. That means that the hash of a chunk has to be computed\r\noutside the DAG transaction (because of IDB's auto commit bug/feature).\r\n\r\nThis mostly works well on the perdag because it gets it's chunks from\r\nthe memdag using the persist function which allows us to precompute all\r\nthe hashes; **except for the hash of the clients map**.\r\n\r\n### Solution\r\nTo not require a sync hash function we instead precompute the hash of\r\nthe clients map outside the DAG transaction and then write it in the tx.\r\nHowever, by doing this there is a small chance that the clients map\r\nchanged since we mutated it and computed the hash for it. If it did\r\nchange we now retry the update clients function with the new up to date\r\nclients map.\r\n\r\nFixes #735\r\nFixes #743",
          "timestamp": "2021-12-07T19:32:44Z",
          "tree_id": "de95959cf263b0e34008ee562672f0d503e06adf",
          "url": "https://github.com/rocicorp/replicache/commit/c47eff4dcd846bb28bca07308a0b572869861679"
        },
        "date": 1638905623733,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186570,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35068,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186216,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "76e609e60595097434f969f2bed6adb343210186",
          "message": "chore: Remove dead test code (#755)\n\nThis code was left over from when we removed the weblocks test",
          "timestamp": "2021-12-07T23:33:48Z",
          "tree_id": "083182b167c6b0b43e711e0a4948d60af57d616b",
          "url": "https://github.com/rocicorp/replicache/commit/76e609e60595097434f969f2bed6adb343210186"
        },
        "date": 1638920085207,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186570,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35068,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186216,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "958734ed575e55a648d42e873e22e2573780a4b9",
          "message": "chore: Split replicache.test.ts (#756)\n\nIt was getting too large. This breaks out all the tests that contains\r\n'subscribe'/'subscription' in their title.",
          "timestamp": "2021-12-08T00:03:38Z",
          "tree_id": "90f1462f5f0caaf2fbd719269f7bd8520bad86be",
          "url": "https://github.com/rocicorp/replicache/commit/958734ed575e55a648d42e873e22e2573780a4b9"
        },
        "date": 1638921875821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186570,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35068,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186216,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "83a4a1e607421a6aa3b323ab02a28b06d7c4d9cb",
          "message": "fix: Subscriptions with errors never recovered (#757)\n\nEven if we get an exception calling the subscription query body we need\r\nto keep track of the keys.\r\n\r\nCloses #754",
          "timestamp": "2021-12-08T00:22:28Z",
          "tree_id": "c74ca1d0671acdad2808cb513113ba24803895c7",
          "url": "https://github.com/rocicorp/replicache/commit/83a4a1e607421a6aa3b323ab02a28b06d7c4d9cb"
        },
        "date": 1638923017302,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186588,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34995,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186234,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34900,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "279fb79df9bd862bdc9ed03a3a746e638d34035d",
          "message": "chore: Remove prolly/",
          "timestamp": "2021-12-09T11:41:44-08:00",
          "tree_id": "9ef5aae8289c0968bb4c7549d420673f1091376e",
          "url": "https://github.com/rocicorp/replicache/commit/279fb79df9bd862bdc9ed03a3a746e638d34035d"
        },
        "date": 1639078968313,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141351,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29187,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140997,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29093,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ae89eca17baa249a8b68796f8a120ea34deac58a",
          "message": "fix: Incorrect ref count (#761)\n\nIf there is a diamond shape (or similar) we could end up writing a stale\r\nref count.\r\n\r\nThis happened because we read the ref count async and when that resolves\r\nwe end up with the same ref count in more than one possible execution of\r\nchangeRefCount and the ref count gets modified and written in both those\r\ncalls to changeRefCount.\r\n\r\nBy only loading the ref count once, and after that only operate on the\r\ncache we can ensure we are always working with the up to data ref count.",
          "timestamp": "2021-12-10T11:52:03-08:00",
          "tree_id": "92db6a93979b5f1e49d72d3dc61bb6904f79c242",
          "url": "https://github.com/rocicorp/replicache/commit/ae89eca17baa249a8b68796f8a120ea34deac58a"
        },
        "date": 1639165974312,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142077,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29293,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141723,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29197,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "bedf419842d30445c1174b61f0cc3a88ea34c2b2",
          "message": "comments: Forgot to commit these comments\n\nFollow up to ae89eca17baa249a8b68796f8a120ea34deac58a",
          "timestamp": "2021-12-10T12:33:23-08:00",
          "tree_id": "08d9ed444b0bf8f0fa41b8c172e1ec1678f491ea",
          "url": "https://github.com/rocicorp/replicache/commit/bedf419842d30445c1174b61f0cc3a88ea34c2b2"
        },
        "date": 1639168645743,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142077,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29293,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141723,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29197,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b727a6d23cfeea645a52c3a30d9e4ef78b2c03a1",
          "message": "chore: Build a minified bundle too (#763)\n\nThis is only used in the dashboard and it is not included in the npm\r\npackage (at the moment).",
          "timestamp": "2021-12-10T21:29:22Z",
          "tree_id": "9bd0d788c81a930cfe55e25e23275261242e377f",
          "url": "https://github.com/rocicorp/replicache/commit/b727a6d23cfeea645a52c3a30d9e4ef78b2c03a1"
        },
        "date": 1639171829630,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142077,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29293,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141723,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29197,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22722,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2ce13a01e35b7d485008d516d573be0242d7bf3e",
          "message": "chore: Remove endian functions (#764)\n\nNo longer used",
          "timestamp": "2021-12-10T21:42:55Z",
          "tree_id": "b6094484cc8895ce1c1a95a539e33ad8e68fde81",
          "url": "https://github.com/rocicorp/replicache/commit/2ce13a01e35b7d485008d516d573be0242d7bf3e"
        },
        "date": 1639172633658,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142077,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29293,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141723,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29197,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22722,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3aa8064fcfef6b42a6ae6966360215d7101faf26",
          "message": "feat: Add slurp function (#762)\n\nThis walks a dag from a commit and copies the chunks over to another\r\ndag.\r\n\r\nTowards #671",
          "timestamp": "2021-12-10T22:03:19Z",
          "tree_id": "d71f446d95d3369c37d417f95ec8fd2a75512545",
          "url": "https://github.com/rocicorp/replicache/commit/3aa8064fcfef6b42a6ae6966360215d7101faf26"
        },
        "date": 1639173873220,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142077,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29293,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141723,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29197,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22685,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "26ef0cf8b43da04dbd67413b21d3fc6dedeb77eb",
          "message": "feat: Add persist to Replicache (#753)\n\nSee Simplified Dueling Dags design doc\r\n\r\nReplicache now creates two DAG stores backed by two different KV stores.\r\nThese are referred to as `memdag` and `perdag`.\r\n\r\nReplicache operates on the memdag and once in a while it does a persist\r\nwhich syncs data from the memdag to the perdag.\r\n\r\nTowards #671",
          "timestamp": "2021-12-10T15:11:23-08:00",
          "tree_id": "0c1216d38ded7f3855b145a64c3581f79b6124f2",
          "url": "https://github.com/rocicorp/replicache/commit/26ef0cf8b43da04dbd67413b21d3fc6dedeb77eb"
        },
        "date": 1639177943413,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164562,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32940,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164208,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32793,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 89652,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 25141,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "abf8eccba602014745c95e0b47775b3310eb335a",
          "message": "feat!: Make ReplicacheOptions name required (#759)\n\nIt is important to not use a generic default name if you ever intend to\r\nallow Replicache to be used by multiple users on the same machine.\r\nTherefore remove the default name value.\r\n\r\nBREAKING CHANGE\r\n\r\nFixes #742",
          "timestamp": "2021-12-10T23:21:06Z",
          "tree_id": "b26246137ba42d1910ef6b04b161c222bea23eea",
          "url": "https://github.com/rocicorp/replicache/commit/abf8eccba602014745c95e0b47775b3310eb335a"
        },
        "date": 1639178523471,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164545,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164191,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32811,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 89639,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 25119,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7ca403125d598b8eb8d3671ea83c3c2b2855d2ff",
          "message": "refactor: Extract interface for dag.Store,dag.Read, and dag.Write (#766)\n\nIn preparation for adding a dag.LazyStore implementation, extract an interface for the dag Store.  \r\n\r\nTowards #671",
          "timestamp": "2021-12-16T09:32:38-08:00",
          "tree_id": "6d10b94ba47235b41af5e19ba3998333e5b55e30",
          "url": "https://github.com/rocicorp/replicache/commit/7ca403125d598b8eb8d3671ea83c3c2b2855d2ff"
        },
        "date": 1639676025164,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164634,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32977,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164280,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 89666,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 25250,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c64a26a30accc9e1aac2b90f306d6edfdb728534",
          "message": "refactor: move getSizeOfValue from src/btree/ to src/json.ts (#770)\n\n### Problem\r\n`getSizeOfValue` is needed by the upcoming Lazy DagStore for Simplified Dueling Dags.  It is needed for implementing LRU caching with a size limit.  However the dag/ directory should not depend on the btree/ directory, as dag is at a lower abstraction layer than btree.\r\n\r\n### Solution\r\nMove `getSizeOfValue` to src/json.ts.  This is a logic place of the function as it computes the size of a `ReadonlyJsonValue`.",
          "timestamp": "2021-12-17T11:01:26-08:00",
          "tree_id": "c310dedbfe7bda117d86d546c5814edd6a79ac13",
          "url": "https://github.com/rocicorp/replicache/commit/c64a26a30accc9e1aac2b90f306d6edfdb728534"
        },
        "date": 1639767748345,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164599,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32909,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164245,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32828,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 89662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 25153,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "077a5da788bd1940afd0325a4cefe15ec1be7f0e",
          "message": "refactor: Split readCommit into readCommit/readCommitForBTreeRead/readCommitForBTreeWrite to avoid duck-typing (#767)\n\nThis allows us to get rid of some ugly runtime duck-typing.",
          "timestamp": "2021-12-17T11:11:30-08:00",
          "tree_id": "c9bb40821a972b0319ea8e35c013a53afb8f2854",
          "url": "https://github.com/rocicorp/replicache/commit/077a5da788bd1940afd0325a4cefe15ec1be7f0e"
        },
        "date": 1639768341191,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164847,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32927,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32810,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 89722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 25083,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fae7daffaa5f5ce72b8062458dc433a9e770ef2e",
          "message": "refactor: Extract ref count updating logic out of dag WriteImpl so it can be reused by lazy dag store. (#769)\n\nPulls Garbage Collection logic into its own module, so that it can be shared with the upcoming lazy dag store implementation for Simplified Dueling Dags.\r\n\r\nInterface:\r\n```ts\r\nexport type HeadChange = {\r\n  new: Hash | undefined;\r\n  old: Hash | undefined;\r\n};\r\n\r\nexport type RefCountUpdates = Map<Hash, number>;\r\n\r\nexport interface GarbageCollectionDelegate {\r\n  getRefCount: (hash: Hash) => Promise<number>;\r\n  getRefs: (hash: Hash) => Promise<readonly Hash[] | undefined>;\r\n}\r\n\r\n/**\r\n * Computes how ref counts should be updated when a dag write is commited.\r\n * Does not modify the dag store.\r\n * @param headChanges Heads that were changed by the dag write.\r\n * @param putChunks Chunks that were put by the dag write.\r\n * @param delegate Delegate used for loading ref information from the dag store.\r\n * @returns Map from chunk Hash to new ref count.  Chunks with a new ref count of 0 should\r\n * be deleted.  All hashes in `putChunks` will have an entry (which will be zero if a\r\n * newly put chunk is not reachable from any head).\r\n */\r\nexport async function computeRefCountUpdates(\r\n  headChanges: Iterable<HeadChange>,\r\n  putChunks: ReadonlySet<Hash>,\r\n  delegate: GarbageCollectionDelegate,\r\n): Promise<RefCountUpdates> \r\n```\r\n\r\nPart of #671",
          "timestamp": "2021-12-17T11:39:13-08:00",
          "tree_id": "54cdf820fe49a32f66bf97d9200d7901add7d24a",
          "url": "https://github.com/rocicorp/replicache/commit/fae7daffaa5f5ce72b8062458dc433a9e770ef2e"
        },
        "date": 1639770015782,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165119,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164765,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32837,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 89549,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 25166,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a3887061c3dacf4f9803dc3c8d98d815b22bad88",
          "message": "Remove wasm hash (#765)\n\nThis removes wasm hash\r\n\r\nWe no longer use sync hashing so we can use the local native hash functions.",
          "timestamp": "2022-01-10T15:09:26+01:00",
          "tree_id": "a59608e16bc306f0649bca1cb3a9b3f8914d75bc",
          "url": "https://github.com/rocicorp/replicache/commit/a3887061c3dacf4f9803dc3c8d98d815b22bad88"
        },
        "date": 1641823834135,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 133286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24735,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 132934,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24620,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64677,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17599,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7bc61066df2cb4402d5bb75895a4ab6691d1c564",
          "message": "feat: Simplified Dueling Dags - Implement a dag.LazyStore for memdag (#771)\n\nImplements a DAG Store which lazily loads values from a source store and then caches \r\nthem in an LRU cache.  The memory cache for chunks from the source store\r\nsize is limited to `sourceCacheSizeLimit` bytes, and values are evicted in an LRU\r\nfashion.  **The purpose of this store is to avoid holding the entire client view\r\n(i.e. the source store's content) in each client tab's JavaScript heap.**\r\n\r\nThis store's heads are independent from the heads of source store, and are only\r\nstored in memory.\r\n\r\nChunks which are put with a temp hash (see `isTempHash`) are assumed to not be\r\npersisted to the source store and thus are cached separately from the source store\r\nchunks.  These temp chunks cannot be evicted, and their sizes are not counted\r\ntowards the source chunk cache size.  A temp chunk will be deleted if it is no longer\r\nreachable from one of this store's heads.\r\n\r\nWrites only manipulate the in memory state of this store and do not alter the source\r\nstore.  Thus values must be written to the source store through a separate process \r\n(see persist implemented in 7769f09).\r\n\r\nIntended use:\r\n\r\n1. source store is the 'perdag', a slower persistent store (i.e. dag.StoreImpl using a kv.IDBStore)\r\n2. this store's 'main' head is initialized to the hash of a chunk containing a snapshot \r\ncommit in the 'perdag'\r\n3. reads from this store lazily read chunks from the source store and cache them\r\n4. writes are initially made to this store using temp hashes (i.e. temp chunks)\r\n5. writes are asynchronously persisted to the perdag through a separate process.  \r\nSee persist implemented in 7769f09. This process gathers all temp chunks from this store, \r\ncomputes real hashes for them and then writes them to the perdag.  It then replaces in this \r\ndag all the temp chunks written to the source with chunks with permanent hashes and \r\nupdates heads to reference these permanent hashes instead of the temp hashes.  This \r\nresults  in the temp chunks being deleted from this store and the chunks with permanent \r\nhashes being placed in this store's LRU cache of source chunks.\r\n\r\n**Performance**\r\nOn our existing performance benchmarks outperforms the existing mem dag store \r\n( dag.StoreImpl on top of kv.MemStore).   The current benchmarks really only test \r\nperformance of the temp hashes cache though, since they don't use persist at all.  \r\nI believe this outperforms the existing mem dag store because the temp hashes cache\r\nis just a straightforward Map<Hash, Chunk>, and is thus a bit simpler than \r\ndag.StoreImpl on top of kv.MemStore which uses 3 keys per chunk.  A follow up is to \r\nadd some benchmarks that exercise persists and lazy loading.  \r\n\r\n```\r\n[greg replicache [grgbkr/ssd-lazy-dag-impl]$ npm run perf -- --format replicache\r\n\r\n> replicache@8.0.0 perf\r\n> node perf/runner.js \"--format\" \"replicache\"\r\n\r\n\r\nRunning 16 benchmarks on Chromium...\r\n[LazyDag] writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.70/0.80/0.90/1.40 ms avg=0.73 ms (19 runs sampled)\r\n[LazyDag] writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.00/1.00/1.90/3.90 ms avg=1.25 ms (17 runs sampled)\r\n[LazyDag] writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.40/2.20/2.50/2.50 ms avg=1.97 ms (7 runs sampled)\r\n[LazyDag] populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=16.40/20.60/28.70/39.00 ms avg=20.30 ms (19 runs sampled)\r\n[LazyDag] populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=38.30/41.50/45.00/58.90 ms avg=43.28 ms (12 runs sampled)\r\n[LazyDag] populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=47.30/48.50/71.30/71.30 ms avg=58.49 ms (9 runs sampled)\r\n[LazyDag] scan 1024x1000 50/75/90/95%=1.20/1.50/2.50/2.70 ms avg=1.49 ms (19 runs sampled)\r\n[LazyDag] create index 1024x5000 50/75/90/95%=105.80/124.90/130.50/130.50 ms avg=139.61 ms (7 runs sampled)\r\nwriteSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.70/0.90/1.00/1.60 ms avg=0.85 ms (19 runs sampled)\r\nwriteSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.40/1.60/2.50/4.70 ms avg=1.79 ms (16 runs sampled)\r\nwriteSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.20/2.30/2.40/2.40 ms avg=2.57 ms (7 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 0) 50/75/90/95%=18.60/20.40/22.10/39.30 ms avg=21.08 ms (19 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 1) 50/75/90/95%=38.00/45.00/50.20/59.70 ms avg=46.58 ms (11 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 2) 50/75/90/95%=50.60/66.30/75.00/75.00 ms avg=63.77 ms (8 runs sampled)\r\nscan 1024x1000 50/75/90/95%=1.20/1.60/2.30/3.10 ms avg=1.53 ms (19 runs sampled)\r\ncreate index 1024x5000 50/75/90/95%=104.30/115.70/117.30/117.30 ms avg=137.03 ms (7 runs sampled)\r\nDone!\r\n```\r\n\r\nPart of #671",
          "timestamp": "2022-01-10T13:00:14-08:00",
          "tree_id": "d6d88c199e3a86698b56ca9eed390f4c34dd2e1f",
          "url": "https://github.com/rocicorp/replicache/commit/7bc61066df2cb4402d5bb75895a4ab6691d1c564"
        },
        "date": 1641848477204,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 133296,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24735,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 132944,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24632,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64673,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17594,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "815731dc5d2cfe1e0bcc89234c2a5a7362f44b80",
          "message": "refactor: Also rename nativeHashOfClients (#774)\n\nFollow up to a388706",
          "timestamp": "2022-01-11T10:32:29Z",
          "tree_id": "d12b4ee580478bf5c9aa4961d4b41c4beccf6cff",
          "url": "https://github.com/rocicorp/replicache/commit/815731dc5d2cfe1e0bcc89234c2a5a7362f44b80"
        },
        "date": 1641897206691,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 133284,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24731,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 132932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24619,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64673,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17594,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1ad995e550c175b8513cec6475617d84ece16494",
          "message": "chore: Update esbuild to 0.14.11 (#776)\n\nGets some enum inlining",
          "timestamp": "2022-01-11T14:42:37Z",
          "tree_id": "1c8343854d3cc93b349212b5b60702c626b7e5f5",
          "url": "https://github.com/rocicorp/replicache/commit/1ad995e550c175b8513cec6475617d84ece16494"
        },
        "date": 1641912233574,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 134406,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24941,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 133128,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24574,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64117,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17457,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "anotherjesse@gmail.com",
            "name": "Jesse Andrews",
            "username": "anotherjesse"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "d59496c5f0a4ff701078a5e4704d3d70b1454222",
          "message": "Update conclusion guide to point to replidraw2\n\nreplidraw.vercel.app is now a page saying \"This was left to be taken over.\"",
          "timestamp": "2022-01-11T08:49:22-08:00",
          "tree_id": "2d5fcca50a24f2d119f17938a199898c3243b8f3",
          "url": "https://github.com/rocicorp/replicache/commit/d59496c5f0a4ff701078a5e4704d3d70b1454222"
        },
        "date": 1641919831134,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 134406,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24941,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 133128,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24574,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64117,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17457,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "2b73b931967d8f435ddd4eecb60f03e836ca4718",
          "message": "Nit: it's still called Replidraw",
          "timestamp": "2022-01-11T06:55:48-10:00",
          "tree_id": "6291206e764598c1fcb0caafc1752bc96a277056",
          "url": "https://github.com/rocicorp/replicache/commit/2b73b931967d8f435ddd4eecb60f03e836ca4718"
        },
        "date": 1641920217372,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 134406,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24941,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 133128,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24574,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64117,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17457,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dfb20a2afd9c3c9155e17dec2ad5480d4eee2d89",
          "message": "chore: Update docusaurus and algolia (#779)",
          "timestamp": "2022-01-13T14:31:53+01:00",
          "tree_id": "7749cb3e98826b2c248afce04b7f758fa37af28f",
          "url": "https://github.com/rocicorp/replicache/commit/dfb20a2afd9c3c9155e17dec2ad5480d4eee2d89"
        },
        "date": 1642080780866,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 134406,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 24941,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 133128,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 24574,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64117,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 17457,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c685a9a90ae87cafe3ee3c15b4e47f65978c5784",
          "message": "feat: Simplified Dueling Dags - Integrate dag.LazyStore into Replicache (#777)\n\nUpdate Replicache to use new dag.LazyStore (implemented in 7bc6106) for the memdag.  \r\nReplace use of dag.StoreImpl on top of kv.MemStore.  Lazy loading is now used instead of\r\nslurp.\r\n\r\n**Performance**\r\nOutperforms dag.StoreImpl on top of kv.MemStore with slurp on all existing benchmarks.  \r\nAlso outperforms slurp on WIP benchmark for startup from persistent storage when the \r\namount of data stored is > ~4MB.\r\n\r\nIn the below output lines starting with `[LazyStore]` are with LazyStore and the other lines are with dag.StoreImpl on top of kv.MemStore using slurp (this was done with a small local patch for comparing).\r\n\r\n```\r\ngreg replicache [grgbkr/ssd-startup-benchmark-on-checked-in-code]$ npm run perf -- --format replicache\r\n\r\n> replicache@8.0.0 perf\r\n> node perf/runner.js \"--format\" \"replicache\"\r\n\r\nRunning 40 benchmarks on Chromium...\r\n[LazyStore] writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.60/0.70/0.80/1.50 ms avg=0.69 ms (19 runs sampled)\r\n[LazyStore] writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.00/1.20/1.30/1.60 ms avg=1.16 ms (11 runs sampled)\r\n[LazyStore] writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.40/1.60/2.20/2.20 ms avg=1.76 ms (7 runs sampled)\r\n[LazyStore] populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=83.60/86.10/137.30/137.30 ms avg=110.81 ms (7 runs sampled)\r\n[LazyStore] populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=36.90/47.60/53.70/56.60 ms avg=44.20 ms (12 runs sampled)\r\n[LazyStore] populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=45.30/51.20/67.70/67.70 ms avg=57.71 ms (9 runs sampled)\r\n[LazyStore] scan 1024x1000 50/75/90/95%=1.20/1.50/2.20/2.70 ms avg=1.43 ms (19 runs sampled)\r\n[LazyStore] create index 1024x5000 50/75/90/95%=95.00/101.50/106.50/106.50 ms avg=124.14 ms (7 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x100 stored 50/75/90/95%=9.50/10.20/10.50/10.60 ms avg=10.72 ms (19 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x1000 stored 50/75/90/95%=25.90/26.40/26.80/27.10 ms avg=28.57 ms (18 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x2000 stored 50/75/90/95%=27.10/28.30/32.90/84.10 ms avg=35.00 ms (15 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x3000 stored 50/75/90/95%=27.90/28.50/33.00/35.60 ms avg=31.82 ms (16 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x4000 stored 50/75/90/95%=27.90/34.40/46.10/61.50 ms avg=36.80 ms (14 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x5000 stored 50/75/90/95%=27.50/29.90/30.20/40.20 ms avg=31.90 ms (16 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x6000 stored 50/75/90/95%=31.20/56.90/63.60/77.90 ms avg=47.06 ms (11 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x7000 stored 50/75/90/95%=27.70/55.00/57.40/61.10 ms avg=42.12 ms (12 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x8000 stored 50/75/90/95%=30.10/42.70/77.90/78.80 ms avg=43.28 ms (12 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x9000 stored 50/75/90/95%=28.50/29.00/32.30/43.70 ms avg=33.43 ms (15 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x10000 stored 50/75/90/95%=28.30/28.70/29.20/36.10 ms avg=32.13 ms (16 runs sampled)\r\n[LazyStore] startup read 1024x100 from 1024x100000 stored 50/75/90/95%=54.60/67.10/72.20/72.20 ms avg=73.43 ms (7 runs sampled)\r\nwriteSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.70/0.90/1.00/1.50 ms avg=0.83 ms (19 runs sampled)\r\nwriteSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.40/2.30/2.80/4.90 ms avg=2.12 ms (11 runs sampled)\r\nwriteSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.90/2.90/2.90 ms avg=2.60 ms (7 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 0) 50/75/90/95%=70.60/90.90/112.40/112.40 ms avg=91.83 ms (7 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 1) 50/75/90/95%=34.60/47.30/54.50/56.60 ms avg=43.95 ms (12 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 2) 50/75/90/95%=47.50/48.70/67.40/67.40 ms avg=59.67 ms (9 runs sampled)\r\nscan 1024x1000 50/75/90/95%=1.20/1.50/2.20/2.80 ms avg=1.48 ms (19 runs sampled)\r\ncreate index 1024x5000 50/75/90/95%=99.60/106.30/109.60/109.60 ms avg=129.09 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x100 stored 50/75/90/95%=9.00/9.40/9.70/9.70 ms avg=9.91 ms (19 runs sampled)\r\nstartup read 1024x100 from 1024x1000 stored 50/75/90/95%=14.00/14.40/15.10/15.30 ms avg=15.51 ms (19 runs sampled)\r\nstartup read 1024x100 from 1024x2000 stored 50/75/90/95%=19.10/20.00/28.60/93.00 ms avg=25.45 ms (19 runs sampled)\r\nstartup read 1024x100 from 1024x3000 stored 50/75/90/95%=26.70/28.10/29.80/64.60 ms avg=31.74 ms (16 runs sampled)\r\nstartup read 1024x100 from 1024x4000 stored 50/75/90/95%=31.60/33.20/35.10/37.10 ms avg=36.14 ms (14 runs sampled)\r\nstartup read 1024x100 from 1024x5000 stored 50/75/90/95%=54.30/55.10/114.20/114.20 ms avg=73.50 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x6000 stored 50/75/90/95%=62.20/94.20/97.10/97.10 ms avg=82.19 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x7000 stored 50/75/90/95%=55.20/90.60/94.00/94.00 ms avg=77.96 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x8000 stored 50/75/90/95%=57.80/62.30/63.20/63.20 ms avg=69.91 ms (8 runs sampled)\r\nstartup read 1024x100 from 1024x9000 stored 50/75/90/95%=66.30/80.30/111.00/111.00 ms avg=89.51 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x10000 stored 50/75/90/95%=82.10/89.40/114.30/114.30 ms avg=101.73 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x100000 stored 50/75/90/95%=638.90/645.50/675.20/675.20 ms avg=805.41 ms (7 runs sampled)\r\n```\r\n\r\n\r\nPart of #671",
          "timestamp": "2022-01-13T16:42:00Z",
          "tree_id": "369435529f4fffdc3b64fefc2c95531892f6ad5c",
          "url": "https://github.com/rocicorp/replicache/commit/c685a9a90ae87cafe3ee3c15b4e47f65978c5784"
        },
        "date": 1642092170920,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141318,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25855,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140040,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25479,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67701,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18184,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b770a25b38b5660978475c1c6180238c8f3b30fa",
          "message": "refactor: Delete unused slurp and merge kv.MemStore into kv.TestMemStore (#778)\n\nWith the integration of dag.LazyStore slurp is no longer used, and kv.MemStore is only \r\nused via kv.TestMemStore in tests.",
          "timestamp": "2022-01-13T16:46:23Z",
          "tree_id": "ad9557b50cc861bb2572061f5ec2ca19242b6184",
          "url": "https://github.com/rocicorp/replicache/commit/b770a25b38b5660978475c1c6180238c8f3b30fa"
        },
        "date": 1642092433294,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141318,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25855,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140040,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25479,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67701,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18167,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "b328e1b9dc1dd5c9a9772a1c54be386f43facde6",
          "message": "Adds a timestamp field to mutations.\n\nNote: Format change. Not changing REPLICACHE_FORMAT_VERSION constant\nbecause we should only do so once per release by policy, so that\nshould be something we do during release.",
          "timestamp": "2022-01-13T15:14:57-10:00",
          "tree_id": "fbcc9161c769af14eb09bbd0e143e1aac9ec66aa",
          "url": "https://github.com/rocicorp/replicache/commit/b328e1b9dc1dd5c9a9772a1c54be386f43facde6"
        },
        "date": 1642122965733,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141688,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25914,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140410,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25559,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67903,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18257,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "875ff1a992cb7c2dc0d90c4ccfe0d7f2bece8c10",
          "message": "refactor: inline call to scan (#782)",
          "timestamp": "2022-01-14T15:13:21Z",
          "tree_id": "821548d06d6a0751e724d5e3a4cec69d62c46b67",
          "url": "https://github.com/rocicorp/replicache/commit/875ff1a992cb7c2dc0d90c4ccfe0d7f2bece8c10"
        },
        "date": 1642173255034,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141580,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25902,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140302,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25534,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67865,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18226,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce2baacce6723f0323a6016d30c383caf6bdaa1b",
          "message": "feat: Add benchmarks for startup from persisted state  (#780)\n\nAdd two benchmarks for startup from persisted state based on the Replicache performance envelope (#595).\r\n\r\n1. Init replicache and read 100 KB of data from 100 MB of persisted state using `get`s of random keys.\r\n2. Init replicache and read 100 KB of data from 100 MB of persisted state using `scan` starting at a random key.",
          "timestamp": "2022-01-14T18:42:39Z",
          "tree_id": "8b5dd619bc07989b24c6aac25d82a4f7d8318423",
          "url": "https://github.com/rocicorp/replicache/commit/ce2baacce6723f0323a6016d30c383caf6bdaa1b"
        },
        "date": 1642185819999,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140384,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25554,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67884,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18229,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "6389906ff304c1df117d6c8df64168f3ace49433",
          "message": "Remove unused public field `now`.\n\nWas accidentally introduced in b328e1b9dc1dd5c9a9772a1c54be386f43facde6.",
          "timestamp": "2022-01-14T09:42:49-10:00",
          "tree_id": "0da9982524ffbe52004f2a6b96a4c88abd306b6a",
          "url": "https://github.com/rocicorp/replicache/commit/6389906ff304c1df117d6c8df64168f3ace49433"
        },
        "date": 1642189427604,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141622,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67853,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18221,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "392daf1054735a3e92bcb1aa3e5f7df8f0f649d7",
          "message": "chore: Reenable testing in WebKit (#786)\n\nWith updated deps the test runner works again",
          "timestamp": "2022-01-17T14:04:10Z",
          "tree_id": "b03fa1b4476a482f3db2810c0911a3cf31a39db2",
          "url": "https://github.com/rocicorp/replicache/commit/392daf1054735a3e92bcb1aa3e5f7df8f0f649d7"
        },
        "date": 1642428308737,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141622,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67853,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18221,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "25925524c1ed8ef02d1f918f09f38f0d9d18426c",
          "message": "chore: remove useMemstore from perf (#787)\n\nI printed MemStore so we would have some overlap in the perf graphs",
          "timestamp": "2022-01-17T15:40:45+01:00",
          "tree_id": "5f6d3bbbd8747c4ccb5838b49f448319408f6d1d",
          "url": "https://github.com/rocicorp/replicache/commit/25925524c1ed8ef02d1f918f09f38f0d9d18426c"
        },
        "date": 1642430507232,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141622,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67853,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18221,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c580626bbc774f957a156bea67c0bc333faa8edc",
          "message": "chore: Remove typedoc dependency (#788)\n\nIt is only used from doc/ now and doc/ has its own package.json",
          "timestamp": "2022-01-20T15:17:49+01:00",
          "tree_id": "e9e4603413cfa2e13a0d2c0179b1c802d5fad49c",
          "url": "https://github.com/rocicorp/replicache/commit/c580626bbc774f957a156bea67c0bc333faa8edc"
        },
        "date": 1642688320036,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141622,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67853,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18221,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a2d4a74471b8a34258f0b890e5d084727178f141",
          "message": "doc: client view cannot be a function of clientID (#790)\n\nclient view cannot be a function of clientID since we fork an existing\r\nclient view and create a new client with the same client view but a new\r\nclient id.\r\n\r\ncloses #789",
          "timestamp": "2022-01-25T11:49:27+01:00",
          "tree_id": "08df3a6ca33ecd72182ec1790d9cad8bd810eb69",
          "url": "https://github.com/rocicorp/replicache/commit/a2d4a74471b8a34258f0b890e5d084727178f141"
        },
        "date": 1643107829841,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141622,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67853,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18221,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "7b11da7752680afe9a7779f57cbf531dec110e49",
          "message": "Bump version to 9.0.0-beta.0.",
          "timestamp": "2022-01-25T17:59:42-10:00",
          "tree_id": "818871428e210fd8638dea919044d7e785e2298c",
          "url": "https://github.com/rocicorp/replicache/commit/7b11da7752680afe9a7779f57cbf531dec110e49"
        },
        "date": 1643169655883,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141622,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67853,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18221,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "931c9bb00d2667a0ea2ab98ce5fd22d4a775a85e",
          "message": "feat: Simplified Dueling Dags - Mutation Recover - Add mutationID and  lastServerAckdMutationID to Client. (#792)\n\nAdd `mutationID` and  `lastServerAckdMutationID` to `Client` and update `initClient` and `persist` to\r\nwrite them appropriately.  These new fields will be used by other clients to determine if a client has \r\npending mutations (persisted local mutations unacknowledged by the server) that it can push on the \r\nother client's behalf.  We will refer to this process as “mutation recovery”, as one client is recovering the\r\n mutations of another client, by reading them from the other client’s perdag stage and pushing on the \r\nother client’s behalf. \r\n\r\nSee [Mutation Recovery design](https://www.notion.so/Mutation-Recovery-Avoiding-Mutation-Loss-using-PerDag-state-f54025b52cbc435692abca3307947d15). \r\n\r\nPart of #671",
          "timestamp": "2022-01-26T10:16:01-08:00",
          "tree_id": "a651b0b7764a81fc88b50a42970476f92f615103",
          "url": "https://github.com/rocicorp/replicache/commit/931c9bb00d2667a0ea2ab98ce5fd22d4a775a85e"
        },
        "date": 1643221018431,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142171,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25975,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140893,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25638,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68089,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18286,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "60391d56ba0a4ffb1b37764a18e04033203f84ce",
          "message": "refactor!: Remove deprecated pushAuth/getPushAuth and pullAuth/getPullAuth (#796)\n\nRemoves `Replicache.getPushAuth` and `Replicache.getPullAuth` which were deprecated and replaced by `Replicache.getAuth`.\r\nRemoves `ReplicacheOptions.pushAuth` and `ReplicacheOptions.pullAuth` which were deprecated and replaced by `ReplicacheOptions.auth`. \r\n\r\nThese fields were deprecated by 9c3a49bc4b16924a3d8e0af5bbd4208156d20174, and have been deprecated since release [v6.4.0](https://github.com/rocicorp/replicache/releases/tag/v6.4.0).  \r\n \r\nThis will make some work on mutation recovery cleaner.\r\n\r\nBREAKING CHANGE: Removes `Replicache#getPushAuth` and `Replicache#getPullAuth`.  Usages should be updated to use `Replicache#getAuth`. Removes `ReplicacheOptions.pushAuth` and `ReplicacheOptions.pullAuth`.  Usages should be updated to use `ReplicacheOptions.auth`.",
          "timestamp": "2022-01-27T08:03:24-08:00",
          "tree_id": "9a04c9e9ff9b5dd5ae43a0df023b927ac4e36977",
          "url": "https://github.com/rocicorp/replicache/commit/60391d56ba0a4ffb1b37764a18e04033203f84ce"
        },
        "date": 1643299467192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141875,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25915,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140597,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25582,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67873,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18218,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c36f0d53f711f31a095aea4a1e9b5b53b7227426",
          "message": "refactor: Extract reauth retry logic from push and pull into shared method. (#797)\n\nExtract reauth retry logic from push and pull into shared method.  This reduces duplication and also will allow for reuse of this logic for mutation recovery.",
          "timestamp": "2022-01-27T08:19:43-08:00",
          "tree_id": "1f46e28ce4482de6a95f7a34917e30afa834ba3b",
          "url": "https://github.com/rocicorp/replicache/commit/c36f0d53f711f31a095aea4a1e9b5b53b7227426"
        },
        "date": 1643300438484,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142199,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26030,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140921,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25684,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68081,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18288,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "09be25008105ff50a3fb8b97effa99c0a2c65d00",
          "message": "feat: Simplified Dueling Dags - Mutation Recovery - Add an optional parameter to beingPull for disabling the creation of a sync branch from the pull response (#798)\n\nFor Mutation Recover we need to be able to pull to confirm mutations have been applied on the server by \r\nlooking at the responses `lastMutationID`, but we do not want to apply the response to the DAG.  Add an \r\noption to beginPull to not create a sync branch from the pull response.\r\n\r\nAlso add the `PullResponse` to `BeginPullResponse`, as it will be need by Mutation Recovery to get the \r\n`lastMutationID`. \r\n\r\nPart of #671",
          "timestamp": "2022-01-27T09:41:37-08:00",
          "tree_id": "e3ddf924293db282515f45b49ec9bcd548e15df3",
          "url": "https://github.com/rocicorp/replicache/commit/09be25008105ff50a3fb8b97effa99c0a2c65d00"
        },
        "date": 1643305376380,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142382,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26067,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141104,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25702,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68159,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18302,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "39007eaf0f075ef6535072d2cc12e16fa7386b92",
          "message": "refactor!: Update Replicache.schemaVersion to readonly. (#800)\n\nThis should always have been readonly, the schema version of a Replicache instance should be constant through out its life.   Previously modifying this had no effect.\r\n\r\nBREAKING CHANGE:  Code modifying Replicache.schemaVersion must be removed (to resolve TypeScript errors).",
          "timestamp": "2022-01-28T17:01:02Z",
          "tree_id": "4dffed004fa86f3e015f8d9d4886944fcb16d584",
          "url": "https://github.com/rocicorp/replicache/commit/39007eaf0f075ef6535072d2cc12e16fa7386b92"
        },
        "date": 1643389326986,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 142382,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26067,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 141104,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25702,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68159,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18302,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8ba35ffca743d3121557939a220b31d597300c4c",
          "message": "chore: Delete change broadcast code (#801)\n\nIn the new unified storage model of simplified dueling dags changes are shared between \r\ntabs via syncing with the server.   This code is no longer needed, possibly impacting\r\nperformance and causing spurious firing of subscriptions.",
          "timestamp": "2022-01-28T12:33:57-08:00",
          "tree_id": "54b8f4d0cf89ee91da25553e5e71fcd3430e2a62",
          "url": "https://github.com/rocicorp/replicache/commit/8ba35ffca743d3121557939a220b31d597300c4c"
        },
        "date": 1643402089455,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 140371,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 25721,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 139093,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25368,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67023,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18008,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d939623e76df90efdbfd0116a20201fb0d428aed",
          "message": "feat: Track Replicache IndexedDB databases in another IndexedDB database for mutation recovery and db gc. (#802)\n\n### Problem\r\nWe need to be able to find old Replicache IndexedDB databases (i.e. databases with previous schema \r\nversions or replicache format versions), so that we can recover mutations from them and also GC them.\r\n\r\n### Solution\r\nKeep track of Replicache IndexedDB databases in a IndexedDB database. \r\n\r\nUnfortunately Firefox does not implement [IDBFactory.databases](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/databases), or we would use that api.\r\n\r\nIndexedDB is used over LocalStorage because LocalStorage's lack of concurrency control makes\r\nit very difficult to avoid write clobbering when updating a list or map.",
          "timestamp": "2022-01-28T13:13:52-08:00",
          "tree_id": "8ac31a2e70bf642e8b7aff4160a946d19abd7ada",
          "url": "https://github.com/rocicorp/replicache/commit/d939623e76df90efdbfd0116a20201fb0d428aed"
        },
        "date": 1643404487939,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 141850,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 140572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 25649,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18219,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1538c424e2369c36c5a41c7876f0dad338e59768",
          "message": "feat: Simplified Dueling Dag - Mutation Recovery - Implement the mutation recovery process. (#799)\n\n### Problem \r\nWith Simplified Dueling Dags mutations that have not been synced to the server when a tab is \r\nunloaded (or frozen and never unfrozen) are lost.  This can occur in common user flows, and \r\nwill result in unexpected data loss.  The impact is worst when the user has been offline or has \r\na flakey connection as there will be more local mutations that have not been synced.   Cases \r\nwhere this will occur:\r\n\r\n- Refresh before changes have been pushed\r\n- Close before changes have been pushed\r\n- Navigate away before changes have been pushed\r\n- Tab backgrounded and frozen before changes have been pushed (seems unlikely) and tab is not revisited before client is gc’d\r\n- Tab crash before changes have been pushed\r\n\r\n### Solution\r\nReplicache clients will try to recover mutations from other Replicache client's perdag state.   \r\nA Replicache client can recover another Replicache client's mutations if the other clients has \r\nthe same name (and thus can share auth), the same domain, and a Replicache format and \r\nschema version understood by the client.   A Replicache client will try to recover other\r\nclients' mutation at startup, reconnection and on a 5 minute interval\r\n\r\nSee full design at https://www.notion.so/replicache/Mutation-Recovery-Avoiding-Mutation-Loss-using-PerDag-state-f54025b52cbc435692abca3307947d15",
          "timestamp": "2022-02-01T22:16:09-08:00",
          "tree_id": "079a53d5ca1a2250cd9d0382fbf519a24247084f",
          "url": "https://github.com/rocicorp/replicache/commit/1538c424e2369c36c5a41c7876f0dad338e59768"
        },
        "date": 1643782640850,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148195,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26833,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 146917,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26516,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70793,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18866,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "arv@roci.dev",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "eab7fb6ffa9276450dd185cbbd43adc0f05b7c83",
          "message": "chore: Use esbuild mangle-props (#805)\n\nFor even smaller minimized output",
          "timestamp": "2022-02-03T19:32:01Z",
          "tree_id": "aa42e322ed574d072fc61e3c228a151ae56d4953",
          "url": "https://github.com/rocicorp/replicache/commit/eab7fb6ffa9276450dd185cbbd43adc0f05b7c83"
        },
        "date": 1643916820201,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148195,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26833,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 146917,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26516,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 63761,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18131,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ac33faf50ceb379998ad1697305c29d19f32644a",
          "message": "fix: fix benchmarks broken by mutation recovery change (#808)\n\nThese were broken by 1538c424e2369c36c5a41c7876f0dad338e59768. \r\n\r\nthree fixes.\r\n1. close other indexeddbs we try to recover\r\n2. delete IDBDatabasesStore indexeddb db after each benchmark.  this way mutationRecovery is not try to recover a ton of dbs during benchmarks. \r\n3. make the indexeddb deletion code in perf tests more robost.  There is no way to wait for an indexeddb close to complete (the api is silently async).  If you call delete when a close is in process, it fails with a onblocked event.  Add code that will delay 100ms and then retry delete after a onblocked event (up to 10 retries).",
          "timestamp": "2022-02-04T09:38:42-08:00",
          "tree_id": "cc81b015c7757441e11493bb603a6ccb7ac5d27e",
          "url": "https://github.com/rocicorp/replicache/commit/ac33faf50ceb379998ad1697305c29d19f32644a"
        },
        "date": 1643996389954,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26845,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 146995,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26515,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 63790,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18129,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b980904005580a5817719681526191cf1f4a6598",
          "message": "fix: remove debugging console.log from benchmarks (#809)\n\nRemove debugging console.log from benchmarks.\r\n\r\nAccidentally check in here ac33faf50ceb379998ad1697305c29d19f32644a.",
          "timestamp": "2022-02-04T17:48:53Z",
          "tree_id": "a522d5c2f6e79528a5c1a0933d75a22b036797f5",
          "url": "https://github.com/rocicorp/replicache/commit/b980904005580a5817719681526191cf1f4a6598"
        },
        "date": 1643996994583,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26845,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 146995,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26515,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 63790,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18129,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f988f1c1db5ec5b9dd43020c64625508f26100d4",
          "message": "fix: Simplified Dueling Dags - Mutation Recovery - Do not recover mutation from clients with a different Replicache name (#810)\n\nProblem\r\n======\r\nA client _**MUST NOT**_ recover mutations from a client with a different Replicache name.  This is because a client uses its auth to push the mutations.  This is safe for client's with the same name as they are for the same user.  However, pushing on behalf of a client with a different name is very bad, as it will apply the mutations for a different user.\r\n\r\nSolution\r\n======\r\nAdd Replicache name to the IndexedDBDatabase records, and only recover mutations for clients with the same Repliache name.  Add a test for this behavior.\r\n\r\nAlso adds versioning to IDBDatabasesStore for easing handling of future format changes of  IndexedDBDatabase records.",
          "timestamp": "2022-02-04T11:13:49-08:00",
          "tree_id": "39fda2b737e9e2f1c8850b4befe56dcda321ebd3",
          "url": "https://github.com/rocicorp/replicache/commit/f988f1c1db5ec5b9dd43020c64625508f26100d4"
        },
        "date": 1644002092868,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148400,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26901,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 147122,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26549,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 63875,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18151,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a42745809efa825f769f9f737ee04aa8c8b6fc34",
          "message": "fix: add runtime checking for require non-empty Replicache name (#811)\n\nFixes #795",
          "timestamp": "2022-02-04T11:57:56-08:00",
          "tree_id": "f0410a9d31507acc580e6aeaebb0e1381cb05dc2",
          "url": "https://github.com/rocicorp/replicache/commit/a42745809efa825f769f9f737ee04aa8c8b6fc34"
        },
        "date": 1644004742692,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148435,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26917,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 147157,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26560,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 63903,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18163,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c90c0ab1716b4084552e706e409d98593f3f2b94",
          "message": "Revert \"add licensing client\" (#816)\n\nThis reverts commit 01d45a4e465834217c5844766383d23b7ddb6170.\r\n\r\nThe CI cannot fetch the package",
          "timestamp": "2022-02-07T12:23:38+01:00",
          "tree_id": "f0410a9d31507acc580e6aeaebb0e1381cb05dc2",
          "url": "https://github.com/rocicorp/replicache/commit/c90c0ab1716b4084552e706e409d98593f3f2b94"
        },
        "date": 1644233084832,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 148435,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 26917,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 147157,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26560,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 63903,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18163,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ef25543da8c82f8f445a4a325e275fdd2c2eebf5",
          "message": "feat: Simplified Dueling Dags - Mutation Recovery - Make recovery robust to errors and exit early on close. (#820)\n\n**Problem**\r\nIf the Mutation Recovery process stops on the first error encountered.  This means a single problematic db or client can prevent recovery of all other clients.  \r\n\r\n**Solution**\r\nUpdates Mutation Recovery logic to be more robust against errors.  If an error occurs recovering a particular \r\nclient or db, the logic will now log that error, and continue trying to recover other clients/dbs. \r\n\r\nAdding the above robustness requires the process to handle the Replicache instance being closed more explicitly.  Previously the process would stop on the first error encountered due to the Replicache intance being closed. \r\nThis change updates the logic to check if this Replicache instance is closed before processing each db, and \r\neach client inside each db, and exits early if this Replicache instance is closed.",
          "timestamp": "2022-02-07T10:50:38-08:00",
          "tree_id": "5e435a973dfba442a47b8c253a19db93f0de9913",
          "url": "https://github.com/rocicorp/replicache/commit/ef25543da8c82f8f445a4a325e275fdd2c2eebf5"
        },
        "date": 1644259904149,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150333,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27122,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26799,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64767,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18394,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ab8990ae58853906ae0b6c465354a88f73d01d64",
          "message": "feat: Simplified Dueling Dags - Mutation Recovery - Optimize mutation recovery at startup by reusing client map read by client init. (#821)\n\n**Problem**\r\nMutation recovery regressed our median startup scan benchmark by ~20% (25 ms to 30 ms).\r\n\r\n**Solution**\r\nTry to mitigate by reusing the client map read by `persist.initClient`, rather than reading it in a new IndexedDB transaction.",
          "timestamp": "2022-02-07T19:11:00Z",
          "tree_id": "2b2db7a63b0903d8350230c5f486b3d3f34bfe61",
          "url": "https://github.com/rocicorp/replicache/commit/ab8990ae58853906ae0b6c465354a88f73d01d64"
        },
        "date": 1644261112829,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27174,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149159,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26829,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64782,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18390,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "83e15f22b04332eea9d3261a7c925633ca8f61c8",
          "message": "chore(deps): bump shelljs from 0.8.4 to 0.8.5 in /doc (#807)\n\nBumps [shelljs](https://github.com/shelljs/shelljs) from 0.8.4 to 0.8.5.\r\n- [Release notes](https://github.com/shelljs/shelljs/releases)\r\n- [Changelog](https://github.com/shelljs/shelljs/blob/master/CHANGELOG.md)\r\n- [Commits](https://github.com/shelljs/shelljs/compare/v0.8.4...v0.8.5)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: shelljs\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-02-08T09:42:32Z",
          "tree_id": "ed93870c93382e0dd1f45d97516fa53ad6c068c3",
          "url": "https://github.com/rocicorp/replicache/commit/83e15f22b04332eea9d3261a7c925633ca8f61c8"
        },
        "date": 1644313413822,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27174,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149159,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26829,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64782,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18390,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "85b33812235990fb733fe1c972ed2bf7b0fe080d",
          "message": "chore(deps): bump nanoid from 3.1.30 to 3.2.0 (#806)\n\nBumps [nanoid](https://github.com/ai/nanoid) from 3.1.30 to 3.2.0.\r\n- [Release notes](https://github.com/ai/nanoid/releases)\r\n- [Changelog](https://github.com/ai/nanoid/blob/main/CHANGELOG.md)\r\n- [Commits](https://github.com/ai/nanoid/compare/3.1.30...3.2.0)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: nanoid\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-02-08T09:47:48Z",
          "tree_id": "9357019f947b0291b6f3b8854be8cb19ee8bc1e4",
          "url": "https://github.com/rocicorp/replicache/commit/85b33812235990fb733fe1c972ed2bf7b0fe080d"
        },
        "date": 1644313726540,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27174,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149159,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26829,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64782,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18390,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "29bdaea299cfe232146d43257b8de433cf620b53",
          "message": "fix: Improve isolation of tests' and benchmarks' indexeddb state to reduce flakiness (#822)\n\nIn tests add a uuid to indexeddb database names (Replicache name and IDBDatbasesStore DB) \r\nto isolate tests' indexed db state.\r\n \r\nAlso fixes a bug in kv.IDBStore which was blocking IndexedDB opened by these stores from being \r\ndeleted.   In order to not block deletion of the db, the connection needs to be closed on \r\n`onversionchange`.  Previously the code was only setting up \r\n`db.onversionchange = () => db.close()` in `onupgradeneeded` which only fires if the db didnt \r\nalready exist.  Code is updated to always setup `db.onversionchange = () => db.close()`. \r\n\r\nWhile this fix allows the IndexedDB databases to be reliably deleted, it did not prevent races \r\naround deletion.  Before isolating with uuid, I was observing that after one test's teardown \r\nawait the deletion of a database with name X, if the next test opened the database with name \r\nX, the test would _sometimes_ get an error that its connection to X was closed, suggestion some \r\nrace where the deletion is not truly complete when the success callback for the deletion is invoked.\r\n\r\nFixes #819",
          "timestamp": "2022-02-08T08:38:33-08:00",
          "tree_id": "eff3bafc09cfe2daf99c93c9a90b75c61d174f10",
          "url": "https://github.com/rocicorp/replicache/commit/29bdaea299cfe232146d43257b8de433cf620b53"
        },
        "date": 1644338484568,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27179,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149217,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26830,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18461,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f28980eefa4f3a207bf0fba9a951d4897e10434b",
          "message": "chore: improve createPushBody arg name and type in replicache-mutation-recovery.test (#825)",
          "timestamp": "2022-02-08T16:58:41Z",
          "tree_id": "0bca3f8cbaaee4977ae459e03d40e2a957fbbae2",
          "url": "https://github.com/rocicorp/replicache/commit/f28980eefa4f3a207bf0fba9a951d4897e10434b"
        },
        "date": 1644339586403,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27179,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149217,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26830,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18461,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "206685bc9a816076212b730fd7cfcdfbc30fb346",
          "message": "fix: Fix flakiness of replicache-persist.test.ts on Webkit (#828)\n\n**Problem**\r\nreplicache-persist.test is flacky on webkit because the persist process does not always complete before we \r\ncreate a new replicache and try to read the persisted data.  This happens more on webkit because it uses a \r\ntimeout rather than request idle callback to start persist.\r\n\r\n**Solution**\r\nWait for persist to complete (detected by polling the ClientMap) before creating a new Replicache and verifying\r\nit bootstraps from the persisted data.",
          "timestamp": "2022-02-08T14:46:30-08:00",
          "tree_id": "f9ce8fb2628921e04181765d799e989bdf6ae24d",
          "url": "https://github.com/rocicorp/replicache/commit/206685bc9a816076212b730fd7cfcdfbc30fb346"
        },
        "date": 1644360447725,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 150495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27179,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149217,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26830,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 64795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18461,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "d5dd28f357ec112864e2c73d9b62889d58dcbf0a",
          "message": "add licensing client",
          "timestamp": "2022-02-09T08:59:32-10:00",
          "tree_id": "68fe6087af007d111f07bd5ae04d4d49716f93bf",
          "url": "https://github.com/rocicorp/replicache/commit/d5dd28f357ec112864e2c73d9b62889d58dcbf0a"
        },
        "date": 1644433233602,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 231116,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 39780,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 229838,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 39428,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 115215,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 29012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "9e495fa0259e0b9a0c2ab8400b4fcfff725761cf",
          "message": "add npmrc setup to perf CI",
          "timestamp": "2022-02-09T09:58:27-10:00",
          "tree_id": "906e2479cb21ccc7337e7432ca6cd220a0565239",
          "url": "https://github.com/rocicorp/replicache/commit/9e495fa0259e0b9a0c2ab8400b4fcfff725761cf"
        },
        "date": 1644436777133,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 231116,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 39780,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 229838,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 39428,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 115215,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 29012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "bfd812b0026bd025ddb0fa3f59cc658220d7695d",
          "message": "Revert \"add npmrc setup to perf CI\"\n\nThis reverts commit 9e495fa0259e0b9a0c2ab8400b4fcfff725761cf.",
          "timestamp": "2022-02-09T10:03:59-10:00",
          "tree_id": "68fe6087af007d111f07bd5ae04d4d49716f93bf",
          "url": "https://github.com/rocicorp/replicache/commit/bfd812b0026bd025ddb0fa3f59cc658220d7695d"
        },
        "date": 1644437110547,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 231116,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 39780,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 229838,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 39428,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 115215,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 29012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "6231b09ba697cb4f4a8d5e86bd7c1cf7310f39aa",
          "message": "add npmrc setup to perf CI",
          "timestamp": "2022-02-09T10:16:36-10:00",
          "tree_id": "8bb9428403c5ce6bddc6802b781f9c3f97569966",
          "url": "https://github.com/rocicorp/replicache/commit/6231b09ba697cb4f4a8d5e86bd7c1cf7310f39aa"
        },
        "date": 1644437886362,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 231116,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 39780,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 229838,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 39428,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 115215,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 29012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "5104a8aa842acfae3fa3c1c04c372036a07820b1",
          "message": "bump licensing version",
          "timestamp": "2022-02-09T16:34:32-10:00",
          "tree_id": "78501dc8e5dcb27550eb36d03ba3658616fb9d0a",
          "url": "https://github.com/rocicorp/replicache/commit/5104a8aa842acfae3fa3c1c04c372036a07820b1"
        },
        "date": 1644460523447,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27353,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27002,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65053,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18511,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Gregory Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "d95d8bf18d84dc465f2cbe58069668fc86a2a6cd",
          "message": "refactor: Rename ReplicacheOptions.name and Replicache.name to userID.",
          "timestamp": "2022-02-09T21:03:00-10:00",
          "tree_id": "eb04d410445c922c61098f2237f9729188c85f7b",
          "url": "https://github.com/rocicorp/replicache/commit/d95d8bf18d84dc465f2cbe58069668fc86a2a6cd"
        },
        "date": 1644476635298,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151205,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27364,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149924,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27034,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65110,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18525,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Gregory Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "0a38f9f297fbf8159a1029785f957550ed3ba6c8",
          "message": "feat: Update Replicache Format Version from 3 to 4 for v9 release.",
          "timestamp": "2022-02-09T21:11:21-10:00",
          "tree_id": "b3bec3c3f0b36ece2eac1ddeea03246bea432003",
          "url": "https://github.com/rocicorp/replicache/commit/0a38f9f297fbf8159a1029785f957550ed3ba6c8"
        },
        "date": 1644477137173,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151205,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27398,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149924,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27030,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65110,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18597,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "addf5ffcdf1b8f4e851efdfc383527c38852f020",
          "message": "Bump version to 9.0.0-beta.1.",
          "timestamp": "2022-02-09T21:21:00-10:00",
          "tree_id": "965012483a7f03b4773ccef5a1595ace6db0ff71",
          "url": "https://github.com/rocicorp/replicache/commit/addf5ffcdf1b8f4e851efdfc383527c38852f020"
        },
        "date": 1644477721514,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151205,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27398,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149924,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27030,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65110,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18597,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b40de269b9e8e178f11b098f6eb3112e4c5d53d6",
          "message": "refactor: Rename ReplicacheOptions.userID and Replicache.userID back to name. (#835)\n\nThis reverts commit d95d8bf18d84dc465f2cbe58069668fc86a2a6cd.\r\n\r\nWe realized we will need both a userID, and another identifier to support multiple Replicache instance for the same user (e.g. roomID).  We will do this api change in v10 rather than v9.  \r\n\r\nAdded details to documentation for `name` around Replicache bootsrapping and mutation recovery.",
          "timestamp": "2022-02-10T10:16:34-08:00",
          "tree_id": "1a01a62b035c7dd373dc90ab77b43deed02fb261",
          "url": "https://github.com/rocicorp/replicache/commit/b40de269b9e8e178f11b098f6eb3112e4c5d53d6"
        },
        "date": 1644517056804,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27331,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27012,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65053,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18536,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "e4c67f42481f9025f633e4cdc7dd9a5ff9089b40",
          "message": "Update package-lock.json",
          "timestamp": "2022-02-10T09:58:21-10:00",
          "tree_id": "eeb1e3a80ad7d59f6aa308ab13c6827b6387c236",
          "url": "https://github.com/rocicorp/replicache/commit/e4c67f42481f9025f633e4cdc7dd9a5ff9089b40"
        },
        "date": 1644523158801,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27331,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27012,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65053,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18536,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5c76f54b247e4412c7db6fc46601d034e76f736e",
          "message": "chore(deps): bump follow-redirects from 1.14.7 to 1.14.8 in /doc (#840)\n\nBumps [follow-redirects](https://github.com/follow-redirects/follow-redirects) from 1.14.7 to 1.14.8.\r\n- [Release notes](https://github.com/follow-redirects/follow-redirects/releases)\r\n- [Commits](https://github.com/follow-redirects/follow-redirects/compare/v1.14.7...v1.14.8)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: follow-redirects\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2022-02-14T15:36:49+01:00",
          "tree_id": "8e9d6faf0f16a1611482d62c7028d321cd27f1fc",
          "url": "https://github.com/rocicorp/replicache/commit/5c76f54b247e4412c7db6fc46601d034e76f736e"
        },
        "date": 1644849477866,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27331,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27012,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65053,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18536,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "358212cc1d153cea6ff39763417588fa1d7c6d7b",
          "message": "feat!: Prefix the IDB name with `rep:` (#842)\n\nFixes #836",
          "timestamp": "2022-02-14T20:37:34Z",
          "tree_id": "786bdf0e700af26f989ec4b73c1be94b7b6f4c50",
          "url": "https://github.com/rocicorp/replicache/commit/358212cc1d153cea6ff39763417588fa1d7c6d7b"
        },
        "date": 1644871117881,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151004,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27337,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149726,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27006,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65057,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18516,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3290f8e97df2d9ff17a4863225e7fa9e8e3d3a84",
          "message": "fix: Do not use window (#844)\n\nReplicache runs in web workers so we should not use `window`.",
          "timestamp": "2022-02-15T09:32:00Z",
          "tree_id": "de8378ca2c47e049794fe7ac1dbd8ee93475b8ce",
          "url": "https://github.com/rocicorp/replicache/commit/3290f8e97df2d9ff17a4863225e7fa9e8e3d3a84"
        },
        "date": 1644917588775,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27346,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 149731,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 26999,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65019,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18506,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4c2001ad37721e7f148ccaa52803bb242ca1d467",
          "message": "fix: Catch errors in background interval processes and log appropriatly. (#846)\n\nProblem\r\n=======\r\nWe have a report of the following exception being thrown from `heartbeat.ts` after a Replicache instance is closed and a new one created as part of a development setup using Replicache, Reach hooks, and Next with HMR.\r\n\r\n```\r\nDOMException: Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing.\r\n```\r\n\r\nWe do stop the heartbeat interval when a Replicache instance is closed, however there is a race that can lead to the above exception: if the Replicache instance is closed while the hearbeat update is running.  \r\n\r\nThis is a fairly narrow race, so I'm still uncertain if this is what the issue reporter is hitting. \r\n\r\nSolution\r\n=======\r\nCatch errors in interval based background processes and log them to 'debug' if the error occurred after the Replicache instance was closed (as this is an expected error), and to 'error' otherwise.  Applied this to the \"heartbeat\" and \"ClientGC\" processes.  The \"mutation recovery\" process already does this.\r\n\r\nAlso added so additional debug logging to aid in further debugging if this does not fix the issue for the reporter.\r\n\r\n\r\nFixes #843",
          "timestamp": "2022-02-24T13:50:42-08:00",
          "tree_id": "016622276cf1e1891a63442d984787a4b6a7cd30",
          "url": "https://github.com/rocicorp/replicache/commit/4c2001ad37721e7f148ccaa52803bb242ca1d467"
        },
        "date": 1645739510439,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151984,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27539,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 150706,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27180,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65484,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18643,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "47cc40a5d7506b6d63a51726a7b09117cafc6b8b",
          "message": "Bump version to 9.0.0-beta.2.",
          "timestamp": "2022-02-24T14:57:06-10:00",
          "tree_id": "c995678e0be78655a28ecbca40f03f7806bfdbc6",
          "url": "https://github.com/rocicorp/replicache/commit/47cc40a5d7506b6d63a51726a7b09117cafc6b8b"
        },
        "date": 1645750707165,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151984,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27539,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 150706,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27180,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65484,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18643,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9fd50e10f5d36932829f4ba3b36075b077097ed9",
          "message": "chore(deps): bump prismjs from 1.26.0 to 1.27.0 in /doc (#847)\n\nBumps [prismjs](https://github.com/PrismJS/prism) from 1.26.0 to 1.27.0.\r\n- [Release notes](https://github.com/PrismJS/prism/releases)\r\n- [Changelog](https://github.com/PrismJS/prism/blob/master/CHANGELOG.md)\r\n- [Commits](https://github.com/PrismJS/prism/compare/v1.26.0...v1.27.0)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: prismjs\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
          "timestamp": "2022-02-28T16:59:44+01:00",
          "tree_id": "f6abe36d483070d27fb0679fc82bfa4486d50986",
          "url": "https://github.com/rocicorp/replicache/commit/9fd50e10f5d36932829f4ba3b36075b077097ed9"
        },
        "date": 1646064062685,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 151984,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 27539,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 150706,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27180,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 65484,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 18643,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "0b84a67f0833fbb7a0de50a0d405dccc9ab801c8",
          "message": "add license check call",
          "timestamp": "2022-03-01T09:40:46-10:00",
          "tree_id": "b8d351b8c26c8193d0dff936984f9b9570371955",
          "url": "https://github.com/rocicorp/replicache/commit/0b84a67f0833fbb7a0de50a0d405dccc9ab801c8"
        },
        "date": 1646163722034,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 154964,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28129,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153686,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27778,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 66966,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19095,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "bd50f9923ebeb5c1173ccab8ece313f86a53d414",
          "message": "move license check to after ready",
          "timestamp": "2022-03-01T11:05:58-10:00",
          "tree_id": "ff62bc9b92adbea5d47f4a470930c71b11207cf8",
          "url": "https://github.com/rocicorp/replicache/commit/bd50f9923ebeb5c1173ccab8ece313f86a53d414"
        },
        "date": 1646168834823,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "5ff1b23494583122722ee8b838f2461d7d1e005c",
          "message": "Merge tag 'v9.0.0'",
          "timestamp": "2022-03-02T21:52:28-10:00",
          "tree_id": "bab29d3f8f85d03163ad42eca82bca9a9ddafc2a",
          "url": "https://github.com/rocicorp/replicache/commit/5ff1b23494583122722ee8b838f2461d7d1e005c"
        },
        "date": 1646294045425,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dda2cb70ea1a1b42e060bb2a87c225dcc976de60",
          "message": "Update HACKING.md",
          "timestamp": "2022-03-02T21:59:08-10:00",
          "tree_id": "24954f807b5dbb38a309ad675ea5727f1960a729",
          "url": "https://github.com/rocicorp/replicache/commit/dda2cb70ea1a1b42e060bb2a87c225dcc976de60"
        },
        "date": 1646294418158,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "6234c54a4867e05434a4a70f619f4f90f72e6ea0",
          "message": "Add 64MB write/sub/read benchmark 😬",
          "timestamp": "2022-03-03T18:33:21-10:00",
          "tree_id": "75ee393bac3b03824fe824005ccb1afb0f8684cb",
          "url": "https://github.com/rocicorp/replicache/commit/6234c54a4867e05434a4a70f619f4f90f72e6ea0"
        },
        "date": 1646368460722,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "0dc390fa2a3f877c197e0662e0fd7011f62f3a1c",
          "message": "Add 10MB populate tests.",
          "timestamp": "2022-03-03T22:08:06-10:00",
          "tree_id": "be54ded722ca79dc78bd25a21ac5a8d406ced9d1",
          "url": "https://github.com/rocicorp/replicache/commit/0dc390fa2a3f877c197e0662e0fd7011f62f3a1c"
        },
        "date": 1646381380242,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "2442bc5dcad97769c22c67c6105e3aa56b2cd4e3",
          "message": "Minor perf optimization to benchmarks. This reduces time of the 16MB\nrun by about 10%. It has no affect on the result of the benchmark,\njust the setup overhead.",
          "timestamp": "2022-03-06T19:17:51-10:00",
          "tree_id": "4f059426f705279bcddcfd4813fb211302ede79b",
          "url": "https://github.com/rocicorp/replicache/commit/2442bc5dcad97769c22c67c6105e3aa56b2cd4e3"
        },
        "date": 1646630333907,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3a5da8644030a6e0fcaa88ca7ce4a57d3a1edd91",
          "message": "Update HACKING.md",
          "timestamp": "2022-03-06T21:39:41-10:00",
          "tree_id": "af940f1102c11e93395bbca2502d1f3c6ec3a3a8",
          "url": "https://github.com/rocicorp/replicache/commit/3a5da8644030a6e0fcaa88ca7ce4a57d3a1edd91"
        },
        "date": 1646638843155,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "200a6a3f93dd2113f3f82131a93fe785ed57529a",
          "message": "Update HACKING.md",
          "timestamp": "2022-03-06T21:40:08-10:00",
          "tree_id": "e562d16195580c3715a8f741165d3f77802d625e",
          "url": "https://github.com/rocicorp/replicache/commit/200a6a3f93dd2113f3f82131a93fe785ed57529a"
        },
        "date": 1646638862961,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 155238,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28170,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 153960,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 27821,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67016,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19088,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "f4c021b0bf9fa162f83d28073606d31cb21c21c3",
          "message": "add license active ping",
          "timestamp": "2022-03-07T15:34:43-10:00",
          "tree_id": "aa97a954c6ffb7d5118e95178ff0370161248d97",
          "url": "https://github.com/rocicorp/replicache/commit/f4c021b0bf9fa162f83d28073606d31cb21c21c3"
        },
        "date": 1646703571651,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 157202,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28378,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 155924,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67895,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19250,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "039d333ab98e8c463a7f38e5f8d595ea17fab6d3",
          "message": "fix: Log subscribe errors if no onError (#864)\n\nIf `onError` is provided to a subscription the `onError` handler gets\r\ncalled with the exception as argument.\r\n\r\nIf there is no `onError` then we log the error to the console.\r\n\r\nFixes #862",
          "timestamp": "2022-03-10T13:39:22+01:00",
          "tree_id": "f546b2d44cb01c5f7a0902f67d74bed0ad640780",
          "url": "https://github.com/rocicorp/replicache/commit/039d333ab98e8c463a7f38e5f8d595ea17fab6d3"
        },
        "date": 1646916016027,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 157317,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28385,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 156039,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 67934,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19255,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "97d56722c35cabd0b351270b6882ed176b0aa59c",
          "message": "chore: Add a mustGetChunk that throws if missing (#866)\n\nNow, all code paths that gets a required chunk uses `mustGetChunk`. When\r\nthe chunk is missing this throws a `MissingChunkError`.\r\n\r\nThe idea is that the caller will detect these errors and see if the\r\nclient might have been GC'd.\r\n\r\nTowards #784",
          "timestamp": "2022-03-11T15:36:22+01:00",
          "tree_id": "00a630d694322f53471681e582e4e3e67f34f5c2",
          "url": "https://github.com/rocicorp/replicache/commit/97d56722c35cabd0b351270b6882ed176b0aa59c"
        },
        "date": 1647009433549,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 157644,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 156366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28094,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68101,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19336,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2cbbf982f0c932e5d99e3e5a02bbfd78be38991d",
          "message": "feat: Check if client exists in persist (#867)\n\nWe now check if the client ID exists in the client map when we do a\r\n`persist`. If it doesn't we throw a `MissingClientError`.\r\n\r\nFor testing purpose we can skip this check.\r\n\r\nThe intended use is to handle clients that are missing and raise an\r\n\"event\" on the Replicache instance when this happens.\r\n\r\nTowards #784",
          "timestamp": "2022-03-12T15:18:34Z",
          "tree_id": "77cebeb2bca9496c2f4744b4acd5824c8e87eba7",
          "url": "https://github.com/rocicorp/replicache/commit/2cbbf982f0c932e5d99e3e5a02bbfd78be38991d"
        },
        "date": 1647098373171,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 158309,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28582,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 157031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28225,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68379,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19430,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dcc2469f6c1a4b7d29fe0bbb0dc6852f38e93aec",
          "message": "chore: Add another scan perf test with ~10MB (#869)",
          "timestamp": "2022-03-14T14:53:46+01:00",
          "tree_id": "6bfda283c3719624f9c43fc31524364f7cfba866",
          "url": "https://github.com/rocicorp/replicache/commit/dcc2469f6c1a4b7d29fe0bbb0dc6852f38e93aec"
        },
        "date": 1647266090446,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 158309,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28582,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 157031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28225,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 68379,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19430,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8cdf0b0600c2c664a3ca1be5287ac8045ec3b03a",
          "message": "feat: Add onClientStateNotFound (#868)\n\nThis hooks up the test if the client exists. If the client does not\r\nexist we call `onClientStateNotFound`.\r\n\r\nThe test for the client missing is done in persist, query, mutate,\r\nheartbeat as well as in visibilitychange when the visibilityState\r\nis visible.\r\n\r\nFixes #784",
          "timestamp": "2022-03-15T11:23:57+01:00",
          "tree_id": "e1febd87d09354224a1f9d97113c3c103475a841",
          "url": "https://github.com/rocicorp/replicache/commit/8cdf0b0600c2c664a3ca1be5287ac8045ec3b03a"
        },
        "date": 1647339899123,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160617,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28924,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28576,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69310,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19702,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "48772c7be90d3d4bd290a072e6538a91b33c32d8",
          "message": "chore: Rename MissingChunkError (#871)\n\nTo ChunkNotFoundError\r\n\r\nTo be consistent with ClientStateNotFound",
          "timestamp": "2022-03-15T15:38:31+01:00",
          "tree_id": "26cc0140149ea31eaab0a712232b76de83651467",
          "url": "https://github.com/rocicorp/replicache/commit/48772c7be90d3d4bd290a072e6538a91b33c32d8"
        },
        "date": 1647355164916,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160624,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28916,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159346,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28578,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69313,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19659,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f3b14231a2cea9046b8b8bb1d32a0292abe4c96b",
          "message": "chore: No need to depend on node-fetch (#873)",
          "timestamp": "2022-03-17T11:09:14+01:00",
          "tree_id": "f87eb9816ea793753f18e7090eb379ffa3eba4e6",
          "url": "https://github.com/rocicorp/replicache/commit/f3b14231a2cea9046b8b8bb1d32a0292abe4c96b"
        },
        "date": 1647511829582,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160624,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28916,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159346,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28578,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69313,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19659,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0d0c2bdd037ff1b1a73293e8e674cf1db6db67dc",
          "message": "chore: Use @rocicorp/lock (#874)",
          "timestamp": "2022-03-17T10:25:09Z",
          "tree_id": "1185a4b475e38318f2426787b7e6a67e79ab4f1a",
          "url": "https://github.com/rocicorp/replicache/commit/0d0c2bdd037ff1b1a73293e8e674cf1db6db67dc"
        },
        "date": 1647512760866,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160889,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28952,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159611,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28598,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19714,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d14daf02433e6216abf87582d6b9fe70a7c41069",
          "message": "chore: Remove flag to persist (#875)\n\nFix tests to not need to skip the checking of missing clients\r\n\r\nFollowup to #867",
          "timestamp": "2022-03-17T11:19:18Z",
          "tree_id": "773ad72c0d4a90f86752157c0058f09e4db511ad",
          "url": "https://github.com/rocicorp/replicache/commit/d14daf02433e6216abf87582d6b9fe70a7c41069"
        },
        "date": 1647516021281,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160850,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28949,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28592,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69397,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19729,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a4f9ee79c822bdc4455a64007e0948f11515d777",
          "message": "chore: Use @rocicorp/resolver (#877)",
          "timestamp": "2022-03-17T16:47:41+01:00",
          "tree_id": "0c5604b8b2fb2e763fdbbdba8bd281be6960a762",
          "url": "https://github.com/rocicorp/replicache/commit/a4f9ee79c822bdc4455a64007e0948f11515d777"
        },
        "date": 1647532296391,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160642,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 28935,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159364,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28613,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69307,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19660,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "95de115b2a8df1035032bdcd9a0a1c246b4582f4",
          "message": "chore: Use @rocicorp/logger (#879)",
          "timestamp": "2022-03-17T21:33:40Z",
          "tree_id": "a43b51fac7168625a1027424a6c7ab15652af571",
          "url": "https://github.com/rocicorp/replicache/commit/95de115b2a8df1035032bdcd9a0a1c246b4582f4"
        },
        "date": 1647552875366,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159774,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28716,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69439,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19746,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6811fc73abb2865a681f7709db4cfbd8f90721d2",
          "message": "fix: Use json deepEqual in splice computation (#881)\n\nThis could potentionally lead to a subscription firing when the value\r\ndidn't change.\r\n\r\nFixes #841",
          "timestamp": "2022-03-18T15:08:40+01:00",
          "tree_id": "fd906a5a0d92049b124ca2801da43350074a312b",
          "url": "https://github.com/rocicorp/replicache/commit/6811fc73abb2865a681f7709db4cfbd8f90721d2"
        },
        "date": 1647612587026,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161060,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159782,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28718,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19757,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b7e18a7dd53fd4d59ef73179b111422c8f61217f",
          "message": "chore: Increase timeout for startup (#882)\n\nUse default value of 30s",
          "timestamp": "2022-03-18T15:33:58Z",
          "tree_id": "6c2d9ee2995d0df9942fb522eac3b4f3b6d3bfa5",
          "url": "https://github.com/rocicorp/replicache/commit/b7e18a7dd53fd4d59ef73179b111422c8f61217f"
        },
        "date": 1647617697717,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161060,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159782,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28718,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19757,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "57afd41a345e37dccddcf01817fecd4d63662711",
          "message": "chore: Use @rocicorp deps directly (#888)\n\nInstead of going through a deps.ts file",
          "timestamp": "2022-03-22T16:29:59+01:00",
          "tree_id": "08c33cecaa51c695fe8707a807aa61548b0b4b82",
          "url": "https://github.com/rocicorp/replicache/commit/57afd41a345e37dccddcf01817fecd4d63662711"
        },
        "date": 1647963065655,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161060,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159782,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28718,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19765,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8787290fcf2f491737cd4ff97d4b0d7f801c41dc",
          "message": "chore!: Removal of deprecated Replicache methods. (#890)\n\nThis removes the following deprecated methods from the Replicache\r\ninstance:\r\n- scan\r\n- has\r\n- isEmpty\r\n- get\r\n\r\nThese have been deprecated since 8.0",
          "timestamp": "2022-03-22T15:34:07Z",
          "tree_id": "4d80a29c22df1b29f06ce8905865874a8a9449e9",
          "url": "https://github.com/rocicorp/replicache/commit/8787290fcf2f491737cd4ff97d4b0d7f801c41dc"
        },
        "date": 1647963304567,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160666,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29010,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159388,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28682,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69226,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "b97153d576dac82c91d6a8b2e372dec1ad8b4413",
          "message": "Review comments",
          "timestamp": "2022-03-22T06:25:33-10:00",
          "tree_id": "9b1a6dae1611b2b594a5bd5cac76ca8360ff13d1",
          "url": "https://github.com/rocicorp/replicache/commit/b97153d576dac82c91d6a8b2e372dec1ad8b4413"
        },
        "date": 1647966431171,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160700,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29021,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28664,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69244,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19739,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "0181a23a3c9da60595ac115d9794a938fdbcb73f",
          "message": "licensing calls throw on non-200 response",
          "timestamp": "2022-03-24T15:50:48-10:00",
          "tree_id": "de48003e8c6c84808f0be396c462f4a8a152e7b8",
          "url": "https://github.com/rocicorp/replicache/commit/0181a23a3c9da60595ac115d9794a938fdbcb73f"
        },
        "date": 1648173119324,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 160829,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29050,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 159532,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19757,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "f887494bae563bf29f9f20c58c7f4ffc8f6eeae0",
          "message": "include profileID in push and pull requests",
          "timestamp": "2022-03-24T19:12:33-10:00",
          "tree_id": "9c3a13a391ee0de6010951805283b784bd4d0446",
          "url": "https://github.com/rocicorp/replicache/commit/f887494bae563bf29f9f20c58c7f4ffc8f6eeae0"
        },
        "date": 1648185208216,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161733,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29177,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 160436,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28834,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69675,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19855,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f29860cf7592972f7badec12adcc95a598240b4f",
          "message": "chore(deps): bump node-forge from 1.2.1 to 1.3.0 in /doc (#892)\n\nBumps [node-forge](https://github.com/digitalbazaar/forge) from 1.2.1 to 1.3.0.\r\n- [Release notes](https://github.com/digitalbazaar/forge/releases)\r\n- [Changelog](https://github.com/digitalbazaar/forge/blob/main/CHANGELOG.md)\r\n- [Commits](https://github.com/digitalbazaar/forge/compare/v1.2.1...v1.3.0)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: node-forge\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-03-25T09:33:14Z",
          "tree_id": "51af46ed4b53fa43a0733c62d76485b5e2225440",
          "url": "https://github.com/rocicorp/replicache/commit/f29860cf7592972f7badec12adcc95a598240b4f"
        },
        "date": 1648200856632,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161733,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29177,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 160436,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28834,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69675,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19855,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "aa197f8642f49c68458b6d77e1d84737b373825c",
          "message": "chore: Only use LogContext in Replicache class (#889)",
          "timestamp": "2022-03-25T11:28:29+01:00",
          "tree_id": "af54b1e23fa77fc5b85b6a8432712b104ef52e42",
          "url": "https://github.com/rocicorp/replicache/commit/aa197f8642f49c68458b6d77e1d84737b373825c"
        },
        "date": 1648204165861,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161589,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29171,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 160292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28799,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69614,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19887,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e2eb9382477a36e7f8f73ee4197b1e7aac01c468",
          "message": "feat: Disable a bunch of assertions in prod (#891)\n\nWhen `process.env.NODE_ENV === 'production'` we skip validating the\r\nshape of the chunks (is it a Commit? is it a B+Tree?) as well as\r\nskipping validating that the JSONValue is really a JSONValue.\r\n\r\nFixes #876",
          "timestamp": "2022-03-25T12:36:40+01:00",
          "tree_id": "76884438356588dba9be9a34760f82528785ac86",
          "url": "https://github.com/rocicorp/replicache/commit/e2eb9382477a36e7f8f73ee4197b1e7aac01c468"
        },
        "date": 1648208264589,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 161880,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29221,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 160583,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 28867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 69673,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 19875,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "212797317a92afe88c5215fb42a03204232dcb7b",
          "message": "feat: New Phone, Who Dis? (#880)\n\nThe server can now tell the client that it does not know about a client.\r\nWhen this happens the client calls `onClientStateNotFound`.\r\n\r\nThe server can return:\r\n\r\n```json\r\n{\"error\": \"ClientStateNotFound\"}\r\n```\r\n\r\nFixes #335",
          "timestamp": "2022-03-25T15:50:43+01:00",
          "tree_id": "0218084ca8e5fe753868c1ae9130d2cffe8f37dc",
          "url": "https://github.com/rocicorp/replicache/commit/212797317a92afe88c5215fb42a03204232dcb7b"
        },
        "date": 1648219906617,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163175,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29416,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20022,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d923876d25a9b8bbc2365ea4d2088c782b4c10ec",
          "message": "refactor: Remove unused ScanResult parameters (#896)\n\nNow that the deprecated scan has been removed we can remov some of the\r\nparameters to ScanResult etc.",
          "timestamp": "2022-03-25T15:06:14Z",
          "tree_id": "8384c82537a6f6d25019824ef8f87ddb9c22aa8a",
          "url": "https://github.com/rocicorp/replicache/commit/d923876d25a9b8bbc2365ea4d2088c782b4c10ec"
        },
        "date": 1648220860466,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163110,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161813,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70156,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20008,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "985df5049653322767c8ba72f37048514b2ed377",
          "message": "update to latest licensing beta",
          "timestamp": "2022-03-25T14:32:09-10:00",
          "tree_id": "a834e5fc3ebc1fdd65e307c810879d6d06cc024d",
          "url": "https://github.com/rocicorp/replicache/commit/985df5049653322767c8ba72f37048514b2ed377"
        },
        "date": 1648254795006,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "dc6bba3bef2dce5ae3f6cdefcf83d48754a75138",
          "message": "Replicache chat with todo in sidebar",
          "timestamp": "2022-03-25T22:27:31-10:00",
          "tree_id": "6e7bf18867134579122450d2130fbdd3508c19ec",
          "url": "https://github.com/rocicorp/replicache/commit/dc6bba3bef2dce5ae3f6cdefcf83d48754a75138"
        },
        "date": 1648283315893,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "88780821d1440bd143ff8e875a967f445e83c24b",
          "message": "Update Getting Started to use TodoMVC.",
          "timestamp": "2022-03-25T22:39:26-10:00",
          "tree_id": "20d990413e6e9baccc549a0d650a3eae27d73d45",
          "url": "https://github.com/rocicorp/replicache/commit/88780821d1440bd143ff8e875a967f445e83c24b"
        },
        "date": 1648284033414,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "94f650398f2934b2cb7589de9dd71c00a271265d",
          "message": "Add missing cd command",
          "timestamp": "2022-03-25T22:45:21-10:00",
          "tree_id": "83b0b3ade733de88f6b5f8b60ceb9b13c9c99f44",
          "url": "https://github.com/rocicorp/replicache/commit/94f650398f2934b2cb7589de9dd71c00a271265d"
        },
        "date": 1648284387763,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4a9b69699a3e9095271d16321367fa34edb9401a",
          "message": "chore(deps): bump minimist from 1.2.5 to 1.2.6 (#898)\n\nBumps [minimist](https://github.com/substack/minimist) from 1.2.5 to 1.2.6.\r\n- [Release notes](https://github.com/substack/minimist/releases)\r\n- [Commits](https://github.com/substack/minimist/compare/1.2.5...1.2.6)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: minimist\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-03-26T20:26:26Z",
          "tree_id": "1524f6f0f4435de01f1a53a6c221ccb814cb3809",
          "url": "https://github.com/rocicorp/replicache/commit/4a9b69699a3e9095271d16321367fa34edb9401a"
        },
        "date": 1648326444602,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "be941afc8e67b730324d6ff963a8c498b4190c05",
          "message": "Whoops fix the images in the integration guide.",
          "timestamp": "2022-03-26T19:52:52-10:00",
          "tree_id": "d8f58c93960a4f84588ff3c35b457a4844171276",
          "url": "https://github.com/rocicorp/replicache/commit/be941afc8e67b730324d6ff963a8c498b4190c05"
        },
        "date": 1648360463680,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "74e097f8edf4fe6c4394faafc2816958068dbb7d",
          "message": "spruce",
          "timestamp": "2022-03-26T20:04:24-10:00",
          "tree_id": "04ca355887d2f77e393027671ecf28e2e8da97ff",
          "url": "https://github.com/rocicorp/replicache/commit/74e097f8edf4fe6c4394faafc2816958068dbb7d"
        },
        "date": 1648361145535,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "03048aff75c1aafb60850319e4a03a1c047cad0a",
          "message": "Fix another confused image in the docs.",
          "timestamp": "2022-03-27T23:09:17-10:00",
          "tree_id": "3844e04ea092a7feb515c9ac3fd18faa2b84673c",
          "url": "https://github.com/rocicorp/replicache/commit/03048aff75c1aafb60850319e4a03a1c047cad0a"
        },
        "date": 1648458692546,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9759bd452e9344b7499e1a45b375627a8555f43f",
          "message": "chore(deps): bump minimist from 1.2.5 to 1.2.6 in /doc (#899)\n\nBumps [minimist](https://github.com/substack/minimist) from 1.2.5 to 1.2.6.\r\n- [Release notes](https://github.com/substack/minimist/releases)\r\n- [Commits](https://github.com/substack/minimist/compare/1.2.5...1.2.6)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: minimist\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-03-28T10:01:18Z",
          "tree_id": "ebd325c5965796a81f86e8758b56eabcc9206b87",
          "url": "https://github.com/rocicorp/replicache/commit/9759bd452e9344b7499e1a45b375627a8555f43f"
        },
        "date": 1648461735642,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7fd4930ca748a18fbb09c76e638d18d9e6d2c773",
          "message": "chore: Silence tests (#902)\n\nAnd assert we log the right thing",
          "timestamp": "2022-03-28T13:23:13+02:00",
          "tree_id": "c89257f33b364f2714998eea26d8523a7a987597",
          "url": "https://github.com/rocicorp/replicache/commit/7fd4930ca748a18fbb09c76e638d18d9e6d2c773"
        },
        "date": 1648466649529,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1980d07d5ee7dc00489f6f8b724189b1f997e3ce",
          "message": "chore(deps): bump ansi-regex from 4.1.0 to 4.1.1 in /doc (#900)\n\nBumps [ansi-regex](https://github.com/chalk/ansi-regex) from 4.1.0 to 4.1.1.\r\n- [Release notes](https://github.com/chalk/ansi-regex/releases)\r\n- [Commits](https://github.com/chalk/ansi-regex/compare/v4.1.0...v4.1.1)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: ansi-regex\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-03-28T11:26:32Z",
          "tree_id": "927e2dd248fa0eb309648ff31ceb5719c18d9d6c",
          "url": "https://github.com/rocicorp/replicache/commit/1980d07d5ee7dc00489f6f8b724189b1f997e3ce"
        },
        "date": 1648466852739,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163163,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161866,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29066,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70192,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20012,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "445973d7e1bc34089dbe197e0f96516a955307b8",
          "message": "enable licensing by default",
          "timestamp": "2022-03-28T20:42:05-10:00",
          "tree_id": "aa1479e99a84b0b40b6af7d8c7ce353a947f4a30",
          "url": "https://github.com/rocicorp/replicache/commit/445973d7e1bc34089dbe197e0f96516a955307b8"
        },
        "date": 1648536175710,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163482,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29484,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162185,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70346,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20102,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "0a302aac0547d57a02b81a923ad5744b2d960fd5",
          "message": "change get-license command",
          "timestamp": "2022-03-30T14:35:57-10:00",
          "tree_id": "89857bac8496f7f36c82e6fa0284d7a2922536d8",
          "url": "https://github.com/rocicorp/replicache/commit/0a302aac0547d57a02b81a923ad5744b2d960fd5"
        },
        "date": 1648687017274,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163364,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162067,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29103,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70298,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20041,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "e1ca4c3a861febfa38382e6952b330a87e054243",
          "message": "add licensing to docs",
          "timestamp": "2022-03-30T16:16:51-10:00",
          "tree_id": "f732073cfd1bf198778edf6dcb509aa270178328",
          "url": "https://github.com/rocicorp/replicache/commit/e1ca4c3a861febfa38382e6952b330a87e054243"
        },
        "date": 1648693067181,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163364,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162067,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29103,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70298,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20041,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0538bb7311b9a188880ca701c6b398918355beec",
          "message": "typo",
          "timestamp": "2022-03-30T17:35:26-10:00",
          "tree_id": "b6f2f61fb5415eed2ad92fec051de1578c68b32d",
          "url": "https://github.com/rocicorp/replicache/commit/0538bb7311b9a188880ca701c6b398918355beec"
        },
        "date": 1648697777196,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163364,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162067,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29103,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70298,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20041,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "6838d99364a68fdbea999b4dbe50159c3cb4f545",
          "message": "format",
          "timestamp": "2022-03-31T13:34:45-10:00",
          "tree_id": "86238d95ae7bf7b50bc440b4423e2eb549847b09",
          "url": "https://github.com/rocicorp/replicache/commit/6838d99364a68fdbea999b4dbe50159c3cb4f545"
        },
        "date": 1648769738507,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163517,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29479,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162220,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29125,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70393,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20081,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a677307c3b34cec2515fdb101d7e7fdd15f8f8d9",
          "message": "feature: Enable custom log handling by adding logSink to ReplicacheOptions (#907)",
          "timestamp": "2022-04-01T10:55:44-07:00",
          "tree_id": "ed08918deb4165a71402ca85a2590b65676e143b",
          "url": "https://github.com/rocicorp/replicache/commit/a677307c3b34cec2515fdb101d7e7fdd15f8f8d9"
        },
        "date": 1648835807601,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164039,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29610,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162720,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29235,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70652,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20204,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "42a3decd81ff5161f1ad0d75d08156ad4159443c",
          "message": "feat!: Switch to use a ScanReader and expose it to the API. (#906)\n\nThis changes scan to use a ScanReader instead of an async iterator.\r\n\r\nIt also exposes a function that returns a ScanResult from a ScanReader\r\nand ScanOptions.\r\n\r\n```ts\r\ndeclare const options: ScanOptions;\r\ndeclare const reader: ScanReader;\r\n\r\nconst scanResult = makeScanResult(reader, options);\r\n```\r\n\r\nIf you are trying to implement Replicache's scan API you now only need\r\nto write a function that creates a ScanReader.\r\nmakeScanResult will take care of seeking to the correct\r\nposition and reading the data.\r\n\r\nWhen working with index scans you need to use `ScanReader<IndexKey>`\r\n\r\nCloses #607",
          "timestamp": "2022-04-04T11:48:15Z",
          "tree_id": "ec5226eacf72808de19616007d0ceddf612b4bdd",
          "url": "https://github.com/rocicorp/replicache/commit/42a3decd81ff5161f1ad0d75d08156ad4159443c"
        },
        "date": 1649072959441,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166079,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29901,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164738,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29542,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71705,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20446,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "b5d7a12ffa9cbd2fe418f75191435c6a066d5b10",
          "message": "Revert \"feat!: Switch to use a ScanReader and expose it to the API. (#906)\"\n\nRegressed writeSubRead\n\nThis reverts commit 42a3decd81ff5161f1ad0d75d08156ad4159443c.",
          "timestamp": "2022-04-04T14:45:59+02:00",
          "tree_id": "ed08918deb4165a71402ca85a2590b65676e143b",
          "url": "https://github.com/rocicorp/replicache/commit/b5d7a12ffa9cbd2fe418f75191435c6a066d5b10"
        },
        "date": 1649076443880,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164039,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29610,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162720,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29235,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 70652,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20204,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "590410fc060dcf64c011e483f314f2e2a7fc2d28",
          "message": "fix: Update mutation recovery to handle push and/or pull being disabled appropriately. (#912)",
          "timestamp": "2022-04-05T15:29:31-07:00",
          "tree_id": "6ce6e5d7d8e9461c316050ce21af098b1e32a129",
          "url": "https://github.com/rocicorp/replicache/commit/590410fc060dcf64c011e483f314f2e2a7fc2d28"
        },
        "date": 1649197831164,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 164697,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 163378,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71017,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20319,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0b8a99ffb95d63e33d89bd29e95ae9b6348ec8df",
          "message": "feature: Add some internal hidden options needed for reflect (#915)\n\nAdds\r\n1. disableLicensing\r\n2. disableMutationRecovery",
          "timestamp": "2022-04-05T17:11:04-07:00",
          "tree_id": "52c33a5b2d63a3bb9b09128094f9e4651cc41702",
          "url": "https://github.com/rocicorp/replicache/commit/0b8a99ffb95d63e33d89bd29e95ae9b6348ec8df"
        },
        "date": 1649203914868,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165147,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29781,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 163828,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29423,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71167,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20361,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "26fe74fa24065a88b1c19946254185e1ca9a7f2c",
          "message": "chore: bump version to 10.0.0-alpha.0 (#916)",
          "timestamp": "2022-04-06T00:30:50Z",
          "tree_id": "5b9730c49e4ec05eecc696267cec988ea1766699",
          "url": "https://github.com/rocicorp/replicache/commit/26fe74fa24065a88b1c19946254185e1ca9a7f2c"
        },
        "date": 1649205112628,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165147,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29781,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 163828,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29423,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71167,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20361,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a7eb810aa7fc764c446b59fb25fe34279e34f65",
          "message": "Bump version to 10.0.0-alpha.0 in VERSION and BSL.txt. (#917)",
          "timestamp": "2022-04-06T00:48:06Z",
          "tree_id": "5a08f9c9585b9c6cccdb451cd93427070c330850",
          "url": "https://github.com/rocicorp/replicache/commit/5a7eb810aa7fc764c446b59fb25fe34279e34f65"
        },
        "date": 1649206155765,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165147,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29781,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 163828,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29423,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71167,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20361,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c2c115c97fe5ad8e4e28bee65802d153c2a43e0b",
          "message": "fix: d.ts output to include necessary @rocicorp/lock and @rocicorp/logger declarations. (#918)",
          "timestamp": "2022-04-06T10:51:18-07:00",
          "tree_id": "20acf79dc16071eba1881a462c72d31ef9722094",
          "url": "https://github.com/rocicorp/replicache/commit/c2c115c97fe5ad8e4e28bee65802d153c2a43e0b"
        },
        "date": 1649267533352,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165147,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29781,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 163828,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29423,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71167,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20361,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d29165b986a555a215245ec54db7438a13099f45",
          "message": "feature: export TEST_LICENSE_KEY from src/mod.ts for customer use in tests (#925)",
          "timestamp": "2022-04-07T00:33:33Z",
          "tree_id": "49ea61b8353f0004f94f5cb443539ede22fc9959",
          "url": "https://github.com/rocicorp/replicache/commit/d29165b986a555a215245ec54db7438a13099f45"
        },
        "date": 1649291667196,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165191,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29794,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 163848,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29425,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71190,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20368,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2c83f22f50924474cc5f9d5e60ccb9c3dc8252b1",
          "message": "feat!: Expose a way to reuse ScanResult (#926)\n\nWe now expose a method called `makeScanResult`. It takes a `ScanOptions`\r\nand a function that returns an async iterator.\r\n\r\n```ts\r\nmakeScanResult({prefix: 'b'}, async function* (fromKey) {\r\n  // yield ['a', 1];\r\n  yield ['b', 2];\r\n});\r\n```\r\n\r\nor when using an index:\r\n\r\n```ts\r\nmakeScanResult(\r\n  {prefix: 'b', indexName: 'i'},\r\n  async function* (indexName, fromSecondaryKey, fromPrimaryKey) {\r\n    // yield [['as', 'ap', 1];\r\n    yield [['bs', 'bp', 2];\r\n});\r\n```\r\n\r\nTo make this work we moved the limit and exclusive handling to the top\r\nlevel iterator loop.\r\n\r\nWe now compute the fromKey and pass that into the iterator.\r\n\r\nFixes #607",
          "timestamp": "2022-04-07T17:41:30+02:00",
          "tree_id": "8aa8e6398ac326bca7d0cc8ba31a6c88b8970fb2",
          "url": "https://github.com/rocicorp/replicache/commit/2c83f22f50924474cc5f9d5e60ccb9c3dc8252b1"
        },
        "date": 1649346159717,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166952,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30131,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 165587,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29767,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71693,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20565,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c5c0baaec8a29dd6c1fc39e05a1d490bcf1b3a8b",
          "message": "refactor: Small improvements to internal options (#927)\n\n1. Add a ReplicacheInternalOptions type def.\r\n2. Have replicacheForTesting accept internal options so tests dont have to cast.\r\n3. Switch options from disable to enable.",
          "timestamp": "2022-04-07T21:09:06Z",
          "tree_id": "90119f28eaf2055aba7bd6f4e7269026aff662fb",
          "url": "https://github.com/rocicorp/replicache/commit/c5c0baaec8a29dd6c1fc39e05a1d490bcf1b3a8b"
        },
        "date": 1649365799517,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166831,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30141,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 165466,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29756,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71671,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20615,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Gregory Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "greg@roci.dev",
            "name": "Gregory Baker",
            "username": "grgbkr"
          },
          "distinct": true,
          "id": "9857468fe380479c39cf0167576937a489bae3a4",
          "message": "Bump version to 10.0.0-alpha.1.",
          "timestamp": "2022-04-07T15:46:56-07:00",
          "tree_id": "141175ca5b517ef20c51cb2afd3537fa8960b7e6",
          "url": "https://github.com/rocicorp/replicache/commit/9857468fe380479c39cf0167576937a489bae3a4"
        },
        "date": 1649371761861,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166831,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30141,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 165466,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29756,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71671,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20615,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "77b3d3085fe2ad1f0725c77b3785a472240611d4",
          "message": "update licensing and complain if version too old",
          "timestamp": "2022-04-07T16:54:26-10:00",
          "tree_id": "404f0bd6069142da8f04b8e90827e7a2cb8d1efd",
          "url": "https://github.com/rocicorp/replicache/commit/77b3d3085fe2ad1f0725c77b3785a472240611d4"
        },
        "date": 1649386529031,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167648,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30325,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29948,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72149,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20782,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "be73814502de08cac0aa766536752088aee359e1",
          "message": "Revert \"feat!: Expose a way to reuse ScanResult (#926)\"\n\nThis reverts commit 2c83f22f50924474cc5f9d5e60ccb9c3dc8252b1.",
          "timestamp": "2022-04-07T17:34:25-10:00",
          "tree_id": "b8626822b9d71d27cbc046bab6054b3b23d50cf1",
          "url": "https://github.com/rocicorp/replicache/commit/be73814502de08cac0aa766536752088aee359e1"
        },
        "date": 1649388924119,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 165887,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29967,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164544,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29613,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 71646,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20598,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cbca2683838451ee438a07201156dece12107508",
          "message": "feat!: Expose makeScanResult (#931)\n\n* Revert \"Revert \"feat!: Expose a way to reuse ScanResult (#926)\"\"\r\n\r\nThis reverts commit be73814502de08cac0aa766536752088aee359e1.\r\n\r\n* fix!: Make scan returns the public type\r\n\r\nAlso, try to simplify the types of scan further",
          "timestamp": "2022-04-08T11:31:36+02:00",
          "tree_id": "33b8064789434489f6c2bf49e5985ee9fbcb14b9",
          "url": "https://github.com/rocicorp/replicache/commit/cbca2683838451ee438a07201156dece12107508"
        },
        "date": 1649410361135,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167696,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30340,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166305,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29965,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72174,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20809,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "430ef7c560a151eead8e6530bcf4015478788042",
          "message": "refactor: Convert the key for btree index iterator early (#932)\n\nInstead of converting the key from third party BTree iterators to our\r\nencoded string, convert our encoded string to to an entry. Then let the\r\nmain scan loop work with IndexKey as needed.\r\n\r\nThe benefit is that for external iterators we do not have to go from\r\nIndexKey to string and back to IndexKey.",
          "timestamp": "2022-04-08T14:00:08+02:00",
          "tree_id": "316f5884bda87d3be80dc289292de0c2b5d934c3",
          "url": "https://github.com/rocicorp/replicache/commit/430ef7c560a151eead8e6530bcf4015478788042"
        },
        "date": 1649419276916,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167681,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30291,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166290,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29928,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72181,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20744,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6dd3dcf3025c3258b9391b700aa787b2b500d516",
          "message": "refactor: Move fromKeyForIndexScan to same file (#933)\n\nWe have fromKeyForIndexScan and fromKeyForIndexScanInternal. Move them\r\nnext to each other.",
          "timestamp": "2022-04-08T14:57:00+02:00",
          "tree_id": "a2656aaf012eef5aa9bc8b18c799b53129bd9703",
          "url": "https://github.com/rocicorp/replicache/commit/6dd3dcf3025c3258b9391b700aa787b2b500d516"
        },
        "date": 1649422684145,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167683,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30253,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72181,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20708,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Gregory Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "greg@roci.dev",
            "name": "Gregory Baker",
            "username": "grgbkr"
          },
          "distinct": true,
          "id": "b0d8e2af7decb2096d9de3b01349f20504f3aac5",
          "message": "Bump version to 10.0.0-alpha.2.",
          "timestamp": "2022-04-08T12:07:36-07:00",
          "tree_id": "de57362341e4dca795468ffdac521fb2fbaa5743",
          "url": "https://github.com/rocicorp/replicache/commit/b0d8e2af7decb2096d9de3b01349f20504f3aac5"
        },
        "date": 1649445004949,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167683,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30253,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72181,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20708,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "19b66a6454874120cf03b7175a9363e5fc70bcef",
          "message": "chore: Update deps (#934)\n\nMainly to get a newer TS",
          "timestamp": "2022-04-08T20:08:23Z",
          "tree_id": "06bf99e8e44795cb354741120751edc0a3d41756",
          "url": "https://github.com/rocicorp/replicache/commit/19b66a6454874120cf03b7175a9363e5fc70bcef"
        },
        "date": 1649448559673,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ace708fbd7d769658d853eedf5e58612d1e6d2eb",
          "message": "chore: Add type test for scan().keys().toArray (#936)\n\nThis ensures that the type of `scan().keys().toArray()` has the correct\r\ntype.",
          "timestamp": "2022-04-09T11:54:30+02:00",
          "tree_id": "05aae6587b59c8784055dec096e2ba0ab281bbe7",
          "url": "https://github.com/rocicorp/replicache/commit/ace708fbd7d769658d853eedf5e58612d1e6d2eb"
        },
        "date": 1649498129735,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "a4fc92ab2777ef775cb6f17717c8388e9adecba1",
          "message": "make cli actually work",
          "timestamp": "2022-04-11T21:03:56-10:00",
          "tree_id": "49b0a0beb5f8b1018bd34740722e37663a01ea4c",
          "url": "https://github.com/rocicorp/replicache/commit/a4fc92ab2777ef775cb6f17717c8388e9adecba1"
        },
        "date": 1649747099883,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1ca8e3dfd7def26acc0dc199e18528283bced8fc",
          "message": "chore: Type check during build workflow (#938)\n\nThis catches type errors when we build on the bots",
          "timestamp": "2022-04-12T08:44:28Z",
          "tree_id": "f8d7ab39c3b6e9a29f2549e25d34fc7d73d7a77b",
          "url": "https://github.com/rocicorp/replicache/commit/1ca8e3dfd7def26acc0dc199e18528283bced8fc"
        },
        "date": 1649753138182,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dd0d767d82e90c2d97c18d03af5bdac1d3171ac9",
          "message": "fix: Prevent too many modules error in chrome (#942)\n\nChromium has a bug where it fails to load if there are too many modules\r\nin the dependency tree. We were depending on lodash-es which has hundreds\r\nof modules which all tried to get loaded in Chrome.\r\n\r\nChange to only load the sub modules of lodash-es.",
          "timestamp": "2022-04-12T11:25:47Z",
          "tree_id": "8b2876d18eb83624b6af330f5cf01b46e6686e4f",
          "url": "https://github.com/rocicorp/replicache/commit/dd0d767d82e90c2d97c18d03af5bdac1d3171ac9"
        },
        "date": 1649762815926,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d0e12b0fd871600cc057eb6970410bb90c452b83",
          "message": "refactor: Remove dep on lodash-es/range (#943)\n\n* refactor: Remove dep on lodash-es/range\r\n\r\n* chore: Exit perf runner on request failed\r\n\r\nWe get request failed when we hit the chrome bug...",
          "timestamp": "2022-04-12T12:16:04Z",
          "tree_id": "770f5652bbecd7a6253c4dfd65aeeb6573be6e85",
          "url": "https://github.com/rocicorp/replicache/commit/d0e12b0fd871600cc057eb6970410bb90c452b83"
        },
        "date": 1649765818087,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5ec0b3e5ba644a29cc3952e7f82eebd5c8e2894c",
          "message": "fix: Bye bye lodash (#944)",
          "timestamp": "2022-04-12T12:28:56Z",
          "tree_id": "91c95970ced8e4a932970d03bfa566942e24ba0d",
          "url": "https://github.com/rocicorp/replicache/commit/5ec0b3e5ba644a29cc3952e7f82eebd5c8e2894c"
        },
        "date": 1649766614167,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "17a3498d31af6748daae751447cb59100d98969f",
          "message": "chore: Change web-dev-server back to 0.1.29 (#945)",
          "timestamp": "2022-04-12T14:48:45+02:00",
          "tree_id": "a203ac0a1f6bb79dec4d47f66c140c3f5f072821",
          "url": "https://github.com/rocicorp/replicache/commit/17a3498d31af6748daae751447cb59100d98969f"
        },
        "date": 1649767798630,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d003b70272a670b970b04890e5ef596572f29e6f",
          "message": "chore: Remove old perf dashboard (#946)\n\n(Is it getting in the way from the v2??)",
          "timestamp": "2022-04-12T15:29:55+02:00",
          "tree_id": "1275ad9002c4fe7b5ee0f062613ac8eb85b2edd8",
          "url": "https://github.com/rocicorp/replicache/commit/d003b70272a670b970b04890e5ef596572f29e6f"
        },
        "date": 1649770256731,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167339,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166292,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72203,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20796,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "59e8f4f4a4f6772b557e606cfc4dc9e8de021a93",
          "message": "feat: Build minified output bundles only (#935)\n\nWe now keep `process.env.NODE_ENV` in the minified builds.",
          "timestamp": "2022-04-12T13:33:13Z",
          "tree_id": "61caab12f2d089b1b181913e40ba42861ee26ad4",
          "url": "https://github.com/rocicorp/replicache/commit/59e8f4f4a4f6772b557e606cfc4dc9e8de021a93"
        },
        "date": 1649770459060,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ebb4ef82c91a2161be7febd78743f4c7441a4233",
          "message": "chore: Revert back more dependencies (#947)",
          "timestamp": "2022-04-12T13:39:41Z",
          "tree_id": "2ada6b13a7fb2b7bad0892f9126487f96b0f87be",
          "url": "https://github.com/rocicorp/replicache/commit/ebb4ef82c91a2161be7febd78743f4c7441a4233"
        },
        "date": 1649770836829,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "90857aa4b30b4844df7e2639ecd979b0eeded856",
          "message": "chore: Try to exit on fail",
          "timestamp": "2022-04-12T15:58:09+02:00",
          "tree_id": "4efd6b902172bfd0cd5cfb463b87cbf552491295",
          "url": "https://github.com/rocicorp/replicache/commit/90857aa4b30b4844df7e2639ecd979b0eeded856"
        },
        "date": 1649771976884,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "49df45b6fd34eda7527ed78742a20d3d02d24dde",
          "message": "yml!",
          "timestamp": "2022-04-12T15:59:59+02:00",
          "tree_id": "f6cb32dae864ac8fe59781e820119cf63bfce937",
          "url": "https://github.com/rocicorp/replicache/commit/49df45b6fd34eda7527ed78742a20d3d02d24dde"
        },
        "date": 1649772064324,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "0295ded8dacce83ccbbea44a76a7c48611cdcbcf",
          "message": "Undo",
          "timestamp": "2022-04-12T16:00:54+02:00",
          "tree_id": "2ada6b13a7fb2b7bad0892f9126487f96b0f87be",
          "url": "https://github.com/rocicorp/replicache/commit/0295ded8dacce83ccbbea44a76a7c48611cdcbcf"
        },
        "date": 1649773332531,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2c58769fa8d4adcb0a9ff7010287dc9c24d6b35a",
          "message": "chore: Do not ignore errors (#948)\n\nThe GH action needs to use `shell: bash` or the pipe into `tee` swallows the exit code.",
          "timestamp": "2022-04-12T16:38:33+02:00",
          "tree_id": "55f818ba9221badd55087210a7a96e731f4be273",
          "url": "https://github.com/rocicorp/replicache/commit/2c58769fa8d4adcb0a9ff7010287dc9c24d6b35a"
        },
        "date": 1649774382216,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ad6c24f24cac13a66f14a510751b9df7590d8ac7",
          "message": "chore: Run perf test from bundled source code (#949)\n\nThis is to work around issues where chrome/web-dev-server fails to load\r\nthe files",
          "timestamp": "2022-04-12T15:46:01Z",
          "tree_id": "0d972c963ca3c020d1adb7062569c1d0ca0a079b",
          "url": "https://github.com/rocicorp/replicache/commit/ad6c24f24cac13a66f14a510751b9df7590d8ac7"
        },
        "date": 1649778439359,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "dcc30e9f0969b768c25215494ed741aaacea5dd0",
          "message": "Bump version to 10.0.0-alpha.3.",
          "timestamp": "2022-04-13T15:04:50+02:00",
          "tree_id": "808c5212f564c1b1b506dc7cdfc2497b5bc2828e",
          "url": "https://github.com/rocicorp/replicache/commit/dcc30e9f0969b768c25215494ed741aaacea5dd0"
        },
        "date": 1649855148659,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "59e88698dec40812cacfac50522c9c27e7bb0f39",
          "message": "Bump version to 10.0.0-alpha.4.",
          "timestamp": "2022-04-13T15:11:36+02:00",
          "tree_id": "769f204334d4a64fbe015566d83c426ec66fa658",
          "url": "https://github.com/rocicorp/replicache/commit/59e88698dec40812cacfac50522c9c27e7bb0f39"
        },
        "date": 1649855592051,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29376,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72264,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20798,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "558d93cec9e873070864ea17b5a60a2203766301",
          "message": "refactor: Add AbortSignal to sleep (#951)\n\nI need it in the near future",
          "timestamp": "2022-04-14T13:13:23+02:00",
          "tree_id": "ee8374e1f53a4a19d56fa49a291e673ee9c6e25c",
          "url": "https://github.com/rocicorp/replicache/commit/558d93cec9e873070864ea17b5a60a2203766301"
        },
        "date": 1649934878005,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159471,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29770,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158424,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29481,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72431,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20847,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "495d9b7f48e6ba67ff2cfdcecd7777477a23dcf1",
          "message": "chore: Make perf test use out/replicache (#950)\n\nThis is so that we are testing something closer to what we are building.",
          "timestamp": "2022-04-14T13:15:23Z",
          "tree_id": "077c9f8786bdae72c364c49139080248fde96c08",
          "url": "https://github.com/rocicorp/replicache/commit/495d9b7f48e6ba67ff2cfdcecd7777477a23dcf1"
        },
        "date": 1649942178581,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159632,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29799,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158585,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29499,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72498,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20931,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6a08d8c5a9dd279936e33349d132b6f2c09e0c07",
          "message": "chore; Add lastOpenedTimestampMS to IndexedDBDatabase (#952)\n\nWhen the IDB is added to the meta table we note the time stamp. This is\r\ngoing to be used later when we GC IDB instances.",
          "timestamp": "2022-04-14T13:46:13Z",
          "tree_id": "672cba8662d39c9f904f83ccb15ec593db3b3397",
          "url": "https://github.com/rocicorp/replicache/commit/6a08d8c5a9dd279936e33349d132b6f2c09e0c07"
        },
        "date": 1649944023338,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159848,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29846,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158801,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29542,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72595,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20914,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fbf59c6ac033d221cde3768632fe1beb46507b53",
          "message": "chore: Silence some test log spew (#956)",
          "timestamp": "2022-04-15T13:36:11Z",
          "tree_id": "04fddff13adf753610e4cd96248bc6361e64f5a0",
          "url": "https://github.com/rocicorp/replicache/commit/fbf59c6ac033d221cde3768632fe1beb46507b53"
        },
        "date": 1650029835172,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 159848,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 29846,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 158801,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 29542,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 72595,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 20914,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "bdeb1d4aab3cbcc476670df378d7a743aaf2bd55",
          "message": "chore: Remove prolly test reference",
          "timestamp": "2022-04-15T17:16:09+02:00",
          "tree_id": "219db64f4f2aa7782a4b9aa4498a06cd7608b94b",
          "url": "https://github.com/rocicorp/replicache/commit/bdeb1d4aab3cbcc476670df378d7a743aaf2bd55"
        },
        "date": 1650035831522,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163060,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30446,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162013,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73996,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21304,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "daba7c599b5fd4e066a596a8aeb8ed1e62cf2e6f",
          "message": "refactor: Use AbortSignal for bg interval abstraction",
          "timestamp": "2022-04-15T17:30:28+02:00",
          "tree_id": "b0ebf6a577913daa4905466698435b5b45892d8f",
          "url": "https://github.com/rocicorp/replicache/commit/daba7c599b5fd4e066a596a8aeb8ed1e62cf2e6f"
        },
        "date": 1650036681809,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163111,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30432,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162064,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73956,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21260,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "11f2626e1ee73d87ff8cf412f1c7dc18fdde2f1f",
          "message": "chore: Use extends instead of hack\n\nI forgot to fix/remove this `@ts-expect-error` when I was working on\nscan.",
          "timestamp": "2022-04-18T20:42:59+02:00",
          "tree_id": "c09cd4b6092a280ea98ff2b884c89a20a45fb058",
          "url": "https://github.com/rocicorp/replicache/commit/11f2626e1ee73d87ff8cf412f1c7dc18fdde2f1f"
        },
        "date": 1650307442251,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163070,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30418,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162023,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30117,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73925,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21261,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "25708a3b41d3eebe5cfe1304b5a214df8dcbac17",
          "message": "feat: Change MAX_AGE for idb collect to 1 month\n\nCloses #959",
          "timestamp": "2022-04-18T20:51:19+02:00",
          "tree_id": "69b7fe9517506f354de2f1666513204fb0e908fc",
          "url": "https://github.com/rocicorp/replicache/commit/25708a3b41d3eebe5cfe1304b5a214df8dcbac17"
        },
        "date": 1650307928713,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163038,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30408,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161991,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30115,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73913,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21264,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "5719b0c72c99b5c39696c97f486402cbe146c358",
          "message": "chore: Change how we expose internal API\n\nCloses #958",
          "timestamp": "2022-04-18T21:37:10+02:00",
          "tree_id": "6644f9eae133ac678c2851a41ce44515172a7b3f",
          "url": "https://github.com/rocicorp/replicache/commit/5719b0c72c99b5c39696c97f486402cbe146c358"
        },
        "date": 1650310691761,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163058,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30422,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162011,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30115,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73914,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21257,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "6e2af0ac7d3ce63a763dbacf1892a053f374535b",
          "message": "fix: Scan in WriteTransaction\n\nscan was not working correctly in WriteTransactions. When I refactored\nscan I changed to look up the chunk in the chunk store but when we have\na write transaction the B+Tree might have some modified nodes that have\nnot yet been flushed to the chunk store.\n\nFixes #962",
          "timestamp": "2022-04-18T22:34:31+02:00",
          "tree_id": "090338fb61725777523d195fcb7c809043d7d0ba",
          "url": "https://github.com/rocicorp/replicache/commit/6e2af0ac7d3ce63a763dbacf1892a053f374535b"
        },
        "date": 1650314133141,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163277,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162230,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 74011,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21318,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "63a336ea81e1ba03a446fd25c4d89eb7f7640035",
          "message": "fix: docs failed to build after a recent change\n\nWe need to use a newer version of TS to allow statements before super.",
          "timestamp": "2022-04-18T22:54:58+02:00",
          "tree_id": "75d1029b49b352765247fcc5c80b091bca3cac41",
          "url": "https://github.com/rocicorp/replicache/commit/63a336ea81e1ba03a446fd25c4d89eb7f7640035"
        },
        "date": 1650315351781,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163277,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162230,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 74011,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21318,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "ee015d4163738d012a2622685d014a816ec015db",
          "message": "Spruce up Getting Started:\n\n- Make it more explicit that we intend for devs to start by forking this repo.\n- Add a section introducing the layout of the project.\n- Make it explicit that you don't need to understand backend dir immediately.\n- Link next to How it Works (which will change soon), not Integration Guide.",
          "timestamp": "2022-04-19T01:54:39-10:00",
          "tree_id": "978737c129f4a19cbf665c3ac137bf87d5c5497f",
          "url": "https://github.com/rocicorp/replicache/commit/ee015d4163738d012a2622685d014a816ec015db"
        },
        "date": 1650369334901,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163277,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162230,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 74011,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21318,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "a6483e4a97ea1ee2102f69d40f3cbd87326e4792",
          "message": "Spruce up Getting Started:\n\n- Make it more explicit that we intend for devs to start by forking this repo.\n- Add a section introducing the layout of the project.\n- Make it explicit that you don't need to understand backend dir immediately.\n- Link next to How it Works (which will change soon), not Integration Guide.",
          "timestamp": "2022-04-19T02:06:23-10:00",
          "tree_id": "47bdcde09bc6cc7455c2a6790997cf88618e3ecb",
          "url": "https://github.com/rocicorp/replicache/commit/a6483e4a97ea1ee2102f69d40f3cbd87326e4792"
        },
        "date": 1650370058419,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163277,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162230,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 74011,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21318,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "3a36c8270962ad3cd464eb5e59bb18d8f104e39a",
          "message": "refactor: Simplify getIndexKeys\n\nWas looking at the index code and this function was a just a bit\nstrange...",
          "timestamp": "2022-04-19T23:09:09+02:00",
          "tree_id": "0c228e4cef6fb5ff2f16c6089e8cbca163204452",
          "url": "https://github.com/rocicorp/replicache/commit/3a36c8270962ad3cd464eb5e59bb18d8f104e39a"
        },
        "date": 1650402603968,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163178,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30428,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162131,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73966,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21310,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "1dcdb5540dddefaca5080a3e0d898a7ced814df2",
          "message": "refactor: Use DiffResult all the way\n\nInstead of having a `string[]` with the changed keys we now use\n`DiffResult<ReadonlyJSONValue>[]` all the way.\n\nTODO: This does not rename things yet.\n\nTowards #839",
          "timestamp": "2022-04-20T20:26:06+02:00",
          "tree_id": "011771358d68ab3e50e570b7aaea45bd654edda6",
          "url": "https://github.com/rocicorp/replicache/commit/1dcdb5540dddefaca5080a3e0d898a7ced814df2"
        },
        "date": 1650479218323,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 163075,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30474,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 162028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30171,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 74003,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21330,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "522f51e05847302f49e7510e5b4e898f2bdee19e",
          "message": "refactor: Rename a few diff related types\n\nTowards #839",
          "timestamp": "2022-04-20T21:11:06+02:00",
          "tree_id": "c90bb308c8b17d51f824e40315917515137b7931",
          "url": "https://github.com/rocicorp/replicache/commit/522f51e05847302f49e7510e5b4e898f2bdee19e"
        },
        "date": 1650481922616,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162550,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30380,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161503,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73822,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21238,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "29cde3d5548ff34ed3e565fce2b5371a2f1f2fa2",
          "message": "chore(deps): bump async from 2.6.3 to 2.6.4\n\nBumps [async](https://github.com/caolan/async) from 2.6.3 to 2.6.4.\n- [Release notes](https://github.com/caolan/async/releases)\n- [Changelog](https://github.com/caolan/async/blob/v2.6.4/CHANGELOG.md)\n- [Commits](https://github.com/caolan/async/compare/v2.6.3...v2.6.4)\n\n---\nupdated-dependencies:\n- dependency-name: async\n  dependency-type: indirect\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>",
          "timestamp": "2022-04-20T16:54:18-10:00",
          "tree_id": "7b85d44db80ade1437272ba7231c8533c1d3fafd",
          "url": "https://github.com/rocicorp/replicache/commit/29cde3d5548ff34ed3e565fce2b5371a2f1f2fa2"
        },
        "date": 1650509724614,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162550,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30380,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161503,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73822,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21238,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "e4411c782239eacf530a0dfe971084a048deeddf",
          "message": "chore(deps): bump async from 2.6.3 to 2.6.4 in /doc\n\nBumps [async](https://github.com/caolan/async) from 2.6.3 to 2.6.4.\n- [Release notes](https://github.com/caolan/async/releases)\n- [Changelog](https://github.com/caolan/async/blob/v2.6.4/CHANGELOG.md)\n- [Commits](https://github.com/caolan/async/compare/v2.6.3...v2.6.4)\n\n---\nupdated-dependencies:\n- dependency-name: async\n  dependency-type: indirect\n...\n\nSigned-off-by: dependabot[bot] <support@github.com>",
          "timestamp": "2022-04-20T16:58:04-10:00",
          "tree_id": "af306a7184eff49aaa3e3e752c374eec0e9c0fe7",
          "url": "https://github.com/rocicorp/replicache/commit/e4411c782239eacf530a0dfe971084a048deeddf"
        },
        "date": 1650509935256,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162550,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30380,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161503,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30088,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73822,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21238,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "8b2955fbc965e2568c2ce77b19af4e5c33a1f75f",
          "message": "chore: Followup to 1dcdb5540dddefaca5080a3e0d898a7ced814df2",
          "timestamp": "2022-04-21T10:50:11+02:00",
          "tree_id": "ef2c2c1c674e35f902b5d80324e58653ea6233f3",
          "url": "https://github.com/rocicorp/replicache/commit/8b2955fbc965e2568c2ce77b19af4e5c33a1f75f"
        },
        "date": 1650531081217,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30420,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161660,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30134,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21314,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "1c6460fed9b7d207ad6c6fe0485cdf55cf0985f0",
          "message": "add how to set up new runner",
          "timestamp": "2022-04-21T16:51:35-10:00",
          "tree_id": "952b1a50346c5742904c8ef2a5eb1ccb7395368e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/1c6460fed9b7d207ad6c6fe0485cdf55cf0985f0"
        },
        "date": 1650595962105,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30420,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161660,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30134,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21314,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6334d5226214c272ee275454b0b81482e4827d44",
          "message": "Update design.md",
          "timestamp": "2022-04-23T17:09:06-10:00",
          "tree_id": "a08c86164580058d8e446d1adcbe354934605cdd",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6334d5226214c272ee275454b0b81482e4827d44"
        },
        "date": 1650769817837,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30420,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161660,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30134,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21314,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36f5c19c4717c8dde3e628b42b467df661e0fdb6",
          "message": "Update design.md",
          "timestamp": "2022-04-23T17:10:16-10:00",
          "tree_id": "f7b2a2faf02585bcea0ed0f9c2d6e0bbe9366567",
          "url": "https://github.com/rocicorp/replicache-internal/commit/36f5c19c4717c8dde3e628b42b467df661e0fdb6"
        },
        "date": 1650769872953,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30420,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161660,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30134,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21314,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a4551024fd6aa6fdba365cc576be72058de42a8f",
          "message": "Update design.md",
          "timestamp": "2022-04-23T17:27:34-10:00",
          "tree_id": "c601f628a18e49e021857c7dca35454317771a2b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/a4551024fd6aa6fdba365cc576be72058de42a8f"
        },
        "date": 1650770912725,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30420,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161660,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30134,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21314,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "184321fef9c4db86aa94e45fdac68e827f4da983",
          "message": "npm run format",
          "timestamp": "2022-04-25T15:33:08+02:00",
          "tree_id": "10c7eacb87f5dd428e3a8ed347fb9314fa410b54",
          "url": "https://github.com/rocicorp/replicache-internal/commit/184321fef9c4db86aa94e45fdac68e827f4da983"
        },
        "date": 1650893664822,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30420,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161660,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30134,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21314,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "3aee7f86b33c1e0f9cf7582fdd660a680e84d15e",
          "message": "Rename to experimental*",
          "timestamp": "2022-04-25T17:17:46+02:00",
          "tree_id": "c54e480d7efe104089b5c50a8fe3aebe2b31ec9d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3aee7f86b33c1e0f9cf7582fdd660a680e84d15e"
        },
        "date": 1650899933717,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166044,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31025,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164997,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30753,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 75563,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21759,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "dab76b90a5d3fa27fdb4f5021b6e89fbf7145719",
          "message": "Revert \"chore: Use extends instead of hack\"\n\nThis reverts commit 11f2626e1ee73d87ff8cf412f1c7dc18fdde2f1f.",
          "timestamp": "2022-04-25T22:48:39+02:00",
          "tree_id": "65194627d9ac0a467fafcecc508d281ad119fe65",
          "url": "https://github.com/rocicorp/replicache-internal/commit/dab76b90a5d3fa27fdb4f5021b6e89fbf7145719"
        },
        "date": 1650919782114,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162748,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30431,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161701,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30135,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73922,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21307,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "d97aad4378ec5b11c59f8eaa8bad30e7285f6936",
          "message": "chore: Make dbtx public",
          "timestamp": "2022-04-26T15:18:16+02:00",
          "tree_id": "f1169e279f9fc19839448a0890313ee3d268ca85",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d97aad4378ec5b11c59f8eaa8bad30e7285f6936"
        },
        "date": 1650979163889,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 162698,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 30405,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 161651,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30115,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 73930,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21312,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "6ec6b9f6a6302d038c4bbbe2ca84e5cb961e71e9",
          "message": "feat: Add watch function\n\nSecond try, keeping the queryInternal function as before\n\nNow you can get called after a commit is complete and the arguments\npassed to the watch function includes a diff of the changes.\n\nCloses #839",
          "timestamp": "2022-04-26T15:51:53+02:00",
          "tree_id": "a33da60bb6af12cdb148776ae961cd9792c96a29",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6ec6b9f6a6302d038c4bbbe2ca84e5cb961e71e9"
        },
        "date": 1650981171511,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166528,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 165481,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30856,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 75732,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21781,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a4afc39927d8c3f53aa6626ef4c8318289020c8e",
          "message": "feat: Mark watch API experimental (#16)\n\nRevert \"Revert \"Rename to experimental*\"\"\r\n\r\nThis reverts commit 27bcc26c1158fd884191dc076629384174b75810.",
          "timestamp": "2022-04-26T14:00:37Z",
          "tree_id": "4a76a6e6b888bad1319883b90d5c1fafc43cd6c9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/a4afc39927d8c3f53aa6626ef4c8318289020c8e"
        },
        "date": 1650981704347,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31144,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 165493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30844,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 75744,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21829,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0f58f3adad8142b34ab133de3e4e8cf07ccbf0ea",
          "message": "Revert \"Revert \"chore: Extract binary search\"\" (#18)\n\nThis reverts commit 554a3547dfbd6f4757fc8288f144c6a15fb45c6e.",
          "timestamp": "2022-04-26T14:16:26Z",
          "tree_id": "71a9998d25f39c5606d0c01235b0b1fbae04d7ac",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0f58f3adad8142b34ab133de3e4e8cf07ccbf0ea"
        },
        "date": 1650982649107,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 166034,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31013,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 164987,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30720,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 75600,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21693,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c25ed255e78b805d45d5c6ed137ecb8f8baf9fcd",
          "message": "feat: Add helper functions for pending with makeScanResult (#11)\n\n`makeScanResult` takes an `AsyncIterable`  but sometimes the backend\r\nmight use different data store without a unified entry point. For these\r\ncases you might want to merge a \"pending\" iterator on top of a\r\n\"persisted\" iterator. To do this we provide a `mergeAsyncIterators`\r\nfunction as well as a `filterAsyncIterator` function. The filter version\r\nis useful if you want to filter out tombstones from the iterator.",
          "timestamp": "2022-04-26T21:05:46+02:00",
          "tree_id": "483531343e858af6c02345cc61ceecae3eca010d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c25ed255e78b805d45d5c6ed137ecb8f8baf9fcd"
        },
        "date": 1651000017733,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167222,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31206,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166121,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30917,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76102,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21815,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7e72ce49c1f0a38d821e8401a02247c37ffaa1d0",
          "message": "chore: Always build with sourcemaps (#20)\n\nThis is so that we can deobfuscate stack traces.\r\n\r\nOne way to deobfuscate the stack trace is to copy the stack trace to the clipboard and then run\r\n\r\n```sh\r\nnpx stacktracify out/replicache.mjs.map\r\n```\r\n\r\nyou can also save the stacktrace to a file and use `--file`",
          "timestamp": "2022-04-27T08:39:36Z",
          "tree_id": "b005a5e62028ca286f2475e637aa6c91a37ba67a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7e72ce49c1f0a38d821e8401a02247c37ffaa1d0"
        },
        "date": 1651048836921,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31243,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166161,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30939,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21893,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "f59e600c1cf34af644856911b7898ed7916aa020",
          "message": "Bump version to 10.0.0-beta.0.",
          "timestamp": "2022-04-27T12:02:13+02:00",
          "tree_id": "904d0f5c01de864602996c4a27b54d4daf6c4a19",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f59e600c1cf34af644856911b7898ed7916aa020"
        },
        "date": 1651053810319,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31243,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166161,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30939,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21893,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c51e5640200c4426825b80e1786882d71e51c0a9",
          "message": "fix: makeScanResult etc needs Value param type (#23)\n\nSince ReadTransaction scan uses ReadonlyJSONValue but WriteTransaction\r\nscan uses JSONValue we need to parameterize the value type.",
          "timestamp": "2022-04-27T15:53:35+02:00",
          "tree_id": "528de59a0f0c2a559db728c29df1367201eae698",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c51e5640200c4426825b80e1786882d71e51c0a9"
        },
        "date": 1651067675918,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167290,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31235,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166190,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30940,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76150,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21828,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4f2715cb71a813a00cfd684102c4da711bab1ae9",
          "message": "feat: Relax iterable types in makeScanResult etc (#24)\n\nIn most places where an AsyncIterable/AsyncIterator is wanted ES\r\nsupports passing in an Iterable/Iterator instead.",
          "timestamp": "2022-04-27T14:29:59Z",
          "tree_id": "977433699bbeea8fa738ccc25b915f788c0cd408",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4f2715cb71a813a00cfd684102c4da711bab1ae9"
        },
        "date": 1651069870814,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167433,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31298,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166333,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 30997,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76212,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21894,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ab18acf79ee9b763c70c61773a5e5e98a26faadd",
          "message": "chore: Assert that we have no cyclic chunks (#22)\n\nAdd asserts so that we do not iloop when we end up with cyclic refs.\r\n\r\nThis adds assert both in `LazyStore` and `Chunk` creation.\r\n\r\nIf this impacts the perf we might consider turning these of in production mode.\r\n\r\nTowards #21",
          "timestamp": "2022-04-28T08:18:58Z",
          "tree_id": "2f4f6cbda8149061c530772649c717932936fcd3",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ab18acf79ee9b763c70c61773a5e5e98a26faadd"
        },
        "date": 1651134013745,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167597,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31333,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166497,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31023,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76318,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21954,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f3cc13c4bd7de891c1e5f0c464cec29ff7637013",
          "message": "chore: Try to silence errors in IDB during IDB close (#26)\n\nWe now ignore errors in persist if the DB was closed.\r\n\r\nTowards https://github.com/rocicorp/replicache/issues/973",
          "timestamp": "2022-04-28T14:08:30Z",
          "tree_id": "499f8987177a966fe1a599c4512d1d51be4a2b44",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f3cc13c4bd7de891c1e5f0c464cec29ff7637013"
        },
        "date": 1651154998205,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a419715761577be24356ac7c4ca5eeff4aa105fb",
          "message": "chore: Update bump to not update license/BSL.txt (#27)",
          "timestamp": "2022-04-28T14:41:58Z",
          "tree_id": "1a9e706c2b2572b155ba062d1437d24a0f6b497c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/a419715761577be24356ac7c4ca5eeff4aa105fb"
        },
        "date": 1651156979822,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "4fbda2b8334b050fab265624e5168b98bd968bcf",
          "message": "chore: Remove import from bump\n\nI guess I should set up my go env again?",
          "timestamp": "2022-04-28T16:48:41+02:00",
          "tree_id": "057a5349eef96408e012f1b769af697d81832e9b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4fbda2b8334b050fab265624e5168b98bd968bcf"
        },
        "date": 1651157417815,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "03bbcf00fe2948de679d4de88da0ddbc8e8c4555",
          "message": "Bump version to 10.0.0-beta.1.",
          "timestamp": "2022-04-28T16:49:37+02:00",
          "tree_id": "f3e6806a5c97eb9c759bdea4b2c49775c6419dc5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/03bbcf00fe2948de679d4de88da0ddbc8e8c4555"
        },
        "date": 1651157469084,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "3bda7247e57cf8588f9d3d34bae7c37023d5ad7a",
          "message": "address some cr comments",
          "timestamp": "2022-04-28T11:45:17-10:00",
          "tree_id": "0f5468521f3c7e25dd11128f411bc6fb7ddd1cf7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3bda7247e57cf8588f9d3d34bae7c37023d5ad7a"
        },
        "date": 1651182371629,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "1d88f4670d9b062744543822483d27dbf665e4df",
          "message": "add specific perf numbers to doc",
          "timestamp": "2022-04-28T19:48:52-10:00",
          "tree_id": "cea4501d2d4de39a460bd6abae2ff6f683ac05df",
          "url": "https://github.com/rocicorp/replicache-internal/commit/1d88f4670d9b062744543822483d27dbf665e4df"
        },
        "date": 1651211391956,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "c02bc7d2a7aa0342307c004d9f0d3493d4cea611",
          "message": "add new how rep works doc",
          "timestamp": "2022-04-29T15:12:20-10:00",
          "tree_id": "605ab99b1198f01b4dcbc941620e2ac0f35d3355",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c02bc7d2a7aa0342307c004d9f0d3493d4cea611"
        },
        "date": 1651281206484,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d68120555a8a615d5db1b27ec69f6be80fb198e2",
          "message": "Update sidebars.js",
          "timestamp": "2022-05-02T00:31:04-10:00",
          "tree_id": "5ecc1b4e3ceb57e9f441ad8435d275ce29550093",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d68120555a8a615d5db1b27ec69f6be80fb198e2"
        },
        "date": 1651487524693,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "17ac5d76c62c470e4281eabadb3b160aa19e7c5a",
          "message": "Update getting-started.md",
          "timestamp": "2022-05-02T00:32:46-10:00",
          "tree_id": "1263b4ba08c010f0784fc88842427ab21d8c4cb6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/17ac5d76c62c470e4281eabadb3b160aa19e7c5a"
        },
        "date": 1651487627886,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "bc4090bedc10756534c98f6bc886a72b52b758dc",
          "message": "Overwrite old how-it-works with new how-replicache-works",
          "timestamp": "2022-05-02T00:39:19-10:00",
          "tree_id": "b79ea0a2f04c7041b123b02b7b8cd941ad7b09ec",
          "url": "https://github.com/rocicorp/replicache-internal/commit/bc4090bedc10756534c98f6bc886a72b52b758dc"
        },
        "date": 1651488019355,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "e8a330af7ee464d8455a80c06f6d79c2fcf98847",
          "message": "fix broken link",
          "timestamp": "2022-05-02T00:45:15-10:00",
          "tree_id": "0f04a645dd07f120563865ce561c60afc610ab81",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e8a330af7ee464d8455a80c06f6d79c2fcf98847"
        },
        "date": 1651488379567,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166742,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21962,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cbb2e6ef85dfdfc53686f1783b5d17da0753793d",
          "message": "feat: Export version const. (#35)\n\nWe use esbuild to inject the version read from package.json\r\n\r\nFixes #845",
          "timestamp": "2022-05-02T13:57:22Z",
          "tree_id": "97f95a848aad28f84a4203e0f2b94056d88b357f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/cbb2e6ef85dfdfc53686f1783b5d17da0753793d"
        },
        "date": 1651499915007,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167918,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166803,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31098,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22006,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "99192698e0b131c32ea4bc7e9a8ecdcf0e7a0415",
          "message": "re-org sidebar",
          "timestamp": "2022-05-02T20:09:21-10:00",
          "tree_id": "1458d710f446e4d472fd57c12157a7b681f1f295",
          "url": "https://github.com/rocicorp/replicache-internal/commit/99192698e0b131c32ea4bc7e9a8ecdcf0e7a0415"
        },
        "date": 1651558245414,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167918,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166803,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31098,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22006,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e7ce103546c4a888bfe97478ca60484c69149ef",
          "message": "chore: WebKit and Firefox supports es modules in workers now (#38)\n\nSo no need to split the tests into groups",
          "timestamp": "2022-05-03T13:50:40Z",
          "tree_id": "0dbc0f4df863c7d49671dbf3af7c4326d09b6c9f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9e7ce103546c4a888bfe97478ca60484c69149ef"
        },
        "date": 1651585899062,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167918,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166803,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31098,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22006,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "49699333+dependabot[bot]@users.noreply.github.com",
            "name": "dependabot[bot]",
            "username": "dependabot[bot]"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6b98f472e059bcd22f4268afac0b778cd92ce514",
          "message": "chore(deps): bump cross-fetch from 3.1.4 to 3.1.5 in /doc (#29)\n\nBumps [cross-fetch](https://github.com/lquixada/cross-fetch) from 3.1.4 to 3.1.5.\r\n- [Release notes](https://github.com/lquixada/cross-fetch/releases)\r\n- [Commits](https://github.com/lquixada/cross-fetch/compare/v3.1.4...v3.1.5)\r\n\r\n---\r\nupdated-dependencies:\r\n- dependency-name: cross-fetch\r\n  dependency-type: indirect\r\n...\r\n\r\nSigned-off-by: dependabot[bot] <support@github.com>\r\n\r\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-05-04T09:26:57Z",
          "tree_id": "f8aa26f42bc5bfc0fd159d423019cf8cc1a1a4a9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6b98f472e059bcd22f4268afac0b778cd92ce514"
        },
        "date": 1651656478423,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167918,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166803,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31098,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22006,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4657518df48e8e4e4508989ddac01ce1397825a7",
          "message": "fix!: Make AsyncIterableIteratorToArray an interface (#40)\n\nPreviously we had a concrete class called\r\n`AsyncIterableIteratorToArrayWrapper`. When you have a concrete class it\r\nleads to problems because `ReadTransaction` and `WriteTransaction` now\r\ndepend on a concrete class. When you have a concrete class you can not\r\nuse duck typing. You can not reuse the `ReadTransaction` and\r\n`WriteTransaction` on the client and server unless they point at the same\r\nexact file defining the concrete type.\r\n\r\nBy making this an interface it is OK to have duplicate compatible\r\ndefinition of the type.\r\n\r\nThis removes the possibility to reuse the old\r\n`AsyncIterableIteratorToArrayWrapper` class in code that depends on\r\nreplicache.\r\n\r\nBREAKING CHANGE!",
          "timestamp": "2022-05-04T12:15:18-07:00",
          "tree_id": "cd901821fa34359a79b887652f5827668ef11320",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4657518df48e8e4e4508989ddac01ce1397825a7"
        },
        "date": 1651691783695,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167825,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31382,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31079,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21988,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "c8459752da5ecd59b4cb576943e36ed0282d883a",
          "message": "docs: whoops repliear does not use react designer",
          "timestamp": "2022-05-04T16:54:18-10:00",
          "tree_id": "67c053b393a9a1560213227ffbb56457673f220f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c8459752da5ecd59b4cb576943e36ed0282d883a"
        },
        "date": 1651719314624,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167825,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31382,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31079,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21988,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "08d6f220a15214fbe3c91be50815379a36200376",
          "message": "docs: include faq toc and add unpushed mutations item",
          "timestamp": "2022-05-04T18:33:37-10:00",
          "tree_id": "7a60a852f8539ba5789dba532062698dd81a9db8",
          "url": "https://github.com/rocicorp/replicache-internal/commit/08d6f220a15214fbe3c91be50815379a36200376"
        },
        "date": 1651725290360,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167825,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31382,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31079,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21988,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7cb8ba09732bc9de87cf19a7cd8b6404fe939955",
          "message": "chore: Add type annotation to wtr config (#86)\n\nSo we get autocomplete etc",
          "timestamp": "2022-05-05T10:22:34Z",
          "tree_id": "bff0e6de9d87cecf2ef11cd03d2a44b3d3fd5f61",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7cb8ba09732bc9de87cf19a7cd8b6404fe939955"
        },
        "date": 1651746210450,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167825,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31382,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31079,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21988,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c93d86b669b82aa0c8639361be9470347cce07b4",
          "message": "chore: Use Promise.allSettled (#87)\n\nInstead of hand-rolled impl.",
          "timestamp": "2022-05-05T14:29:42Z",
          "tree_id": "50f4a57358893098efb3b5048bec383c4f4d790c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c93d86b669b82aa0c8639361be9470347cce07b4"
        },
        "date": 1651761054109,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "6203fa6376a034b1fbfc450921e91a408410157a",
          "message": "docs: add new big picture",
          "timestamp": "2022-05-05T08:04:52-10:00",
          "tree_id": "3b847ebdd3477fe80c5b509679b83dba6ab14b5d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6203fa6376a034b1fbfc450921e91a408410157a"
        },
        "date": 1651773959022,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "51d028af68bfcef6a164cd6a18039f9ffc1d05c3",
          "message": "docs: getting-started update: docker, supabase, env vars (#89)",
          "timestamp": "2022-05-05T21:57:11Z",
          "tree_id": "e1a2089d47c5a3e5c98a22af436bd946d65e912d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/51d028af68bfcef6a164cd6a18039f9ffc1d05c3"
        },
        "date": 1651787901905,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "15a19dd01f9ac1193c42ce94304142ca991973ea",
          "message": "docs: add line about installing supabase cli (#90)",
          "timestamp": "2022-05-05T22:40:20Z",
          "tree_id": "18376eadc98cc4113e5eeac1259bdd22d8743f47",
          "url": "https://github.com/rocicorp/replicache-internal/commit/15a19dd01f9ac1193c42ce94304142ca991973ea"
        },
        "date": 1651790476774,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "1cb3bdbd424d91ff8a11f9d38b119e666a66c16c",
          "message": "docs: update diff details section",
          "timestamp": "2022-05-05T14:48:33-10:00",
          "tree_id": "8795a7de14717925f4b15bfdb47a9d2f727c14e6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/1cb3bdbd424d91ff8a11f9d38b119e666a66c16c"
        },
        "date": 1651798167672,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "b9cf6ed6f95f04394cf0e97b981b5bd4bd7d135a",
          "message": "docs: add conflict resolution",
          "timestamp": "2022-05-05T16:49:53-10:00",
          "tree_id": "6ec14d35d2ba1c539584cfcb3d902d893c359be1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b9cf6ed6f95f04394cf0e97b981b5bd4bd7d135a"
        },
        "date": 1651805452227,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "cbe270c4ae2148b9604a7935334644eb060499eb",
          "message": "docs: proofreading pass",
          "timestamp": "2022-05-05T18:19:53-10:00",
          "tree_id": "16a6daf380755aba4fb816a03d00af505d103b18",
          "url": "https://github.com/rocicorp/replicache-internal/commit/cbe270c4ae2148b9604a7935334644eb060499eb"
        },
        "date": 1651810847822,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ef2e769381dd28f15204b7882b5f6587e596a520",
          "message": "docs: update go-offline faq item",
          "timestamp": "2022-05-05T21:47:57-10:00",
          "tree_id": "51e280b4390f6e9187d39b8df4ca68d19a6735ad",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ef2e769381dd28f15204b7882b5f6587e596a520"
        },
        "date": 1651823348938,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167663,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31343,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166548,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21935,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "345df2b3594352dcd6cab64b58956711473892ee",
          "message": "fix: Prevent concurrent pulls and persists (#95)\n\nWe had a lock around persist to ensure that we only do one at a time.\r\n\r\nConnectionLoop limited the number of concurrent pulls to 1\r\n(configurable).\r\n\r\nHowever...\r\n\r\nIf a persist happens during a pull the hash of the SYNC_HEAD might change.\r\n\r\nWe therefore we use the lock for both pull and push to ensure they do\r\nnot happen concurrently.",
          "timestamp": "2022-05-06T07:05:35-07:00",
          "tree_id": "42f97ca54a8b2618b38f6f69fab68379f5e77a04",
          "url": "https://github.com/rocicorp/replicache-internal/commit/345df2b3594352dcd6cab64b58956711473892ee"
        },
        "date": 1651845997490,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167899,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31391,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166784,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31077,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21995,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bd2ec366bb770fd3c4dea1038e9e6971813d257c",
          "message": "refactor: Deal with index map diffs (#96)\n\nPreviously we missed some index map diffs. But things worked because we\r\nwere rerunning all subscriptions that reference the index that was\r\nchanged, no matter what the keys were.\r\n\r\nFixes #44",
          "timestamp": "2022-05-06T14:45:12Z",
          "tree_id": "40d07811f77f8e6c35a14fe6dd77ae922b7ad7b5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/bd2ec366bb770fd3c4dea1038e9e6971813d257c"
        },
        "date": 1651848384741,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167842,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31390,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166727,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31083,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76399,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22022,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "dd3ccd27aabbdf144a59a7291d0b0e75806c8e3b",
          "message": "chore: Remove some dead code (#97)\n\nFollowup to bd2ec366bb770fd3c4dea1038e9e6971813d257c",
          "timestamp": "2022-05-06T15:26:22Z",
          "tree_id": "2268c1d9716846bb7dfa53d127e30bb9e8334c89",
          "url": "https://github.com/rocicorp/replicache-internal/commit/dd3ccd27aabbdf144a59a7291d0b0e75806c8e3b"
        },
        "date": 1651850851537,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "952cd356078c27d39ae4d368e8ae74b420abaa30",
          "message": "doc: add FAQ items about undo, presence, text editing (#98)",
          "timestamp": "2022-05-06T10:25:37-07:00",
          "tree_id": "d2ab733cf41dd0ffbe646a94287e70a7b4311091",
          "url": "https://github.com/rocicorp/replicache-internal/commit/952cd356078c27d39ae4d368e8ae74b420abaa30"
        },
        "date": 1651857992113,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "98315428a94f671f3007c2b89c268771a3b90806",
          "message": "bump licensing to 4.0.0",
          "timestamp": "2022-05-06T07:41:37-10:00",
          "tree_id": "926a74be8a67c96c071eb585e27b449373854c98",
          "url": "https://github.com/rocicorp/replicache-internal/commit/98315428a94f671f3007c2b89c268771a3b90806"
        },
        "date": 1651858960140,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "402b4792f114682ca9abd79d51c227254dc80d85",
          "message": "doc: link to discord.replicache.dev (#102)",
          "timestamp": "2022-05-06T20:31:10Z",
          "tree_id": "221702252abfdde0badc97c170d9bc82bd58acaf",
          "url": "https://github.com/rocicorp/replicache-internal/commit/402b4792f114682ca9abd79d51c227254dc80d85"
        },
        "date": 1651869126809,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2174c88630fbd7db8002f35a464fbcdbb544abe9",
          "message": "docs: add pointer to Docker install instructions (#104)",
          "timestamp": "2022-05-06T20:54:42Z",
          "tree_id": "a4d00fe4ad3fa87b38b4b16287e2a422d40fa5b1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2174c88630fbd7db8002f35a464fbcdbb544abe9"
        },
        "date": 1651870552387,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0943f4e38ada28e495f4b41ddd821af412caefc0",
          "message": "doc: how it works suggestions (#103)\n\n* doc: how it works suggestions\r\n\r\n* tiny fix\r\n\r\nCo-authored-by: Phritz <157153+phritz@users.noreply.github.com>",
          "timestamp": "2022-05-06T21:05:32Z",
          "tree_id": "649d78c6173769f93a8d294da84405fc47cdff6e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0943f4e38ada28e495f4b41ddd821af412caefc0"
        },
        "date": 1651871191371,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "1cd9363da88dcfe237e1b2cb2300a3c932829d5d",
          "message": "docs: update logo and favicon",
          "timestamp": "2022-05-06T14:01:03-10:00",
          "tree_id": "fd9fd15c63488f6f08810118cc5d4c51de4dde78",
          "url": "https://github.com/rocicorp/replicache-internal/commit/1cd9363da88dcfe237e1b2cb2300a3c932829d5d"
        },
        "date": 1651881715174,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e5261a27e07d6a9fb9e713f6d1fc72bacb062aba",
          "message": "docs: remove extraneous links from bottom of each page. (#37)",
          "timestamp": "2022-05-06T14:36:24-10:00",
          "tree_id": "8ff7248786bf8ead78810b13853051e99f1d3a62",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e5261a27e07d6a9fb9e713f6d1fc72bacb062aba"
        },
        "date": 1651883835763,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "f3f9f9e1417481484d93e4f5edbd2e191ecb7ea8",
          "message": "Update doc icon to not be crap.",
          "timestamp": "2022-05-06T14:49:36-10:00",
          "tree_id": "c0025b3895f60811da10f841887a5ea542efbecd",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f3f9f9e1417481484d93e4f5edbd2e191ecb7ea8"
        },
        "date": 1651884663178,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e70bef9a35343b4e285ce5134c12ba7892a4c620",
          "message": "Remove the old versioning system anymore. (#106)\n\nNot needed because we don't have to update the BSL files or anything.",
          "timestamp": "2022-05-06T15:08:38-10:00",
          "tree_id": "72826851250c62f5f0636de3551fabce3889e8f4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e70bef9a35343b4e285ce5134c12ba7892a4c620"
        },
        "date": 1651885786238,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167662,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166547,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76279,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22003,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "828bbe4897090642ff8aff29d59141797d5dddf0",
          "message": "Bump version to 10.0.0",
          "timestamp": "2022-05-06T15:10:38-10:00",
          "tree_id": "d0631517c8ccee0c316bbc30c973de18bd66e49b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/828bbe4897090642ff8aff29d59141797d5dddf0"
        },
        "date": 1651885933130,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0b397f6d8bc96cd9b40769da17d8c0183e499c08",
          "message": "Update get-started.md",
          "timestamp": "2022-05-07T07:32:38-10:00",
          "tree_id": "12ee33e208399223d7b6f85dcad4e3cc25079f75",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0b397f6d8bc96cd9b40769da17d8c0183e499c08"
        },
        "date": 1651944812488,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d4fecdf203dd5c3876d5cd2adeeda567fb4b8486",
          "message": "Update get-started.md",
          "timestamp": "2022-05-07T07:39:23-10:00",
          "tree_id": "483f5734264801688d968c0bcac635cc716130f5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d4fecdf203dd5c3876d5cd2adeeda567fb4b8486"
        },
        "date": 1651945220531,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a5da4e5e30756af67397e6a5ae49d8515c8aa1a",
          "message": "docs: Add movies for replidraw & repliear (#94)",
          "timestamp": "2022-05-09T09:32:39Z",
          "tree_id": "c800aa0d2321aa9b57784a3f3c5fdc3c833113d7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5a5da4e5e30756af67397e6a5ae49d8515c8aa1a"
        },
        "date": 1652088827582,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "79c1d9499e57e507f24c61c7f67b9cf78302a3c5",
          "message": "chore: Add something about API review to HACKING (#108)",
          "timestamp": "2022-05-09T11:52:24Z",
          "tree_id": "5d31febb2683bc02b0793da7ec22f7890bd5b6a5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/79c1d9499e57e507f24c61c7f67b9cf78302a3c5"
        },
        "date": 1652097208100,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "56bc22e4df0084542dd27be7dd2c78182493fa10",
          "message": "doc: Update replidraw movie (#111)",
          "timestamp": "2022-05-09T20:32:54Z",
          "tree_id": "be46a836f09ee3c3dcee022473eeb22943d5eaaa",
          "url": "https://github.com/rocicorp/replicache-internal/commit/56bc22e4df0084542dd27be7dd2c78182493fa10"
        },
        "date": 1652128445715,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5a342c5ace0e7986e24b9a3c49ff77cf4c7b1306",
          "message": "Update example-repliear.md",
          "timestamp": "2022-05-09T22:44:50-10:00",
          "tree_id": "e5b072447fe60e923312668af730556c990e7e23",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5a342c5ace0e7986e24b9a3c49ff77cf4c7b1306"
        },
        "date": 1652172351673,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c98efbf631acb020974d3e6e902efaacd10fd373",
          "message": "Update example-replidraw.md",
          "timestamp": "2022-05-09T22:46:00-10:00",
          "tree_id": "6e9d0dd24eb868838d5f5119fd85e49394681058",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c98efbf631acb020974d3e6e902efaacd10fd373"
        },
        "date": 1652172436452,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0a79b5fd014a38ee0ecca7fd6df7560bada3a1fc",
          "message": "Update sidebars.js",
          "timestamp": "2022-05-09T22:48:05-10:00",
          "tree_id": "54f464a32c5c10bc295164657c45fc4b4fe58430",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0a79b5fd014a38ee0ecca7fd6df7560bada3a1fc"
        },
        "date": 1652172560155,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3a2fcf2e345e7ba8f30d1da655a8e6724c92ec80",
          "message": "Update faq.md",
          "timestamp": "2022-05-09T22:56:01-10:00",
          "tree_id": "6f1a706bdc97284710c6706607fce750ae1e2247",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3a2fcf2e345e7ba8f30d1da655a8e6724c92ec80"
        },
        "date": 1652173037356,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "40423b7dc1ca296858e66af2d5adb72723115e4b",
          "message": "Update faq.md",
          "timestamp": "2022-05-09T22:59:42-10:00",
          "tree_id": "bdc5aad2a5567e88813caea0080d5c601606297e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/40423b7dc1ca296858e66af2d5adb72723115e4b"
        },
        "date": 1652173239936,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0aa7b0064a74068a97aa3dee075bb76f64a477c7",
          "message": "Update faq.md",
          "timestamp": "2022-05-09T23:02:50-10:00",
          "tree_id": "d8149da2199705cc4d3ba5f48df2e584b89f95d4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0aa7b0064a74068a97aa3dee075bb76f64a477c7"
        },
        "date": 1652173442458,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "46f91a582f7e8681d326c23c247e9e595ab1c654",
          "message": "Update example-replidraw.md\n\nFix typo",
          "timestamp": "2022-05-10T02:49:28-07:00",
          "tree_id": "b2d9a27684847f721588b9db075adc93de808643",
          "url": "https://github.com/rocicorp/replicache-internal/commit/46f91a582f7e8681d326c23c247e9e595ab1c654"
        },
        "date": 1652176257441,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "91f6b6b377f8584bab7c1e15c4df952408ffedc1",
          "message": "chore: npm run format (#115)",
          "timestamp": "2022-05-10T02:55:25-07:00",
          "tree_id": "470cdbec05cc1f676ae20f4c5a72c16323501cee",
          "url": "https://github.com/rocicorp/replicache-internal/commit/91f6b6b377f8584bab7c1e15c4df952408ffedc1"
        },
        "date": 1652176584670,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "67c93462ad124753369fca0540ee30676df118a1",
          "message": "doc: Update webp images for samples (#114)\n\nStill has some artefacts though :'(",
          "timestamp": "2022-05-10T09:58:52Z",
          "tree_id": "6dbc12730f74fcb4dc01548ba5babfbbae77eaeb",
          "url": "https://github.com/rocicorp/replicache-internal/commit/67c93462ad124753369fca0540ee30676df118a1"
        },
        "date": 1652176803943,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "972367ff3ac1f33c38061ffbb8cfa626fe5ab65c",
          "message": "docs: Add something about do not mutate (#110)\n\nAdds some more text to the jsdoc for get and scan that you must not\r\nmutate the return value.",
          "timestamp": "2022-05-10T10:02:04Z",
          "tree_id": "b7a53eceebfdeebe2efe0d3c18c2e56ad21901be",
          "url": "https://github.com/rocicorp/replicache-internal/commit/972367ff3ac1f33c38061ffbb8cfa626fe5ab65c"
        },
        "date": 1652176996554,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "204a7bf8b18c6e001060c6a7a7eb70cd5453c2a1",
          "message": "Add files via upload",
          "timestamp": "2022-05-10T04:51:25-10:00",
          "tree_id": "033f538635d40934840f68df381ab48d35510d41",
          "url": "https://github.com/rocicorp/replicache-internal/commit/204a7bf8b18c6e001060c6a7a7eb70cd5453c2a1"
        },
        "date": 1652194349116,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "88a3f07828286d89675823f472c492bb987136d1",
          "message": "Update replidraw image.",
          "timestamp": "2022-05-10T04:54:15-10:00",
          "tree_id": "d2a0513aa17a3eec2c22876692adb709c05fbaca",
          "url": "https://github.com/rocicorp/replicache-internal/commit/88a3f07828286d89675823f472c492bb987136d1"
        },
        "date": 1652194537972,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cba3b9c825e89aa453883b328e7385db34f8bd03",
          "message": "doc: \"add a feature\" section (#112)\n\ndoc: \"My First Replicache Feature\" section",
          "timestamp": "2022-05-10T08:41:36-07:00",
          "tree_id": "3c3809f66b58b43bd833b997842d5049c192b1d2",
          "url": "https://github.com/rocicorp/replicache-internal/commit/cba3b9c825e89aa453883b328e7385db34f8bd03"
        },
        "date": 1652197362003,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bf7c3b08249da1507274e0e444d1a67220c6ecbe",
          "message": "docs: typo and repliear example app url (#116)",
          "timestamp": "2022-05-10T17:52:17Z",
          "tree_id": "ebef5e887b8ae4bf371118830eaf68fc99bd1d96",
          "url": "https://github.com/rocicorp/replicache-internal/commit/bf7c3b08249da1507274e0e444d1a67220c6ecbe"
        },
        "date": 1652205196414,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "974ad5480a5494da2a851253a0cdcf52c72fc4d6",
          "message": "chore: Update docusaurus to latest beta (#117)",
          "timestamp": "2022-05-10T12:37:56-07:00",
          "tree_id": "445a6327965b03f3bfdbb81baf0a2d012d749579",
          "url": "https://github.com/rocicorp/replicache-internal/commit/974ad5480a5494da2a851253a0cdcf52c72fc4d6"
        },
        "date": 1652211549641,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5c655b1b2867245eff3a0cff27a520921c5eb56b",
          "message": "Update consistency.md",
          "timestamp": "2022-05-10T12:44:25-07:00",
          "tree_id": "e8363351e1b29a496fd06d86538f44349341f114",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5c655b1b2867245eff3a0cff27a520921c5eb56b"
        },
        "date": 1652211922283,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "8baa802bdde3410abfbd438d74ff7989c4474595",
          "message": "Slight sprucing to BYOB page to make more clear it is an advanced case",
          "timestamp": "2022-05-10T16:21:25-10:00",
          "tree_id": "a5cbce41f04b0a57c8740e55a3e0d0852910d131",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8baa802bdde3410abfbd438d74ff7989c4474595"
        },
        "date": 1652235993907,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "5cff01ee8507ce6ec893c22477c663f3bfd6a0cf",
          "message": "doc: fix the local mutations page in the byob guide.\n\nFallout from realtime storage changes.",
          "timestamp": "2022-05-10T17:13:59-10:00",
          "tree_id": "d0417cd761342d15c4251f113df9627731947ff5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5cff01ee8507ce6ec893c22477c663f3bfd6a0cf"
        },
        "date": 1652238901209,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "b6c91618b0a1267c5e3a7bfb3468e9e4c84fad7b",
          "message": "Align get-started with website instructions.",
          "timestamp": "2022-05-10T19:01:22-10:00",
          "tree_id": "b11b7401f14218aedafba920b056c2d0e5eef7b9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b6c91618b0a1267c5e3a7bfb3468e9e4c84fad7b"
        },
        "date": 1652245352428,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167655,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31366,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166540,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31028,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76272,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21996,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "da923d81f73b416119fa49fc155ee64aa6e8144b",
          "message": "fix: Add a lock around poke as well (#118)\n\nTurns out we get \"Wrong sync head\" errors with poke too.\r\n\r\nAdded test that failed and then fixed the code to make the test pass.\r\n\r\nFixes #109",
          "timestamp": "2022-05-12T13:39:36Z",
          "tree_id": "bc50a84599153cb2698b95aca3b6f2867b5a52fe",
          "url": "https://github.com/rocicorp/replicache-internal/commit/da923d81f73b416119fa49fc155ee64aa6e8144b"
        },
        "date": 1652362843222,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 167730,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31364,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 166615,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31044,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76307,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 21992,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7ffdf3f728c951f1a6305b4d253f5c1af3d2c45b",
          "message": "feat: Add index support to watch (#101)\n\nAdd support for passing in indexName as an option to watch.\r\n\r\nThese watcher uses the diff of the index to determine what changed and\r\nwhen to call these.",
          "timestamp": "2022-05-12T07:14:26-07:00",
          "tree_id": "8be488e6cbf7a5ef71ffd9dc476bfe5c308f43e8",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7ffdf3f728c951f1a6305b4d253f5c1af3d2c45b"
        },
        "date": 1652364938331,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 168351,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31503,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 167236,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31206,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 76523,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22060,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3f0853b171f9795369406e2cb49aaa78efc32548",
          "message": "feat: Use UTF8 compare for strings (#42)\n\nThis adds a function to compare two strings as if they were UTF8\r\nstrings. The result should be the same as if the strings encoded as UTF8\r\nand compared byte-wise.\r\n\r\nThen use this in the B+Tree and scan\r\n\r\nTowards #41",
          "timestamp": "2022-05-16T02:52:01-07:00",
          "tree_id": "d5efca2f7ebb87d94d5c4b46c5fe4ecae5eee20b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3f0853b171f9795369406e2cb49aaa78efc32548"
        },
        "date": 1652694783865,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 170440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31974,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 169306,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31664,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77373,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22394,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "33b84562d340d0774e74ae3848fbb1573c1ebff2",
          "message": "chore: Change binarySearch to use compare (#122)\n\nNow that we are using compareUTF8 it makes more sense for us to use\r\ncompare semantics for binary search.",
          "timestamp": "2022-05-16T10:08:19Z",
          "tree_id": "af09a25dd052907f7eb60b7ea9d80704a5417a0c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/33b84562d340d0774e74ae3848fbb1573c1ebff2"
        },
        "date": 1652695767670,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 170570,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31969,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 169436,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31666,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77416,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22381,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f60047d9492baf65a4126784bd5a7a151852d646",
          "message": "chore: Remove wasm references (#125)\n\nWe still uses wasm in the hash perf benchmarks",
          "timestamp": "2022-05-17T08:06:58Z",
          "tree_id": "18f09d1a1527aa8feed1074887d9717543040aee",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f60047d9492baf65a4126784bd5a7a151852d646"
        },
        "date": 1652774886513,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 170570,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 31969,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 169436,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31666,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77416,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22381,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "96ff0f5a4fab30417f4ce625ba90d4fcf919515e",
          "message": "refactor: Move mutation recovery to own file (#120)\n\nreplicache.ts was getting large...",
          "timestamp": "2022-05-17T08:24:01Z",
          "tree_id": "b8471caa96e7c8723464d76b8bbaece9ecd412b7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/96ff0f5a4fab30417f4ce625ba90d4fcf919515e"
        },
        "date": 1652775909446,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171676,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32232,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170542,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31928,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77713,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22580,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6d82afb47e6da3e6207a28259af9448895d0b533",
          "message": "fix: UTF8 compare had a logic error (#126)\n\nwhen determining the length of a code point represented by utf16",
          "timestamp": "2022-05-17T11:54:46Z",
          "tree_id": "5deb8edf01db38f71c143842aa779f30ba741e6f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6d82afb47e6da3e6207a28259af9448895d0b533"
        },
        "date": 1652788542352,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171654,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32224,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170520,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77704,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22546,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bd57dd7af12b5bfc2a34aa21dacea0cc1625ff7d",
          "message": "fix: timeout test license key after 5 minutes (#123)\n\n* set a timer to stop replicache if test key is used\r\n\r\n* remove helper fn and default licensing option for test\r\n\r\n* initialize timeout handle in ctor",
          "timestamp": "2022-05-17T09:36:21-07:00",
          "tree_id": "2a11efcbd38496b7e4e07431f3636aebd7c2c1c7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/bd57dd7af12b5bfc2a34aa21dacea0cc1625ff7d"
        },
        "date": 1652805452623,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171926,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170792,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31979,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77840,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22618,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0b1562797975df47f27b502ebbddf6dce4061797",
          "message": "chore: enforce leading underscore on private props (#128)",
          "timestamp": "2022-05-17T17:44:09Z",
          "tree_id": "bc703471698818bf292c3b155e40c81ee0431f30",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0b1562797975df47f27b502ebbddf6dce4061797"
        },
        "date": 1652809527873,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171926,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170792,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31979,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77840,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22618,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36b37da922bd37716f5c54e94d805005c3f05cd6",
          "message": "Make it more clear that user needs to install docker",
          "timestamp": "2022-05-17T14:46:20-10:00",
          "tree_id": "0a2fa9df85b93e5f63d3af3d763812547ec992e1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/36b37da922bd37716f5c54e94d805005c3f05cd6"
        },
        "date": 1652834837409,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171926,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170792,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31979,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77840,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22618,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "9015b1df643a86c675feb2f17eee2a94bfc1d1db",
          "message": "docs: prettier",
          "timestamp": "2022-05-17T14:53:15-10:00",
          "tree_id": "247961b4adec0334e4d6e0fe7a512dac012d047f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9015b1df643a86c675feb2f17eee2a94bfc1d1db"
        },
        "date": 1652835292113,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171926,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170792,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31979,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77840,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22618,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a6816652f56f2fccae247a0b0a9d3549e5ab1e74",
          "message": "fix: don't update refcounts when changing head to same hash (#127)",
          "timestamp": "2022-05-19T16:42:41Z",
          "tree_id": "675ffa2499286b4c000d5a7157cc82d648628937",
          "url": "https://github.com/rocicorp/replicache-internal/commit/a6816652f56f2fccae247a0b0a9d3549e5ab1e74"
        },
        "date": 1652978651517,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170849,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31981,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77857,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22639,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "b80ed2cb7916c96c0300edfd9bb3a1b4a99f11d7",
          "message": "switch to google tag manager",
          "timestamp": "2022-05-20T14:49:17-10:00",
          "tree_id": "4fecf7a66ee3093d42a1d5e7957375a2d7de1adf",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b80ed2cb7916c96c0300edfd9bb3a1b4a99f11d7"
        },
        "date": 1653094216356,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170849,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31981,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77857,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22639,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b90a1b49b071964c9917558d0c02ece0826deccb",
          "message": "chore: local debugging instructions (#131)\n\n* chore: option to create an unminified build, and local debugging instructions\r\n\r\n* doc tweak",
          "timestamp": "2022-05-23T15:13:37-07:00",
          "tree_id": "50601263f1c2199c188ae2922cc08b4b59d61956",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b90a1b49b071964c9917558d0c02ece0826deccb"
        },
        "date": 1653344072684,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170849,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31981,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77857,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22639,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "phritz@users.noreply.github.com",
            "name": "phritz",
            "username": "phritz"
          },
          "committer": {
            "email": "157153+phritz@users.noreply.github.com",
            "name": "Phritz",
            "username": "phritz"
          },
          "distinct": true,
          "id": "ee4bb31fb00dd5127eda9740cdda87ddd3d1f6c8",
          "message": "docs: manually inject gtag",
          "timestamp": "2022-05-26T14:23:37-10:00",
          "tree_id": "f24ff46ab4ef54f7dc2e6bc78901fc7339823e8b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ee4bb31fb00dd5127eda9740cdda87ddd3d1f6c8"
        },
        "date": 1653611077404,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 171983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32286,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 170849,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 31981,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 77857,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22639,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "557b759997d57d1dd94ed31bf0af234e4bda262a",
          "message": "feat: add `allowEmpty` option to CreateIndexDefinition (#133)\n\n* add `allowEmpty` to indexes\r\n* createIndex supports legacy indexes",
          "timestamp": "2022-05-27T09:33:05-07:00",
          "tree_id": "4f1d31c59a6811266e798129d2e138a8a4fe06d0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/557b759997d57d1dd94ed31bf0af234e4bda262a"
        },
        "date": 1653669243111,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172525,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32388,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171391,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32089,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78139,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22699,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "52f689ff55ad035d9c42127cf11f971b6bb62993",
          "message": "refactor: Introduce InternalValue (#136)\n\nInternalValue represents a readonly JSON value that we use internally in\r\nReplicache. It is an opaque type that is not exposed to the user.\r\nConceptually, all the API endpoints use `toInternalValue` and\r\n`fromInternalValue` which clones the json to ensure no mutations of\r\ninternal value can ever occur. However, for performance reasons we do\r\nnot always clone. In those cases we use `safeCastToJSON` which does no\r\ncopying.\r\n\r\nTo make sure we never copy a value twice, we keep track of the internal\r\nvalues in a `WeakSet`.\r\n\r\nTo make things clearer where these conversions are used, these methods\r\ntakes a \"reason\" enumeration.\r\n\r\nThere is also a config flag that disables the internal value assertions\r\nwhich also allows skipping creating the WeakSet.\r\n\r\nTowards #56",
          "timestamp": "2022-05-30T10:29:39Z",
          "tree_id": "25b39bd08142930e455eb0dc33f804edbc1f07db",
          "url": "https://github.com/rocicorp/replicache-internal/commit/52f689ff55ad035d9c42127cf11f971b6bb62993"
        },
        "date": 1653906656500,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32880,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32584,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79101,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22965,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "22f29fb177fb1d7bb1228e3aff913dbd038caa40",
          "message": "docs: Document key sort order (#138)",
          "timestamp": "2022-05-30T13:08:52Z",
          "tree_id": "95a3e808697689adc66764208e6c587399f0514f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/22f29fb177fb1d7bb1228e3aff913dbd038caa40"
        },
        "date": 1653916192527,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32880,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32584,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79101,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22965,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2c0f9ac229632601bd21e84a048698baa4a01c10",
          "message": "chore: Use compare-utf8 npm package (#137)",
          "timestamp": "2022-05-30T13:26:33Z",
          "tree_id": "f77128ae20e412995e7060547f8419b87b940844",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2c0f9ac229632601bd21e84a048698baa4a01c10"
        },
        "date": 1653917248997,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175402,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32899,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174287,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32598,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79083,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22958,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ce465d693b12e20e820a9bc548b31eab22f80683",
          "message": "refactor: Use a loop instead of recursion (#139)",
          "timestamp": "2022-05-30T13:51:25Z",
          "tree_id": "fea6bab9f9af5921bd6414d1496545dc825ebb14",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ce465d693b12e20e820a9bc548b31eab22f80683"
        },
        "date": 1653918745881,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32860,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32545,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79017,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22944,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa42cff3899fbde6bcc3faa61864ad398aa30d5b",
          "message": "chore: Update gh actions versions (#140)",
          "timestamp": "2022-05-31T01:38:18-07:00",
          "tree_id": "935c5a2b169e3f87b841b0247f21ec5407c59d98",
          "url": "https://github.com/rocicorp/replicache-internal/commit/fa42cff3899fbde6bcc3faa61864ad398aa30d5b"
        },
        "date": 1653986355705,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32860,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32545,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79017,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22944,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b84be81dee45c42f811cadc7a4f8e9a6245d8a03",
          "message": "docs: units and default for pullInterval (#141)",
          "timestamp": "2022-05-31T19:44:11Z",
          "tree_id": "c4ac86ff8d89b9cf314b3ccfc4913121d0d24aed",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b84be81dee45c42f811cadc7a4f8e9a6245d8a03"
        },
        "date": 1654026333563,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32860,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32545,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79017,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22944,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3a8c9fef1b87e492069705919da92e4f2cf514a6",
          "message": "Update HACKING.md",
          "timestamp": "2022-05-31T21:31:40-10:00",
          "tree_id": "baac4b72e25403f3f029c1be22688d53c413db0e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3a8c9fef1b87e492069705919da92e4f2cf514a6"
        },
        "date": 1654068757918,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32860,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32545,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79017,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22944,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b54c82d62c3a01d1bed7f0c5bb3de1a38329b211",
          "message": "Update HACKING.md",
          "timestamp": "2022-05-31T22:16:56-10:00",
          "tree_id": "b1ba67fa0c8ac76c5c571afc657e71f75431ebdb",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b54c82d62c3a01d1bed7f0c5bb3de1a38329b211"
        },
        "date": 1654071647729,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32860,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174146,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32545,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79017,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22944,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e3676d43549cf94baf7c3164e1e0c4477293a351",
          "message": "Revert \"refactor: Introduce InternalValue (#136)\" (#143)\n\nThis reverts commit 52f689ff55ad035d9c42127cf11f971b6bb62993.\r\n\r\nThere was a flaw in this design. The \"cast\" method returns\r\n`InternalValue`s so then the assert fails.\r\n\r\nThe right way is to always clone in debug mode.",
          "timestamp": "2022-06-01T19:14:42Z",
          "tree_id": "30c8587f37a589f365be1109b45d6d7b272cd40c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e3676d43549cf94baf7c3164e1e0c4477293a351"
        },
        "date": 1654110939730,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32336,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22673,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "75c6b35ccfd1d22ee75df81d4464d66aac11647d",
          "message": "docs: Follow-up (#144)\n\nFollow-up to #138",
          "timestamp": "2022-06-02T08:58:12Z",
          "tree_id": "29a8b6412372994d3882551c25b83e737b3d77b3",
          "url": "https://github.com/rocicorp/replicache-internal/commit/75c6b35ccfd1d22ee75df81d4464d66aac11647d"
        },
        "date": 1654160351236,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32336,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22673,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "14b64fc0f429adfd8f3b4d97c68dbd6d3907e0b1",
          "message": "doc: update get-started.md to reflect rails",
          "timestamp": "2022-06-02T00:55:54-10:00",
          "tree_id": "bf4342a5ca63640177da31ea55fb667700630fa7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/14b64fc0f429adfd8f3b4d97c68dbd6d3907e0b1"
        },
        "date": 1654167431891,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32336,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22673,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "ba14a38e6d956be4f69ae9d115704c8c7458d9f0",
          "message": "doc: update get-started.md to reflect rails",
          "timestamp": "2022-06-02T01:03:52-10:00",
          "tree_id": "d9660acb9269cd2d988184ffbe9ae159c8d2c0fe",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ba14a38e6d956be4f69ae9d115704c8c7458d9f0"
        },
        "date": 1654167895612,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32336,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22673,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "e5c7ec3cdc6476c1253fff4b4e1daf2c9f31dd11",
          "message": "Bump version to 11.0.0.",
          "timestamp": "2022-06-02T11:32:13-10:00",
          "tree_id": "65be6c90d581df6605530188515bfac678b78e45",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e5c7ec3cdc6476c1253fff4b4e1daf2c9f31dd11"
        },
        "date": 1654546516930,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "8a124ba2dd6a884b65161a37bc1a300826c1adf2",
          "message": "doc: update get-started to move to postgres/pusher from supabase",
          "timestamp": "2022-06-07T14:59:00-10:00",
          "tree_id": "1f6237f6b913a04d8541b45b4a21632e6c0183d3",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8a124ba2dd6a884b65161a37bc1a300826c1adf2"
        },
        "date": 1654650014432,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "b23dd59548eac60d0670bd2f9638d100f9dfde5b",
          "message": "doc: improve diff calculation docs",
          "timestamp": "2022-06-08T16:58:31-10:00",
          "tree_id": "e44ab9c711dd8e56e0607b0b9bc9c6510ca3cbb1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b23dd59548eac60d0670bd2f9638d100f9dfde5b"
        },
        "date": 1654743586993,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "283a6599d3d0bc77e771c31e4186e16cda2ed0ce",
          "message": "doc: typo",
          "timestamp": "2022-06-08T17:02:04-10:00",
          "tree_id": "7b6a798a053368d3e2ae5aa5b6d0fcb7f775d618",
          "url": "https://github.com/rocicorp/replicache-internal/commit/283a6599d3d0bc77e771c31e4186e16cda2ed0ce"
        },
        "date": 1654743794728,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "c55ebd99be4983e9d0dd162225b0f937cbc30540",
          "message": "doc: cleanup",
          "timestamp": "2022-06-08T17:09:17-10:00",
          "tree_id": "dd9d661f1efcb94311a81b2a5ed5821e636b447b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c55ebd99be4983e9d0dd162225b0f937cbc30540"
        },
        "date": 1654744221441,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "98b956bb40fa916f815e0288b2a1fb80497c03d9",
          "message": "doc: use a callout",
          "timestamp": "2022-06-08T17:14:04-10:00",
          "tree_id": "fe301a0eb3eabb3ec96870023799721b163a6b90",
          "url": "https://github.com/rocicorp/replicache-internal/commit/98b956bb40fa916f815e0288b2a1fb80497c03d9"
        },
        "date": 1654744509600,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "e318ea62324d0486ea11d630c51dcced18027c2a",
          "message": "doc: argh callout",
          "timestamp": "2022-06-08T17:18:13-10:00",
          "tree_id": "9a0a30b0ee2defcc308219f45abc4155aaad9735",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e318ea62324d0486ea11d630c51dcced18027c2a"
        },
        "date": 1654744763004,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "46c040aa943b96d21e5757e70a883810bcd6829f",
          "message": "doc: argh callout",
          "timestamp": "2022-06-08T17:21:20-10:00",
          "tree_id": "806bcbd43ab4cc6bb6210936608744eae3379734",
          "url": "https://github.com/rocicorp/replicache-internal/commit/46c040aa943b96d21e5757e70a883810bcd6829f"
        },
        "date": 1654744938290,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "f430e94b48ed2a695bd54e01130a8b1f9727d446",
          "message": "doc: more clarity",
          "timestamp": "2022-06-08T17:33:36-10:00",
          "tree_id": "38ede4fba37ab66a2e84ab407fcc86513f986bc7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f430e94b48ed2a695bd54e01130a8b1f9727d446"
        },
        "date": 1654745696367,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "634a50602235bfacd74d57ea16097330660d03d0",
          "message": "doc: never",
          "timestamp": "2022-06-08T21:39:30-10:00",
          "tree_id": "8387b073c37b6b5723429094007925185926985e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/634a50602235bfacd74d57ea16097330660d03d0"
        },
        "date": 1654760450039,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": false,
          "id": "d7b68958c4fb39631a2bbc8e15d8a522a3db4dd3",
          "message": "doc: Respond to some setup feedback.",
          "timestamp": "2022-06-09T15:55:31-10:00",
          "tree_id": "9c72303291320e6649100fda6eaedf0506e6ccf7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d7b68958c4fb39631a2bbc8e15d8a522a3db4dd3"
        },
        "date": 1654826321042,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 172369,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32341,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 171254,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32027,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78055,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fed8365052f79680d5f3ae5eaaddc90a20366086",
          "message": "Arv/internal value take 3 (#145)\n\n* Revert \"Revert \"refactor: Introduce InternalValue (#136)\" (#143)\"\r\n\r\nThis reverts commit e3676d43549cf94baf7c3164e1e0c4477293a351.\r\n\r\n* refactor: Use InternalValue\r\n\r\nTwo fixes over the revert:\r\n1. When reading a chunk out of the dag store the values are marked as\r\n   internal.\r\n2. ReadTransaction get/scan also get a deep clone in debug mode.",
          "timestamp": "2022-06-10T08:06:59-07:00",
          "tree_id": "533e8cdebf8f4bbf0cae8b7c171cf3a4de45e87e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/fed8365052f79680d5f3ae5eaaddc90a20366086"
        },
        "date": 1654873678223,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175724,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32919,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174609,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32617,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79122,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22955,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4276f32d00f81d78c0a580c83a473040e01c2f1a",
          "message": "chore: Require Node 14.8+ due to cli (#151)\n\nThe cli use `node:http` which requires NodeJS version 14.8 or newer.",
          "timestamp": "2022-06-13T10:42:44Z",
          "tree_id": "526104abceff564f84d86f25f7667fa3947fede6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4276f32d00f81d78c0a580c83a473040e01c2f1a"
        },
        "date": 1655117035521,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 175724,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32919,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 174609,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32617,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79122,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22955,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesara@gmail.com",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ca12caa1af9beb24965fb50b8bee4d83de715d80",
          "message": "feat: experimental pending mutations (#146)\n\n* feat: experimental pending mutations\r\n\r\n* fix: fix test to work correctly\r\n\r\n* fix: pr requested changes\r\n\r\n* fix: update map call\r\n\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>\r\n\r\n* chore: fix merge from main\r\n\r\n* chore: clean up documentation\r\n\r\nCo-authored-by: Erik Arvidsson <erik.arvidsson@gmail.com>",
          "timestamp": "2022-06-13T10:10:48-07:00",
          "tree_id": "b9622cf0c56c50969f7f94c534106836e8eca950",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ca12caa1af9beb24965fb50b8bee4d83de715d80"
        },
        "date": 1655140318590,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176236,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175121,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32679,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79371,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23006,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3362a0e981ef48d752d3099c6216c72e49e202f7",
          "message": "doc: Make guide point to heroku version of replidraw (#152)",
          "timestamp": "2022-06-14T08:06:55-07:00",
          "tree_id": "408eabd1a73b13cad431b2137ada395c7a0ca2d6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3362a0e981ef48d752d3099c6216c72e49e202f7"
        },
        "date": 1655219287486,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176236,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175121,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32679,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79371,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23006,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9e960b99dd46ca6dce487c14b34d90a857bf740c",
          "message": "refactor: Simplify index withMap (#153)\n\n`createBTree` is sync so no need to put it in a `withWrite`.",
          "timestamp": "2022-06-15T13:04:51-07:00",
          "tree_id": "83e3e261ed545e4c5c37821cd59ce4a584bc5fd2",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9e960b99dd46ca6dce487c14b34d90a857bf740c"
        },
        "date": 1655323555643,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176174,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 32993,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32674,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79340,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23028,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "74f0db6537efc91d8579e8f81e7a87ec3caabfa6",
          "message": "chore: Add asserts for nested withMap (#154)",
          "timestamp": "2022-06-15T20:18:11Z",
          "tree_id": "bb4b821a30fc5f7437d3e6be9fba77a61e0c1577",
          "url": "https://github.com/rocicorp/replicache-internal/commit/74f0db6537efc91d8579e8f81e7a87ec3caabfa6"
        },
        "date": 1655324358474,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176251,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175136,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32708,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "89d43f429a4fba16ce63915aea266f605bbaeb47",
          "message": "doc: Add missing id field in get-started doc.\n\nAlso use patch format for some code samples so easier to see what's changing.",
          "timestamp": "2022-06-15T15:05:04-10:00",
          "tree_id": "fa6dc48ecab2c9bdd26b82981fa373aa407efe01",
          "url": "https://github.com/rocicorp/replicache-internal/commit/89d43f429a4fba16ce63915aea266f605bbaeb47"
        },
        "date": 1655341591272,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176251,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175136,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32708,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "b9cd1144b183cd1f0523318124415b05e19726a4",
          "message": "doc: Add missing id field in get-started doc.\n\nAlso use patch format for some code samples so easier to see what's changing.",
          "timestamp": "2022-06-15T15:11:00-10:00",
          "tree_id": "6456b1fe2d96f5ba2b9130ed9da5c91f1cb1b207",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b9cd1144b183cd1f0523318124415b05e19726a4"
        },
        "date": 1655341928921,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176251,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175136,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32708,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "77278d2559a7568cf9e9266be65d1d3fba71fe78",
          "message": "doc: Add missing id field in get-started doc.\n\nAlso use patch format for some code samples so easier to see what's changing.",
          "timestamp": "2022-06-15T15:29:13-10:00",
          "tree_id": "172591eafe3e1abb16f255e63569e5f1e405bc4d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/77278d2559a7568cf9e9266be65d1d3fba71fe78"
        },
        "date": 1655343019601,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176251,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175136,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32708,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "9e00d895d08d9c5d6234222ef2e1df99d5c714fb",
          "message": "doc: Add missing id field in get-started doc.\n\nAlso use patch format for some code samples so easier to see what's changing.",
          "timestamp": "2022-06-15T15:32:27-10:00",
          "tree_id": "059b03ad039151f94386c47dd2bfbac849526b54",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9e00d895d08d9c5d6234222ef2e1df99d5c714fb"
        },
        "date": 1655343208467,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176251,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175136,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32708,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "c5610b80315cfa119c021f9a3853522669b9376c",
          "message": "doc: Add missing id field in get-started doc.\n\nAlso use patch format for some code samples so easier to see what's changing.",
          "timestamp": "2022-06-15T15:38:59-10:00",
          "tree_id": "c68d54013314bdeaba6f9a8462860d321f24d7f6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c5610b80315cfa119c021f9a3853522669b9376c"
        },
        "date": 1655343608641,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 176251,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33047,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 175136,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32708,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7d89459a34506f973d6d36d43611ee1071eec091",
          "message": "chore: Fix debug mangle props (#155)\n\nWhen we build as debug we do not want to mangle props.",
          "timestamp": "2022-06-16T01:40:34-07:00",
          "tree_id": "d9aedc29acc1e53191d79272af160108f6e80fad",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7d89459a34506f973d6d36d43611ee1071eec091"
        },
        "date": 1655368904232,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184613,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33494,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 183498,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33180,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79362,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22998,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be8aea8c412c26234bc69678b46d1ac485acdcbb",
          "message": "fix: No need to have a RWLock on the index map (#156)\n\nThere is already locking with Transactions",
          "timestamp": "2022-06-16T06:25:51-07:00",
          "tree_id": "f8b5ab5030688d8916b2dcaed0553345b4a54320",
          "url": "https://github.com/rocicorp/replicache-internal/commit/be8aea8c412c26234bc69678b46d1ac485acdcbb"
        },
        "date": 1655386017489,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183478,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33322,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182363,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33007,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78841,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22896,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "2a4c901c19c9aa1feca0e34869e0b678e76317c9",
          "message": "chore: Remove useless await\n\nFollow up to be8aea8c412c26234bc69678b46d1ac485acdcbb",
          "timestamp": "2022-06-16T17:04:27+02:00",
          "tree_id": "e5da35b0de2595b9cef6e835b238019456944b86",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2a4c901c19c9aa1feca0e34869e0b678e76317c9"
        },
        "date": 1655391995337,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183472,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33322,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182357,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33025,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78835,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22891,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7345885336b73eb29a39df7193d5ce685848fd39",
          "message": "fix: Do not mark values as internal in release mode (#160)\n\nThis was causing a performance regression in writeSubRead",
          "timestamp": "2022-06-17T03:21:43-07:00",
          "tree_id": "ee81d6e771dbfc912704227b897fc5bbb4dd4eb7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7345885336b73eb29a39df7193d5ce685848fd39"
        },
        "date": 1655461361040,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183666,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78870,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22928,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c41252b601c62a12b06f5c93524f680103e8d0ae",
          "message": "chore: Make BTree immutable (#159)\n\nWe used to mutate new btree nodes during a transaction. Now we create\r\nnew nodes if a node is mutated.\r\n\r\nThere is still one mutation and that is to update the hash when we\r\nfinally flush the new nodes in flush.",
          "timestamp": "2022-06-17T10:58:27Z",
          "tree_id": "d4715102767670be354326a9dc63d825b20c9503",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c41252b601c62a12b06f5c93524f680103e8d0ae"
        },
        "date": 1655463564006,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183061,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33302,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 181946,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 32993,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78552,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22860,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "59e6ae988b4c5374b2929e08f30d2ebaa62e5872",
          "message": "Revert \"chore: Make BTree immutable (#159)\"\n\nThis reverts commit c41252b601c62a12b06f5c93524f680103e8d0ae.\n\nReason for revert: Performance regression",
          "timestamp": "2022-06-17T13:27:25+02:00",
          "tree_id": "ee81d6e771dbfc912704227b897fc5bbb4dd4eb7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/59e6ae988b4c5374b2929e08f30d2ebaa62e5872"
        },
        "date": 1655465338841,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183666,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33355,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182551,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33045,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78870,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22928,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7c0430519f9e71f65d274b86ac5a49682386efe3",
          "message": "fix: Allow scan to contain puts (#158)\n\nWe remove the read lock on BTreeWrite.\r\n\r\nThis means that it is possible for the tree to change during one of the\r\nread operations. If that happens then we start over from the new root.\r\nFor scan it means that we create a new scan from the root given the\r\nkey we are currently at.\r\n\r\nFixes #157",
          "timestamp": "2022-06-17T05:14:33-07:00",
          "tree_id": "1ac11d151416003eb6545d19ef19fbc28ac25c43",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7c0430519f9e71f65d274b86ac5a49682386efe3"
        },
        "date": 1655468130550,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ef4f470d4cf9841ef59ca5ae5cdc4186d9c9ced5",
          "message": "chore: Split perf json output (#161)\n\nThis splits the perf json output into two different json files. One for\r\np95 and one for the median.",
          "timestamp": "2022-06-17T05:46:34-07:00",
          "tree_id": "b47efd7170cb2debc3ad65c0d1d97f3a2e5f0880",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ef4f470d4cf9841ef59ca5ae5cdc4186d9c9ced5"
        },
        "date": 1655470065176,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "515a6e99dd4d1b0cee72852ff074b7495c468063",
          "message": "chore: Split perf output",
          "timestamp": "2022-06-17T14:54:53+02:00",
          "tree_id": "46e0ffb322863224a6b40986dace3b0067de8585",
          "url": "https://github.com/rocicorp/replicache-internal/commit/515a6e99dd4d1b0cee72852ff074b7495c468063"
        },
        "date": 1655470569472,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "70bf8f2ec9bd0cdf02dfb575b9057d077c3ea3ea",
          "message": "Moar yml",
          "timestamp": "2022-06-17T15:02:15+02:00",
          "tree_id": "1114ba907bec9c5f614faf7e0fb2f0d38c03550c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/70bf8f2ec9bd0cdf02dfb575b9057d077c3ea3ea"
        },
        "date": 1655471047980,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "4e48c45008c49d5c8d1c16277aea35b225862405",
          "message": "yml!!!",
          "timestamp": "2022-06-17T16:42:11+02:00",
          "tree_id": "7ace42d1a7d7c6b75f13754d8cd4200499e00e3d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4e48c45008c49d5c8d1c16277aea35b225862405"
        },
        "date": 1655477000034,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "91da6166062f6d4e00ee71cb76303517d7a37018",
          "message": "I can never learn the yml format for GH Actions",
          "timestamp": "2022-06-17T16:44:36+02:00",
          "tree_id": "085c2ba6561315d9be0aabdc0967fa39135895f5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/91da6166062f6d4e00ee71cb76303517d7a37018"
        },
        "date": 1655477171318,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6e907b48c3b2fe9ebb817c0d9fbe8ea8cc312a40",
          "message": "doc: Document ClientStateNotFound response to pull. (#163)\n\nFixes #147",
          "timestamp": "2022-06-20T10:30:11-10:00",
          "tree_id": "1434a5b34dd16fa19996a63d6e87de64795e25da",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6e907b48c3b2fe9ebb817c0d9fbe8ea8cc312a40"
        },
        "date": 1655757071337,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "63b2984cad858cc7392090c0407a0e34fb4d0e9b",
          "message": "doc: spruce the ClientStateNotFound docs (#164)",
          "timestamp": "2022-06-20T10:45:09-10:00",
          "tree_id": "341e4e92268b84c60df03e430fe84a8f87de6e95",
          "url": "https://github.com/rocicorp/replicache-internal/commit/63b2984cad858cc7392090c0407a0e34fb4d0e9b"
        },
        "date": 1655757966225,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "fdb999ec43cd0362b8d09cf8613ef07591ec0f03",
          "message": "Update package-lock.json",
          "timestamp": "2022-06-21T13:16:21+02:00",
          "tree_id": "54fb1355023d3025d0bffe42abc1479f096bb1e5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/fdb999ec43cd0362b8d09cf8613ef07591ec0f03"
        },
        "date": 1655810258441,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3ba9b3536fd1c998aad7388b0cd9dee251c448e0",
          "message": "chore: Add DD31 compile time flag (#166)\n\nThis adds a global flag called `DD31` which gets stripped when building\r\nthe npm package.\r\n\r\nThe tests can now also be run as:\r\n\r\n```\r\nDD31=true npm run test\r\n```\r\n\r\nto enable the flag in the tests.",
          "timestamp": "2022-06-21T04:20:52-07:00",
          "tree_id": "ad380a3caa0a09d9105a2403e356128d041d9657",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3ba9b3536fd1c998aad7388b0cd9dee251c448e0"
        },
        "date": 1655810512076,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "54e6b658286647bdb47e2e95de3143390a38e7a3",
          "message": "doc: Update get-started to reflect pg-mem changes. (#167)\n\nAlso break Getting Started down into multiple steps to make room\r\nfor local postgres setup and production.",
          "timestamp": "2022-06-22T01:53:53-10:00",
          "tree_id": "7a5b4a29ab6cc569d51d57cf1019d9f7f5bd82d7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/54e6b658286647bdb47e2e95de3143390a38e7a3"
        },
        "date": 1655898909669,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "4fc2b1e718b05754c959386dfba5543c12c6b004",
          "message": "doc: create \"Next Steps\" folder.",
          "timestamp": "2022-06-22T02:10:56-10:00",
          "tree_id": "3e8ce2f89e8e2cdef5b05a6b2b983f8dc9b65784",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4fc2b1e718b05754c959386dfba5543c12c6b004"
        },
        "date": 1655899983138,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d8a3199540d3a686e1b96080d2b8aaccc68c5b9f",
          "message": "doc: Update getting started to not require pusher. (#168)\n\nThe starter app now uses SSE.",
          "timestamp": "2022-06-22T12:00:32-10:00",
          "tree_id": "33efb289afe623eb0b43441a6ddda09febacc712",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d8a3199540d3a686e1b96080d2b8aaccc68c5b9f"
        },
        "date": 1655935290291,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "e179f69f1c77b91a6441ff2593c9e5a0cb87e8df",
          "message": "No longer powered by Pusher",
          "timestamp": "2022-06-22T12:32:37-10:00",
          "tree_id": "03f0b80c6a78ba033a6d0f19d0eefc095398f72e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e179f69f1c77b91a6441ff2593c9e5a0cb87e8df"
        },
        "date": 1655937223007,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "8884c28ec340706062898540cd21c5fce83ab147",
          "message": "doc: improve quickstart/deploy",
          "timestamp": "2022-06-22T19:14:26-10:00",
          "tree_id": "c07657481b14a3fc90aa1c84ccc7dbbbd51d1066",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8884c28ec340706062898540cd21c5fce83ab147"
        },
        "date": 1655961354244,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "35cc57968e301a741a578a34b0b41e5fab6258c4",
          "message": "doc: Fix broken link to pricing.",
          "timestamp": "2022-06-22T19:16:32-10:00",
          "tree_id": "f945eaf7f0f22d7467d0c784b18a3bd9d3eb77f9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/35cc57968e301a741a578a34b0b41e5fab6258c4"
        },
        "date": 1655961456365,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "ac21c9e391e51071378cb4d8247ec710376bcc96",
          "message": "doc: remove extraneous sentence from deploy doc.",
          "timestamp": "2022-06-22T19:18:35-10:00",
          "tree_id": "9d844d2756cf4c64b1f7214c29c334121e7ee888",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ac21c9e391e51071378cb4d8247ec710376bcc96"
        },
        "date": 1655961594672,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "35cc57968e301a741a578a34b0b41e5fab6258c4",
          "message": "doc: Fix broken link to pricing.",
          "timestamp": "2022-06-22T19:16:32-10:00",
          "tree_id": "f945eaf7f0f22d7467d0c784b18a3bd9d3eb77f9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/35cc57968e301a741a578a34b0b41e5fab6258c4"
        },
        "date": 1655961670793,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "96bd72cdfb29514920eb341b70c51844d5038f48",
          "message": "chore: environment.d.ts for perf type checking too (#170)\n\nWe need to also include the environment.d.ts when checking the types in\r\nperf/",
          "timestamp": "2022-06-23T11:17:31Z",
          "tree_id": "d2437952fcee79466107709a32038f7681fe50aa",
          "url": "https://github.com/rocicorp/replicache-internal/commit/96bd72cdfb29514920eb341b70c51844d5038f48"
        },
        "date": 1655983124240,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 183572,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 182457,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33035,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22904,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d16a3280e8df8e41b5b637ef99cf8a35dd14bd02",
          "message": "chore(DD31): Add clientID to LocalMeta (#169)\n\nWhen DD31 is true we use LocalMetaDD31 which also has a required\r\nclientID field. This requires passing trhough clientID in a few places.\r\n\r\nTowards #165",
          "timestamp": "2022-06-23T11:25:56Z",
          "tree_id": "d0cd043f8e58e0d6649d25e2fabc7b44dd65cf32",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d16a3280e8df8e41b5b637ef99cf8a35dd14bd02"
        },
        "date": 1655983617567,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33458,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 183442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78751,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22958,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "040fae38a4e48b3e60e5ef3658dfa8c96daa321e",
          "message": "refactor: Move initDB to test-helpers (#171)\n\nIt was only used in tests",
          "timestamp": "2022-06-23T11:30:12Z",
          "tree_id": "e32e2f56ffcfa8a4240bfc337e3a666853e217e8",
          "url": "https://github.com/rocicorp/replicache-internal/commit/040fae38a4e48b3e60e5ef3658dfa8c96daa321e"
        },
        "date": 1655983871856,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 184557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33458,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 183442,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78751,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22932,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c16aeceddfd31e2c245be56e24d1c284427feb93",
          "message": "feat(DD31): lastMutationIDs on Snapshots (#172)\n\nThis changes the snapshot commit to have a `Record<ClientID, number>`\r\ninstead of just a number.\r\n\r\nTowards #165",
          "timestamp": "2022-06-24T02:49:47-07:00",
          "tree_id": "fdcf9299bcb0cc378c7e0a482bc6af07d6f17d48",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c16aeceddfd31e2c245be56e24d1c284427feb93"
        },
        "date": 1656064243627,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187836,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33808,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186721,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33501,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23008,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4838ff1b5486c51c262be8aa10c6c7e8ba8bb3c3",
          "message": "chore: Ignore .vscode/launch.json (#173)",
          "timestamp": "2022-06-24T03:10:53-07:00",
          "tree_id": "85184d913d49c5aec68d3a4d1741d463f200de5e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4838ff1b5486c51c262be8aa10c6c7e8ba8bb3c3"
        },
        "date": 1656065530092,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187836,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33808,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186721,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33501,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23008,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "3eeb2041007c9159bd553ece3e91ac617c2df6d1",
          "message": "chore: Actually remove .vscode/launch.json",
          "timestamp": "2022-06-24T12:11:35+02:00",
          "tree_id": "ce122d953fe9a06ab0b41ad3f584b60a16b7f567",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3eeb2041007c9159bd553ece3e91ac617c2df6d1"
        },
        "date": 1656065594306,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187836,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33808,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186721,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33501,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79440,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23008,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9507162cfdbf8aa2a01e0727c6b4b2994de6e246",
          "message": "refactor: Remove static methods (#174)\n\nStatic methods are hard for esbuild to remove",
          "timestamp": "2022-06-24T10:15:42Z",
          "tree_id": "ded3c3edce10acaa22eeb3c8bad8721b62f2db42",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9507162cfdbf8aa2a01e0727c6b4b2994de6e246"
        },
        "date": 1656065802254,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187465,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186350,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33469,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79248,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23038,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5fe53327f02eba4f056b02a7c6461990e8f5c93a",
          "message": "refactor: No need to duplicate meta types in Write (#175)\n\nWe had the meta enums and type structures duplicated in commit.ts and\r\nwrite.ts. Now only use the one from commit.ts",
          "timestamp": "2022-06-24T04:46:29-07:00",
          "tree_id": "2a1c5ce382e8823172d7df3ca6272d83cac11e0b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5fe53327f02eba4f056b02a7c6461990e8f5c93a"
        },
        "date": 1656071250904,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187741,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33833,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186626,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33514,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79342,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23042,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4d2a23ce6c25fd60d0c7e31789bf63131dbcb389",
          "message": "refactor: Make basisHash required (#176)\n\nbasisHash is only optional (null) for snapshot commits",
          "timestamp": "2022-06-24T11:57:57Z",
          "tree_id": "de35f3fbe5f86dec6320cd3ae8426095aeac9792",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4d2a23ce6c25fd60d0c7e31789bf63131dbcb389"
        },
        "date": 1656071937606,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187728,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33803,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186613,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33488,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79346,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23039,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8dc6d3cb8289b0e2c1299636c74b0bcab989c1e7",
          "message": "chore(DD31): Run unit tests with DD31 as well (#178)",
          "timestamp": "2022-06-24T12:35:53Z",
          "tree_id": "6dba97ed1bafd9cc5285f3ea1bd63d6b7bf225a5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8dc6d3cb8289b0e2c1299636c74b0bcab989c1e7"
        },
        "date": 1656074211606,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187728,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33803,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186613,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33488,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79346,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23039,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "64bfc27dbabedff31a6b8e977360850b5d720088",
          "message": "feat(DD31): mutation ID read through (#177)\n\nWhen reading the mutation ID we might need to read through to a previous\r\ncommit to find the right mutation ID for this clientID.\r\n\r\nTowards #165",
          "timestamp": "2022-06-24T05:50:30-07:00",
          "tree_id": "ca5ac6e0900c5d721d46f7dec7b3d5aa4f3f97b0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/64bfc27dbabedff31a6b8e977360850b5d720088"
        },
        "date": 1656075109964,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "39260f09cc0e52b040713c99c839f12c3b020ff8",
          "message": "Update offline doc to mention that we are working on improvements. (#179)",
          "timestamp": "2022-06-26T14:19:26-10:00",
          "tree_id": "67a07b34b2ed7699a0eb2fbb3c878c6a4e878d54",
          "url": "https://github.com/rocicorp/replicache-internal/commit/39260f09cc0e52b040713c99c839f12c3b020ff8"
        },
        "date": 1656289224900,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "81c0f2f7b91f025c2dbe3872438bb9964920c098",
          "message": "doc: Update offline doc to mention that we are working on improvements. (#179)",
          "timestamp": "2022-06-26T14:19:49-10:00",
          "tree_id": "67a07b34b2ed7699a0eb2fbb3c878c6a4e878d54",
          "url": "https://github.com/rocicorp/replicache-internal/commit/81c0f2f7b91f025c2dbe3872438bb9964920c098"
        },
        "date": 1656289272667,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6db8342f4f8264401f9f1ecde1279d42c4b4e833",
          "message": "chore: Code review followups (#183)\n\nCloses #180\r\nCloses #181",
          "timestamp": "2022-06-28T09:55:38Z",
          "tree_id": "1e210e0563992ffe7798525eb399cf2acbf5903f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6db8342f4f8264401f9f1ecde1279d42c4b4e833"
        },
        "date": 1656410197024,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "140fa9edaa1a48162aeada6b4849721c62bcce07",
          "message": "Update deploy docs to show how to deploy to Vercel/Supabase. (#182)",
          "timestamp": "2022-06-28T15:33:46-10:00",
          "tree_id": "a0c64fe107746cdc35defdb0f37eb8ddec5af62e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/140fa9edaa1a48162aeada6b4849721c62bcce07"
        },
        "date": 1656466487350,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6db8342f4f8264401f9f1ecde1279d42c4b4e833",
          "message": "chore: Code review followups (#183)\n\nCloses #180\r\nCloses #181",
          "timestamp": "2022-06-28T09:55:38Z",
          "tree_id": "1e210e0563992ffe7798525eb399cf2acbf5903f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6db8342f4f8264401f9f1ecde1279d42c4b4e833"
        },
        "date": 1656491678837,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ca81d5610e81f79ea238f7db3e39a7bcbe9ed293",
          "message": "Update deploy docs to show how to deploy to Vercel/Supabase. (#184)",
          "timestamp": "2022-06-28T23:11:23-10:00",
          "tree_id": "c98e14e5a33607098e59d5178c09bb8aaeb61771",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ca81d5610e81f79ea238f7db3e39a7bcbe9ed293"
        },
        "date": 1656493948859,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "363ff370debee1a7f7a192cfc8ab0b4929a6f773",
          "message": "Minor cleanup to deploy docs. (#185)",
          "timestamp": "2022-06-28T23:48:46-10:00",
          "tree_id": "ca738cdc61150877a70933ca94b43be2abdddb0e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/363ff370debee1a7f7a192cfc8ab0b4929a6f773"
        },
        "date": 1656496189962,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6d9ebe82a6eae7da50c4bf2301d9ef8ada25e707",
          "message": "Deploy docs3 (#186)\n\n* Split deploy page into a few different pages\r\n\r\n* Split out \"app features\" page.",
          "timestamp": "2022-06-29T00:24:49-10:00",
          "tree_id": "84d7bcaac345c6510654a906244038a72d36e775",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6d9ebe82a6eae7da50c4bf2301d9ef8ada25e707"
        },
        "date": 1656498349631,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1dfd8a4bbac78b08959eac2d5b7ba68a68db4c85",
          "message": "doc: minor sprucing (#187)",
          "timestamp": "2022-06-29T00:26:24-10:00",
          "tree_id": "456fe8db6c1620ece61382c4d2d572e5f4d69a6a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/1dfd8a4bbac78b08959eac2d5b7ba68a68db4c85"
        },
        "date": 1656498442645,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "756c4b087542dd017947ae09370b76b5d2c0fcec",
          "message": "Update command to match the one on the homepage.",
          "timestamp": "2022-07-06T20:38:39-10:00",
          "tree_id": "5f8ff6e085a48b913c7b5276e7366c454aa6273d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/756c4b087542dd017947ae09370b76b5d2c0fcec"
        },
        "date": 1657175988744,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f0ce951a961dd4b6edac131a2a914d93f505cec0",
          "message": "Convert all the movies to mp4 containers. The m4v movies only (#190)\n\nplayed once on Chrome and weren't seekable. Not sure why.",
          "timestamp": "2022-07-07T23:21:36-10:00",
          "tree_id": "494bbeae6a232e04a6534fc62bcdb3fc621e29cb",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f0ce951a961dd4b6edac131a2a914d93f505cec0"
        },
        "date": 1657272162960,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "9f38c9d0fc0a9694962a128822291a0b561a2bab",
          "message": "doc: fix some bad links after video rename in previous commit",
          "timestamp": "2022-07-07T23:26:59-10:00",
          "tree_id": "31e0b1759709a4aa02a51472449756482f03f19b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9f38c9d0fc0a9694962a128822291a0b561a2bab"
        },
        "date": 1657272537943,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188303,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33867,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23068,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "cddb62bc8897468e0dc07f1720d458143231908f",
          "message": "fix: IDBDatabasesStore test isolation. (#191)\n\nProblem\r\n=======\r\nWe occasionally see the following error in tests\r\n```\r\n      An error was thrown in a Promise outside a test. Did you forget to await a function or assertion?\r\n      InvalidStateError: Failed to execute 'transaction' on 'IDBDatabase': The database connection is closing.\r\n        at readImpl (src/kv/idb-store.ts:158:16)\r\n        at IDBStore.withRead (src/kv/idb-store.ts:35:17)\r\n```\r\nSolution\r\n======\r\nThis is because of a bug in the test isolation logic for IDBDatabasesStore.  We were not actually\r\nnamespacing the IDBDatbasesStore's IndexedDB in tests.   \r\n\r\nDue to this the collect-idb-databases.test.ts, was deleting IndexedDB databases being used by \r\nother tests at the same time (due to parallel test execution).   \r\n\r\nFix the logic so we actually namespace the IDBDatbasesStore's IndexedDB in tests.",
          "timestamp": "2022-07-08T14:39:47-07:00",
          "tree_id": "785d17e017fb2746e8aa3861fcf3658711ead340",
          "url": "https://github.com/rocicorp/replicache-internal/commit/cddb62bc8897468e0dc07f1720d458143231908f"
        },
        "date": 1657316450966,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33871,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79446,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23086,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "273bee0bdc9d0fd3744b872211a0b36372174cc6",
          "message": "fix: update test to close idb stores before trying to delete the dbs. (#192)\n\nThe test updated here currently work because in src/kv/idb-store.ts we currently close idb databases when we get a onversionchange event indicating someone is trying to delete the idb database.  \r\n\r\n```\r\nfunction openDatabase(name: string): Promise<IDBDatabase> {\r\n  const req = indexedDB.open(name);\r\n  req.onupgradeneeded = () => {\r\n    const db = req.result;\r\n    db.createObjectStore(OBJECT_STORE);\r\n  };\r\n  const wrapped = wrap(req);\r\n  void wrapped.then(db => {\r\n    // *** this is the relevant auto close when someone tries to delete code ***\r\n    db.onversionchange = () => db.close();\r\n  });\r\n  return wrapped;\r\n}\r\n```\r\nOtherwise they would hang (because we would be awaiting a delete that would never complete). \r\n\r\nI don't want these test to rely on the auto-closing behavior, because it seems like something we may want to change \r\nin the future.\r\n\r\nUpdated the structure of the test to instead close the idb stores before try to delete the dbs.",
          "timestamp": "2022-07-11T14:35:03-07:00",
          "tree_id": "48acf6eabf2ea71fe19dc9ca7d1acf0c92387efd",
          "url": "https://github.com/rocicorp/replicache-internal/commit/273bee0bdc9d0fd3744b872211a0b36372174cc6"
        },
        "date": 1657575379768,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33871,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79446,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23086,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesara@gmail.com",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4529f871a5cea4bc5cfc4c77be73d967c8ccd9b6",
          "message": "doc: undo (#193)\n\n* doc: undo hoto\r\n\r\n* doc: formatting\r\n\r\n* doc: Update doc/docs/howto-undo.md\r\n\r\nCo-authored-by: Aaron Boodman <aaron@aaronboodman.com>",
          "timestamp": "2022-07-12T13:40:26-07:00",
          "tree_id": "b9020fbeb5a69db1c212675cb5fdb8671caa77a2",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4529f871a5cea4bc5cfc4c77be73d967c8ccd9b6"
        },
        "date": 1657658504310,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33871,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79446,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23086,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c6edf0e33882a090adda14ea77118e596b403152",
          "message": "Change successful license check log lines to debug. (#196)\n\nTwo customers (estii and motif) complained about this. I think they have a reasonable point that this is not an \"interesting\" change in status. It's completely expected.",
          "timestamp": "2022-07-22T02:55:25Z",
          "tree_id": "b17e6b16e7f4e6ed34a548357366391e63c4f675",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c6edf0e33882a090adda14ea77118e596b403152"
        },
        "date": 1658458583741,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188416,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33898,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187301,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33571,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23085,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "df3f5d15a0bfce37540c7819597f5f8c8b05b04c",
          "message": "Update HACKING.md",
          "timestamp": "2022-07-21T17:15:00-10:00",
          "tree_id": "555e4d0c95cb7a0a69c347b0216dc31c57208b7e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/df3f5d15a0bfce37540c7819597f5f8c8b05b04c"
        },
        "date": 1658459789300,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188416,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33898,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187301,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33571,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23085,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5ff550bb535a7f0a5bad6840f4df6812ab944f5a",
          "message": "Update HACKING.md",
          "timestamp": "2022-07-21T17:16:11-10:00",
          "tree_id": "57d04e151a83c24e495645f5e81e04621f4b7bb1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5ff550bb535a7f0a5bad6840f4df6812ab944f5a"
        },
        "date": 1658459830683,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188416,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33898,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187301,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33571,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23085,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "996748aa797a3fa9d6ee636b5c8d0db8c46ae9a3",
          "message": "fix: Temporarily disable internal values. (#197)\n\nWorkaround for #194 to unblock release.",
          "timestamp": "2022-07-22T06:27:50Z",
          "tree_id": "9e3d92cfb511bf2897a70fd6192af502d15b3318",
          "url": "https://github.com/rocicorp/replicache-internal/commit/996748aa797a3fa9d6ee636b5c8d0db8c46ae9a3"
        },
        "date": 1658471347239,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33884,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33559,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23048,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "577e9cf9706744bf935773697677a319070396f9",
          "message": "Bump version to 11.1.0. (#198)",
          "timestamp": "2022-07-21T21:06:39-10:00",
          "tree_id": "57198f8b1072e6f535dbccd8b5f9abcba1739a68",
          "url": "https://github.com/rocicorp/replicache-internal/commit/577e9cf9706744bf935773697677a319070396f9"
        },
        "date": 1658473661355,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33906,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33562,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23085,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5832496430b3cc8c77083a62b58838175d37502d",
          "message": "Update HACKING.md",
          "timestamp": "2022-07-21T21:09:32-10:00",
          "tree_id": "f93f04ef485e795d360598729dcc2a3dd3cee31c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5832496430b3cc8c77083a62b58838175d37502d"
        },
        "date": 1658473847659,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33906,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33562,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23085,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "2543b6e63d2936f360d37b10fb4aaef559bef5f6",
          "message": "Bump version to 11.0.1.",
          "timestamp": "2022-07-22T00:25:17-07:00",
          "tree_id": "dec04cd74393dcfb2d7635c22a45d0d2b93f9ebe",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2543b6e63d2936f360d37b10fb4aaef559bef5f6"
        },
        "date": 1658474836880,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188414,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33891,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33587,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79448,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23082,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "01f09a10a8af0b8a9e41b968df8ddd38d8690ff8",
          "message": "feat: Include request id in log context of request error logs (#200)\n\nSee https://github.com/rocicorp/replicache/issues/1007",
          "timestamp": "2022-07-25T12:15:07-07:00",
          "tree_id": "577bf6e49511734819d8334fc8b49acb7fd01127",
          "url": "https://github.com/rocicorp/replicache-internal/commit/01f09a10a8af0b8a9e41b968df8ddd38d8690ff8"
        },
        "date": 1658776571000,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188158,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33893,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187043,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33593,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79313,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23085,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "65557c14fc4ada6b2c3f2209b050998f601c36be",
          "message": "refactor: Extract rebase into reusable function. (#201)\n\nRebase is currently intertwined in Replicache pull and mutate logic.  For DD3.1 we need to\r\nuse rebase in a number of algorithms: persist, refresh and pull.  Extract rebase logic\r\ninto a reusable function and test in isolation.\r\n\r\nTowards #165",
          "timestamp": "2022-07-28T09:55:55-07:00",
          "tree_id": "c30f9b4a8995fa0539ae8456095cf410709f463d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/65557c14fc4ada6b2c3f2209b050998f601c36be"
        },
        "date": 1659027423405,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187118,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33694,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186003,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33377,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22942,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4c5dec18a2c5c36b01561f00dfafa01a5a19dcb1",
          "message": "feat: dd31 - implement lastMutationGreaterThan (#203)\n\nlocalMutationsGreaterThan is need for dd31's persist, refresh and pull algorithms. \r\n\r\nSee https://www.notion.so/replicache/DD-3-1-e42489fc2e6b4340a01c7fa0de353a30\r\nTowards #165",
          "timestamp": "2022-07-28T12:43:12-07:00",
          "tree_id": "b5ba057fc4f8598e3c12c20a627d706e760ef97a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4c5dec18a2c5c36b01561f00dfafa01a5a19dcb1"
        },
        "date": 1659037471875,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33686,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186220,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33410,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22945,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesara@gmail.com",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "bac7e8df7e45be98210764e427d573b418ce914c",
          "message": "chore: clean up typos in undo (#202)",
          "timestamp": "2022-07-28T15:30:54-07:00",
          "tree_id": "e9fbf5e406a82de2c726e9ab31ae85ce7799bcbb",
          "url": "https://github.com/rocicorp/replicache-internal/commit/bac7e8df7e45be98210764e427d573b418ce914c"
        },
        "date": 1659047516247,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33686,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186220,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33410,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22945,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "9adddebcc370b0b5f9befbda84510c82003b6f1d",
          "message": "doc: spruce quickstart - replicache-nextjs has been removed.",
          "timestamp": "2022-07-28T17:32:14-10:00",
          "tree_id": "94e0d4ffa912a71bff0f70f71f6b93645e7d873d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9adddebcc370b0b5f9befbda84510c82003b6f1d"
        },
        "date": 1659065648287,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33686,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186220,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33410,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22945,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "14ce3d3dc7239c61cb99968f99973ec66badfbe3",
          "message": "feat: Add deleteAllReplicacheData() (#199)",
          "timestamp": "2022-07-29T09:07:58-07:00",
          "tree_id": "467e7e2d9032ded9e9ceb96ec49032fadef4e5e4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/14ce3d3dc7239c61cb99968f99973ec66badfbe3"
        },
        "date": 1659110959589,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188086,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33831,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186940,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33527,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79107,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23023,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5d119cdbe50aae9338c4c8a5e171121ec77d2bbd",
          "message": "doc: reword docs for deleteAllRepliacheData() (#204)",
          "timestamp": "2022-07-29T17:09:17Z",
          "tree_id": "51ad5810c0a6d8a5ccaca573c78230ab01bad0ae",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5d119cdbe50aae9338c4c8a5e171121ec77d2bbd"
        },
        "date": 1659114617850,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23017,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b524cabb690bb7e42ee9deca5940a62f20284cf7",
          "message": "fix: remove test.only(s), fix broken test, and prevent with lint rule (#206)\n\nThese snuck in \r\nreplicache.test.ts  7c0430519f9e71f65d274b86ac5a49682386efe3\r\nand\r\ncommit.test.ts  4c5dec18a2c5c36b01561f00dfafa01a5a19dcb1\r\n\r\nNew lint rule should prevent this easy to make error in the future.",
          "timestamp": "2022-07-30T17:37:02Z",
          "tree_id": "6262920a65b35f073ddbc87d39c657fc601da793",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b524cabb690bb7e42ee9deca5940a62f20284cf7"
        },
        "date": 1659202696338,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23017,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "39616f90ba6abc7123564d4beaa95f2ae698146a",
          "message": "Update HACKING.md",
          "timestamp": "2022-07-31T21:10:37-10:00",
          "tree_id": "0bf1721ab7c519b2f485a5d6adf5c0818551ebe4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/39616f90ba6abc7123564d4beaa95f2ae698146a"
        },
        "date": 1659337914423,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23017,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6070d1e939bfff5dcb686584ed1777630f939674",
          "message": "Bump version to 11.0.2. (#208)",
          "timestamp": "2022-07-31T21:41:21-10:00",
          "tree_id": "9fcaddcf400ea02f4df51539a33beba958634725",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6070d1e939bfff5dcb686584ed1777630f939674"
        },
        "date": 1659339743948,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33827,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "39616f90ba6abc7123564d4beaa95f2ae698146a",
          "message": "Update HACKING.md",
          "timestamp": "2022-07-31T21:10:37-10:00",
          "tree_id": "0bf1721ab7c519b2f485a5d6adf5c0818551ebe4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/39616f90ba6abc7123564d4beaa95f2ae698146a"
        },
        "date": 1659389709089,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23017,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7067238fd0bd02809a4e5fe896c85dd7efae694b",
          "message": "Update HACKING.md",
          "timestamp": "2022-08-01T11:36:29-10:00",
          "tree_id": "9c943cca137d6daae0abf8bb806d31c17d54ef18",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7067238fd0bd02809a4e5fe896c85dd7efae694b"
        },
        "date": 1659389849403,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23017,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ab24f762cad41a4f273483e66c2bba528248f494",
          "message": "Bump version to 11.1.0. (#209)",
          "timestamp": "2022-08-01T11:37:51-10:00",
          "tree_id": "5fe1098cfee90a9630a3525d00c6b5d156d57021",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ab24f762cad41a4f273483e66c2bba528248f494"
        },
        "date": 1659389941603,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33805,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33493,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23000,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7067238fd0bd02809a4e5fe896c85dd7efae694b",
          "message": "Update HACKING.md",
          "timestamp": "2022-08-01T11:36:29-10:00",
          "tree_id": "9c943cca137d6daae0abf8bb806d31c17d54ef18",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7067238fd0bd02809a4e5fe896c85dd7efae694b"
        },
        "date": 1659390336278,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33809,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33495,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23017,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "05dd3404e51eeaa91a0b620bbf72e82ffd305397",
          "message": "Bump version to 11.2.0. (#210)",
          "timestamp": "2022-08-01T11:46:52-10:00",
          "tree_id": "41f9414d171c594bc14d299cfa990dba911c5403",
          "url": "https://github.com/rocicorp/replicache-internal/commit/05dd3404e51eeaa91a0b620bbf72e82ffd305397"
        },
        "date": 1659390475936,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33507,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "464b94bbdf02bc01d38b8edbff130f045310a874",
          "message": "doc: Update \"my first feature\" doc to reflect removal of zod/rails. (#211)",
          "timestamp": "2022-08-01T14:54:07-10:00",
          "tree_id": "26d53fee32b2310b8e983ab5c89b36df5dcccc57",
          "url": "https://github.com/rocicorp/replicache-internal/commit/464b94bbdf02bc01d38b8edbff130f045310a874"
        },
        "date": 1659401705628,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33507,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "ab6ac867dbcd6845f21c2d98f740d8b7d305aba4",
          "message": "spruce docs",
          "timestamp": "2022-08-02T05:41:18-10:00",
          "tree_id": "bc9b5cb2f51e4809f3d0cba5a167dd8015f7e03c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ab6ac867dbcd6845f21c2d98f740d8b7d305aba4"
        },
        "date": 1659455940715,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33507,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "00a2705a773a5c23aabd682435f3dc06bbd952ce",
          "message": "Update HACKING.md",
          "timestamp": "2022-08-02T06:05:56-10:00",
          "tree_id": "b6ab6783a3b79e2f9619a3dff9cbe48106f66a46",
          "url": "https://github.com/rocicorp/replicache-internal/commit/00a2705a773a5c23aabd682435f3dc06bbd952ce"
        },
        "date": 1659456420598,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33507,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b2806c58001fa3a8578235cc9ef94202672b5e49",
          "message": "Update HACKING.md",
          "timestamp": "2022-08-06T17:42:49-10:00",
          "tree_id": "1269e00401d7cac688c0cf0ae483f60a26a10623",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b2806c58001fa3a8578235cc9ef94202672b5e49"
        },
        "date": 1659843847071,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33507,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0906e6e34238c7e8b915b99ec7aa8d6ffa8b5ad8",
          "message": "Update HACKING.md",
          "timestamp": "2022-08-07T06:39:21-10:00",
          "tree_id": "c8815a661f8301ccb8ef8b8a546f94552c3f6c14",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0906e6e34238c7e8b915b99ec7aa8d6ffa8b5ad8"
        },
        "date": 1659890429457,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187932,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33802,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186786,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33507,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22977,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "613a1c5007c369a5efb362fb1666e69f80d8a54a",
          "message": "Try to Reopen IDB upon \"InvalidStateError: The database connection is closing.\" (#214)",
          "timestamp": "2022-08-15T20:44:05Z",
          "tree_id": "9adeca7b52321834a65107869991557568b1545e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/613a1c5007c369a5efb362fb1666e69f80d8a54a"
        },
        "date": 1660596313469,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188791,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33963,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187645,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33650,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79509,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23165,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "bd744e648976d08e9699b9c52ec4405bd1459406",
          "message": "Add some FAQ entries about pricing",
          "timestamp": "2022-08-18T23:59:22-10:00",
          "tree_id": "90531867bfbd55fa43c3bcfe689d80ee667433b5",
          "url": "https://github.com/rocicorp/replicache-internal/commit/bd744e648976d08e9699b9c52ec4405bd1459406"
        },
        "date": 1660903231106,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188791,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33963,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187645,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33650,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79509,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23165,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "8d52143139f8de6ad54e92331242819aeeb57bbe",
          "message": "doc: source license",
          "timestamp": "2022-08-19T00:05:51-10:00",
          "tree_id": "d454ad80c5a54499d4a6c83bcadb1571090dad15",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8d52143139f8de6ad54e92331242819aeeb57bbe"
        },
        "date": 1660903641147,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188791,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33963,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187645,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33650,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79509,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23165,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "575e07a562d9744aa8aba22102c1bd3cd6dc8815",
          "message": "bugfix: clean up half-created new database when failing to reopen existing db (#215)\n\n* Clean up half-created new database when failing to reopen existing db\r\n\r\n* Rethow errors other than \"db not found\"",
          "timestamp": "2022-08-19T16:54:20Z",
          "tree_id": "f5ad3d5c01f6426a1ed8b6103f189b2455a3d6d9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/575e07a562d9744aa8aba22102c1bd3cd6dc8815"
        },
        "date": 1660928124192,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188908,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33991,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187762,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33680,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23178,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2c872f0cbf191637b5dcdea5c8fd77611d0cc683",
          "message": "Bump version to 11.2.1. (#217)",
          "timestamp": "2022-08-19T11:39:54-10:00",
          "tree_id": "cecca5155be7abc94dd3f0f68cea6c5a4aae0175",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2c872f0cbf191637b5dcdea5c8fd77611d0cc683"
        },
        "date": 1660945257254,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188908,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33986,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187762,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33685,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23137,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "2c81192ee8c98461e10a10180948dba29b38dac9",
          "message": "Merge tag 'v11.2.1'",
          "timestamp": "2022-08-19T11:48:55-10:00",
          "tree_id": "cecca5155be7abc94dd3f0f68cea6c5a4aae0175",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2c81192ee8c98461e10a10180948dba29b38dac9"
        },
        "date": 1660945823752,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188908,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33986,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187762,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33685,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79567,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23137,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "3ad51b5b040c687154b85886336578721cb384bb",
          "message": "refactor: Dedupe IndexDefinition\n\nWe had both IndexDefinition and CreateIndexDefinition which were pretty\nmuch the same. Now we only have the public interface\nCreateIndexDefinition.",
          "timestamp": "2022-08-24T16:06:31+02:00",
          "tree_id": "b4b1ed7d3a279ae6b8e2dfe2e6552db0978f5d7e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3ad51b5b040c687154b85886336578721cb384bb"
        },
        "date": 1661350068783,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188934,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34026,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187788,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33694,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79570,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23157,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d3834c93fe7bae25f063fb488384b45428d6ed23",
          "message": "chore: Add no-else-return eslint rule (#220)",
          "timestamp": "2022-08-24T14:15:10Z",
          "tree_id": "8b1bdf0c88f3ee17dbaf93c8e497e9a33ed6d5a0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d3834c93fe7bae25f063fb488384b45428d6ed23"
        },
        "date": 1661350588445,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 188868,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34013,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187722,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33696,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79565,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23163,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c94ec4d2dc13f0e088676fdb662ce2fa46c61731",
          "message": "Fail reopening an IDB by aborting the upgrade txn (#216)\n\n* Fail reopening an IDB by aborting the upgrade txn\r\n* Delete corrupt db if encountered\r\n* Continue scheduling persist() when an error is thrown\r\n* Let persist() errors propagate",
          "timestamp": "2022-08-25T13:45:16-07:00",
          "tree_id": "bf3ba538d74b513634219a0d17b5ad00c5032341",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c94ec4d2dc13f0e088676fdb662ce2fa46c61731"
        },
        "date": 1661460400022,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 189105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34014,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187959,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33702,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79788,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23180,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b8fe10f0665af9092e9f8402f9405bb84f046017",
          "message": "chore: Update docusaurus to v2 (#222)",
          "timestamp": "2022-08-26T13:35:26Z",
          "tree_id": "460f42c2f45885becd28ddae3f4016ea256b9da2",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b8fe10f0665af9092e9f8402f9405bb84f046017"
        },
        "date": 1661520991117,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 189105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34014,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187959,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33702,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79788,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23180,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5b02db6a31bf59dc8b793966f345b092ad516a91",
          "message": "chore: Fix docs build (#223)",
          "timestamp": "2022-08-26T13:55:57Z",
          "tree_id": "cf78f358ba0c31fd29e35df3620350ee9071600e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5b02db6a31bf59dc8b793966f345b092ad516a91"
        },
        "date": 1661522243002,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 189105,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34014,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 187959,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33702,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79788,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23180,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "603bda224dfbab6731e8e8d41563cdd6b77d3426",
          "message": "feat: Add indexes to ReplicacheOptions (#221)\n\nThis adds `indexes` to ReplicacheOptions. It also deprecates\r\n`createIndex` and `dropIndex`.\r\n\r\nFor now it uses index commits under the hood but that is an\r\nimplementation detail and we plan to get rid of these index commits in\r\nthe future.\r\n\r\nAs expected, the new create index perf test is a lot slower (~4x)\r\nbecause it reads the data from IDB. The old perf test wrote to the in\r\nmemory store and then created the index which meant that the data was in\r\nmemory when building the index.\r\n\r\nTowards #221 \r\nCloses https://github.com/rocicorp/replicache/issues/602",
          "timestamp": "2022-08-26T14:01:53Z",
          "tree_id": "c608f98e4232f398f4313b466d3468aabda32e12",
          "url": "https://github.com/rocicorp/replicache-internal/commit/603bda224dfbab6731e8e8d41563cdd6b77d3426"
        },
        "date": 1661522574440,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 190253,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34196,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 189107,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33886,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80419,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23279,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "cc30e4efb1d671968a522ef33e045d84d9f7ebf0",
          "message": "fix: Keep maps when syncing indexes\n\nIf we have an index definition that only changed due to a change in\nindex name we can reuse the index map.",
          "timestamp": "2022-08-29T17:37:38+02:00",
          "tree_id": "07ae4de906d3de5309887ea04ccb5613b276c241",
          "url": "https://github.com/rocicorp/replicache-internal/commit/cc30e4efb1d671968a522ef33e045d84d9f7ebf0"
        },
        "date": 1661787580933,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 191151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34309,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190005,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34001,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80707,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23411,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "de7b3428783839d84236f194af692e430ce9b6d1",
          "message": "feat(DD31): Add branchID and clientID to Mutation (#229)\n\nThis pipes through the branchID to the PushRequest and the clientID to\r\nthe Mutation. It does not yet get these from the correct places.\r\n\r\nTowards #228\r\nFixes #229",
          "timestamp": "2022-08-30T15:02:32+02:00",
          "tree_id": "42dd5c463baef44c592133eb3ba123cd9d8a17ce",
          "url": "https://github.com/rocicorp/replicache-internal/commit/de7b3428783839d84236f194af692e430ce9b6d1"
        },
        "date": 1661864611221,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 192069,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190923,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34129,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23472,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "62a623ae41425f36a105f20c6eb0c34e65dd5f96",
          "message": "feat: DD31: Branch helpers. (#231)\n\nCreate Branch helpers analogous to Client helpers. getBranch, getBranches, setBranches.\r\nEnsure that the chunk that contains the BranchMap has refs to each Branches' headHash.\r\nEnforce some biz logic like disallowing changing `indexes` and `mutatorNames` of existing branches.\r\n\r\nTowards #165",
          "timestamp": "2022-08-30T10:34:24-07:00",
          "tree_id": "b867dc5b69d9e35c48d1046e2ca5e8c43ddbd75f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/62a623ae41425f36a105f20c6eb0c34e65dd5f96"
        },
        "date": 1661880922880,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 192089,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34452,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190943,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34131,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23465,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "ingar@users.noreply.github.com",
            "name": "Ingar Shu",
            "username": "ingar"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5733e1e3e10566ad64298b6b211e8233307ac9d",
          "message": "chore: remove test method from ReplicacheInternalAPI (#232)\n\n* Remove schedulePersist() from internal api\r\n\r\n* use promise returned from schedulePersist to advance test",
          "timestamp": "2022-08-30T11:10:15-07:00",
          "tree_id": "26f15e07e32b4e514e04b12c688483b0f4b302ce",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f5733e1e3e10566ad64298b6b211e8233307ac9d"
        },
        "date": 1661883080007,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 192033,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34452,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190887,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34113,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80765,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23439,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "da3639d27f5fadac1b0af10e6f8d15b0766dffa0",
          "message": "chore: Add newUUIDHash\n\nThis creates a fake hash that is a UUID. This will be used to generate\nunique fake hashes across tabs.\n\nTowards #165",
          "timestamp": "2022-08-31T21:52:49+02:00",
          "tree_id": "53aeead4aa62c80c20ff6b950177d79fb68191cb",
          "url": "https://github.com/rocicorp/replicache-internal/commit/da3639d27f5fadac1b0af10e6f8d15b0766dffa0"
        },
        "date": 1661975636191,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 192236,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34514,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 191090,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34182,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80893,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23491,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8b0bd49aea779ddd0da2018fc1c6124233b22e01",
          "message": "chore(DD31): Add ClientDD31 (#234)\n\nThis one does not follow the existing pattern. It creates two Client\r\ntypes; ClientSDD and ClientDD32. It then uses a union of those two for\r\nmost code.\r\n\r\nMutation recovery is disabled under DD31 for now.",
          "timestamp": "2022-09-01T10:33:28Z",
          "tree_id": "5b5bbd8a3f3f62a59826e028cd259e55a1ab7e79",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8b0bd49aea779ddd0da2018fc1c6124233b22e01"
        },
        "date": 1662028465124,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193257,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34661,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192111,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81301,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23614,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "is@roci.dev",
            "name": "ingar",
            "username": "ingar"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "9982954f251c3a8d43e0e697e22a33bc55ff8eb8",
          "message": "check for crypto before accessing props on it",
          "timestamp": "2022-09-02T08:55:10+02:00",
          "tree_id": "2f025757d9a25ae465bd913c9f248309e372db86",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9982954f251c3a8d43e0e697e22a33bc55ff8eb8"
        },
        "date": 1662101771247,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193290,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34681,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192144,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34349,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81329,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23614,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e9651dd97b7920305d40498820b1516479020204",
          "message": "chore: Add setClient (#238)\n\nsetClient sets a single Client in the ClientMap and sets the clients\r\nhead.",
          "timestamp": "2022-09-04T20:26:04Z",
          "tree_id": "f74e358762ee791e02e62a3e1741eac35e2d0cab",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e9651dd97b7920305d40498820b1516479020204"
        },
        "date": 1662323231373,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193385,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34711,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192239,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34360,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81361,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23635,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e731b69a46282f2d079aef240eee59660a0a2037",
          "message": "chore(DD31): Add a db diff function (#240)\n\nFor `refresh` we need to diff between two different commits. This code\r\nneed to diff the main btree as well as the index btrees.",
          "timestamp": "2022-09-06T08:49:05Z",
          "tree_id": "a65221b0bb265c67767332bb43b3dbadc9c1b53e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e731b69a46282f2d079aef240eee59660a0a2037"
        },
        "date": 1662454202690,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193385,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34711,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192239,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34360,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81361,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23635,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6164e220e5599efc242e519f30aedbaca812979b",
          "message": "chore: Move db.diff to sync.diff (#241)\n\nAnd reuse code. I found that I already had written the code to diff\r\nindexes!",
          "timestamp": "2022-09-06T12:26:30Z",
          "tree_id": "fdcf2f82eb5012422148d2f50e89fd925f123a3b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6164e220e5599efc242e519f30aedbaca812979b"
        },
        "date": 1662467276508,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193261,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34746,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192115,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34417,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81351,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23647,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b897edc5f609acceba40e025d5e741fcc7bd4437",
          "message": "feat(dd31): Refresh (#242)\n\nThis adds the refresh function which refreshes memdag:main from\r\nperdag:main.\r\n\r\nSee https://www.notion.so/replicache/DD-3-1-e42489fc2e6b4340a01c7fa0de353a30#2625952789344e10a90c4b59440a4303\r\n\r\nTowards #165",
          "timestamp": "2022-09-08T08:56:47Z",
          "tree_id": "71af2ce9fb8205ed7b5e5f2d2a4a1d35dcaff33f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b897edc5f609acceba40e025d5e741fcc7bd4437"
        },
        "date": 1662627466692,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34725,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34401,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81378,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23659,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "7d8626d16d71f4efec929e9a0e315c6b08cd179c",
          "message": "chore: Add DD31 versions for Puller\n\nWhen we need to use PullerDD31 we will have to do an \"unsafe static\ncast\".\n\nTowards #165",
          "timestamp": "2022-09-09T12:15:19+02:00",
          "tree_id": "4c9e4cc4ae398b71906ae9e6a5a43a5999ea825d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7d8626d16d71f4efec929e9a0e315c6b08cd179c"
        },
        "date": 1662718578276,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193330,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34736,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192184,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34432,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81384,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23662,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "aaa2a0dffeaf183f215eafe032a5d6d3ed9d5147",
          "message": "doc: Reference RepliacheOptions#name from Replicache#name.",
          "timestamp": "2022-09-12T09:38:58+02:00",
          "tree_id": "c180510f7c78d58f9af5af9bf7679870b0aa932d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/aaa2a0dffeaf183f215eafe032a5d6d3ed9d5147"
        },
        "date": 1662968410011,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193330,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34736,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192184,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34432,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81384,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23662,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "88d88d1164e3bbedb392439ecbf286537543c690",
          "message": "chore: Update readme for docs",
          "timestamp": "2022-09-12T09:43:48+02:00",
          "tree_id": "c8274706d44ae7e5ccde928033c9231b27e9a9ac",
          "url": "https://github.com/rocicorp/replicache-internal/commit/88d88d1164e3bbedb392439ecbf286537543c690"
        },
        "date": 1662968696678,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193330,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34736,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192184,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34432,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81384,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23662,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "abbd140190ecda6e1555af650aa8f72609f3decc",
          "message": "Code review response\n\n- make tempRefreshHash Hash | null\n- Do not include lmid 0 in the commit records for lastMutationIDs and\n  lastServerAckdMutationIDs.\n- Reuse index maps when forking when possible",
          "timestamp": "2022-09-13T11:56:44+02:00",
          "tree_id": "1a722f344d6ff1eea08bf32502da917a7ba3f45d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/abbd140190ecda6e1555af650aa8f72609f3decc"
        },
        "date": 1663063085563,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193703,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34798,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34475,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23653,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88e0168d89f0113c29a0d33f7689ac222205ef02",
          "message": "chore: lastMutationIDs to lastMutationIDChanges (#247)\n\nFor PullResponseOKDD31\r\n\r\nFollowup to 7d8626d16d71f4efec929e9a0e315c6b08cd179c",
          "timestamp": "2022-09-13T10:35:48Z",
          "tree_id": "4718c528cb90796cf70b2d8f22d99f90b312a8dd",
          "url": "https://github.com/rocicorp/replicache-internal/commit/88e0168d89f0113c29a0d33f7689ac222205ef02"
        },
        "date": 1663065423435,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193703,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34798,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34475,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23653,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b6b97f7f719f33d43157308a55105929f4eef1c4",
          "message": "chore: Update TS to 4.8.x and Docusaurus to 2.1 (#248)",
          "timestamp": "2022-09-13T20:32:21+02:00",
          "tree_id": "764ce893685ca56186ee38dddc904c2c4814603a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b6b97f7f719f33d43157308a55105929f4eef1c4"
        },
        "date": 1663094003843,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193703,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34798,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192557,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34475,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23674,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fdd4711984a1ea08ed6984ba6cee063c91858e30",
          "message": "refactor(DD31): Add put commit variants to WriteTransactionImpl and db.Write (#251)\n\nFor DD31 `persist` needs to be able to rebase multiple `Commit<LocalMeta>`a in a single `dag.WriteTransaction`. \r\nThis refactor enables this.  \r\n\r\nThis refactor also fixes an issue where `refresh` was updating the `sync` head when it should have been updating the `refresh` head, by making `WriteTransactionImpl.commit` take a head name arg rather than inferring it from whether or not the transaction is a rebase.",
          "timestamp": "2022-09-13T21:01:10-07:00",
          "tree_id": "443b0aa6112765ffa6ec6e39f52a0a8d61a32536",
          "url": "https://github.com/rocicorp/replicache-internal/commit/fdd4711984a1ea08ed6984ba6cee063c91858e30"
        },
        "date": 1663128127886,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194085,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34851,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192939,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34533,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81607,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23664,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "000847c0cd6282a60e9c46d2c3e71f8d8316749d",
          "message": "refactor: Use dbWrite in more places (#252)\n\nWe were using WriteTransactionImpl in a few internal places, which\r\nforced us to add a few methods to WriteTransactionImpl that were not\r\npart of the WriteTransaction interface.\r\n\r\nInternally, we can use dbWrite instead which allows us to remove these\r\nforwarding methods from WriteTransactionImpl.",
          "timestamp": "2022-09-14T09:08:20Z",
          "tree_id": "e0d279887a4e05c56d6e68f09d5798f4f75ebbbb",
          "url": "https://github.com/rocicorp/replicache-internal/commit/000847c0cd6282a60e9c46d2c3e71f8d8316749d"
        },
        "date": 1663146558855,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193909,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34839,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192763,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34510,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81502,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23650,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "867f12edf9d17e3bfa9208564a662d1fef2d6768",
          "message": "chore: Use @rocicorp/eslint-config (#254)",
          "timestamp": "2022-09-14T11:13:48Z",
          "tree_id": "e739c0bab27d934ffb39a9bd5ddf694b0d955404",
          "url": "https://github.com/rocicorp/replicache-internal/commit/867f12edf9d17e3bfa9208564a662d1fef2d6768"
        },
        "date": 1663154092384,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193909,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34839,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192763,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34510,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81502,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23650,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d5e618d2ef39f339f05b5b2c5d5d9a3793d24dfb",
          "message": "chore: Use @rocicorp/prettier-config (#255)",
          "timestamp": "2022-09-14T12:14:05Z",
          "tree_id": "0cfbf8d2c515c42b27b473ca604b43b18cfe3957",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d5e618d2ef39f339f05b5b2c5d5d9a3793d24dfb"
        },
        "date": 1663157716929,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 193909,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34839,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192763,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34510,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81502,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23650,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6e3decfd51acbeb4f709fc29da39f8a340903fc2",
          "message": "chore(DD31): Assert no index commits (#258)\n\nAdds `assert(!DD31)` to a few entry points to create index etc.",
          "timestamp": "2022-09-15T14:31:14Z",
          "tree_id": "d7150bf268dd5baf1b8de12ddc10d0583463f0e4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6e3decfd51acbeb4f709fc29da39f8a340903fc2"
        },
        "date": 1663252333222,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34827,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192863,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34521,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81520,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23633,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "4cddcfdb1aeac8fac1b92b0d1fa9ecd6683462bc",
          "message": "chore: Fix some typos in comments",
          "timestamp": "2022-09-15T16:39:55+02:00",
          "tree_id": "59a03c6915c36548ef3e2d8bcf85b66bb804008c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4cddcfdb1aeac8fac1b92b0d1fa9ecd6683462bc"
        },
        "date": 1663252853071,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194009,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34827,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192863,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34521,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81520,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23633,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "582d890bffed13063f4f809c6389e437c4e95308",
          "message": "Add a special error message for when users run in non-secure context. (#260)\n\nFixes #121.",
          "timestamp": "2022-09-18T09:59:37Z",
          "tree_id": "b9f8be11b69b6c9ea2f1c49d5ea9d25df715ae43",
          "url": "https://github.com/rocicorp/replicache-internal/commit/582d890bffed13063f4f809c6389e437c4e95308"
        },
        "date": 1663495246021,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194482,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35022,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193336,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34710,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81856,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23791,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ecbe9f1b8ff0f13c78a28578acb4e81ee8652ff6",
          "message": "feat(DD31): Implement persistDD31 (#262)\n\nSee https://www.notion.so/replicache/DD-3-1-e42489fc2e6b4340a01c7fa0de353a30#e20dbe668afd4f33a2808299fbc7b0f1\r\n\r\nTowards #165",
          "timestamp": "2022-09-20T10:54:54-07:00",
          "tree_id": "095c4ea77fca8a1cf2b8cb9b8fc60980c38736e4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ecbe9f1b8ff0f13c78a28578acb4e81ee8652ff6"
        },
        "date": 1663696577331,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193257,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34697,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0d00d2b09280343ec9d0fe0998558fd9b8d335fd",
          "message": "doc: fix two broken links in push/pull (#269)",
          "timestamp": "2022-09-21T08:20:44Z",
          "tree_id": "12405e6a1c24d9c8c4dd2ad690977d97cb6569dc",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0d00d2b09280343ec9d0fe0998558fd9b8d335fd"
        },
        "date": 1663748515575,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193257,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34697,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "be9a4df959dd488ade411e4139e1366ac22eb00d",
          "message": "chore: Fix perf test for populate without indexes (#270)\n\nMake sure we wait for init before we start measuring time for populate.\r\nWe do not want to include the initial setup time in this perf test.",
          "timestamp": "2022-09-21T09:13:24Z",
          "tree_id": "4ab32020ce95a333bf463546a0743d0cdeac5185",
          "url": "https://github.com/rocicorp/replicache-internal/commit/be9a4df959dd488ade411e4139e1366ac22eb00d"
        },
        "date": 1663751672171,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193257,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34697,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7d3288d7c2210afbb848e583b5861098e1c45ca0",
          "message": "chore: Add perf tests for persist (#271)\n\nThis measures the time it takes to run persist on a couple of different\r\ndata sizes.",
          "timestamp": "2022-09-21T13:57:28Z",
          "tree_id": "e900620f138bad327513fe939c991448a1c292c7",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7d3288d7c2210afbb848e583b5861098e1c45ca0"
        },
        "date": 1663768712238,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194403,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193257,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34697,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7747430f8cfd6b61c6b3dc88ea181fa394fb4844",
          "message": "chore: Use different way to override crypto.subtle in test. (#261)\n\nFollow up to https://github.com/rocicorp/replicache-internal/pull/260.",
          "timestamp": "2022-09-22T08:14:44Z",
          "tree_id": "6239de0ddc1daade05112707aab61c97ca9a597c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7747430f8cfd6b61c6b3dc88ea181fa394fb4844"
        },
        "date": 1663834543952,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194348,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34995,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193202,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34676,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesara@gmail.com",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "67e52ee6efe63f485da91336d0fe37cede379bb8",
          "message": "doc: update examples (#259)\n\n* doc: update quickstart, examples, hello\r\n\r\n* doc: introduce quickstarts\r\n\r\nI futzed with this awhile and this is what I think is best given\r\nthe content we have right now.\r\n\r\nIf you do the init app this will change a little.\r\n\r\nCo-authored-by: Aaron Boodman <aaron@aaronboodman.com>",
          "timestamp": "2022-09-22T16:53:22Z",
          "tree_id": "ddbc31def0686bb4a0beb0658d70e2f30e5694b0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/67e52ee6efe63f485da91336d0fe37cede379bb8"
        },
        "date": 1663865662159,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194348,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34995,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193202,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34676,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2bce16433d1baff6e3d7201b60cf837412206690",
          "message": "refactor: improve db test utils for working with perdag (#268)\n\nProblem\r\n=======\r\nCurrently db test utils like (addSnapshot, addLocal, etc), add to the `db.DEFAULT_HEAD_NAME`.  This is not ideal\r\nfor working with the dd31 perdag, where `db.DEFAULT_HEAD_NAME` is not used.  \r\n\r\nSolution\r\n=======\r\nUpdate these utils to take a `headName` arg, defaulting to `db.DEFAULT_HEAD_NAME`.  Update\r\nDD31 perdag related tests that use these utils to build up their commit chains on a \r\ntest head name, and then remove this head after they have setup the BranchMap to retain\r\nthe commit chain.\r\n\r\nAdd a ChainBuilder utility that remembers what dag store, head and chain to build on.  Also\r\nhave its method return the added commits (which tends to be more useful than the chain, since\r\nwith the chain you have to grab commits out of the array and then assert they are not defined and\r\nassert what type of commit they are).",
          "timestamp": "2022-09-23T08:07:17-07:00",
          "tree_id": "4a1f9124fda3f80fa19844c5587f58393b4d7e8c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2bce16433d1baff6e3d7201b60cf837412206690"
        },
        "date": 1663945716643,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194348,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34995,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193202,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34676,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81869,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "063834e12fd84b6cfb714994399728324667862d",
          "message": "feat(DD31): Implement gc for branch map state (#274)\n\nSee https://www.notion.so/replicache/DD-3-1-e42489fc2e6b4340a01c7fa0de353a30#f89781433eb0405ca5dde9ff7e14f92b\r\n\r\nTowards #165",
          "timestamp": "2022-09-23T15:33:09Z",
          "tree_id": "0aa533a6867bcbc979fea4d4e135858b6cd1a090",
          "url": "https://github.com/rocicorp/replicache-internal/commit/063834e12fd84b6cfb714994399728324667862d"
        },
        "date": 1663947247768,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194490,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35019,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34699,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81885,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23782,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "88d3ac8a59a27fcad6ba99c54fb67f76e8f7817b",
          "message": "chore: Add tmcw perf tests (#276)\n\nThis turns the reduced test case Tom McWrite provided to us into a perf\r\ntest.\r\n\r\nI reduced the sample data from `25413` elements of \"features\" to `6353`\r\nelements to make the test run faster.",
          "timestamp": "2022-09-26T14:28:15Z",
          "tree_id": "7017192f385b1a8bd99dd76cff0057af161078be",
          "url": "https://github.com/rocicorp/replicache-internal/commit/88d3ac8a59a27fcad6ba99c54fb67f76e8f7817b"
        },
        "date": 1664202552548,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194490,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35019,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34699,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81885,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23782,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8149c18758afbe4d005e451189a1fe6a8ef2d853",
          "message": "fix: Precompute the size of B+Tree node entries (#273)\n\nWe now compute the size of the B+Tree nodes up front and cache that\r\nresult in the entry. The entry used to be a pair, now it is a 3 element\r\ntuple. We only do this for BTreeWrite because for BTreeRead we do not\r\nneed to know the size.\r\n\r\nThis does not change the chunk format. For the chunk we still use a pair\r\nwith the key and the value.\r\n\r\nTowards #267",
          "timestamp": "2022-09-26T14:59:43Z",
          "tree_id": "cffc7964deffb5b087a824d184388eac9606a309",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8149c18758afbe4d005e451189a1fe6a8ef2d853"
        },
        "date": 1664204460584,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195755,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35237,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194609,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34927,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82269,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23940,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "513e4395014ad75b4b1d679f591ba00c84c6df3f",
          "message": "feat: Use a UUID instead of a hash (#275)\n\nInstead of using a slow hash function we use a UUID.\r\nThe main downside of this is that we do not get deduplication of data any more. Another downside is that diffing unrelated btrees will not be able to skip equal subtrees because their \"hashes \"will no longer match.",
          "timestamp": "2022-09-26T16:04:53Z",
          "tree_id": "33f20870facee40e661f54884bfd7b10b84e7aa0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/513e4395014ad75b4b1d679f591ba00c84c6df3f"
        },
        "date": 1664208357166,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193023,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34481,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81510,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23644,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "a67119744b7c39b42ff095f964d8043b92edc5be",
          "message": "chore: Move HACKING.md to README.md.\n\nWe don't need README.md anymore as this repo isn't public and\nthe info in HACKING.md is more frequently what I'm looking for.",
          "timestamp": "2022-09-26T11:31:11-10:00",
          "tree_id": "9dd9a7c189709f22ee693bfab72594751c4faf1f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/a67119744b7c39b42ff095f964d8043b92edc5be"
        },
        "date": 1664227974821,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193023,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34481,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81510,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23644,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8c36012148757cdb3f81712dd832c0832f72fac6",
          "message": "Bump version to 11.3.0. (#278)",
          "timestamp": "2022-09-26T13:22:52-10:00",
          "tree_id": "6ce65dd974e24ecec7a6b33adfa239dc00d68410",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8c36012148757cdb3f81712dd832c0832f72fac6"
        },
        "date": 1664234646421,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194169,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34795,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193023,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34498,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81510,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23627,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7505d7f058ed14f27c4b8ea12f9eacc29b2a034c",
          "message": "fix: Only compute diffs if there are subscriptions (#280)\n\nWe were always computing diffs in mutations even if there were no\r\nsubscriptions which is causing some unnecessary work. This change makes\r\nit so that we only compute diffs if there are subscriptions.",
          "timestamp": "2022-09-27T15:37:15+02:00",
          "tree_id": "bb41bc5a25e3b0048ceb904f5d6664ada36062d1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7505d7f058ed14f27c4b8ea12f9eacc29b2a034c"
        },
        "date": 1664285914116,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194297,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34812,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34497,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81573,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23647,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ba6302da0505160540817fce20b1cab3c476079d",
          "message": "fix: Only compute diffs for indexes if needed (#281)\n\nPipe through the subscriptions so that we can check if there is a\r\nsubscription for an index before we compute the diff for the index\r\nbtree.\r\n\r\nFixes #129",
          "timestamp": "2022-09-27T13:56:30Z",
          "tree_id": "4cac36c9875b4fc18e2f5eed8534560bebf1a471",
          "url": "https://github.com/rocicorp/replicache-internal/commit/ba6302da0505160540817fce20b1cab3c476079d"
        },
        "date": 1664287057526,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34923,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194127,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34615,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23729,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8b42a342d3eb09d177490e6c6319ec62dbab507f",
          "message": "chore: Rename a variable (#282)\n\nFixes #257",
          "timestamp": "2022-09-27T14:01:14Z",
          "tree_id": "9b4c2f23ef187faa4c18e221bc58d1beae54885b",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8b42a342d3eb09d177490e6c6319ec62dbab507f"
        },
        "date": 1664287331686,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34909,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34608,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82000,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23729,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f2e2c77c78afce719d0f2d3b0338a3c46907a489",
          "message": "fix: Fix assertNotTempHash (#284)\n\nThis could cause a client to not be able to read old data in the perdag.\r\n\r\nThe test was incorrect. In the old release 't' was a valid character in\r\na non temp hash.",
          "timestamp": "2022-09-27T15:49:50Z",
          "tree_id": "48f98584eb256fb0f030ca257d7980aca2402f5a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f2e2c77c78afce719d0f2d3b0338a3c46907a489"
        },
        "date": 1664293853509,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34887,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194127,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34593,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23677,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "0fc529488c83fe68319fb8376133a78b475475c6",
          "message": "11.3.1",
          "timestamp": "2022-09-27T21:17:44+02:00",
          "tree_id": "68d8061fae92469369bfc3f6821e1b4c20ab425c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/0fc529488c83fe68319fb8376133a78b475475c6"
        },
        "date": 1664306554717,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34895,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194127,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34597,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23688,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fa5867728dbc83304c8f473d390e5283d2921844",
          "message": "feat: Update persistDD31 to throw ClientStateNotFoundError if client missing (#279)\n\nAdd and reenable related tests.",
          "timestamp": "2022-09-27T13:16:13-07:00",
          "tree_id": "1573bb09c4635c1b2ee1d3a6c1b4df524b8d3b1f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/fa5867728dbc83304c8f473d390e5283d2921844"
        },
        "date": 1664309843755,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195273,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34895,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194127,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34597,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81983,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23703,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d509c5d61480887c734b53e50c174549b9f00857",
          "message": "chore: Rename and clean up options for diffing (#287)\n\nSubscriptionsManagerOptions -> DiffComputationConfig\r\nsize -> shouldComputeDiffs\r\nhasIndexSubscription -> shouldComputeDiffsForIndex",
          "timestamp": "2022-09-28T08:28:51Z",
          "tree_id": "ba893776d76473ef222b1eb6d0bf7757c6ba9642",
          "url": "https://github.com/rocicorp/replicache-internal/commit/d509c5d61480887c734b53e50c174549b9f00857"
        },
        "date": 1664353788585,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34902,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34600,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23704,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "98ef232292fdfc5aac2671fb04cd7cee3a2057d7",
          "message": "chore: Fix persist test typo (#288)\n\nThe second Replicache instance uses a different IDB because not the same\r\nname.",
          "timestamp": "2022-09-28T18:59:09Z",
          "tree_id": "5ce54fca738df57969fd45a030f0d83c319837aa",
          "url": "https://github.com/rocicorp/replicache-internal/commit/98ef232292fdfc5aac2671fb04cd7cee3a2057d7"
        },
        "date": 1664391607470,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195283,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34902,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194137,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34600,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82052,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23704,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "7073fe3675a2aa28010148333e2c140fc7250990",
          "message": "chore: Micro optimize Map loops (#286)\n\nTurns out for-of is a slightly faster then forEach.\r\n\r\nI started looking at this because the flame charts shows \"anonymous\" for\r\nthe forEach case which makes it harder to reason about where the time is\r\nspent.",
          "timestamp": "2022-09-28T19:08:32Z",
          "tree_id": "b75371bbe3c321eb3a37392ea53ee5f65040e7e4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/7073fe3675a2aa28010148333e2c140fc7250990"
        },
        "date": 1664392169333,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195246,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194100,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34581,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23708,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e873077a363f98dc562a8f615caccd0a083bc0a3",
          "message": "chore: Use ClientID instead of string (#283)\n\nFixes #256",
          "timestamp": "2022-09-28T19:17:54Z",
          "tree_id": "6d50bfb8fde392d8af4e9697bba9afc3443cdb54",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e873077a363f98dc562a8f615caccd0a083bc0a3"
        },
        "date": 1664392748022,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195246,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194100,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34581,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23692,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "96287ee59c6645ed52e62ec8735aac069d4e59f0",
          "message": "chore: Use ChainBuilder in test",
          "timestamp": "2022-09-29T10:54:02+02:00",
          "tree_id": "55a0a80f864cf8f689da78c7ded325803c516e88",
          "url": "https://github.com/rocicorp/replicache-internal/commit/96287ee59c6645ed52e62ec8735aac069d4e59f0"
        },
        "date": 1664441700281,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195246,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194100,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34581,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82031,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23692,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "3a2870c5fcc1a1be35e66a95b1d5ecf6f318031b",
          "message": "chore: Get rid of some usages of updateClients (#291)",
          "timestamp": "2022-09-29T09:08:37Z",
          "tree_id": "ff07a088972b612fd515cbf9961e064aee0b81ad",
          "url": "https://github.com/rocicorp/replicache-internal/commit/3a2870c5fcc1a1be35e66a95b1d5ecf6f318031b"
        },
        "date": 1664442574697,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195851,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34964,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 194705,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34667,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82322,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23730,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "aa009a23dba420185adb8bf3ee64057f59d8de35",
          "message": "feat(dd31): pull (#292)\n\nhttps://www.notion.so/replicache/DD-3-1-e42489fc2e6b4340a01c7fa0de353a30#c32ab5b6b14e48a28348bdf44eed5423\r\n\r\nTowards #165",
          "timestamp": "2022-10-03T10:53:05+02:00",
          "tree_id": "0e97301e52296de103643776f569243cf2ab2153",
          "url": "https://github.com/rocicorp/replicache-internal/commit/aa009a23dba420185adb8bf3ee64057f59d8de35"
        },
        "date": 1664787272472,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 197250,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35172,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 196104,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34888,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82483,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23834,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f270705697da14a8af714817df4c4b3323a689ce",
          "message": "fix: Parallelize two steps steps (#295)\n\nWe can fixup the memdag as we wait for IDB.",
          "timestamp": "2022-10-03T09:05:03Z",
          "tree_id": "ccbae19a2dbf423ff5c5503e9eca4fb3240d62c1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f270705697da14a8af714817df4c4b3323a689ce"
        },
        "date": 1664787968706,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 197297,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35198,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 196151,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34874,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82498,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23822,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "60913b729d8f6b6d1df982ff7122923818cc821e",
          "message": "chore: Remove updateClient (#296)\n\nupdateClient was needed when we had a n async (non microtask) hash\r\ncomputation function in the persist phase. The code was read the current\r\nhash, compute the new hash and then do a write transaction. If the\r\ncurrent hash still matched it then wrote the new chunks with the\r\ncomputed hashes. If it didn't match we tried again (a few times). Now\r\nthat we use an UUID instead of computing the hash we can remove this\r\nread and write retrial logic.\r\n\r\nTowards #165",
          "timestamp": "2022-10-03T09:37:10Z",
          "tree_id": "433db7a8da3ce5fc2645ea78d7fc9200bb10c633",
          "url": "https://github.com/rocicorp/replicache-internal/commit/60913b729d8f6b6d1df982ff7122923818cc821e"
        },
        "date": 1664789909082,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 195123,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34823,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193977,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34498,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81989,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23678,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "5ea728eeb467528d433d301c04e0ea4f151f5927",
          "message": "chore: Refactor mutation recovery (#297)\n\nUse module level functions",
          "timestamp": "2022-10-03T15:40:59+02:00",
          "tree_id": "93baea427803f188afdd3cda7416da574eff2ac1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/5ea728eeb467528d433d301c04e0ea4f151f5927"
        },
        "date": 1664804523759,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194431,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34753,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193285,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34438,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81979,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23681,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "17fbc0618b02610994875f45e63c7fb5d3d543ec",
          "message": "chore: Cleanup logic around perdag creation (#298)\n\nFor mutation recovery we sometimes create a new perdag. Cleanup this\r\nlogic slightly.",
          "timestamp": "2022-10-03T21:17:33Z",
          "tree_id": "4d5e36b2d7bc658a0efc3168042d3667ec39f17a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/17fbc0618b02610994875f45e63c7fb5d3d543ec"
        },
        "date": 1664831929481,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194490,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34754,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81988,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23633,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesara@gmail.com",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9cb1857a5d07f6c6c5cc7eed2941511847daba63",
          "message": "doc: update quick starts with create-replicache-app (#299)",
          "timestamp": "2022-10-04T11:11:28-07:00",
          "tree_id": "2cea7e6ff11081ae6cc3d42bae5a6dd58b07261c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9cb1857a5d07f6c6c5cc7eed2941511847daba63"
        },
        "date": 1664907145405,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194490,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34754,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81988,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23633,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "701eeaa765e6fafc2d749d8a64f017e12a8f1311",
          "message": "chore: Make the log more explicit (#304)\n\nFixes #302",
          "timestamp": "2022-10-05T12:12:44+02:00",
          "tree_id": "39dc2918094bad79e2e441bfaa9a691c7702c15e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/701eeaa765e6fafc2d749d8a64f017e12a8f1311"
        },
        "date": 1664964826103,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194490,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34754,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81988,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23633,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "84e1c53ead1c18b849f742533441a34a0e39b393",
          "message": "chore: Rename internal interface (#306)\n\nFollow up to #297",
          "timestamp": "2022-10-05T12:13:38+02:00",
          "tree_id": "1bbfc65c59833f93f150f80a2f926f981ab7d443",
          "url": "https://github.com/rocicorp/replicache-internal/commit/84e1c53ead1c18b849f742533441a34a0e39b393"
        },
        "date": 1664964872932,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194490,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34754,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193344,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34449,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81988,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23633,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "8d4192d8b6a82188e91b6fc85692417fd070c4b6",
          "message": "chore: use setClient (#305)\n\nFollow up to #296",
          "timestamp": "2022-10-05T10:47:58Z",
          "tree_id": "7a46998469149c2fe7f6a1cc4fb600ba4f8ae986",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8d4192d8b6a82188e91b6fc85692417fd070c4b6"
        },
        "date": 1664966934567,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194626,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34773,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193480,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34459,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 82038,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23632,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "237e462d1184a7dc36c43a7c0e6cfe16a3100155",
          "message": "log Replicache name and version on startup",
          "timestamp": "2022-10-05T20:35:43-10:00",
          "tree_id": "1c241bef2d1a98322aeb1dfe4e83099e31070529",
          "url": "https://github.com/rocicorp/replicache-internal/commit/237e462d1184a7dc36c43a7c0e6cfe16a3100155"
        },
        "date": 1665038200749,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194334,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34752,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23674,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "23d905893be6a1c5f0da5a26cd6ec6037766412a",
          "message": "Fix version in package-lock.json",
          "timestamp": "2022-10-05T20:38:26-10:00",
          "tree_id": "5980065dfe186289f1067fa3e892d509728975d6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/23d905893be6a1c5f0da5a26cd6ec6037766412a"
        },
        "date": 1665038373550,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194334,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34752,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34411,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23674,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "c11f8a7d0e15acccc1a067a9d23b0bb23ae8e2ef",
          "message": "Bump version to 11.3.2.",
          "timestamp": "2022-10-05T20:53:31-10:00",
          "tree_id": "b39fcc1c61d6f0f302c3bb7308fa3461f83cdbc3",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c11f8a7d0e15acccc1a067a9d23b0bb23ae8e2ef"
        },
        "date": 1665039269938,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194334,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34719,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23676,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a92d10c53d4a09cb64c3023612123e78e4fb939c",
          "message": "Update README.md",
          "timestamp": "2022-10-05T20:54:59-10:00",
          "tree_id": "09c1d2ba9e7649ed2ec372a1bfd70e4c015b9b43",
          "url": "https://github.com/rocicorp/replicache-internal/commit/a92d10c53d4a09cb64c3023612123e78e4fb939c"
        },
        "date": 1665039357779,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194334,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34719,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193188,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34421,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81929,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23676,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "460e7e14021a0e061ce2390c64312b56f569582a",
          "message": "fix: Follow up to pull PR (#308)\n\n* fix: Follow up to pull PR\r\n\r\nFixes issues related to lastMutationIDChanges and updates comments\r\n\r\nNo need to update the index map twice. Applying the patch calls put/delete which will update the index maps.\r\n\r\nFollow up to #292",
          "timestamp": "2022-10-06T12:29:44+02:00",
          "tree_id": "d52e49cea14e03cba94f8414ae5d216f7a68509c",
          "url": "https://github.com/rocicorp/replicache-internal/commit/460e7e14021a0e061ce2390c64312b56f569582a"
        },
        "date": 1665052240538,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194083,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34674,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192937,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34361,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81916,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23647,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4fd6c9dc8e0b9757894568c744bcf59b6528457b",
          "message": "fix(DD31): Use correct indexes in handlePullResponseDD31 (#311)\n\nThe indexes for the new snapshot should be built from the base snapshot's indexes,\r\nnot the head commit's indexes.\r\n\r\nAlso reenables some tests for DD31 that I think were accidentally disabled.\r\n\r\nFollow up to #308.",
          "timestamp": "2022-10-07T11:12:00-07:00",
          "tree_id": "3fa580221bfeb3fc291cbb6b21cc933431b1765e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4fd6c9dc8e0b9757894568c744bcf59b6528457b"
        },
        "date": 1665166387234,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194083,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34674,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 192937,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34361,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81916,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23647,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f68f8e8839b05adcb1f9aae1155c2d8d6c89ff0e",
          "message": "Update bg-interval-process to ensure no overlap of process runs (#312)\n\nAlso move it from src/persist to src/.  With this small tweak will be useful for running refresh and mutation recovery intervals.",
          "timestamp": "2022-10-17T19:04:26Z",
          "tree_id": "ed09e9a166bd4a26334df78e21d0c57ffd2d3669",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f68f8e8839b05adcb1f9aae1155c2d8d6c89ff0e"
        },
        "date": 1666033523188,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 194266,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34677,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 193120,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 34365,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 81923,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23654,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "23822e62e955632c15f29bdcb5626823bad5ec72",
          "message": "refactor: replace temp hashes with uuid hashes. (#316)\n\nThis eliminates persist modifying the memdag and significantly simplifies persist.\r\n\r\nTemp hashes are eliminated, and the concept of 'temp chunks' is replaced by 'memory-only chunks'.\r\n\r\nInstead of gathering temp chunks identified by their temp hashes, persist now gathers 'memory-only chunks'\r\nidentified via the new API `LazyRead#isMemOnlyChunkHash`.  \r\n\r\nInstead of computing permanent hashes for the perdag and fixing up the memdag hashes, chunks\r\nare now persisted with the uuid hash assigned to them by the memdag.  This eliminates the\r\nneed to \"fixup hashes\" in the memdag.\r\n\r\n`persist` is now explicitly aware that memdag is a `LazyStore` as it now relies on the `LazyStore` specific\r\nAPIs `chunksPersisted` and `LazyRead#isMemOnlyChunkHash`.  This slight increase in coupling seems\r\nfine given LazyStore is designed specifically with persist in mind and overall this change reduces complexity.\r\n\r\n`LazyWrite#putChunk` now only allows putting 'memory-only chunks', that is it disallows directly putting\r\nperdag chunks (i.e. source chunks).   The old hash fixup process had persist putting perdag chunks\r\ninto memdag via `LazyWrite#putChunk`.  However this is eliminated, and writing perdag chunks directly\r\nto the memdag is likely a programming error. \r\n\r\nLazyStore's cache eviction and GC semantics are adjusted slightly for LazyWrite.    Source chunks read \r\nduring a LazyWrite are cache separately until the LazyWrite is committed, at which time their ref\r\ncounts are calculated (considering any head changes made by the LazyWrite), and if referenced\r\nby a head after the commit is added to the source chunks cache.  An example is helpful for\r\nunderstanding the impact of this change.  Consider:\r\n```\r\n  await lazyStore.withWrite(async write => {\r\n    await write.setHead('testLazy', sourceChunkHash);\r\n    const chunk = await write.getChunk(sourceChunkHash);\r\n    await write.commit();\r\n    return chunk;\r\n  });\r\n```\r\nPrior to this change the chunk with hash `sourceChunkHash` would not have been cached by the source chunk\r\ncache, because there is no reference to it from a lazy store head until after the write is committed.\r\n\r\nNow it will be cached (also not it doesn't matter if the head is set before or after the chunk is read).\r\n\r\nThis adjustment will result in less cache churn during the DD31 `refresh` process.\r\n\r\nReintroduces the assert that syncHead doesn't change between beginPull and maybeEndPull removed here: https://github.com/rocicorp/replicache-internal/commit/087c09c2c7b79011eaf09a529a3f4d7299ca8a48\r\nPersist modifying the syncHead (during fixup hashes) could previously make this assert fail.",
          "timestamp": "2022-10-18T18:15:50-07:00",
          "tree_id": "61ef33574fe85441160f93f81b2e50ab3115519a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/23822e62e955632c15f29bdcb5626823bad5ec72"
        },
        "date": 1666142213663,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185467,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33326,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184321,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33008,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78474,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22883,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesar@roci.dev",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f5808bdb3f488cf3a99916247ecb7f1425fb8da1",
          "message": "doc: create replicache quick start updates (#318)\n\n* doc: create replicache quick start updates",
          "timestamp": "2022-10-18T22:40:02-07:00",
          "tree_id": "8172314f9d27fc83625cde1f5aae53bad999a249",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f5808bdb3f488cf3a99916247ecb7f1425fb8da1"
        },
        "date": 1666158067365,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185467,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33326,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184321,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33008,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78474,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22883,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "8e7a30d9cdc664aab3a82abc5815a85e7cb73263",
          "message": "Revert \"doc: create replicache quick start updates (#318)\"\n\nThis reverts commit f5808bdb3f488cf3a99916247ecb7f1425fb8da1.",
          "timestamp": "2022-10-18T22:48:06-10:00",
          "tree_id": "61ef33574fe85441160f93f81b2e50ab3115519a",
          "url": "https://github.com/rocicorp/replicache-internal/commit/8e7a30d9cdc664aab3a82abc5815a85e7cb73263"
        },
        "date": 1666169351997,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185467,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33326,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184321,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33008,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78474,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22883,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b1756a1aa2a62db7740bdc34dd421c9d72ad03a2",
          "message": "chore: Fix perf tests (#320)\n\n237e462d1184a7dc36c43a7c0e6cfe16a3100155 broke the perf tests. The\r\nchange looks innocent enough but it unraveled a few things:\r\n\r\n- The test runner does not fail when the imported ts files fail to\r\n  execute. In this case we had a reference to an undefined binding\r\n  `REPLICACHE_VERSION`.\r\n- Made the perf runner fail if there is an error.\r\n- But why was `REPLICACHE_VERSION` not defined?\r\n- Because, even though we use the compiled replicache js from\r\n  `out/replicache`, there are other imports from the perf tests (like\r\n  src/json) and eventually we import `src/replicache.ts`.\r\n- I refactored the imports a bit so that we do not import the whole\r\n  world again.\r\n- To prevent this from happening again I added an \"allow list\" to the\r\n  perf runner. If the imports change in a way that the perf runner\r\n  imports something not in the allow list it fails.",
          "timestamp": "2022-10-19T15:24:59Z",
          "tree_id": "b06eaa32c0252473a0c2dade2e3737c31e249d94",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b1756a1aa2a62db7740bdc34dd421c9d72ad03a2"
        },
        "date": 1666193161266,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185537,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33374,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184391,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33030,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78478,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22840,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesar@roci.dev",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "e54604d8e50f80e09d7156e0ece305db3c133042",
          "message": "doc: quick start update take 2 (#321)\n\n* doc: create replicache quick start updates (#318)\r\n* update app-structure",
          "timestamp": "2022-10-19T22:02:25-07:00",
          "tree_id": "0e9e76ac158c63aa6414c64223d2680882c404d8",
          "url": "https://github.com/rocicorp/replicache-internal/commit/e54604d8e50f80e09d7156e0ece305db3c133042"
        },
        "date": 1666242203757,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185537,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33374,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184391,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33030,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78478,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22840,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6c8d5bee412fda01d6c0fb92fd27d0ce34905b35",
          "message": "chore: Fix perf runner again (#322)\n\nRemove the allow list and only deny /src/replicache\r\n\r\nAdd type checking to perf/runner.js\r\n\r\nFollowup to #320",
          "timestamp": "2022-10-20T15:58:23+02:00",
          "tree_id": "345f68c25692677e9c2346cae9de465f207c0579",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6c8d5bee412fda01d6c0fb92fd27d0ce34905b35"
        },
        "date": 1666274368184,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184358,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33026,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78397,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "2eb01e85fa577b25200d4879b38e02b680a825de",
          "message": "Problem: Vercel comment links break on our docs site when pointing\nto a different page.\n\nSolution:\n\nThis is caused because Vercel is using the <link rel=\"canonical\">\ntag and ours has a path component with a double-slash:\n<link rel=\"canonical\"\n  href=\"https://doc.replicache.dev//app-structure\" data-rh=\"true\">.\n\nThis is allowed by the spec, but not our intent. Everything else in\nour stack ignores the double-slash so we don't see any bugs\nelsewhere.\n\nThe canonical tag is generated by our docusaurus \"url\" configuration\nwhich had a trailing slash.\n\nThe docusaurus docs say it shouldn't have that:\n\nhttps://docusaurus.io/docs/api/docusaurus-config#url",
          "timestamp": "2022-10-20T10:09:40-10:00",
          "tree_id": "87429ef4cb47691e693f84886eb162de34e54be0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2eb01e85fa577b25200d4879b38e02b680a825de"
        },
        "date": 1666296653663,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184358,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33026,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78397,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "1c284e50abf00a03204d5368158ec24c8eaf31cb",
          "message": "fix: Restore chunk index prefix field name (#323)\n\n1074680ae0d438cb1e63baf0f89d649e1ca823ec renamed `keyPrefix` in the\r\ncommit chunk data to `prefix`. The goal was to be more consistent.\r\n\r\nHowever, renaming a field requires a REPLICACHE_FORMAT_VERSION bump.\r\n\r\nBumping the REPLICACHE_FORMAT_VERSION does not seem worth it so we\r\nrevert back to the old name.",
          "timestamp": "2022-10-20T21:24:51Z",
          "tree_id": "93c22444015f7c4e99f66969059670b84fd3fda9",
          "url": "https://github.com/rocicorp/replicache-internal/commit/1c284e50abf00a03204d5368158ec24c8eaf31cb"
        },
        "date": 1666301156629,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185729,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184583,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33063,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78422,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22827,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6d583e809c6f5bb22a2a8d67b6273a64ac2b76fb",
          "message": "chore: Remove usage of src/idb-databases-store-db-name in perf test (#327)\n\nThis was using the wrong file anyway so it didn't have any impact on\r\nout/replicache",
          "timestamp": "2022-10-21T12:10:51Z",
          "tree_id": "68dda05ecadcd36bd4bf77b43b2fed5bf5e9932f",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6d583e809c6f5bb22a2a8d67b6273a64ac2b76fb"
        },
        "date": 1666354297313,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185729,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184583,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33063,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78422,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22827,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "cc9ac6acc1b3e1ac1a3d4466568978cafd656436",
          "message": "Revert \"fix: Restore chunk index prefix field name (#323)\"\n\nThis reverts commit 1c284e50abf00a03204d5368158ec24c8eaf31cb.\n\nTo see if the perf tests failures are real.",
          "timestamp": "2022-10-21T14:46:21+02:00",
          "tree_id": "4657c5cec2f2761db3fb5b48b8ff95d47bd78e92",
          "url": "https://github.com/rocicorp/replicache-internal/commit/cc9ac6acc1b3e1ac1a3d4466568978cafd656436"
        },
        "date": 1666356476116,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184358,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33026,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78397,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "9c2299c8fc6b2416bfb4da840d9f4d5a4825cb15",
          "message": "chore: Don't fail perf tests on rm (#329)\n\nWe try to remove the temp directory after the tests but we should not\r\nfail the tests if the rm fails.",
          "timestamp": "2022-10-21T13:34:01Z",
          "tree_id": "dd1e7a5657eec84f891e81c37cff8cd745423c88",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9c2299c8fc6b2416bfb4da840d9f4d5a4825cb15"
        },
        "date": 1666359298117,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184358,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33026,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78397,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "738e069615732ea8fe28f1f683cd71b44a2bb169",
          "message": "chore: Do not export chain create helpers (#328)",
          "timestamp": "2022-10-21T13:38:08Z",
          "tree_id": "f1ff71ac2eff72fddf68127f63136b4bd30394a2",
          "url": "https://github.com/rocicorp/replicache-internal/commit/738e069615732ea8fe28f1f683cd71b44a2bb169"
        },
        "date": 1666359557440,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185504,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33335,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184358,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33026,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78397,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22792,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "distinct": true,
          "id": "863d4675bcdd0f2e6b90d8a6223f5eee5cc3ba94",
          "message": "Revert \"Revert \"fix: Restore chunk index prefix field name (#323)\"\"\n\nThis reverts commit cc9ac6acc1b3e1ac1a3d4466568978cafd656436.\n\nThis was not the perf culprit",
          "timestamp": "2022-10-21T16:48:24+02:00",
          "tree_id": "1e1cdb5779b66d601674bf90dc38ab8b9c2748a6",
          "url": "https://github.com/rocicorp/replicache-internal/commit/863d4675bcdd0f2e6b90d8a6223f5eee5cc3ba94"
        },
        "date": 1666363783684,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185729,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33354,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184583,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33063,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78422,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22827,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "49f1f03f49b654f1fdd9d74b118c7e84398ec573",
          "message": "chore: Make ChainBuilder the only one (#330)\n\nThis is in preparation for mutation recovery where the chain builder\r\nwill carry the DD31 flag.",
          "timestamp": "2022-10-24T15:10:31Z",
          "tree_id": "430d30b5e619247c6b0322095ad2bf5c59233231",
          "url": "https://github.com/rocicorp/replicache-internal/commit/49f1f03f49b654f1fdd9d74b118c7e84398ec573"
        },
        "date": 1666624293033,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 185753,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33361,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 184607,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33060,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 78422,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22819,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4244c1814eff206547e8ae12991866fc56ae4d5c",
          "message": "chore: Make ChainBuilder carry dd31 flag (#332)\n\nAnd pass dd31 runtime flag through in more places.\r\n\r\nThis is in preparation for the mutation recovery change.",
          "timestamp": "2022-10-25T18:27:23+01:00",
          "tree_id": "ebda87e4802f5c70691ec37fe111a850ed7c4e10",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4244c1814eff206547e8ae12991866fc56ae4d5c"
        },
        "date": 1666718910096,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186704,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33523,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185558,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33214,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79144,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22976,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "dd10b3f9ffda5e72c8a0dbf049d1e1c4eb5be37c",
          "message": "doc: overall byob guide.",
          "timestamp": "2022-10-25T23:08:13-10:00",
          "tree_id": "6c51445e0d42dce3df0a48b047dde65318d96744",
          "url": "https://github.com/rocicorp/replicache-internal/commit/dd10b3f9ffda5e72c8a0dbf049d1e1c4eb5be37c"
        },
        "date": 1666775352457,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186704,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33523,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185558,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33214,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79144,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22976,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "82f2c88c805ddb14ff9147dc80a1ca8123f6ab66",
          "message": "doc: minor fixes for compatibility with Next.js 13.",
          "timestamp": "2022-10-26T00:52:57-10:00",
          "tree_id": "9acb0c7d366809307a64f66f385d88b273e2c783",
          "url": "https://github.com/rocicorp/replicache-internal/commit/82f2c88c805ddb14ff9147dc80a1ca8123f6ab66"
        },
        "date": 1666781636979,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 186704,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33523,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185558,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33214,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79144,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 22976,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c3a5ee1f6b4d3bc05ba9ff5250d3ccbadb428f9d",
          "message": "fix: prevent unintended concurrent persists in perf tests (#334)\n\nProblem\r\n======\r\n\r\nSince the persistPullLock was removed in https://github.com/rocicorp/replicache-internal/commit/087c09c2c7b79011eaf09a529a3f4d7299ca8a48 the below benchmarks\r\nhad unintended concurrent persists leading to incorrect timings.  \r\n\r\nbenchmarkCreateIndex\r\nbenchmarkStartupUsingBasicReadsFromPersistedData\r\nbenchmarkStartupUsingScanFromPersistedData\r\nbenchmarkPersist\r\n\r\nExample bad timings:\r\ncreate index with definition 1024x5000 50/75/90/95%=-317.70/-242.20/128.40/128.40 ms avg=-440.17 ms (7 runs sampled)\r\nstartup read 1024x100 from 1024x100000 stored 50/75/90/95%=66.20/82.00/31591.50/31591.50 ms avg=4575.83 ms (7 runs sampled)\r\nstartup scan 1024x100 from 1024x100000 stored 50/75/90/95%=54.50/75.00/30212.40/30212.40 ms avg=4358.93 ms (7 runs sampled)\r\n\r\n\r\nSolution\r\n======\r\n\r\nAdd an internal options to disable auto scheduling of persist, so that these perf tests can explicitly \r\ninvoke persist without being interfered with by normal auto scheduled persist.  Add an \r\nassert to persist so that we get an obvious failure if we accidentally reintroduce concurrent\r\npersists.",
          "timestamp": "2022-10-26T17:30:21-07:00",
          "tree_id": "fc3d4e270f4f3501df7715d49eb42762bf124ec4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c3a5ee1f6b4d3bc05ba9ff5250d3ccbadb428f9d"
        },
        "date": 1666830688334,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187059,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33588,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185913,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33263,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79250,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23016,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "6f35abebe9588892e5722bf7c9118271007ab471",
          "message": "fix: Avoid Uncaught (in promise) errors in lazy store close handling. (#333)\n\nThis is one place where an Uncaught \"InvalidStateError: The database connection is closing.\" can be reported.",
          "timestamp": "2022-10-26T17:43:31-07:00",
          "tree_id": "971cbc36c8faa2170808c2d67fefae85118f6d9d",
          "url": "https://github.com/rocicorp/replicache-internal/commit/6f35abebe9588892e5722bf7c9118271007ab471"
        },
        "date": 1666831467279,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187076,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33579,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 185930,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33247,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79263,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23035,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "217116d77f291ce166207919758a9e400f29a3d4",
          "message": "fix: fix perf regression due to uuid hashes being slower (#338)\n\nProblem\r\n=======\r\nA perf regression was introduced by the replacement of temp hashes (simple counter based hash) with uuid\r\nhashes in the memdag (23822e62e955632c15f29bdcb5626823bad5ec72).\r\n\r\nSolution\r\n======\r\nChange newUUIDHash implementation to use a single uuid for the javascript execution context plus a counter, instead of a new uuid each time.  \r\n\r\nThis increases hash length from 36 to 44.  Dashes are stripped from uuid to avoid increasing to 48.  \r\n\r\nMeaningfully improves perf of `populate`, `create index`,  `create index with definition`, and `persist`.  \r\n\r\nPerf comparisons made on my mac laptop\r\n  Model Name: MacBook Pro\r\n  Model Identifier: MacBookPro18,4\r\n  Chip: Apple M1 Max\r\n  Total Number of Cores: 10 (8 performance and 2 efficiency)\r\n  Memory: 64 GB\r\n  Physical Drive:\r\n    Device Name: APPLE SSD AP1024R\r\n    Media Name: AppleAPFSMedia\r\n    Medium Type: SSD\r\n    Capacity: 994.66 GB (994,662,584,320 bytes)\r\n\r\n**With this change**\r\n```\r\ngreg replicache-internal [grgbkr/fast-uuid-hash]$ npm run perf -- --format replicache\r\n\r\n> replicache@11.3.2 perf\r\n> npm run build-perf && node perf/runner.js \"--format\" \"replicache\"\r\n\r\n\r\n> replicache@11.3.2 build-perf\r\n> node tool/build.mjs --perf\r\n\r\nRunning 24 benchmarks on Chromium...\r\nwriteSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.90/1.20/1.40/1.90 ms avg=1.09 ms (19 runs sampled)\r\nwriteSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.90/1.00/1.20/2.00 ms avg=1.03 ms (19 runs sampled)\r\nwriteSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.10/1.40/2.20 ms avg=1.19 ms (16 runs sampled)\r\nwriteSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.60/2.30/2.30 ms avg=1.61 ms (7 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 0) 50/75/90/95%=8.40/9.00/9.80/27.00 ms avg=10.02 ms (19 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 1) 50/75/90/95%=14.50/15.40/17.30/38.90 ms avg=17.08 ms (19 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 2) 50/75/90/95%=19.40/19.70/23.00/50.50 ms avg=22.72 ms (19 runs sampled)\r\npopulate 1024x10000 (clean, indexes: 0) 50/75/90/95%=48.10/63.00/77.00/77.00 ms avg=64.46 ms (8 runs sampled)\r\npopulate 1024x10000 (clean, indexes: 1) 50/75/90/95%=108.20/112.90/131.20/131.20 ms avg=141.17 ms (7 runs sampled)\r\npopulate 1024x10000 (clean, indexes: 2) 50/75/90/95%=157.60/184.90/193.20/193.20 ms avg=212.33 ms (7 runs sampled)\r\nscan 1024x1000 50/75/90/95%=0.90/1.10/1.50/1.70 ms avg=0.97 ms (19 runs sampled)\r\nscan 1024x10000 50/75/90/95%=6.40/6.60/8.90/10.60 ms avg=7.39 ms (19 runs sampled)\r\ncreate index with definition 1024x5000 50/75/90/95%=106.10/110.30/117.40/117.40 ms avg=136.41 ms (7 runs sampled)\r\ncreate index 1024x5000 50/75/90/95%=25.60/25.90/27.60/35.50 ms avg=28.88 ms (18 runs sampled)\r\nstartup read 1024x100 from 1024x100000 stored 50/75/90/95%=62.50/72.00/78.60/78.60 ms avg=62.75 ms (8 runs sampled)\r\nstartup scan 1024x100 from 1024x100000 stored 50/75/90/95%=13.90/29.70/60.60/61.80 ms avg=19.83 ms (19 runs sampled)\r\npersist 1024x1000 (indexes: 0) 50/75/90/95%=138.80/279.90/321.00/321.00 ms avg=220.87 ms (7 runs sampled)\r\npersist 1024x1000 (indexes: 1) 50/75/90/95%=172.50/173.70/174.10/174.10 ms avg=206.10 ms (7 runs sampled)\r\npersist 1024x1000 (indexes: 2) 50/75/90/95%=221.70/228.80/239.40/239.40 ms avg=273.63 ms (7 runs sampled)\r\npersist 1024x10000 (indexes: 0) 50/75/90/95%=535.60/555.70/559.10/559.10 ms avg=669.63 ms (7 runs sampled)\r\npersist 1024x10000 (indexes: 1) 50/75/90/95%=2181.70/2272.90/2455.40/2455.40 ms avg=2773.53 ms (7 runs sampled)\r\npersist 1024x10000 (indexes: 2) 50/75/90/95%=3795.40/3803.40/3887.80/3887.80 ms avg=4749.53 ms (7 runs sampled)\r\npopulate tmcw 50/75/90/95%=86.30/122.10/128.10/128.10 ms avg=120.94 ms (7 runs sampled)\r\npersist tmcw 50/75/90/95%=273.60/279.50/288.30/288.30 ms avg=346.84 ms (7 runs sampled)\r\nDone!\r\n```\r\n\r\n**Without this change**\r\n```\r\ngreg replicache-internal [main]$ npm run perf -- --format replicache\r\n\r\n> replicache@11.3.2 perf\r\n> npm run build-perf && node perf/runner.js \"--format\" \"replicache\"\r\n\r\n\r\n> replicache@11.3.2 build-perf\r\n> node tool/build.mjs --perf\r\n\r\nRunning 24 benchmarks on Chromium...\r\nwriteSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.90/1.00/1.20/1.80 ms avg=1.01 ms (19 runs sampled)\r\nwriteSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=0.90/1.00/1.20/1.20 ms avg=1.01 ms (19 runs sampled)\r\nwriteSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.60/2.60 ms avg=1.35 ms (13 runs sampled)\r\nwriteSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.40/1.50/2.70/2.70 ms avg=1.84 ms (7 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 0) 50/75/90/95%=12.20/13.20/14.20/20.80 ms avg=14.04 ms (19 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 1) 50/75/90/95%=22.40/23.50/30.10/31.70 ms avg=25.38 ms (19 runs sampled)\r\npopulate 1024x1000 (clean, indexes: 2) 50/75/90/95%=29.00/33.20/38.30/39.40 ms avg=34.29 ms (15 runs sampled)\r\npopulate 1024x10000 (clean, indexes: 0) 50/75/90/95%=92.00/102.10/112.90/112.90 ms avg=113.06 ms (7 runs sampled)\r\npopulate 1024x10000 (clean, indexes: 1) 50/75/90/95%=185.30/227.30/232.20/232.20 ms avg=250.87 ms (7 runs sampled)\r\npopulate 1024x10000 (clean, indexes: 2) 50/75/90/95%=274.30/311.50/320.50/320.50 ms avg=358.77 ms (7 runs sampled)\r\nscan 1024x1000 50/75/90/95%=0.80/1.00/1.50/1.70 ms avg=0.92 ms (19 runs sampled)\r\nscan 1024x10000 50/75/90/95%=6.60/6.70/8.50/10.10 ms avg=7.56 ms (19 runs sampled)\r\ncreate index with definition 1024x5000 50/75/90/95%=128.90/138.80/150.20/150.20 ms avg=168.14 ms (7 runs sampled)\r\ncreate index 1024x5000 50/75/90/95%=44.00/45.50/51.50/51.50 ms avg=52.19 ms (10 runs sampled)\r\nstartup read 1024x100 from 1024x100000 stored 50/75/90/95%=71.20/81.80/86.20/86.20 ms avg=71.51 ms (7 runs sampled)\r\nstartup scan 1024x100 from 1024x100000 stored 50/75/90/95%=18.60/31.40/49.10/59.10 ms avg=22.87 ms (19 runs sampled)\r\npersist 1024x1000 (indexes: 0) 50/75/90/95%=126.10/147.50/269.70/269.70 ms avg=175.93 ms (7 runs sampled)\r\npersist 1024x1000 (indexes: 1) 50/75/90/95%=161.50/164.70/166.30/166.30 ms avg=194.30 ms (7 runs sampled)\r\npersist 1024x1000 (indexes: 2) 50/75/90/95%=228.00/232.30/295.00/295.00 ms avg=284.03 ms (7 runs sampled)\r\npersist 1024x10000 (indexes: 0) 50/75/90/95%=508.90/525.40/528.60/528.60 ms avg=649.40 ms (7 runs sampled)\r\npersist 1024x10000 (indexes: 1) 50/75/90/95%=2227.50/2280.20/2305.50/2305.50 ms avg=2793.11 ms (7 runs sampled)\r\npersist 1024x10000 (indexes: 2) 50/75/90/95%=3997.90/4024.00/4033.50/4033.50 ms avg=5055.93 ms (7 runs sampled)\r\npopulate tmcw 50/75/90/95%=109.90/150.10/150.90/150.90 ms avg=156.03 ms (7 runs sampled)\r\npersist tmcw 50/75/90/95%=259.90/262.20/268.20/268.20 ms avg=333.47 ms (7 runs sampled)\r\nDone!\r\n```",
          "timestamp": "2022-10-27T10:39:48-07:00",
          "tree_id": "94146fe44a67dad5dff9b2409813198b8b6710c0",
          "url": "https://github.com/rocicorp/replicache-internal/commit/217116d77f291ce166207919758a9e400f29a3d4"
        },
        "date": 1666892465233,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187602,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33734,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79488,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23079,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "795941916af39d5a8d9c9dd8ec9f3abba9e5b2cd",
          "message": "Move BYOB doc up to top",
          "timestamp": "2022-10-30T18:39:01-10:00",
          "tree_id": "4170dcc2c3dfea1dcb254cd7084048f50fbea1a1",
          "url": "https://github.com/rocicorp/replicache-internal/commit/795941916af39d5a8d9c9dd8ec9f3abba9e5b2cd"
        },
        "date": 1667191197282,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187602,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33734,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79488,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23079,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "b1716fcf0526ad72b8806fdbe88a3865aac63be6",
          "message": "doc: cleanup",
          "timestamp": "2022-10-30T20:57:51-10:00",
          "tree_id": "6dd4c7de9537aab6693213752a20ef8351f4a5a3",
          "url": "https://github.com/rocicorp/replicache-internal/commit/b1716fcf0526ad72b8806fdbe88a3865aac63be6"
        },
        "date": 1667199761221,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187602,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33734,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79488,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23079,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "committer": {
            "email": "aaron@aaronboodman.com",
            "name": "Aaron Boodman",
            "username": "aboodman"
          },
          "distinct": true,
          "id": "9ea174723ab06d3ddc2214154e6b208868910bcd",
          "message": "doc: remove now-unnecessary duplicate paragraph about sharing mutations",
          "timestamp": "2022-10-30T22:57:58-10:00",
          "tree_id": "1eb6165162e9c14ca045a95ee20b0ef367f66ce4",
          "url": "https://github.com/rocicorp/replicache-internal/commit/9ea174723ab06d3ddc2214154e6b208868910bcd"
        },
        "date": 1667206748037,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 187602,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 33734,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 186456,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33437,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 79488,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23079,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "59ab943174bdd9a94e58faba8a3c85a4e1cf4be7",
          "message": "feat(dd31): Schedule refresh after persit on same branch (#326)\n\nUse BroadcastChannel to notify other clients when persist has happened and on which branch.\r\nA client schedules a refresh when it is notified of a persist on it's branch.\r\n\r\nCreate a new `ProcessScheduler` utility and use it for scheduling both refresh and persist.",
          "timestamp": "2022-10-31T09:37:01-07:00",
          "tree_id": "72070be2f8be7dc9ee3f107673c4c90b5c73a535",
          "url": "https://github.com/rocicorp/replicache-internal/commit/59ab943174bdd9a94e58faba8a3c85a4e1cf4be7"
        },
        "date": 1667234295278,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 200050,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 198904,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35145,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 83878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 24183,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "cesar@roci.dev",
            "name": "Cesar Alaestante",
            "username": "cesara"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2a6e7404ab457940de2a7f1429839ddcc7941a58",
          "message": "doc: revert to previous nextjs quickstart commands (#342)",
          "timestamp": "2022-10-31T12:09:52-07:00",
          "tree_id": "89a36eebf5d41efbfe12e928a04d84941161d078",
          "url": "https://github.com/rocicorp/replicache-internal/commit/2a6e7404ab457940de2a7f1429839ddcc7941a58"
        },
        "date": 1667243460599,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 200050,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 35463,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 198904,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 35145,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 83878,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 24183,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f7267ddc97ce74757a54c480325d9c4005353688",
          "message": "fix: Reduce bundle size impact of refresh scheduling change (#343)\n\n59ab943174bdd9a94e58faba8a3c85a4e1cf4be7 increased compressed bundle size by about 1000 bytes.\r\n\r\nReduce by deduping some logging code and ensuring refresh code is stripped when DD31 is false.\r\n\r\nPerf alert from 59ab943174bdd9a94e58faba8a3c85a4e1cf4be7\r\n=======\r\n\r\n<img width=\"751\" alt=\"image\" src=\"https://user-images.githubusercontent.com/19158916/199114049-c484018d-bbd2-4b9f-8ae8-84e4f8ba132e.png\">\r\n\r\nSizes with this change\r\n======\r\n```\r\ngreg replicache-internal [grgbkr/refresh-scheduler-dd31-gate]$ node perf/bundle-sizes --bundles replicache.js replicache.js.br replicache.mjs replicache.mjs.br replicache.min.mjs replicache.min.mjs.br\r\n[\r\n  {\r\n    \"name\": \"Size of replicache.js\",\r\n    \"unit\": \"bytes\",\r\n    \"value\": 191774\r\n  },\r\n  {\r\n    \"name\": \"Size of replicache.js.br (Brotli compressed)\",\r\n    \"unit\": \"bytes\",\r\n    \"value\": 34315\r\n  },\r\n  {\r\n    \"name\": \"Size of replicache.mjs\",\r\n    \"unit\": \"bytes\",\r\n    \"value\": 190628\r\n  },\r\n  {\r\n    \"name\": \"Size of replicache.mjs.br (Brotli compressed)\",\r\n    \"unit\": \"bytes\",\r\n    \"value\": 33997\r\n  },\r\n  {\r\n    \"name\": \"Size of replicache.min.mjs\",\r\n    \"unit\": \"bytes\",\r\n    \"value\": 80754\r\n  },\r\n  {\r\n    \"name\": \"Size of replicache.min.mjs.br (Brotli compressed)\",\r\n    \"unit\": \"bytes\",\r\n    \"value\": 23450\r\n  }\r\n]\r\n```",
          "timestamp": "2022-10-31T14:43:31-07:00",
          "tree_id": "08890ba859fdfa6ca9bc75c2ca1a347be0a34346",
          "url": "https://github.com/rocicorp/replicache-internal/commit/f7267ddc97ce74757a54c480325d9c4005353688"
        },
        "date": 1667252686241,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 191774,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34315,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190628,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33997,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80754,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23450,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "greg@roci.dev",
            "name": "Greg Baker",
            "username": "grgbkr"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "36a11aaeb3d1f18e622a051fbf499022eb75dbf2",
          "message": "chore: arv review feedback on refresh scheduling (#341)\n\nFeedback from https://github.com/rocicorp/replicache-internal/pull/326",
          "timestamp": "2022-11-01T09:32:41-07:00",
          "tree_id": "38639a53db4421b4c2d0ac255b23909f70a66d19",
          "url": "https://github.com/rocicorp/replicache-internal/commit/36a11aaeb3d1f18e622a051fbf499022eb75dbf2"
        },
        "date": 1667320430666,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 191800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190654,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33998,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23472,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "fe030920b926426090036479cb945c673ac6cd6f",
          "message": "chore: Add a perf smoke test (#347)\n\nThis runs a single replicache perf test. This does not in use the github-action-benchmark. If the test harness breaks this will fail as expected. The goal of this is to run this on PRs and prevent merging PRs that would break the perf test bot.",
          "timestamp": "2022-11-02T14:08:31Z",
          "tree_id": "82cbc3728032cf2a85ac7880cac8eff3a4ed9192",
          "url": "https://github.com/rocicorp/replicache-internal/commit/fe030920b926426090036479cb945c673ac6cd6f"
        },
        "date": 1667398168825,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 191800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190654,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33998,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23472,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "c42e5e10aa1a4a9a6009e2566c7ebd72bd42d654",
          "message": "chore: Cache Playwright for js test too (#348)",
          "timestamp": "2022-11-02T14:17:54Z",
          "tree_id": "f1dc429a0df39df0f6980b2e7525694ae989d801",
          "url": "https://github.com/rocicorp/replicache-internal/commit/c42e5e10aa1a4a9a6009e2566c7ebd72bd42d654"
        },
        "date": 1667398750114,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 191800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190654,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33998,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23472,
            "unit": "bytes"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "erik.arvidsson@gmail.com",
            "name": "Erik Arvidsson",
            "username": "arv"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "4af18b023c205bff5da93e7454e7b693f2fb2fdd",
          "message": "chore: Upload sourcemaps for tagged releases (#349)\n\nTowards #325",
          "timestamp": "2022-11-02T15:41:36+01:00",
          "tree_id": "d93efee92886da57cb1aea335203f23b329c818e",
          "url": "https://github.com/rocicorp/replicache-internal/commit/4af18b023c205bff5da93e7454e7b693f2fb2fdd"
        },
        "date": 1667400153592,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Size of replicache.js",
            "value": 191800,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.js.br (Brotli compressed)",
            "value": 34299,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs",
            "value": 190654,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.mjs.br (Brotli compressed)",
            "value": 33998,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs",
            "value": 80764,
            "unit": "bytes"
          },
          {
            "name": "Size of replicache.min.mjs.br (Brotli compressed)",
            "value": 23472,
            "unit": "bytes"
          }
        ]
      }
    ]
  }
}
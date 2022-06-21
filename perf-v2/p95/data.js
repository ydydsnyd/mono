window.BENCHMARK_DATA = {
  "lastUpdate": 1655810364491,
  "repoUrl": "https://github.com/rocicorp/replicache-internal",
  "entries": {
    "Benchmark": [
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
        "date": 1655477276407,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.5999999046325684,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.50/2.80/3.60 ms avg=1.60 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.1000001430511475,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.40/4.10/4.50/5.10 ms avg=3.07 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±2.3%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/4.70/5.50/5.50 ms avg=4.31 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.700000047683716,
            "unit": "p95 ms",
            "range": "±18.3%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.70/21.70/21.70 ms avg=7.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 81.09999990463257,
            "unit": "p95 ms",
            "range": "±46.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.20/39.10/44.10/81.10 ms avg=43.66 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 96.20000004768372,
            "unit": "p95 ms",
            "range": "±54.1%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.10/49.50/96.20/96.20 ms avg=58.50 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 99.79999995231628,
            "unit": "p95 ms",
            "range": "±24.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=74.90/75.90/99.80/99.80 ms avg=89.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 365.69999980926514,
            "unit": "p95 ms",
            "range": "±61.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=304.30/334.50/365.70/365.70 ms avg=401.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 653.4000000953674,
            "unit": "p95 ms",
            "range": "±55.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=598.30/609.00/653.40/653.40 ms avg=767.94 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 917.2999999523163,
            "unit": "p95 ms",
            "range": "±96.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=820.50/840.60/917.30/917.30 ms avg=1060.23 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.299999952316284,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.80/4.90/5.30 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.09999990463257,
            "unit": "p95 ms",
            "range": "±7.7%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.80/22.40/24.10 ms avg=18.75 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 143.79999995231628,
            "unit": "p95 ms",
            "range": "±31.4%",
            "extra": "create index 1024x5000 50/75/90/95%=112.40/120.90/143.80/143.80 ms avg=149.49 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 151.79999995231628,
            "unit": "p95 ms",
            "range": "±12.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=139.40/148.60/151.80/151.80 ms avg=178.14 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.90000009536743,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.70/36.70/38.90/38.90 ms avg=39.18 ms (13 runs sampled)"
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
        "date": 1655757187494,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.700000047683716,
            "unit": "p95 ms",
            "range": "±2.5%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.50/2.90/3.70 ms avg=1.58 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.3999998569488525,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.60/5.00/5.40 ms avg=2.82 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8,
            "unit": "p95 ms",
            "range": "±4.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/5.50/8.00/8.00 ms avg=5.13 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.700000047683716,
            "unit": "p95 ms",
            "range": "±19.4%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.20/22.70/22.70 ms avg=7.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 79.60000014305115,
            "unit": "p95 ms",
            "range": "±46.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.30/40.30/43.70/79.60 ms avg=42.94 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 104.80000019073486,
            "unit": "p95 ms",
            "range": "±58.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=46.40/55.60/104.80/104.80 ms avg=62.85 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 125.79999995231628,
            "unit": "p95 ms",
            "range": "±65.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.20/75.50/125.80/125.80 ms avg=88.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 357.2000000476837,
            "unit": "p95 ms",
            "range": "±39.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=318.10/331.10/357.20/357.20 ms avg=407.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 669.3999998569489,
            "unit": "p95 ms",
            "range": "±83.4%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=586.00/602.20/669.40/669.40 ms avg=757.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 902.0999999046326,
            "unit": "p95 ms",
            "range": "±66.9%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=835.20/840.70/902.10/902.10 ms avg=1068.36 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.799999952316284,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.70/4.70/4.80 ms avg=2.52 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.700000047683716,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=17.10/17.50/23.60/23.70 ms avg=19.38 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 141.5,
            "unit": "p95 ms",
            "range": "±33.6%",
            "extra": "create index 1024x5000 50/75/90/95%=107.90/116.30/141.50/141.50 ms avg=142.33 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 151.5,
            "unit": "p95 ms",
            "range": "±10.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=141.30/144.30/151.50/151.50 ms avg=177.61 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.700000047683716,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.80/37.00/37.50/38.70 ms avg=38.98 ms (13 runs sampled)"
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
        "date": 1655758080261,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.299999952316284,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.60/3.30 ms avg=1.41 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.699999809265137,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.70/4.60/4.70 ms avg=2.61 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.900000095367432,
            "unit": "p95 ms",
            "range": "±6.1%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/5.50/8.90/8.90 ms avg=5.10 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.299999952316284,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.60/22.30/22.30 ms avg=7.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 108.30000019073486,
            "unit": "p95 ms",
            "range": "±76.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.70/37.10/40.50/108.30 ms avg=44.00 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 108.59999990463257,
            "unit": "p95 ms",
            "range": "±68.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.20/47.20/108.60/108.60 ms avg=58.57 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 125,
            "unit": "p95 ms",
            "range": "±65.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.50/73.50/125.00/125.00 ms avg=87.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.09999990463257,
            "unit": "p95 ms",
            "range": "±59.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=296.90/322.70/356.10/356.10 ms avg=391.40 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 652.8999998569489,
            "unit": "p95 ms",
            "range": "±76.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=576.70/599.70/652.90/652.90 ms avg=750.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 930.7000000476837,
            "unit": "p95 ms",
            "range": "±112.2%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=818.50/855.20/930.70/930.70 ms avg=1064.66 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.200000047683716,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.70/4.60/5.20 ms avg=2.57 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.800000190734863,
            "unit": "p95 ms",
            "range": "±6.4%",
            "extra": "scan 1024x10000 50/75/90/95%=17.40/17.70/21.80/23.80 ms avg=19.63 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.10000014305115,
            "unit": "p95 ms",
            "range": "±25.6%",
            "extra": "create index 1024x5000 50/75/90/95%=110.50/122.40/136.10/136.10 ms avg=146.04 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 153.09999990463257,
            "unit": "p95 ms",
            "range": "±15.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=137.40/142.00/153.10/153.10 ms avg=175.81 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 44,
            "unit": "p95 ms",
            "range": "±8.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.40/38.30/42.70/44.00 ms avg=40.73 ms (13 runs sampled)"
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
        "date": 1655810364055,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.200000047683716,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.30/1.50/1.70/3.20 ms avg=1.45 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.70/4.60/4.90 ms avg=2.68 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.599999904632568,
            "unit": "p95 ms",
            "range": "±6.5%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.00/9.60/9.60 ms avg=5.13 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.799999952316284,
            "unit": "p95 ms",
            "range": "±19.3%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/7.00/22.80/22.80 ms avg=7.30 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 109.60000014305115,
            "unit": "p95 ms",
            "range": "±77.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.10/35.30/48.30/109.60 ms avg=46.26 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 112.39999985694885,
            "unit": "p95 ms",
            "range": "±71.7%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.70/47.00/112.40/112.40 ms avg=59.26 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 129.60000014305115,
            "unit": "p95 ms",
            "range": "±68.7%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.90/68.80/129.60/129.60 ms avg=87.80 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 357.2999999523163,
            "unit": "p95 ms",
            "range": "±59.9%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.40/315.30/357.30/357.30 ms avg=390.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 631.0999999046326,
            "unit": "p95 ms",
            "range": "±57.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=573.50/585.60/631.10/631.10 ms avg=735.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 864.2999999523163,
            "unit": "p95 ms",
            "range": "±77.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=786.60/854.80/864.30/864.30 ms avg=1026.66 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.70/5.50 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.799999952316284,
            "unit": "p95 ms",
            "range": "±7.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.90/22.90/23.80 ms avg=18.77 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 137.89999985694885,
            "unit": "p95 ms",
            "range": "±27.7%",
            "extra": "create index 1024x5000 50/75/90/95%=110.20/117.80/137.90/137.90 ms avg=143.10 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 148.79999995231628,
            "unit": "p95 ms",
            "range": "±10.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.10/139.70/148.80/148.80 ms avg=175.91 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.799999952316284,
            "unit": "p95 ms",
            "range": "±5.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.10/35.50/38.40/38.80 ms avg=37.41 ms (14 runs sampled)"
          }
        ]
      }
    ]
  }
}
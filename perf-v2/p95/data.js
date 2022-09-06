window.BENCHMARK_DATA = {
  "lastUpdate": 1662454335763,
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
        "date": 1655899006960,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.0999999046325684,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.60/3.10 ms avg=1.39 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.30/2.90/4.80/4.90 ms avg=2.83 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.5,
            "unit": "p95 ms",
            "range": "±5.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/6.70/8.50/8.50 ms avg=5.11 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999990463257,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.60/6.30/22.10/22.10 ms avg=7.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 114,
            "unit": "p95 ms",
            "range": "±82.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.30/36.30/49.20/114.00 ms avg=46.45 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 108.20000004768372,
            "unit": "p95 ms",
            "range": "±67.9%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.30/47.70/108.20/108.20 ms avg=58.73 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 124.39999985694885,
            "unit": "p95 ms",
            "range": "±61.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.50/72.60/124.40/124.40 ms avg=88.99 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 367.89999985694885,
            "unit": "p95 ms",
            "range": "±71.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=296.80/327.80/367.90/367.90 ms avg=392.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 681.5,
            "unit": "p95 ms",
            "range": "±92.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=589.20/604.80/681.50/681.50 ms avg=764.31 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 904,
            "unit": "p95 ms",
            "range": "±91.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=812.60/828.20/904.00/904.00 ms avg=1052.34 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.799999952316284,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.60/2.80/6.80 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.899999856948853,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.90/17.40/22.50/23.90 ms avg=19.25 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 144.5,
            "unit": "p95 ms",
            "range": "±35.5%",
            "extra": "create index 1024x5000 50/75/90/95%=109.00/119.60/144.50/144.50 ms avg=145.00 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.29999995231628,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=140.90/141.80/145.30/145.30 ms avg=176.53 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.10/34.50/37.40/39.00 ms avg=37.14 ms (14 runs sampled)"
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
        "date": 1655900062158,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.50/2.80/3.00 ms avg=1.40 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.50/4.90/5.30 ms avg=2.54 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.700000047683716,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/4.90/5.70/5.70 ms avg=4.56 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.59999990463257,
            "unit": "p95 ms",
            "range": "±18.4%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.80/21.60/21.60 ms avg=7.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 109.90000009536743,
            "unit": "p95 ms",
            "range": "±78.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.40/33.80/47.10/109.90 ms avg=44.18 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 110.79999995231628,
            "unit": "p95 ms",
            "range": "±70.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.30/46.40/110.80/110.80 ms avg=59.26 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 131.59999990463257,
            "unit": "p95 ms",
            "range": "±71.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.00/74.40/131.60/131.60 ms avg=88.81 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.80000019073486,
            "unit": "p95 ms",
            "range": "±59.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.60/328.90/356.80/356.80 ms avg=391.66 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 644.1000001430511,
            "unit": "p95 ms",
            "range": "±66.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=577.50/593.60/644.10/644.10 ms avg=742.04 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 905.9000000953674,
            "unit": "p95 ms",
            "range": "±100.0%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=805.90/821.00/905.90/905.90 ms avg=1038.93 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 7.200000047683716,
            "unit": "p95 ms",
            "range": "±5.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.70/3.10/7.20 ms avg=2.58 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 25,
            "unit": "p95 ms",
            "range": "±8.5%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/16.90/22.40/25.00 ms avg=18.85 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 134.70000004768372,
            "unit": "p95 ms",
            "range": "±23.8%",
            "extra": "create index 1024x5000 50/75/90/95%=110.90/117.50/134.70/134.70 ms avg=143.60 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146.5,
            "unit": "p95 ms",
            "range": "±13.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=133.10/140.20/146.50/146.50 ms avg=172.33 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 40,
            "unit": "p95 ms",
            "range": "±6.1%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.90/36.10/38.20/40.00 ms avg=37.62 ms (14 runs sampled)"
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
        "date": 1655935410647,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000001430511475,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.60/3.10 ms avg=1.34 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.099999904632568,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/5.00/5.10 ms avg=2.59 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.100000143051147,
            "unit": "p95 ms",
            "range": "±5.0%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.40/8.10/8.10 ms avg=5.11 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.200000047683716,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/6.00/22.20/22.20 ms avg=7.30 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 76.20000004768372,
            "unit": "p95 ms",
            "range": "±42.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.20/38.30/40.90/76.20 ms avg=42.40 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 100.5,
            "unit": "p95 ms",
            "range": "±50.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=49.90/56.10/100.50/100.50 ms avg=63.65 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 100.29999995231628,
            "unit": "p95 ms",
            "range": "±39.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.10/79.80/100.30/100.30 ms avg=85.33 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 363.09999990463257,
            "unit": "p95 ms",
            "range": "±64.9%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=298.20/320.80/363.10/363.10 ms avg=389.64 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 688.1000001430511,
            "unit": "p95 ms",
            "range": "±98.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=589.90/609.10/688.10/688.10 ms avg=767.50 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 889.7999999523163,
            "unit": "p95 ms",
            "range": "±78.2%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=811.60/825.70/889.80/889.80 ms avg=1047.03 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.200000047683716,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.50/4.80/5.20 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.5,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/16.80/21.70/23.50 ms avg=18.75 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142.09999990463257,
            "unit": "p95 ms",
            "range": "±32.5%",
            "extra": "create index 1024x5000 50/75/90/95%=109.60/117.90/142.10/142.10 ms avg=144.97 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 155.29999995231628,
            "unit": "p95 ms",
            "range": "±15.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=139.40/146.80/155.30/155.30 ms avg=180.00 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.60000014305115,
            "unit": "p95 ms",
            "range": "±4.1%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.50/36.10/38.20/38.60 ms avg=38.47 ms (13 runs sampled)"
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
        "date": 1655937334773,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/3.00/3.00 ms avg=1.46 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.700000047683716,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.20/4.50/4.70 ms avg=2.50 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.599999904632568,
            "unit": "p95 ms",
            "range": "±5.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/6.00/8.60/8.60 ms avg=5.00 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±19.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/6.70/23.00/23.00 ms avg=7.34 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 80.90000009536743,
            "unit": "p95 ms",
            "range": "±46.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.80/37.40/39.70/80.90 ms avg=43.13 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 75.90000009536743,
            "unit": "p95 ms",
            "range": "±32.9%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.00/51.50/75.90/75.90 ms avg=56.77 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 123,
            "unit": "p95 ms",
            "range": "±59.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=63.80/78.90/123.00/123.00 ms avg=91.47 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 359.39999985694885,
            "unit": "p95 ms",
            "range": "±59.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=300.10/327.30/359.40/359.40 ms avg=392.54 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 649.2000000476837,
            "unit": "p95 ms",
            "range": "±73.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=575.60/604.30/649.20/649.20 ms avg=748.96 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 910.9000000953674,
            "unit": "p95 ms",
            "range": "±100.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=810.50/829.40/910.90/910.90 ms avg=1047.33 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.400000095367432,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.70/2.80/6.40 ms avg=2.46 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±6.7%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.70/21.90/23.00 ms avg=18.53 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 139,
            "unit": "p95 ms",
            "range": "±30.5%",
            "extra": "create index 1024x5000 50/75/90/95%=108.50/116.10/139.00/139.00 ms avg=143.43 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.40000009536743,
            "unit": "p95 ms",
            "range": "±9.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.50/139.00/145.40/145.40 ms avg=172.59 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 40.09999990463257,
            "unit": "p95 ms",
            "range": "±6.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.60/35.40/39.50/40.10 ms avg=37.76 ms (14 runs sampled)"
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
        "date": 1655961461279,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000001430511475,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.80/3.10 ms avg=1.44 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/5.00/5.50 ms avg=2.60 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.799999952316284,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.20/5.80/5.80 ms avg=4.40 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.200000047683716,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.30/22.20/22.20 ms avg=7.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 107.70000004768372,
            "unit": "p95 ms",
            "range": "±76.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.20/33.30/40.20/107.70 ms avg=43.34 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 101.09999990463257,
            "unit": "p95 ms",
            "range": "±54.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=47.10/55.70/101.10/101.10 ms avg=63.16 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 101.40000009536743,
            "unit": "p95 ms",
            "range": "±41.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.10/76.70/101.40/101.40 ms avg=84.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 363.7999999523163,
            "unit": "p95 ms",
            "range": "±53.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=310.50/328.80/363.80/363.80 ms avg=398.61 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 658.5,
            "unit": "p95 ms",
            "range": "±68.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=590.20/601.40/658.50/658.50 ms avg=756.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 893.5999999046326,
            "unit": "p95 ms",
            "range": "±94.3%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=799.30/806.60/893.60/893.60 ms avg=1033.39 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 40,
            "unit": "p95 ms",
            "range": "±38.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.50/4.70/40.00 ms avg=4.32 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 22.90000009536743,
            "unit": "p95 ms",
            "range": "±6.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/17.00/22.60/22.90 ms avg=18.85 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 139.59999990463257,
            "unit": "p95 ms",
            "range": "±26.2%",
            "extra": "create index 1024x5000 50/75/90/95%=113.40/117.50/139.60/139.60 ms avg=146.90 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 151.30000019073486,
            "unit": "p95 ms",
            "range": "±15.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.00/145.60/151.30/151.30 ms avg=174.73 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41,
            "unit": "p95 ms",
            "range": "±5.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.50/35.90/37.10/41.00 ms avg=39.30 ms (13 runs sampled)"
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
        "date": 1655961627214,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.90/3.00 ms avg=1.42 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.20/2.90/5.10/5.30 ms avg=2.94 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.900000095367432,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/5.30/5.90/5.90 ms avg=4.49 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.700000047683716,
            "unit": "p95 ms",
            "range": "±18.3%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.60/21.70/21.70 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 80.20000004768372,
            "unit": "p95 ms",
            "range": "±44.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.30/36.90/37.80/80.20 ms avg=42.68 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 75.79999995231628,
            "unit": "p95 ms",
            "range": "±34.1%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.70/52.50/75.80/75.80 ms avg=56.23 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 98.29999995231628,
            "unit": "p95 ms",
            "range": "±37.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.10/75.00/98.30/98.30 ms avg=84.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 360.40000009536743,
            "unit": "p95 ms",
            "range": "±62.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.60/320.30/360.40/360.40 ms avg=390.83 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 638.1000001430511,
            "unit": "p95 ms",
            "range": "±58.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=579.60/593.40/638.10/638.10 ms avg=749.67 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 878.5999999046326,
            "unit": "p95 ms",
            "range": "±74.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=803.90/853.80/878.60/878.60 ms avg=1040.06 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.1000001430511475,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.80/5.10 ms avg=2.53 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.700000047683716,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.80/23.30/23.70 ms avg=18.69 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142.59999990463257,
            "unit": "p95 ms",
            "range": "±34.9%",
            "extra": "create index 1024x5000 50/75/90/95%=107.70/117.70/142.60/142.60 ms avg=143.84 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.70000004768372,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=140.00/144.70/145.70/145.70 ms avg=175.37 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.90000009536743,
            "unit": "p95 ms",
            "range": "±4.1%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.00/36.50/36.80/38.90 ms avg=39.01 ms (13 runs sampled)"
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
        "date": 1655961792282,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.299999952316284,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/3.10/3.30 ms avg=1.49 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/4.20/5.00 ms avg=2.55 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.400000095367432,
            "unit": "p95 ms",
            "range": "±2.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/5.10/5.40/5.40 ms avg=4.43 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.800000190734863,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.50/21.80/21.80 ms avg=7.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 107.5,
            "unit": "p95 ms",
            "range": "±76.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.40/34.80/38.90/107.50 ms avg=43.16 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 99.59999990463257,
            "unit": "p95 ms",
            "range": "±58.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.00/45.60/99.60/99.60 ms avg=57.61 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 99.70000004768372,
            "unit": "p95 ms",
            "range": "±39.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.90/75.20/99.70/99.70 ms avg=83.41 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 354.59999990463257,
            "unit": "p95 ms",
            "range": "±53.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.20/326.00/354.60/354.60 ms avg=398.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 641.5999999046326,
            "unit": "p95 ms",
            "range": "±65.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=576.40/596.80/641.60/641.60 ms avg=746.29 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 885.2000000476837,
            "unit": "p95 ms",
            "range": "±95.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=789.40/814.20/885.20/885.20 ms avg=1025.14 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.50/4.70/4.80 ms avg=2.42 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.199999809265137,
            "unit": "p95 ms",
            "range": "±7.7%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/17.00/22.40/24.20 ms avg=18.86 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.40000009536743,
            "unit": "p95 ms",
            "range": "±28.1%",
            "extra": "create index 1024x5000 50/75/90/95%=108.30/123.70/136.40/136.40 ms avg=143.76 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.09999990463257,
            "unit": "p95 ms",
            "range": "±14.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=130.90/138.00/145.10/145.10 ms avg=168.10 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.5,
            "unit": "p95 ms",
            "range": "±6.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.00/36.00/37.80/39.50 ms avg=37.72 ms (14 runs sampled)"
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
        "date": 1655961957559,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999998569488525,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.50/2.90 ms avg=1.33 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.30/4.60/5.00 ms avg=2.58 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.099999904632568,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/3.20/5.10/5.10 ms avg=3.97 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.4%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.60/6.60/22.00/22.00 ms avg=7.40 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 119.39999985694885,
            "unit": "p95 ms",
            "range": "±86.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.70/34.10/42.70/119.40 ms avg=46.69 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 131.40000009536743,
            "unit": "p95 ms",
            "range": "±89.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.40/58.10/131.40/131.40 ms avg=65.44 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 132.20000004768372,
            "unit": "p95 ms",
            "range": "±72.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.90/74.40/132.20/132.20 ms avg=89.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 585.6999998092651,
            "unit": "p95 ms",
            "range": "±257.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=328.10/370.90/585.70/585.70 ms avg=451.44 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 680.1000001430511,
            "unit": "p95 ms",
            "range": "±105.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=574.20/583.10/680.10/680.10 ms avg=745.77 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 905,
            "unit": "p95 ms",
            "range": "±92.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=812.30/818.70/905.00/905.00 ms avg=1048.03 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.099999904632568,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.80/5.10 ms avg=2.47 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 22.699999809265137,
            "unit": "p95 ms",
            "range": "±6.1%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/17.20/22.60/22.70 ms avg=18.89 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 144.90000009536743,
            "unit": "p95 ms",
            "range": "±35.2%",
            "extra": "create index 1024x5000 50/75/90/95%=109.70/120.50/144.90/144.90 ms avg=146.11 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 148.20000004768372,
            "unit": "p95 ms",
            "range": "±12.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.90/137.50/148.20/148.20 ms avg=169.33 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.200000047683716,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.60/37.00/38.60/39.20 ms avg=37.09 ms (14 runs sampled)"
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
        "date": 1655983223546,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.60/3.00 ms avg=1.39 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.50/4.70/5.30 ms avg=2.57 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.099999904632568,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.50/8.10/8.10 ms avg=4.90 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999990463257,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.60/22.10/22.10 ms avg=7.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 78.20000004768372,
            "unit": "p95 ms",
            "range": "±43.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.30/40.30/45.60/78.20 ms avg=43.50 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 104,
            "unit": "p95 ms",
            "range": "±58.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=46.00/60.80/104.00/104.00 ms avg=64.69 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 106.90000009536743,
            "unit": "p95 ms",
            "range": "±46.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.30/77.30/106.90/106.90 ms avg=85.93 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 362.39999985694885,
            "unit": "p95 ms",
            "range": "±59.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=303.10/335.40/362.40/362.40 ms avg=398.90 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 655.5999999046326,
            "unit": "p95 ms",
            "range": "±79.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=575.80/586.70/655.60/655.60 ms avg=749.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 908.9000000953674,
            "unit": "p95 ms",
            "range": "±106.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=802.40/856.80/908.90/908.90 ms avg=1045.81 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.3999998569488525,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.70/5.20/5.40 ms avg=2.53 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.70/17.00/23.80/24.00 ms avg=19.08 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.10000014305115,
            "unit": "p95 ms",
            "range": "±29.1%",
            "extra": "create index 1024x5000 50/75/90/95%=111.00/121.80/140.10/140.10 ms avg=147.04 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 149.70000004768372,
            "unit": "p95 ms",
            "range": "±11.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.70/144.90/149.70/149.70 ms avg=178.53 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.200000047683716,
            "unit": "p95 ms",
            "range": "±6.1%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.10/36.00/38.10/41.20 ms avg=39.44 ms (13 runs sampled)"
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
        "date": 1655983724250,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.200000047683716,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.90/3.20 ms avg=1.45 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.20/2.50/4.30/4.80 ms avg=2.55 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.800000190734863,
            "unit": "p95 ms",
            "range": "±5.9%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/6.90/8.80/8.80 ms avg=4.87 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.30/22.00/22.00 ms avg=7.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 112.39999985694885,
            "unit": "p95 ms",
            "range": "±79.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.50/34.40/42.00/112.40 ms avg=45.88 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 143.59999990463257,
            "unit": "p95 ms",
            "range": "±101.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.80/58.60/143.60/143.60 ms avg=66.99 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 135.10000014305115,
            "unit": "p95 ms",
            "range": "±70.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=64.50/74.50/135.10/135.10 ms avg=91.64 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 359.40000009536743,
            "unit": "p95 ms",
            "range": "±59.0%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=300.40/306.60/359.40/359.40 ms avg=392.36 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 688.0999999046326,
            "unit": "p95 ms",
            "range": "±114.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=573.90/586.80/688.10/688.10 ms avg=746.77 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 903.7000000476837,
            "unit": "p95 ms",
            "range": "±91.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=812.20/854.70/903.70/903.70 ms avg=1057.43 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.800000190734863,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.60/2.90/6.80 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "scan 1024x10000 50/75/90/95%=17.20/17.60/24.00/24.00 ms avg=19.58 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 145.29999995231628,
            "unit": "p95 ms",
            "range": "±35.1%",
            "extra": "create index 1024x5000 50/75/90/95%=110.20/122.20/145.30/145.30 ms avg=146.01 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 154.20000004768372,
            "unit": "p95 ms",
            "range": "±7.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=146.30/150.20/154.20/154.20 ms avg=185.86 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.299999952316284,
            "unit": "p95 ms",
            "range": "±4.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.30/36.30/37.50/38.30 ms avg=38.91 ms (13 runs sampled)"
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
        "date": 1655983980649,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.0999999046325684,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/1.50/3.10 ms avg=1.42 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/4.30/5.00 ms avg=2.58 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.900000095367432,
            "unit": "p95 ms",
            "range": "±2.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.70/4.90/5.90/5.90 ms avg=4.41 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.90000009536743,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/7.70/21.90/21.90 ms avg=7.93 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 77,
            "unit": "p95 ms",
            "range": "±42.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.10/41.90/43.10/77.00 ms avg=43.29 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 72.90000009536743,
            "unit": "p95 ms",
            "range": "±30.3%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.60/52.90/72.90/72.90 ms avg=57.07 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 98.59999990463257,
            "unit": "p95 ms",
            "range": "±39.0%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.60/78.00/98.60/98.60 ms avg=83.99 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 351.59999990463257,
            "unit": "p95 ms",
            "range": "±45.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=305.80/327.80/351.60/351.60 ms avg=398.24 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 650.7999999523163,
            "unit": "p95 ms",
            "range": "±55.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=595.00/603.40/650.80/650.80 ms avg=758.33 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 901.7999999523163,
            "unit": "p95 ms",
            "range": "±83.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=818.10/833.10/901.80/901.80 ms avg=1055.44 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.5,
            "unit": "p95 ms",
            "range": "±4.5%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.80/3.10/6.50 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.700000047683716,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "scan 1024x10000 50/75/90/95%=17.10/17.90/22.70/24.70 ms avg=19.43 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.69999980926514,
            "unit": "p95 ms",
            "range": "±34.5%",
            "extra": "create index 1024x5000 50/75/90/95%=106.20/115.00/140.70/140.70 ms avg=141.49 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 151,
            "unit": "p95 ms",
            "range": "±9.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=142.00/150.20/151.00/151.00 ms avg=180.56 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.40000009536743,
            "unit": "p95 ms",
            "range": "±4.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.00/35.10/35.70/38.40 ms avg=37.79 ms (14 runs sampled)"
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
        "date": 1656064366401,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.200000047683716,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.70/3.20 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.299999952316284,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.20/4.10/4.30 ms avg=2.49 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.799999952316284,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.40/5.80/5.80 ms avg=4.63 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.100000143051147,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.80/22.10/22.10 ms avg=7.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 83.59999990463257,
            "unit": "p95 ms",
            "range": "±49.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.10/40.10/41.60/83.60 ms avg=43.18 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 73.79999995231628,
            "unit": "p95 ms",
            "range": "±32.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.40/51.30/73.80/73.80 ms avg=53.88 ms (10 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 118.40000009536743,
            "unit": "p95 ms",
            "range": "±59.7%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.70/75.80/118.40/118.40 ms avg=85.44 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 355.2000000476837,
            "unit": "p95 ms",
            "range": "±58.0%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.20/313.80/355.20/355.20 ms avg=389.04 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 657.7000000476837,
            "unit": "p95 ms",
            "range": "±91.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=566.60/583.30/657.70/657.70 ms avg=739.46 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 877.4000000953674,
            "unit": "p95 ms",
            "range": "±81.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=795.60/809.20/877.40/877.40 ms avg=1029.20 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 27.40000009536743,
            "unit": "p95 ms",
            "range": "±25.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.40/2.90/6.90/27.40 ms avg=4.00 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.90000009536743,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "scan 1024x10000 50/75/90/95%=17.00/17.60/22.10/23.90 ms avg=19.23 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 138.90000009536743,
            "unit": "p95 ms",
            "range": "±28.8%",
            "extra": "create index 1024x5000 50/75/90/95%=110.10/114.70/138.90/138.90 ms avg=145.07 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 148.89999985694885,
            "unit": "p95 ms",
            "range": "±12.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.30/140.30/148.90/148.90 ms avg=174.30 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.60000014305115,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.70/34.50/38.20/38.60 ms avg=37.74 ms (14 runs sampled)"
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
        "date": 1656065786699,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.200000047683716,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.50/2.90/3.20 ms avg=1.46 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.5,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.20/4.40/4.50 ms avg=2.52 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 7.799999952316284,
            "unit": "p95 ms",
            "range": "±4.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/6.50/7.80/7.80 ms avg=5.20 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.90000009536743,
            "unit": "p95 ms",
            "range": "±18.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.90/21.90/21.90 ms avg=7.21 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 78.79999995231628,
            "unit": "p95 ms",
            "range": "±43.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.80/37.90/39.10/78.80 ms avg=43.49 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 97.79999995231628,
            "unit": "p95 ms",
            "range": "±53.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.20/57.00/97.80/97.80 ms avg=62.86 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 99,
            "unit": "p95 ms",
            "range": "±38.4%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.60/77.20/99.00/99.00 ms avg=83.11 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 364.40000009536743,
            "unit": "p95 ms",
            "range": "±57.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=307.00/328.10/364.40/364.40 ms avg=397.96 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 683.7999999523163,
            "unit": "p95 ms",
            "range": "±106.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=577.10/591.00/683.80/683.80 ms avg=756.93 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 863.2000000476837,
            "unit": "p95 ms",
            "range": "±55.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=807.70/854.50/863.20/863.20 ms avg=1037.80 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.5%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.40/4.80/5.50 ms avg=2.47 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.199999809265137,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.80/23.00/23.20 ms avg=18.65 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.5,
            "unit": "p95 ms",
            "range": "±30.0%",
            "extra": "create index 1024x5000 50/75/90/95%=110.50/117.50/140.50/140.50 ms avg=145.77 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 140.5,
            "unit": "p95 ms",
            "range": "±10.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.00/139.90/140.50/140.50 ms avg=171.59 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.299999952316284,
            "unit": "p95 ms",
            "range": "±6.0%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.30/35.70/35.80/38.30 ms avg=37.60 ms (14 runs sampled)"
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
        "date": 1656065951850,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.200000047683716,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.50/1.60/3.20 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.1000001430511475,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/4.30/4.70/5.10 ms avg=2.85 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.20/6.00/6.00 ms avg=4.29 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.399999856948853,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.40/22.40/22.40 ms avg=7.30 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 113.69999980926514,
            "unit": "p95 ms",
            "range": "±82.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.60/35.30/38.00/113.70 ms avg=45.60 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 116.5,
            "unit": "p95 ms",
            "range": "±74.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.00/58.30/116.50/116.50 ms avg=63.01 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 128.20000004768372,
            "unit": "p95 ms",
            "range": "±67.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.70/70.50/128.20/128.20 ms avg=85.40 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 364.59999990463257,
            "unit": "p95 ms",
            "range": "±67.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.30/328.30/364.60/364.60 ms avg=394.84 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 654.5,
            "unit": "p95 ms",
            "range": "±82.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=571.80/591.50/654.50/654.50 ms avg=745.90 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 883.2000000476837,
            "unit": "p95 ms",
            "range": "±71.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=811.50/833.30/883.20/883.20 ms avg=1047.11 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.5,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/3.00/6.50 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.299999952316284,
            "unit": "p95 ms",
            "range": "±7.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.90/17.30/23.00/24.30 ms avg=19.28 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 146.39999985694885,
            "unit": "p95 ms",
            "range": "±32.9%",
            "extra": "create index 1024x5000 50/75/90/95%=113.50/121.70/146.40/146.40 ms avg=148.61 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 138.90000009536743,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.90/137.40/138.90/138.90 ms avg=166.46 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.39999985694885,
            "unit": "p95 ms",
            "range": "±4.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.00/37.10/37.80/38.40 ms avg=37.97 ms (14 runs sampled)"
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
        "date": 1656071363213,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.60/3.00 ms avg=1.40 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.50/4.40/5.00 ms avg=2.56 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.799999952316284,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/5.50/5.80/5.80 ms avg=4.60 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.90000009536743,
            "unit": "p95 ms",
            "range": "±18.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/7.00/21.90/21.90 ms avg=7.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 119.40000009536743,
            "unit": "p95 ms",
            "range": "±87.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.20/36.00/39.80/119.40 ms avg=46.62 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 115.09999990463257,
            "unit": "p95 ms",
            "range": "±72.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.30/56.10/115.10/115.10 ms avg=62.89 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 126,
            "unit": "p95 ms",
            "range": "±63.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.20/74.30/126.00/126.00 ms avg=88.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 353.5,
            "unit": "p95 ms",
            "range": "±56.5%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.00/325.20/353.50/353.50 ms avg=391.46 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 660.2999999523163,
            "unit": "p95 ms",
            "range": "±87.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=573.00/588.80/660.30/660.30 ms avg=748.21 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 896.5,
            "unit": "p95 ms",
            "range": "±72.0%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=824.50/860.60/896.50/896.50 ms avg=1070.09 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 7.200000047683716,
            "unit": "p95 ms",
            "range": "±5.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.70/2.90/7.20 ms avg=2.52 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.40000009536743,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.80/17.50/22.40/24.40 ms avg=19.25 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142.19999980926514,
            "unit": "p95 ms",
            "range": "±31.7%",
            "extra": "create index 1024x5000 50/75/90/95%=110.50/120.80/142.20/142.20 ms avg=147.16 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146.30000019073486,
            "unit": "p95 ms",
            "range": "±9.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.60/145.80/146.30/146.30 ms avg=172.59 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.799999952316284,
            "unit": "p95 ms",
            "range": "±4.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.00/36.50/37.70/37.80 ms avg=37.19 ms (14 runs sampled)"
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
        "date": 1656074318989,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.70/3.00 ms avg=1.46 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.60/4.50/4.90 ms avg=2.57 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 14.799999952316284,
            "unit": "p95 ms",
            "range": "±11.5%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/5.90/14.80/14.80 ms avg=5.94 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/7.80/22.00/22.00 ms avg=7.97 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 89.39999985694885,
            "unit": "p95 ms",
            "range": "±58.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.30/34.00/40.30/89.40 ms avg=41.83 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 89.79999995231628,
            "unit": "p95 ms",
            "range": "±48.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.00/47.70/89.80/89.80 ms avg=56.54 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 98.10000014305115,
            "unit": "p95 ms",
            "range": "±38.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.50/74.90/98.10/98.10 ms avg=83.77 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 351.39999985694885,
            "unit": "p95 ms",
            "range": "±53.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.80/311.20/351.40/351.40 ms avg=387.57 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 641.8999998569489,
            "unit": "p95 ms",
            "range": "±59.4%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=582.50/590.10/641.90/641.90 ms avg=748.94 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 892.7999999523163,
            "unit": "p95 ms",
            "range": "±95.3%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=797.50/810.20/892.80/892.80 ms avg=1033.46 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.6000001430511475,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.80/3.50/6.60 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.700000047683716,
            "unit": "p95 ms",
            "range": "±7.5%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.70/22.20/23.70 ms avg=18.52 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 135.39999985694885,
            "unit": "p95 ms",
            "range": "±25.3%",
            "extra": "create index 1024x5000 50/75/90/95%=110.10/116.50/135.40/135.40 ms avg=144.69 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.89999985694885,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.30/143.40/145.90/145.90 ms avg=175.76 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.5,
            "unit": "p95 ms",
            "range": "±4.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.70/36.90/38.00/38.50 ms avg=38.88 ms (13 runs sampled)"
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
        "date": 1656075200607,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.5999999046325684,
            "unit": "p95 ms",
            "range": "±2.3%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.30/1.50/1.70/3.60 ms avg=1.51 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.299999952316284,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.70/4.90/5.30 ms avg=2.69 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 10,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.60/10.00/10.00 ms avg=5.30 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±19.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.40/23.00/23.00 ms avg=7.24 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 76.80000019073486,
            "unit": "p95 ms",
            "range": "±40.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=36.70/43.30/44.90/76.80 ms avg=46.35 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 74.80000019073486,
            "unit": "p95 ms",
            "range": "±32.1%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.70/54.60/74.80/74.80 ms avg=58.12 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 110.59999990463257,
            "unit": "p95 ms",
            "range": "±48.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.80/81.20/110.60/110.60 ms avg=87.90 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 370.90000009536743,
            "unit": "p95 ms",
            "range": "±69.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.80/342.00/370.90/370.90 ms avg=398.74 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 689.2000000476837,
            "unit": "p95 ms",
            "range": "±102.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=586.50/611.40/689.20/689.20 ms avg=768.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 935.7000000476837,
            "unit": "p95 ms",
            "range": "±107.2%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=828.50/849.80/935.70/935.70 ms avg=1078.86 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.1000001430511475,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.80/4.50/5.10 ms avg=2.54 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.299999952316284,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=17.30/17.40/22.60/24.30 ms avg=19.57 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 144.20000004768372,
            "unit": "p95 ms",
            "range": "±27.4%",
            "extra": "create index 1024x5000 50/75/90/95%=116.80/123.90/144.20/144.20 ms avg=152.60 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 157.20000004768372,
            "unit": "p95 ms",
            "range": "±16.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=141.00/151.80/157.20/157.20 ms avg=182.24 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 45.40000009536743,
            "unit": "p95 ms",
            "range": "±9.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.50/38.90/40.20/45.40 ms avg=40.43 ms (13 runs sampled)"
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
        "date": 1656289341319,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999996185302734,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.50/2.90 ms avg=1.31 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.099999904632568,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.50/4.90/5.10 ms avg=2.68 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.5,
            "unit": "p95 ms",
            "range": "±6.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/5.80/9.50/9.50 ms avg=5.17 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.300000190734863,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.70/22.30/22.30 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 124.40000009536743,
            "unit": "p95 ms",
            "range": "±92.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.30/34.40/42.00/124.40 ms avg=46.72 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 110.90000009536743,
            "unit": "p95 ms",
            "range": "±71.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=39.90/47.10/110.90/110.90 ms avg=58.57 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 120.90000009536743,
            "unit": "p95 ms",
            "range": "±60.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.80/71.70/120.90/120.90 ms avg=86.43 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 352.2000002861023,
            "unit": "p95 ms",
            "range": "±31.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=320.50/327.10/352.20/352.20 ms avg=402.94 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 657.8000001907349,
            "unit": "p95 ms",
            "range": "±99.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=558.00/582.90/657.80/657.80 ms avg=732.51 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 877.7999997138977,
            "unit": "p95 ms",
            "range": "±94.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=783.10/798.70/877.80/877.80 ms avg=1012.73 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.699999809265137,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/4.50/4.70 ms avg=2.45 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.09999990463257,
            "unit": "p95 ms",
            "range": "±7.8%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.90/23.00/24.10 ms avg=18.62 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.5,
            "unit": "p95 ms",
            "range": "±35.9%",
            "extra": "create index 1024x5000 50/75/90/95%=104.60/108.90/140.50/140.50 ms avg=139.81 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 152.89999961853027,
            "unit": "p95 ms",
            "range": "±14.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.80/148.00/152.90/152.90 ms avg=174.50 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.5,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.90/35.50/37.00/41.50 ms avg=37.68 ms (14 runs sampled)"
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
        "date": 1656289504435,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8000001907348633,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.50/2.80 ms avg=1.31 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.799999713897705,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/4.50/4.80 ms avg=2.60 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.700000286102295,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.60/9.70/9.70 ms avg=5.19 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.199999809265137,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/6.60/22.20/22.20 ms avg=7.14 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 110.2999997138977,
            "unit": "p95 ms",
            "range": "±79.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.20/33.80/47.10/110.30 ms avg=43.94 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 108.5,
            "unit": "p95 ms",
            "range": "±67.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.00/48.40/108.50/108.50 ms avg=59.19 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 126.19999980926514,
            "unit": "p95 ms",
            "range": "±65.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.90/69.30/126.20/126.20 ms avg=87.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 369.30000019073486,
            "unit": "p95 ms",
            "range": "±74.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=294.60/330.00/369.30/369.30 ms avg=392.54 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 665,
            "unit": "p95 ms",
            "range": "±87.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=577.40/599.50/665.00/665.00 ms avg=750.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 891.8000001907349,
            "unit": "p95 ms",
            "range": "±90.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=801.00/810.90/891.80/891.80 ms avg=1032.00 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.599999904632568,
            "unit": "p95 ms",
            "range": "±4.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/3.10/6.60 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.299999713897705,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.00/16.30/22.00/23.30 ms avg=18.22 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 139.19999980926514,
            "unit": "p95 ms",
            "range": "±30.3%",
            "extra": "create index 1024x5000 50/75/90/95%=108.90/120.80/139.20/139.20 ms avg=143.24 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146.69999980926514,
            "unit": "p95 ms",
            "range": "±17.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=129.20/133.90/146.70/146.70 ms avg=166.90 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 40.30000019073486,
            "unit": "p95 ms",
            "range": "±7.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.50/35.00/37.20/40.30 ms avg=37.09 ms (14 runs sampled)"
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
        "date": 1656410315961,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1999998092651367,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.50/1.60/3.20 ms avg=1.40 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.5%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.40/5.00/5.50 ms avg=2.59 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/5.20/5.30/5.30 ms avg=4.40 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999990463257,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.70/22.10/22.10 ms avg=7.27 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 124.39999961853027,
            "unit": "p95 ms",
            "range": "±92.8%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.60/33.00/41.10/124.40 ms avg=46.28 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 111.59999990463257,
            "unit": "p95 ms",
            "range": "±68.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.10/57.30/111.60/111.60 ms avg=63.13 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 138.40000009536743,
            "unit": "p95 ms",
            "range": "±77.4%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.00/75.10/138.40/138.40 ms avg=90.89 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 350.40000009536743,
            "unit": "p95 ms",
            "range": "±53.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.20/319.00/350.40/350.40 ms avg=389.51 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 645,
            "unit": "p95 ms",
            "range": "±75.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=569.70/597.80/645.00/645.00 ms avg=745.86 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 898.2000002861023,
            "unit": "p95 ms",
            "range": "±106.0%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=792.20/846.70/898.20/898.20 ms avg=1035.93 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.900000095367432,
            "unit": "p95 ms",
            "range": "±3.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.60/3.00/5.90 ms avg=2.43 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.699999809265137,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.70/17.30/22.50/23.70 ms avg=19.03 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.80000019073486,
            "unit": "p95 ms",
            "range": "±31.1%",
            "extra": "create index 1024x5000 50/75/90/95%=109.70/116.80/140.80/140.80 ms avg=145.09 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 141.90000009536743,
            "unit": "p95 ms",
            "range": "±9.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.10/139.50/141.90/141.90 ms avg=173.24 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38,
            "unit": "p95 ms",
            "range": "±5.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.20/34.70/36.90/38.00 ms avg=37.03 ms (14 runs sampled)"
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
        "date": 1656466604111,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/3.00/3.00 ms avg=1.41 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.20/4.70/5.30 ms avg=2.45 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.099999904632568,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/5.40/6.10/6.10 ms avg=4.37 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.40000009536743,
            "unit": "p95 ms",
            "range": "±19.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.40/22.40/22.40 ms avg=7.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 105.2999997138977,
            "unit": "p95 ms",
            "range": "±72.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.80/38.20/39.30/105.30 ms avg=45.51 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 98,
            "unit": "p95 ms",
            "range": "±57.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.00/45.80/98.00/98.00 ms avg=56.92 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 126,
            "unit": "p95 ms",
            "range": "±66.4%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.60/75.50/126.00/126.00 ms avg=87.81 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 358.7999997138977,
            "unit": "p95 ms",
            "range": "±55.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=303.60/327.10/358.80/358.80 ms avg=395.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 644.0999999046326,
            "unit": "p95 ms",
            "range": "±72.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=571.20/597.10/644.10/644.10 ms avg=737.56 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 879,
            "unit": "p95 ms",
            "range": "±84.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=794.50/820.20/879.00/879.00 ms avg=1025.91 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.700000286102295,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "scan 1024x1000 50/75/90/95%=1.80/2.30/4.40/4.70 ms avg=2.32 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.300000190734863,
            "unit": "p95 ms",
            "range": "±7.5%",
            "extra": "scan 1024x10000 50/75/90/95%=16.80/17.00/22.40/24.30 ms avg=19.01 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 144.19999980926514,
            "unit": "p95 ms",
            "range": "±33.5%",
            "extra": "create index 1024x5000 50/75/90/95%=110.70/118.10/144.20/144.20 ms avg=146.33 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 140,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=134.80/137.60/140.00/140.00 ms avg=172.83 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.59999990463257,
            "unit": "p95 ms",
            "range": "±6.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.10/37.90/38.80/41.60 ms avg=39.22 ms (13 runs sampled)"
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
        "date": 1656491788766,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.60/3.00 ms avg=1.33 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.50/4.40/5.20 ms avg=2.56 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.900000095367432,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.60/5.80/9.90/9.90 ms avg=4.66 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.90000009536743,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.60/21.90/21.90 ms avg=7.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 134.69999980926514,
            "unit": "p95 ms",
            "range": "±103.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.60/36.80/40.40/134.70 ms avg=47.62 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 98.10000038146973,
            "unit": "p95 ms",
            "range": "±56.9%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.20/46.80/98.10/98.10 ms avg=57.47 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 129,
            "unit": "p95 ms",
            "range": "±69.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.80/76.10/129.00/129.00 ms avg=87.11 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 363.09999990463257,
            "unit": "p95 ms",
            "range": "±43.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=319.80/323.60/363.10/363.10 ms avg=399.61 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 658.7000002861023,
            "unit": "p95 ms",
            "range": "±88.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=570.00/582.50/658.70/658.70 ms avg=737.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 880.4000000953674,
            "unit": "p95 ms",
            "range": "±88.2%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=792.20/819.90/880.40/880.40 ms avg=1032.97 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6,
            "unit": "p95 ms",
            "range": "±3.8%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/3.00/6.00 ms avg=2.47 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.90000009536743,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.50/23.70/23.90 ms avg=18.50 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.2000002861023,
            "unit": "p95 ms",
            "range": "±36.1%",
            "extra": "create index 1024x5000 50/75/90/95%=104.10/115.40/140.20/140.20 ms avg=140.31 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 153.59999990463257,
            "unit": "p95 ms",
            "range": "±18.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.60/139.10/153.60/153.60 ms avg=175.73 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.700000286102295,
            "unit": "p95 ms",
            "range": "±3.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.90/33.90/36.50/36.70 ms avg=36.89 ms (14 runs sampled)"
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
        "date": 1656494048329,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.60/3.00 ms avg=1.39 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.20/4.80/4.90 ms avg=2.63 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.599999904632568,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.10/8.60/8.60 ms avg=5.09 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.799999713897705,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/8.60/21.80/21.80 ms avg=7.43 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 112,
            "unit": "p95 ms",
            "range": "±79.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.30/34.80/40.30/112.00 ms avg=45.52 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 112.7000002861023,
            "unit": "p95 ms",
            "range": "±71.3%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.40/47.70/112.70/112.70 ms avg=59.96 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 121.90000009536743,
            "unit": "p95 ms",
            "range": "±62.0%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.90/71.30/121.90/121.90 ms avg=84.80 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 364.5,
            "unit": "p95 ms",
            "range": "±64.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.80/321.00/364.50/364.50 ms avg=397.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 647,
            "unit": "p95 ms",
            "range": "±72.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=574.80/593.10/647.00/647.00 ms avg=738.59 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 888.5999999046326,
            "unit": "p95 ms",
            "range": "±90.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=798.10/806.50/888.60/888.60 ms avg=1027.06 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.70/5.00 ms avg=2.44 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.699999809265137,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "scan 1024x10000 50/75/90/95%=16.80/17.10/22.30/23.70 ms avg=19.05 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142.7999997138977,
            "unit": "p95 ms",
            "range": "±34.7%",
            "extra": "create index 1024x5000 50/75/90/95%=108.10/120.00/142.80/142.80 ms avg=144.26 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 155.59999990463257,
            "unit": "p95 ms",
            "range": "±12.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=142.90/143.60/155.60/155.60 ms avg=177.84 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.59999990463257,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.40/35.30/36.20/36.60 ms avg=37.83 ms (14 runs sampled)"
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
        "date": 1656496300518,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.70/3.00 ms avg=1.44 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.700000286102295,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.60/4.00/4.70 ms avg=2.58 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.900000095367432,
            "unit": "p95 ms",
            "range": "±5.9%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.80/8.90/8.90 ms avg=5.07 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.200000286102295,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.70/22.20/22.20 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 114.2999997138977,
            "unit": "p95 ms",
            "range": "±82.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.30/36.20/38.90/114.30 ms avg=44.12 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 110.80000019073486,
            "unit": "p95 ms",
            "range": "±69.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.40/47.40/110.80/110.80 ms avg=59.44 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 122.59999990463257,
            "unit": "p95 ms",
            "range": "±63.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.50/71.10/122.60/122.60 ms avg=85.46 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.69999980926514,
            "unit": "p95 ms",
            "range": "±59.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.30/323.90/356.70/356.70 ms avg=393.49 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 655.7000002861023,
            "unit": "p95 ms",
            "range": "±86.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=569.00/598.20/655.70/655.70 ms avg=744.70 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 895.9000000953674,
            "unit": "p95 ms",
            "range": "±99.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=796.80/809.30/895.90/895.90 ms avg=1030.84 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.699999809265137,
            "unit": "p95 ms",
            "range": "±4.5%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.70/2.80/6.70 ms avg=2.48 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.40000009536743,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.80/17.30/23.00/23.40 ms avg=19.02 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 132.59999990463257,
            "unit": "p95 ms",
            "range": "±23.7%",
            "extra": "create index 1024x5000 50/75/90/95%=108.90/116.50/132.60/132.60 ms avg=142.67 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 149.80000019073486,
            "unit": "p95 ms",
            "range": "±9.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=139.90/142.80/149.80/149.80 ms avg=174.99 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.80000019073486,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.40/36.80/38.30/38.80 ms avg=37.21 ms (14 runs sampled)"
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
        "date": 1656498458492,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1999998092651367,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.60/3.20 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.699999809265137,
            "unit": "p95 ms",
            "range": "±3.8%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/4.70/5.70 ms avg=2.59 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.200000286102295,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/5.30/6.20/6.20 ms avg=4.64 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.800000190734863,
            "unit": "p95 ms",
            "range": "±18.4%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/7.00/21.80/21.80 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 83.5,
            "unit": "p95 ms",
            "range": "±48.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.80/40.50/44.00/83.50 ms avg=43.49 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 77.30000019073486,
            "unit": "p95 ms",
            "range": "±35.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.80/52.80/77.30/77.30 ms avg=56.80 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 112.59999990463257,
            "unit": "p95 ms",
            "range": "±56.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=56.50/74.10/112.60/112.60 ms avg=82.81 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.09999990463257,
            "unit": "p95 ms",
            "range": "±54.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.30/332.60/356.10/356.10 ms avg=395.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 662.9000000953674,
            "unit": "p95 ms",
            "range": "±97.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=565.70/583.80/662.90/662.90 ms avg=737.16 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 861.5,
            "unit": "p95 ms",
            "range": "±76.0%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=785.50/815.40/861.50/861.50 ms avg=1018.74 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.399999618530273,
            "unit": "p95 ms",
            "range": "±4.5%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.60/3.20/6.40 ms avg=2.45 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.799999713897705,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/17.10/22.80/23.80 ms avg=18.93 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 137.7000002861023,
            "unit": "p95 ms",
            "range": "±30.8%",
            "extra": "create index 1024x5000 50/75/90/95%=106.90/115.20/137.70/137.70 ms avg=141.80 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146.90000009536743,
            "unit": "p95 ms",
            "range": "±8.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.40/141.20/146.90/146.90 ms avg=173.91 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.80000019073486,
            "unit": "p95 ms",
            "range": "±4.0%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.50/36.40/38.30/38.80 ms avg=38.85 ms (13 runs sampled)"
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
        "date": 1657176106983,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.299999713897705,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.70/3.30 ms avg=1.41 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/3.20/4.20/4.90 ms avg=2.79 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 7.700000286102295,
            "unit": "p95 ms",
            "range": "±4.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.70/7.70/7.70 ms avg=4.93 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.199999809265137,
            "unit": "p95 ms",
            "range": "±18.9%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.50/22.20/22.20 ms avg=7.16 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 118.40000009536743,
            "unit": "p95 ms",
            "range": "±84.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.80/35.10/39.30/118.40 ms avg=47.29 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 102.30000019073486,
            "unit": "p95 ms",
            "range": "±58.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.10/58.70/102.30/102.30 ms avg=62.90 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 100.2999997138977,
            "unit": "p95 ms",
            "range": "±36.7%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=63.60/81.40/100.30/100.30 ms avg=87.21 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 370.5,
            "unit": "p95 ms",
            "range": "±66.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=304.40/337.30/370.50/370.50 ms avg=401.57 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 701.1999998092651,
            "unit": "p95 ms",
            "range": "±90.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=610.60/615.70/701.20/701.20 ms avg=790.89 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 947.1999998092651,
            "unit": "p95 ms",
            "range": "±104.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=842.70/850.50/947.20/947.20 ms avg=1090.34 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.200000286102295,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.70/5.20/5.20 ms avg=2.57 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=17.40/17.60/22.50/24.00 ms avg=19.71 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.7999997138977,
            "unit": "p95 ms",
            "range": "±27.9%",
            "extra": "create index 1024x5000 50/75/90/95%=112.90/118.30/140.80/140.80 ms avg=148.23 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 149.80000019073486,
            "unit": "p95 ms",
            "range": "±9.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=140.20/143.20/149.80/149.80 ms avg=175.40 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.200000286102295,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.20/35.80/38.10/38.20 ms avg=37.90 ms (14 runs sampled)"
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
        "date": 1657272646475,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.9000000953674316,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.90/2.90 ms avg=1.44 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.80/2.30/4.30/4.90 ms avg=2.41 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.099999904632568,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=4.30/5.80/6.10/6.10 ms avg=5.16 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.799999713897705,
            "unit": "p95 ms",
            "range": "±19.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.60/6.60/22.80/22.80 ms avg=7.44 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 140.19999980926514,
            "unit": "p95 ms",
            "range": "±108.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.60/34.10/38.60/140.20 ms avg=47.60 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 108,
            "unit": "p95 ms",
            "range": "±68.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=39.50/46.10/108.00/108.00 ms avg=56.94 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 171.5,
            "unit": "p95 ms",
            "range": "±114.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=57.30/71.30/171.50/171.50 ms avg=91.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 353.2000002861023,
            "unit": "p95 ms",
            "range": "±44.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=309.10/318.80/353.20/353.20 ms avg=397.29 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 650.4000000953674,
            "unit": "p95 ms",
            "range": "±75.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=574.90/596.30/650.40/650.40 ms avg=741.49 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 878,
            "unit": "p95 ms",
            "range": "±65.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=812.30/840.30/878.00/878.00 ms avg=1043.59 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 11.599999904632568,
            "unit": "p95 ms",
            "range": "±9.8%",
            "extra": "scan 1024x1000 50/75/90/95%=1.80/5.00/10.50/11.60 ms avg=3.68 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.90000009536743,
            "unit": "p95 ms",
            "range": "±8.1%",
            "extra": "scan 1024x10000 50/75/90/95%=16.80/16.90/23.50/24.90 ms avg=19.13 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 141,
            "unit": "p95 ms",
            "range": "±35.8%",
            "extra": "create index 1024x5000 50/75/90/95%=105.20/118.80/141.00/141.00 ms avg=141.91 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 141.10000038146973,
            "unit": "p95 ms",
            "range": "±9.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.60/139.70/141.10/141.10 ms avg=167.66 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.40000009536743,
            "unit": "p95 ms",
            "range": "±5.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.90/36.70/37.90/38.40 ms avg=37.47 ms (14 runs sampled)"
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
        "date": 1657316565143,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.799999713897705,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.50/2.80 ms avg=1.29 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/4.30/4.90 ms avg=2.51 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/3.20/4.80/4.80 ms avg=3.80 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.50/22.00/22.00 ms avg=7.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 80.90000009536743,
            "unit": "p95 ms",
            "range": "±47.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.70/38.00/39.10/80.90 ms avg=42.56 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 73.5,
            "unit": "p95 ms",
            "range": "±30.3%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.20/51.70/73.50/73.50 ms avg=55.78 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 145.2000002861023,
            "unit": "p95 ms",
            "range": "±84.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.40/77.10/145.20/145.20 ms avg=91.67 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.7000002861023,
            "unit": "p95 ms",
            "range": "±53.5%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=303.20/324.00/356.70/356.70 ms avg=393.49 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 668.4000000953674,
            "unit": "p95 ms",
            "range": "±102.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=566.10/579.00/668.40/668.40 ms avg=732.87 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 901.3000001907349,
            "unit": "p95 ms",
            "range": "±107.9%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=793.40/803.60/901.30/901.30 ms avg=1023.76 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.900000095367432,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.60/4.90 ms avg=2.44 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.799999713897705,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/17.10/22.10/23.80 ms avg=18.78 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 128.69999980926514,
            "unit": "p95 ms",
            "range": "±22.9%",
            "extra": "create index 1024x5000 50/75/90/95%=105.80/115.40/128.70/128.70 ms avg=139.73 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 141.39999961853027,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.00/137.70/141.40/141.40 ms avg=172.64 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.30000019073486,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.10/35.30/37.40/38.30 ms avg=37.51 ms (14 runs sampled)"
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
        "date": 1657575478776,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.4000000953674316,
            "unit": "p95 ms",
            "range": "±2.3%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.50/3.30/3.40 ms avg=1.54 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/2.90/4.80 ms avg=2.45 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 7.800000190734863,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.50/7.80/7.80 ms avg=4.94 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.70/22.00/22.00 ms avg=7.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 79.80000019073486,
            "unit": "p95 ms",
            "range": "±45.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.50/39.90/43.70/79.80 ms avg=43.26 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 72,
            "unit": "p95 ms",
            "range": "±27.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.50/52.40/72.00/72.00 ms avg=55.72 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 97.5,
            "unit": "p95 ms",
            "range": "±37.7%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.80/74.40/97.50/97.50 ms avg=82.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 358.3999996185303,
            "unit": "p95 ms",
            "range": "±63.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=295.30/319.20/358.40/358.40 ms avg=387.24 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 647.8000001907349,
            "unit": "p95 ms",
            "range": "±83.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=564.50/572.10/647.80/647.80 ms avg=734.99 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 916.7000002861023,
            "unit": "p95 ms",
            "range": "±117.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=799.30/810.60/916.70/916.70 ms avg=1038.47 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.800000190734863,
            "unit": "p95 ms",
            "range": "±4.7%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/3.40/6.80 ms avg=2.53 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.800000190734863,
            "unit": "p95 ms",
            "range": "±7.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/17.30/22.00/23.80 ms avg=18.76 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.90000009536743,
            "unit": "p95 ms",
            "range": "±30.0%",
            "extra": "create index 1024x5000 50/75/90/95%=106.90/110.40/136.90/136.90 ms avg=140.01 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 153.2000002861023,
            "unit": "p95 ms",
            "range": "±13.8%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=141.60/143.80/153.20/153.20 ms avg=174.53 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.59999990463257,
            "unit": "p95 ms",
            "range": "±7.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=31.20/35.70/36.80/38.60 ms avg=36.45 ms (14 runs sampled)"
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
        "date": 1657658610416,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.200000286102295,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/3.00/3.20 ms avg=1.43 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.50/4.40/5.00 ms avg=2.70 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 7.800000190734863,
            "unit": "p95 ms",
            "range": "±4.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.90/7.80/7.80 ms avg=5.01 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999990463257,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.20/22.10/22.10 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 85.59999990463257,
            "unit": "p95 ms",
            "range": "±53.4%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.20/34.80/46.70/85.60 ms avg=43.02 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 109.2999997138977,
            "unit": "p95 ms",
            "range": "±69.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.10/46.30/109.30/109.30 ms avg=58.49 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 124.19999980926514,
            "unit": "p95 ms",
            "range": "±64.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.10/68.60/124.20/124.20 ms avg=87.70 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 359,
            "unit": "p95 ms",
            "range": "±61.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.40/329.80/359.00/359.00 ms avg=392.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 633.3000001907349,
            "unit": "p95 ms",
            "range": "±64.4%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=568.90/590.30/633.30/633.30 ms avg=739.27 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 893.3000001907349,
            "unit": "p95 ms",
            "range": "±114.2%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=779.10/834.50/893.30/893.30 ms avg=1020.07 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.700000286102295,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.90/5.20/5.70 ms avg=2.64 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.200000286102295,
            "unit": "p95 ms",
            "range": "±7.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.80/17.10/22.40/24.20 ms avg=19.11 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 131.69999980926514,
            "unit": "p95 ms",
            "range": "±28.2%",
            "extra": "create index 1024x5000 50/75/90/95%=103.50/114.80/131.70/131.70 ms avg=136.59 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 162.19999980926514,
            "unit": "p95 ms",
            "range": "±26.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.80/144.90/162.20/162.20 ms avg=176.16 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 45.80000019073486,
            "unit": "p95 ms",
            "range": "±13.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.50/35.20/39.80/45.80 ms avg=37.71 ms (14 runs sampled)"
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
        "date": 1658458705866,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/2.40/3.00 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.40/4.60/5.30 ms avg=2.50 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.40000057220459,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.80/8.40/8.40 ms avg=5.10 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999942779541,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/8.00/22.10/22.10 ms avg=7.80 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 111.90000057220459,
            "unit": "p95 ms",
            "range": "±79.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.70/38.00/47.30/111.90 ms avg=46.72 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 143.69999980926514,
            "unit": "p95 ms",
            "range": "±100.7%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.00/56.80/143.70/143.70 ms avg=65.63 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 119.60000038146973,
            "unit": "p95 ms",
            "range": "±61.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.30/72.10/119.60/119.60 ms avg=84.30 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 353,
            "unit": "p95 ms",
            "range": "±52.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=300.20/320.50/353.00/353.00 ms avg=389.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 653.6999998092651,
            "unit": "p95 ms",
            "range": "±81.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=571.80/588.80/653.70/653.70 ms avg=742.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 890.6000003814697,
            "unit": "p95 ms",
            "range": "±100.6%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=790.00/828.60/890.60/890.60 ms avg=1034.16 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.09999942779541,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.80/4.40/5.10 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.399999618530273,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/17.40/23.30/23.40 ms avg=18.81 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 138.20000076293945,
            "unit": "p95 ms",
            "range": "±33.0%",
            "extra": "create index 1024x5000 50/75/90/95%=105.20/113.20/138.20/138.20 ms avg=139.96 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 147.10000038146973,
            "unit": "p95 ms",
            "range": "±14.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.70/135.50/147.10/147.10 ms avg=170.51 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.40000057220459,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.00/34.70/36.00/36.40 ms avg=36.46 ms (14 runs sampled)"
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
        "date": 1658459872126,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1999998092651367,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.50/1.70/3.20 ms avg=1.44 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.90000057220459,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.20/3.50/4.80/4.90 ms avg=2.78 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.09999942779541,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.60/8.10/8.10 ms avg=4.64 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.100000381469727,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.90/22.10/22.10 ms avg=6.97 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 109.40000057220459,
            "unit": "p95 ms",
            "range": "±77.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.20/35.00/38.80/109.40 ms avg=45.53 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 142.0999994277954,
            "unit": "p95 ms",
            "range": "±97.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.50/57.50/142.10/142.10 ms avg=65.83 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 117.69999980926514,
            "unit": "p95 ms",
            "range": "±55.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.20/73.60/117.70/117.70 ms avg=88.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 362.1000003814697,
            "unit": "p95 ms",
            "range": "±69.0%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=293.10/331.20/362.10/362.10 ms avg=390.11 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 644,
            "unit": "p95 ms",
            "range": "±65.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=578.50/600.30/644.00/644.00 ms avg=751.81 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 886.5,
            "unit": "p95 ms",
            "range": "±69.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=816.70/869.40/886.50/886.50 ms avg=1053.44 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.5%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.40/4.80/5.50 ms avg=2.46 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±6.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/17.20/22.40/23.00 ms avg=18.93 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 148.80000019073486,
            "unit": "p95 ms",
            "range": "±36.6%",
            "extra": "create index 1024x5000 50/75/90/95%=112.20/118.50/148.80/148.80 ms avg=147.29 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 150.19999980926514,
            "unit": "p95 ms",
            "range": "±10.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=143.10/146.80/150.20/150.20 ms avg=178.09 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.60/35.00/37.70/38.00 ms avg=37.01 ms (14 runs sampled)"
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
        "date": 1658460034576,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1999998092651367,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.80/3.20 ms avg=1.43 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/4.10/4.70/5.00 ms avg=2.91 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.399999618530273,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.80/8.40/8.40 ms avg=4.94 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.5,
            "unit": "p95 ms",
            "range": "±19.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.90/22.50/22.50 ms avg=7.24 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 81.09999942779541,
            "unit": "p95 ms",
            "range": "±45.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.90/39.90/47.10/81.10 ms avg=46.02 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 101.89999961853027,
            "unit": "p95 ms",
            "range": "±55.9%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=46.00/58.10/101.90/101.90 ms avg=63.96 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 101.60000038146973,
            "unit": "p95 ms",
            "range": "±40.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.00/77.30/101.60/101.60 ms avg=85.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 360.30000019073486,
            "unit": "p95 ms",
            "range": "±58.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=302.20/329.60/360.30/360.30 ms avg=393.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 655.3999996185303,
            "unit": "p95 ms",
            "range": "±62.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=593.10/606.20/655.40/655.40 ms avg=762.33 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 904.1999998092651,
            "unit": "p95 ms",
            "range": "±89.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=815.10/846.00/904.20/904.20 ms avg=1057.11 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.5,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/3.10/6.50 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.09999942779541,
            "unit": "p95 ms",
            "range": "±6.0%",
            "extra": "scan 1024x10000 50/75/90/95%=18.10/18.50/23.90/24.10 ms avg=20.40 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 141.30000019073486,
            "unit": "p95 ms",
            "range": "±27.5%",
            "extra": "create index 1024x5000 50/75/90/95%=113.80/119.90/141.30/141.30 ms avg=149.66 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 144.0999994277954,
            "unit": "p95 ms",
            "range": "±11.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.60/137.00/144.10/144.10 ms avg=170.33 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.69999980926514,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.20/35.60/35.80/36.70 ms avg=37.84 ms (14 runs sampled)"
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
        "date": 1658471443269,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000003814697266,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.70/3.10 ms avg=1.34 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.40/4.90/5.00 ms avg=2.60 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9,
            "unit": "p95 ms",
            "range": "±5.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/5.90/9.00/9.00 ms avg=5.26 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.50/22.00/22.00 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 102.79999923706055,
            "unit": "p95 ms",
            "range": "±71.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=30.90/34.10/39.00/102.80 ms avg=42.63 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 98.69999980926514,
            "unit": "p95 ms",
            "range": "±58.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=39.90/44.70/98.70/98.70 ms avg=57.39 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 97.19999980926514,
            "unit": "p95 ms",
            "range": "±38.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.90/76.30/97.20/97.20 ms avg=82.93 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 568.8000001907349,
            "unit": "p95 ms",
            "range": "±267.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.10/355.50/568.80/568.80 ms avg=432.37 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 637.5,
            "unit": "p95 ms",
            "range": "±60.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=576.70/599.20/637.50/637.50 ms avg=745.31 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 905.8999996185303,
            "unit": "p95 ms",
            "range": "±100.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=805.10/831.60/905.90/905.90 ms avg=1042.34 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.80/4.90/5.00 ms avg=2.53 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.699999809265137,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/16.90/22.70/23.70 ms avg=18.83 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 137.5,
            "unit": "p95 ms",
            "range": "±28.9%",
            "extra": "create index 1024x5000 50/75/90/95%=108.60/114.40/137.50/137.50 ms avg=143.21 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 150.10000038146973,
            "unit": "p95 ms",
            "range": "±16.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=134.10/148.40/150.10/150.10 ms avg=175.51 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.89999961853027,
            "unit": "p95 ms",
            "range": "±7.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.10/35.80/36.30/41.90 ms avg=37.75 ms (14 runs sampled)"
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
        "date": 1658473769116,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999996185302734,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.50/2.90 ms avg=1.34 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.799999237060547,
            "unit": "p95 ms",
            "range": "±3.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.60/4.80/5.80 ms avg=2.64 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.59999942779541,
            "unit": "p95 ms",
            "range": "±5.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/6.70/8.60/8.60 ms avg=5.14 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.600000381469727,
            "unit": "p95 ms",
            "range": "±19.4%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.70/22.60/22.60 ms avg=7.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 139,
            "unit": "p95 ms",
            "range": "±107.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.80/34.50/40.10/139.00 ms avg=47.69 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 106,
            "unit": "p95 ms",
            "range": "±66.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=39.50/45.00/106.00/106.00 ms avg=57.54 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 126.60000038146973,
            "unit": "p95 ms",
            "range": "±65.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.70/75.30/126.60/126.60 ms avg=87.40 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 364,
            "unit": "p95 ms",
            "range": "±59.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=304.60/327.10/364.00/364.00 ms avg=401.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 661.7999992370605,
            "unit": "p95 ms",
            "range": "±76.0%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=585.80/602.60/661.80/661.80 ms avg=754.31 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 914.5,
            "unit": "p95 ms",
            "range": "±99.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=814.80/829.70/914.50/914.50 ms avg=1041.54 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.100000381469727,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.40/4.80/5.10 ms avg=2.48 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 22.700000762939453,
            "unit": "p95 ms",
            "range": "±6.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/17.10/22.60/22.70 ms avg=18.81 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 135.19999980926514,
            "unit": "p95 ms",
            "range": "±28.0%",
            "extra": "create index 1024x5000 50/75/90/95%=107.20/112.00/135.20/135.20 ms avg=141.04 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143.5999994277954,
            "unit": "p95 ms",
            "range": "±6.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=137.50/141.60/143.60/143.60 ms avg=173.44 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 35.30000019073486,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.90/34.20/35.20/35.30 ms avg=36.24 ms (14 runs sampled)"
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
        "date": 1658473937316,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000003814697266,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.70/3.10 ms avg=1.42 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/4.20/5.20 ms avg=2.46 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.699999809265137,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.40/6.70/6.70 ms avg=4.57 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.300000190734863,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.60/22.30/22.30 ms avg=7.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 86.10000038146973,
            "unit": "p95 ms",
            "range": "±51.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.10/44.70/45.30/86.10 ms avg=46.55 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 100.5,
            "unit": "p95 ms",
            "range": "±59.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.30/50.90/100.50/100.50 ms avg=58.33 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 97.30000019073486,
            "unit": "p95 ms",
            "range": "±38.4%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.90/74.00/97.30/97.30 ms avg=82.84 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 359.79999923706055,
            "unit": "p95 ms",
            "range": "±58.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.20/319.90/359.80/359.80 ms avg=392.46 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 641.5,
            "unit": "p95 ms",
            "range": "±79.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=561.90/576.80/641.50/641.50 ms avg=733.24 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 884.3999996185303,
            "unit": "p95 ms",
            "range": "±100.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=783.90/798.60/884.40/884.40 ms avg=1019.44 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.90/4.30/4.90 ms avg=2.50 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±6.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/17.00/23.00/23.00 ms avg=18.86 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 130.9000005722046,
            "unit": "p95 ms",
            "range": "±23.9%",
            "extra": "create index 1024x5000 50/75/90/95%=107.00/112.90/130.90/130.90 ms avg=141.13 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143.69999980926514,
            "unit": "p95 ms",
            "range": "±11.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.80/139.60/143.70/143.70 ms avg=168.89 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.39999961853027,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.10/35.80/36.50/37.40 ms avg=37.37 ms (14 runs sampled)"
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
        "date": 1658776683781,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.60/3.00 ms avg=1.39 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.600000381469727,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.20/3.00/4.60 ms avg=2.35 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.199999809265137,
            "unit": "p95 ms",
            "range": "±6.3%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.20/9.20/9.20 ms avg=4.86 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.5,
            "unit": "p95 ms",
            "range": "±19.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.50/22.50/22.50 ms avg=7.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 100.90000057220459,
            "unit": "p95 ms",
            "range": "±69.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.40/34.80/40.20/100.90 ms avg=43.28 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 105.09999942779541,
            "unit": "p95 ms",
            "range": "±63.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.50/47.30/105.10/105.10 ms avg=58.63 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 126,
            "unit": "p95 ms",
            "range": "±63.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.20/82.10/126.00/126.00 ms avg=90.43 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 355.5,
            "unit": "p95 ms",
            "range": "±53.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=302.20/314.40/355.50/355.50 ms avg=392.74 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 669.1999998092651,
            "unit": "p95 ms",
            "range": "±65.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=604.00/610.30/669.20/669.20 ms avg=770.06 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 902.8999996185303,
            "unit": "p95 ms",
            "range": "±88.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=814.20/815.80/902.90/902.90 ms avg=1054.01 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/5.00/5.20 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.399999618530273,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=17.20/17.50/22.50/24.40 ms avg=19.42 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 135.60000038146973,
            "unit": "p95 ms",
            "range": "±24.5%",
            "extra": "create index 1024x5000 50/75/90/95%=111.10/118.90/135.60/135.60 ms avg=146.67 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 149.19999980926514,
            "unit": "p95 ms",
            "range": "±9.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=140.00/142.20/149.20/149.20 ms avg=177.66 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.60000038146973,
            "unit": "p95 ms",
            "range": "±5.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.10/32.80/34.70/37.60 ms avg=35.96 ms (14 runs sampled)"
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
        "date": 1659027535662,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000003814697266,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.60/3.10 ms avg=1.33 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.10/3.90/5.00 ms avg=2.43 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.699999809265137,
            "unit": "p95 ms",
            "range": "±2.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/4.10/5.70/5.70 ms avg=4.46 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.90000057220459,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.40/21.90/21.90 ms avg=7.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 118.80000019073486,
            "unit": "p95 ms",
            "range": "±87.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.20/34.90/40.70/118.80 ms avg=45.81 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 107.60000038146973,
            "unit": "p95 ms",
            "range": "±68.7%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=38.90/46.20/107.60/107.60 ms avg=57.72 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 122.29999923706055,
            "unit": "p95 ms",
            "range": "±60.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.40/73.80/122.30/122.30 ms avg=87.96 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 366.69999980926514,
            "unit": "p95 ms",
            "range": "±61.9%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=304.80/331.90/366.70/366.70 ms avg=398.67 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 676.3999996185303,
            "unit": "p95 ms",
            "range": "±102.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=574.10/596.80/676.40/676.40 ms avg=750.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 878.0999994277954,
            "unit": "p95 ms",
            "range": "±81.6%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=796.50/855.80/878.10/878.10 ms avg=1034.11 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.600000381469727,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.60/4.40/4.60 ms avg=2.41 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.199999809265137,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.90/22.10/23.20 ms avg=18.66 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.39999961853027,
            "unit": "p95 ms",
            "range": "±28.7%",
            "extra": "create index 1024x5000 50/75/90/95%=107.70/109.20/136.40/136.40 ms avg=139.47 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143.80000019073486,
            "unit": "p95 ms",
            "range": "±12.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.50/142.70/143.80/143.80 ms avg=170.23 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.39999961853027,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.60/34.50/35.50/36.40 ms avg=36.61 ms (14 runs sampled)"
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
        "date": 1659037566737,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999996185302734,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.50/2.90 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.30/4.30/4.90 ms avg=2.47 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.90000057220459,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/4.90/5.90/5.90 ms avg=4.47 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.800000190734863,
            "unit": "p95 ms",
            "range": "±18.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.70/6.80/21.80/21.80 ms avg=7.76 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 78.39999961853027,
            "unit": "p95 ms",
            "range": "±44.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.70/36.50/46.90/78.40 ms avg=42.32 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 72.69999980926514,
            "unit": "p95 ms",
            "range": "±29.7%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.00/53.00/72.70/72.70 ms avg=56.54 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 115.89999961853027,
            "unit": "p95 ms",
            "range": "±50.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=65.80/76.30/115.90/115.90 ms avg=89.27 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 353.3999996185303,
            "unit": "p95 ms",
            "range": "±54.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.30/313.60/353.40/353.40 ms avg=390.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 680,
            "unit": "p95 ms",
            "range": "±106.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=573.30/576.90/680.00/680.00 ms avg=744.37 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 892.3000001907349,
            "unit": "p95 ms",
            "range": "±82.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=809.50/827.20/892.30/892.30 ms avg=1043.93 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.5,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/3.00/6.50 ms avg=2.47 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.5,
            "unit": "p95 ms",
            "range": "±7.1%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.90/22.30/23.50 ms avg=18.60 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 131.80000019073486,
            "unit": "p95 ms",
            "range": "±22.8%",
            "extra": "create index 1024x5000 50/75/90/95%=109.00/114.80/131.80/131.80 ms avg=142.61 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 144.80000019073486,
            "unit": "p95 ms",
            "range": "±9.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.30/143.80/144.80/144.80 ms avg=172.44 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.30000019073486,
            "unit": "p95 ms",
            "range": "±4.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.70/34.50/37.50/38.30 ms avg=36.80 ms (14 runs sampled)"
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
        "date": 1659047630223,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999996185302734,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/2.70/2.90 ms avg=1.39 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.30/4.00/5.20 ms avg=2.50 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.399999618530273,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/6.30/6.40/6.40 ms avg=4.76 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±19.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.50/23.00/23.00 ms avg=7.34 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 83.30000019073486,
            "unit": "p95 ms",
            "range": "±48.4%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.90/38.90/44.60/83.30 ms avg=43.61 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 73.60000038146973,
            "unit": "p95 ms",
            "range": "±29.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.00/53.90/73.60/73.60 ms avg=57.11 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 125.10000038146973,
            "unit": "p95 ms",
            "range": "±64.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.60/77.00/125.10/125.10 ms avg=88.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.6000003814697,
            "unit": "p95 ms",
            "range": "±57.5%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.10/319.10/356.60/356.60 ms avg=394.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 673.6999998092651,
            "unit": "p95 ms",
            "range": "±101.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=572.60/583.20/673.70/673.70 ms avg=742.56 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 909.0999994277954,
            "unit": "p95 ms",
            "range": "±112.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=796.60/820.00/909.10/909.10 ms avg=1037.77 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 7.09999942779541,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.70/2.90/7.10 ms avg=2.55 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.800000190734863,
            "unit": "p95 ms",
            "range": "±7.5%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.60/22.00/23.80 ms avg=18.56 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 139.79999923706055,
            "unit": "p95 ms",
            "range": "±25.8%",
            "extra": "create index 1024x5000 50/75/90/95%=114.00/116.40/139.80/139.80 ms avg=146.24 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 144.69999980926514,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.30/140.40/144.70/144.70 ms avg=174.01 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.80000019073486,
            "unit": "p95 ms",
            "range": "±6.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.40/36.10/37.40/39.80 ms avg=37.47 ms (14 runs sampled)"
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
        "date": 1659111053048,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.50/3.00 ms avg=1.46 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.799999237060547,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.30/4.70/4.80 ms avg=2.58 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.100000381469727,
            "unit": "p95 ms",
            "range": "±6.0%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.60/9.10/9.10 ms avg=5.23 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.300000190734863,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.60/22.30/22.30 ms avg=7.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 105.5,
            "unit": "p95 ms",
            "range": "±74.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.00/34.30/39.10/105.50 ms avg=42.85 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 106.69999980926514,
            "unit": "p95 ms",
            "range": "±66.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.70/47.90/106.70/106.70 ms avg=58.56 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 125.90000057220459,
            "unit": "p95 ms",
            "range": "±66.0%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.90/72.20/125.90/125.90 ms avg=87.76 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 357.20000076293945,
            "unit": "p95 ms",
            "range": "±61.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=296.00/323.10/357.20/357.20 ms avg=391.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 653.0999994277954,
            "unit": "p95 ms",
            "range": "±83.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=569.30/583.50/653.10/653.10 ms avg=742.36 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 917.1000003814697,
            "unit": "p95 ms",
            "range": "±113.3%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=803.80/858.30/917.10/917.10 ms avg=1050.14 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.90/4.70/4.90 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.59999942779541,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/17.20/22.30/23.60 ms avg=18.89 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 143.4000005722046,
            "unit": "p95 ms",
            "range": "±33.7%",
            "extra": "create index 1024x5000 50/75/90/95%=109.70/115.50/143.40/143.40 ms avg=145.57 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146,
            "unit": "p95 ms",
            "range": "±8.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=138.80/142.80/146.00/146.00 ms avg=173.56 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.90000057220459,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.60/35.20/36.60/36.90 ms avg=36.62 ms (14 runs sampled)"
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
        "date": 1659202798497,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/2.40/3.00 ms avg=1.35 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.699999809265137,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.40/4.10/4.70 ms avg=2.50 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.5,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.70/8.50/8.50 ms avg=5.01 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.399999618530273,
            "unit": "p95 ms",
            "range": "±19.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/7.20/22.40/22.40 ms avg=7.74 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 83.79999923706055,
            "unit": "p95 ms",
            "range": "±52.8%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.00/33.20/38.90/83.80 ms avg=40.59 ms (13 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 96.69999980926514,
            "unit": "p95 ms",
            "range": "±57.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=39.50/48.10/96.70/96.70 ms avg=56.78 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 103.89999961853027,
            "unit": "p95 ms",
            "range": "±45.7%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.20/75.40/103.90/103.90 ms avg=82.86 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 351,
            "unit": "p95 ms",
            "range": "±57.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=293.80/311.30/351.00/351.00 ms avg=382.81 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 650.3999996185303,
            "unit": "p95 ms",
            "range": "±88.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=561.90/582.30/650.40/650.40 ms avg=729.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 897.1999998092651,
            "unit": "p95 ms",
            "range": "±115.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=782.10/819.30/897.20/897.20 ms avg=1020.56 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.5,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.80/3.10/6.50 ms avg=2.48 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.899999618530273,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.70/22.40/23.90 ms avg=18.55 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 132.0999994277954,
            "unit": "p95 ms",
            "range": "±26.1%",
            "extra": "create index 1024x5000 50/75/90/95%=106.00/113.40/132.10/132.10 ms avg=139.39 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 140.79999923706055,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=134.90/138.50/140.80/140.80 ms avg=170.21 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=31.80/33.30/35.90/39.00 ms avg=36.06 ms (14 runs sampled)"
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
        "date": 1659338010630,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.3000001907348633,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.60/3.30 ms avg=1.34 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.699999809265137,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/4.60/4.70 ms avg=2.59 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8,
            "unit": "p95 ms",
            "range": "±5.0%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/6.00/8.00/8.00 ms avg=4.86 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.800000190734863,
            "unit": "p95 ms",
            "range": "±18.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/7.00/21.80/21.80 ms avg=7.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 94.59999942779541,
            "unit": "p95 ms",
            "range": "±63.4%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.20/36.10/38.10/94.60 ms avg=42.62 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 116.5,
            "unit": "p95 ms",
            "range": "±77.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=38.70/45.30/116.50/116.50 ms avg=57.96 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 123.69999980926514,
            "unit": "p95 ms",
            "range": "±65.7%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.00/72.40/123.70/123.70 ms avg=83.83 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 365.6000003814697,
            "unit": "p95 ms",
            "range": "±79.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=286.00/322.10/365.60/365.60 ms avg=383.01 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 653.8999996185303,
            "unit": "p95 ms",
            "range": "±94.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=559.30/583.50/653.90/653.90 ms avg=727.99 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 862.6000003814697,
            "unit": "p95 ms",
            "range": "±79.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=783.10/813.00/862.60/862.60 ms avg=1010.60 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.100000381469727,
            "unit": "p95 ms",
            "range": "±4.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/3.00/6.10 ms avg=2.45 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.5,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.70/21.20/23.50 ms avg=18.54 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.9000005722046,
            "unit": "p95 ms",
            "range": "±26.3%",
            "extra": "create index 1024x5000 50/75/90/95%=110.60/118.00/136.90/136.90 ms avg=140.96 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.29999923706055,
            "unit": "p95 ms",
            "range": "±13.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.40/141.20/145.30/145.30 ms avg=166.94 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 35,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=30.80/33.20/34.60/35.00 ms avg=35.16 ms (15 runs sampled)"
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
        "date": 1659339846778,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.90000057220459,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.50/2.90 ms avg=1.27 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.80/2.90/4.10/4.80 ms avg=2.53 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.399999618530273,
            "unit": "p95 ms",
            "range": "±2.5%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.90/5.80/6.40/6.40 ms avg=4.70 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.800000190734863,
            "unit": "p95 ms",
            "range": "±18.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.30/21.80/21.80 ms avg=6.97 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 119.10000038146973,
            "unit": "p95 ms",
            "range": "±87.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.10/34.40/38.60/119.10 ms avg=45.67 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 99.30000019073486,
            "unit": "p95 ms",
            "range": "±59.0%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.30/46.40/99.30/99.30 ms avg=56.90 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 98.89999961853027,
            "unit": "p95 ms",
            "range": "±40.0%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.90/80.60/98.90/98.90 ms avg=83.64 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 349,
            "unit": "p95 ms",
            "range": "±47.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.20/319.50/349.00/349.00 ms avg=395.84 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 655.6000003814697,
            "unit": "p95 ms",
            "range": "±85.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=570.50/597.20/655.60/655.60 ms avg=743.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 878.3000001907349,
            "unit": "p95 ms",
            "range": "±99.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=779.20/823.90/878.30/878.30 ms avg=1012.06 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.40/4.70/5.30 ms avg=2.47 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.199999809265137,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.70/22.10/23.20 ms avg=18.61 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 130.30000019073486,
            "unit": "p95 ms",
            "range": "±21.1%",
            "extra": "create index 1024x5000 50/75/90/95%=109.20/113.50/130.30/130.30 ms avg=140.59 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 136,
            "unit": "p95 ms",
            "range": "±7.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=128.90/135.60/136.00/136.00 ms avg=166.03 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 35.39999961853027,
            "unit": "p95 ms",
            "range": "±5.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=29.70/33.20/34.70/35.40 ms avg=34.15 ms (15 runs sampled)"
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
        "date": 1659389826201,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/2.50/3.00 ms avg=1.38 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.40000057220459,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.40/5.00/5.40 ms avg=2.71 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.699999809265137,
            "unit": "p95 ms",
            "range": "±1.5%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=4.30/5.60/5.70/5.70 ms avg=4.86 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.200000762939453,
            "unit": "p95 ms",
            "range": "±18.9%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/8.40/22.20/22.20 ms avg=7.89 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 143.89999961853027,
            "unit": "p95 ms",
            "range": "±111.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.20/37.60/143.90/143.90 ms avg=50.45 ms (10 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 143.39999961853027,
            "unit": "p95 ms",
            "range": "±100.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.80/56.70/143.40/143.40 ms avg=65.24 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 119.90000057220459,
            "unit": "p95 ms",
            "range": "±50.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=69.10/73.80/119.90/119.90 ms avg=89.84 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 394.69999980926514,
            "unit": "p95 ms",
            "range": "±14.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=380.40/382.40/394.70/394.70 ms avg=485.21 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 654.2999992370605,
            "unit": "p95 ms",
            "range": "±73.0%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=581.30/603.90/654.30/654.30 ms avg=755.47 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 899.8000001907349,
            "unit": "p95 ms",
            "range": "±80.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=819.30/835.30/899.80/899.80 ms avg=1052.99 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.100000381469727,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.90/5.10/5.10 ms avg=2.56 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.59999942779541,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=17.40/17.80/22.90/24.60 ms avg=19.69 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 133.5,
            "unit": "p95 ms",
            "range": "±25.9%",
            "extra": "create index 1024x5000 50/75/90/95%=107.60/116.00/133.50/133.50 ms avg=141.76 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=137.80/142.80/143.00/143.00 ms avg=175.33 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 35.10000038146973,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.40/33.40/34.80/35.10 ms avg=36.09 ms (14 runs sampled)"
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
        "date": 1659389991140,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000003814697266,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.20/3.10/3.10 ms avg=1.43 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.70/4.70/5.00 ms avg=2.65 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 10,
            "unit": "p95 ms",
            "range": "±7.1%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.80/10.00/10.00 ms avg=5.19 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.899999618530273,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/7.00/21.90/21.90 ms avg=7.74 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 95.69999980926514,
            "unit": "p95 ms",
            "range": "±63.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.10/35.10/39.80/95.70 ms avg=43.04 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 109.10000038146973,
            "unit": "p95 ms",
            "range": "±70.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=38.90/44.90/109.10/109.10 ms avg=57.23 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 93.30000019073486,
            "unit": "p95 ms",
            "range": "±33.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.80/70.90/93.30/93.30 ms avg=81.27 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 569,
            "unit": "p95 ms",
            "range": "±274.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=294.40/364.40/569.00/569.00 ms avg=429.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 642.5999994277954,
            "unit": "p95 ms",
            "range": "±68.0%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=574.60/590.80/642.60/642.60 ms avg=740.41 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 852.6000003814697,
            "unit": "p95 ms",
            "range": "±53.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=798.90/833.20/852.60/852.60 ms avg=1025.51 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.90000057220459,
            "unit": "p95 ms",
            "range": "±3.7%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.60/2.90/5.90 ms avg=2.44 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.199999809265137,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.90/22.90/23.20 ms avg=18.70 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142.69999980926514,
            "unit": "p95 ms",
            "range": "±32.4%",
            "extra": "create index 1024x5000 50/75/90/95%=110.30/119.60/142.70/142.70 ms avg=144.63 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 148.60000038146973,
            "unit": "p95 ms",
            "range": "±12.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.40/147.30/148.60/148.60 ms avg=171.71 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.80000019073486,
            "unit": "p95 ms",
            "range": "±5.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.10/36.30/37.50/38.80 ms avg=37.35 ms (14 runs sampled)"
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
        "date": 1659390437368,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.60/3.00 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.50/4.50/5.20 ms avg=2.56 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.5,
            "unit": "p95 ms",
            "range": "±5.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/6.70/8.50/8.50 ms avg=5.16 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.799999237060547,
            "unit": "p95 ms",
            "range": "±19.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.60/22.80/22.80 ms avg=7.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 76.19999980926514,
            "unit": "p95 ms",
            "range": "±44.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.00/34.80/36.80/76.20 ms avg=40.62 ms (13 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 74.69999980926514,
            "unit": "p95 ms",
            "range": "±33.1%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.60/52.90/74.70/74.70 ms avg=56.06 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 125.79999923706055,
            "unit": "p95 ms",
            "range": "±64.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.50/73.40/125.80/125.80 ms avg=86.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 362.80000019073486,
            "unit": "p95 ms",
            "range": "±69.0%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=293.80/330.00/362.80/362.80 ms avg=390.96 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 631.1999998092651,
            "unit": "p95 ms",
            "range": "±62.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=568.60/574.40/631.20/631.20 ms avg=731.59 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 866,
            "unit": "p95 ms",
            "range": "±51.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=816.20/828.50/866.00/866.00 ms avg=1023.09 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.800000190734863,
            "unit": "p95 ms",
            "range": "±4.9%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.80/3.00/6.80 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.50/21.90/23.00 ms avg=18.34 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 137,
            "unit": "p95 ms",
            "range": "±30.8%",
            "extra": "create index 1024x5000 50/75/90/95%=106.20/115.80/137.00/137.00 ms avg=140.19 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 139.39999961853027,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.80/136.10/139.40/139.40 ms avg=168.43 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.39999961853027,
            "unit": "p95 ms",
            "range": "±8.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=31.00/35.30/36.90/39.40 ms avg=35.87 ms (14 runs sampled)"
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
        "date": 1659390603306,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999996185302734,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.50/2.90 ms avg=1.43 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/4.70/4.90 ms avg=2.51 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.899999618530273,
            "unit": "p95 ms",
            "range": "±5.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.60/8.90/8.90 ms avg=4.97 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.60/22.00/22.00 ms avg=7.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 141.39999961853027,
            "unit": "p95 ms",
            "range": "±103.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=37.50/39.50/141.40/141.40 ms avg=57.24 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 93.69999980926514,
            "unit": "p95 ms",
            "range": "±49.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.10/46.00/93.70/93.70 ms avg=58.02 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 96.19999980926514,
            "unit": "p95 ms",
            "range": "±35.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=60.70/73.60/96.20/96.20 ms avg=81.83 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 344.6000003814697,
            "unit": "p95 ms",
            "range": "±44.5%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=300.10/302.20/344.60/344.60 ms avg=387.89 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 657.6000003814697,
            "unit": "p95 ms",
            "range": "±80.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=576.80/588.40/657.60/657.60 ms avg=743.06 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 882.9000005722046,
            "unit": "p95 ms",
            "range": "±87.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=795.40/805.90/882.90/882.90 ms avg=1019.44 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.600000381469727,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.60/4.50/4.60 ms avg=2.43 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.5,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/17.30/23.00/23.50 ms avg=18.98 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 143.5999994277954,
            "unit": "p95 ms",
            "range": "±38.0%",
            "extra": "create index 1024x5000 50/75/90/95%=105.60/112.20/143.60/143.60 ms avg=140.07 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 137.69999980926514,
            "unit": "p95 ms",
            "range": "±5.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.20/136.10/137.70/137.70 ms avg=168.94 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.10000038146973,
            "unit": "p95 ms",
            "range": "±9.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=31.90/34.30/40.60/41.10 ms avg=36.42 ms (14 runs sampled)"
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
        "date": 1659401824832,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.3000001907348633,
            "unit": "p95 ms",
            "range": "±2.2%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.70/3.30 ms avg=1.33 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.60/4.00/4.80 ms avg=2.62 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.800000190734863,
            "unit": "p95 ms",
            "range": "±5.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/6.20/8.80/8.80 ms avg=5.19 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.100000381469727,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/6.50/22.10/22.10 ms avg=7.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 78,
            "unit": "p95 ms",
            "range": "±43.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.00/38.80/44.30/78.00 ms avg=42.98 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 103.80000019073486,
            "unit": "p95 ms",
            "range": "±58.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=45.60/59.40/103.80/103.80 ms avg=63.06 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 98.30000019073486,
            "unit": "p95 ms",
            "range": "±38.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.80/76.30/98.30/98.30 ms avg=82.79 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 358.30000019073486,
            "unit": "p95 ms",
            "range": "±54.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=304.10/322.80/358.30/358.30 ms avg=395.64 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 620.3999996185303,
            "unit": "p95 ms",
            "range": "±49.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=571.30/580.90/620.40/620.40 ms avg=732.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 880,
            "unit": "p95 ms",
            "range": "±98.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=781.60/813.80/880.00/880.00 ms avg=1019.84 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.399999618530273,
            "unit": "p95 ms",
            "range": "±4.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.80/3.60/6.40 ms avg=2.52 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.399999618530273,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/17.20/22.40/23.40 ms avg=18.64 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 135.5999994277954,
            "unit": "p95 ms",
            "range": "±30.5%",
            "extra": "create index 1024x5000 50/75/90/95%=105.10/114.40/135.60/135.60 ms avg=138.37 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143.89999961853027,
            "unit": "p95 ms",
            "range": "±11.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.40/139.70/143.90/143.90 ms avg=169.37 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.09999942779541,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.70/37.20/38.30/39.10 ms avg=37.27 ms (14 runs sampled)"
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
        "date": 1659456053392,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.60/3.00 ms avg=1.44 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.700000762939453,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.40/2.50/4.70 ms avg=2.37 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.700000762939453,
            "unit": "p95 ms",
            "range": "±5.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/7.00/8.70/8.70 ms avg=5.26 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999942779541,
            "unit": "p95 ms",
            "range": "±18.9%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.60/22.10/22.10 ms avg=7.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 104.89999961853027,
            "unit": "p95 ms",
            "range": "±73.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.60/34.80/39.80/104.90 ms avg=43.60 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 111.89999961853027,
            "unit": "p95 ms",
            "range": "±71.9%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.00/47.40/111.90/111.90 ms avg=58.82 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 151.69999980926514,
            "unit": "p95 ms",
            "range": "±89.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.50/74.00/151.70/151.70 ms avg=93.16 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 364.19999980926514,
            "unit": "p95 ms",
            "range": "±56.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=307.40/324.70/364.20/364.20 ms avg=399.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 655,
            "unit": "p95 ms",
            "range": "±83.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=571.30/610.10/655.00/655.00 ms avg=745.61 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 906.1999998092651,
            "unit": "p95 ms",
            "range": "±97.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=808.80/835.00/906.20/906.20 ms avg=1049.29 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.70/4.60/4.80 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.199999809265137,
            "unit": "p95 ms",
            "range": "±6.5%",
            "extra": "scan 1024x10000 50/75/90/95%=16.70/17.10/22.80/23.20 ms avg=18.95 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 145.80000019073486,
            "unit": "p95 ms",
            "range": "±36.8%",
            "extra": "create index 1024x5000 50/75/90/95%=109.00/119.30/145.80/145.80 ms avg=145.79 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 141.69999980926514,
            "unit": "p95 ms",
            "range": "±5.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.80/141.00/141.70/141.70 ms avg=172.64 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 40.80000019073486,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.90/35.20/38.70/40.80 ms avg=37.85 ms (14 runs sampled)"
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
        "date": 1659456524584,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/1.60/3.00 ms avg=1.38 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.10/2.40/4.80/5.30 ms avg=2.74 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.399999618530273,
            "unit": "p95 ms",
            "range": "±5.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/5.30/8.40/8.40 ms avg=4.76 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.199999809265137,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/6.70/22.20/22.20 ms avg=7.36 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 120.19999980926514,
            "unit": "p95 ms",
            "range": "±88.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.90/34.20/46.90/120.20 ms avg=46.85 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 108.29999923706055,
            "unit": "p95 ms",
            "range": "±68.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=39.50/46.20/108.30/108.30 ms avg=58.02 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 127.59999942779541,
            "unit": "p95 ms",
            "range": "±63.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=64.00/70.70/127.60/127.60 ms avg=89.93 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 363.19999980926514,
            "unit": "p95 ms",
            "range": "±64.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.10/330.10/363.20/363.20 ms avg=396.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 647,
            "unit": "p95 ms",
            "range": "±63.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=583.20/596.90/647.00/647.00 ms avg=756.51 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 903.7999992370605,
            "unit": "p95 ms",
            "range": "±96.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=807.10/842.00/903.80/903.80 ms avg=1046.17 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.600000381469727,
            "unit": "p95 ms",
            "range": "±4.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/2.80/6.60 ms avg=2.42 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 22.600000381469727,
            "unit": "p95 ms",
            "range": "±5.6%",
            "extra": "scan 1024x10000 50/75/90/95%=17.00/17.30/22.50/22.60 ms avg=19.16 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 140.19999980926514,
            "unit": "p95 ms",
            "range": "±30.1%",
            "extra": "create index 1024x5000 50/75/90/95%=110.10/116.70/140.20/140.20 ms avg=144.03 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143.69999980926514,
            "unit": "p95 ms",
            "range": "±9.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=134.70/137.80/143.70/143.70 ms avg=170.69 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.39999961853027,
            "unit": "p95 ms",
            "range": "±4.6%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.90/35.60/37.10/37.40 ms avg=37.63 ms (14 runs sampled)"
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
        "date": 1659843949881,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.3999996185302734,
            "unit": "p95 ms",
            "range": "±2.3%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.70/3.40 ms avg=1.41 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.5,
            "unit": "p95 ms",
            "range": "±2.5%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.20/2.80/4.50 ms avg=2.38 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.399999618530273,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/4.70/5.40/5.40 ms avg=4.56 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.300000190734863,
            "unit": "p95 ms",
            "range": "±18.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/6.70/21.30/21.30 ms avg=7.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 126.60000038146973,
            "unit": "p95 ms",
            "range": "±95.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.30/34.10/46.90/126.60 ms avg=47.17 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 143,
            "unit": "p95 ms",
            "range": "±99.7%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.30/58.40/143.00/143.00 ms avg=66.20 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 124.90000057220459,
            "unit": "p95 ms",
            "range": "±62.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.80/73.10/124.90/124.90 ms avg=88.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 363.1000003814697,
            "unit": "p95 ms",
            "range": "±61.0%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=302.10/327.00/363.10/363.10 ms avg=399.94 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 634.2000007629395,
            "unit": "p95 ms",
            "range": "±58.3%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=575.90/597.00/634.20/634.20 ms avg=743.19 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 867.2999992370605,
            "unit": "p95 ms",
            "range": "±80.2%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=787.10/812.80/867.30/867.30 ms avg=1018.16 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.40000057220459,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.60/5.40 ms avg=2.47 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.699999809265137,
            "unit": "p95 ms",
            "range": "±8.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/16.90/22.30/24.70 ms avg=18.62 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 144.5,
            "unit": "p95 ms",
            "range": "±33.5%",
            "extra": "create index 1024x5000 50/75/90/95%=111.00/120.10/144.50/144.50 ms avg=147.07 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 140,
            "unit": "p95 ms",
            "range": "±5.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.80/138.50/140.00/140.00 ms avg=170.71 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 47.80000019073486,
            "unit": "p95 ms",
            "range": "±14.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.00/34.90/35.60/47.80 ms avg=37.47 ms (14 runs sampled)"
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
        "date": 1659890534967,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.90000057220459,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/1.60/2.90 ms avg=1.31 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±3.0%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.60/4.20/4.90 ms avg=2.47 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6,
            "unit": "p95 ms",
            "range": "±2.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.80/5.80/6.00/6.00 ms avg=4.90 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.09999942779541,
            "unit": "p95 ms",
            "range": "±18.9%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.40/22.10/22.10 ms avg=7.09 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 98.10000038146973,
            "unit": "p95 ms",
            "range": "±67.5%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=30.60/33.00/40.30/98.10 ms avg=41.92 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 98.80000019073486,
            "unit": "p95 ms",
            "range": "±58.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.60/47.60/98.80/98.80 ms avg=57.44 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 100.60000038146973,
            "unit": "p95 ms",
            "range": "±42.0%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=58.60/79.70/100.60/100.60 ms avg=83.74 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 356.80000019073486,
            "unit": "p95 ms",
            "range": "±38.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=318.10/324.30/356.80/356.80 ms avg=402.99 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 655.3999996185303,
            "unit": "p95 ms",
            "range": "±70.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=584.50/600.60/655.40/655.40 ms avg=748.81 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 906.0999994277954,
            "unit": "p95 ms",
            "range": "±100.9%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=805.20/837.70/906.10/906.10 ms avg=1041.10 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.800000190734863,
            "unit": "p95 ms",
            "range": "±3.7%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/3.00/5.80 ms avg=2.42 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 22.799999237060547,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.70/21.60/22.80 ms avg=18.56 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 143.39999961853027,
            "unit": "p95 ms",
            "range": "±32.0%",
            "extra": "create index 1024x5000 50/75/90/95%=111.40/113.10/143.40/143.40 ms avg=143.94 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146.39999961853027,
            "unit": "p95 ms",
            "range": "±15.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.10/136.10/146.40/146.40 ms avg=167.31 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36.69999980926514,
            "unit": "p95 ms",
            "range": "±5.4%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=31.30/33.20/35.90/36.70 ms avg=35.13 ms (15 runs sampled)"
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
        "date": 1660596449915,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.90000057220459,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.60/2.90 ms avg=1.41 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/2.90/4.80 ms avg=2.38 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.40000057220459,
            "unit": "p95 ms",
            "range": "±6.3%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.40/9.40/9.40 ms avg=5.00 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.800000190734863,
            "unit": "p95 ms",
            "range": "±18.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.60/21.80/21.80 ms avg=7.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 105.69999980926514,
            "unit": "p95 ms",
            "range": "±72.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.80/35.60/39.50/105.70 ms avg=43.91 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 103.40000057220459,
            "unit": "p95 ms",
            "range": "±61.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.60/47.20/103.40/103.40 ms avg=58.70 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 114.30000019073486,
            "unit": "p95 ms",
            "range": "±52.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=61.50/77.90/114.30/114.30 ms avg=86.49 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 365.5,
            "unit": "p95 ms",
            "range": "±61.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=304.40/332.10/365.50/365.50 ms avg=399.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 634.1999998092651,
            "unit": "p95 ms",
            "range": "±51.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=582.60/593.20/634.20/634.20 ms avg=744.59 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 871.6000003814697,
            "unit": "p95 ms",
            "range": "±62.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=808.80/825.50/871.60/871.60 ms avg=1042.04 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.90000057220459,
            "unit": "p95 ms",
            "range": "±5.0%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.70/3.30/6.90 ms avg=2.53 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.200000762939453,
            "unit": "p95 ms",
            "range": "±7.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.60/16.80/22.60/24.20 ms avg=18.71 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 144.80000019073486,
            "unit": "p95 ms",
            "range": "±30.7%",
            "extra": "create index 1024x5000 50/75/90/95%=114.10/118.00/144.80/144.80 ms avg=149.56 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 145.69999980926514,
            "unit": "p95 ms",
            "range": "±9.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=136.00/138.20/145.70/145.70 ms avg=173.60 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.30000019073486,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=31.10/34.10/35.00/38.30 ms avg=34.91 ms (15 runs sampled)"
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
        "date": 1660903347874,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8000001907348633,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.60/2.80 ms avg=1.36 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.299999237060547,
            "unit": "p95 ms",
            "range": "±3.5%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.80/2.50/4.70/5.30 ms avg=2.49 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.399999618530273,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/4.90/5.40/5.40 ms avg=4.13 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.799999237060547,
            "unit": "p95 ms",
            "range": "±18.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.90/21.80/21.80 ms avg=7.04 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 81.09999942779541,
            "unit": "p95 ms",
            "range": "±45.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.50/46.10/64.20/81.10 ms avg=47.63 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 73.69999980926514,
            "unit": "p95 ms",
            "range": "±32.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.50/52.30/73.70/73.70 ms avg=56.27 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 127.60000038146973,
            "unit": "p95 ms",
            "range": "±68.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.00/74.80/127.60/127.60 ms avg=86.96 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 362.3999996185303,
            "unit": "p95 ms",
            "range": "±64.2%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=298.20/322.90/362.40/362.40 ms avg=392.01 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 667.9000005722046,
            "unit": "p95 ms",
            "range": "±82.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=585.10/602.50/667.90/667.90 ms avg=762.54 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 898.9000005722046,
            "unit": "p95 ms",
            "range": "±107.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=791.80/810.00/898.90/898.90 ms avg=1024.30 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6,
            "unit": "p95 ms",
            "range": "±3.9%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/3.00/6.00 ms avg=2.45 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.5,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=17.30/17.70/22.90/24.50 ms avg=19.66 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 132.4000005722046,
            "unit": "p95 ms",
            "range": "±25.7%",
            "extra": "create index 1024x5000 50/75/90/95%=106.70/112.50/132.40/132.40 ms avg=141.16 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 160.5,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=141.40/147.00/160.50/160.50 ms avg=181.71 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.30/34.40/35.80/36.00 ms avg=36.96 ms (14 runs sampled)"
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
        "date": 1660928239851,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1999998092651367,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.80/3.20 ms avg=1.44 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.899999618530273,
            "unit": "p95 ms",
            "range": "±3.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.20/3.90/5.20/5.90 ms avg=3.07 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.90000057220459,
            "unit": "p95 ms",
            "range": "±5.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.20/8.90/8.90 ms avg=4.96 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.200000762939453,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/6.60/22.20/22.20 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 110.59999942779541,
            "unit": "p95 ms",
            "range": "±78.2%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.40/34.50/38.60/110.60 ms avg=43.86 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 101.59999942779541,
            "unit": "p95 ms",
            "range": "±59.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.40/48.40/101.60/101.60 ms avg=59.97 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 99.10000038146973,
            "unit": "p95 ms",
            "range": "±36.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.50/77.00/99.10/99.10 ms avg=85.77 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 359.79999923706055,
            "unit": "p95 ms",
            "range": "±61.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=298.00/322.00/359.80/359.80 ms avg=393.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 665.5,
            "unit": "p95 ms",
            "range": "±62.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=602.60/621.90/665.50/665.50 ms avg=783.01 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 938.5,
            "unit": "p95 ms",
            "range": "±89.9%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=848.60/857.40/938.50/938.50 ms avg=1094.91 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.40000057220459,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.60/3.00/6.40 ms avg=2.55 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.100000381469727,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=17.50/18.00/22.50/24.10 ms avg=19.91 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142,
            "unit": "p95 ms",
            "range": "±27.6%",
            "extra": "create index 1024x5000 50/75/90/95%=114.40/117.80/142.00/142.00 ms avg=149.33 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 150.5,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=143.60/145.70/150.50/150.50 ms avg=182.09 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.90000057220459,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.60/37.50/38.10/39.90 ms avg=40.57 ms (13 runs sampled)"
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
        "date": 1660945366958,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.09999942779541,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/2.50/3.10 ms avg=1.43 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.70/4.70/4.80 ms avg=2.59 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 7.800000190734863,
            "unit": "p95 ms",
            "range": "±4.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.50/7.80/7.80 ms avg=4.74 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.300000190734863,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.60/22.30/22.30 ms avg=7.17 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 78.80000019073486,
            "unit": "p95 ms",
            "range": "±43.9%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.90/38.80/45.80/78.80 ms avg=43.33 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 98.30000019073486,
            "unit": "p95 ms",
            "range": "±57.3%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=41.00/51.00/98.30/98.30 ms avg=57.44 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 126.89999961853027,
            "unit": "p95 ms",
            "range": "±64.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.00/75.70/126.90/126.90 ms avg=89.04 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 354.5,
            "unit": "p95 ms",
            "range": "±60.5%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=294.00/327.40/354.50/354.50 ms avg=390.94 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 647.1000003814697,
            "unit": "p95 ms",
            "range": "±74.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=572.40/593.70/647.10/647.10 ms avg=735.49 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 902.5,
            "unit": "p95 ms",
            "range": "±110.9%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=791.60/843.90/902.50/902.50 ms avg=1029.03 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.799999237060547,
            "unit": "p95 ms",
            "range": "±3.7%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/4.80/5.80 ms avg=2.55 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24,
            "unit": "p95 ms",
            "range": "±7.8%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/17.00/22.60/24.00 ms avg=18.62 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 134.19999980926514,
            "unit": "p95 ms",
            "range": "±27.9%",
            "extra": "create index 1024x5000 50/75/90/95%=106.30/118.40/134.20/134.20 ms avg=142.04 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 146.69999980926514,
            "unit": "p95 ms",
            "range": "±9.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=137.40/144.10/146.70/146.70 ms avg=176.64 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38,
            "unit": "p95 ms",
            "range": "±5.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.70/35.80/36.10/38.00 ms avg=36.61 ms (14 runs sampled)"
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
        "date": 1660945909995,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1000003814697266,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.20/1.60/3.10 ms avg=1.32 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±2.9%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.40/4.80/4.90 ms avg=2.60 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.199999809265137,
            "unit": "p95 ms",
            "range": "±6.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/6.80/9.20/9.20 ms avg=5.24 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.300000190734863,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.50/22.30/22.30 ms avg=7.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 123.79999923706055,
            "unit": "p95 ms",
            "range": "±92.8%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.00/35.20/38.40/123.80 ms avg=45.77 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 110.69999980926514,
            "unit": "p95 ms",
            "range": "±70.5%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.20/46.40/110.70/110.70 ms avg=58.79 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 173.5,
            "unit": "p95 ms",
            "range": "±113.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.60/72.00/173.50/173.50 ms avg=93.00 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 361.4000005722046,
            "unit": "p95 ms",
            "range": "±61.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=300.30/308.30/361.40/361.40 ms avg=392.86 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 661.6000003814697,
            "unit": "p95 ms",
            "range": "±92.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=569.10/573.10/661.60/661.60 ms avg=737.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 870.3000001907349,
            "unit": "p95 ms",
            "range": "±85.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=784.80/790.40/870.30/870.30 ms avg=1008.53 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.899999618530273,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.70/4.90 ms avg=2.48 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.800000190734863,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.50/16.70/22.00/23.80 ms avg=18.69 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 133.4000005722046,
            "unit": "p95 ms",
            "range": "±23.3%",
            "extra": "create index 1024x5000 50/75/90/95%=110.10/122.60/133.40/133.40 ms avg=145.63 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 153.5999994277954,
            "unit": "p95 ms",
            "range": "±20.7%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.90/142.00/153.60/153.60 ms avg=173.54 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.19999980926514,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=30.00/35.10/35.70/37.20 ms avg=35.11 ms (15 runs sampled)"
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
        "date": 1661350176956,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.8000001907348633,
            "unit": "p95 ms",
            "range": "±2.5%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.30/1.60/3.40/3.80 ms avg=1.73 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.59999942779541,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/5.30/5.60 ms avg=2.74 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 10.59999942779541,
            "unit": "p95 ms",
            "range": "±7.1%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/6.20/10.60/10.60 ms avg=5.71 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±19.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/7.70/23.00/23.00 ms avg=8.04 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 81.80000019073486,
            "unit": "p95 ms",
            "range": "±46.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=35.50/37.20/39.20/81.80 ms avg=43.88 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 76.60000038146973,
            "unit": "p95 ms",
            "range": "±34.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=42.00/54.90/76.60/76.60 ms avg=58.00 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 115,
            "unit": "p95 ms",
            "range": "±55.8%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=59.20/81.00/115.00/115.00 ms avg=86.66 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 364.5,
            "unit": "p95 ms",
            "range": "±60.6%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=303.90/348.10/364.50/364.50 ms avg=404.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 700.3000001907349,
            "unit": "p95 ms",
            "range": "±97.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=602.40/608.50/700.30/700.30 ms avg=780.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 937.3999996185303,
            "unit": "p95 ms",
            "range": "±99.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=837.90/849.70/937.40/937.40 ms avg=1088.06 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.50/4.80/5.50 ms avg=2.52 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.199999809265137,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "scan 1024x10000 50/75/90/95%=17.40/17.60/22.50/24.20 ms avg=19.64 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 145.80000019073486,
            "unit": "p95 ms",
            "range": "±31.2%",
            "extra": "create index 1024x5000 50/75/90/95%=114.60/120.90/145.80/145.80 ms avg=150.14 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 151.80000019073486,
            "unit": "p95 ms",
            "range": "±9.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=142.30/150.30/151.80/151.80 ms avg=183.71 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 39.69999980926514,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.50/38.30/39.40/39.70 ms avg=40.59 ms (13 runs sampled)"
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
        "date": 1661350679029,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.3999996185302734,
            "unit": "p95 ms",
            "range": "±2.1%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.30/1.40/1.80/3.40 ms avg=1.49 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.59999942779541,
            "unit": "p95 ms",
            "range": "±3.7%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.90/5.30/5.60 ms avg=2.82 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.399999618530273,
            "unit": "p95 ms",
            "range": "±6.1%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.20/9.40/9.40 ms avg=5.30 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 23.300000190734863,
            "unit": "p95 ms",
            "range": "±19.9%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/7.40/23.30/23.30 ms avg=7.46 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 140.69999980926514,
            "unit": "p95 ms",
            "range": "±106.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=34.60/38.80/140.70/140.70 ms avg=51.86 ms (10 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 101.90000057220459,
            "unit": "p95 ms",
            "range": "±58.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=43.30/60.40/101.90/101.90 ms avg=62.84 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 116.39999961853027,
            "unit": "p95 ms",
            "range": "±52.9%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=63.50/78.80/116.40/116.40 ms avg=90.37 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 368.80000019073486,
            "unit": "p95 ms",
            "range": "±65.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=303.10/322.80/368.80/368.80 ms avg=399.76 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 709.8999996185303,
            "unit": "p95 ms",
            "range": "±93.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=616.30/652.00/709.90/709.90 ms avg=807.11 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 950.1999998092651,
            "unit": "p95 ms",
            "range": "±96.6%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=853.60/930.60/950.20/950.20 ms avg=1113.14 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 7.5,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "scan 1024x1000 50/75/90/95%=2.30/2.80/3.30/7.50 ms avg=2.66 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.799999237060547,
            "unit": "p95 ms",
            "range": "±7.3%",
            "extra": "scan 1024x10000 50/75/90/95%=17.50/17.80/22.60/24.80 ms avg=19.85 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 153.60000038146973,
            "unit": "p95 ms",
            "range": "±36.5%",
            "extra": "create index 1024x5000 50/75/90/95%=117.10/122.90/153.60/153.60 ms avg=155.60 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 154.5,
            "unit": "p95 ms",
            "range": "±14.0%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=140.50/148.40/154.50/154.50 ms avg=180.70 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 40.19999980926514,
            "unit": "p95 ms",
            "range": "±6.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=37.00/39.30/39.90/40.20 ms avg=40.92 ms (13 runs sampled)"
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
        "date": 1661460506956,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.1999998092651367,
            "unit": "p95 ms",
            "range": "±2.0%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/2.70/3.20 ms avg=1.49 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.40/4.80/5.30 ms avg=2.66 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.59999942779541,
            "unit": "p95 ms",
            "range": "±6.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/5.70/9.60/9.60 ms avg=5.03 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.199999809265137,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/7.60/22.20/22.20 ms avg=7.89 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 113.59999942779541,
            "unit": "p95 ms",
            "range": "±80.0%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.60/35.40/40.80/113.60 ms avg=46.35 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 109,
            "unit": "p95 ms",
            "range": "±64.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=44.60/60.50/109.00/109.00 ms avg=64.19 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 124.69999980926514,
            "unit": "p95 ms",
            "range": "±62.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.50/76.00/124.70/124.70 ms avg=90.11 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 360.9000005722046,
            "unit": "p95 ms",
            "range": "±61.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.20/329.70/360.90/360.90 ms avg=392.60 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 665.3000001907349,
            "unit": "p95 ms",
            "range": "±70.6%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=594.70/610.70/665.30/665.30 ms avg=767.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 920.6000003814697,
            "unit": "p95 ms",
            "range": "±97.9%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=822.70/845.40/920.60/920.60 ms avg=1065.14 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.5,
            "unit": "p95 ms",
            "range": "±4.4%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/2.80/6.50 ms avg=2.48 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.800000190734863,
            "unit": "p95 ms",
            "range": "±6.2%",
            "extra": "scan 1024x10000 50/75/90/95%=17.60/17.90/23.20/23.80 ms avg=19.92 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.10000038146973,
            "unit": "p95 ms",
            "range": "±25.1%",
            "extra": "create index 1024x5000 50/75/90/95%=111.00/120.40/136.10/136.10 ms avg=146.46 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 153.4000005722046,
            "unit": "p95 ms",
            "range": "±15.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=137.90/144.70/153.40/153.40 ms avg=176.69 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.10000038146973,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=32.90/35.20/36.30/37.10 ms avg=36.70 ms (14 runs sampled)"
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
        "date": 1661521100084,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.6999998092651367,
            "unit": "p95 ms",
            "range": "±2.5%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.70/3.70 ms avg=1.49 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.09999942779541,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.60/4.90/5.10 ms avg=2.67 ms (14 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 7.5,
            "unit": "p95 ms",
            "range": "±4.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.80/5.20/7.50/7.50 ms avg=4.81 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.40000057220459,
            "unit": "p95 ms",
            "range": "±19.0%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.70/22.40/22.40 ms avg=7.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 119.19999980926514,
            "unit": "p95 ms",
            "range": "±85.8%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.40/36.00/39.30/119.20 ms avg=47.16 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 114.5,
            "unit": "p95 ms",
            "range": "±67.1%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=47.40/57.00/114.50/114.50 ms avg=63.90 ms (8 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 120.19999980926514,
            "unit": "p95 ms",
            "range": "±57.4%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.80/75.90/120.20/120.20 ms avg=88.54 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 362.30000019073486,
            "unit": "p95 ms",
            "range": "±60.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=301.90/322.80/362.30/362.30 ms avg=395.94 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 672.7000007629395,
            "unit": "p95 ms",
            "range": "±84.7%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=588.00/606.80/672.70/672.70 ms avg=759.84 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 912,
            "unit": "p95 ms",
            "range": "±92.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=819.20/843.30/912.00/912.00 ms avg=1064.79 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.700000762939453,
            "unit": "p95 ms",
            "range": "±4.5%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/2.80/6.70 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.90000057220459,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=17.30/17.60/22.30/23.90 ms avg=19.66 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 142.19999980926514,
            "unit": "p95 ms",
            "range": "±31.5%",
            "extra": "create index 1024x5000 50/75/90/95%=110.70/118.20/142.20/142.20 ms avg=146.26 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 149.5999994277954,
            "unit": "p95 ms",
            "range": "±14.2%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=135.40/142.30/149.60/149.60 ms avg=175.33 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 43.69999980926514,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=36.50/37.00/40.00/43.70 ms avg=39.62 ms (13 runs sampled)"
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
        "date": 1661522329976,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.8999996185302734,
            "unit": "p95 ms",
            "range": "±1.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.40/1.60/2.90 ms avg=1.40 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.60/4.90/5.30 ms avg=2.65 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.199999809265137,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/5.90/8.20/8.20 ms avg=4.83 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.799999237060547,
            "unit": "p95 ms",
            "range": "±19.6%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.70/22.80/22.80 ms avg=7.27 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 90.5,
            "unit": "p95 ms",
            "range": "±59.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.40/33.40/47.70/90.50 ms avg=42.68 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 103.30000019073486,
            "unit": "p95 ms",
            "range": "±63.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=40.10/48.00/103.30/103.30 ms avg=58.36 ms (9 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 108.09999942779541,
            "unit": "p95 ms",
            "range": "±46.1%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=62.00/76.10/108.10/108.10 ms avg=86.29 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 365.3999996185303,
            "unit": "p95 ms",
            "range": "±65.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.60/322.90/365.40/365.40 ms avg=398.37 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 652.8999996185303,
            "unit": "p95 ms",
            "range": "±67.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=585.40/610.80/652.90/652.90 ms avg=761.46 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 934.3999996185303,
            "unit": "p95 ms",
            "range": "±115.8%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=818.60/838.40/934.40/934.40 ms avg=1065.39 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.5,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/4.90/5.50 ms avg=2.51 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 25.199999809265137,
            "unit": "p95 ms",
            "range": "±7.8%",
            "extra": "scan 1024x10000 50/75/90/95%=17.40/17.80/23.20/25.20 ms avg=19.75 ms (19 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.39999961853027,
            "unit": "p95 ms",
            "range": "±14.3%",
            "extra": "create index 1024x5000 50/75/90/95%=122.10/123.50/136.40/136.40 ms avg=153.33 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 143.79999923706055,
            "unit": "p95 ms",
            "range": "±6.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=139.80/142.50/143.80/143.80 ms avg=176.19 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.10000038146973,
            "unit": "p95 ms",
            "range": "±5.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=35.90/37.50/40.00/41.10 ms avg=40.13 ms (13 runs sampled)"
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
        "date": 1661787734768,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/2.80/3.00 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.600000381469727,
            "unit": "p95 ms",
            "range": "±3.6%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.60/4.40/5.60 ms avg=2.51 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 8.5,
            "unit": "p95 ms",
            "range": "±5.5%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.00/6.30/8.50/8.50 ms avg=5.21 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.600000381469727,
            "unit": "p95 ms",
            "range": "±19.2%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.50/22.60/22.60 ms avg=7.31 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 119,
            "unit": "p95 ms",
            "range": "±88.1%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=30.90/33.80/39.20/119.00 ms avg=44.10 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 151.80000019073486,
            "unit": "p95 ms",
            "range": "±99.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=52.60/64.40/151.80/151.80 ms avg=83.57 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 217.69999980926514,
            "unit": "p95 ms",
            "range": "±145.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=72.50/84.80/217.70/217.70 ms avg=113.27 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 358.0999994277954,
            "unit": "p95 ms",
            "range": "±61.1%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=297.00/307.40/358.10/358.10 ms avg=389.54 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 684,
            "unit": "p95 ms",
            "range": "±89.5%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=594.50/603.10/684.00/684.00 ms avg=765.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 911,
            "unit": "p95 ms",
            "range": "±107.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=803.60/814.50/911.00/911.00 ms avg=1043.66 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/3.90/4.80 ms avg=2.46 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 22.59999942779541,
            "unit": "p95 ms",
            "range": "±6.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.50/21.30/22.60 ms avg=18.38 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 578,
            "unit": "p95 ms",
            "range": "±13.6%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=564.40/571.80/578.00/578.00 ms avg=715.39 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.70000076293945,
            "unit": "p95 ms",
            "range": "±31.7%",
            "extra": "create index 1024x5000 50/75/90/95%=105.00/120.60/136.70/136.70 ms avg=140.69 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 135.9000005722046,
            "unit": "p95 ms",
            "range": "±3.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=132.40/133.70/135.90/135.90 ms avg=166.77 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 41.5,
            "unit": "p95 ms",
            "range": "±12.8%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=28.70/30.10/34.10/41.50 ms avg=32.59 ms (16 runs sampled)"
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
        "date": 1661864743137,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 2.90000057220459,
            "unit": "p95 ms",
            "range": "±1.8%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.20/1.50/2.90 ms avg=1.28 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.200000762939453,
            "unit": "p95 ms",
            "range": "±3.4%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.80/2.60/4.50/5.20 ms avg=2.52 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 9.5,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.90/4.90/9.50/9.50 ms avg=4.86 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.699999809265137,
            "unit": "p95 ms",
            "range": "±19.5%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.40/22.70/22.70 ms avg=7.14 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 134.30000019073486,
            "unit": "p95 ms",
            "range": "±102.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.70/35.50/39.10/134.30 ms avg=47.35 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 154.5,
            "unit": "p95 ms",
            "range": "±99.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=55.10/63.00/154.50/154.50 ms avg=84.14 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 223.89999961853027,
            "unit": "p95 ms",
            "range": "±147.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=76.70/81.20/223.90/223.90 ms avg=115.87 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 397.80000019073486,
            "unit": "p95 ms",
            "range": "±96.9%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=300.90/316.90/397.80/397.80 ms avg=398.13 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 670.3999996185303,
            "unit": "p95 ms",
            "range": "±76.4%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=594.00/608.70/670.40/670.40 ms avg=766.21 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 902.1999998092651,
            "unit": "p95 ms",
            "range": "±88.4%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=813.80/826.60/902.20/902.20 ms avg=1050.39 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.2%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.60/4.80/5.20 ms avg=2.50 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.100000381469727,
            "unit": "p95 ms",
            "range": "±7.7%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.90/22.60/24.10 ms avg=18.83 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 588.1999998092651,
            "unit": "p95 ms",
            "range": "±32.5%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=555.70/562.30/588.20/588.20 ms avg=703.54 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 137.80000019073486,
            "unit": "p95 ms",
            "range": "±28.8%",
            "extra": "create index 1024x5000 50/75/90/95%=109.00/122.50/137.80/137.80 ms avg=143.46 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 138.69999980926514,
            "unit": "p95 ms",
            "range": "±7.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.60/133.30/138.70/138.70 ms avg=167.50 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38,
            "unit": "p95 ms",
            "range": "±6.3%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=34.90/36.10/37.80/38.00 ms avg=36.99 ms (14 runs sampled)"
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
        "date": 1661881052014,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/2.60/3.00 ms avg=1.40 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.100000381469727,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.30/4.90/5.10 ms avg=2.59 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.800000190734863,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/5.80/5.80/5.80 ms avg=4.64 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.700000762939453,
            "unit": "p95 ms",
            "range": "±18.4%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.30/6.60/21.70/21.70 ms avg=7.16 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 125.19999980926514,
            "unit": "p95 ms",
            "range": "±93.3%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.90/35.90/38.90/125.20 ms avg=46.74 ms (11 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 129.9000005722046,
            "unit": "p95 ms",
            "range": "±74.3%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=55.60/65.60/129.90/129.90 ms avg=81.43 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 154.39999961853027,
            "unit": "p95 ms",
            "range": "±85.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=69.20/87.20/154.40/154.40 ms avg=103.23 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 361,
            "unit": "p95 ms",
            "range": "±47.4%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=313.60/317.00/361.00/361.00 ms avg=395.06 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 681.5,
            "unit": "p95 ms",
            "range": "±98.8%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=582.70/601.30/681.50/681.50 ms avg=761.69 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 884.4000005722046,
            "unit": "p95 ms",
            "range": "±63.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=821.30/822.20/884.40/884.40 ms avg=1042.40 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.90000057220459,
            "unit": "p95 ms",
            "range": "±3.7%",
            "extra": "scan 1024x1000 50/75/90/95%=2.20/2.50/2.90/5.90 ms avg=2.43 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.100000381469727,
            "unit": "p95 ms",
            "range": "±6.9%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.70/21.10/23.10 ms avg=18.45 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 591.6999998092651,
            "unit": "p95 ms",
            "range": "±57.7%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=574.90/585.00/591.70/591.70 ms avg=705.59 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 134.5,
            "unit": "p95 ms",
            "range": "±28.3%",
            "extra": "create index 1024x5000 50/75/90/95%=106.20/116.60/134.50/134.50 ms avg=141.74 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 135,
            "unit": "p95 ms",
            "range": "±6.8%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=128.20/132.50/135.00/135.00 ms avg=163.77 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 38.30000019073486,
            "unit": "p95 ms",
            "range": "±5.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.50/35.10/36.40/38.30 ms avg=37.09 ms (14 runs sampled)"
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
        "date": 1661883194183,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/2.30/3.00 ms avg=1.35 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±3.1%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/4.50/5.00 ms avg=2.57 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5,
            "unit": "p95 ms",
            "range": "±2.3%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.70/3.10/5.00/5.00 ms avg=3.74 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.899999618530273,
            "unit": "p95 ms",
            "range": "±18.7%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/6.80/21.90/21.90 ms avg=7.16 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 109.40000057220459,
            "unit": "p95 ms",
            "range": "±76.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=32.70/34.00/39.90/109.40 ms avg=43.40 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 153.80000019073486,
            "unit": "p95 ms",
            "range": "±103.2%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=50.60/62.40/153.80/153.80 ms avg=81.86 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 155.5999994277954,
            "unit": "p95 ms",
            "range": "±87.2%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=68.40/83.20/155.60/155.60 ms avg=102.11 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 361.5999994277954,
            "unit": "p95 ms",
            "range": "±66.3%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=295.30/311.10/361.60/361.60 ms avg=388.47 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 680,
            "unit": "p95 ms",
            "range": "±87.9%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=592.10/607.60/680.00/680.00 ms avg=770.41 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 897.8999996185303,
            "unit": "p95 ms",
            "range": "±105.6%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=792.30/841.50/897.90/897.90 ms avg=1036.17 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.600000381469727,
            "unit": "p95 ms",
            "range": "±2.5%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/3.20/4.60 ms avg=2.38 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.600000381469727,
            "unit": "p95 ms",
            "range": "±7.4%",
            "extra": "scan 1024x10000 50/75/90/95%=16.20/16.50/22.10/23.60 ms avg=18.48 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 565,
            "unit": "p95 ms",
            "range": "±19.6%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=550.00/554.10/565.00/565.00 ms avg=695.39 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 132.39999961853027,
            "unit": "p95 ms",
            "range": "±29.6%",
            "extra": "create index 1024x5000 50/75/90/95%=102.80/116.30/132.40/132.40 ms avg=137.47 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 137.29999923706055,
            "unit": "p95 ms",
            "range": "±12.1%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=125.20/134.40/137.30/137.30 ms avg=162.90 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 36,
            "unit": "p95 ms",
            "range": "±6.0%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=30.00/31.40/35.10/36.00 ms avg=33.88 ms (15 runs sampled)"
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
        "date": 1661975758469,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/2.60/3.00 ms avg=1.37 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.100000381469727,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.80/2.30/4.50/5.10 ms avg=2.49 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 13.199999809265137,
            "unit": "p95 ms",
            "range": "±9.7%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.50/5.00/13.20/13.20 ms avg=5.77 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.199999809265137,
            "unit": "p95 ms",
            "range": "±19.1%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/16.40/22.20/22.20 ms avg=8.44 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 145.20000076293945,
            "unit": "p95 ms",
            "range": "±111.6%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.60/37.20/145.20/145.20 ms avg=51.06 ms (10 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 152.19999980926514,
            "unit": "p95 ms",
            "range": "±97.6%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=54.60/61.80/152.20/152.20 ms avg=84.50 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 158.30000019073486,
            "unit": "p95 ms",
            "range": "±88.5%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=69.80/89.10/158.30/158.30 ms avg=104.07 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 360.4000005722046,
            "unit": "p95 ms",
            "range": "±60.7%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.70/303.80/360.40/360.40 ms avg=389.47 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 859.6000003814697,
            "unit": "p95 ms",
            "range": "±274.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=585.50/674.40/859.60/859.60 ms avg=788.51 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 902.5,
            "unit": "p95 ms",
            "range": "±104.7%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=797.80/846.40/902.50/902.50 ms avg=1036.67 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 5.199999809265137,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "scan 1024x1000 50/75/90/95%=1.90/2.90/5.00/5.20 ms avg=2.54 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24,
            "unit": "p95 ms",
            "range": "±8.0%",
            "extra": "scan 1024x10000 50/75/90/95%=16.00/16.60/22.50/24.00 ms avg=18.41 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 589.4000005722046,
            "unit": "p95 ms",
            "range": "±31.6%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=571.70/589.30/589.40/589.40 ms avg=720.26 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.30000019073486,
            "unit": "p95 ms",
            "range": "±30.3%",
            "extra": "create index 1024x5000 50/75/90/95%=106.00/120.30/136.30/136.30 ms avg=140.19 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 133.39999961853027,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=129.10/130.00/133.40/133.40 ms avg=165.34 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 37.39999961853027,
            "unit": "p95 ms",
            "range": "±4.2%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=33.20/35.70/36.50/37.40 ms avg=37.01 ms (14 runs sampled)"
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
        "date": 1662028599008,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.5,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.30/3.20/3.50 ms avg=1.52 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.300000190734863,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.90/2.50/4.30/4.30 ms avg=2.47 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 6.199999809265137,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.00/6.20/6.20 ms avg=4.93 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/7.50/22.00/22.00 ms avg=7.70 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 104.5,
            "unit": "p95 ms",
            "range": "±72.8%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.70/34.10/39.80/104.50 ms avg=43.08 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 137.30000019073486,
            "unit": "p95 ms",
            "range": "±78.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=58.50/65.80/137.30/137.30 ms avg=83.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 177.69999980926514,
            "unit": "p95 ms",
            "range": "±104.6%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=73.10/81.30/177.70/177.70 ms avg=108.31 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 403.30000019073486,
            "unit": "p95 ms",
            "range": "±95.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=307.50/312.00/403.30/403.30 ms avg=404.63 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 669.8000001907349,
            "unit": "p95 ms",
            "range": "±88.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=581.60/587.20/669.80/669.80 ms avg=755.10 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 913,
            "unit": "p95 ms",
            "range": "±105.5%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=807.50/832.20/913.00/913.00 ms avg=1050.60 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 6.300000190734863,
            "unit": "p95 ms",
            "range": "±4.3%",
            "extra": "scan 1024x1000 50/75/90/95%=2.00/2.70/3.20/6.30 ms avg=2.48 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 24.600000381469727,
            "unit": "p95 ms",
            "range": "±8.3%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/17.00/23.20/24.60 ms avg=18.73 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 572.3000001907349,
            "unit": "p95 ms",
            "range": "±27.9%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=544.40/565.00/572.30/572.30 ms avg=695.91 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 137.30000019073486,
            "unit": "p95 ms",
            "range": "±28.5%",
            "extra": "create index 1024x5000 50/75/90/95%=108.80/118.20/137.30/137.30 ms avg=141.43 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 147.5999994277954,
            "unit": "p95 ms",
            "range": "±16.5%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.10/135.80/147.60/147.60 ms avg=169.09 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 40.89999961853027,
            "unit": "p95 ms",
            "range": "±11.5%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=29.40/34.40/37.60/40.90 ms avg=34.93 ms (15 runs sampled)"
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
        "date": 1662101901964,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.09999942779541,
            "unit": "p95 ms",
            "range": "±1.9%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.20/1.30/2.50/3.10 ms avg=1.39 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.300000190734863,
            "unit": "p95 ms",
            "range": "±3.3%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.40/5.00/5.30 ms avg=2.73 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 10.09999942779541,
            "unit": "p95 ms",
            "range": "±7.0%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.10/5.00/10.10/10.10 ms avg=5.17 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 22.199999809265137,
            "unit": "p95 ms",
            "range": "±18.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.40/6.90/22.20/22.20 ms avg=7.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 107.39999961853027,
            "unit": "p95 ms",
            "range": "±75.8%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=31.60/33.60/38.90/107.40 ms avg=43.49 ms (12 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 156,
            "unit": "p95 ms",
            "range": "±101.8%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=54.20/61.20/156.00/156.00 ms avg=83.53 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 179.69999980926514,
            "unit": "p95 ms",
            "range": "±110.0%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=69.70/82.30/179.70/179.70 ms avg=107.26 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 410.19999980926514,
            "unit": "p95 ms",
            "range": "±110.8%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=299.40/317.80/410.20/410.20 ms avg=396.20 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 694.5,
            "unit": "p95 ms",
            "range": "±94.2%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=600.30/607.10/694.50/694.50 ms avg=770.84 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 925.8000001907349,
            "unit": "p95 ms",
            "range": "±102.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=823.70/863.00/925.80/925.80 ms avg=1062.36 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.90000057220459,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "scan 1024x1000 50/75/90/95%=2.10/2.60/4.80/4.90 ms avg=2.49 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23,
            "unit": "p95 ms",
            "range": "±6.6%",
            "extra": "scan 1024x10000 50/75/90/95%=16.40/16.50/21.90/23.00 ms avg=18.56 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 602.1000003814697,
            "unit": "p95 ms",
            "range": "±31.8%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=570.30/575.50/602.10/602.10 ms avg=715.17 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 133.5,
            "unit": "p95 ms",
            "range": "±29.2%",
            "extra": "create index 1024x5000 50/75/90/95%=104.30/119.80/133.50/133.50 ms avg=139.50 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 186.79999923706055,
            "unit": "p95 ms",
            "range": "±55.6%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=131.20/141.10/186.80/186.80 ms avg=174.79 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 42.60000038146973,
            "unit": "p95 ms",
            "range": "±12.7%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=29.90/33.10/36.00/42.60 ms avg=34.61 ms (15 runs sampled)"
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
        "date": 1662454335277,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 3.8000001907348633,
            "unit": "p95 ms",
            "range": "±2.7%",
            "extra": "writeSubRead 1MB total, 64 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=1.10/1.40/1.60/3.80 ms avg=1.40 ms (19 runs sampled)"
          },
          {
            "name": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 4.800000190734863,
            "unit": "p95 ms",
            "range": "±2.8%",
            "extra": "writeSubRead 4MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=2.00/2.80/4.40/4.80 ms avg=2.68 ms (15 runs sampled)"
          },
          {
            "name": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 5.600000381469727,
            "unit": "p95 ms",
            "range": "±2.4%",
            "extra": "writeSubRead 16MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.20/5.00/5.60/5.60 ms avg=4.20 ms (7 runs sampled)"
          },
          {
            "name": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub p95",
            "value": 21.5,
            "unit": "p95 ms",
            "range": "±17.8%",
            "extra": "writeSubRead 64MB total, 128 subs total, 5 subs dirty, 16kb read per sub 50/75/90/95%=3.70/7.00/21.50/21.50 ms avg=7.66 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 0) p95",
            "value": 135.4000005722046,
            "unit": "p95 ms",
            "range": "±101.7%",
            "extra": "populate 1024x1000 (clean, indexes: 0) 50/75/90/95%=33.70/34.30/135.40/135.40 ms avg=50.00 ms (10 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 1) p95",
            "value": 150.19999980926514,
            "unit": "p95 ms",
            "range": "±96.4%",
            "extra": "populate 1024x1000 (clean, indexes: 1) 50/75/90/95%=53.80/65.00/150.20/150.20 ms avg=83.37 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x1000 (clean, indexes: 2) p95",
            "value": 177.30000019073486,
            "unit": "p95 ms",
            "range": "±107.3%",
            "extra": "populate 1024x1000 (clean, indexes: 2) 50/75/90/95%=70.00/84.60/177.30/177.30 ms avg=106.97 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 0) p95",
            "value": 358.5999994277954,
            "unit": "p95 ms",
            "range": "±55.9%",
            "extra": "populate 1024x10000 (clean, indexes: 0) 50/75/90/95%=302.70/314.00/358.60/358.60 ms avg=394.79 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 1) p95",
            "value": 688.6999998092651,
            "unit": "p95 ms",
            "range": "±102.1%",
            "extra": "populate 1024x10000 (clean, indexes: 1) 50/75/90/95%=586.60/598.50/688.70/688.70 ms avg=763.43 ms (7 runs sampled)"
          },
          {
            "name": "populate 1024x10000 (clean, indexes: 2) p95",
            "value": 897.4000005722046,
            "unit": "p95 ms",
            "range": "±81.1%",
            "extra": "populate 1024x10000 (clean, indexes: 2) 50/75/90/95%=816.30/841.60/897.40/897.40 ms avg=1053.60 ms (7 runs sampled)"
          },
          {
            "name": "scan 1024x1000 p95",
            "value": 4.399999618530273,
            "unit": "p95 ms",
            "range": "±2.6%",
            "extra": "scan 1024x1000 50/75/90/95%=1.80/2.50/4.40/4.40 ms avg=2.29 ms (19 runs sampled)"
          },
          {
            "name": "scan 1024x10000 p95",
            "value": 23.5,
            "unit": "p95 ms",
            "range": "±7.2%",
            "extra": "scan 1024x10000 50/75/90/95%=16.30/17.00/21.30/23.50 ms avg=18.67 ms (19 runs sampled)"
          },
          {
            "name": "create index with definition 1024x5000 p95",
            "value": 600.6000003814697,
            "unit": "p95 ms",
            "range": "±46.0%",
            "extra": "create index with definition 1024x5000 50/75/90/95%=554.60/561.50/600.60/600.60 ms avg=698.06 ms (7 runs sampled)"
          },
          {
            "name": "create index 1024x5000 p95",
            "value": 136.30000019073486,
            "unit": "p95 ms",
            "range": "±30.7%",
            "extra": "create index 1024x5000 50/75/90/95%=105.60/120.30/136.30/136.30 ms avg=141.16 ms (7 runs sampled)"
          },
          {
            "name": "startup read 1024x100 from 1024x100000 stored p95",
            "value": 139,
            "unit": "p95 ms",
            "range": "±12.4%",
            "extra": "startup read 1024x100 from 1024x100000 stored 50/75/90/95%=126.60/131.40/139.00/139.00 ms avg=164.59 ms (7 runs sampled)"
          },
          {
            "name": "startup scan 1024x100 from 1024x100000 stored p95",
            "value": 56.90000057220459,
            "unit": "p95 ms",
            "range": "±26.1%",
            "extra": "startup scan 1024x100 from 1024x100000 stored 50/75/90/95%=30.80/34.90/36.30/56.90 ms avg=37.56 ms (14 runs sampled)"
          }
        ]
      }
    ]
  }
}
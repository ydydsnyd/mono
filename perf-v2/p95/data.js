window.BENCHMARK_DATA = {
  "lastUpdate": 1656494048814,
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
      }
    ]
  }
}
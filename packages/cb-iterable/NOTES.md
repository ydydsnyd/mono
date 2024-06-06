ZQL is currently synchronous.

But for PG driven IVM we'll need to be able to make async calls from operators that require memory:

1. Join
2. Reduce
3. Distinct

But we don't want to cause the browser use case to be async. It should stay sync.

Callbacks let us bridge this gap.

But each operator is lazy. It returns an `iterator`.

`iterators` are synchronous.

So we need an `iterator` that can both be sync and async. An iterator that is callback driven.

From:

```ts
for (const x of iterator) {
  if (cond) {
    break;
  }
  ...
}
```

To:

```ts
iterator.iterate(() => {
  if (cond) {
    return false;
  }
  ...
});
```

They need to be lazily composable tho... Iterators do nothing until `next` is called.

`iterator.iterate` is going to iterate early? We can have two?

`iterator.lazy(() => {});` ?

We use iterables not iterator.

```ts
function map(cbIterable, f) {
  return {
    [cbIteratorSym]() {
      const iterator = cbIterator.cbIterator;
      iterator.next();
      cbIterable.iterate((v, getNext) => {
        f(v);
      });
    },
  };
}
```

```ts
filter(map(c));

const iterator = c.generate((v, yld, ret, next) => {
  yld(v * 2, next);

  // if done early:
  // ret();
});

// .next would call the generator to kick off and enqueue a cb to get the result when yield is called.
const proc = (v, hasNext, next) => {
  next(proc);
};
iterator.next(proc);
```

May need a way to do chunked iteration? To deal with many rows flowing through an operator.

We could pull on the iterator in the operator to grab `batch size`...

We could check if the input is an array (i.e., all data is available) and process all available data at once.
^^ this would be true in the PG server side case when processing diffs. Those come in as arrays since the whole diff is available.

> > If a diff is ever too large do we just fatal the query and re-run from scratch?
> > Probably. No need to process a 5-10k row diff.

IF we're doing this greedy running then we don't need this new fangled way of iterating, right?

The pipeline would just run greedily and wait to call `newDifference`.

---

So if we go the greedy route...

- join
- distinct
- reduce

should get `PG` specific implementations?
So we can check the invariant that:

1. input multisets are arrays

and we can do:

1. batch lookups against the sources/indices

How will distinct work?
I think we need to run IVM _before_ we apply the changes to the DB.

Otherwise we will believe we've already emitted the values for `distinct`.

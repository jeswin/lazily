export class AsyncSeq {
  static of(list) {
    return new AsyncSeq(sequence(list));
  }

  constructor(seq) {
    this.seq = seq;
  }

  *[Symbol.iterator]() {
    for (const i of this.seq()) {
      yield i;
    }
  }

  async *[Symbol.asyncIterator]() {
    for await (const i of this.seq()) {
      yield i;
    }
  }

  concat(seq) {
    return new AsyncSeq(concat(this.seq, seq.seq));
  }

  async every(fn) {
    return await every(this.seq, fn)
  }

  exit(fn, result) {
    return new AsyncSeq(exit(this.seq, fn, result));
  }

  filter(fn) {
    return new AsyncSeq(filter(this.seq, fn));
  }

  async find(fn) {
    return await find(this.seq, fn);
  }

  async first() {
    return await first(this.seq);
  }

  async includes(item) {
    return await includes(this.seq, item);
  }

  async last() {
    return await last(this.seq);
  }

  map(fn) {
    return new AsyncSeq(map(this.seq, fn));
  }

  reduce(fn, initialValue) {
    return reduce(this.seq, fn, initialValue)
  }

  slice(begin, end) {
    return new AsyncSeq(slice(this.seq, begin, end));
  }

  async some(fn) {
    return await some(this.seq, fn)
  }

  reverse() {
    return new AsyncSeq(reverse(this.seq));
  }

  async toArray() {
    return await toArray(this.seq);
  }
}

export function sequence(list) {
  return async function* gen() {
    for await (const item of list) {
      yield item;
    }
  };
}


export function concat(seq, newSeq) {
  return async function*() {
    for (const i of seq()) {
      yield await i;
    }
    for (const j of newSeq()) {
      yield await j;
    }
  }
}

export async function every(seq, fn) {
  const items = seq.toArray();
  for await (const item of items) {
    if (!await fn(item)) {
      return false;
    }
  }
  return true;
}

export function exit(seq, fn, result) {
  return async function*() {
    for await (const item of seq()) {
      if (await fn(item)) {
        return
      }
      yield item;
    }
  };
}

export async function find(seq, fn) {
  for await (const item of seq()) {
    if (await fn(item)) {
      return item;
    }
  }
}

export function filter(seq, fn) {
  return async function*() {
    for await (const item of seq()) {
      if (await fn(item)) {
        yield item;
      }
    }
  }
}

export async function first(seq) {
  for await (const item of seq()) {
    return item;
  }
}

export async function includes(seq, what) {
  return await some(seq, async item => (await item) === (await what));
}

export async function last(seq) {
  let prev;
  for await (const item of seq()) {
    prev = item;
  }
  return prev;
}

export function map(seq, fn) {
  return async function*() {
    for await (const item of seq()) {
      yield fn(item);
    }
  }
}

export async function reduce(seq, fn, initialValue) {
  let acc = initialValue;
  for await (const item of seq()) {
    acc = await fn(acc, item);
  }
  return acc;
}

export function reverse(seq) {
  return async function*() {
    const all = await toArray(seq).reverse();
    for await (const item of all) {
      yield item;
    }
  }
}

export function slice(seq, begin, end) {
  return async function*() {
    let i = 0;
    for await (const item of seq()) {
      if (i >= begin && (!end || i < end)) {
        yield item;
      }
      i++;
      if (i === end) {
        return;
      }
    }
  }
}

export async function some(seq, fn) {
  for await (const item of seq()) {
    if (await fn(item)) {
      return true;
    }
  }
  return false;
}

export async function toArray(seq) {
  const results = [];
  for await (const item of seq()) {
    results.push(item);
  }
  return results;
}

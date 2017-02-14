export class Seq {
  static of(list) {
    return new Seq(sequence(list));
  }

  constructor(seq) {
    this.seq = seq;
  }

  *[Symbol.iterator]() {
    for (const i of this.seq()) {
      yield i;
    }
  }

  concat(seq) {
    return new Seq(concat(this.seq, seq.seq));
  }

  every(fn) {
    return every(this.seq, fn)
  }

  exit(fn, result) {
    return new Seq(exit(this.seq, fn, result));
  }

  exitAfter(fn, result) {
    return new Seq(exitAfter(this.seq, fn, result));
  }

  filter(fn) {
    return new Seq(filter(this.seq, fn));
  }

  find(fn) {
    return find(this.seq, fn);
  }

  first(predicate) {
    return first(this.seq, predicate);
  }

  includes(item) {
    return includes(this.seq, item);
  }

  last(predicate) {
    return last(this.seq, predicate);
  }

  map(fn) {
    return new Seq(map(this.seq, fn));
  }

  reduce(fn, initialValue, fnShortCircuit) {
    return reduce(this.seq, fn, initialValue, fnShortCircuit)
  }

  slice(begin, end) {
    return new Seq(slice(this.seq, begin, end));
  }

  some(fn) {
    return some(this.seq, fn)
  }

  reverse() {
    return new Seq(reverse(this.seq));
  }

  toArray() {
    return toArray(this.seq);
  }
}

export function sequence(list) {
  return function* gen() {
    for (const item of list) {
      yield item;
    }
  };
}


export function concat(seq, newSeq) {
  return function*() {
    for (const i of seq()) {
      yield i;
    }
    for (const j of newSeq()) {
      yield j;
    }
  }
}

export function every(seq, fn) {
  let i = 0;
  for (const item of seq()) {
    if (!fn(item, i, seq)) {
      return false;
    }
    i++;
  }
  return true;
}

export function exit(seq, fn, result) {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      if (fn(item, i, seq)) {
        return
      }
      yield item;
      i++;
    }
  };
}

export function exitAfter(seq, fn, result) {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      if (fn(item, i, seq)) {
        yield item;
        return
      }
      yield item;
      i++;
    }
  };
}

export function find(seq, fn) {
  let i = 0;
  for (const item of seq()) {
    if (fn(item, i, seq)) {
      return item;
    }
    i++;
  }
}

export function filter(seq, fn) {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      if (fn(item, i, seq)) {
        yield item;
      }
      i++;
    }
  }
}

export function first(_seq, predicate) {
  const seq = predicate ? filter(_seq, predicate) : _seq;

  for (const item of seq()) {
    return item;
  }
}

export function includes(seq, what) {
  return some(seq, item => item === what);
}

export function last(_seq, predicate) {
  const seq = predicate ? filter(_seq, predicate) : _seq;

  let prev;
  for (const item of seq()) {
    prev = item;
  }
  return prev;
}

export function map(seq, fn) {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      yield fn(item, i, seq);
      i++;
    }
  }
}

export function reduce(seq, fn, initialValue, fnShortCircuit) {
  let acc = initialValue;
  let i = 0;
  for (const item of seq()) {
    acc = fn(acc, item, i, seq);
    if (fnShortCircuit && fnShortCircuit(acc, item, i, seq)) {
      return acc;
    }
    i++
  }
  return acc;
}

export function reverse(seq) {
  return function*() {
    const all = toArray(seq).reverse();
    for (const item of all) {
      yield item;
    }
  }
}

export function slice(seq, begin, end) {
  return function*() {
    let i = 0;
    for (const item of seq()) {
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

export function some(seq, fn) {
  let i = 0;
  for (const item of seq()) {
    if (fn(item, i, seq)) {
      return true;
    }
    i++;
  }
  return false;
}

export function toArray(seq) {
  const results = [];
  for (const item of seq()) {
    results.push(item);
  }
  return results;
}

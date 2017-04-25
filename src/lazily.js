/* @flow */
type PredicateType<T> = (
  val: T,
  i?: number,
  seq?: SequenceFnType<T>
) => boolean;

export class Seq<T> {
  seq: SequenceFnType<T>;

  static of(list) {
    return new Seq(sequence(list));
  }

  constructor(seq: SequenceFnType<T>) {
    this.seq = seq;
  }

  *[Symbol.iterator](): Iterable<T> {
    for (const i of this.seq()) {
      yield i;
    }
  }

  concat(seq: Seq<T>): Seq<T> {
    return new Seq(concat(this.seq, seq.seq));
  }

  every(fn: PredicateType<T>) {
    return every(this.seq, fn);
  }

  exit(fn: PredicateType<T>, result?: any): Seq<T> {
    return new Seq(exit(this.seq, fn, result));
  }

  exitAfter(fn: PredicateType<T>, result?: any): Seq<T> {
    return new Seq(exitAfter(this.seq, fn, result));
  }

  filter(fn: PredicateType<T>): Seq<T> {
    return new Seq(filter(this.seq, fn));
  }

  find(fn: PredicateType<T>): ?T {
    return find(this.seq, fn);
  }

  first(predicate: PredicateType<T>): ?T {
    return first(this.seq, predicate);
  }

  includes(item: T): boolean {
    return includes(this.seq, item);
  }

  last(predicate: PredicateType<T>): ?T {
    return last(this.seq, predicate);
  }

  map<TOut>(
    fn: (val: T, i: number, seq: SequenceFnType<T>) => TOut
  ): Seq<TOut> {
    return new Seq(map(this.seq, fn));
  }

  reduce<TAcc>(
    fn: (acc: TAcc, item: T, i?: number, seq?: SequenceFnType<T>) => TAcc,
    initialValue: TAcc,
    fnShortCircuit?: (
      acc: TAcc,
      item: T,
      i?: number,
      seq?: SequenceFnType<T>
    ) => boolean
  ) {
    return reduce(this.seq, fn, initialValue, fnShortCircuit);
  }

  reverse(): Seq<T> {
    return new Seq(reverse(this.seq));
  }

  slice(begin: number, end?: number): Seq<T> {
    return new Seq(slice(this.seq, begin, end));
  }

  some(fn: PredicateType<T>) {
    return some(this.seq, fn);
  }

  toArray(): Array<T> {
    return toArray(this.seq);
  }
}

type SequenceFnType<T> = () => Generator<T, void, void>;

export function sequence<T>(list: Iterable<T>): SequenceFnType<T> {
  return function* gen() {
    for (const item of list) {
      yield item;
    }
  };
}

export function concat<T>(
  seq: SequenceFnType<T>,
  newSeq: SequenceFnType<T>
): SequenceFnType<T> {
  return function*() {
    for (const i of seq()) {
      yield i;
    }
    for (const j of newSeq()) {
      yield j;
    }
  };
}

export function every<T>(
  seq: SequenceFnType<T>,
  fn: PredicateType<T>
): boolean {
  let i = 0;
  for (const item of seq()) {
    if (!fn(item, i, seq)) {
      return false;
    }
    i++;
  }
  return true;
}

export function exit<T>(
  seq: SequenceFnType<T>,
  fn: PredicateType<T>,
  result?: any
): SequenceFnType<T> {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      if (fn(item, i, seq)) {
        return result;
      }
      yield item;
      i++;
    }
  };
}

export function exitAfter<T>(
  seq: SequenceFnType<T>,
  fn: PredicateType<T>,
  result?: any
): SequenceFnType<T> {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      if (fn(item, i, seq)) {
        yield item;
        return result;
      }
      yield item;
      i++;
    }
  };
}

export function find<T>(seq: SequenceFnType<T>, fn: PredicateType<T>): ?T {
  let i = 0;
  for (const item of seq()) {
    if (fn(item, i, seq)) {
      return item;
    }
    i++;
  }
}

export function filter<T>(
  seq: SequenceFnType<T>,
  fn: PredicateType<T>
): SequenceFnType<T> {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      if (fn(item, i, seq)) {
        yield item;
      }
      i++;
    }
  };
}

export function first<T>(
  _seq: SequenceFnType<T>,
  predicate: PredicateType<T>
): ?T {
  const seq = predicate ? filter(_seq, predicate) : _seq;

  for (const item of seq()) {
    return item;
  }
}

export function includes<T>(seq: SequenceFnType<T>, what: T): boolean {
  return some(seq, item => item === what);
}

export function last<T>(
  _seq: SequenceFnType<T>,
  predicate: PredicateType<T>
): ?T {
  const seq = predicate ? filter(_seq, predicate) : _seq;

  let prev;
  for (const item of seq()) {
    prev = item;
  }
  return prev;
}

export function map<T, TOut>(
  seq: SequenceFnType<T>,
  fn: (val: T, i: number, seq: SequenceFnType<T>) => TOut
): SequenceFnType<TOut> {
  return function*() {
    let i = 0;
    for (const item of seq()) {
      yield fn(item, i, seq);
      i++;
    }
  };
}

export function reduce<T, TAcc>(
  seq: SequenceFnType<T>,
  fn: (acc: TAcc, item: T, i: number, seq: SequenceFnType<T>) => TAcc,
  initialValue: TAcc,
  fnShortCircuit?: (
    acc: TAcc,
    item: T,
    i?: number,
    seq?: SequenceFnType<T>
  ) => boolean
): TAcc {
  let acc = initialValue;
  let i = 0;
  for (const item of seq()) {
    acc = fn(acc, item, i, seq);
    if (fnShortCircuit && fnShortCircuit(acc, item, i, seq)) {
      return acc;
    }
    i++;
  }
  return acc;
}

export function reverse<T>(seq: SequenceFnType<T>): SequenceFnType<T> {
  return function*() {
    const all = toArray(seq).reverse();
    for (const item of all) {
      yield item;
    }
  };
}

export function slice<T>(
  seq: SequenceFnType<T>,
  begin: number,
  end?: number
): SequenceFnType<T> {
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
  };
}

export function some<T>(seq: SequenceFnType<T>, fn: PredicateType<T>): boolean {
  let i = 0;
  for (const item of seq()) {
    if (fn(item, i, seq)) {
      return true;
    }
    i++;
  }
  return false;
}

export function toArray<T>(seq: SequenceFnType<T>): Array<T> {
  const results = [];
  for (const item of seq()) {
    results.push(item);
  }
  return results;
}

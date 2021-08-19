import should from "should";
import { Seq } from "../index.js";

function toArray<T>(seq: Seq<T>): Array<T> {
  const results = [];
  for (const i of seq) {
    results.push(i);
  }
  return results;
}

describe("lazily", () => {
  it(`Seq.of(list) returns a sequence`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]);
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5]);
  });

  it(`Seq.of(seq) returns a sequence`, () => {
    const _seq = Seq.of([1, 2, 3, 4, 5]);
    const seq = Seq.of(_seq);
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5]);
  });

  it(`iteration`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]);
    const results = [];
    for (const i of seq) {
      results.push(i);
    }
    results.should.deepEqual([1, 2, 3, 4, 5]);
  });

  it(`concat()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).concat(Seq.of([6, 7, 8]));
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it(`concat() a regular list`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).concat([6, 7, 8]);
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it(`every()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).every(x => x <= 5);
    result.should.be.ok();
  });

  it(`every() negative`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).every(x => x < 5);
    result.should.not.be.ok();
  });

  it(`exit()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).exit(x => x > 3);
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3]);
  });

  it(`exitAfter()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).exitAfter(x => x > 3);
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4]);
  });

  it(`exit() should not interrupt valid results`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5])
      .map(x => x * 2)
      .exit(x => x > 4)
      .map(x => x * 10);
    const results = toArray(seq);
    results.should.deepEqual([20, 40]);
  });

  it(`filter()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).filter(x => x > 2);
    const results = toArray(seq);
    results.should.deepEqual([3, 4, 5]);
  });

  it(`find()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).find(x => x * 10 === 30);
    should(result).not.be.undefined();
    if (result) {
      result.should.equal(3);
    }
  });

  it(`first()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).first();
    should(result).not.be.undefined();
    if (result) {
      result.should.equal(1);
    }
  });

  it(`first(predicate)`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).first(x => x > 3);
    should(result).not.be.undefined();
    if (result) {
      result.should.equal(4);
    }
  });

  it(`flatMap()`, async () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).flatMap(x => Seq.of([x + 10, x + 20]));
    const results = await toArray(seq);
    results.should.deepEqual([11, 21, 12, 22, 13, 23, 14, 24, 15, 25]);
  });

  it(`flatMap() with an array as child`, async () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).flatMap(x => [x + 10, x + 20]);
    const results = await toArray(seq);
    results.should.deepEqual([11, 21, 12, 22, 13, 23, 14, 24, 15, 25]);
  });

  it(`includes()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).includes(3);
    result.should.be.ok();
  });

  it(`includes() negative`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).includes(10);
    result.should.not.be.ok();
  });

  it(`last()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).last();
    should(result).not.be.undefined();
    if (result) {
      result.should.equal(5);
    }
  });

  it(`last(predicate)`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).last(x => x < 3);
    should(result).not.be.undefined();
    if (result) {
      result.should.equal(2);
    }
  });

  it(`map()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).map(x => x * 2);
    const results = toArray(seq);
    results.should.deepEqual([2, 4, 6, 8, 10]);
  });

  it(`reduce()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).reduce((acc, x) => acc + x, 0);
    result.should.equal(15);
  });

  it(`reduce() short-circuited`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).reduce(
      (acc, x) => acc + x,
      0,
      (acc, x) => acc > 6
    );
    result.should.equal(10);
  });

  it(`reverse()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).reverse();
    const results = toArray(seq);
    results.should.deepEqual([5, 4, 3, 2, 1]);
  });

  it(`slice(begin)`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).slice(1);
    const results = toArray(seq);
    results.should.deepEqual([2, 3, 4, 5]);
  });

  it(`slice(begin, end)`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).slice(1, 4);
    const results = toArray(seq);
    results.should.deepEqual([2, 3, 4]);
  });

  it(`some()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).some(x => x === 3);
    result.should.be.ok();
  });

  it(`some() negative`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).every(x => x === 10);
    result.should.not.be.ok();
  });

  it(`sort()`, () => {
    const seq = Seq.of([5, 2, 1, 4, 3]).sort((a, b) => a - b);
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5]);
  });

  it(`toArray()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).toArray();
    result.should.deepEqual([1, 2, 3, 4, 5]);
  });
});

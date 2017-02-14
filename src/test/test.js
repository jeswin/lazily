import should from "should";
import sourceMapSupport from 'source-map-support';

import { Seq } from "../lazily";

sourceMapSupport.install();

function toArray(seq) {
  const results = [];
  for (const i of seq) {
    results.push(i);
  }
  return results;
}

describe("lazily", () => {
  it(`should return a sequence`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5])
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5])
  })

  it(`should map() results`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).map(x => x * 2)
    const results = toArray(seq);
    results.should.deepEqual([2, 4, 6, 8, 10])
  })

  it(`should filter() results`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).filter(x => x > 2)
    const results = toArray(seq);
    results.should.deepEqual([3, 4, 5])
  })

  it(`should exit() early`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).exit(x => x > 3)
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3])
  })

  it(`exit() should not interrupt valid results`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5])
      .map(x => x * 2)
      .exit(x => x > 4)
      .map(x => x * 10);
      const results = toArray(seq);
      results.should.deepEqual([20, 40])
  })

  it(`find()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).find(x => x * 10 === 30)

    result.should.equal(3);
  })

  it(`reduce()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).reduce((acc, x) => acc + x, 0)
    result.should.equal(15);
  })

  it(`first()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).first();
    result.should.equal(1);
  })

  it(`last()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).last();
    result.should.equal(5);
  })

  it(`every()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).every(x => x <= 5);
    result.should.be.ok();
  })

  it(`every() negative`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).every(x => x < 5);
    result.should.not.be.ok();
  })

  it(`some()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).some(x => x === 3);
    result.should.be.ok();
  })

  it(`some() negative`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).every(x => x === 10);
    result.should.not.be.ok();
  })

  it(`toArray()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).toArray();
    result.should.deepEqual([1, 2, 3, 4, 5])
  })

  it(`includes()`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).includes(3);
    result.should.be.ok();
  })

  it(`includes() negative`, () => {
    const result = Seq.of([1, 2, 3, 4, 5]).includes(10);
    result.should.not.be.ok();
  })

  it(`concat()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).concat(Seq.of([6, 7, 8]));
    const results = toArray(seq);
    results.should.deepEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  })

  it(`reverse()`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).reverse();
    const results = toArray(seq);
    results.should.deepEqual([5, 4, 3, 2, 1])
  })

  it(`slice(begin)`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).slice(1);
    const results = toArray(seq);
    results.should.deepEqual([2, 3, 4, 5])
  })

  it(`slice(begin, end)`, () => {
    const seq = Seq.of([1, 2, 3, 4, 5]).slice(1, 4);
    const results = toArray(seq);
    results.should.deepEqual([2, 3, 4])
  })
})

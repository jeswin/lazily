# lazily

Implements common array methods in a lazy manner. Nothing more.

There's an async version of this library as well, called lazily-async.
See https://github.com/isotropy/lazily-async

## Installation
```
npm install lazily
```

## Create a sequence
```javascript
import { Seq } from "lazily";

const seq = Seq.of([1, 2, 3])
for (const i of seq) {
  console.log(i)
}
```

## It's lazy
Sequences are lazy. For example, in the following example only one map() action is performed irrespective of the length of the sequence.

```javascript
const seq = Seq.of([1, 2, 3])
  .map(x => x * 2)
  .first();
```

## toArray()
```javascript
Seq.of([1, 2, 3]).toArray()
// [1, 2, 3]
```

## map(fn)
```javascript
Seq.of([1, 2, 3])
  .map(x => x * 2)
  .toArray()
// [2, 4, 6]
```

## filter(predicate)
```javascript
Seq.of([1, 2, 3, 4])
  .filter(x => x > 2)
  .toArray()
//[3, 4]
```

## exit(predicate)
```javascript
Seq.of([1, 2, 3, 4, 5])
  .exit(x => x > 3)
  .toArray()
// [1, 2, 3]
```

## exitAfter(predicate)
Similar to exit(), but includes the last item as well.
```javascript
Seq.of([1, 2, 3, 4, 5])
  .exitAfter(x => x > 3)
  .toArray()
// [1, 2, 3, 4]
```

## find(predicate)
```javascript
Seq.of([1, 2, 3, 4, 5]).find(x => x * 10 === 30)
// 3
```

## reduce(fn)
```javascript
Seq.of([1, 2, 3, 4, 5])
  .reduce((acc, x) => acc + x, 0)
// 15
```

## first()
```javascript
Seq.of([1, 2, 3, 4, 5]).first();
// 1
```

## first(predicate)
```javascript
Seq.of([1, 2, 3, 4, 5]).first(x => x > 3);
// 4
```

## last()
```javascript
Seq.of([1, 2, 3, 4, 5]).last();
// 5
```

## last(predicate)
```javascript
Seq.of([1, 2, 3, 4, 5]).last(x => x < 3);
// 2
```

## every(predicate)
```javascript
Seq.of([1, 2, 3, 4, 5]).every(x => x <= 5);
// true
```

## some(predicate)
```javascript
Seq.of([1, 2, 3, 4, 5]).some(x => x === 3);
// true
```

## includes(item)
```javascript
Seq.of([1, 2, 3, 4, 5]).includes(3);
// true
```

## concat(seq)
```javascript
Seq.of([1, 2, 3, 4, 5]).concat(Seq.of([6, 7, 8])).toArray();
// [1, 2, 3, 4, 5, 6, 7, 8]
```

## reverse()
```javascript
Seq.of([1, 2, 3]).reverse().toArray();
// [3, 2, 1]
```

## slice(begin, end)
```javascript
Seq.of([1, 2, 3, 4, 5, 6]).slice(2, 4).toArray();
// [3, 4, 5]
```

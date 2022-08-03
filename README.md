# assert-plan
The node assert library but with a plan method to check a certain amount of assertions are raised.

## Installation
```
npm install --save-dev assert-plan
```

## Example Usage
```javascript
import test from 'node:test';
import plannedAssert from '../lib/index.js';

test('test', async t => {
  const assert = plannedAssert(1);

  assert.strictEqual(1, 1);

  await assert.wait();
});
```

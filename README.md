# assert-plan

> Archived! This looks much nicer and is more recent:
> https://github.com/mcollina/tspl

The node assert library but with a plan method to check a certain amount of assertions are raised.

## Installation
```
npm install --save-dev assert-plan
```

## Example Usage
```javascript
import test from 'node:test';
import assertPlan from 'assert-plan';

test('test 1 assertion', async t => {
  const assert = assertPlan(1);

  assert.strictEqual(1, 1);

  await assert.wait();
});

test('test 2 assertions will hang indefinitely', async t => {
  const assert = assertPlan(2);

  assert.strictEqual(1, 1);

  await assert.wait();
});

test('test 2 assertions will timeout', async t => {
  const assert = assertPlan(2, { timeout: 2000 });

  assert.strictEqual(1, 1);

  await assert.wait();
});
```

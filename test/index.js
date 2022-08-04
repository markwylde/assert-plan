import test from 'test';
import assertPlan from '../lib/index.js';

test('test succeeds with 1 assertion and no timeout', async t => {
  const assert = assertPlan(1);

  assert.strictEqual(1, 1);

  await assert.wait();
});

test('test fails with 2 assertions when only expecting 1 and no timeout', async t => {
  const assert = assertPlan(1);

  assert.strictEqual(1, 1);
  assert.strictEqual(2, 2);

  await assert.wait();
});

test('test fails with not enough assertions and no timeout', async t => {
  const assert = assertPlan(2);

  assert.strictEqual(1, 1);

  await assert.wait();
});

test('test succeeds with enough assertions and an assertPlan timeout', async t => {
  const assert = assertPlan(2, { timeout: 1000 });

  assert.strictEqual(1, 1);

  setTimeout(() => {
    assert.strictEqual(2, 2);
  }, 200);

  await assert.wait();
});

test('test fails with not enough assertions and an assertPlan timeout', async t => {
  const assert = assertPlan(2, { timeout: 500 });

  assert.strictEqual(1, 1);

  await assert.wait();
});

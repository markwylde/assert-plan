import test from 'test';
import assertPlan from '../lib/index.js';

test('test', async t => {
  const assert = assertPlan(1);

  assert.strictEqual(1, 1);

  await assert.wait();
});

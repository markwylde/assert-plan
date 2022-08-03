import test from 'test';
import plannedAssert from '../lib/index.js';

test('test', { timeout: 2000 }, async t => {
  const assert = plannedAssert(1);

  assert.strictEqual(1, 1);

  await assert.wait();
});

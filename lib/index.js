import assert from 'assert';
import { promisify } from 'util';

const waitUntil = promisify(function (fn, cb) {
  // This is just an optimisation to skip all the retry
  // logic if fn instantly passes.
  try {
    fn();
    cb();
    return;
  } catch (error) {}

  let lastError;
  const retryTimer = setInterval(() => {
    try {
      fn()
      finish();
    } catch (error) {
      lastError = error;
    }
  });

  function finish () {
    clearInterval(retryTimer);
    cb(lastError);
  }
});

function plannedAssert (expectedAssertions) {
  let passes = 0;

  const createAssert = (name) => {
    return (...args) => {
      assert[name](...args);
      passes = passes + 1;
    }
  }

  return {
    pass: createAssert('pass'),
    fail: createAssert('fail'),
    ok: createAssert('ok'),
    notOk: createAssert('notOk'),
    equal: createAssert('equal'),
    notEqual: createAssert('notEqual'),
    deepEqual: createAssert('deepEqual'),
    notDeepEqual: createAssert('notDeepEqual'),
    deepStrictEqual: createAssert('deepStrictEqual'),
    notDeepStrictEqual: createAssert('notDeepStrictEqual'),
    strictEqual: createAssert('strictEqual'),
    notStrictEqual: createAssert('notStrictEqual'),
    throws: createAssert('throws'),
    rejects: createAssert('rejects'),
    doesNotThrow: createAssert('doesNotThrow'),
    doesNotReject: createAssert('doesNotReject'),
    match: createAssert('match'),
    doesNotMatch: createAssert('doesNotMatch'),
    wait: () => waitUntil(() => {
      if (passes !== expectedAssertions) {
        throw new Error(`timed out waiting for assertions to equal ${expectedAssertions}, but only got to ${passes}`);
      }
    }),
  }
}

export default plannedAssert;


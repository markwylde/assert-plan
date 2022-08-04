import assert from 'node:assert';
import { promisify } from 'node:util';

function plannedAssert (expectedAssertions, options) {
  options = {
    timeout: null,
    expectedAssertions,
    ...options
  };

  let passes = 0;
  let resolved = false;
  const waitAccumulator = [];

  const testWaitsFromAccumulator = () => {
    waitAccumulator.forEach((waitItem) => {
      const { fn, timeout, callback } = waitItem;
      try {
        fn();
        callback();
        clearTimeout(timeout);
        waitAccumulator.splice(waitAccumulator.indexOf(waitItem), 1);
        resolved = true;
      } catch (error) {
        waitItem.lastError = error;
      }
    });
  };

  const createAssert = (name) => {
    return (...args) => {
      assert[name](...args);
      passes = passes + 1;

      if (resolved) {
        throw new Error(`expected assertions to equal ${options.expectedAssertions}, but had ${passes}`);
      }

      testWaitsFromAccumulator();
    };
  };

  return {
    plan: newPlan => {
      options.expectedAssertions = newPlan;
    },
    get expectedAssertions () {
      return options.expectedAssertions;
    },
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
    wait: promisify((callback) => {
      const error = new Error('plannedAssert failed to assert as planned');
      const waitItem = {
        error,
        fn: () => {
          if (passes !== options.expectedAssertions) {
            error.message = `expected assertions to equal ${options.expectedAssertions}, but counted ${passes}`;
            throw error;
          }
        },
        callback
      };

      if (!options.timeout) {
        if (passes === options.expectedAssertions) {
          callback();
          return;
        }
        if (!waitItem.lastError) {
          error.message = `expected assertions to equal ${options.expectedAssertions}, but counted ${passes}`;
          throw error;
        }

        throw waitItem.lastError;
      }

      waitItem.timeout = options.timeout && setTimeout(() => {
        waitItem.lastError.message = 'plannedAssert timed out\n' + waitItem.lastError.message;
        throw waitItem.lastError;
      }, options.timeout);

      waitAccumulator.push(waitItem);

      testWaitsFromAccumulator();
    })
  };
}

export default plannedAssert;

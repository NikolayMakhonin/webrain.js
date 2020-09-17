/* tslint:disable:no-var-requires triple-equals */
import { DeepCloneEqual } from './DeepCloneEqual';
export const AssertionError = typeof require === 'function' ? require('assertion-error') : class extends Error {};
const deepCloneEqualDefault = new DeepCloneEqual();

if (!console.debug) {
  console.debug = console.info;
}

export class Assert {
  constructor(deepCloneEqual) {
    this.deepCloneEqual = deepCloneEqual || deepCloneEqualDefault;
  }

  fail(message) {
    this.throwAssertionError(null, null, message);
  }

  ok(value, message) {
    if (!value) {
      this.throwAssertionError(value, true, message);
    }
  }

  notOk(value, message) {
    if (value) {
      this.throwAssertionError(value, false, message);
    }
  }

  strictEqual(actual, expected, message) {
    if (actual !== expected) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  notStrictEqual(actual, expected, message) {
    if (actual === expected) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  deepStrictEqual(actual, expected, message, options) {
    if (!this.deepCloneEqual.equal(actual, expected, options)) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  circularDeepStrictEqual(actual, expected, message, options) {
    if (!this.deepCloneEqual.equal(actual, expected, { ...options,
      circular: true
    })) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  equal(actual, expected, message) {
    // noinspection EqualityComparisonWithCoercionJS
    if (actual != expected) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  notEqual(actual, expected, message) {
    // noinspection EqualityComparisonWithCoercionJS
    if (actual == expected) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  equalCustom(actual, expected, check, message) {
    if (!check(actual, expected)) {
      this.throwAssertionError(actual, expected, message);
    }
  }

  assertError(err, errType, regExp, message) {
    this.ok(err);

    if (err instanceof AssertionError) {
      const index = Assert.errors.indexOf(err);
      Assert.errors.splice(index, 1);
    }

    if (errType) {
      const actualErrType = err.constructor;

      if (Array.isArray(errType)) {
        if (!errType.some(o => o === actualErrType)) {
          this.throwAssertionError(actualErrType.name, errType.map(o => o && o.name), err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
        }
      } else {
        if (actualErrType !== errType) {
          this.throwAssertionError(actualErrType.name, errType.name, err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
        }
      }
    }

    if (regExp) {
      this.ok(regExp.test(err.message), err ? (message || '') + '\r\n' + err + '\r\n' + err.stack : message);
    }
  }

  async throwsAsync(fn, errType, regExp, message) {
    let err;

    try {
      await fn();
    } catch (ex) {
      err = ex;
    }

    this.assertError(err, errType, regExp, message);
  }

  throws(fn, errType, regExp, message) {
    let err;

    try {
      fn();
    } catch (ex) {
      err = ex;
    }

    this.assertError(err, errType, regExp, message);
  }

  assertNotHandledErrors() {
    if (Assert.errors.length) {
      const firstError = Assert.errors[0];
      Assert.errors = [];
      throw firstError;
    }
  }

  // noinspection JSMethodCanBeStatic
  throwAssertionError(actual, expected, message) {
    console.debug('actual: ', actual);
    console.debug('expected: ', expected);
    const error = new AssertionError(message, {
      actual,
      expected,
      showDiff: true
    });

    if (!Assert.errors) {
      Assert.errors = [error];
    } else {
      Assert.errors.push(error);
    }

    throw error;
  }

}
Assert.errors = [];
export const assert = new Assert();
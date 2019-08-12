"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = exports.Assert = exports.AssertionError = void 0;

var _DeepCloneEqual = require("./DeepCloneEqual");

/* tslint:disable:no-var-requires triple-equals */
const AssertionError = typeof require === 'function' ? require('assertion-error') : class extends Error {};
exports.AssertionError = AssertionError;
const deepCloneEqualDefault = new _DeepCloneEqual.DeepCloneEqual();

class Assert {
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

  throws(fn, errType, regExp, message) {
    let err;

    try {
      fn();
    } catch (ex) {
      err = ex;
    }

    this.ok(err);

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
      this.ok(regExp.test(err.message));
    }
  } // noinspection JSMethodCanBeStatic


  throwAssertionError(actual, expected, message) {
    throw new AssertionError(message, {
      actual,
      expected,
      showDiff: true
    });
  }

}

exports.Assert = Assert;
const assert = new Assert();
exports.assert = assert;
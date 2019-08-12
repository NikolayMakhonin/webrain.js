"use strict";

var _Assert = require("../../../../../main/common/test/Assert");

var _helpers = require("../src/helpers/helpers");

var _TestDeepEqual = require("./src/TestDeepEqual");

/* tslint:disable:no-construct use-primitive-type */
describe('common > test > DeepCloneEqual', function () {
  this.timeout(60000);
  const _testDeepEqual = _TestDeepEqual.TestDeepEqual.test;
  after(function () {
    console.log('Total DeepCloneEqual tests >= ' + _TestDeepEqual.TestDeepEqual.totalTests);
  });
  const objectOptions = {
    undefined: true,
    array: true,
    function: true,
    map: true,
    arrayMap: true,
    objectMap: true,
    observableMap: true,
    set: true,
    arraySet: true,
    objectSet: true,
    observableSet: true,
    sortedList: true,
    circularClass: true
  };

  const testDeepEqual = (actual, expected, options) => {
    _testDeepEqual({
      value1: actual,
      value2: expected,
      // equalInnerReferences: [false],
      // equalMapSetOrder: [options.equalMapSetOrder],
      exclude: o => {
        if (!o.circular && options.circular) {
          return true;
        }

        if (o.equalMapSetOrder && !options.equalMapSetOrder) {
          return true;
        }

        return false;
      },
      expected: {
        result: o => {
          if (o.equalTypes && !options.equalTypes) {
            return false;
          }

          if (o.noCrossReferences && !options.noCrossReferences) {
            return false;
          }

          if (o.equalInnerReferences && !options.equalInnerReferences) {
            return false;
          }

          return true;
        }
      },
      actions: null
    });
  };

  const deepCloneWrapper = (value, options, cache) => {
    const result = _TestDeepEqual.deepCloneEqual.clone(value, options, cache);

    return result;
  };

  const notCircularTest = equalMapSetOrder => {
    const obj = (0, _helpers.createComplexObject)({ ...objectOptions,
      arraySet: objectOptions.arraySet && !equalMapSetOrder,
      objectSet: objectOptions.objectSet && !equalMapSetOrder,
      arrayMap: objectOptions.arrayMap && !equalMapSetOrder,
      objectMap: objectOptions.objectMap && !equalMapSetOrder
    });
    let clone = deepCloneWrapper(obj);
    testDeepEqual([clone], [obj], {
      circular: false,
      equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true // equalInnerReferences: true,

    });
    clone = deepCloneWrapper(clone, {
      circular: false
    });
    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true // equalInnerReferences: true,

    });
  };

  const circularTest = equalMapSetOrder => {
    const obj = (0, _helpers.createComplexObject)({ ...objectOptions,
      circular: true,
      arraySet: objectOptions.arraySet && !equalMapSetOrder,
      objectSet: objectOptions.objectSet && !equalMapSetOrder,
      arrayMap: objectOptions.arrayMap && !equalMapSetOrder,
      objectMap: objectOptions.objectMap && !equalMapSetOrder
    });
    let cache1 = [];
    const clone = deepCloneWrapper(obj, {
      circular: true
    }, cache1);
    let cache2 = [];
    const clone2 = deepCloneWrapper(obj, {
      circular: true
    }, cache2);
    cache1 = new Set(cache1);
    cache2 = new Set(cache2);

    _Assert.assert.strictEqual(cache1.size, cache2.size);

    for (const value of cache1) {
      if (value && typeof value === 'object') {
        _Assert.assert.notOk(cache2.has(value));
      } else {
        _Assert.assert.ok(cache2.has(value));
      }
    }

    for (const value of cache2) {
      if (value && typeof value === 'object') {
        _Assert.assert.notOk(cache1.has(value));
      } else {
        _Assert.assert.ok(cache1.has(value));
      }
    }

    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true,
      equalInnerReferences: true
    });
    clone.cross = {};
    obj.cross = clone.cross;
    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder,
      equalTypes: true,
      equalInnerReferences: true
    });
    obj.cross = {};
    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true,
      equalInnerReferences: true
    });

    if (obj.array) {
      clone.array.push(clone);
      obj.array.push(clone);
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder,
        equalTypes: true,
        equalInnerReferences: true
      });
      obj.array[obj.array.length - 1] = obj;
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder,
        equalTypes: true,
        noCrossReferences: true,
        equalInnerReferences: true
      });
      clone.array.length--;
      obj.array.length--;
      obj.object = { ...obj.object
      };
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder,
        equalTypes: true,
        noCrossReferences: true // equalInnerReferences: true,

      });
      obj.array = new Set(obj.array);
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder,
        // equalTypes: true,
        noCrossReferences: true // equalInnerReferences: true,

      });
      clone.cross = new String('cross');
      clone.cross2 = new String('cross');
      obj.cross = clone.cross2;
      obj.cross2 = clone.cross;
      obj.object.cross = clone.cross2;
      obj.object.cross2 = clone.cross;
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder // equalTypes: true,
        // noCrossReferences: true,
        // equalInnerReferences: true,

      });
    }
  };

  it('noCrossReferences', function () {
    const obj = {
      a: {}
    };
    const obj2 = {
      a: {}
    };
    testDeepEqual([obj], [obj], {
      circular: false,
      equalTypes: true,
      noCrossReferences: false,
      equalInnerReferences: true
    });
    testDeepEqual([obj], [obj2], {
      circular: false,
      equalTypes: true,
      noCrossReferences: true,
      equalInnerReferences: true
    });
    obj2.a = obj.a;
    testDeepEqual([obj], [obj2], {
      circular: false,
      equalTypes: true,
      noCrossReferences: false,
      equalInnerReferences: true
    });
  });
  it('not circular', function () {
    notCircularTest(true);
  });
  it('not circular not equalMapSetOrder', function () {
    notCircularTest(false);
  });
  it('circular', function () {
    circularTest(true);
  });
  it('circular not equalMapSetOrder', function () {
    circularTest(false);
  });
});
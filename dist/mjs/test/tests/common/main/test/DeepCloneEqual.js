import _typeof from "@babel/runtime/helpers/typeof";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* tslint:disable:no-construct use-primitive-type */
import { assert } from '../../../../../main/common/test/Assert';
import { createComplexObject } from '../src/helpers/helpers';
import { deepCloneEqual, TestDeepEqual } from './src/TestDeepEqual';
describe('common > test > DeepCloneEqual', function () {
  this.timeout(60000);
  var _testDeepEqual = TestDeepEqual.test;
  after(function () {
    console.log('Total DeepCloneEqual tests >= ' + TestDeepEqual.totalTests);
  });
  var objectOptions = {
    undefined: true,
    array: true,
    "function": true,
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

  var testDeepEqual = function testDeepEqual(actual, expected, options) {
    _testDeepEqual({
      value1: actual,
      value2: expected,
      // equalInnerReferences: [false],
      // equalMapSetOrder: [options.equalMapSetOrder],
      exclude: function exclude(o) {
        if (!o.circular && options.circular) {
          return true;
        }

        if (o.equalMapSetOrder && !options.equalMapSetOrder) {
          return true;
        }

        return false;
      },
      expected: {
        result: function result(o) {
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

  var deepCloneWrapper = function deepCloneWrapper(value, options, cache) {
    var result = deepCloneEqual.clone(value, options, cache);
    return result;
  };

  var notCircularTest = function notCircularTest(equalMapSetOrder) {
    var obj = createComplexObject(_objectSpread({}, objectOptions, {
      arraySet: objectOptions.arraySet && !equalMapSetOrder,
      objectSet: objectOptions.objectSet && !equalMapSetOrder,
      arrayMap: objectOptions.arrayMap && !equalMapSetOrder,
      objectMap: objectOptions.objectMap && !equalMapSetOrder
    }));
    var clone = deepCloneWrapper(obj);
    testDeepEqual([clone], [obj], {
      circular: false,
      equalMapSetOrder: equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true // equalInnerReferences: true,

    });
    clone = deepCloneWrapper(clone, {
      circular: false
    });
    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder: equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true // equalInnerReferences: true,

    });
  };

  var circularTest = function circularTest(equalMapSetOrder) {
    var obj = createComplexObject(_objectSpread({}, objectOptions, {
      circular: true,
      arraySet: objectOptions.arraySet && !equalMapSetOrder,
      objectSet: objectOptions.objectSet && !equalMapSetOrder,
      arrayMap: objectOptions.arrayMap && !equalMapSetOrder,
      objectMap: objectOptions.objectMap && !equalMapSetOrder
    }));
    var cache1 = [];
    var clone = deepCloneWrapper(obj, {
      circular: true
    }, cache1);
    var cache2 = [];
    var clone2 = deepCloneWrapper(obj, {
      circular: true
    }, cache2);
    cache1 = new Set(cache1);
    cache2 = new Set(cache2);
    assert.strictEqual(cache1.size, cache2.size);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = cache1[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var value = _step.value;

        if (value && _typeof(value) === 'object') {
          assert.notOk(cache2.has(value));
        } else {
          assert.ok(cache2.has(value));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = cache2[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _value = _step2.value;

        if (_value && _typeof(_value) === 'object') {
          assert.notOk(cache1.has(_value));
        } else {
          assert.ok(cache1.has(_value));
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder: equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true,
      equalInnerReferences: true
    });
    clone.cross = {};
    obj.cross = clone.cross;
    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder: equalMapSetOrder,
      equalTypes: true,
      equalInnerReferences: true
    });
    obj.cross = {};
    testDeepEqual([clone], [obj], {
      circular: true,
      equalMapSetOrder: equalMapSetOrder,
      equalTypes: true,
      noCrossReferences: true,
      equalInnerReferences: true
    });

    if (obj.array) {
      clone.array.push(clone);
      obj.array.push(clone);
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder: equalMapSetOrder,
        equalTypes: true,
        equalInnerReferences: true
      });
      obj.array[obj.array.length - 1] = obj;
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder: equalMapSetOrder,
        equalTypes: true,
        noCrossReferences: true,
        equalInnerReferences: true
      });
      clone.array.length--;
      obj.array.length--;
      obj.object = _objectSpread({}, obj.object);
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder: equalMapSetOrder,
        equalTypes: true,
        noCrossReferences: true // equalInnerReferences: true,

      });
      obj.array = new Set(obj.array);
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder: equalMapSetOrder,
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
        equalMapSetOrder: equalMapSetOrder // equalTypes: true,
        // noCrossReferences: true,
        // equalInnerReferences: true,

      });
    }
  };

  it('noCrossReferences', function () {
    var obj = {
      a: {}
    };
    var obj2 = {
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
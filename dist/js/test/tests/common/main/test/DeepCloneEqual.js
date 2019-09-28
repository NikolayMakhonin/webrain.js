"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _helpers = require("../src/helpers/helpers");

var _TestDeepEqual = require("./src/TestDeepEqual");

/* tslint:disable:no-construct use-primitive-type */
(0, _Mocha.describe)('common > test > DeepCloneEqual', function () {
  this.timeout(60000);
  var _testDeepEqual = _TestDeepEqual.TestDeepEqual.test;
  after(function () {
    console.log('Total DeepCloneEqual tests >= ' + _TestDeepEqual.TestDeepEqual.totalTests);
  });
  var objectOptions = {
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
    var result = _TestDeepEqual.deepCloneEqual.clone(value, options, cache);

    return result;
  };

  var notCircularTest = function notCircularTest(equalMapSetOrder) {
    var obj = (0, _helpers.createComplexObject)((0, _extends2.default)({}, objectOptions, {
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
    var obj = (0, _helpers.createComplexObject)((0, _extends2.default)({}, objectOptions, {
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
    cache1 = new _set.default(cache1);
    cache2 = new _set.default(cache2);

    _Assert.assert.strictEqual(cache1.size, cache2.size);

    for (var _iterator = cache1, _isArray = (0, _isArray3.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var value = _ref;

      if (value && typeof value === 'object') {
        _Assert.assert.notOk(cache2.has(value));
      } else {
        _Assert.assert.ok(cache2.has(value));
      }
    }

    for (var _iterator2 = cache2, _isArray2 = (0, _isArray3.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var _value = _ref2;

      if (_value && typeof _value === 'object') {
        _Assert.assert.notOk(cache1.has(_value));
      } else {
        _Assert.assert.ok(cache1.has(_value));
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
      obj.object = (0, _extends2.default)({}, obj.object);
      testDeepEqual([clone], [obj], {
        circular: true,
        equalMapSetOrder: equalMapSetOrder,
        equalTypes: true,
        noCrossReferences: true // equalInnerReferences: true,

      });
      obj.array = new _set.default(obj.array);
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

  (0, _Mocha.it)('noCrossReferences', function () {
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
  (0, _Mocha.it)('not circular', function () {
    notCircularTest(true);
  });
  (0, _Mocha.it)('not circular not equalMapSetOrder', function () {
    notCircularTest(false);
  });
  (0, _Mocha.it)('circular', function () {
    circularTest(true);
  });
  (0, _Mocha.it)('circular not equalMapSetOrder', function () {
    circularTest(false);
  });
});
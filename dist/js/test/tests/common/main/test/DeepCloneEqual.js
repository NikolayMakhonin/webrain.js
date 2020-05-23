"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _helpers = require("../src/helpers/helpers");

var _TestDeepEqual = require("./src/TestDeepEqual");

function _createForOfIteratorHelperLoose(o) { var _context2; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context2 = i.next).call(_context2, i); }

function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
    var obj = (0, _helpers.createComplexObject)((0, _extends2.default)((0, _extends2.default)({}, objectOptions), {}, {
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
    var obj = (0, _helpers.createComplexObject)((0, _extends2.default)((0, _extends2.default)({}, objectOptions), {}, {
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

    for (var _iterator = _createForOfIteratorHelperLoose(cache1), _step; !(_step = _iterator()).done;) {
      var value = _step.value;

      if (value && typeof value === 'object') {
        _Assert.assert.notOk(cache2.has(value));
      } else {
        _Assert.assert.ok(cache2.has(value));
      }
    }

    for (var _iterator2 = _createForOfIteratorHelperLoose(cache2), _step2; !(_step2 = _iterator2()).done;) {
      var _value = _step2.value;

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
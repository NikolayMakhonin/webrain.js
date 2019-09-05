"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _Assert = require("../../../../../main/common/test/Assert");

var _helpers = require("../src/helpers/helpers");

var _TestDeepEqual = require("./src/TestDeepEqual");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context; (0, _forEach.default)(_context = ownKeys(source, true)).call(_context, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context2; (0, _forEach.default)(_context2 = ownKeys(source)).call(_context2, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

describe('common > test > DeepCloneEqual', function () {
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
    var obj = (0, _helpers.createComplexObject)(_objectSpread({}, objectOptions, {
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
    var obj = (0, _helpers.createComplexObject)(_objectSpread({}, objectOptions, {
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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2.default)(cache1), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var value = _step.value;

        if (value && (0, _typeof2.default)(value) === 'object') {
          _Assert.assert.notOk(cache2.has(value));
        } else {
          _Assert.assert.ok(cache2.has(value));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
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
      for (var _iterator2 = (0, _getIterator2.default)(cache2), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _value = _step2.value;

        if (_value && (0, _typeof2.default)(_value) === 'object') {
          _Assert.assert.notOk(cache1.has(_value));
        } else {
          _Assert.assert.ok(cache1.has(_value));
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
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
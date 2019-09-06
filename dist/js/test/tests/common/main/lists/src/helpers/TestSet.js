"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.applySetChangedToArray = applySetChangedToArray;
exports.TestSet = exports.assert = void 0;

var _iterator10 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray10 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _serializers = require("../../../../../../../main/common/extensions/serialization/serializers");

var _ArraySet = require("../../../../../../../main/common/lists/ArraySet");

var _ISetChanged = require("../../../../../../../main/common/lists/contracts/ISetChanged");

var _compare = require("../../../../../../../main/common/lists/helpers/compare");

var _ObjectSet = require("../../../../../../../main/common/lists/ObjectSet");

var _ObservableSet = require("../../../../../../../main/common/lists/ObservableSet");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants2 = require("../../../src/helpers/TestVariants");

var _common = require("./common");

var _Symbol$toStringTag, _Symbol$iterator;

var assert = new _Assert.Assert(new _DeepCloneEqual.DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));
exports.assert = assert;

function applySetChangedToArray(event, array) {
  switch (event.type) {
    case _ISetChanged.SetChangedType.Added:
      for (var _iterator = event.newItems, _isArray = (0, _isArray10.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var item = _ref;
        array.push(item);
      }

      break;

    case _ISetChanged.SetChangedType.Removed:
      for (var _iterator2 = event.oldItems, _isArray2 = (0, _isArray10.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _item = _ref2;
        var index = _item === _item ? (0, _indexOf.default)(array).call(array, _item) : (0, _common.indexOfNaN)(array);
        (0, _splice.default)(array).call(array, index, 1);
      }

      break;
  }
}

function testSerialization(set) {
  var serialized = _serializers.ObjectSerializer.default.serialize(set);

  var result = _serializers.ObjectSerializer.default.deSerialize(serialized);

  assert.notStrictEqual(result, set);
  assert.deepStrictEqual((0, _entries.default)(result).call(result), (0, _entries.default)(set).call(set));
}

function assertSet(set, expectedArray) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9;

  expectedArray = (0, _sort.default)(expectedArray).call(expectedArray, _compare.compareFast);
  assert.deepStrictEqual((0, _sort.default)(_context = (0, _from.default)((0, _keys.default)(set).call(set))).call(_context, _compare.compareFast), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context2 = (0, _from.default)((0, _values.default)(set).call(set))).call(_context2, _compare.compareFast), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context3 = (0, _map.default)(_context4 = (0, _from.default)((0, _entries.default)(set).call(set))).call(_context4, function (o) {
    return o[0];
  })).call(_context3, _compare.compareFast), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context5 = (0, _map.default)(_context6 = (0, _from.default)((0, _entries.default)(set).call(set))).call(_context6, function (o) {
    return o[1];
  })).call(_context5, _compare.compareFast), expectedArray);
  assert.strictEqual(set.size, expectedArray.length);

  for (var _iterator3 = expectedArray, _isArray3 = (0, _isArray10.default)(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var item = _ref3;
    assert.strictEqual(set.has(item), true);
    assert.strictEqual(set.has(Math.random()), false);
  }

  var forEachArray = [];
  var thisArg = {};
  (0, _forEach.default)(set).call(set, function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, set);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual((0, _sort.default)(_context7 = (0, _map.default)(forEachArray).call(forEachArray, function (o) {
    return o[0];
  })).call(_context7, _compare.compareFast), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context8 = (0, _map.default)(forEachArray).call(forEachArray, function (o) {
    return o[1];
  })).call(_context8, _compare.compareFast), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context9 = (0, _from.default)(set)).call(_context9, _compare.compareFast), expectedArray);
  testSerialization(set);
}

var staticSetInner = new _set.default();
var staticSet = new _ObservableSet.ObservableSet(staticSetInner);
_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator10.default;

var SetWrapper =
/*#__PURE__*/
function () {
  function SetWrapper(set) {
    (0, _classCallCheck2.default)(this, SetWrapper);
    this[_Symbol$toStringTag] = 'Set';
    this._set = set;
  }

  (0, _createClass2.default)(SetWrapper, [{
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function value() {
      var _iterator4, _isArray4, _i4, _ref4, item;

      return _regenerator.default.wrap(function value$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _iterator4 = this._set, _isArray4 = (0, _isArray10.default)(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator2.default)(_iterator4);

            case 1:
              if (!_isArray4) {
                _context10.next = 7;
                break;
              }

              if (!(_i4 >= _iterator4.length)) {
                _context10.next = 4;
                break;
              }

              return _context10.abrupt("break", 16);

            case 4:
              _ref4 = _iterator4[_i4++];
              _context10.next = 11;
              break;

            case 7:
              _i4 = _iterator4.next();

              if (!_i4.done) {
                _context10.next = 10;
                break;
              }

              return _context10.abrupt("break", 16);

            case 10:
              _ref4 = _i4.value;

            case 11:
              item = _ref4;
              _context10.next = 14;
              return item.value;

            case 14:
              _context10.next = 1;
              break;

            case 16:
            case "end":
              return _context10.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: "add",
    value: function add(value) {
      this._set.add((0, _common.convertToObject)(value));

      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._set.clear();
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      return this._set.delete((0, _common.convertToObject)(value));
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function entries() {
      var _iterator5, _isArray5, _i5, _context11, _ref5, entry;

      return _regenerator.default.wrap(function entries$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _iterator5 = (0, _entries.default)(_context11 = this._set).call(_context11), _isArray5 = (0, _isArray10.default)(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator2.default)(_iterator5);

            case 1:
              if (!_isArray5) {
                _context12.next = 7;
                break;
              }

              if (!(_i5 >= _iterator5.length)) {
                _context12.next = 4;
                break;
              }

              return _context12.abrupt("break", 16);

            case 4:
              _ref5 = _iterator5[_i5++];
              _context12.next = 11;
              break;

            case 7:
              _i5 = _iterator5.next();

              if (!_i5.done) {
                _context12.next = 10;
                break;
              }

              return _context12.abrupt("break", 16);

            case 10:
              _ref5 = _i5.value;

            case 11:
              entry = _ref5;
              _context12.next = 14;
              return [entry[0].value, entry[1].value];

            case 14:
              _context12.next = 1;
              break;

            case 16:
            case "end":
              return _context12.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _context13;

      (0, _forEach.default)(_context13 = this._set).call(_context13, function (value, key) {
        callbackfn(value.value, key.value, this);
      }, thisArg);
    }
  }, {
    key: "has",
    value: function has(value) {
      return this._set.has((0, _common.convertToObject)(value));
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function keys() {
      var _iterator6, _isArray6, _i6, _context14, _ref6, item;

      return _regenerator.default.wrap(function keys$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _iterator6 = (0, _keys.default)(_context14 = this._set).call(_context14), _isArray6 = (0, _isArray10.default)(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : (0, _getIterator2.default)(_iterator6);

            case 1:
              if (!_isArray6) {
                _context15.next = 7;
                break;
              }

              if (!(_i6 >= _iterator6.length)) {
                _context15.next = 4;
                break;
              }

              return _context15.abrupt("break", 16);

            case 4:
              _ref6 = _iterator6[_i6++];
              _context15.next = 11;
              break;

            case 7:
              _i6 = _iterator6.next();

              if (!_i6.done) {
                _context15.next = 10;
                break;
              }

              return _context15.abrupt("break", 16);

            case 10:
              _ref6 = _i6.value;

            case 11:
              item = _ref6;
              _context15.next = 14;
              return item.value;

            case 14:
              _context15.next = 1;
              break;

            case 16:
            case "end":
              return _context15.stop();
          }
        }
      }, keys, this);
    })
  }, {
    key: "values",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function values() {
      var _iterator7, _isArray7, _i7, _context16, _ref7, item;

      return _regenerator.default.wrap(function values$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _iterator7 = (0, _values.default)(_context16 = this._set).call(_context16), _isArray7 = (0, _isArray10.default)(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : (0, _getIterator2.default)(_iterator7);

            case 1:
              if (!_isArray7) {
                _context17.next = 7;
                break;
              }

              if (!(_i7 >= _iterator7.length)) {
                _context17.next = 4;
                break;
              }

              return _context17.abrupt("break", 16);

            case 4:
              _ref7 = _iterator7[_i7++];
              _context17.next = 11;
              break;

            case 7:
              _i7 = _iterator7.next();

              if (!_i7.done) {
                _context17.next = 10;
                break;
              }

              return _context17.abrupt("break", 16);

            case 10:
              _ref7 = _i7.value;

            case 11:
              item = _ref7;
              _context17.next = 14;
              return item.value;

            case 14:
              _context17.next = 1;
              break;

            case 16:
            case "end":
              return _context17.stop();
          }
        }
      }, values, this);
    }) // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        set: _serialize(this._set)
      };
    } // tslint:disable-next-line:no-empty

  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._set.size;
    }
  }]);
  return SetWrapper;
}();

SetWrapper.uuid = '5de4524d6cdb41e989689798ecedef5d';
(0, _serializers.registerSerializable)(SetWrapper, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      var innerSet, value;
      return _regenerator.default.wrap(function deSerialize$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return _deSerialize2(serializedValue.set);

            case 2:
              innerSet = _context18.sent;
              value = valueFactory(innerSet);
              value.deSerialize(_deSerialize2, serializedValue);
              return _context18.abrupt("return", value);

            case 6:
            case "end":
              return _context18.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var TestSet =
/*#__PURE__*/
function (_TestVariants) {
  (0, _inherits2.default)(TestSet, _TestVariants);

  function TestSet() {
    var _this;

    (0, _classCallCheck2.default)(this, TestSet);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TestSet).call(this));
    _this.baseOptionsVariants = {
      reuseSetInstance: [false, true],
      useSetChanged: [false, true],
      innerSet: ['Set', 'Set<Object>', 'ObjectSet', 'ArraySet'],
      convertToObject: [false, true]
    };
    return _this;
  }

  (0, _createClass2.default)(TestSet, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeSetChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var _context19, _context20, _context23, _context24;

            var array = (0, _slice.default)(_context19 = options.array).call(_context19);
            var expectedArray = (0, _slice.default)(_context20 = options.expected.array).call(_context20);
            var set = void 0;
            var setInner = void 0;

            if (options.reuseSetInstance) {
              staticSet.clear();

              for (var _iterator8 = array, _isArray8 = (0, _isArray10.default)(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : (0, _getIterator2.default)(_iterator8);;) {
                var _ref8;

                if (_isArray8) {
                  if (_i8 >= _iterator8.length) break;
                  _ref8 = _iterator8[_i8++];
                } else {
                  _i8 = _iterator8.next();
                  if (_i8.done) break;
                  _ref8 = _i8.value;
                }

                var item = _ref8;
                staticSet.add(item);
              }

              set = staticSet;
              setInner = staticSetInner;
            } else {
              switch (options.innerSet) {
                case 'ObjectSet':
                  setInner = new _ObjectSet.ObjectSet({});
                  break;

                case 'ArraySet':
                  setInner = new SetWrapper(new _ArraySet.ArraySet([]));
                  break;

                case 'Set<Object>':
                  setInner = new SetWrapper(new _set.default());
                  break;

                case 'Set':
                  setInner = new _set.default();
                  break;

                default:
                  assert.fail('Unknown options.innerSet: ' + options.innerSet);
                  break;
              }

              for (var _iterator9 = array, _isArray9 = (0, _isArray10.default)(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : (0, _getIterator2.default)(_iterator9);;) {
                var _ref9;

                if (_isArray9) {
                  if (_i9 >= _iterator9.length) break;
                  _ref9 = _iterator9[_i9++];
                } else {
                  _i9 = _iterator9.next();
                  if (_i9.done) break;
                  _ref9 = _i9.value;
                }

                var _item2 = _ref9;
                setInner.add(_item2);
              }

              set = new _ObservableSet.ObservableSet(setInner);
            }

            var arrayReplicate = (0, _slice.default)(array).call(array, 0, set.size);
            var setChangedEvents = [];

            if (options.useSetChanged) {
              unsubscribeSetChanged = set.setChanged.subscribe(function (event) {
                var _context21, _context22;

                setChangedEvents.push(event);
                applySetChangedToArray(event, arrayReplicate);
                assert.deepStrictEqual((0, _sort.default)(_context21 = (0, _slice.default)(arrayReplicate).call(arrayReplicate)).call(_context21, _compare.compareFast), (0, _sort.default)(_context22 = (0, _from.default)((0, _values.default)(setInner).call(setInner))).call(_context22, _compare.compareFast));
              });
            }

            var propertyChangedEvents = [];
            unsubscribePropertyChanged = set.propertyChanged.subscribe(function (event) {
              propertyChangedEvents.push(event);
            });

            if (!options.reuseSetInstance) {
              assertSet(set, (0, _from.default)((0, _values.default)(setInner).call(setInner)));
            }

            if (options.expected.error) {
              assert.throws(function () {
                return options.action(set);
              }, options.expected.error);
              assertSet(set, array);
            } else {
              assert.deepStrictEqual(options.action(set), options.expected.returnValue === _TestVariants2.THIS ? set : options.expected.returnValue);
              assertSet(set, expectedArray);
            }

            assert.deepStrictEqual((0, _sort.default)(_context23 = (0, _from.default)((0, _values.default)(setInner).call(setInner))).call(_context23, _compare.compareFast), (0, _sort.default)(_context24 = (0, _from.default)((0, _values.default)(set).call(set))).call(_context24, _compare.compareFast));

            if (options.useSetChanged) {
              var _context25, _context26;

              if (unsubscribeSetChanged) {
                unsubscribeSetChanged();
              }

              assert.deepStrictEqual(setChangedEvents, options.expected.setChanged || []);
              assert.deepStrictEqual((0, _sort.default)(_context25 = (0, _slice.default)(arrayReplicate).call(arrayReplicate)).call(_context25, _compare.compareFast), (0, _sort.default)(_context26 = (0, _from.default)((0, _values.default)(set).call(set))).call(_context26, _compare.compareFast));
            }

            if (unsubscribePropertyChanged) {
              unsubscribePropertyChanged();
            }

            var expectedPropertyChanged = options.expected.propertyChanged;

            if (!expectedPropertyChanged && !options.expected.error && array.length !== expectedArray.length) {
              expectedPropertyChanged = [{
                name: 'size',
                oldValue: array.length,
                newValue: expectedArray.length
              }];
            }

            assert.deepStrictEqual(propertyChangedEvents, expectedPropertyChanged || []);
            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Error in: " + options.description + "\n" + (0, _stringify.default)(options, null, 4) + "\n" + options.action.toString() + "\n" + ex.stack);
            error = ex;
          }
        } finally {
          if (unsubscribeSetChanged) {
            unsubscribeSetChanged();
          }

          if (unsubscribePropertyChanged) {
            unsubscribePropertyChanged();
          }

          TestSet.totalSetTests++;
        }
      }

      if (error) {
        throw error;
      }
    }
  }], [{
    key: "test",
    value: function test(testCases) {
      TestSet._instance.test(testCases);
    }
  }]);
  return TestSet;
}(_TestVariants2.TestVariants);

exports.TestSet = TestSet;
TestSet.totalSetTests = 0;
TestSet._instance = new TestSet();
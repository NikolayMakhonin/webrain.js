"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.applySetChangedToArray = applySetChangedToArray;
exports.TestSet = exports.assert = void 0;

var _iterator10 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(event.newItems), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          array.push(item);
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

      break;

    case _ISetChanged.SetChangedType.Removed:
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator2.default)(event.oldItems), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _item = _step2.value;
          var index = _item === _item ? (0, _indexOf.default)(array).call(array, _item) : (0, _common.indexOfNaN)(array);
          (0, _splice.default)(array).call(array, index, 1);
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
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = (0, _getIterator2.default)(expectedArray), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var item = _step3.value;
      assert.strictEqual(set.has(item), true);
      assert.strictEqual(set.has(Math.random()), false);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
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
      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, item;

      return _regenerator.default.wrap(function value$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context10.prev = 3;
              _iterator4 = (0, _getIterator2.default)(this._set);

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context10.next = 12;
                break;
              }

              item = _step4.value;
              _context10.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion4 = true;
              _context10.next = 5;
              break;

            case 12:
              _context10.next = 18;
              break;

            case 14:
              _context10.prev = 14;
              _context10.t0 = _context10["catch"](3);
              _didIteratorError4 = true;
              _iteratorError4 = _context10.t0;

            case 18:
              _context10.prev = 18;
              _context10.prev = 19;

              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }

            case 21:
              _context10.prev = 21;

              if (!_didIteratorError4) {
                _context10.next = 24;
                break;
              }

              throw _iteratorError4;

            case 24:
              return _context10.finish(21);

            case 25:
              return _context10.finish(18);

            case 26:
            case "end":
              return _context10.stop();
          }
        }
      }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
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
      var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _context11, entry;

      return _regenerator.default.wrap(function entries$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context12.prev = 3;
              _iterator5 = (0, _getIterator2.default)((0, _entries.default)(_context11 = this._set).call(_context11));

            case 5:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context12.next = 12;
                break;
              }

              entry = _step5.value;
              _context12.next = 9;
              return [entry[0].value, entry[1].value];

            case 9:
              _iteratorNormalCompletion5 = true;
              _context12.next = 5;
              break;

            case 12:
              _context12.next = 18;
              break;

            case 14:
              _context12.prev = 14;
              _context12.t0 = _context12["catch"](3);
              _didIteratorError5 = true;
              _iteratorError5 = _context12.t0;

            case 18:
              _context12.prev = 18;
              _context12.prev = 19;

              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }

            case 21:
              _context12.prev = 21;

              if (!_didIteratorError5) {
                _context12.next = 24;
                break;
              }

              throw _iteratorError5;

            case 24:
              return _context12.finish(21);

            case 25:
              return _context12.finish(18);

            case 26:
            case "end":
              return _context12.stop();
          }
        }
      }, entries, this, [[3, 14, 18, 26], [19,, 21, 25]]);
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
      var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _context14, item;

      return _regenerator.default.wrap(function keys$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              _context15.prev = 3;
              _iterator6 = (0, _getIterator2.default)((0, _keys.default)(_context14 = this._set).call(_context14));

            case 5:
              if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                _context15.next = 12;
                break;
              }

              item = _step6.value;
              _context15.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion6 = true;
              _context15.next = 5;
              break;

            case 12:
              _context15.next = 18;
              break;

            case 14:
              _context15.prev = 14;
              _context15.t0 = _context15["catch"](3);
              _didIteratorError6 = true;
              _iteratorError6 = _context15.t0;

            case 18:
              _context15.prev = 18;
              _context15.prev = 19;

              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }

            case 21:
              _context15.prev = 21;

              if (!_didIteratorError6) {
                _context15.next = 24;
                break;
              }

              throw _iteratorError6;

            case 24:
              return _context15.finish(21);

            case 25:
              return _context15.finish(18);

            case 26:
            case "end":
              return _context15.stop();
          }
        }
      }, keys, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }, {
    key: "values",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function values() {
      var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _context16, item;

      return _regenerator.default.wrap(function values$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _iteratorNormalCompletion7 = true;
              _didIteratorError7 = false;
              _iteratorError7 = undefined;
              _context17.prev = 3;
              _iterator7 = (0, _getIterator2.default)((0, _values.default)(_context16 = this._set).call(_context16));

            case 5:
              if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                _context17.next = 12;
                break;
              }

              item = _step7.value;
              _context17.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion7 = true;
              _context17.next = 5;
              break;

            case 12:
              _context17.next = 18;
              break;

            case 14:
              _context17.prev = 14;
              _context17.t0 = _context17["catch"](3);
              _didIteratorError7 = true;
              _iteratorError7 = _context17.t0;

            case 18:
              _context17.prev = 18;
              _context17.prev = 19;

              if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                _iterator7.return();
              }

            case 21:
              _context17.prev = 21;

              if (!_didIteratorError7) {
                _context17.next = 24;
                break;
              }

              throw _iteratorError7;

            case 24:
              return _context17.finish(21);

            case 25:
              return _context17.finish(18);

            case 26:
            case "end":
              return _context17.stop();
          }
        }
      }, values, this, [[3, 14, 18, 26], [19,, 21, 25]]);
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
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = (0, _getIterator2.default)(array), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var item = _step8.value;
                  staticSet.add(item);
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
                    _iterator8.return();
                  }
                } finally {
                  if (_didIteratorError8) {
                    throw _iteratorError8;
                  }
                }
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

              var _iteratorNormalCompletion9 = true;
              var _didIteratorError9 = false;
              var _iteratorError9 = undefined;

              try {
                for (var _iterator9 = (0, _getIterator2.default)(array), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  var _item2 = _step9.value;
                  setInner.add(_item2);
                }
              } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
                    _iterator9.return();
                  }
                } finally {
                  if (_didIteratorError9) {
                    throw _iteratorError9;
                  }
                }
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
            var _context27, _context28, _context29;

            console.log((0, _concat.default)(_context27 = (0, _concat.default)(_context28 = (0, _concat.default)(_context29 = "Error in: ".concat(options.description, "\n")).call(_context29, (0, _stringify.default)(options, null, 4), "\n")).call(_context28, options.action.toString(), "\n")).call(_context27, ex.stack));
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
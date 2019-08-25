import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var _Symbol$toStringTag, _Symbol$iterator;

import { ObjectSerializer, registerSerializable } from '../../../../../../../main/common/extensions/serialization/serializers';
import { ArraySet } from '../../../../../../../main/common/lists/ArraySet';
import { SetChangedType } from '../../../../../../../main/common/lists/contracts/ISetChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { ObjectSet } from '../../../../../../../main/common/lists/ObjectSet';
import { ObservableSet } from '../../../../../../../main/common/lists/ObservableSet';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants, THIS } from '../../../src/helpers/TestVariants';
import { convertToObject, indexOfNaN } from './common';
export var assert = new Assert(new DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));
export function applySetChangedToArray(event, array) {
  switch (event.type) {
    case SetChangedType.Added:
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = event.newItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          array.push(item);
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

      break;

    case SetChangedType.Removed:
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = event.oldItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _item = _step2.value;
          var index = _item === _item ? array.indexOf(_item) : indexOfNaN(array);
          array.splice(index, 1);
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

      break;
  }
}

function testSerialization(set) {
  var serialized = ObjectSerializer["default"].serialize(set);
  var result = ObjectSerializer["default"].deSerialize(serialized);
  assert.notStrictEqual(result, set);
  assert.deepStrictEqual(result.entries(), set.entries());
}

function assertSet(set, expectedArray) {
  expectedArray = expectedArray.sort(compareFast);
  assert.deepStrictEqual(Array.from(set.keys()).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.values()).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.entries()).map(function (o) {
    return o[0];
  }).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.entries()).map(function (o) {
    return o[1];
  }).sort(compareFast), expectedArray);
  assert.strictEqual(set.size, expectedArray.length);
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = expectedArray[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var item = _step3.value;
      assert.strictEqual(set.has(item), true);
      assert.strictEqual(set.has(Math.random()), false);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  var forEachArray = [];
  var thisArg = {};
  set.forEach(function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, set);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual(forEachArray.map(function (o) {
    return o[0];
  }).sort(compareFast), expectedArray);
  assert.deepStrictEqual(forEachArray.map(function (o) {
    return o[1];
  }).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set).sort(compareFast), expectedArray);
  testSerialization(set);
}

var staticSetInner = new Set();
var staticSet = new ObservableSet(staticSetInner);
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

var SetWrapper =
/*#__PURE__*/
function () {
  function SetWrapper(set) {
    _classCallCheck(this, SetWrapper);

    this[_Symbol$toStringTag] = 'Set';
    this._set = set;
  }

  _createClass(SetWrapper, [{
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function value() {
      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, item;

      return _regeneratorRuntime.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context.prev = 3;
              _iterator4 = this._set[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context.next = 12;
                break;
              }

              item = _step4.value;
              _context.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion4 = true;
              _context.next = 5;
              break;

            case 12:
              _context.next = 18;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](3);
              _didIteratorError4 = true;
              _iteratorError4 = _context.t0;

            case 18:
              _context.prev = 18;
              _context.prev = 19;

              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }

            case 21:
              _context.prev = 21;

              if (!_didIteratorError4) {
                _context.next = 24;
                break;
              }

              throw _iteratorError4;

            case 24:
              return _context.finish(21);

            case 25:
              return _context.finish(18);

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }, {
    key: "add",
    value: function add(value) {
      this._set.add(convertToObject(value));

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
      return this._set["delete"](convertToObject(value));
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, entry;

      return _regeneratorRuntime.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context2.prev = 3;
              _iterator5 = this._set.entries()[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context2.next = 12;
                break;
              }

              entry = _step5.value;
              _context2.next = 9;
              return [entry[0].value, entry[1].value];

            case 9:
              _iteratorNormalCompletion5 = true;
              _context2.next = 5;
              break;

            case 12:
              _context2.next = 18;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](3);
              _didIteratorError5 = true;
              _iteratorError5 = _context2.t0;

            case 18:
              _context2.prev = 18;
              _context2.prev = 19;

              if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                _iterator5["return"]();
              }

            case 21:
              _context2.prev = 21;

              if (!_didIteratorError5) {
                _context2.next = 24;
                break;
              }

              throw _iteratorError5;

            case 24:
              return _context2.finish(21);

            case 25:
              return _context2.finish(18);

            case 26:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      this._set.forEach(function (value, key) {
        callbackfn(value.value, key.value, this);
      }, thisArg);
    }
  }, {
    key: "has",
    value: function has(value) {
      return this._set.has(convertToObject(value));
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function keys() {
      var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item;

      return _regeneratorRuntime.wrap(function keys$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              _context3.prev = 3;
              _iterator6 = this._set.keys()[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                _context3.next = 12;
                break;
              }

              item = _step6.value;
              _context3.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion6 = true;
              _context3.next = 5;
              break;

            case 12:
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](3);
              _didIteratorError6 = true;
              _iteratorError6 = _context3.t0;

            case 18:
              _context3.prev = 18;
              _context3.prev = 19;

              if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                _iterator6["return"]();
              }

            case 21:
              _context3.prev = 21;

              if (!_didIteratorError6) {
                _context3.next = 24;
                break;
              }

              throw _iteratorError6;

            case 24:
              return _context3.finish(21);

            case 25:
              return _context3.finish(18);

            case 26:
            case "end":
              return _context3.stop();
          }
        }
      }, keys, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }, {
    key: "values",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function values() {
      var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, item;

      return _regeneratorRuntime.wrap(function values$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _iteratorNormalCompletion7 = true;
              _didIteratorError7 = false;
              _iteratorError7 = undefined;
              _context4.prev = 3;
              _iterator7 = this._set.values()[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                _context4.next = 12;
                break;
              }

              item = _step7.value;
              _context4.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion7 = true;
              _context4.next = 5;
              break;

            case 12:
              _context4.next = 18;
              break;

            case 14:
              _context4.prev = 14;
              _context4.t0 = _context4["catch"](3);
              _didIteratorError7 = true;
              _iteratorError7 = _context4.t0;

            case 18:
              _context4.prev = 18;
              _context4.prev = 19;

              if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                _iterator7["return"]();
              }

            case 21:
              _context4.prev = 21;

              if (!_didIteratorError7) {
                _context4.next = 24;
                break;
              }

              throw _iteratorError7;

            case 24:
              return _context4.finish(21);

            case 25:
              return _context4.finish(18);

            case 26:
            case "end":
              return _context4.stop();
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
registerSerializable(SetWrapper, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var innerSet, value;
          return _regeneratorRuntime.wrap(function _callee$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return _deSerialize2(serializedValue.set);

                case 2:
                  innerSet = _context5.sent;
                  value = valueFactory(innerSet);
                  value.deSerialize(_deSerialize2, serializedValue);
                  return _context5.abrupt("return", value);

                case 6:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});
export var TestSet =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestSet, _TestVariants);

  function TestSet() {
    var _this;

    _classCallCheck(this, TestSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestSet).call(this));
    _this.baseOptionsVariants = {
      reuseSetInstance: [false, true],
      useSetChanged: [false, true],
      innerSet: ['Set', 'Set<Object>', 'ObjectSet', 'ArraySet'],
      convertToObject: [false, true]
    };
    return _this;
  }

  _createClass(TestSet, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeSetChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var array = options.array.slice();
            var expectedArray = options.expected.array.slice();
            var set = void 0;
            var setInner = void 0;

            if (options.reuseSetInstance) {
              staticSet.clear();
              var _iteratorNormalCompletion8 = true;
              var _didIteratorError8 = false;
              var _iteratorError8 = undefined;

              try {
                for (var _iterator8 = array[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                  var item = _step8.value;
                  staticSet.add(item);
                }
              } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
                    _iterator8["return"]();
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
                  setInner = new ObjectSet({});
                  break;

                case 'ArraySet':
                  setInner = new SetWrapper(new ArraySet([]));
                  break;

                case 'Set<Object>':
                  setInner = new SetWrapper(new Set());
                  break;

                case 'Set':
                  setInner = new Set();
                  break;

                default:
                  assert.fail('Unknown options.innerSet: ' + options.innerSet);
                  break;
              }

              var _iteratorNormalCompletion9 = true;
              var _didIteratorError9 = false;
              var _iteratorError9 = undefined;

              try {
                for (var _iterator9 = array[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                  var _item2 = _step9.value;
                  setInner.add(_item2);
                }
              } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
                    _iterator9["return"]();
                  }
                } finally {
                  if (_didIteratorError9) {
                    throw _iteratorError9;
                  }
                }
              }

              set = new ObservableSet(setInner);
            }

            var arrayReplicate = array.slice(0, set.size);
            var setChangedEvents = [];

            if (options.useSetChanged) {
              unsubscribeSetChanged = set.setChanged.subscribe(function (event) {
                setChangedEvents.push(event);
                applySetChangedToArray(event, arrayReplicate);
                assert.deepStrictEqual(arrayReplicate.slice().sort(compareFast), Array.from(setInner.values()).sort(compareFast));
              });
            }

            var propertyChangedEvents = [];
            unsubscribePropertyChanged = set.propertyChanged.subscribe(function (event) {
              propertyChangedEvents.push(event);
            });

            if (!options.reuseSetInstance) {
              assertSet(set, Array.from(setInner.values()));
            }

            if (options.expected.error) {
              assert["throws"](function () {
                return options.action(set);
              }, options.expected.error);
              assertSet(set, array);
            } else {
              assert.deepStrictEqual(options.action(set), options.expected.returnValue === THIS ? set : options.expected.returnValue);
              assertSet(set, expectedArray);
            }

            assert.deepStrictEqual(Array.from(setInner.values()).sort(compareFast), Array.from(set.values()).sort(compareFast));

            if (options.useSetChanged) {
              if (unsubscribeSetChanged) {
                unsubscribeSetChanged();
              }

              assert.deepStrictEqual(setChangedEvents, options.expected.setChanged || []);
              assert.deepStrictEqual(arrayReplicate.slice().sort(compareFast), Array.from(set.values()).sort(compareFast));
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
            console.log("Error in: ".concat(options.description, "\n").concat(JSON.stringify(options, null, 4), "\n").concat(options.action.toString(), "\n").concat(ex.stack));
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
}(TestVariants);
TestSet.totalSetTests = 0;
TestSet._instance = new TestSet();
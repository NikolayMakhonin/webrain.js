import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var _Symbol$toStringTag, _Symbol$iterator;

import { ObjectSerializer, registerSerializable } from '../../../../../../../main/common/extensions/serialization/serializers';
import { ArrayMap } from '../../../../../../../main/common/lists/ArrayMap';
import { MapChangedType } from '../../../../../../../main/common/lists/contracts/IMapChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { ObjectHashMap } from '../../../../../../../main/common/lists/ObjectHashMap';
import { ObjectMap } from '../../../../../../../main/common/lists/ObjectMap';
import { ObservableMap } from '../../../../../../../main/common/lists/ObservableMap';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants, THIS } from '../../../src/helpers/TestVariants';
import { convertToObject } from './common';
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

function compareEntries(o1, o2) {
  return compareFast(o1[0], o2[0]);
}

function indexOf(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (compareEntries(array[i], item) === 0) {
      return i;
    }
  }

  return -1;
}

export function applyMapChangedToArray(event, array) {
  switch (event.type) {
    case MapChangedType.Added:
      array.push([event.key, event.newValue]);
      break;

    case MapChangedType.Removed:
      {
        var index = indexOf(array, [event.key, event.newValue]);
        array.splice(index, 1);
      }
      break;

    case MapChangedType.Set:
      {
        var _index = indexOf(array, [event.key, undefined]);

        array[_index][1] = event.newValue;
      }
      break;
  }
}

function testSerialization(map) {
  var serialized = ObjectSerializer["default"].serialize(map);
  var result = ObjectSerializer["default"].deSerialize(serialized);
  assert.notStrictEqual(result, map);
  assert.deepStrictEqual(Array.from(result.entries()), Array.from(map.entries()));
}

function assertMap(map, expectedArray) {
  expectedArray = expectedArray.map(function (o) {
    return o.slice();
  }).sort(compareEntries);
  assert.deepStrictEqual(Array.from(map.keys()).sort(compareFast), expectedArray.map(function (o) {
    return o[0];
  }));
  assert.deepStrictEqual(Array.from(map.values()).sort(compareFast), expectedArray.map(function (o) {
    return o[1];
  }).sort(compareFast));
  assert.deepStrictEqual(Array.from(map.entries()).sort(compareEntries), expectedArray);
  assert.deepStrictEqual(Array.from(map.entries()).sort(compareEntries), expectedArray);
  assert.strictEqual(map.size, expectedArray.length);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = expectedArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      assert.strictEqual(map.has(item[0]), true);
      assert.strictEqual(map.has(Math.random()), false);
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

  var forEachArray = [];
  var thisArg = {};
  map.forEach(function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, map);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual(forEachArray.sort(compareEntries), expectedArray);
  assert.deepStrictEqual(Array.from(map).sort(compareEntries), expectedArray);
  testSerialization(map);
}

var staticMapInner = new Map();
var staticMap = new ObservableMap(staticMapInner); // class ObjectMapWrapper<V> implements Map<string, V> {
// 	private readonly _object: { [key: string]: V }
// 	constructor(object: { [key: string]: V }) {
// 		this._object = object
// 	}
//
// 	public get size(): number {
// 		return Object.keys(this._object).length
// 	}
//
// 	public entries(): IterableIterator<[string, V]> {
// 		const {_object} = this
// 		return Object.keys(_object).map(o => [o, _object[o]] as [string, V])[Symbol.iterator]()
// 	}
//
// 	public set(key: string, value: V): this {
// 		this._object[key] = value
// 		return this
// 	}
//
// }

_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

var MapWrapper =
/*#__PURE__*/
function () {
  function MapWrapper(map) {
    _classCallCheck(this, MapWrapper);

    this[_Symbol$toStringTag] = 'Map';
    this._map = map;
  }

  _createClass(MapWrapper, [{
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function value() {
      var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item;

      return _regeneratorRuntime.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 3;
              _iterator2 = this._map[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 12;
                break;
              }

              item = _step2.value;
              _context.next = 9;
              return [item[0].value, item[1]];

            case 9:
              _iteratorNormalCompletion2 = true;
              _context.next = 5;
              break;

            case 12:
              _context.next = 18;
              break;

            case 14:
              _context.prev = 14;
              _context.t0 = _context["catch"](3);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t0;

            case 18:
              _context.prev = 18;
              _context.prev = 19;

              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }

            case 21:
              _context.prev = 21;

              if (!_didIteratorError2) {
                _context.next = 24;
                break;
              }

              throw _iteratorError2;

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
    key: "clear",
    value: function clear() {
      this._map.clear();
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      return this._map["delete"](convertToObject(key));
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, entry;

      return _regeneratorRuntime.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context2.prev = 3;
              _iterator3 = this._map.entries()[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context2.next = 12;
                break;
              }

              entry = _step3.value;
              _context2.next = 9;
              return [entry[0].value, entry[1]];

            case 9:
              _iteratorNormalCompletion3 = true;
              _context2.next = 5;
              break;

            case 12:
              _context2.next = 18;
              break;

            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](3);
              _didIteratorError3 = true;
              _iteratorError3 = _context2.t0;

            case 18:
              _context2.prev = 18;
              _context2.prev = 19;

              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }

            case 21:
              _context2.prev = 21;

              if (!_didIteratorError3) {
                _context2.next = 24;
                break;
              }

              throw _iteratorError3;

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
      this._map.forEach(function (value, key) {
        callbackfn(value, key.value, this);
      }, thisArg);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(convertToObject(key));
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._map.has(convertToObject(key));
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function keys() {
      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, item;

      return _regeneratorRuntime.wrap(function keys$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context3.prev = 3;
              _iterator4 = this._map.keys()[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context3.next = 12;
                break;
              }

              item = _step4.value;
              _context3.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion4 = true;
              _context3.next = 5;
              break;

            case 12:
              _context3.next = 18;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3["catch"](3);
              _didIteratorError4 = true;
              _iteratorError4 = _context3.t0;

            case 18:
              _context3.prev = 18;
              _context3.prev = 19;

              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }

            case 21:
              _context3.prev = 21;

              if (!_didIteratorError4) {
                _context3.next = 24;
                break;
              }

              throw _iteratorError4;

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
    key: "set",
    value: function set(key, value) {
      this._map.set(convertToObject(key), value);

      return this;
    }
  }, {
    key: "values",
    value: function values() {
      return this._map.values();
    } // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        map: _serialize(this._map)
      };
    } // tslint:disable-next-line:no-empty

  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return MapWrapper;
}();

MapWrapper.uuid = 'bc06eeb6-5139-444a-a735-57a6e1928ac9';
registerSerializable(MapWrapper, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var innerMap, value;
          return _regeneratorRuntime.wrap(function _callee$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return _deSerialize2(serializedValue.map);

                case 2:
                  innerMap = _context4.sent;
                  value = valueFactory(innerMap);
                  value.deSerialize(_deSerialize2, serializedValue);
                  return _context4.abrupt("return", value);

                case 6:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});
export var TestMap =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestMap, _TestVariants);

  function TestMap() {
    var _this;

    _classCallCheck(this, TestMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestMap).call(this));
    _this.baseOptionsVariants = {
      reuseMapInstance: [false, true],
      useMapChanged: [false, true],
      innerMap: ['Map', 'Map<Object>', 'ObjectMap', 'ObjectHashMap', 'ArrayMap']
    };
    return _this;
  }

  _createClass(TestMap, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeMapChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var array = options.array.map(function (o) {
              return o.slice();
            });
            var map = void 0;
            var mapInner = void 0;

            if (options.reuseMapInstance) {
              staticMap.clear();
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = array[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var item = _step5.value;
                  staticMap.set.apply(staticMap, _toConsumableArray(item));
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                    _iterator5["return"]();
                  }
                } finally {
                  if (_didIteratorError5) {
                    throw _iteratorError5;
                  }
                }
              }

              map = staticMap;
              mapInner = staticMapInner;
            } else {
              switch (options.innerMap) {
                case 'ObjectMap':
                  mapInner = new ObjectMap({});
                  break;

                case 'ObjectHashMap':
                  mapInner = new MapWrapper(new ObjectHashMap({}));
                  break;

                case 'ArrayMap':
                  mapInner = new MapWrapper(new ArrayMap([]));
                  break;

                case 'Map<Object>':
                  mapInner = new MapWrapper(new Map());
                  break;

                case 'Map':
                  mapInner = new Map();
                  break;

                default:
                  assert.fail('Unknown options.innerMap: ' + options.innerMap);
                  break;
              }

              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = array[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var _mapInner;

                  var _item = _step6.value;

                  (_mapInner = mapInner).set.apply(_mapInner, _toConsumableArray(_item));
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                    _iterator6["return"]();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }

              map = new ObservableMap(mapInner);
            }

            var arrayReplicate = array.map(function (o) {
              return o.slice();
            });
            var mapChangedEvents = [];

            if (options.useMapChanged) {
              unsubscribeMapChanged = map.mapChanged.subscribe(function (event) {
                mapChangedEvents.push(event);
                applyMapChangedToArray(event, arrayReplicate);

                if (event.type !== MapChangedType.Removed || mapInner.size > 0) {
                  assert.deepStrictEqual(arrayReplicate.map(function (o) {
                    return o.slice();
                  }).sort(compareEntries), Array.from(mapInner.entries()).sort(compareEntries));
                }
              });
            }

            var propertyChangedEvents = [];
            unsubscribePropertyChanged = map.propertyChanged.subscribe(function (event) {
              propertyChangedEvents.push(event);
            });

            if (!options.reuseMapInstance) {
              assertMap(map, Array.from(mapInner.entries()));
            }

            if (options.expected.error) {
              assert["throws"](function () {
                return options.action(map);
              }, options.expected.error);
              assertMap(map, options.array);
            } else {
              assert.deepStrictEqual(options.action(map), options.expected.returnValue === THIS ? map : options.expected.returnValue);
              assertMap(map, options.expected.array);
            }

            assert.deepStrictEqual(Array.from(mapInner.entries()).sort(compareEntries), Array.from(map.entries()).sort(compareEntries));

            if (options.useMapChanged) {
              if (unsubscribeMapChanged) {
                unsubscribeMapChanged();
              }

              assert.deepStrictEqual(mapChangedEvents, options.expected.mapChanged || []);
              assert.deepStrictEqual(arrayReplicate.map(function (o) {
                return o.slice();
              }).sort(compareEntries), Array.from(map.entries()).sort(compareEntries));
            }

            if (unsubscribePropertyChanged) {
              unsubscribePropertyChanged();
            }

            var expectedPropertyChanged = options.expected.propertyChanged;

            if (!expectedPropertyChanged && !options.expected.error && options.array.length !== options.expected.array.length) {
              expectedPropertyChanged = [{
                name: 'size',
                oldValue: options.array.length,
                newValue: options.expected.array.length
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
          if (unsubscribeMapChanged) {
            unsubscribeMapChanged();
          }

          if (unsubscribePropertyChanged) {
            unsubscribePropertyChanged();
          }

          TestMap.totalMapTests++;
        }
      }

      if (error) {
        throw error;
      }
    }
  }], [{
    key: "test",
    value: function test(testCases) {
      TestMap._instance.test(testCases);
    }
  }]);

  return TestMap;
}(TestVariants);
TestMap.totalMapTests = 0;
TestMap._instance = new TestMap();
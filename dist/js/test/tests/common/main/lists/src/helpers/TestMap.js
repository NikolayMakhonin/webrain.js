"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.applyMapChangedToArray = applyMapChangedToArray;
exports.TestMap = exports.assert = void 0;

var _iterator7 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _serializers = require("../../../../../../../main/common/extensions/serialization/serializers");

var _ArrayMap = require("../../../../../../../main/common/lists/ArrayMap");

var _IMapChanged = require("../../../../../../../main/common/lists/contracts/IMapChanged");

var _compare = require("../../../../../../../main/common/lists/helpers/compare");

var _ObjectHashMap = require("../../../../../../../main/common/lists/ObjectHashMap");

var _ObjectMap = require("../../../../../../../main/common/lists/ObjectMap");

var _ObservableMap = require("../../../../../../../main/common/lists/ObservableMap");

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

function compareEntries(o1, o2) {
  return (0, _compare.compareFast)(o1[0], o2[0]);
}

function indexOf(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (compareEntries(array[i], item) === 0) {
      return i;
    }
  }

  return -1;
}

function applyMapChangedToArray(event, array) {
  switch (event.type) {
    case _IMapChanged.MapChangedType.Added:
      array.push([event.key, event.newValue]);
      break;

    case _IMapChanged.MapChangedType.Removed:
      {
        var index = indexOf(array, [event.key, event.newValue]);
        (0, _splice.default)(array).call(array, index, 1);
      }
      break;

    case _IMapChanged.MapChangedType.Set:
      {
        var _index = indexOf(array, [event.key, undefined]);

        array[_index][1] = event.newValue;
      }
      break;
  }
}

function testSerialization(map) {
  var serialized = _serializers.ObjectSerializer.default.serialize(map);

  var result = _serializers.ObjectSerializer.default.deSerialize(serialized);

  assert.notStrictEqual(result, map);
  assert.deepStrictEqual((0, _from.default)((0, _entries.default)(result).call(result)), (0, _from.default)((0, _entries.default)(map).call(map)));
}

function assertMap(map, expectedArray) {
  var _context, _context2, _context3, _context4, _context5, _context6, _context7;

  expectedArray = (0, _sort.default)(_context = (0, _map2.default)(expectedArray).call(expectedArray, function (o) {
    return (0, _slice.default)(o).call(o);
  })).call(_context, compareEntries);
  assert.deepStrictEqual((0, _sort.default)(_context2 = (0, _from.default)((0, _keys.default)(map).call(map))).call(_context2, _compare.compareFast), (0, _map2.default)(expectedArray).call(expectedArray, function (o) {
    return o[0];
  }));
  assert.deepStrictEqual((0, _sort.default)(_context3 = (0, _from.default)((0, _values.default)(map).call(map))).call(_context3, _compare.compareFast), (0, _sort.default)(_context4 = (0, _map2.default)(expectedArray).call(expectedArray, function (o) {
    return o[1];
  })).call(_context4, _compare.compareFast));
  assert.deepStrictEqual((0, _sort.default)(_context5 = (0, _from.default)((0, _entries.default)(map).call(map))).call(_context5, compareEntries), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context6 = (0, _from.default)((0, _entries.default)(map).call(map))).call(_context6, compareEntries), expectedArray);
  assert.strictEqual(map.size, expectedArray.length);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator2.default)(expectedArray), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;
      assert.strictEqual(map.has(item[0]), true);
      assert.strictEqual(map.has(Math.random()), false);
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

  var forEachArray = [];
  var thisArg = {};
  (0, _forEach.default)(map).call(map, function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, map);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual((0, _sort.default)(forEachArray).call(forEachArray, compareEntries), expectedArray);
  assert.deepStrictEqual((0, _sort.default)(_context7 = (0, _from.default)(map)).call(_context7, compareEntries), expectedArray);
  testSerialization(map);
}

var staticMapInner = new _map.default();
var staticMap = new _ObservableMap.ObservableMap(staticMapInner); // class ObjectMapWrapper<V> implements Map<string, V> {
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

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator7.default;

var MapWrapper =
/*#__PURE__*/
function () {
  function MapWrapper(map) {
    (0, _classCallCheck2.default)(this, MapWrapper);
    this[_Symbol$toStringTag] = 'Map';
    this._map = map;
  }

  (0, _createClass2.default)(MapWrapper, [{
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function value() {
      var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item;

      return _regenerator.default.wrap(function value$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context8.prev = 3;
              _iterator2 = (0, _getIterator2.default)(this._map);

            case 5:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context8.next = 12;
                break;
              }

              item = _step2.value;
              _context8.next = 9;
              return [item[0].value, item[1]];

            case 9:
              _iteratorNormalCompletion2 = true;
              _context8.next = 5;
              break;

            case 12:
              _context8.next = 18;
              break;

            case 14:
              _context8.prev = 14;
              _context8.t0 = _context8["catch"](3);
              _didIteratorError2 = true;
              _iteratorError2 = _context8.t0;

            case 18:
              _context8.prev = 18;
              _context8.prev = 19;

              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }

            case 21:
              _context8.prev = 21;

              if (!_didIteratorError2) {
                _context8.next = 24;
                break;
              }

              throw _iteratorError2;

            case 24:
              return _context8.finish(21);

            case 25:
              return _context8.finish(18);

            case 26:
            case "end":
              return _context8.stop();
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
      return this._map.delete((0, _common.convertToObject)(key));
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function entries() {
      var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _context9, entry;

      return _regenerator.default.wrap(function entries$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context10.prev = 3;
              _iterator3 = (0, _getIterator2.default)((0, _entries.default)(_context9 = this._map).call(_context9));

            case 5:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context10.next = 12;
                break;
              }

              entry = _step3.value;
              _context10.next = 9;
              return [entry[0].value, entry[1]];

            case 9:
              _iteratorNormalCompletion3 = true;
              _context10.next = 5;
              break;

            case 12:
              _context10.next = 18;
              break;

            case 14:
              _context10.prev = 14;
              _context10.t0 = _context10["catch"](3);
              _didIteratorError3 = true;
              _iteratorError3 = _context10.t0;

            case 18:
              _context10.prev = 18;
              _context10.prev = 19;

              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }

            case 21:
              _context10.prev = 21;

              if (!_didIteratorError3) {
                _context10.next = 24;
                break;
              }

              throw _iteratorError3;

            case 24:
              return _context10.finish(21);

            case 25:
              return _context10.finish(18);

            case 26:
            case "end":
              return _context10.stop();
          }
        }
      }, entries, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _context11;

      (0, _forEach.default)(_context11 = this._map).call(_context11, function (value, key) {
        callbackfn(value, key.value, this);
      }, thisArg);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get((0, _common.convertToObject)(key));
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._map.has((0, _common.convertToObject)(key));
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function keys() {
      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _context12, item;

      return _regenerator.default.wrap(function keys$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context13.prev = 3;
              _iterator4 = (0, _getIterator2.default)((0, _keys.default)(_context12 = this._map).call(_context12));

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context13.next = 12;
                break;
              }

              item = _step4.value;
              _context13.next = 9;
              return item.value;

            case 9:
              _iteratorNormalCompletion4 = true;
              _context13.next = 5;
              break;

            case 12:
              _context13.next = 18;
              break;

            case 14:
              _context13.prev = 14;
              _context13.t0 = _context13["catch"](3);
              _didIteratorError4 = true;
              _iteratorError4 = _context13.t0;

            case 18:
              _context13.prev = 18;
              _context13.prev = 19;

              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }

            case 21:
              _context13.prev = 21;

              if (!_didIteratorError4) {
                _context13.next = 24;
                break;
              }

              throw _iteratorError4;

            case 24:
              return _context13.finish(21);

            case 25:
              return _context13.finish(18);

            case 26:
            case "end":
              return _context13.stop();
          }
        }
      }, keys, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    })
  }, {
    key: "set",
    value: function set(key, value) {
      this._map.set((0, _common.convertToObject)(key), value);

      return this;
    }
  }, {
    key: "values",
    value: function values() {
      var _context14;

      return (0, _values.default)(_context14 = this._map).call(_context14);
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

MapWrapper.uuid = 'bc06eeb65139444aa73557a6e1928ac9';
(0, _serializers.registerSerializable)(MapWrapper, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      var innerMap, value;
      return _regenerator.default.wrap(function deSerialize$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.next = 2;
              return _deSerialize2((0, _map2.default)(serializedValue));

            case 2:
              innerMap = _context15.sent;
              value = valueFactory(innerMap);
              value.deSerialize(_deSerialize2, serializedValue);
              return _context15.abrupt("return", value);

            case 6:
            case "end":
              return _context15.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var TestMap =
/*#__PURE__*/
function (_TestVariants) {
  (0, _inherits2.default)(TestMap, _TestVariants);

  function TestMap() {
    var _this;

    (0, _classCallCheck2.default)(this, TestMap);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TestMap).call(this));
    _this.baseOptionsVariants = {
      reuseMapInstance: [false, true],
      useMapChanged: [false, true],
      innerMap: ['Map', 'Map<Object>', 'ObjectMap', 'ObjectHashMap', 'ArrayMap']
    };
    return _this;
  }

  (0, _createClass2.default)(TestMap, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeMapChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var _context16, _context19, _context20;

            var array = (0, _map2.default)(_context16 = options.array).call(_context16, function (o) {
              return (0, _slice.default)(o).call(o);
            });
            var map = void 0;
            var mapInner = void 0;

            if (options.reuseMapInstance) {
              staticMap.clear();
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = (0, _getIterator2.default)(array), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var item = _step5.value;
                  staticMap.set.apply(staticMap, (0, _toConsumableArray2.default)(item));
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                    _iterator5.return();
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
                  mapInner = new _ObjectMap.ObjectMap({});
                  break;

                case 'ObjectHashMap':
                  mapInner = new MapWrapper(new _ObjectHashMap.ObjectHashMap({}));
                  break;

                case 'ArrayMap':
                  mapInner = new MapWrapper(new _ArrayMap.ArrayMap([]));
                  break;

                case 'Map<Object>':
                  mapInner = new MapWrapper(new _map.default());
                  break;

                case 'Map':
                  mapInner = new _map.default();
                  break;

                default:
                  assert.fail('Unknown options.innerMap: ' + options.innerMap);
                  break;
              }

              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = (0, _getIterator2.default)(array), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var _mapInner;

                  var _item = _step6.value;

                  (_mapInner = mapInner).set.apply(_mapInner, (0, _toConsumableArray2.default)(_item));
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                    _iterator6.return();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }

              map = new _ObservableMap.ObservableMap(mapInner);
            }

            var arrayReplicate = (0, _map2.default)(array).call(array, function (o) {
              return (0, _slice.default)(o).call(o);
            });
            var mapChangedEvents = [];

            if (options.useMapChanged) {
              unsubscribeMapChanged = map.mapChanged.subscribe(function (event) {
                mapChangedEvents.push(event);
                applyMapChangedToArray(event, arrayReplicate);

                if (event.type !== _IMapChanged.MapChangedType.Removed || mapInner.size > 0) {
                  var _context17, _context18;

                  assert.deepStrictEqual((0, _sort.default)(_context17 = (0, _map2.default)(arrayReplicate).call(arrayReplicate, function (o) {
                    return (0, _slice.default)(o).call(o);
                  })).call(_context17, compareEntries), (0, _sort.default)(_context18 = (0, _from.default)((0, _entries.default)(mapInner).call(mapInner))).call(_context18, compareEntries));
                }
              });
            }

            var propertyChangedEvents = [];
            unsubscribePropertyChanged = map.propertyChanged.subscribe(function (event) {
              propertyChangedEvents.push(event);
            });

            if (!options.reuseMapInstance) {
              assertMap(map, (0, _from.default)((0, _entries.default)(mapInner).call(mapInner)));
            }

            if (options.expected.error) {
              assert.throws(function () {
                return options.action(map);
              }, options.expected.error);
              assertMap(map, options.array);
            } else {
              assert.deepStrictEqual(options.action(map), options.expected.returnValue === _TestVariants2.THIS ? map : options.expected.returnValue);
              assertMap(map, options.expected.array);
            }

            assert.deepStrictEqual((0, _sort.default)(_context19 = (0, _from.default)((0, _entries.default)(mapInner).call(mapInner))).call(_context19, compareEntries), (0, _sort.default)(_context20 = (0, _from.default)((0, _entries.default)(map).call(map))).call(_context20, compareEntries));

            if (options.useMapChanged) {
              var _context21, _context22;

              if (unsubscribeMapChanged) {
                unsubscribeMapChanged();
              }

              assert.deepStrictEqual(mapChangedEvents, options.expected.mapChanged || []);
              assert.deepStrictEqual((0, _sort.default)(_context21 = (0, _map2.default)(arrayReplicate).call(arrayReplicate, function (o) {
                return (0, _slice.default)(o).call(o);
              })).call(_context21, compareEntries), (0, _sort.default)(_context22 = (0, _from.default)((0, _entries.default)(map).call(map))).call(_context22, compareEntries));
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
            var _context23, _context24, _context25;

            console.log((0, _concat.default)(_context23 = (0, _concat.default)(_context24 = (0, _concat.default)(_context25 = "Error in: ".concat(options.description, "\n")).call(_context25, (0, _stringify.default)(options, null, 4), "\n")).call(_context24, options.action.toString(), "\n")).call(_context23, ex.stack));
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
}(_TestVariants2.TestVariants);

exports.TestMap = TestMap;
TestMap.totalMapTests = 0;
TestMap._instance = new TestMap();
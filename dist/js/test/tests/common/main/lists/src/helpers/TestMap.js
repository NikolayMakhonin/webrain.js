"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.applyMapChangedToArray = applyMapChangedToArray;
exports.TestMap = exports.assert = void 0;

var _iterator7 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray7 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

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

  for (var _iterator = expectedArray, _isArray = (0, _isArray7.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
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
    assert.strictEqual(map.has(item[0]), true);
    assert.strictEqual(map.has(Math.random()), false);
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
      var _iterator2, _isArray2, _i2, _ref2, item;

      return _regenerator.default.wrap(function value$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _iterator2 = this._map, _isArray2 = (0, _isArray7.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);

            case 1:
              if (!_isArray2) {
                _context8.next = 7;
                break;
              }

              if (!(_i2 >= _iterator2.length)) {
                _context8.next = 4;
                break;
              }

              return _context8.abrupt("break", 16);

            case 4:
              _ref2 = _iterator2[_i2++];
              _context8.next = 11;
              break;

            case 7:
              _i2 = _iterator2.next();

              if (!_i2.done) {
                _context8.next = 10;
                break;
              }

              return _context8.abrupt("break", 16);

            case 10:
              _ref2 = _i2.value;

            case 11:
              item = _ref2;
              _context8.next = 14;
              return [item[0].value, item[1]];

            case 14:
              _context8.next = 1;
              break;

            case 16:
            case "end":
              return _context8.stop();
          }
        }
      }, value, this);
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
      var _iterator3, _isArray3, _i3, _context9, _ref3, entry;

      return _regenerator.default.wrap(function entries$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _iterator3 = (0, _entries.default)(_context9 = this._map).call(_context9), _isArray3 = (0, _isArray7.default)(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);

            case 1:
              if (!_isArray3) {
                _context10.next = 7;
                break;
              }

              if (!(_i3 >= _iterator3.length)) {
                _context10.next = 4;
                break;
              }

              return _context10.abrupt("break", 16);

            case 4:
              _ref3 = _iterator3[_i3++];
              _context10.next = 11;
              break;

            case 7:
              _i3 = _iterator3.next();

              if (!_i3.done) {
                _context10.next = 10;
                break;
              }

              return _context10.abrupt("break", 16);

            case 10:
              _ref3 = _i3.value;

            case 11:
              entry = _ref3;
              _context10.next = 14;
              return [entry[0].value, entry[1]];

            case 14:
              _context10.next = 1;
              break;

            case 16:
            case "end":
              return _context10.stop();
          }
        }
      }, entries, this);
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
      var _iterator4, _isArray4, _i4, _context12, _ref4, item;

      return _regenerator.default.wrap(function keys$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _iterator4 = (0, _keys.default)(_context12 = this._map).call(_context12), _isArray4 = (0, _isArray7.default)(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator2.default)(_iterator4);

            case 1:
              if (!_isArray4) {
                _context13.next = 7;
                break;
              }

              if (!(_i4 >= _iterator4.length)) {
                _context13.next = 4;
                break;
              }

              return _context13.abrupt("break", 16);

            case 4:
              _ref4 = _iterator4[_i4++];
              _context13.next = 11;
              break;

            case 7:
              _i4 = _iterator4.next();

              if (!_i4.done) {
                _context13.next = 10;
                break;
              }

              return _context13.abrupt("break", 16);

            case 10:
              _ref4 = _i4.value;

            case 11:
              item = _ref4;
              _context13.next = 14;
              return item.value;

            case 14:
              _context13.next = 1;
              break;

            case 16:
            case "end":
              return _context13.stop();
          }
        }
      }, keys, this);
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

              for (var _iterator5 = array, _isArray5 = (0, _isArray7.default)(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator2.default)(_iterator5);;) {
                var _ref5;

                if (_isArray5) {
                  if (_i5 >= _iterator5.length) break;
                  _ref5 = _iterator5[_i5++];
                } else {
                  _i5 = _iterator5.next();
                  if (_i5.done) break;
                  _ref5 = _i5.value;
                }

                var item = _ref5;
                staticMap.set.apply(staticMap, item);
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

              for (var _iterator6 = array, _isArray6 = (0, _isArray7.default)(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : (0, _getIterator2.default)(_iterator6);;) {
                var _mapInner;

                var _ref6;

                if (_isArray6) {
                  if (_i6 >= _iterator6.length) break;
                  _ref6 = _iterator6[_i6++];
                } else {
                  _i6 = _iterator6.next();
                  if (_i6.done) break;
                  _ref6 = _i6.value;
                }

                var _item = _ref6;

                (_mapInner = mapInner).set.apply(_mapInner, _item);
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
            console.log("Error in: " + options.description + "\n" + (0, _stringify.default)(options, null, 4) + "\n" + options.action.toString() + "\n" + ex.stack);
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
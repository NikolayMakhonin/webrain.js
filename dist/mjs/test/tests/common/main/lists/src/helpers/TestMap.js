import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { MapChangedType } from '../../../../../../../main/common/lists/contracts/IMapChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { ObjectMap } from '../../../../../../../main/common/lists/ObjectMap';
import { ObservableMap } from '../../../../../../../main/common/lists/ObservableMap';
import { TestVariants, THIS } from '../../../helpers/TestVariants';

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
  map.forEach(function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, map);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual(forEachArray.sort(compareEntries), expectedArray);
  assert.deepStrictEqual(Array.from(map).sort(compareEntries), expectedArray);
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
      useObjectMap: [false, true]
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
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var item = _step2.value;
                  staticMap.set.apply(staticMap, _toConsumableArray(item));
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

              map = staticMap;
              mapInner = staticMapInner;
            } else {
              mapInner = options.useObjectMap ? new ObjectMap({}) : new Map();
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = array[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var _mapInner;

                  var _item = _step3.value;

                  (_mapInner = mapInner).set.apply(_mapInner, _toConsumableArray(_item));
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
              assert.throws(function () {
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
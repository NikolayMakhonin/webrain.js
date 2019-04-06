import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { SetChangedType } from '../../../../../../../main/common/lists/contracts/ISetChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { ObjectSet } from '../../../../../../../main/common/lists/ObjectSet';
import { ObservableSet } from '../../../../../../../main/common/lists/ObservableSet';
import { indexOfNaN } from './common';
import { TestVariants } from './TestVariants';
export var THIS = {};
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

function assertSet(set, expectedArray) {
  expectedArray = expectedArray.slice().sort(compareFast);
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
}

var staticSetInner = new Set();
var staticSet = new ObservableSet({
  set: staticSetInner
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
      useObjectSet: [false, true]
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
            var set = void 0;
            var setInner = void 0;

            if (options.reuseSetInstance) {
              staticSet.clear();
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = array[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var item = _step4.value;
                  staticSet.add(item);
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }

              set = staticSet;
              setInner = staticSetInner;
            } else {
              setInner = options.useObjectSet ? new ObjectSet({}) : new Set();
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = array[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var _item2 = _step5.value;
                  setInner.add(_item2);
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

              set = new ObservableSet({
                set: setInner
              });
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
              assert.throws(function () {
                return options.action(set);
              }, options.expected.error);
              assertSet(set, options.array);
            } else {
              assert.deepStrictEqual(options.action(set), options.expected.returnValue === THIS ? set : options.expected.returnValue);
              assertSet(set, options.expected.array);
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
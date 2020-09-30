"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _webrainOptions = require("../../../../../../../main/common/helpers/webrainOptions");

var _Random = require("../../../../../../../main/common/random/Random");

var _bind2 = require("../../../../../../../main/common/rx/depend/bindings2/bind");

var _path = require("../../../../../../../main/common/rx/depend/bindings2/path");

var _CallState = require("../../../../../../../main/common/rx/depend/core/CallState");

var _ObservableClass2 = require("../../../../../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _builder = require("../../../../../../../main/common/rx/object/properties/path/builder");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _randomTest = require("../../../../../../../main/common/test/randomTest");

var _helpers = require("../../../../../../../main/common/time/helpers");

var _helpers2 = require("../src/helpers");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

(0, _Mocha.describe)('common > main > rx > depend > bindings > stress', function () {
  this.timeout(24 * 60 * 60 * 1000);
  beforeEach(function () {
    _webrainOptions.webrainOptions.callState.garbageCollect.disabled = false;
    _webrainOptions.webrainOptions.callState.garbageCollect.bulkSize = 100;
    _webrainOptions.webrainOptions.callState.garbageCollect.interval = 0;
    _webrainOptions.webrainOptions.callState.garbageCollect.minLifeTime = 0;
  }); // region helpers

  var propNames = ['prop1', 'prop2', 'prop3'];

  var ObjectClass = /*#__PURE__*/function (_ObservableClass) {
    (0, _inherits2.default)(ObjectClass, _ObservableClass);

    var _super = _createSuper(ObjectClass);

    function ObjectClass() {
      (0, _classCallCheck2.default)(this, ObjectClass);
      return _super.apply(this, arguments);
    }

    return ObjectClass;
  }(_ObservableClass2.ObservableClass);

  new _ObservableObjectBuilder.ObservableObjectBuilder(ObjectClass.prototype).writable('prop1').writable('prop2').writable('prop3');

  function fillObject(rnd, obj) {
    obj.prop1 = rnd.nextInt(1000);
    obj.prop2 = rnd.nextInt(1000);
    obj.prop3 = rnd.nextInt(1000);
    return obj;
  }

  function generateObject(rnd) {
    return fillObject(rnd, new ObjectClass());
  }

  function generateCheckObject(rnd) {
    return fillObject(rnd, {});
  }

  function generateItems(rnd, count, generateItem) {
    var items = [];

    for (var i = 0; i < count; i++) {
      items.push(generateItem(rnd));
    }

    return items;
  }

  function generateNumber(rnd, pattern) {
    return (0, _isArray.default)(pattern) ? rnd.nextInt(pattern[0], pattern[1] + 1) : pattern;
  }

  var ObjectsBase = function ObjectsBase(objects) {
    (0, _classCallCheck2.default)(this, ObjectsBase);
    this.unbinds = [];
    this.objects = objects;
  };

  var getValues = {};
  var setValues = {};
  var getSetValues = {};

  var _loop = function _loop(i) {
    var _context3, _context4, _context5, _context6;

    var propName = propNames[i];
    getSetValues[propName] = [(0, _path.createPathGetSetValue)()(function (b) {
      return b.f(function (o) {
        return o[propName];
      }, function (o, v) {
        o[propName] = v;
      });
    }), (0, _path.createPathGetSetValue)()((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      }, function (o, v) {
        o[propName] = v;
      });
    })), (0, _path.createPathGetSetValue)()((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      }, function (o, v) {
        o[propName] = v;
      });
    }).pathGet, (0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      }, function (o, v) {
        o[propName] = v;
      });
    }).pathSet), (0, _path.createPathGetSetValue)()(function (b) {
      return b.f(function (o) {
        return o;
      });
    }, {
      get: function get(b) {
        return b.f(function (o) {
          return o[propName];
        });
      },
      set: function set(b) {
        return b.f(null, function (o, v) {
          o[propName] = v;
        });
      }
    }), (0, _path.createPathGetSetValue)(function (b) {
      return b.f(function (o) {
        return o[propName];
      }, function (o, v) {
        o[propName] = v;
      });
    }), (0, _path.createPathGetSetValue)((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      }, function (o, v) {
        o[propName] = v;
      });
    })), (0, _path.createPathGetSetValue)((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      });
    }).pathGet, (0, _builder.pathGetSetBuild)(function (b) {
      return b.f(null, function (o, v) {
        o[propName] = v;
      });
    }).pathSet), (0, _path.createPathGetSetValue)(function (b) {
      return b.f(function (o) {
        return o;
      });
    }, {
      get: function get(b) {
        return b.f(function (o) {
          return o[propName];
        });
      },
      set: function set(b) {
        return b.f(null, function (o, v) {
          o[propName] = v;
        });
      }
    })];
    getValues[propName] = (0, _concat.default)(_context3 = []).call(_context3, (0, _map.default)(_context4 = getSetValues[propName]).call(_context4, function (o) {
      return o.getValue;
    }), [(0, _path.createPathGetValue)()(function (b) {
      return b.f(function (o) {
        return o[propName];
      });
    }), (0, _path.createPathGetValue)()((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      });
    }).pathGet), (0, _path.createPathGetValue)(function (b) {
      return b.f(function (o) {
        return o[propName];
      });
    }), (0, _path.createPathGetValue)((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(function (o) {
        return o[propName];
      });
    }).pathGet)]);
    setValues[propName] = (0, _concat.default)(_context5 = []).call(_context5, (0, _map.default)(_context6 = getSetValues[propName]).call(_context6, function (o) {
      return o.setValue;
    }), [(0, _path.createPathSetValue)()(function (b) {
      return b.f(null, function (o, v) {
        o[propName] = v;
      });
    }), (0, _path.createPathSetValue)()((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(null, function (o, v) {
        o[propName] = v;
      });
    }).pathSet), (0, _path.createPathSetValue)(function (b) {
      return b.f(null, function (o, v) {
        o[propName] = v;
      });
    }), (0, _path.createPathSetValue)((0, _builder.pathGetSetBuild)(function (b) {
      return b.f(null, function (o, v) {
        o[propName] = v;
      });
    }).pathSet)]);
  };

  for (var i = 0; i < propNames.length; i++) {
    _loop(i);
  }

  function generateSourceDests(rnd) {
    var result = {
      getValues: {},
      setValues: {},
      getSetValues: {}
    };

    for (var _i = 0; _i < propNames.length; _i++) {
      var _propName = propNames[_i];
      result.getValues[_propName] = rnd.nextArrayItem(getValues[_propName]);
      result.setValues[_propName] = rnd.nextArrayItem(setValues[_propName]);
      result.getSetValues[_propName] = {
        getValue: result.getValues[_propName],
        setValue: result.setValues[_propName]
      };
    }

    return result;
  }

  var Objects = /*#__PURE__*/function (_ObjectsBase) {
    (0, _inherits2.default)(Objects, _ObjectsBase);

    var _super2 = _createSuper(Objects);

    function Objects(objects, sourcesDests) {
      var _this;

      (0, _classCallCheck2.default)(this, Objects);
      _this = _super2.call(this, objects);
      _this._getSetValues = sourcesDests;
      return _this;
    }

    (0, _createClass2.default)(Objects, [{
      key: "setValue",
      value: function setValue(objectNumber, propName, value) {
        this.objects[objectNumber][propName] = value;
      }
    }, {
      key: "bindOneWay",
      value: function bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo) {
        var getValue = this._getSetValues.getValues[propNameFrom];
        var setValue = this._getSetValues.setValues[propNameTo];
        var sourceObject = this.objects[objectNumberFrom];
        var destObject = this.objects[objectNumberTo];
        var binder = (0, _bind2.getOneWayBinder)(sourceObject, getValue, destObject, setValue);
        this.unbinds.push((0, _bind.default)(binder).call(binder));
      }
    }, {
      key: "bindTwoWay",
      value: function bindTwoWay(rnd, objectNumber1, propName1, objectNumber2, propName2) {
        var getSetValue1 = this._getSetValues.getSetValues[propName1];
        var getSetValue2 = this._getSetValues.getSetValues[propName2];
        var object1 = this.objects[objectNumber1];
        var object2 = this.objects[objectNumber2];
        var binder = (0, _bind2.getTwoWayBinder)(object1, getSetValue1, object2, getSetValue2);
        this.unbinds.push((0, _bind.default)(binder).call(binder));
      }
    }]);
    return Objects;
  }(ObjectsBase);

  var CheckObjects = /*#__PURE__*/function (_ObjectsBase2) {
    (0, _inherits2.default)(CheckObjects, _ObjectsBase2);

    var _super3 = _createSuper(CheckObjects);

    function CheckObjects() {
      var _context;

      var _this2;

      (0, _classCallCheck2.default)(this, CheckObjects);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this2 = _super3.call.apply(_super3, (0, _concat.default)(_context = [this]).call(_context, args));
      _this2.countBindings = 0;
      _this2._bindings = {};
      return _this2;
    }

    (0, _createClass2.default)(CheckObjects, [{
      key: "setValue",
      value: function setValue(objectNumber, propName, value) {
        if (this.objects[objectNumber][propName] !== value) {
          this.objects[objectNumber][propName] = value;
          this.onChange(objectNumber, propName);
        }
      }
    }, {
      key: "onChange",
      value: function onChange(objectNumber, propName) {
        var keyFrom = objectNumber + '_' + propName;
        var from = this._bindings[keyFrom];

        if (!from) {
          return;
        }

        var value = this.objects[objectNumber][propName];

        for (var keyTo in from) {
          if (Object.prototype.hasOwnProperty.call(from, keyTo)) {
            var to = from[keyTo];

            if (to.count > 0) {
              this.setValue(to.objectNumber, to.propName, value);
            }
          }
        }
      }
    }, {
      key: "_bindOneWay",
      value: function _bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo) {
        var _this3 = this;

        var keyFrom = objectNumberFrom + '_' + propNameFrom;
        var keyTo = objectNumberTo + '_' + propNameTo;
        var from = this._bindings[keyFrom];

        if (!from) {
          this._bindings[keyFrom] = from = {};
        }

        var to = from[keyTo];

        if (!to) {
          from[keyTo] = to = {
            objectNumber: objectNumberTo,
            propName: propNameTo,
            count: 0
          };
        }

        to.count++;
        this.countBindings++;

        if (to.count === 1) {
          var _value = this.objects[objectNumberFrom][propNameFrom];
          this.setValue(to.objectNumber, to.propName, _value);
        }

        var unBinded;
        return function () {
          if (unBinded) {
            return;
          }

          unBinded = true;

          _Assert.assert.ok(to.count >= 0);

          to.count--;
          _this3.countBindings--;
        };
      }
    }, {
      key: "bindOneWay",
      value: function bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo) {
        this.unbinds.push(this._bindOneWay(rnd, objectNumberFrom, propNameFrom, objectNumberTo, propNameTo));
      }
    }, {
      key: "bindTwoWay",
      value: function bindTwoWay(rnd, objectNumber1, propName1, objectNumber2, propName2) {
        var unbind1 = this._bindOneWay(rnd, objectNumber1, propName1, objectNumber2, propName2);

        var unbind2 = this._bindOneWay(rnd, objectNumber2, propName2, objectNumber1, propName1);

        this.unbinds.push(function () {
          unbind1();
          unbind2();
        });
      }
    }]);
    return CheckObjects;
  }(ObjectsBase);

  function simplifyObject(obj) {
    if (obj.constructor === Object) {
      return obj;
    }

    var simplify = {};

    for (var _i2 = 0; _i2 < propNames.length; _i2++) {
      var _propName2 = propNames[_i2];
      simplify[_propName2] = obj[_propName2];
    }

    return simplify;
  }

  function simplifyObjects(items) {
    return (0, _map.default)(items).call(items, simplifyObject);
  }

  function assertObjects(actual, expected) {
    actual = simplifyObjects(actual);
    expected = simplifyObjects(expected);

    _Assert.assert.deepStrictEqual(actual, expected);
  }

  function equalObject(actual, expected) {
    for (var _i3 = 0, len = propNames.length; _i3 < len; _i3++) {
      var _propName3 = propNames[_i3];

      if (actual[_propName3] !== expected[_propName3]) {
        return false;
      }
    }

    return true;
  }

  function equalObjects(actual, expected) {
    var len = actual.length;

    if (len !== expected.length) {
      return false;
    }

    for (var _i4 = 0; _i4 < len; _i4++) {
      if (!equalObject(actual[_i4], expected[_i4])) {
        return false;
      }
    }

    return true;
  } // endregion
  // region metrics


  function createMetrics(testRunnerMetrics) {
    return {
      garbageCollectMode: null,
      countObjects: null,
      iterations: 0,
      countUnBinds: 0,
      countBinds: 0,
      countSetsLast: 0,
      countChecksLast: 0,
      countSets: 0,
      countChecks: 0,
      countValues: null
    };
  }

  function compareMetrics(metrics, metricsMin) {
    if (metrics.garbageCollectMode !== metricsMin.garbageCollectMode) {
      return metrics.garbageCollectMode < metricsMin.garbageCollectMode ? -1 : 1;
    }

    if (metrics.countObjects !== metricsMin.countObjects) {
      return metrics.countObjects < metricsMin.countObjects ? -1 : 1;
    }

    if (metrics.iterations !== metricsMin.iterations) {
      return metrics.iterations < metricsMin.iterations ? -1 : 1;
    }

    if (metrics.countUnBinds !== metricsMin.countUnBinds) {
      return metrics.countUnBinds < metricsMin.countUnBinds ? -1 : 1;
    }

    if (metrics.countBinds !== metricsMin.countBinds) {
      return metrics.countBinds < metricsMin.countBinds ? -1 : 1;
    }

    if (metrics.countSetsLast !== metricsMin.countSetsLast) {
      return metrics.countSetsLast < metricsMin.countSetsLast ? -1 : 1;
    }

    if (metrics.countChecksLast !== metricsMin.countChecksLast) {
      return metrics.countChecksLast < metricsMin.countChecksLast ? -1 : 1;
    }

    if (metrics.countSets !== metricsMin.countSets) {
      return metrics.countSets < metricsMin.countSets ? -1 : 1;
    }

    if (metrics.countChecks !== metricsMin.countChecks) {
      return metrics.countChecks < metricsMin.countChecks ? -1 : 1;
    }

    if (metrics.countValues !== metricsMin.countValues) {
      return metrics.countValues < metricsMin.countValues ? -1 : 1;
    }

    return 0;
  } // endregion
  // region options


  var GarbageCollectMode;

  (function (GarbageCollectMode) {
    GarbageCollectMode[GarbageCollectMode["deleteImmediate"] = 0] = "deleteImmediate";
    GarbageCollectMode[GarbageCollectMode["disabled"] = 1] = "disabled";
    GarbageCollectMode[GarbageCollectMode["normal"] = 2] = "normal";
  })(GarbageCollectMode || (GarbageCollectMode = {}));

  function optionsPatternBuilder(metrics, metricsMin) {
    var _metricsMin$countObje, _metricsMin$countValu;

    return {
      countObjects: [1, (_metricsMin$countObje = metricsMin.countObjects) != null ? _metricsMin$countObje : 3],
      countValues: [1, (_metricsMin$countValu = metricsMin.countValues) != null ? _metricsMin$countValu : 10],
      garbageCollectMode: GarbageCollectMode.disabled,
      // TODO
      // [
      // 	GarbageCollectMode.deleteImmediate,
      // 	metricsMin.garbageCollectMode ?? GarbageCollectMode.normal,
      // ],
      metrics: metrics,
      metricsMin: metricsMin
    };
  }

  function optionsGenerator(rnd, options) {
    return {
      countObjects: generateNumber(rnd, options.countObjects),
      countValues: generateNumber(rnd, options.countValues),
      garbageCollectMode: generateNumber(rnd, options.garbageCollectMode),
      metrics: options.metrics,
      metricsMin: options.metricsMin
    };
  }

  // endregion
  // region state
  function createState(rnd, options) {
    switch (options.garbageCollectMode) {
      case GarbageCollectMode.deleteImmediate:
        _webrainOptions.webrainOptions.callState.garbageCollect.disabled = false;
        _webrainOptions.webrainOptions.callState.garbageCollect.bulkSize = 1000;
        _webrainOptions.webrainOptions.callState.garbageCollect.interval = 0;
        _webrainOptions.webrainOptions.callState.garbageCollect.minLifeTime = 0;
        break;

      case GarbageCollectMode.disabled:
        _webrainOptions.webrainOptions.callState.garbageCollect.disabled = true;
        break;

      case GarbageCollectMode.normal:
        _webrainOptions.webrainOptions.callState.garbageCollect.disabled = false;
        _webrainOptions.webrainOptions.callState.garbageCollect.bulkSize = 100;
        _webrainOptions.webrainOptions.callState.garbageCollect.interval = 100;
        _webrainOptions.webrainOptions.callState.garbageCollect.minLifeTime = 50;
        break;

      default:
        throw new Error('Unknown GarbageCollectMode:' + options.garbageCollectMode);
    }

    options.metrics.countObjects = options.countObjects;
    options.metrics.garbageCollectMode = options.garbageCollectMode;
    options.metrics.countValues = options.countValues;
    var seed = rnd.nextSeed();
    var objects = generateItems(new _Random.Random(seed), options.countObjects, generateObject);
    var checkObjects = generateItems(new _Random.Random(seed), options.countObjects, generateCheckObject);
    assertObjects(objects, checkObjects);
    return {
      objects: new Objects(objects, generateSourceDests(rnd)),
      checkObjects: new CheckObjects(checkObjects),
      unbinds: [],
      options: options
    };
  }

  // endregion
  // region action
  function action(_x, _x2) {
    return _action.apply(this, arguments);
  } // endregion
  // region testIteration


  function _action() {
    _action = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(rnd, state) {
      var objectNumber, propName, shouldWait, _value2, _objectNumberTo, _propNameTo, len, seed, unbind, checkUnbind, _i6, _len3;

      return _regenerator.default.wrap(function _callee2$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              state.options.metrics.iterations++;
              objectNumber = rnd.nextInt(state.objects.objects.length);
              propName = rnd.nextArrayItem(propNames);
              shouldWait = false;

              if (rnd.nextBoolean(0.8)) {
                shouldWait = true;
                _value2 = rnd.nextInt(state.options.countValues);
                state.options.metrics.countSets++;
                state.options.metrics.countSetsLast++;
                state.options.metrics.countChecksLast = 0;
                state.objects.setValue(objectNumber, propName, _value2);
                state.checkObjects.setValue(objectNumber, propName, _value2);
              } else if (rnd.nextBoolean()) {
                shouldWait = true;
                _objectNumberTo = rnd.nextInt(state.objects.objects.length);
                _propNameTo = rnd.nextArrayItem(propNames);
                state.options.metrics.countSetsLast = 0;
                state.options.metrics.countChecksLast = 0;

                if (rnd.nextBoolean()) {
                  state.options.metrics.countBinds++;
                  state.objects.bindOneWay(rnd, objectNumber, propName, _objectNumberTo, _propNameTo);
                  state.checkObjects.bindOneWay(rnd, objectNumber, propName, _objectNumberTo, _propNameTo);
                } else {
                  state.options.metrics.countBinds += 2;
                  state.objects.bindTwoWay(rnd, objectNumber, propName, _objectNumberTo, _propNameTo);
                  state.checkObjects.bindTwoWay(rnd, objectNumber, propName, _objectNumberTo, _propNameTo);
                }
              } else {
                len = state.checkObjects.unbinds.length;

                if (len > 0) {
                  state.options.metrics.countUnBinds++;
                  seed = rnd.nextSeed();
                  unbind = new _Random.Random(seed).pullArrayItem(state.objects.unbinds);
                  checkUnbind = new _Random.Random(seed).pullArrayItem(state.checkObjects.unbinds);
                  unbind();
                  checkUnbind();
                }
              }

              _Assert.assert.strictEqual(state.objects.unbinds.length, state.checkObjects.unbinds.length); // if (shouldWait) {


              _i6 = 0, _len3 = 1 + state.checkObjects.countBindings * 3;

            case 7:
              if (!(_i6 < _len3)) {
                _context7.next = 13;
                break;
              }

              _context7.next = 10;
              return (0, _helpers.delay)(1);

            case 10:
              _i6++;
              _context7.next = 7;
              break;

            case 13:
              // }
              assertObjects(state.objects.objects, state.checkObjects.objects);

            case 14:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee2);
    }));
    return _action.apply(this, arguments);
  }

  var testIteration = (0, _randomTest.testIterationBuilder)({
    // waitAsyncAll: {
    // 	weight: 0.05,
    // 	async after(rnd, state) {
    // 		for (let i = 0; i < 50; i++) {
    // 			await delay(1)
    // 		}
    // 		// await delay(1000)
    // 		state.options.metrics.countChecks++
    // 		state.options.metrics.countChecksLast++
    // 		assertObjects(state.objects.objects, state.checkObjects.objects)
    // 	},
    // },
    // waitAsyncRandom: {
    // 	weight: 0.2,
    // },
    action: {
      weight: 1,
      func: action
    }
  }); // endregion
  // region testIterator

  var testIterator = (0, _randomTest.testIteratorBuilder)(createState, {
    before: function before(rns, state) {
      (0, _CallState.reduceCallStates)(2000000000, 0);
    },
    after: function after(rnd, state) {
      for (var _i5 = 0, len = state.objects.unbinds.length; _i5 < len; _i5++) {
        state.objects.unbinds[_i5]();

        state.checkObjects.unbinds[_i5]();
      }
    },
    stopPredicate: function stopPredicate(iterationNumber, timeStart, state) {
      var metrics = state.options.metrics;
      var metricsMin = state.options.metricsMin;

      if (metrics.iterations > metricsMin.iterations) {
        return true;
      }

      if (metrics.countBinds > metricsMin.countBinds) {
        return true;
      }

      if (metrics.countBinds === metricsMin.countBinds) {
        if (metrics.countSetsLast > metricsMin.countSetsLast) {
          return true;
        }

        if (metrics.countSetsLast === metricsMin.countSetsLast) {
          if (metrics.countChecksLast > metricsMin.countChecksLast) {
            return true;
          }

          if (metrics.countChecksLast === metricsMin.countChecksLast) {
            return true;
          }
        }
      }

      return iterationNumber >= 100;
    },
    testIteration: testIteration,
    consoleThrowPredicate: function consoleThrowPredicate() {
      return this === 'error' || this === 'warn';
    }
  }); // endregion
  // region randomTest

  var randomTest = (0, _randomTest.randomTestBuilder)(createMetrics, optionsPatternBuilder, optionsGenerator, {
    compareMetrics: compareMetrics,
    // searchBestError: searchBestErrorBuilderNode({
    // 	reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
    // 	consoleOnlyBestErrors: true,
    // }),
    searchBestError: (0, _randomTest.searchBestErrorBuilder)({
      consoleOnlyBestErrors: true
    }),
    testIterator: testIterator
  }); // endregion

  (0, _Mocha.xit)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            /* tslint:disable:max-line-length */
            (0, _helpers2.clearCallStates)();
            _context2.next = 3;
            return randomTest({
              stopPredicate: function stopPredicate(testRunnerMetrics) {
                return false; // return testRunnerMetrics.timeFromStart >= 30000
              },
              // customSeed: 584765156,
              // metricsMin: {"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0},
              // customSeed: 503049265,
              // metricsMin: {"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0},
              // customSeed: 783167148,
              // metricsMin: {"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0},
              // customSeed: 622515043,
              // metricsMin: {"garbageCollectMode":0,"countObjects":1,"countValues":1,"iterations":5,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":3,"countChecks":0},
              // customSeed: 485614596,
              // metricsMin: {"garbageCollectMode":0,"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0,"countValues":1},
              // customSeed: 828925130,
              // metricsMin: {"garbageCollectMode":0,"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0,"countValues":1},
              // customSeed: 580113113,
              // metricsMin: {"garbageCollectMode":0,"countObjects":1,"iterations":3,"countUnBinds":0,"countBinds":2,"countSetsLast":0,"countChecksLast":0,"countSets":1,"countChecks":0,"countValues":1},
              // customSeed: 756600112,
              // metricsMin: {garbageCollectMode: 0, countObjects: 1, iterations: 3, countUnBinds: 0, countBinds: 2, countSetsLast: 0, countChecksLast: 0, countSets: 1, countChecks: 0, countValues: 1},
              // customSeed: 746205876,
              // metricsMin: {"garbageCollectMode":1,"countObjects":3,"iterations":55,"countUnBinds":4,"countBinds":13,"countSetsLast":0,"countChecksLast":0,"countSets":43,"countChecks":0,"countValues":4},
              // customSeed: 47784214,
              // metricsMin: {"garbageCollectMode":1,"countObjects":3,"iterations":28,"countUnBinds":2,"countBinds":6,"countSetsLast":0,"countChecksLast":0,"countSets":22,"countChecks":0,"countValues":4},
              customSeed: 454986460,
              metricsMin: {
                'garbageCollectMode': 1,
                'countObjects': 1,
                'iterations': 5,
                'countUnBinds': 1,
                'countBinds': 2,
                'countSetsLast': 0,
                'countChecksLast': 0,
                'countSets': 2,
                'countChecks': 0,
                'countValues': 2
              },
              searchBestError: true
            });

          case 3:
            _context2.next = 5;
            return (0, _helpers.delay)(1000);

          case 5:
            (0, _helpers2.clearCallStates)(); // process.exit(1)

            /* tslint:enable:max-line-length */

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee);
  })));
});
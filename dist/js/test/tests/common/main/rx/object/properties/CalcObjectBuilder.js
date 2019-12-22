"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ThenableSync = require("../../../../../../../main/common/async/ThenableSync");

var _deepSubscribe = require("../../../../../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableClass3 = require("../../../../../../../main/common/rx/object/ObservableClass");

var _CalcObjectBuilder = require("../../../../../../../main/common/rx/object/properties/CalcObjectBuilder");

var _CalcPropertyBuilder = require("../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder");

var _ConnectorBuilder = require("../../../../../../../main/common/rx/object/properties/ConnectorBuilder");

var _helpers = require("../../../../../../../main/common/rx/object/properties/helpers");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _TestDeepSubscribe = require("../../deep-subscribe/helpers/src/TestDeepSubscribe");

/* tslint:disable:no-duplicate-string no-empty no-statements-same-line */

/* eslint-disable guard-for-in */
(0, _Mocha.describe)('common > main > rx > properties > CalcObjectBuilder', function () {
  this.timeout(30000);

  var ValueObject =
  /*#__PURE__*/
  function (_ObservableClass) {
    (0, _inherits2.default)(ValueObject, _ObservableClass);

    function ValueObject(value) {
      var _this;

      (0, _classCallCheck2.default)(this, ValueObject);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ValueObject).call(this));
      _this.value = value;
      return _this;
    }

    return ValueObject;
  }(_ObservableClass3.ObservableClass);

  new _CalcObjectBuilder.CalcObjectBuilder(ValueObject.prototype).writable('value');

  var ClassSync =
  /*#__PURE__*/
  function (_ObservableClass2) {
    (0, _inherits2.default)(ClassSync, _ObservableClass2);

    function ClassSync(_temp) {
      var _this2;

      var _ref = _temp === void 0 ? {} : _temp,
          _ref$subscribed = _ref.subscribed,
          subscribed = _ref$subscribed === void 0 ? true : _ref$subscribed,
          _ref$addCalcCount = _ref.addCalcCount,
          addCalcCount = _ref$addCalcCount === void 0 ? false : _ref$addCalcCount;

      (0, _classCallCheck2.default)(this, ClassSync);
      _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ClassSync).call(this));
      _this2.value = 'Value';
      _this2.source1 = new ValueObject(100);
      _this2.source2 = new ValueObject(0);
      _this2.addCalcCount = addCalcCount;
      _this2.subscribed = subscribed;
      return _this2;
    }

    (0, _createClass2.default)(ClassSync, [{
      key: "subscribed",
      get: function get() {
        return !!this._unsubscribe;
      },
      set: function set(value) {
        var _unsubscribe = this._unsubscribe;

        if (value) {
          if (!_unsubscribe) {
            this._unsubscribe = (0, _deepSubscribe.deepSubscribe)({
              object: this,
              changeValue: function changeValue() {},
              ruleBuilder: function ruleBuilder(b) {
                return b.propertyAny();
              }
            });
          }
        } else {
          if (_unsubscribe) {
            this._unsubscribe = null;

            _unsubscribe();
          }
        }
      }
    }]);
    return ClassSync;
  }(_ObservableClass3.ObservableClass);

  var ClassAsync =
  /*#__PURE__*/
  function (_ClassSync) {
    (0, _inherits2.default)(ClassAsync, _ClassSync);

    function ClassAsync(_temp2) {
      var _ref2 = _temp2 === void 0 ? {} : _temp2,
          _ref2$subscribed = _ref2.subscribed,
          subscribed = _ref2$subscribed === void 0 ? true : _ref2$subscribed,
          _ref2$addCalcCount = _ref2.addCalcCount,
          addCalcCount = _ref2$addCalcCount === void 0 ? false : _ref2$addCalcCount;

      (0, _classCallCheck2.default)(this, ClassAsync);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ClassAsync).call(this, {
        subscribed: subscribed,
        addCalcCount: addCalcCount
      }));
    }

    return ClassAsync;
  }(ClassSync);

  ClassSync.prototype.valuePrototype = 'Value Prototype';
  var calcCount = 0;
  new _CalcObjectBuilder.CalcObjectBuilder(ClassSync.prototype).writable('source1').writable('source2').writable('source1_').writable('source2_').calc('calc1', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.v('lastOrWait').p('source1', 'source1_').v('wait');
      }).connect('addCalcCount', function (b) {
        return b.p('addCalcCount');
      });
    }
  }), // .connect('connectValue1', b => b.p('source1'))),
  // b.path(o => o['@lastOrWait'].source1['@wait']))),
  (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.p('connectValue1').p('value');
      });
    },
    calcFunc: function calcFunc(state) {
      var connectValue1 = state.input.connectValue1 && state.input.connectValue1.value;

      if (connectValue1 && state.input.addCalcCount) {
        calcCount++;
        connectValue1 += calcCount;
      }

      state.value = connectValue1 && new Date(connectValue1);
      return _ThenableSync.ThenableSync.createResolved(null);
    }
  })).calc('calc2', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.path(function (o) {
          return o['@lastOrWait']['source2|source2_']['@wait'];
        });
      }).connect('addCalcCount', function (b) {
        return b.p('addCalcCount');
      });
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.p('connectValue1').p('value');
      });
    },
    calcFunc: function calcFunc(state) {
      state.value = {
        value: state.input.connectorState.source
      };
      return _ThenableSync.ThenableSync.createResolved(true);
    }
  })).calc('calcWithAnyRule', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c;
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.any(function (b2) {
          return b2.p('prop1');
        }, function (b2) {
          return b2.p('prop2');
        });
      });
    },
    calcFunc: function calcFunc(state) {
      state.value = new Date(1);
    }
  }));
  new _CalcObjectBuilder.CalcObjectBuilder(ClassAsync.prototype).calc('calc1', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.path(function (o) {
          return o['@lastOrWait']['source1|source1_']['@wait'];
        });
      }).connect('addCalcCount', function (b) {
        return b.p('addCalcCount');
      });
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.p('connectValue1').p('value');
      });
    },
    calcFunc:
    /*#__PURE__*/
    _regenerator.default.mark(function calcFunc(state) {
      var connectValue1;
      return _regenerator.default.wrap(function calcFunc$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return new _promise.default(function (r) {
                return (0, _setTimeout2.default)(r, 10);
              });

            case 2:
              connectValue1 = state.input.connectValue1 && state.input.connectValue1.value;

              if (connectValue1 && state.input.addCalcCount) {
                calcCount++;
                connectValue1 += calcCount;
              }

              state.value = connectValue1 && new Date(connectValue1);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, calcFunc);
    })
  })).calc('calc2', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.path(function (o) {
          return o['@lastOrWait']['source2|source2_']['@wait'];
        });
      }).connect('addCalcCount', function (b) {
        return b.p('addCalcCount');
      });
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.p('connectValue1').p('value');
      });
    },
    calcFunc:
    /*#__PURE__*/
    _regenerator.default.mark(function calcFunc(state) {
      return _regenerator.default.wrap(function calcFunc$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return new _promise.default(function (r) {
                return (0, _setTimeout2.default)(r, 10);
              });

            case 2:
              state.value = {
                value: state.input.connectorState.source
              };
              return _context2.abrupt("return", true);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, calcFunc);
    })
  }));
  (0, _Mocha.it)('calc sync', function () {
    var result = new ClassSync().calc1.last;

    _Assert.assert.deepStrictEqual(result, new Date(100));

    result = new ClassSync().calc1.wait;

    _Assert.assert.deepStrictEqual(result, new Date(100));

    result = new ClassSync().calc1.lastOrWait;

    _Assert.assert.deepStrictEqual(result, new Date(100));
  });
  (0, _Mocha.it)('calc sync resolve', function () {
    var val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1;
    })();

    _Assert.assert.deepStrictEqual(val, new Date(100));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1;
    })(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(100));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1.wait;
    })(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(100));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(100));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.calc1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(100));

    var object = new ClassSync();
    var obj = (0, _helpers.resolvePath)(object)();

    _Assert.assert.deepStrictEqual(obj, object);

    object = new ClassSync();
    obj = (0, _helpers.resolvePath)(object)(function (o) {
      return o.wait;
    }, true)();

    _Assert.assert.deepStrictEqual(obj, object);

    object = new ClassSync();
    obj = (0, _helpers.resolvePath)(object)(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(obj, object);
  });
  (0, _Mocha.it)('calc async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var object;
    return _regenerator.default.wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _Assert.assert.deepStrictEqual(new ClassAsync().calc1.last, void 0);

            object = new ClassAsync().calc1;
            _context3.t0 = _Assert.assert;
            _context3.next = 5;
            return object.wait;

          case 5:
            _context3.t1 = _context3.sent;
            _context3.t2 = new Date(100);

            _context3.t0.deepStrictEqual.call(_context3.t0, _context3.t1, _context3.t2);

            _Assert.assert.deepStrictEqual(object.last, new Date(100));

            object = new ClassAsync().calc1;
            _context3.t3 = _Assert.assert;
            _context3.next = 13;
            return object.lastOrWait;

          case 13:
            _context3.t4 = _context3.sent;
            _context3.t5 = new Date(100);

            _context3.t3.deepStrictEqual.call(_context3.t3, _context3.t4, _context3.t5);

            _Assert.assert.deepStrictEqual(object.last, new Date(100));

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee);
  })));
  (0, _Mocha.it)('calc async resolve',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var val, object, obj;
    return _regenerator.default.wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1;
            })();
            _context4.t0 = _Assert.assert;
            _context4.next = 4;
            return val;

          case 4:
            _context4.t1 = _context4.sent;
            _context4.t2 = new Date(100);

            _context4.t0.deepStrictEqual.call(_context4.t0, _context4.t1, _context4.t2);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1;
            })(function (o) {
              return o.last;
            }, true)();
            _context4.t3 = _Assert.assert;
            _context4.next = 11;
            return val;

          case 11:
            _context4.t4 = _context4.sent;
            _context4.t5 = new Date(100);

            _context4.t3.deepStrictEqual.call(_context4.t3, _context4.t4, _context4.t5);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1.wait;
            })(function (o) {
              return o.last;
            }, true)();
            _context4.t6 = _Assert.assert;
            _context4.next = 18;
            return val;

          case 18:
            _context4.t7 = _context4.sent;
            _context4.t8 = new Date(100);

            _context4.t6.deepStrictEqual.call(_context4.t6, _context4.t7, _context4.t8);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1;
            })(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context4.t9 = _Assert.assert;
            _context4.next = 25;
            return val;

          case 25:
            _context4.t10 = _context4.sent;
            _context4.t11 = new Date(100);

            _context4.t9.deepStrictEqual.call(_context4.t9, _context4.t10, _context4.t11);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.calc1;
            })(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context4.t12 = _Assert.assert;
            _context4.next = 32;
            return val;

          case 32:
            _context4.t13 = _context4.sent;
            _context4.t14 = new Date(100);

            _context4.t12.deepStrictEqual.call(_context4.t12, _context4.t13, _context4.t14);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)();
            _context4.t15 = _Assert.assert;
            _context4.next = 40;
            return obj;

          case 40:
            _context4.t16 = _context4.sent;
            _context4.t17 = object;

            _context4.t15.deepStrictEqual.call(_context4.t15, _context4.t16, _context4.t17);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)(function (o) {
              return o.wait;
            }, true)();
            _context4.t18 = _Assert.assert;
            _context4.next = 48;
            return obj;

          case 48:
            _context4.t19 = _context4.sent;
            _context4.t20 = object;

            _context4.t18.deepStrictEqual.call(_context4.t18, _context4.t19, _context4.t20);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context4.t21 = _Assert.assert;
            _context4.next = 56;
            return obj;

          case 56:
            _context4.t22 = _context4.sent;
            _context4.t23 = object;

            _context4.t21.deepStrictEqual.call(_context4.t21, _context4.t22, _context4.t23);

          case 59:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee2);
  })));
  (0, _Mocha.it)('circular calc sync', function () {
    var object = new ClassSync();
    var value = (0, _helpers.resolvePath)(object)(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })();

    _Assert.assert.strictEqual(value, object);

    value = (0, _helpers.resolvePath)(object)(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })();

    _Assert.assert.strictEqual(value, object);

    var value2 = (0, _helpers.resolvePath)(object)(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })(function (o) {
      return o.calc2;
    })(function (o) {
      return o.value;
    })(function (o) {
      return o.calc1;
    })();

    _Assert.assert.deepStrictEqual(value2, new Date(100));
  });
  (0, _Mocha.it)('circular calc async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var object, value, value2;
    return _regenerator.default.wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            object = new ClassSync();
            value = (0, _helpers.resolvePath)(object)(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })();
            _context5.t0 = _Assert.assert;
            _context5.next = 5;
            return value;

          case 5:
            _context5.t1 = _context5.sent;
            _context5.t2 = object;

            _context5.t0.strictEqual.call(_context5.t0, _context5.t1, _context5.t2);

            value = (0, _helpers.resolvePath)(object)(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })();
            _context5.t3 = _Assert.assert;
            _context5.next = 12;
            return value;

          case 12:
            _context5.t4 = _context5.sent;
            _context5.t5 = object;

            _context5.t3.strictEqual.call(_context5.t3, _context5.t4, _context5.t5);

            value2 = (0, _helpers.resolvePath)(object)(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })(function (o) {
              return o.calc1;
            })();
            _context5.t6 = _Assert.assert;
            _context5.next = 19;
            return value2;

          case 19:
            _context5.t7 = _context5.sent;
            _context5.t8 = new Date(100);

            _context5.t6.deepStrictEqual.call(_context5.t6, _context5.t7, _context5.t8);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee3);
  })));
  (0, _Mocha.it)('deepSubscribe simple', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('value');
    }).subscribe(function (o) {
      return ['Value'];
    }).unsubscribe(['Value']);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('valuePrototype');
    }).subscribe(function (o) {
      return ['Value Prototype'];
    }).unsubscribe(['Value Prototype']);
  });
  (0, _Mocha.it)('deepSubscribe calcWithAnyRule sync', function () {
    calcCount = 0;
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: new ClassSync({
        subscribed: false
      }),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('calcWithAnyRule');
    }).subscribe([new Date(1)]).unsubscribe([new Date(1)]).subscribe([new Date(1)]).unsubscribe([new Date(1)]);
  });
  (0, _Mocha.it)('deepSubscribe calc sync', function () {
    var _loop = function _loop(subscribed) {
      console.log('subscribed: ' + !!subscribed);
      calcCount = 0;
      new _TestDeepSubscribe.TestDeepSubscribe({
        object: new ClassSync({
          subscribed: !!subscribed,
          addCalcCount: true
        }),
        immediate: true,
        doNotSubscribeNonObjectValues: true
      }, function (b) {
        return b.p('calc1');
      }).subscribe([new Date(101)]).unsubscribe([new Date(101)]).subscribe([new Date(101)]).unsubscribe([new Date(101)]).change(function (o) {
        return calcCount -= subscribed ? 2 : 3;
      }, [], []).change(function (o) {
        return o.source1 = new ValueObject(100);
      }, [], []).subscribe([new Date(101)]).unsubscribe([new Date(101)]) // .change(o => calcCount -= subscribed, [], [])
      .change(function (o) {
        o.source1_ = o.source1;
        o.source1 = void 0;
      }, [], []).subscribe([new Date(101)]).change(function (o) {
        return o.source1_.value = 200;
      }, [new Date(101)], [new Date(202)]).unsubscribe([new Date(202)]);
      new _TestDeepSubscribe.TestDeepSubscribe({
        object: new ClassSync({
          subscribed: !!subscribed,
          addCalcCount: true
        }),
        immediate: true,
        doNotSubscribeNonObjectValues: true
      }, function (b) {
        return b.p('calc1').p('getTime');
      }).subscribe([Date.prototype.getTime]).change(function (o) {
        return o.source1.value = 200;
      }, [Date.prototype.getTime], [Date.prototype.getTime]).unsubscribe([Date.prototype.getTime]);
    };

    for (var subscribed = 1; subscribed >= 0; subscribed--) {
      _loop(subscribed);
    }
  });
  xit('deepSubscribe calc async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var date200, _loop2, subscribed;

    return _regenerator.default.wrap(function _callee4$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            date200 = new Date(200);
            _loop2 =
            /*#__PURE__*/
            _regenerator.default.mark(function _loop2(subscribed) {
              var tester;
              return _regenerator.default.wrap(function _loop2$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      console.log('subscribed: ' + !!subscribed);
                      calcCount = 0;
                      tester = new _TestDeepSubscribe.TestDeepSubscribe({
                        object: new ClassAsync({
                          subscribed: !!subscribed,
                          addCalcCount: true
                        }),
                        immediate: true,
                        doNotSubscribeNonObjectValues: true,
                        asyncDelay: 500
                      }, function (b) {
                        return b.p('calc1');
                      });
                      _context6.next = 5;
                      return tester.subscribeAsync([new Date(101)]);

                    case 5:
                      _context6.next = 7;
                      return tester.unsubscribeAsync([new Date(101)]);

                    case 7:
                      _context6.next = 9;
                      return tester.subscribeAsync([new Date(101)]);

                    case 9:
                      _context6.next = 11;
                      return tester.unsubscribeAsync([new Date(101)]);

                    case 11:
                      _context6.next = 13;
                      return tester.changeAsync(function (o) {
                        return calcCount -= subscribed ? 2 : 1;
                      }, [], []);

                    case 13:
                      _context6.next = 15;
                      return tester.changeAsync(function (o) {
                        return o.source1 = new ValueObject(100);
                      }, [], []);

                    case 15:
                      _context6.next = 17;
                      return tester.subscribeAsync([new Date(101)]);

                    case 17:
                      _context6.next = 19;
                      return tester.unsubscribeAsync([new Date(101)]);

                    case 19:
                      _context6.next = 21;
                      return tester.changeAsync(function (o) {
                        o.source1_ = o.source1;
                        o.source1 = void 0;
                      }, [], []);

                    case 21:
                      _context6.next = 23;
                      return tester.subscribeAsync([new Date(101)]);

                    case 23:
                      _context6.next = 25;
                      return tester.changeAsync(function (o) {
                        return o.source1_.value = 200;
                      }, [new Date(101)], [new Date(202)]);

                    case 25:
                      _context6.next = 27;
                      return tester.unsubscribeAsync([new Date(202)]);

                    case 27:
                      tester = new _TestDeepSubscribe.TestDeepSubscribe({
                        object: new ClassAsync({
                          subscribed: !!subscribed,
                          addCalcCount: true
                        }),
                        immediate: true,
                        doNotSubscribeNonObjectValues: true,
                        asyncDelay: 200
                      }, function (b) {
                        return b.p('calc1').p('getTime');
                      });
                      _context6.next = 30;
                      return tester.subscribeAsync([Date.prototype.getTime]);

                    case 30:
                      _context6.next = 32;
                      return tester.changeAsync(function (o) {
                        return o.source1.value = 200;
                      }, [Date.prototype.getTime], [Date.prototype.getTime]);

                    case 32:
                      _context6.next = 34;
                      return tester.unsubscribeAsync([Date.prototype.getTime]);

                    case 34:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _loop2);
            });
            subscribed = 1;

          case 3:
            if (!(subscribed >= 0)) {
              _context7.next = 8;
              break;
            }

            return _context7.delegateYield(_loop2(subscribed), "t0", 5);

          case 5:
            subscribed--;
            _context7.next = 3;
            break;

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee4);
  })));
  (0, _Mocha.it)('deepSubscribe calc circular sync', function () {
    var date200 = new Date(200);

    var _loop3 = function _loop3(subscribed) {
      console.log('subscribed: ' + !!subscribed);
      calcCount = 0;
      new _TestDeepSubscribe.TestDeepSubscribe({
        object: new ClassSync({
          subscribed: !!subscribed,
          addCalcCount: true
        }),
        immediate: true,
        doNotSubscribeNonObjectValues: true
      }, // b => b.p('calc2').p('value').p('calc2').p('value').p('calc1'),
      function (b) {
        return b.p('calc2').p('value').p('calc1');
      }) // .subscribe([new Date(100)])
      // .unsubscribe([new Date(100)])
      .subscribe([new Date(101)]).unsubscribe([new Date(101)]).subscribe([new Date(101)]).unsubscribe([new Date(101)]).change(function (o) {
        return calcCount -= subscribed ? 2 : 3;
      }, [], []).change(function (o) {
        return o.source1 = new ValueObject(100);
      }, [], []).subscribe([new Date(101)]).unsubscribe([new Date(101)]) // .change(o => calcCount -= subscribed, [], [])
      .change(function (o) {
        o.source1_ = o.source1;
        o.source1 = void 0;
      }, [], []).subscribe([new Date(101)]).change(function (o) {
        return o.source1_.value = 200;
      }, [new Date(101)], [new Date(202)]).change(function (o) {
        return o.source2.value += 10;
      }, [new Date(202)], [new Date(202)]).change(function (o) {
        return o.source1_.value = 300;
      }, [new Date(202)], [new Date(303)]).unsubscribe([new Date(303)]);
    };

    for (var subscribed = 1; subscribed >= 0; subscribed--) {
      _loop3(subscribed);
    }
  });
  (0, _Mocha.it)('deepSubscribe calc circular async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5() {
    var date200, _loop4, subscribed;

    return _regenerator.default.wrap(function _callee5$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            date200 = new Date(200);
            _loop4 =
            /*#__PURE__*/
            _regenerator.default.mark(function _loop4(subscribed) {
              var tester;
              return _regenerator.default.wrap(function _loop4$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      console.log('subscribed: ' + !!subscribed);
                      calcCount = 0;
                      tester = new _TestDeepSubscribe.TestDeepSubscribe({
                        object: new ClassSync({
                          subscribed: !!subscribed,
                          addCalcCount: true
                        }),
                        // TODO replace to ClassAsync
                        immediate: true,
                        doNotSubscribeNonObjectValues: true,
                        asyncDelay: 200
                      }, function (b) {
                        return b.p('calc2').p('value').p('calc2').p('value').p('calc2').p('value').p('calc1');
                      });
                      _context8.next = 5;
                      return tester.subscribeAsync([new Date(101)]);

                    case 5:
                      _context8.next = 7;
                      return tester.unsubscribeAsync([new Date(101)]);

                    case 7:
                      _context8.next = 9;
                      return tester.subscribeAsync([new Date(101)]);

                    case 9:
                      _context8.next = 11;
                      return tester.unsubscribeAsync([new Date(101)]);

                    case 11:
                      _context8.next = 13;
                      return tester.changeAsync(function (o) {
                        return calcCount -= subscribed ? 2 : 3;
                      }, [], []);

                    case 13:
                      _context8.next = 15;
                      return tester.changeAsync(function (o) {
                        return o.source1 = new ValueObject(100);
                      }, [], []);

                    case 15:
                      _context8.next = 17;
                      return tester.subscribeAsync([new Date(101)]);

                    case 17:
                      _context8.next = 19;
                      return tester.unsubscribeAsync([new Date(101)]);

                    case 19:
                      _context8.next = 21;
                      return tester.changeAsync(function (o) {
                        o.source1_ = o.source1;
                        o.source1 = void 0;
                      }, [], []);

                    case 21:
                      _context8.next = 23;
                      return tester.subscribeAsync([new Date(101)]);

                    case 23:
                      _context8.next = 25;
                      return tester.changeAsync(function (o) {
                        return o.source1_.value = 200;
                      }, [new Date(101)], [new Date(202)]);

                    case 25:
                      _context8.next = 27;
                      return tester.changeAsync(function (o) {
                        return o.source2.value += 10;
                      }, [new Date(202)], [new Date(202)]);

                    case 27:
                      _context8.next = 29;
                      return tester.changeAsync(function (o) {
                        return o.source1_.value = 300;
                      }, [new Date(202)], [new Date(303)]);

                    case 29:
                      _context8.next = 31;
                      return tester.unsubscribeAsync([new Date(303)]);

                    case 31:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _loop4);
            });
            subscribed = 1;

          case 3:
            if (!(subscribed >= 0)) {
              _context9.next = 8;
              break;
            }

            return _context9.delegateYield(_loop4(subscribed), "t0", 5);

          case 5:
            subscribed--;
            _context9.next = 3;
            break;

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee5);
  })));
});
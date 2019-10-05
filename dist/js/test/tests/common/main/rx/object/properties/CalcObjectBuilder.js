"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ThenableSync = require("../../../../../../../main/common/async/ThenableSync");

var _ObservableClass2 = require("../../../../../../../main/common/rx/object/ObservableClass");

var _CalcObjectBuilder = require("../../../../../../../main/common/rx/object/properties/CalcObjectBuilder");

var _CalcPropertyBuilder = require("../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder");

var _ConnectorBuilder = require("../../../../../../../main/common/rx/object/properties/ConnectorBuilder");

var _helpers = require("../../../../../../../main/common/rx/object/properties/helpers");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _TestDeepSubscribe = require("../../deep-subscribe/helpers/src/TestDeepSubscribe");

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
(0, _Mocha.describe)('common > main > rx > properties > CalcObjectBuilder', function () {
  this.timeout(30000);

  var ClassSync =
  /*#__PURE__*/
  function (_ObservableClass) {
    (0, _inherits2.default)(ClassSync, _ObservableClass);

    function ClassSync() {
      var _getPrototypeOf2, _context;

      var _this;

      (0, _classCallCheck2.default)(this, ClassSync);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(ClassSync)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
      _this.value = 'Value';
      _this.source1 = 123;
      _this.source2 = 0;
      return _this;
    }

    return ClassSync;
  }(_ObservableClass2.ObservableClass);

  var ClassAsync =
  /*#__PURE__*/
  function (_ClassSync) {
    (0, _inherits2.default)(ClassAsync, _ClassSync);

    function ClassAsync() {
      (0, _classCallCheck2.default)(this, ClassAsync);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf3.default)(ClassAsync).apply(this, arguments));
    }

    return ClassAsync;
  }(ClassSync);

  ClassSync.prototype.valuePrototype = 'Value Prototype';
  new _CalcObjectBuilder.CalcObjectBuilder(ClassSync.prototype).writable('source1').writable('source2').calc('calc1', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.v('lastOrWait').p('source1').v('wait');
      });
    }
  }), // .connect('connectValue1', b => b.p('source1'))),
  // b.path(o => o['@lastOrWait'].source1['@wait']))),
  (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.propertyAny();
      });
    },
    calcFunc: function calcFunc(state) {
      state.value = state.input.connectValue1 && new Date(state.input.connectValue1);
      return _ThenableSync.ThenableSync.createResolved(null);
    }
  })).calc('calc2', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.path(function (o) {
          return o['@lastOrWait'].source2['@wait'];
        });
      });
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.propertyAny();
      });
    },
    calcFunc: function calcFunc(state) {
      state.value = {
        value: state.input.connectorState.source
      };
      return _ThenableSync.ThenableSync.createResolved(true);
    }
  }));
  new _CalcObjectBuilder.CalcObjectBuilder(ClassAsync.prototype).calc('calc1', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.path(function (o) {
          return o['@lastOrWait'].source1['@wait'];
        });
      });
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.propertyAny();
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
                return (0, _setTimeout2.default)(r, 100);
              });

            case 2:
              state.value = new Date(state.input.connectValue1);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, calcFunc);
    })
  })).calc('calc2', (0, _ConnectorBuilder.connectorFactory)({
    buildRule: function buildRule(c) {
      return c.connect('connectValue1', function (b) {
        return b.path(function (o) {
          return o['@lastOrWait'].source2['@wait'];
        });
      });
    }
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)({
    dependencies: function dependencies(d) {
      return d.invalidateOn(function (b) {
        return b.propertyAny();
      });
    },
    calcFunc:
    /*#__PURE__*/
    _regenerator.default.mark(function calcFunc(state) {
      return _regenerator.default.wrap(function calcFunc$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return new _promise.default(function (r) {
                return (0, _setTimeout2.default)(r, 100);
              });

            case 2:
              state.value = {
                value: state.input.connectorState.source
              };
              return _context3.abrupt("return", true);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, calcFunc);
    })
  }));
  (0, _Mocha.it)('calc sync', function () {
    var result = new ClassSync().calc1.last;

    _Assert.assert.deepStrictEqual(result, new Date(123));

    result = new ClassSync().calc1.wait;

    _Assert.assert.deepStrictEqual(result, new Date(123));

    result = new ClassSync().calc1.lastOrWait;

    _Assert.assert.deepStrictEqual(result, new Date(123));
  });
  (0, _Mocha.it)('calc sync resolve', function () {
    var val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1;
    })();

    _Assert.assert.deepStrictEqual(val, new Date(123));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1;
    })(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(123));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1.wait;
    })(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(123));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.calc1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(123));

    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.calc1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();

    _Assert.assert.deepStrictEqual(val, new Date(123));

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
    return _regenerator.default.wrap(function _callee$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _Assert.assert.deepStrictEqual(new ClassAsync().calc1.last, void 0);

            object = new ClassAsync().calc1;
            _context4.t0 = _Assert.assert;
            _context4.next = 5;
            return object.wait;

          case 5:
            _context4.t1 = _context4.sent;
            _context4.t2 = new Date(123);

            _context4.t0.deepStrictEqual.call(_context4.t0, _context4.t1, _context4.t2);

            _Assert.assert.deepStrictEqual(object.last, new Date(123));

            object = new ClassAsync().calc1;
            _context4.t3 = _Assert.assert;
            _context4.next = 13;
            return object.lastOrWait;

          case 13:
            _context4.t4 = _context4.sent;
            _context4.t5 = new Date(123);

            _context4.t3.deepStrictEqual.call(_context4.t3, _context4.t4, _context4.t5);

            _Assert.assert.deepStrictEqual(object.last, new Date(123));

          case 17:
          case "end":
            return _context4.stop();
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
    return _regenerator.default.wrap(function _callee2$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1;
            })();
            _context5.t0 = _Assert.assert;
            _context5.next = 4;
            return val;

          case 4:
            _context5.t1 = _context5.sent;
            _context5.t2 = new Date(123);

            _context5.t0.deepStrictEqual.call(_context5.t0, _context5.t1, _context5.t2);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1;
            })(function (o) {
              return o.last;
            }, true)();
            _context5.t3 = _Assert.assert;
            _context5.next = 11;
            return val;

          case 11:
            _context5.t4 = _context5.sent;
            _context5.t5 = new Date(123);

            _context5.t3.deepStrictEqual.call(_context5.t3, _context5.t4, _context5.t5);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1.wait;
            })(function (o) {
              return o.last;
            }, true)();
            _context5.t6 = _Assert.assert;
            _context5.next = 18;
            return val;

          case 18:
            _context5.t7 = _context5.sent;
            _context5.t8 = new Date(123);

            _context5.t6.deepStrictEqual.call(_context5.t6, _context5.t7, _context5.t8);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.calc1;
            })(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context5.t9 = _Assert.assert;
            _context5.next = 25;
            return val;

          case 25:
            _context5.t10 = _context5.sent;
            _context5.t11 = new Date(123);

            _context5.t9.deepStrictEqual.call(_context5.t9, _context5.t10, _context5.t11);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.calc1;
            })(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context5.t12 = _Assert.assert;
            _context5.next = 32;
            return val;

          case 32:
            _context5.t13 = _context5.sent;
            _context5.t14 = new Date(123);

            _context5.t12.deepStrictEqual.call(_context5.t12, _context5.t13, _context5.t14);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)();
            _context5.t15 = _Assert.assert;
            _context5.next = 40;
            return obj;

          case 40:
            _context5.t16 = _context5.sent;
            _context5.t17 = object;

            _context5.t15.deepStrictEqual.call(_context5.t15, _context5.t16, _context5.t17);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)(function (o) {
              return o.wait;
            }, true)();
            _context5.t18 = _Assert.assert;
            _context5.next = 48;
            return obj;

          case 48:
            _context5.t19 = _context5.sent;
            _context5.t20 = object;

            _context5.t18.deepStrictEqual.call(_context5.t18, _context5.t19, _context5.t20);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context5.t21 = _Assert.assert;
            _context5.next = 56;
            return obj;

          case 56:
            _context5.t22 = _context5.sent;
            _context5.t23 = object;

            _context5.t21.deepStrictEqual.call(_context5.t21, _context5.t22, _context5.t23);

          case 59:
          case "end":
            return _context5.stop();
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

    _Assert.assert.deepStrictEqual(value2, new Date(123));
  });
  (0, _Mocha.it)('circular calc async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var object, value, value2;
    return _regenerator.default.wrap(function _callee3$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            object = new ClassSync();
            value = (0, _helpers.resolvePath)(object)(function (o) {
              return o.calc2;
            })(function (o) {
              return o.value;
            })();
            _context6.t0 = _Assert.assert;
            _context6.next = 5;
            return value;

          case 5:
            _context6.t1 = _context6.sent;
            _context6.t2 = object;

            _context6.t0.strictEqual.call(_context6.t0, _context6.t1, _context6.t2);

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
            _context6.t3 = _Assert.assert;
            _context6.next = 12;
            return value;

          case 12:
            _context6.t4 = _context6.sent;
            _context6.t5 = object;

            _context6.t3.strictEqual.call(_context6.t3, _context6.t4, _context6.t5);

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
            _context6.t6 = _Assert.assert;
            _context6.next = 19;
            return value2;

          case 19:
            _context6.t7 = _context6.sent;
            _context6.t8 = new Date(123);

            _context6.t6.deepStrictEqual.call(_context6.t6, _context6.t7, _context6.t8);

          case 22:
          case "end":
            return _context6.stop();
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
  (0, _Mocha.it)('deepSubscribe calc sync', function () {
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('calc1');
    }).subscribe([new Date(123)]).change(function (o) {
      return o.source1 = 234;
    }, [new Date(123)], [new Date(234)]).unsubscribe([new Date(234)]);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, function (b) {
      return b.p('calc1').p('getTime');
    }).subscribe([Date.prototype.getTime]).change(function (o) {
      return o.source1 = 234;
    }, [Date.prototype.getTime], [Date.prototype.getTime]).unsubscribe([Date.prototype.getTime]);
  });
  (0, _Mocha.it)('deepSubscribe calc async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var date234, tester;
    return _regenerator.default.wrap(function _callee4$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            date234 = new Date(234);
            tester = new _TestDeepSubscribe.TestDeepSubscribe({
              object: new ClassAsync(),
              immediate: true,
              doNotSubscribeNonObjectValues: true,
              asyncDelay: 500
            }, function (b) {
              return b.p('calc1');
            });
            _context7.next = 4;
            return tester.subscribeAsync([new Date(123)]);

          case 4:
            _context7.next = 6;
            return tester.changeAsync(function (o) {
              return o.source1 = 234;
            }, [new Date(123)], [new Date(234)]);

          case 6:
            _context7.next = 8;
            return tester.unsubscribeAsync([new Date(234)]);

          case 8:
            tester = new _TestDeepSubscribe.TestDeepSubscribe({
              object: new ClassAsync(),
              immediate: true,
              doNotSubscribeNonObjectValues: true,
              asyncDelay: 500
            }, function (b) {
              return b.p('calc1').p('getTime');
            });
            _context7.next = 11;
            return tester.subscribeAsync([Date.prototype.getTime]);

          case 11:
            _context7.next = 13;
            return tester.changeAsync(function (o) {
              return o.source1 = 234;
            }, [Date.prototype.getTime], [Date.prototype.getTime]);

          case 13:
            _context7.next = 15;
            return tester.unsubscribeAsync([Date.prototype.getTime]);

          case 15:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee4);
  })));
  (0, _Mocha.it)('deepSubscribe calc circular sync', function () {
    var date234 = new Date(234);
    new _TestDeepSubscribe.TestDeepSubscribe({
      object: new ClassSync(),
      immediate: true,
      doNotSubscribeNonObjectValues: true
    }, // b => b.p('calc2').p('value').p('calc2').p('value').p('calc1'),
    function (b) {
      return b.p('calc2').p('value').p('calc1');
    }) // .subscribe([new Date(123)])
    // .unsubscribe([new Date(123)])
    .subscribe([new Date(123)]).change(function (o) {
      return o.source1 = 234;
    }, [new Date(123)], [new Date(234)]).change(function (o) {
      return o.source2++;
    }, [new Date(234)], [new Date(234)]).change(function (o) {
      return o.source1 = 345;
    }, [new Date(234)], [new Date(345)]).unsubscribe([new Date(345)]);
  });
  (0, _Mocha.it)('deepSubscribe calc circular async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5() {
    var date234, tester;
    return _regenerator.default.wrap(function _callee5$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            date234 = new Date(234);
            tester = new _TestDeepSubscribe.TestDeepSubscribe({
              object: new ClassSync(),
              immediate: true,
              doNotSubscribeNonObjectValues: true,
              asyncDelay: 500
            }, function (b) {
              return b.p('calc2').p('value').p('calc2').p('value').p('calc2').p('value').p('calc1');
            });
            _context8.next = 4;
            return tester.subscribeAsync([new Date(123)]);

          case 4:
            _context8.next = 6;
            return tester.unsubscribeAsync([new Date(123)]);

          case 6:
            _context8.next = 8;
            return tester.subscribeAsync([new Date(123)]);

          case 8:
            _context8.next = 10;
            return tester.changeAsync(function (o) {
              return o.source1 = 234;
            }, [new Date(123)], [new Date(234)]);

          case 10:
            _context8.next = 12;
            return tester.changeAsync(function (o) {
              return o.source2++;
            }, [new Date(234)], [new Date(234)]);

          case 12:
            _context8.next = 14;
            return tester.changeAsync(function (o) {
              return o.source1 = 345;
            }, [new Date(234)], [new Date(345)]);

          case 14:
            _context8.next = 16;
            return tester.unsubscribeAsync([new Date(345)]);

          case 16:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee5);
  })));
});
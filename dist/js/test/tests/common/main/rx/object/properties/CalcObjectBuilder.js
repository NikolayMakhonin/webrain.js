"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ThenableSync = require("../../../../../../../main/common/async/ThenableSync");

var _ObservableObject2 = require("../../../../../../../main/common/rx/object/ObservableObject");

var _CalcObjectBuilder = require("../../../../../../../main/common/rx/object/properties/CalcObjectBuilder");

var _CalcPropertyBuilder = require("../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder");

var _ConnectorBuilder = require("../../../../../../../main/common/rx/object/properties/ConnectorBuilder");

var _helpers = require("../../../../../../../main/common/rx/object/properties/helpers");

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
describe('common > main > rx > properties > CalcObjectBuilder', function () {
  var ClassSync =
  /*#__PURE__*/
  function (_ObservableObject) {
    (0, _inherits2.default)(ClassSync, _ObservableObject);

    function ClassSync() {
      (0, _classCallCheck2.default)(this, ClassSync);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ClassSync).apply(this, arguments));
    }

    return ClassSync;
  }(_ObservableObject2.ObservableObject);

  var ClassAsync =
  /*#__PURE__*/
  function (_ClassSync) {
    (0, _inherits2.default)(ClassAsync, _ClassSync);

    function ClassAsync() {
      (0, _classCallCheck2.default)(this, ClassAsync);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ClassAsync).apply(this, arguments));
    }

    return ClassAsync;
  }(ClassSync);

  new _CalcObjectBuilder.CalcObjectBuilder(ClassSync.prototype).calc('prop1', (0, _ConnectorBuilder.connectorFactory)(function (c) {
    return c.connect('connectValue1', function (b) {
      return b.path(function (o) {
        return o['@lastOrWait'].source['@wait'];
      });
    });
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)(function (input, property) {
    property.value = new Date(123);
    return _ThenableSync.ThenableSync.createResolved(null);
  }));
  new _CalcObjectBuilder.CalcObjectBuilder(ClassAsync.prototype).calc('prop1', (0, _ConnectorBuilder.connectorFactory)(function (c) {
    return c.connect('connectValue1', function (b) {
      return b.path(function (o) {
        return o['@lastOrWait'].source['@wait'];
      });
    });
  }), (0, _CalcPropertyBuilder.calcPropertyFactory)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(input, property) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new _promise.default(function (r) {
              return (0, _setTimeout2.default)(r, 100);
            });

          case 2:
            property.value = new Date(123);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('calc sync', function () {
    var result = new ClassSync().prop1.last;
    assert.deepStrictEqual(result, new Date(123));
    result = new ClassSync().prop1.wait;
    assert.deepStrictEqual(result, new Date(123));
    result = new ClassSync().prop1.lastOrWait;
    assert.deepStrictEqual(result, new Date(123));
  });
  it('calc sync resolve', function () {
    var val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.prop1;
    })();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.prop1;
    })(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.prop1.wait;
    })(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.prop1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = (0, _helpers.resolvePath)(new ClassSync())(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.prop1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    var object = new ClassSync();
    var obj = (0, _helpers.resolvePath)(object)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = (0, _helpers.resolvePath)(object)(function (o) {
      return o.wait;
    }, true)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = (0, _helpers.resolvePath)(object)(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(obj, object);
  });
  it('calc async',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var object;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            assert.deepStrictEqual(new ClassAsync().prop1.last, void 0);
            object = new ClassAsync().prop1;
            _context2.t0 = assert;
            _context2.next = 5;
            return object.wait;

          case 5:
            _context2.t1 = _context2.sent;
            _context2.t2 = new Date(123);

            _context2.t0.deepStrictEqual.call(_context2.t0, _context2.t1, _context2.t2);

            assert.deepStrictEqual(object.last, new Date(123));
            object = new ClassAsync().prop1;
            _context2.t3 = assert;
            _context2.next = 13;
            return object.lastOrWait;

          case 13:
            _context2.t4 = _context2.sent;
            _context2.t5 = new Date(123);

            _context2.t3.deepStrictEqual.call(_context2.t3, _context2.t4, _context2.t5);

            assert.deepStrictEqual(object.last, new Date(123));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('calc async resolve',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var val, object, obj;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.prop1;
            })();
            _context3.t0 = assert;
            _context3.next = 4;
            return val;

          case 4:
            _context3.t1 = _context3.sent;
            _context3.t2 = new Date(123);

            _context3.t0.deepStrictEqual.call(_context3.t0, _context3.t1, _context3.t2);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.prop1;
            })(function (o) {
              return o.last;
            }, true)();
            _context3.t3 = assert;
            _context3.next = 11;
            return val;

          case 11:
            _context3.t4 = _context3.sent;
            _context3.t5 = new Date(123);

            _context3.t3.deepStrictEqual.call(_context3.t3, _context3.t4, _context3.t5);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.prop1.wait;
            })(function (o) {
              return o.last;
            }, true)();
            _context3.t6 = assert;
            _context3.next = 18;
            return val;

          case 18:
            _context3.t7 = _context3.sent;
            _context3.t8 = new Date(123);

            _context3.t6.deepStrictEqual.call(_context3.t6, _context3.t7, _context3.t8);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.prop1;
            })(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context3.t9 = assert;
            _context3.next = 25;
            return val;

          case 25:
            _context3.t10 = _context3.sent;
            _context3.t11 = new Date(123);

            _context3.t9.deepStrictEqual.call(_context3.t9, _context3.t10, _context3.t11);

            val = (0, _helpers.resolvePath)(new ClassAsync())(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.prop1;
            })(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context3.t12 = assert;
            _context3.next = 32;
            return val;

          case 32:
            _context3.t13 = _context3.sent;
            _context3.t14 = new Date(123);

            _context3.t12.deepStrictEqual.call(_context3.t12, _context3.t13, _context3.t14);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)();
            _context3.t15 = assert;
            _context3.next = 40;
            return obj;

          case 40:
            _context3.t16 = _context3.sent;
            _context3.t17 = object;

            _context3.t15.deepStrictEqual.call(_context3.t15, _context3.t16, _context3.t17);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)(function (o) {
              return o.wait;
            }, true)();
            _context3.t18 = assert;
            _context3.next = 48;
            return obj;

          case 48:
            _context3.t19 = _context3.sent;
            _context3.t20 = object;

            _context3.t18.deepStrictEqual.call(_context3.t18, _context3.t19, _context3.t20);

            object = new ClassAsync();
            obj = (0, _helpers.resolvePath)(object)(function (o) {
              return o.wait;
            }, true)(function (o) {
              return o.last;
            }, true)();
            _context3.t21 = assert;
            _context3.next = 56;
            return obj;

          case 56:
            _context3.t22 = _context3.sent;
            _context3.t23 = object;

            _context3.t21.deepStrictEqual.call(_context3.t21, _context3.t22, _context3.t23);

          case 59:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
});
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
import { ThenableSync } from '../../../../../../../main/common/async/ThenableSync';
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { CalcObjectBuilder } from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder';
import { calcPropertyFactory } from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder';
import { connectorFactory } from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder';
import { resolvePath } from '../../../../../../../main/common/rx/object/properties/helpers';
describe('common > main > rx > properties > CalcObjectBuilder', function () {
  var ClassSync =
  /*#__PURE__*/
  function (_ObservableObject) {
    _inherits(ClassSync, _ObservableObject);

    function ClassSync() {
      _classCallCheck(this, ClassSync);

      return _possibleConstructorReturn(this, _getPrototypeOf(ClassSync).apply(this, arguments));
    }

    return ClassSync;
  }(ObservableObject);

  var ClassAsync =
  /*#__PURE__*/
  function (_ClassSync) {
    _inherits(ClassAsync, _ClassSync);

    function ClassAsync() {
      _classCallCheck(this, ClassAsync);

      return _possibleConstructorReturn(this, _getPrototypeOf(ClassAsync).apply(this, arguments));
    }

    return ClassAsync;
  }(ClassSync);

  new CalcObjectBuilder(ClassSync.prototype).calc('prop1', connectorFactory(function (c) {
    return c.connect('connectValue1', function (b) {
      return b.path(function (o) {
        return o['@lastOrWait'].source['@wait'];
      });
    });
  }), calcPropertyFactory(function (input, valueProperty) {
    valueProperty.value = new Date(123);
    return ThenableSync.createResolved(null);
  }));
  new CalcObjectBuilder(ClassAsync.prototype).calc('prop1', connectorFactory(function (c) {
    return c.connect('connectValue1', function (b) {
      return b.path(function (o) {
        return o['@lastOrWait'].source['@wait'];
      });
    });
  }), calcPropertyFactory(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(input, valueProperty) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new Promise(function (r) {
              return setTimeout(r, 100);
            });

          case 2:
            valueProperty.value = new Date(123);

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
    var val = resolvePath(new ClassSync())(function (o) {
      return o.prop1;
    })();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(function (o) {
      return o.prop1;
    })(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(function (o) {
      return o.prop1.wait;
    })(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(function (o) {
      return o.prop1;
    })(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(val, new Date(123));
    val = resolvePath(new ClassSync())(function (o) {
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
    var obj = resolvePath(object)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = resolvePath(object)(function (o) {
      return o.wait;
    }, true)();
    assert.deepStrictEqual(obj, object);
    object = new ClassSync();
    obj = resolvePath(object)(function (o) {
      return o.wait;
    }, true)(function (o) {
      return o.last;
    }, true)();
    assert.deepStrictEqual(obj, object);
  });
  it('calc async',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var object;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3() {
    var val, object, obj;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            val = resolvePath(new ClassAsync())(function (o) {
              return o.prop1;
            })();
            _context3.t0 = assert;
            _context3.next = 4;
            return val;

          case 4:
            _context3.t1 = _context3.sent;
            _context3.t2 = new Date(123);

            _context3.t0.deepStrictEqual.call(_context3.t0, _context3.t1, _context3.t2);

            val = resolvePath(new ClassAsync())(function (o) {
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

            val = resolvePath(new ClassAsync())(function (o) {
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

            val = resolvePath(new ClassAsync())(function (o) {
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

            val = resolvePath(new ClassAsync())(function (o) {
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
            obj = resolvePath(object)();
            _context3.t15 = assert;
            _context3.next = 40;
            return obj;

          case 40:
            _context3.t16 = _context3.sent;
            _context3.t17 = object;

            _context3.t15.deepStrictEqual.call(_context3.t15, _context3.t16, _context3.t17);

            object = new ClassAsync();
            obj = resolvePath(object)(function (o) {
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
            obj = resolvePath(object)(function (o) {
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
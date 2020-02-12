"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _rdtsc = require("rdtsc");

var _ThenableSync = require("../../../main/common/async/ThenableSync");

var _fasade = require("../../../main/common/rx/depend/fasade");

var _Assert = require("../../../main/common/test/Assert");

var _Mocha = require("../../../main/common/test/Mocha");

/* tslint:disable:prefer-const no-identical-functions no-empty no-shadowed-variable no-conditional-assignment */

/* tslint:disable:no-var-requires one-variable-per-declaration */

/* eslint-disable no-new-func,no-array-constructor,object-property-newline,no-undef */

/* eslint-disable no-empty,no-shadow,no-prototype-builtins,prefer-destructuring */

/* eslint-disable prefer-rest-params,arrow-body-style */
// @ts-ignore
(0, _Mocha.describe)('dependent-func', function () {
  (0, _Mocha.xit)('perf', function () {
    this.timeout(300000);
    var arr1 = [];
    var arr2 = new Array(10);
    var result = (0, _rdtsc.calcPerformance)(5000, function () {// no operations
    }, function () {
      arr1 = new Array();
    }, function () {
      arr2 = new Array(10);
    });
    console.log(result);
  });
  (0, _Mocha.it)('base', function () {
    var _context3, _context4, _context5, _context6, _context7, _context8, _context9;

    var _marked =
    /*#__PURE__*/
    _regenerator.default.mark(func2Body),
        _marked2 =
    /*#__PURE__*/
    _regenerator.default.mark(func3Body);

    this.timeout(300000);
    var func1;
    var func2;
    var func3;

    function func1Body(a, b) {
      return (a || 0) + (b || 0);
    }

    function func2Body() {
      return _regenerator.default.wrap(function func2Body$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return func1(1);

            case 2:
              _context.next = 4;
              return func1(2, 3);

            case 4:
              return _context.abrupt("return", func1(2, 3) + 10);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _marked);
    }

    function func3Body() {
      var val;
      return _regenerator.default.wrap(function func3Body$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.delegateYield(func2(), "t0", 1);

            case 1:
              val = _context2.t0;
              return _context2.abrupt("return", val + 100);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _marked2);
    }

    function getSubscriber1() {
      return function subscriber1(onInvalidate) {
        return function () {
          return false;
        };
      };
    }

    function getSubscriber2() {
      return function subscriber2(onInvalidate) {
        return function () {
          return false;
        };
      };
    }

    function getSubscriber3() {
      return function subscriber3(onInvalidate) {
        return function () {
          return false;
        };
      };
    }

    var FuncMeta =
    /*#__PURE__*/
    function () {
      function FuncMeta(id) {
        (0, _classCallCheck2.default)(this, FuncMeta);
        this.subscribers = new _map2.default();
        this.values = new _map2.default();
        this.id = id;
      }

      (0, _createClass2.default)(FuncMeta, [{
        key: "hasDependency",
        value: function hasDependency(callId) {
          return this.subscribers.has(callId);
        }
      }, {
        key: "subscribeDependency",
        value: function subscribeDependency(callId, subscriber) {
          _Assert.assert.notOk(this.subscribers.has(callId));

          return this.subscribers.set(callId, subscriber);
        }
      }, {
        key: "setValue",
        value: function setValue(callId, value) {
          return (0, _values.default)(this).set(callId, value);
        }
      }]);
      return FuncMeta;
    }();

    var meta1 = new FuncMeta(1);
    var meta2 = new FuncMeta(2);
    var meta3 = new FuncMeta(3);
    func1 = (0, _fasade.makeDependentFunc)(func1Body, getSubscriber1, meta1);
    func2 = (0, _fasade.makeDependentFunc)(func2Body, getSubscriber2, meta2);
    func3 = (0, _fasade.makeDependentFunc)(func3Body, getSubscriber3, meta3);
    var result = (0, _ThenableSync.resolveAsync)(func3());

    _Assert.assert.strictEqual(result, 115);

    _Assert.assert.strictEqual(meta1.subscribers.size, 0); // assert.strictEqual(meta1.values.size, 0)


    _Assert.assert.deepStrictEqual((0, _map.default)(_context3 = (0, _from.default)((0, _values.default)(_context4 = meta2.subscribers).call(_context4))).call(_context3, function (o) {
      return o.name;
    }), ['subscriber1', 'subscriber1']);

    _Assert.assert.deepStrictEqual((0, _from.default)((0, _values.default)(_context5 = (0, _values.default)(meta1)).call(_context5)), [1, 5]);

    _Assert.assert.deepStrictEqual((0, _map.default)(_context6 = (0, _from.default)((0, _values.default)(_context7 = meta3.subscribers).call(_context7))).call(_context6, function (o) {
      return o.name;
    }), ['subscriber2']);

    _Assert.assert.deepStrictEqual((0, _from.default)((0, _values.default)(_context8 = (0, _values.default)(meta2)).call(_context8)), [15]);

    _Assert.assert.deepStrictEqual((0, _from.default)((0, _values.default)(_context9 = (0, _values.default)(meta3)).call(_context9)), [115]);

    console.log(new Date());
  });
});
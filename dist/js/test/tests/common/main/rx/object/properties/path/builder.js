"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineEnumerableProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineEnumerableProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _ThenableSync = require("../../../../../../../../main/common/async/ThenableSync");

var _valueProperty = require("../../../../../../../../main/common/helpers/value-property");

var _CallState = require("../../../../../../../../main/common/rx/depend/core/CallState");

var _currentState2 = require("../../../../../../../../main/common/rx/depend/core/current-state");

var _depend = require("../../../../../../../../main/common/rx/depend/core/depend");

var _builder = require("../../../../../../../../main/common/rx/object/properties/path/builder");

var _Assert = require("../../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../../main/common/test/Mocha");

var _helpers = require("../../../../../../../../main/common/time/helpers");

/* tslint:disable:no-duplicate-string new-parens */

/* eslint-disable guard-for-in */
(0, _Mocha.describe)('common > main > rx > properties > builder', function () {
  (0, _Mocha.it)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var _temp, _temp2;

    var currentState, checkCurrentState, innerObject, object, paths, isDeferred, _loop, i, len;

    return _regenerator.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            checkCurrentState = function _checkCurrentState() {
              var _currentState = (0, _currentState2.getCurrentState)();

              if (_currentState !== currentState) {
                _Assert.assert.strictEqual(_currentState, currentState);
              }
            };

            currentState = null;
            innerObject = new (_temp = function _temp() {
              (0, _classCallCheck2.default)(this, _temp);
              this[_valueProperty.VALUE_PROPERTY_DEFAULT] = 100;
              this.d = '1';
            }, _temp)();
            object = new (_temp2 = function _temp2() {
              var _b, _this$a, _mutatorMap;

              (0, _classCallCheck2.default)(this, _temp2);
              this[_valueProperty.VALUE_PROPERTY_DEFAULT] = 101;
              this.a = (_this$a = {}, _this$a[_valueProperty.VALUE_PROPERTY_DEFAULT] = 101, _b = "b", _mutatorMap = {}, _mutatorMap[_b] = _mutatorMap[_b] || {}, _mutatorMap[_b].get = function () {
                checkCurrentState();
                return (0, _ThenableSync.resolveAsync)((0, _helpers.delay)(0), function () {
                  checkCurrentState();
                  return (0, _helpers.delay)(0);
                }).then(function () {
                  checkCurrentState();
                  return {
                    get c() {
                      checkCurrentState();

                      var iterator = /*#__PURE__*/_regenerator.default.mark(function _callee() {
                        return _regenerator.default.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                checkCurrentState();
                                _context.next = 3;
                                return (0, _helpers.delay)(0);

                              case 3:
                                checkCurrentState();
                                return _context.abrupt("return", innerObject);

                              case 5:
                              case "end":
                                return _context.stop();
                            }
                          }
                        }, _callee);
                      })();

                      return iterator;
                    }

                  };
                });
              }, (0, _defineEnumerableProperties2.default)(_this$a, _mutatorMap), _this$a);
            }, _temp2)(); // const x: HasDefaultValueOf<typeof object> = null
            // const p1: TGetNextPath<typeof object, typeof object, typeof object.a> = null
            // const p2: TGetPropertyPath<typeof object, typeof object> = null
            // const p3: TGetPropertyValue<typeof object> = null
            // const d1 = p1(
            // 	b => b(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true)
            // )
            // const d2 = p2(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true)()
            // const d3 = p3(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true)()

            paths = [(0, _builder.pathGetSetBuild)(function (b) {
              return b.fv(function (o) {
                return o.a;
              }).f(function (o) {
                return o.b;
              });
            }, {
              get: function get(b) {
                return b.f(function (o) {
                  return o.c;
                }).fv(function (o) {
                  return o.d;
                });
              },
              set: function set(b) {
                return b.f(function (o) {
                  return o.c;
                }).fv(function (o) {
                  return o.d;
                }, function (o, v) {
                  o.d = v;
                });
              }
            }), (0, _builder.pathGetSetBuild)(null, {
              get: function get(b) {
                return b.fv(function (o) {
                  return o.a;
                }).f(function (o) {
                  return o.b;
                }).f(function (o) {
                  return o.c;
                }).fv(function (o) {
                  return o.d;
                });
              },
              set: function set(b) {
                return b.fv(function (o) {
                  return o.a;
                }).f(function (o) {
                  return o.b;
                }).f(function (o) {
                  return o.c;
                }).fv(function (o) {
                  return o.d;
                }, function (o, v) {
                  o.d = v;
                });
              }
            }), (0, _builder.pathGetSetBuild)(function (b) {
              return b.fv(function (o) {
                return o.a;
              }).f(function (o) {
                return o.b;
              }).f(function (o) {
                return o.c;
              }).fv(function (o) {
                return o.d;
              }, function (o, v) {
                o.d = v;
              });
            })];
            isDeferred = 0;

          case 6:
            if (!(isDeferred <= 1)) {
              _context3.next = 17;
              break;
            }

            _loop = /*#__PURE__*/_regenerator.default.mark(function _loop(i, len) {
              var path, getValue, callState, value, valueAsync;
              return _regenerator.default.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      console.log('path: ' + i);
                      path = paths[i];
                      getValue = (0, _depend.dependX)(function () {
                        _Assert.assert.strictEqual(this, currentState, currentState.func + '');

                        checkCurrentState();
                        var val = path.get(object);
                        checkCurrentState();
                        return val;
                      }, isDeferred ? {
                        delayBeforeCalc: 10
                      } : null);
                      callState = (0, _CallState.getOrCreateCallState)(getValue)();
                      checkCurrentState();
                      currentState = callState;
                      _context2.next = 8;
                      return getValue();

                    case 8:
                      value = _context2.sent;
                      currentState = null;
                      checkCurrentState();

                      _Assert.assert.strictEqual(value, '1');

                      _context2.next = 14;
                      return path.set(object, '2');

                    case 14:
                      currentState = callState;
                      _context2.next = 17;
                      return getValue();

                    case 17:
                      value = _context2.sent;
                      currentState = null;
                      checkCurrentState();

                      _Assert.assert.strictEqual(value, '1');

                      (0, _CallState.invalidateCallState)(callState);
                      currentState = callState;
                      valueAsync = getValue();
                      currentState = null;
                      checkCurrentState();
                      currentState = callState;
                      _context2.next = 29;
                      return valueAsync;

                    case 29:
                      value = _context2.sent;
                      currentState = null;
                      checkCurrentState();

                      _Assert.assert.strictEqual(value, '2');

                      _context2.next = 35;
                      return path.set(object, '1');

                    case 35:
                      (0, _CallState.invalidateCallState)(callState);
                      currentState = callState;
                      _context2.next = 39;
                      return getValue();

                    case 39:
                      value = _context2.sent;
                      currentState = null;

                      _Assert.assert.strictEqual(currentState, null);

                      checkCurrentState();

                      _Assert.assert.strictEqual(value, '1');

                    case 44:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop);
            });
            i = 0, len = paths.length;

          case 9:
            if (!(i < len)) {
              _context3.next = 14;
              break;
            }

            return _context3.delegateYield(_loop(i, len), "t0", 11);

          case 11:
            i++;
            _context3.next = 9;
            break;

          case 14:
            isDeferred++;
            _context3.next = 6;
            break;

          case 17:
            checkCurrentState();

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2);
  })));
});
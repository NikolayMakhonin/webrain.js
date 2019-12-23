"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

/* tslint:disable:no-empty */
(0, _Mocha.xdescribe)('async behavior', function () {
  (0, _Mocha.it)('base',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5() {
    var asyncImmediate, sync, result, asyncFunc, test, call, promise;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            this.timeout(10000);

            asyncImmediate =
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(func) {
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!(new Date().getTime() < 1000)) {
                          _context.next = 4;
                          break;
                        }

                        _context.next = 3;
                        return new _promise.default(function (resolve) {
                          return (0, _setTimeout2.default)(resolve, 1);
                        });

                      case 3:
                        _Assert.assert.fail();

                      case 4:
                        return _context.abrupt("return", func ? func() : new Date().getTime() + Math.random());

                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function asyncImmediate(_x) {
                return _ref2.apply(this, arguments);
              };
            }();

            sync = function sync(func) {
              return func ? func() : new Date().getTime() + Math.random();
            };

            asyncFunc =
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee2(func, awaitMode) {
                return _regenerator.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.t0 = awaitMode;
                        _context2.next = _context2.t0 === 'immediate' ? 3 : _context2.t0 === 'after immediate async' ? 4 : _context2.t0 === 'after await sync' ? 9 : _context2.t0 === 'after immediate promise' ? 14 : _context2.t0 === 'in immediate async' ? 17 : _context2.t0 === 'in immediate promise' ? 18 : _context2.t0 === 'in immediate promise then' ? 19 : _context2.t0 === 'in immediate async 2' ? 20 : _context2.t0 === 'in immediate promise 2' ? 25 : _context2.t0 === 'after timeout 0' ? 30 : _context2.t0 === 'after timeout 1' ? 33 : _context2.t0 === 'in timeout 0' ? 36 : _context2.t0 === 'in timeout 1' ? 39 : 42;
                        break;

                      case 3:
                        return _context2.abrupt("break", 43);

                      case 4:
                        _context2.next = 6;
                        return asyncImmediate();

                      case 6:
                        if (_context2.sent) {
                          _context2.next = 8;
                          break;
                        }

                        _Assert.assert.fail();

                      case 8:
                        return _context2.abrupt("break", 43);

                      case 9:
                        _context2.next = 11;
                        return sync();

                      case 11:
                        if (_context2.sent) {
                          _context2.next = 13;
                          break;
                        }

                        _Assert.assert.fail();

                      case 13:
                        return _context2.abrupt("break", 43);

                      case 14:
                        _context2.next = 16;
                        return new _promise.default(function (resolve) {
                          return resolve();
                        });

                      case 16:
                        return _context2.abrupt("break", 43);

                      case 17:
                        return _context2.abrupt("return", asyncImmediate(func));

                      case 18:
                        return _context2.abrupt("return", new _promise.default(function (resolve) {
                          func();
                          resolve();
                        }));

                      case 19:
                        return _context2.abrupt("return", new _promise.default(function (resolve) {
                          return resolve();
                        }).then(func));

                      case 20:
                        _context2.next = 22;
                        return asyncImmediate(func);

                      case 22:
                        result = _context2.sent;

                        if (result === 'qwe') {
                          _Assert.assert.fail();
                        }

                        return _context2.abrupt("return", result);

                      case 25:
                        _context2.next = 27;
                        return new _promise.default(function (resolve) {
                          func();
                          resolve();
                        });

                      case 27:
                        result = _context2.sent;

                        if (result === 'qwe') {
                          _Assert.assert.fail();
                        }

                        return _context2.abrupt("return", result);

                      case 30:
                        _context2.next = 32;
                        return new _promise.default(function (resolve) {
                          return (0, _setTimeout2.default)(resolve, 0);
                        });

                      case 32:
                        return _context2.abrupt("break", 43);

                      case 33:
                        _context2.next = 35;
                        return new _promise.default(function (resolve) {
                          return (0, _setTimeout2.default)(resolve, 1);
                        });

                      case 35:
                        return _context2.abrupt("break", 43);

                      case 36:
                        _context2.next = 38;
                        return new _promise.default(function (resolve) {
                          return (0, _setTimeout2.default)(function () {
                            func();
                            resolve();
                          }, 0);
                        });

                      case 38:
                        return _context2.abrupt("return", null);

                      case 39:
                        _context2.next = 41;
                        return new _promise.default(function (resolve) {
                          return (0, _setTimeout2.default)(function () {
                            func();
                            resolve();
                          }, 1);
                        });

                      case 41:
                        return _context2.abrupt("return", null);

                      case 42:
                        _Assert.assert.fail('Unknown awaitMode: ' + awaitMode);

                      case 43:
                        return _context2.abrupt("return", func());

                      case 44:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function asyncFunc(_x2, _x3) {
                return _ref3.apply(this, arguments);
              };
            }();

            test =
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee3(shouldCallImmediate) {
                var i,
                    awaitMode,
                    call,
                    promise,
                    _args3 = arguments;
                return _regenerator.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        i = 0;

                      case 1:
                        if (!(i < (_args3.length <= 1 ? 0 : _args3.length - 1))) {
                          _context3.next = 13;
                          break;
                        }

                        awaitMode = i + 1 < 1 || _args3.length <= i + 1 ? undefined : _args3[i + 1];
                        console.log("shouldCallImmediate = " + shouldCallImmediate + "; awaitMode = " + awaitMode);
                        call = false;
                        promise = asyncFunc(function () {
                          return call = true;
                        }, awaitMode);

                        _Assert.assert.strictEqual(call, shouldCallImmediate);

                        _context3.next = 9;
                        return promise;

                      case 9:
                        _Assert.assert.ok(call);

                      case 10:
                        i++;
                        _context3.next = 1;
                        break;

                      case 13:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function test(_x4) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context5.next = 7;
            return test(true, 'immediate', 'in immediate async', 'in immediate promise', 'in immediate async 2', 'in immediate promise 2');

          case 7:
            _context5.next = 9;
            return test(false, 'after immediate async', 'after immediate promise', 'after timeout 0', 'after timeout 1', 'in timeout 0', 'in timeout 1', 'after await sync', 'in immediate promise then');

          case 9:
            console.log('Promise next then is not immediate');
            _context5.next = 12;
            return new _promise.default(function (resolve) {
              return resolve();
            }).then(function () {
              new _promise.default(function (resolve) {
                return resolve();
              }).then(function () {
                _Assert.assert.strictEqual(call, 1);
              });
              (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee4() {
                return _regenerator.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }))().then(function () {
                _Assert.assert.strictEqual(call, 1);
              });
              call = 1;
              return 2;
            }).then(function (o) {
              call = o;
            });

          case 12:
            console.log('Promise lazy then');
            call = undefined;
            promise = new _promise.default(function (resolve) {
              return resolve();
            }).then(function () {
              call = true;
            });

            _Assert.assert.strictEqual(call, undefined);

            _context5.next = 18;
            return promise;

          case 18:
            _Assert.assert.strictEqual(call, true);

            _context5.next = 21;
            return new _promise.default(function (resolve) {
              return resolve();
            });

          case 21:
            _Assert.assert.strictEqual(call, true);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
});
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _all = require("../../../../../../../main/common/rx/depend/all");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _helpers = require("../../../../../common/main/rx/depend/src/helpers");

var _helpers2 = require("../../../../v8/src/helpers/common/helpers");

var _contracts = require("../../../../v8/src/helpers/contracts");

var _helpers3 = require("../../../../v8/src/helpers/helpers");

/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires ordered-imports */
// @ts-ignore
(0, _Mocha.describe)('node > main > rx > depend > dependent-func', function () {
  function v8Test(_x, _x2) {
    return _v8Test.apply(this, arguments);
  }

  function _v8Test() {
    _v8Test = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee5(countIterations, iterate) {
      var objects, optimizedObjectsIterations, optimized, _assertIsOptimized, checkOptimization, i, key, inlined, notInlined, _key;

      return _regenerator.default.wrap(function _callee5$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              checkOptimization = function _ref7(iteration) {
                for (var key in objects) {
                  if (Object.prototype.hasOwnProperty.call(objects, key) && !Object.prototype.hasOwnProperty.call(optimizedObjectsIterations, key) && optimized.has(objects[key])) {
                    optimizedObjectsIterations[key] = iteration;
                  }
                }

                if (!(0, _helpers3.checkIsOptimized)(objects, optimized)) {
                  console.error('Iteration: ' + iteration);
                  (0, _helpers3.assertIsOptimized)(objects, optimized);
                }
              };

              _assertIsOptimized = function _ref6(obj) {
                return (0, _helpers3.assertIsOptimized)(obj, optimized);
              };

              objects = {
                // public
                getFuncCallState: _all.getFuncCallState,
                invalidate: _all.invalidate,
                makeDependentFunc: _all.makeDependentFunc,
                createPerceptron: _helpers.createPerceptron,
                // internal
                _createDependentFunc: _all._createDependentFunc,
                _getFuncCallState: _all._getFuncCallState,
                createFuncCallState: _all.createFuncCallState,
                getSubscriberLink: _all.getSubscriberLink,
                releaseSubscriberLink: _all.releaseSubscriberLink,
                subscribeDependency: _all.subscribeDependency,
                unsubscribeDependencies: _all.unsubscribeDependencies,
                // internal deep
                FuncCallState: _all.FuncCallState,
                semiWeakMapGet: _all.semiWeakMapGet,
                semiWeakMapSet: _all.semiWeakMapSet,
                getSubscriberLinkFromPool: _all.getSubscriberLinkFromPool,
                subscriberLinkPool: _all.subscriberLinkPool,
                _subscribe: _all._subscribe,
                createDependentFunc: _all.createDependentFunc,
                emit: _all.emit,
                isRefType: _all.isRefType,
                subscriberLinkDelete: _all.subscriberLinkDelete,
                update: _all.update // makeDependentIterator,
                // internal single call
                // createGetFuncCallState,
                // createMakeDependentFunc,
                // createSemiWeakMap,
                // SubscriberLinkPool,

              };
              optimizedObjectsIterations = {};
              optimized = new _set.default();
              i = 0;

            case 6:
              if (!(i < countIterations)) {
                _context7.next = 13;
                break;
              }

              if (i === 10) {
                // isRefType(1)
                // isRefType(2)
                for (key in objects) {
                  if (Object.prototype.hasOwnProperty.call(objects, key) && !optimized.has(objects[key])) {
                    _helpers2.v8.OptimizeFunctionOnNextCall(objects[key]);
                  }
                } // isRefType(3)

              }

              _context7.next = 10;
              return iterate(i, checkOptimization, _assertIsOptimized);

            case 10:
              i++;
              _context7.next = 6;
              break;

            case 13:
              console.log(optimizedObjectsIterations);
              inlined = [];
              notInlined = [];

              for (_key in objects) {
                if (Object.prototype.hasOwnProperty.call(objects, _key)) {
                  if ((_helpers2.v8.GetOptimizationStatus(objects[_key]) & _contracts.OptimizationStatus.MarkedForOptimization) === 0) {
                    notInlined.push(_key);
                  } else {
                    inlined.push(_key);
                  }
                }
              }

              console.log('Inlined: ', inlined);
              console.log('Not inlined: ', notInlined); // assert.deepStrictEqual(optimizedObjects, objects)

              (0, _helpers3.assertIsOptimized)(objects, optimized);

            case 20:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee5);
    }));
    return _v8Test.apply(this, arguments);
  }

  (0, _Mocha.it)('v8 perceptron',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    return _regenerator.default.wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            this.timeout(20000);
            _context4.next = 3;
            return v8Test(1000,
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee(iteration, checkOptimization, _assertIsOptimized) {
                var _context, _context2;

                var _createPerceptron, input, output, getStates, j, state;

                return _regenerator.default.wrap(function _callee$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _createPerceptron = (0, _helpers.createPerceptron)(2, 2), input = _createPerceptron.input, output = _createPerceptron.output, getStates = _createPerceptron.getStates;
                        (0, _forEach.default)(_context = getStates()).call(_context, function (o) {
                          _assertIsOptimized({
                            state: o
                          });
                        });
                        checkOptimization(iteration);
                        j = 0;

                      case 4:
                        if (!(j < 10)) {
                          _context3.next = 11;
                          break;
                        }

                        state = (0, _all.getFuncCallState)(input)();
                        _context3.next = 8;
                        return (0, _all.invalidate)(state);

                      case 8:
                        j++;
                        _context3.next = 4;
                        break;

                      case 11:
                        (0, _forEach.default)(_context2 = getStates()).call(_context2, function (o) {
                          _assertIsOptimized({
                            state: o
                          });
                        });
                        checkOptimization(iteration);

                      case 13:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3, _x4, _x5) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee2, this);
  })));
  (0, _Mocha.it)('v8 baseTest',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    return _regenerator.default.wrap(function _callee4$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            this.timeout(20000);
            _context6.next = 3;
            return v8Test(100,
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee3(iteration, checkOptimization, _assertIsOptimized) {
                var _ref5, states;

                return _regenerator.default.wrap(function _callee3$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return (0, _helpers.baseTest)();

                      case 2:
                        _ref5 = _context5.sent;
                        states = _ref5.states;
                        (0, _forEach.default)(states).call(states, function (o) {
                          _assertIsOptimized({
                            state: o
                          });
                        });
                        checkOptimization(iteration);

                      case 6:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x6, _x7, _x8) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee4, this);
  })));
});
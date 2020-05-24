"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _defineEnumerableProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineEnumerableProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _ThenableSync = require("../../../../../../../../main/common/async/ThenableSync");

var _valueProperty = require("../../../../../../../../main/common/helpers/value-property");

var _CallState = require("../../../../../../../../main/common/rx/depend/core/CallState");

var _depend = require("../../../../../../../../main/common/rx/depend/core/depend");

var _deepSubscriber = require("../../../../../../../../main/common/rx/object/properties/path/deepSubscriber");

var _Assert = require("../../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../../main/common/test/Mocha");

var _helpers = require("../../../../../../../../main/common/time/helpers");

/* tslint:disable:no-duplicate-string new-parens */

/* eslint-disable guard-for-in */
(0, _Mocha.describe)('common > main > rx > properties > deepSubscribe', function () {
  (0, _Mocha.it)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var visits, InnerClass, value, getValue, innerObject, invalidate, object, values, unsubscribe;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            invalidate = function _invalidate() {
              (0, _CallState.invalidateCallState)((0, _CallState.getCallState)(getValue).call(innerObject));
            };

            visits = [];

            InnerClass = /*#__PURE__*/function () {
              function InnerClass() {
                (0, _classCallCheck2.default)(this, InnerClass);
              }

              (0, _createClass2.default)(InnerClass, [{
                key: "d",
                get: function get() {
                  visits.push('d');
                  return 'd';
                }
              }]);
              return InnerClass;
            }();

            value = 'value';
            getValue = (0, _depend.depend)(function () {
              visits.push(value);
              return value;
            }, null, null, true);
            (0, _defineProperty.default)(InnerClass.prototype, _valueProperty.VALUE_PROPERTY_DEFAULT, {
              configurable: true,
              enumerable: true,
              get: getValue
            });
            innerObject = new InnerClass();
            object = new ( /*#__PURE__*/function () {
              function _class() {
                (0, _classCallCheck2.default)(this, _class);
              }

              (0, _createClass2.default)(_class, [{
                key: _valueProperty.VALUE_PROPERTY_DEFAULT,
                get: function get() {
                  visits.push('def');
                  return 'def';
                }
              }, {
                key: "a",
                get: function get() {
                  var _b, _ref2, _mutatorMap;

                  visits.push('a');
                  return [(_ref2 = {}, _mutatorMap = {}, _mutatorMap[_valueProperty.VALUE_PROPERTY_DEFAULT] = _mutatorMap[_valueProperty.VALUE_PROPERTY_DEFAULT] || {}, _mutatorMap[_valueProperty.VALUE_PROPERTY_DEFAULT].get = function () {
                    visits.push('def');
                    return 'def';
                  }, _b = "b", _mutatorMap[_b] = _mutatorMap[_b] || {}, _mutatorMap[_b].get = function () {
                    visits.push('b');
                    return (0, _ThenableSync.resolveAsync)((0, _helpers.delay)(0), function () {
                      return (0, _helpers.delay)(0);
                    }).then(function () {
                      return new _set.default([{
                        get c() {
                          visits.push('c');

                          var iterator = /*#__PURE__*/_regenerator.default.mark(function _callee() {
                            return _regenerator.default.wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    _context.next = 2;
                                    return (0, _helpers.delay)(0);

                                  case 2:
                                    return _context.abrupt("return", new _map.default([['key', innerObject]]));

                                  case 3:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          })();

                          return iterator;
                        }

                      }]);
                    });
                  }, (0, _defineEnumerableProperties2.default)(_ref2, _mutatorMap), _ref2)];
                }
              }]);
              return _class;
            }())();
            values = [];

            _Assert.assert.deepStrictEqual(visits, []);

            unsubscribe = (0, _deepSubscriber.deepSubscriber)({
              build: function build(b) {
                return b.v('a').collection().p('b').collection().p('c').any(function (b2) {
                  return b2.collection();
                }, function (b2) {
                  return b2.mapAny();
                });
              },
              subscriber: function subscriber(state) {
                values.push(state.value);
              }
            })(object);
            _context2.next = 13;
            return (0, _helpers.delay)(10);

          case 13:
            _context2.next = 15;
            return (0, _helpers.delay)(10);

          case 15:
            _context2.next = 17;
            return (0, _helpers.delay)(10);

          case 17:
            _Assert.assert.deepStrictEqual(visits, ['a', 'b', 'c', 'value']);

            _Assert.assert.deepStrictEqual(values, [_CallState.ALWAYS_CHANGE_VALUE]);

            visits = [];
            values = [];
            invalidate();
            _context2.next = 24;
            return (0, _helpers.delay)(10);

          case 24:
            _context2.next = 26;
            return (0, _helpers.delay)(10);

          case 26:
            _context2.next = 28;
            return (0, _helpers.delay)(10);

          case 28:
            _Assert.assert.deepStrictEqual(visits, ['value']);

            _Assert.assert.deepStrictEqual(values, []);

            visits = [];
            values = [];
            value = 'value2';
            invalidate();
            _context2.next = 36;
            return (0, _helpers.delay)(10);

          case 36:
            _context2.next = 38;
            return (0, _helpers.delay)(10);

          case 38:
            _context2.next = 40;
            return (0, _helpers.delay)(10);

          case 40:
            _Assert.assert.deepStrictEqual(visits, ['value2', 'a', 'b', 'c']);

            _Assert.assert.deepStrictEqual(values, [_CallState.ALWAYS_CHANGE_VALUE]);

            visits = [];
            values = [];
            unsubscribe();
            value = 'value2';
            invalidate();
            _context2.next = 49;
            return (0, _helpers.delay)(10);

          case 49:
            _context2.next = 51;
            return (0, _helpers.delay)(10);

          case 51:
            _context2.next = 53;
            return (0, _helpers.delay)(10);

          case 53:
            _Assert.assert.deepStrictEqual(visits, []);

            _Assert.assert.deepStrictEqual(values, []);

          case 55:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});
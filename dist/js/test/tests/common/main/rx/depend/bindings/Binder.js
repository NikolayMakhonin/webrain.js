"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _bind2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _Random = require("../../../../../../../main/common/random/Random");

var _Binder = require("../../../../../../../main/common/rx/depend/bindings/Binder");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

/* tslint:disable:no-identical-functions no-shadowed-variable */
(0, _Mocha.describe)('common > main > rx > depend > bindings > Binder', function () {
  (0, _Mocha.it)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var isBind, bind, binder, unbinders, seed, rnd, i, unbind;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bind = function _bind() {
              _Assert.assert.notOk(isBind);

              isBind = true;
              return function () {
                _Assert.assert.ok(isBind);

                isBind = false;
              };
            };

            isBind = false;
            binder = new _Binder.Binder(bind);
            unbinders = [];
            unbinders[0] = (0, _bind2.default)(binder).call(binder);

            _Assert.assert.ok(isBind);

            unbinders[0]();

            _Assert.assert.notOk(isBind);

            unbinders[0] = (0, _bind2.default)(binder).call(binder);

            _Assert.assert.ok(isBind);

            unbinders[1] = (0, _bind2.default)(binder).call(binder);

            _Assert.assert.ok(isBind);

            unbinders[0]();

            _Assert.assert.ok(isBind);

            unbinders[1]();

            _Assert.assert.notOk(isBind);

            unbinders.length = 0;
            seed = new _Random.Random().nextSeed();
            console.log("seed = " + seed);
            rnd = new _Random.Random(seed);
            i = 0;

          case 21:
            if (!(i < 1000)) {
              _context.next = 33;
              break;
            }

            if (unbinders.length === 0) {
              _Assert.assert.notOk(isBind);
            } else {
              _Assert.assert.ok(isBind);
            }

            _context.t0 = rnd.nextInt(2);
            _context.next = _context.t0 === 0 ? 26 : _context.t0 === 1 ? 28 : 30;
            break;

          case 26:
            if (unbinders.length < 5) {
              unbinders.push((0, _bind2.default)(binder).call(binder));
            }

            return _context.abrupt("break", 30);

          case 28:
            if (unbinders.length > 0) {
              unbind = rnd.pullArrayItem(unbinders);
              unbind();
            }

            return _context.abrupt("break", 30);

          case 30:
            i++;
            _context.next = 21;
            break;

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
});
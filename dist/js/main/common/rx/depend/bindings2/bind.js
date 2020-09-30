"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getOneWayBinder = getOneWayBinder;
exports.getTwoWayBinder = getTwoWayBinder;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _CallState = require("../../../rx/depend/core/CallState");

var _depend = require("../../../rx/depend/core/depend");

var _Binder = require("../bindings/Binder");

var _currentState = require("../core/current-state");

// tslint:disable-next-line:no-shadowed-variable
var _propagateValue = (0, _depend.depend)( /*#__PURE__*/_regenerator.default.mark(function _propagateValue(source, getValue, dest, setValue) {
  var value;
  return _regenerator.default.wrap(function _propagateValue$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getValue(source);

        case 2:
          value = _context.sent;
          (0, _currentState.noSubscribe)(function () {
            return setValue(dest, value);
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _propagateValue);
})); // tslint:disable-next-line:no-shadowed-variable


var _getOneWayBinder = (0, _depend.depend)(function _getOneWayBinder(source, getValue, dest, setValue) {
  function bind() {
    return (0, _CallState.subscribeCallState)((0, _CallState.getOrCreateCallState)(_propagateValue)(source, getValue, dest, setValue));
  }

  return new _Binder.Binder(bind);
}); // tslint:disable-next-line:no-shadowed-variable


var _getTwoWayBinder = (0, _depend.depend)(function _getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2) {
  var binder1 = _getOneWayBinder(sourceDest1, getSetValue1.getValue, sourceDest2, getSetValue2.setValue);

  var binder2 = _getOneWayBinder(sourceDest2, getSetValue2.getValue, sourceDest1, getSetValue1.setValue);

  function bind() {
    var unbind1 = (0, _bind.default)(binder1).call(binder1);
    var unbind2 = (0, _bind.default)(binder2).call(binder2);
    return function () {
      unbind1();
      unbind2();
    };
  }

  return new _Binder.Binder(bind);
});

function getOneWayBinder(source, getValue, dest, setValue) {
  return _getOneWayBinder(source, getValue, dest, setValue);
}

function getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2) {
  return _getTwoWayBinder(sourceDest1, getSetValue1, sourceDest2, getSetValue2);
}
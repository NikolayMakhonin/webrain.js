"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getCurrentState = getCurrentState;
exports.setCurrentState = setCurrentState;
exports.noSubscribe = noSubscribe;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _helpers = require("../../../helpers/helpers");

var _marked = /*#__PURE__*/_regenerator.default.mark(_noSubscribeAsync);

var currentState = null;

function getCurrentState() {
  return currentState;
}

function setCurrentState(state) {
  currentState = state;
}

function _noSubscribeAsync(iterator) {
  var prevState;
  return _regenerator.default.wrap(function _noSubscribeAsync$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          prevState = getCurrentState();
          _context.prev = 1;
          setCurrentState(null);
          _context.next = 5;
          return iterator;

        case 5:
          return _context.abrupt("return", _context.sent);

        case 6:
          _context.prev = 6;
          setCurrentState(prevState);
          return _context.finish(6);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[1,, 6, 9]]);
}

function noSubscribe(func) {
  var prevState = getCurrentState();
  var result;

  try {
    setCurrentState(null);
    result = func();
  } finally {
    setCurrentState(prevState);
  }

  if ((0, _helpers.isIterator)(result)) {
    return _noSubscribeAsync(result);
  }
}
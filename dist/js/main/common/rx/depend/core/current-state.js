"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getCurrentState = getCurrentState;
exports.setCurrentState = setCurrentState;
exports.getForceLazy = getForceLazy;
exports.setForceLazy = setForceLazy;
exports.withMode = withMode;
exports.noSubscribe = noSubscribe;
exports.forceLazy = forceLazy;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _helpers = require("../../../helpers/helpers");

var _marked = /*#__PURE__*/_regenerator.default.mark(_withModeAsync);

// region currentState
var currentState = null;

function getCurrentState() {
  return currentState;
}

function setCurrentState(state) {
  currentState = state;
} // endregion
// region forceLazy


var _forceLazy = null;

function getForceLazy() {
  return _forceLazy;
}

function setForceLazy(value) {
  _forceLazy = value;
} // endregion
// region withMode


function _withModeAsync(noSubscribe, forceLazy, iterator) {
  var prevState, prevForceLazy;
  return _regenerator.default.wrap(function _withModeAsync$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          prevState = noSubscribe ? getCurrentState() : null;
          prevForceLazy = forceLazy != null ? getForceLazy() : null;
          _context.prev = 2;

          if (noSubscribe) {
            setCurrentState(null);
          }

          if (forceLazy != null) {
            setForceLazy(forceLazy);
          }

          _context.next = 7;
          return iterator;

        case 7:
          return _context.abrupt("return", _context.sent);

        case 8:
          _context.prev = 8;

          if (noSubscribe) {
            setCurrentState(prevState);
          }

          if (forceLazy != null) {
            setForceLazy(prevForceLazy);
          }

          return _context.finish(8);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[2,, 8, 12]]);
}

function withMode(noSubscribe, forceLazy, func) {
  var prevState = noSubscribe ? getCurrentState() : null;
  var prevForceLazy = forceLazy != null ? getForceLazy() : null;
  var result;

  try {
    if (noSubscribe) {
      setCurrentState(null);
    }

    if (forceLazy != null) {
      setForceLazy(forceLazy);
    }

    result = func();
  } finally {
    if (noSubscribe) {
      setCurrentState(prevState);
    }

    if (forceLazy != null) {
      setForceLazy(prevForceLazy);
    }
  }

  if ((0, _helpers.isIterator)(result)) {
    return _withModeAsync(noSubscribe, forceLazy, result);
  }

  return result;
} // endregion
// region noSubscribe


function noSubscribe(func) {
  return withMode(true, null, func);
} // endregion
// region forceLazy


function forceLazy(func) {
  return withMode(null, true, func);
} // endregion
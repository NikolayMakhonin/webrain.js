"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.interceptConsole = interceptConsole;
exports.throwOnConsoleError = throwOnConsoleError;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _marked = /*#__PURE__*/_regenerator.default.mark(throwOnConsoleError);

function interceptConsole(handler) {
  var _console = console;
  var orig_debug = _console.debug;
  var orig_info = _console.info;
  var orig_trace = _console.trace;
  var orig_log = _console.log;
  var orig_warn = _console.warn;
  var orig_error = _console.error;
  var orig_console = {
    debug: function debug() {
      return orig_debug.apply(_console, arguments);
    },
    info: function info() {
      return orig_info.apply(_console, arguments);
    },
    trace: function trace() {
      return orig_trace.apply(_console, arguments);
    },
    log: function log() {
      return orig_log.apply(_console, arguments);
    },
    warn: function warn() {
      return orig_warn.apply(_console, arguments);
    },
    error: function error() {
      return orig_error.apply(_console, arguments);
    }
  };

  function createHandler(type) {
    var orig_func = orig_console[type];
    var _this = {
      type: type,
      console: orig_console
    };
    return function () {
      var result = handler.apply(_this, arguments);

      if (result) {
        return;
      }

      orig_func.apply(orig_console, arguments);
    };
  }

  _console.debug = createHandler('debug');
  _console.info = createHandler('info');
  _console.trace = createHandler('trace');
  _console.log = createHandler('log');
  _console.warn = createHandler('warn');
  _console.error = createHandler('error');
  return function () {
    _console.debug = orig_debug;
    _console.info = orig_info;
    _console.trace = orig_trace;
    _console.log = orig_log;
    _console.warn = orig_warn;
    _console.error = orig_error;
  };
} // region throwOnConsoleError


function objectToString(o) {
  if (o instanceof Error) {
    return o.stack || o + '';
  }

  return o + '';
}

var lastConsoleError = null;

function throwOnConsoleError(_this, throwPredicate, func) {
  var dispose, result;
  return _regenerator.default.wrap(function throwOnConsoleError$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          lastConsoleError = null;
          dispose = interceptConsole(function () {
            if (throwPredicate.apply(this.type, arguments)) {
              var _context;

              var error = new Error("console." + this.type + "(" + (0, _map.default)(_context = (0, _from.default)(arguments)).call(_context, function (o) {
                return objectToString(o);
              }).join('\r\n') + ")");
              lastConsoleError = error;
              throw error;
            }
          });
          _context2.prev = 2;
          _context2.next = 5;
          return func.call(_this);

        case 5:
          result = _context2.sent;

          if (!lastConsoleError) {
            _context2.next = 8;
            break;
          }

          throw lastConsoleError;

        case 8:
          return _context2.abrupt("return", result);

        case 9:
          _context2.prev = 9;
          dispose();
          return _context2.finish(9);

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked, null, [[2,, 9, 12]]);
} // endregion
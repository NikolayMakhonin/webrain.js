"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.unhandledErrors = unhandledErrors;
exports.exit = exit;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _helpers = require("./helpers");

function browserUnhandledErrors(callback) {
  var _this = this;

  var errorHandler = function errorHandler() {
    var _context;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this.error.apply(_this, (0, _concat.default)(_context = ['unhandledrejection']).call(_context, (0, _map.default)(args).call(args, function (arg) {
      return arg instanceof PromiseRejectionEvent && arg.reason || arg;
    })));
  };

  if (typeof _helpers.globalScope !== 'undefined') {
    _helpers.globalScope.addEventListener('unhandledrejection', errorHandler);

    _helpers.globalScope.onunhandledrejection = errorHandler;

    _helpers.globalScope.onerror = function () {
      var _context2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      callback.apply(void 0, (0, _concat.default)(_context2 = ['unhandled error']).call(_context2, args));
    };
  }
}

function nodeUnhandledErrors(callback) {
  process.on('unhandledRejection', function () {
    var _context3;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    callback.apply(void 0, (0, _concat.default)(_context3 = ['process.unhandledRejection']).call(_context3, args));
  }).on('uncaughtException', function () {
    var _context4;

    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    callback.apply(void 0, (0, _concat.default)(_context4 = ['process.uncaughtException']).call(_context4, args));
  });
}

function interceptEval(callback) {
  var oldEval = _helpers.globalScope.eval;
  delete _helpers.globalScope.eval;

  _helpers.globalScope.eval = function (str) {
    if ((0, _indexOf.default)(str).call(str, 'async function') >= 0) {
      return oldEval.call(_helpers.globalScope, str);
    }

    try {
      return oldEval.call(_helpers.globalScope, str);
    } catch (ex) {
      callback('eval error', ex, str);
      throw ex;
    }
  };
}

var isBrowser = new Function('try {return this===window;}catch(e){ return false;}');

function isNode() {
  return !isBrowser();
}

function unhandledErrors(callback) {
  if (isNode()) {
    // is node
    nodeUnhandledErrors(callback);
  } else {
    // is browser
    browserUnhandledErrors(callback);
  }

  interceptEval(callback);
}

function exit() {
  if (isNode()) {
    process.exit(1);
  } else {
    window.close();
  }
}
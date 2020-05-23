"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports._initDeferredCallState = _initDeferredCallState;
exports.makeDeferredFunc = makeDeferredFunc;
exports._funcCall = _funcCall;
exports.depend = depend;
exports.funcCallX = funcCallX;
exports.dependX = dependX;

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _iterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _async = require("../../../async/async");

var _ThenableSync = require("../../../async/ThenableSync");

var _DeferredCalc = require("../../deferred-calc/DeferredCalc");

var _CallState = require("./CallState");

var _helpers = require("./helpers");

// region makeDeferredFunc
var SimpleThenable = /*#__PURE__*/function () {
  function SimpleThenable() {
    (0, _classCallCheck2.default)(this, SimpleThenable);
    this._subscribers = null;
    this._resolved = false;
  }

  (0, _createClass2.default)(SimpleThenable, [{
    key: "then",
    value: function then(done) {
      if (this._resolved) {
        done();
      } else {
        var _subscribers = this._subscribers;

        if (_subscribers == null) {
          this._subscribers = _subscribers = [];
        }

        _subscribers.push(done);
      }

      return null;
    }
  }, {
    key: "resolve",
    value: function resolve() {
      if (this._resolved) {
        throw new _helpers.InternalError('Multiple call resolve()');
      }

      this._resolved = true;
      var _subscribers = this._subscribers;

      if (_subscribers != null) {
        this._subscribers = null;

        for (var i = 0, len = _subscribers.length; i < len; i++) {
          _subscribers[i]();
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this._resolved = false;
      var _subscribers = this._subscribers;

      if (_subscribers != null && _subscribers.length > 0) {
        throw new _helpers.InternalError('reset when it has subscribers');
      }
    }
  }]);
  return SimpleThenable;
}();

function _initDeferredCallState(state, funcCall, deferredOptions) {
  var _iterator;

  var options = {
    delayBeforeCalc: deferredOptions.delayBeforeCalc,
    minTimeBetweenCalc: deferredOptions.minTimeBetweenCalc,
    autoInvalidateInterval: deferredOptions.autoInvalidateInterval,
    timing: null
  };
  state.deferredOptions = options;
  var thenable = new SimpleThenable();

  var _deferredCalc = new _DeferredCalc.DeferredCalc({
    shouldInvalidate: function shouldInvalidate() {
      state.invalidate();
    },
    calcCompletedCallback: function calcCompletedCallback() {
      thenable.resolve();
    },
    options: options,
    dontImmediateInvalidate: true
  });

  state._deferredCalc = _deferredCalc;
  var iteratorResult = {
    value: thenable,
    done: false
  };
  var stage = 2;
  var iterator = (_iterator = {
    next: function next() {
      switch (stage) {
        case 0:
          {
            stage = 1;
            thenable.reset();

            _deferredCalc.invalidate();

            iteratorResult.value = thenable;
            iteratorResult.done = false;
            return iteratorResult;
          }

        case 1:
          {
            stage = 2;
            var value = funcCall(state);

            if ((0, _async.isThenable)(value) && !(value instanceof _ThenableSync.ThenableSync)) {
              state._internalError('You should use iterator or ThenableSync instead Promise for async functions');
            }

            iteratorResult.value = value;
            iteratorResult.done = true;
            return iteratorResult;
          }

        default:
          throw new _helpers.InternalError('stage == ' + stage);
      }
    }
  }, _iterator[_iterator2.default] = function () {
    if (stage !== 2) {
      throw new _helpers.InternalError('stage == ' + stage);
    }

    stage = 0;
    return iterator;
  }, _iterator);
  state.funcCall = (0, _getIteratorMethod2.default)(iterator);
}
/** Inner this as CallState */


function makeDeferredFunc(func, funcCall, defaultOptions, initCallState) {
  return (0, _CallState.makeDependentFunc)(func, null, function (state) {
    _initDeferredCallState(state, funcCall, defaultOptions);

    if (initCallState != null) {
      initCallState(state);
    }
  });
} // endregion
// region depend / dependX


function _funcCall(state) {
  return state.callWithArgs(state._this, state.func);
}
/**
 * Inner this same as outer this
 * @param func
 * @param deferredOptions
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */


function depend(func, deferredOptions, initCallState, canAlwaysRecalc) {
  if (canAlwaysRecalc && deferredOptions != null) {
    throw new _helpers.InternalError('canAlwaysRecalc should not be deferred');
  }

  return deferredOptions == null ? (0, _CallState.makeDependentFunc)(func, _funcCall, initCallState, canAlwaysRecalc) : makeDeferredFunc(func, _funcCall, deferredOptions, initCallState);
}

function funcCallX(state) {
  return state.callWithArgs(state, state.func);
}
/**
 * Inner this as CallState
 * @param func
 * @param deferredOptions
 */


function dependX(func, deferredOptions, initCallState) {
  return deferredOptions == null ? (0, _CallState.makeDependentFunc)(func, funcCallX, initCallState, false) : makeDeferredFunc(func, funcCallX, deferredOptions, initCallState);
} // endregion
// region dependLazy
// export function dependLazy<
// 	TThis,
// 	TArgs extends any[],
// 	TResult,
// >(
// 	func: Func<
// 		TThis,
// 		TArgs,
// 		TResult
// 	>,
// ): Func<
// 	TThis,
// 	TArgs,
// 	TResult
// > {
// 	return function() {
// 		const state = getOrCreateCallState(func).apply(this, arguments)
// 		const value = state.getValue()
// 		if (!isThenable(value)) {
// 			return value
// 		}
//
// 		value
// 			.then(() => {
// 				state.
// 			})
// 	}
// }
// endregion
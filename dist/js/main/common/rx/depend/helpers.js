"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.dependWait = dependWait;
exports.autoCalc = autoCalc;
exports.autoCalcConnect = autoCalcConnect;
exports.dependWrapThis = dependWrapThis;

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _async = require("../../async/async");

var _ThenableSync = require("../../async/ThenableSync");

var _webrainOptions = require("../../helpers/webrainOptions");

var _helpers = require("../object/properties/helpers");

var _CallState = require("./core/CallState");

var _contracts = require("./core/contracts");

var _depend = require("./core/depend");

function simpleCondition(value) {
  return value != null;
}

function dependWait(func, condition, timeout, isLazy) {
  if (condition == null) {
    condition = simpleCondition;
  }

  if (timeout == null) {
    timeout = _webrainOptions.webrainOptions.timeouts.dependWait;
  }

  return (0, _depend.dependX)(function () {
    var state = this;
    var funcState = (0, _CallState.getOrCreateCallState)(func).apply(state._this, arguments);
    var value = funcState.getValue(isLazy);

    if (!(0, _async.isThenable)(value) && condition(value)) {
      return value;
    }

    return new _ThenableSync.ThenableSync(function (resolve, reject) {
      var unsubscribe = funcState.subscribe(function () {
        if (unsubscribe == null) {
          return;
        }

        switch (funcState.statusShort) {
          case _contracts.CallStatusShort.CalculatedValue:
            if (condition(funcState.value)) {
              unsubscribe();
              unsubscribe = null;
              resolve(funcState.value);
            }

            break;

          case _contracts.CallStatusShort.CalculatedError:
            unsubscribe();
            unsubscribe = null;
            reject(funcState.error);
            break;

          case _contracts.CallStatusShort.Invalidated:
            funcState.getValue(false, true);
            break;
        }
      });

      if (timeout != null && timeout > 0) {
        (0, _setTimeout2.default)(function () {
          if (unsubscribe == null) {
            return;
          }

          unsubscribe();
          unsubscribe = null;
          reject(new Error('Timeout error'));
        }, timeout);
      }
    });
  });
}

function autoCalc(func, dontLogErrors) {
  return function () {
    return (0, _CallState.subscribeCallState)((0, _CallState.getOrCreateCallState)(func).apply(this, arguments), dontLogErrors ? null : function (state) {
      if (state.statusShort === _contracts.CallStatusShort.CalculatedError) {
        console.error(state.error);
      }
    });
  };
}

function autoCalcConnect(object, connectorFactory, func, dontLogErrors) {
  return autoCalc((0, _CallState.dependBindThis)((0, _helpers.createConnector)(object, connectorFactory), func), dontLogErrors);
}

function dependWrapThis(wrapThis, func) {
  return function (_this) {
    return (0, _CallState.dependBindThis)(wrapThis(_this), func);
  };
}
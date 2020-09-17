"use strict";

exports.__esModule = true;
exports.deepSubscriber = deepSubscriber;

var _ThenableSync = require("../../../../async/ThenableSync");

var _CallState = require("../../../../rx/depend/core/CallState");

var _depend = require("../../../../rx/depend/core/depend");

var _contracts = require("../../../depend/core/contracts");

var _RuleBuilder = require("./builder/RuleBuilder");

var _rulesSubscribe = require("./builder/rules-subscribe");

var _forEachRule = require("./forEachRule");

var _resolve = require("./resolve");

var dependForEachRule = (0, _depend.depend)(function (rule, emitLastValue) {
  var _this = this;

  return (0, _ThenableSync.resolveAsync)(new _ThenableSync.ThenableSync(function (resolve, reject) {
    var rejected = false;
    var lastValue;
    var asyncCount = 1;
    (0, _forEachRule.forEachRule)(rule, _this, function (value) {
      lastValue = value;
    }, null, null, null, function (subRule, object, next) {
      if (rejected) {
        return;
      }

      asyncCount++;
      (0, _ThenableSync.resolveAsync)(object, function (o) {
        if (rejected) {
          return;
        }

        subRule.subscribe(o, next);
        asyncCount--;

        if (asyncCount < 0) {
          throw new Error("asyncCount == " + asyncCount);
        }

        if (asyncCount === 0) {
          resolve(lastValue);
        }
      }, function (err) {
        if (rejected) {
          return;
        }

        rejected = true;
        reject(err);
      }, null, subRule.subType === _rulesSubscribe.SubscribeObjectType.ValueProperty ? null : _resolve.resolveValueProperty);
    });
    asyncCount--;

    if (asyncCount < 0) {
      throw new Error("asyncCount == " + asyncCount);
    }

    if (!rejected && asyncCount === 0) {
      resolve(lastValue);
    }
  }), emitLastValue ? null : function () {
    return _CallState.ALWAYS_CHANGE_VALUE;
  }, null, null, _resolve.resolveValueProperty);
});

function deepSubscriber(_ref) {
  var object = _ref.object,
      rule = _ref.rule,
      build = _ref.build,
      subscriber = _ref.subscriber,
      emitLastValue = _ref.emitLastValue;

  if (rule == null) {
    rule = build(new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    })).result();
  }

  return function subscribe(_object, _subscriber) {
    if (!_subscriber) {
      _subscriber = subscriber;
    }

    return (0, _CallState.subscribeCallState)((0, _CallState.getOrCreateCallState)(dependForEachRule).call(_object || object, rule, emitLastValue), function (state) {
      if (state.statusShort === _contracts.CallStatusShort.CalculatedError) {
        console.error(state.error);
      }

      _subscriber(state);
    });
  };
}
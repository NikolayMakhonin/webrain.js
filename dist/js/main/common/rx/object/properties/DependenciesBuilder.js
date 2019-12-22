"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.subscribeDependencies = subscribeDependencies;
exports.dependenciesSubscriber = dependenciesSubscriber;
exports.DependenciesBuilder = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _webrainOptions = require("../../../helpers/webrainOptions");

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _PropertiesPath = require("../../deep-subscribe/helpers/PropertiesPath");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var DependenciesBuilder =
/*#__PURE__*/
function () {
  function DependenciesBuilder(buildSourceRule) {
    (0, _classCallCheck2.default)(this, DependenciesBuilder);
    this.dependencies = [];
    this.buildSourceRule = buildSourceRule;
  }

  (0, _createClass2.default)(DependenciesBuilder, [{
    key: "actionOn",
    value: function actionOn(buildRule, action, predicate) {
      var buildSourceRule = this.buildSourceRule;
      var ruleBuilder = new _RuleBuilder.RuleBuilder();

      if (buildSourceRule) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result();

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      this.dependencies.push([ruleBase, predicate ? function (target, value, parent, key, keyType, propertiesPath, rule) {
        // prevent circular self dependency
        if (target === parent) {
          return;
        }

        if (predicate(value, parent, key, keyType, propertiesPath, rule)) {
          action(target, value, parent, key, keyType, propertiesPath, rule);
        }
      } : action]);
      return this;
    }
  }]);
  return DependenciesBuilder;
}();

exports.DependenciesBuilder = DependenciesBuilder;

function subscribeDependencies(subscribeObject, actionTarget, dependencies, states) {
  var unsubscribers = [];

  var _loop = function _loop(i, len) {
    var _dependencies$i = dependencies[i],
        _rule = _dependencies$i[0],
        action = _dependencies$i[1];
    var subscribed = void 0;
    var state = states && states[i];
    var subscribeState = state && state[i] && {};
    var unsubscribeState = void 0;
    var unsubscribe = (0, _deepSubscribe.deepSubscribeRule)({
      object: subscribeObject,
      changeValue: function changeValue(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule) {
        if (!subscribed && state) {
          var newPropertiesPath = new _PropertiesPath.PropertiesPath(newValue, propertiesPath, key, keyType, rule);
          var id = newPropertiesPath.id;

          if (Object.prototype.hasOwnProperty.call(state, id)) {
            if (!subscribeState) {
              var _subscribeState;

              subscribeState = (_subscribeState = {}, _subscribeState[id] = true, _subscribeState);
            } else if (typeof newValue === 'undefined' && subscribeState[id]) {
              return;
            } else {
              subscribeState[id] = true;
            }

            var stateValue = state[id].value;

            if (_webrainOptions.webrainOptions.equalsFunc(stateValue, newValue)) {
              return;
            } // action(actionTarget, stateValue, parent, key, keyType, propertiesPath, rule)

          }
        }

        if (unsubscribeState) {
          var _newPropertiesPath = new _PropertiesPath.PropertiesPath(oldValue, propertiesPath, key, keyType, rule);

          var _id = _newPropertiesPath.id;
          unsubscribeState[_id] = _newPropertiesPath;
        } else {
          action(actionTarget, newValue, parent, key, keyType, propertiesPath, rule);
        }
      },
      rule: _rule.clone(),
      debugTarget: actionTarget
    });
    unsubscribers.push(unsubscribe && function () {
      unsubscribeState = {};
      unsubscribe();
      return unsubscribeState;
    });

    if (state) {
      for (var id in state) {
        if (Object.prototype.hasOwnProperty.call(state, id) && (!subscribeState || !Object.prototype.hasOwnProperty.call(subscribeState, id))) {
          var _propertiesPath = state[id];
          action(actionTarget, void 0, _propertiesPath.parent && _propertiesPath.parent.value, _propertiesPath.key, _propertiesPath.keyType, _propertiesPath.parent, _propertiesPath.rule);
          break;
        }
      }
    } else {
      state = null;
    }

    subscribed = true;
  };

  for (var i = 0, len = dependencies.length; i < len; i++) {
    _loop(i, len);
  }

  return function () {
    if (unsubscribers) {
      var _unsubscribers = unsubscribers;
      unsubscribers = null;
      return (0, _map.default)(_unsubscribers).call(_unsubscribers, function (o) {
        return o && o();
      });
    }
  };
}

function dependenciesSubscriber(buildRule, action, predicate) {
  var _actionOn = new DependenciesBuilder().actionOn(buildRule, action, predicate),
      dependencies = _actionOn.dependencies;

  return function (source, target) {
    return subscribeDependencies(source, target, dependencies);
  };
}
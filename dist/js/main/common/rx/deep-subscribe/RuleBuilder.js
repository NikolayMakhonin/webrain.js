"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.RuleBuilder = void 0;

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _construct2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/construct"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _valueProperty = require("../../helpers/value-property");

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _funcPropertiesPath = require("./helpers/func-properties-path");

var _rules2 = require("./rules");

var _rulesSubscribe = require("./rules-subscribe");

var RuleSubscribeObjectPropertyNames = (0, _bind.default)(_rulesSubscribe.RuleSubscribeObject).call(_rulesSubscribe.RuleSubscribeObject, null, _rulesSubscribe.SubscribeObjectType.Property, null);
var RuleSubscribeObjectValuePropertyNames = (0, _bind.default)(_rulesSubscribe.RuleSubscribeObject).call(_rulesSubscribe.RuleSubscribeObject, null, _rulesSubscribe.SubscribeObjectType.ValueProperty, null);
var RuleSubscribeMapKeys = (0, _bind.default)(_rulesSubscribe.RuleSubscribeMap).call(_rulesSubscribe.RuleSubscribeMap, null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        rule = _ref.rule,
        _ref$valuePropertyDef = _ref.valuePropertyDefaultName,
        valuePropertyDefaultName = _ref$valuePropertyDef === void 0 ? _valueProperty.VALUE_PROPERTY_DEFAULT : _ref$valuePropertyDef,
        _ref$autoInsertValueP = _ref.autoInsertValuePropertyDefault,
        autoInsertValuePropertyDefault = _ref$autoInsertValueP === void 0 ? true : _ref$autoInsertValueP;

    (0, _classCallCheck2.default)(this, RuleBuilder);
    this.valuePropertyDefaultName = valuePropertyDefaultName;
    this.autoInsertValuePropertyDefault = autoInsertValuePropertyDefault;

    if (rule != null) {
      this.ruleFirst = rule;
      var ruleLast;

      do {
        ruleLast = rule;
        rule = rule.next;
      } while (rule != null);

      this.ruleLast = ruleLast;
    }
  }

  (0, _createClass2.default)(RuleBuilder, [{
    key: "noAutoRules",
    value: function noAutoRules() {
      this.autoInsertValuePropertyDefault = false;
      return this;
    }
  }, {
    key: "result",
    value: function result() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleFirst;
    }
  }, {
    key: "valuePropertyDefault",
    value: function valuePropertyDefault() {
      var _context,
          _this = this;

      return (0, _repeat.default)(_context = this).call(_context, 0, 10, function (o) {
        return (0, _rulesSubscribe.hasDefaultProperty)(o) ? _rules.RuleRepeatAction.Next : _rules.RuleRepeatAction.Fork;
      }, function (b) {
        return b.ruleSubscribe(_this.valuePropertyDefaultName === _valueProperty.VALUE_PROPERTY_DEFAULT ? new RuleSubscribeObjectPropertyNames(_constants.VALUE_PROPERTY_PREFIX, _valueProperty.VALUE_PROPERTY_DEFAULT) : new RuleSubscribeObjectValuePropertyNames(_constants.VALUE_PROPERTY_PREFIX + _this.valuePropertyDefaultName, _this.valuePropertyDefaultName));
      });
    }
  }, {
    key: "rule",
    value: function rule(_rule) {
      var ruleLast = this.ruleLast;

      if (ruleLast) {
        ruleLast.next = _rule;
      } else {
        this.ruleFirst = _rule;
      }

      this.ruleLast = _rule;
      return this;
    }
  }, {
    key: "ruleSubscribe",
    value: function ruleSubscribe(_ruleSubscribe) {
      if (_ruleSubscribe.unsubscribers) {
        throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.');
      }

      _ruleSubscribe.unsubscribers = [];
      _ruleSubscribe.unsubscribersCount = [];
      return this.rule(_ruleSubscribe);
    }
  }, {
    key: "nothing",
    value: function nothing() {
      return this.rule(new _rules2.RuleNothing());
    }
  }, {
    key: "never",
    value: function never() {
      return this.rule(_rules2.RuleNever.instance);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "valuePropertyName",
    value: function valuePropertyName(propertyName) {
      return this.if([function (o) {
        return typeof o === 'undefined';
      }, function (b) {
        return b.never();
      }], [function (o) {
        return o instanceof Object && o.constructor !== Object && !(0, _isArray2.default)(o);
      }, function (b) {
        return b.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(_constants.VALUE_PROPERTY_PREFIX + propertyName, propertyName));
      }]);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "valuePropertyNames",
    value: function valuePropertyNames() {
      for (var _len = arguments.length, propertiesNames = new Array(_len), _key = 0; _key < _len; _key++) {
        propertiesNames[_key] = arguments[_key];
      }

      return this.if([function (o) {
        return typeof o === 'undefined';
      }, function (b) {
        return b.never();
      }], [function (o) {
        return o instanceof Object && o.constructor !== Object && !(0, _isArray2.default)(o);
      }, function (b) {
        var _context2;

        return b.ruleSubscribe((0, _construct2.default)(RuleSubscribeObjectValuePropertyNames, (0, _concat.default)(_context2 = [_constants.VALUE_PROPERTY_PREFIX + propertiesNames.join('|')]).call(_context2, propertiesNames)));
      }]);
    }
    /**
     * valuePropertyNames - Object property, Array index
     */

  }, {
    key: "v",
    value: function v() {
      return this.valuePropertyNames.apply(this, arguments);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyName",
    value: function (_propertyName) {
      function propertyName(_x) {
        return _propertyName.apply(this, arguments);
      }

      propertyName.toString = function () {
        return _propertyName.toString();
      };

      return propertyName;
    }(function (propertyName) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(propertyName, propertyName));
    })
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyNames",
    value: function propertyNames() {
      var _context3;

      for (var _len2 = arguments.length, propertiesNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        propertiesNames[_key2] = arguments[_key2];
      }

      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe((0, _construct2.default)(RuleSubscribeObjectPropertyNames, (0, _concat.default)(_context3 = [propertiesNames.join('|')]).call(_context3, propertiesNames)));
    }
    /**
     * propertyNames
     * @param propertiesNames
     */

  }, {
    key: "p",
    value: function p() {
      for (var _len3 = arguments.length, propertiesNames = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        propertiesNames[_key3] = arguments[_key3];
      }

      return this.propertyNames.apply(this, propertiesNames);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyAny",
    value: function propertyAny() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(_constants.ANY_DISPLAY));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(predicate, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new _rulesSubscribe.RuleSubscribeObject(_rulesSubscribe.SubscribeObjectType.Property, predicate, description));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyRegexp",
    value: function propertyRegexp(regexp) {
      if (!(regexp instanceof RegExp)) {
        throw new Error("regexp (" + regexp + ") is not instance of RegExp");
      }

      return this.propertyPredicate(function (name) {
        return regexp.test(name);
      }, regexp.toString());
    }
    /**
     * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
     */

  }, {
    key: "collection",
    value: function collection() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new _rulesSubscribe.RuleSubscribeCollection(_constants.COLLECTION_PREFIX));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKey",
    value: function mapKey(key) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMapKeys(_constants.COLLECTION_PREFIX + key, key));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKeys",
    value: function mapKeys() {
      var _context4;

      for (var _len4 = arguments.length, keys = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        keys[_key4] = arguments[_key4];
      }

      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe((0, _construct2.default)(RuleSubscribeMapKeys, (0, _concat.default)(_context4 = [_constants.COLLECTION_PREFIX + keys.join('|')]).call(_context4, keys)));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapAny",
    value: function mapAny() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(null, _constants.COLLECTION_PREFIX));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapPredicate",
    value: function mapPredicate(keyPredicate, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(keyPredicate, description));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapRegexp",
    value: function mapRegexp(keyRegexp) {
      if (!(keyRegexp instanceof RegExp)) {
        throw new Error("keyRegexp (" + keyRegexp + ") is not instance of RegExp");
      }

      return this.mapPredicate(function (name) {
        return keyRegexp.test(name);
      }, keyRegexp.toString());
    }
    /**
     * @deprecated because babel transform object.map property to unparseable code
     */

  }, {
    key: "path",
    value: function path(getValueFunc) // public path<TValue>(getValueFunc: RuleGetValueFunc<TObject, TValue, TValueKeys>)
    // 	: RuleBuilder<TRulePathObjectValueOf<TValue>, TValueKeys>
    {
      for (var _iterator = (0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc), _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var _propertyNames = _ref2;

        if ((0, _startsWith.default)(_propertyNames).call(_propertyNames, _constants.COLLECTION_PREFIX)) {
          var keys = _propertyNames.substring(1);

          if (keys === '') {
            this.collection();
          } else {
            this.mapKeys.apply(this, keys.split('|'));
          }
        } else if ((0, _startsWith.default)(_propertyNames).call(_propertyNames, _constants.VALUE_PROPERTY_PREFIX)) {
          var valuePropertyNames = _propertyNames.substring(1);

          if (valuePropertyNames === '') {
            throw new Error("You should specify at least one value property name; path = " + getValueFunc);
          } else {
            this.valuePropertyNames.apply(this, valuePropertyNames.split('|'));
          }
        } else {
          this.propertyNames.apply(this, _propertyNames.split('|'));
        }
      }

      return this;
    }
  }, {
    key: "if",
    value: function _if() {
      var _this2 = this;

      for (var _len5 = arguments.length, exclusiveConditionRules = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        exclusiveConditionRules[_key5] = arguments[_key5];
      }

      if (exclusiveConditionRules.length === 0) {
        throw new Error('if() parameters is empty');
      }

      var rule = new _rules2.RuleIf((0, _map.default)(exclusiveConditionRules).call(exclusiveConditionRules, function (o) {
        if ((0, _isArray2.default)(o)) {
          return [o[0], o[1](_this2.clone(true)).ruleFirst];
        } else {
          return o(_this2.clone(true)).ruleFirst;
        }
      }));
      return this.rule(rule);
    }
  }, {
    key: "any",
    value: function any() {
      var _this3 = this;

      for (var _len6 = arguments.length, getChilds = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        getChilds[_key6] = arguments[_key6];
      }

      if (getChilds.length === 0) {
        throw new Error('any() parameters is empty');
      }

      var rule = new _rules2.RuleAny((0, _map.default)(getChilds).call(getChilds, function (o) {
        var subRule = o(_this3.clone(true)).result();

        if (!subRule) {
          throw new Error("Any subRule=" + rule);
        }

        return subRule;
      }));
      return this.rule(rule);
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, condition, getChild) {
      var subRule = getChild(this.clone(true)).ruleFirst;

      if (!subRule) {
        throw new Error("getChild(...).rule = " + subRule);
      }

      if (countMax == null) {
        countMax = _maxSafeInteger.default;
      }

      if (countMin == null) {
        countMin = 0;
      } // if (countMax < countMin || countMax <= 0) {
      // 	return this as unknown as RuleBuilder<TValue, TValueKeys>
      // }


      var rule;

      if (countMax === countMin && countMax === 1 && !condition) {
        rule = subRule;
      } else {
        rule = new _rules2.RuleRepeat(countMin, countMax, condition, getChild(this.clone(true)).ruleFirst);
      }

      return this.rule(rule);
    }
  }, {
    key: "clone",
    value: function clone(optionsOnly) {
      return new RuleBuilder({
        rule: optionsOnly || !this.ruleFirst ? null : this.ruleFirst.clone(),
        valuePropertyDefaultName: this.valuePropertyDefaultName,
        autoInsertValuePropertyDefault: this.autoInsertValuePropertyDefault
      });
    }
  }]);
  return RuleBuilder;
}(); // Test:
// interface ITestInterface1 {
// 	y: number
// }
//
// interface ITestInterface2 {
// 	x: ITestInterface1
// }
//
// export const test = new RuleBuilder<ITestInterface2>()
// 	.path(o => o.x)


exports.RuleBuilder = RuleBuilder;
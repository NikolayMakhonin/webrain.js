"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.RuleBuilder = void 0;

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _valueProperty = require("../../../../../helpers/value-property");

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _rules2 = require("./rules");

var _rulesSubscribe = require("./rules-subscribe");

var RuleBuilder = /*#__PURE__*/function () {
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
    key: "changeValuePropertyDefault",
    value: function changeValuePropertyDefault(propertyName) {
      this.valuePropertyDefaultName = propertyName;
      return this;
    }
  }, {
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
        return _this.valuePropertyDefaultName === _valueProperty.VALUE_PROPERTY_DEFAULT ? b.func((0, _rulesSubscribe.createSubscribeObject)(_rulesSubscribe.SubscribeObjectType.ValueProperty, null, _valueProperty.VALUE_PROPERTY_DEFAULT), _rulesSubscribe.SubscribeObjectType.ValueProperty, _constants.VALUE_PROPERTY_PREFIX) : b.func((0, _rulesSubscribe.createSubscribeObject)(_rulesSubscribe.SubscribeObjectType.ValueProperty, null, _this.valuePropertyDefaultName), _rulesSubscribe.SubscribeObjectType.ValueProperty, _constants.VALUE_PROPERTY_PREFIX + _this.valuePropertyDefaultName);
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
     * Custom func
     */

  }, {
    key: "func",
    value: function func(subscribe, subType, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new _rulesSubscribe.RuleSubscribe(subscribe, subType, description));
    }
    /**
     * Custom func
     */

  }, {
    key: "f",
    value: function f(subscribe, subType, description) {
      return this.func(subscribe, subType, description);
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
        return o instanceof Object && o.constructor !== Object && !(0, _isArray.default)(o);
      }, function (b) {
        return b.func((0, _rulesSubscribe.createSubscribeObject)(_rulesSubscribe.SubscribeObjectType.ValueProperty, null, propertyName), _rulesSubscribe.SubscribeObjectType.ValueProperty, _constants.VALUE_PROPERTY_PREFIX + propertyName);
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
        return o instanceof Object && o.constructor !== Object && !(0, _isArray.default)(o);
      }, function (b) {
        var _context2;

        return b.func(_rulesSubscribe.createSubscribeObject.apply(void 0, (0, _concat.default)(_context2 = [_rulesSubscribe.SubscribeObjectType.ValueProperty, null]).call(_context2, propertiesNames)), _rulesSubscribe.SubscribeObjectType.ValueProperty, _constants.VALUE_PROPERTY_PREFIX + propertiesNames.join('|'));
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
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func((0, _rulesSubscribe.createSubscribeObject)(_rulesSubscribe.SubscribeObjectType.Property, null, propertyName), _rulesSubscribe.SubscribeObjectType.Property, propertyName);
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

      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(_rulesSubscribe.createSubscribeObject.apply(void 0, (0, _concat.default)(_context3 = [_rulesSubscribe.SubscribeObjectType.Property, null]).call(_context3, propertiesNames)), _rulesSubscribe.SubscribeObjectType.Property, propertiesNames.join('|'));
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
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func((0, _rulesSubscribe.createSubscribeObject)(_rulesSubscribe.SubscribeObjectType.Property, null), _rulesSubscribe.SubscribeObjectType.Property, _constants.ANY_DISPLAY);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(predicate, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func((0, _rulesSubscribe.createSubscribeObject)(_rulesSubscribe.SubscribeObjectType.Property, predicate), _rulesSubscribe.SubscribeObjectType.Property, description);
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
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(_rulesSubscribe.subscribeCollection, _rulesSubscribe.SubscribeObjectType.Property, _constants.COLLECTION_PREFIX);
    }
  }, {
    key: "change",
    value: function change() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(_rulesSubscribe.subscribeChange, _rulesSubscribe.SubscribeObjectType.Property, _constants.CHANGE_COUNT_PREFIX);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKey",
    value: function mapKey(key) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func((0, _rulesSubscribe.createSubscribeMap)(null, key), _rulesSubscribe.SubscribeObjectType.Property, _constants.COLLECTION_PREFIX + key);
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

      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(_rulesSubscribe.createSubscribeMap.apply(void 0, (0, _concat.default)(_context4 = [null]).call(_context4, keys)), _rulesSubscribe.SubscribeObjectType.Property, _constants.COLLECTION_PREFIX + keys.join('|'));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapAny",
    value: function mapAny() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func((0, _rulesSubscribe.createSubscribeMap)(null), _rulesSubscribe.SubscribeObjectType.Property, _constants.COLLECTION_PREFIX);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapPredicate",
    value: function mapPredicate(keyPredicate, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func((0, _rulesSubscribe.createSubscribeMap)(keyPredicate), _rulesSubscribe.SubscribeObjectType.Property, description);
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
        if ((0, _isArray.default)(o)) {
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
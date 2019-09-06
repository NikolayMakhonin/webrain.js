"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.cloneRule = cloneRule;
exports.RuleBuilder = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _construct2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/construct"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _valueProperty = require("../../helpers/value-property");

var _constants = require("./contracts/constants");

var _funcPropertiesPath = require("./helpers/func-properties-path");

var _rules = require("./rules");

var _rulesSubscribe = require("./rules-subscribe");

var RuleSubscribeObjectPropertyNames = (0, _bind.default)(_rulesSubscribe.RuleSubscribeObject).call(_rulesSubscribe.RuleSubscribeObject, null, _rulesSubscribe.SubscribeObjectType.Property, null);
var RuleSubscribeObjectValuePropertyNames = (0, _bind.default)(_rulesSubscribe.RuleSubscribeObject).call(_rulesSubscribe.RuleSubscribeObject, null, _rulesSubscribe.SubscribeObjectType.ValueProperty, null);
var RuleSubscribeMapKeys = (0, _bind.default)(_rulesSubscribe.RuleSubscribeMap).call(_rulesSubscribe.RuleSubscribeMap, null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder(rule) {
    if (rule != null) {
      this.result = rule;
      var ruleLast;

      do {
        ruleLast = rule;
        rule = rule.next;
      } while (rule != null);

      this._ruleLast = ruleLast;
    }
  }

  var _proto = RuleBuilder.prototype;

  _proto.rule = function rule(_rule) {
    var ruleLast = this._ruleLast;

    if (ruleLast) {
      ruleLast.next = _rule;
    } else {
      this.result = _rule;
    }

    this._ruleLast = _rule;
    return this;
  };

  _proto.ruleSubscribe = function ruleSubscribe(_ruleSubscribe, description) {
    if (description) {
      _ruleSubscribe.description = description;
    }

    if (_ruleSubscribe.unsubscribers) {
      throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.');
    } // !Warning defineProperty is slow
    // Object.defineProperty(ruleSubscribe, 'unsubscribePropertyName', {
    // 	configurable: true,
    // 	enumerable: false,
    // 	writable: false,
    // 	value: UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++),
    // })


    _ruleSubscribe.unsubscribers = []; // UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++)

    return this.rule(_ruleSubscribe);
  };

  _proto.nothing = function nothing() {
    return this.rule(new _rules.RuleNothing());
  }
  /**
   * Object property, Array index
   */
  ;

  _proto.valuePropertyName = function valuePropertyName(propertyName) {
    return this.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(propertyName), _constants.VALUE_PROPERTY_PREFIX + propertyName);
  }
  /**
   * Object property, Array index
   */
  ;

  _proto.valuePropertyNames = function valuePropertyNames() {
    for (var _len = arguments.length, propertiesNames = new Array(_len), _key = 0; _key < _len; _key++) {
      propertiesNames[_key] = arguments[_key];
    }

    return this.ruleSubscribe((0, _construct2.default)(RuleSubscribeObjectValuePropertyNames, propertiesNames), _constants.VALUE_PROPERTY_PREFIX + propertiesNames.join('|'));
  }
  /**
   * Object property, Array index
   */
  ;

  _proto.propertyName = function (_propertyName) {
    function propertyName(_x) {
      return _propertyName.apply(this, arguments);
    }

    propertyName.toString = function () {
      return _propertyName.toString();
    };

    return propertyName;
  }(function (propertyName) {
    return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(propertyName), propertyName);
  }
  /**
   * Object property, Array index
   */
  );

  _proto.propertyNames = function propertyNames() {
    for (var _len2 = arguments.length, propertiesNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      propertiesNames[_key2] = arguments[_key2];
    }

    return this.ruleSubscribe((0, _construct2.default)(RuleSubscribeObjectPropertyNames, propertiesNames), propertiesNames.join('|'));
  }
  /**
   * Object property, Array index
   */
  ;

  _proto.propertyAll = function propertyAll() {
    return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(), _constants.ANY_DISPLAY);
  }
  /**
   * Object property, Array index
   */
  ;

  _proto.propertyPredicate = function propertyPredicate(predicate, description) {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeObject(_rulesSubscribe.SubscribeObjectType.Property, predicate), description);
  }
  /**
   * Object property, Array index
   */
  ;

  _proto.propertyRegexp = function propertyRegexp(regexp) {
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
  ;

  _proto.collection = function collection() {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeCollection(), _constants.COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */
  ;

  _proto.mapKey = function mapKey(key) {
    return this.ruleSubscribe(new RuleSubscribeMapKeys(key), _constants.COLLECTION_PREFIX + key);
  }
  /**
   * IMapChanged & Map, Map
   */
  ;

  _proto.mapKeys = function mapKeys() {
    for (var _len3 = arguments.length, keys = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      keys[_key3] = arguments[_key3];
    }

    return this.ruleSubscribe((0, _construct2.default)(RuleSubscribeMapKeys, keys), _constants.COLLECTION_PREFIX + keys.join('|'));
  }
  /**
   * IMapChanged & Map, Map
   */
  ;

  _proto.mapAll = function mapAll() {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(), _constants.COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */
  ;

  _proto.mapPredicate = function mapPredicate(keyPredicate, description) {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(keyPredicate), description);
  }
  /**
   * IMapChanged & Map, Map
   */
  ;

  _proto.mapRegexp = function mapRegexp(keyRegexp) {
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
  ;

  _proto.path = function path(getValueFunc) {
    for (var _iterator = (0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc), _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _propertyNames = _ref;

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
  };

  _proto.any = function any() {
    for (var _len4 = arguments.length, getChilds = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      getChilds[_key4] = arguments[_key4];
    }

    if (getChilds.length === 0) {
      throw new Error('any() parameters is empty');
    }

    var rule = new _rules.RuleAny((0, _map.default)(getChilds).call(getChilds, function (o) {
      var subRule = o(new RuleBuilder()).result;

      if (!subRule) {
        throw new Error("Any subRule=" + rule);
      }

      return subRule;
    }));
    return this.rule(rule);
  };

  _proto.repeat = function repeat(countMin, countMax, getChild) {
    var subRule = getChild(new RuleBuilder()).result;

    if (!subRule) {
      throw new Error("getChild(...).rule = " + subRule);
    }

    if (countMax == null) {
      countMax = _maxSafeInteger.default;
    }

    if (countMin == null) {
      countMin = 0;
    }

    if (countMax < countMin || countMax <= 0) {
      return this;
    }

    var rule;

    if (countMax === countMin && countMax === 1) {
      rule = subRule;
    } else {
      rule = new _rules.RuleRepeat(countMin, countMax, getChild(new RuleBuilder()).result);
    }

    return this.rule(rule);
  };

  _proto.clone = function clone() {
    return new RuleBuilder(cloneRule(this.result));
  };

  return RuleBuilder;
}();

exports.RuleBuilder = RuleBuilder;

function cloneRule(rule) {
  if (rule == null) {
    return rule;
  }

  var clone = (0, _extends2.default)({}, rule);
  var _ref2 = rule,
      unsubscribers = _ref2.unsubscribers,
      next = _ref2.next;

  if (unsubscribers != null) {
    clone.unsubscribers = [];
  }

  if (next != null) {
    clone.next = cloneRule(next);
  }

  return clone;
} // Test:
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
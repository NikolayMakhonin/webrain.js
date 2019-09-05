"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.cloneRule = cloneRule;
exports.RuleBuilder = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _construct2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _valueProperty = require("../../helpers/value-property");

var _constants = require("./contracts/constants");

var _funcPropertiesPath = require("./helpers/func-properties-path");

var _rules = require("./rules");

var _rulesSubscribe = require("./rules-subscribe");

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context; (0, _forEach.default)(_context = ownKeys(source, true)).call(_context, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context2; (0, _forEach.default)(_context2 = ownKeys(source)).call(_context2, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

var RuleSubscribeObjectPropertyNames = (0, _bind.default)(_rulesSubscribe.RuleSubscribeObject).call(_rulesSubscribe.RuleSubscribeObject, null, _rulesSubscribe.SubscribeObjectType.Property, null);
var RuleSubscribeObjectValuePropertyNames = (0, _bind.default)(_rulesSubscribe.RuleSubscribeObject).call(_rulesSubscribe.RuleSubscribeObject, null, _rulesSubscribe.SubscribeObjectType.ValueProperty, null);
var RuleSubscribeMapKeys = (0, _bind.default)(_rulesSubscribe.RuleSubscribeMap).call(_rulesSubscribe.RuleSubscribeMap, null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder(rule) {
    (0, _classCallCheck2.default)(this, RuleBuilder);

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

  (0, _createClass2.default)(RuleBuilder, [{
    key: "rule",
    value: function rule(_rule) {
      var ruleLast = this._ruleLast;

      if (ruleLast) {
        ruleLast.next = _rule;
      } else {
        this.result = _rule;
      }

      this._ruleLast = _rule;
      return this;
    }
  }, {
    key: "ruleSubscribe",
    value: function ruleSubscribe(_ruleSubscribe, description) {
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
    }
  }, {
    key: "nothing",
    value: function nothing() {
      return this.rule(new _rules.RuleNothing());
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "valuePropertyName",
    value: function valuePropertyName(propertyName) {
      return this.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(propertyName), _constants.VALUE_PROPERTY_PREFIX + propertyName);
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

      return this.ruleSubscribe((0, _construct2.default)(RuleSubscribeObjectValuePropertyNames, propertiesNames), _constants.VALUE_PROPERTY_PREFIX + propertiesNames.join('|'));
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
      return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(propertyName), propertyName);
    })
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyNames",
    value: function propertyNames() {
      for (var _len2 = arguments.length, propertiesNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        propertiesNames[_key2] = arguments[_key2];
      }

      return this.ruleSubscribe((0, _construct2.default)(RuleSubscribeObjectPropertyNames, propertiesNames), propertiesNames.join('|'));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyAll",
    value: function propertyAll() {
      return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(), _constants.ANY_DISPLAY);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(predicate, description) {
      return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeObject(_rulesSubscribe.SubscribeObjectType.Property, predicate), description);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyRegexp",
    value: function propertyRegexp(regexp) {
      if (!(regexp instanceof RegExp)) {
        throw new Error("regexp (".concat(regexp, ") is not instance of RegExp"));
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
      return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeCollection(), _constants.COLLECTION_PREFIX);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKey",
    value: function mapKey(key) {
      return this.ruleSubscribe(new RuleSubscribeMapKeys(key), _constants.COLLECTION_PREFIX + key);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKeys",
    value: function mapKeys() {
      for (var _len3 = arguments.length, keys = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        keys[_key3] = arguments[_key3];
      }

      return this.ruleSubscribe((0, _construct2.default)(RuleSubscribeMapKeys, keys), _constants.COLLECTION_PREFIX + keys.join('|'));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapAll",
    value: function mapAll() {
      return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(), _constants.COLLECTION_PREFIX);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapPredicate",
    value: function mapPredicate(keyPredicate, description) {
      return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(keyPredicate), description);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapRegexp",
    value: function mapRegexp(keyRegexp) {
      if (!(keyRegexp instanceof RegExp)) {
        throw new Error("keyRegexp (".concat(keyRegexp, ") is not instance of RegExp"));
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
    value: function path(getValueFunc) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)((0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _propertyNames = _step.value;

          if ((0, _startsWith.default)(_propertyNames).call(_propertyNames, _constants.COLLECTION_PREFIX)) {
            var keys = _propertyNames.substring(1);

            if (keys === '') {
              this.collection();
            } else {
              this.mapKeys.apply(this, (0, _toConsumableArray2.default)(keys.split('|')));
            }
          } else if ((0, _startsWith.default)(_propertyNames).call(_propertyNames, _constants.VALUE_PROPERTY_PREFIX)) {
            var valuePropertyNames = _propertyNames.substring(1);

            if (valuePropertyNames === '') {
              throw new Error("You should specify at least one value property name; path = ".concat(getValueFunc));
            } else {
              this.valuePropertyNames.apply(this, (0, _toConsumableArray2.default)(valuePropertyNames.split('|')));
            }
          } else {
            this.propertyNames.apply(this, (0, _toConsumableArray2.default)(_propertyNames.split('|')));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: "any",
    value: function any() {
      for (var _len4 = arguments.length, getChilds = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        getChilds[_key4] = arguments[_key4];
      }

      if (getChilds.length === 0) {
        throw new Error('any() parameters is empty');
      }

      var rule = new _rules.RuleAny((0, _map.default)(getChilds).call(getChilds, function (o) {
        var subRule = o(new RuleBuilder()).result;

        if (!subRule) {
          throw new Error("Any subRule=".concat(rule));
        }

        return subRule;
      }));
      return this.rule(rule);
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, getChild) {
      var subRule = getChild(new RuleBuilder()).result;

      if (!subRule) {
        throw new Error("getChild(...).rule = ".concat(subRule));
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
    }
  }, {
    key: "clone",
    value: function clone() {
      return new RuleBuilder(cloneRule(this.result));
    }
  }]);
  return RuleBuilder;
}();

exports.RuleBuilder = RuleBuilder;

function cloneRule(rule) {
  if (rule == null) {
    return rule;
  }

  var clone = _objectSpread({}, rule);

  var _ref = rule,
      unsubscribers = _ref.unsubscribers,
      next = _ref.next;

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
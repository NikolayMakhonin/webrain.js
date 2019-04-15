import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _construct from "@babel/runtime/helpers/construct";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { ANY_DISPLAY, COLLECTION_PREFIX } from './contracts/constants';
import { RuleType } from './contracts/rules';
import { getFuncPropertiesPath } from './helpers/func-properties-path';
import { RuleSubscribeCollection, RuleSubscribeMap, RuleSubscribeObject } from './RuleSubscribe';
var RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, null);
var RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null);
export var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder() {
    _classCallCheck(this, RuleBuilder);
  }

  _createClass(RuleBuilder, [{
    key: "custom",
    value: function custom(ruleSubscribe, description) {
      var ruleLast = this._ruleLast;

      if (description) {
        ruleSubscribe.description = description;
      }

      if (ruleLast) {
        ruleLast.next = ruleSubscribe;
      } else {
        this.rule = ruleSubscribe;
      }

      this._ruleLast = ruleSubscribe;
      return this;
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
      return this.custom(new RuleSubscribeObjectPropertyNames(propertyName), propertyName);
    })
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyNames",
    value: function propertyNames() {
      for (var _len = arguments.length, propertiesNames = new Array(_len), _key = 0; _key < _len; _key++) {
        propertiesNames[_key] = arguments[_key];
      }

      return this.custom(_construct(RuleSubscribeObjectPropertyNames, propertiesNames), propertiesNames.join('|'));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyAll",
    value: function propertyAll() {
      return this.custom(new RuleSubscribeObject(), ANY_DISPLAY);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(predicate, description) {
      return this.custom(new RuleSubscribeObject(predicate), description);
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
      return this.custom(new RuleSubscribeCollection(), COLLECTION_PREFIX);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKey",
    value: function mapKey(key) {
      return this.custom(new RuleSubscribeMapKeys(key), COLLECTION_PREFIX + key);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKeys",
    value: function mapKeys() {
      for (var _len2 = arguments.length, keys = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        keys[_key2] = arguments[_key2];
      }

      return this.custom(_construct(RuleSubscribeMapKeys, keys), COLLECTION_PREFIX + keys.join('|'));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapAll",
    value: function mapAll() {
      return this.custom(new RuleSubscribeMap(), COLLECTION_PREFIX);
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapPredicate",
    value: function mapPredicate(keyPredicate, description) {
      return this.custom(new RuleSubscribeMap(keyPredicate), description);
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
  }, {
    key: "path",
    value: function path(getValueFunc) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = getFuncPropertiesPath(getValueFunc)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var propertyNames = _step.value;

          if (!propertyNames.startsWith(COLLECTION_PREFIX)) {
            this.propertyNames.apply(this, _toConsumableArray(propertyNames.split('|')));
          } else {
            var keys = propertyNames.substring(1);

            if (keys === '') {
              this.collection();
            } else {
              this.mapKeys.apply(this, _toConsumableArray(keys.split('|')));
            }
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
      var ruleLast = this._ruleLast;

      for (var _len3 = arguments.length, getChilds = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        getChilds[_key3] = arguments[_key3];
      }

      var rule = {
        type: RuleType.Any,
        rules: getChilds.map(function (o) {
          return o(new RuleBuilder()).rule;
        })
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, getChild) {
      var ruleLast = this._ruleLast;
      var rule = {
        type: RuleType.Repeat,
        countMin: countMin,
        countMax: countMax,
        rule: getChild(new RuleBuilder()).rule
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      this._ruleLast = rule;
      return this;
    }
  }]);

  return RuleBuilder;
}();
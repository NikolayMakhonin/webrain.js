"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneRule = cloneRule;
exports.RuleBuilder = void 0;

var _helpers = require("../../helpers/helpers");

var _constants = require("./contracts/constants");

var _funcPropertiesPath = require("./helpers/func-properties-path");

var _rules = require("./rules");

var _rulesSubscribe = require("./rules-subscribe");

const RuleSubscribeObjectPropertyNames = _rulesSubscribe.RuleSubscribeObject.bind(null, _rulesSubscribe.SubscribeObjectType.Property, null);

const RuleSubscribeObjectValuePropertyNames = _rulesSubscribe.RuleSubscribeObject.bind(null, _rulesSubscribe.SubscribeObjectType.ValueProperty, null);

const RuleSubscribeMapKeys = _rulesSubscribe.RuleSubscribeMap.bind(null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0


class RuleBuilder {
  constructor(rule) {
    if (rule != null) {
      this.result = rule;
      let ruleLast;

      do {
        ruleLast = rule;
        rule = rule.next;
      } while (rule != null);

      this._ruleLast = ruleLast;
    }
  }

  rule(rule) {
    const {
      _ruleLast: ruleLast
    } = this;

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.result = rule;
    }

    this._ruleLast = rule;
    return this;
  }

  ruleSubscribe(ruleSubscribe, description) {
    if (description) {
      ruleSubscribe.description = description;
    }

    if (ruleSubscribe.unsubscribers) {
      throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.');
    } // !Warning defineProperty is slow
    // Object.defineProperty(ruleSubscribe, 'unsubscribePropertyName', {
    // 	configurable: true,
    // 	enumerable: false,
    // 	writable: false,
    // 	value: UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++),
    // })


    ruleSubscribe.unsubscribers = []; // UNSUBSCRIBE_PROPERTY_PREFIX + (nextUnsubscribePropertyId++)

    return this.rule(ruleSubscribe);
  }

  nothing() {
    return this.rule(new _rules.RuleNothing());
  }
  /**
   * Object property, Array index
   */


  valuePropertyName(propertyName) {
    return this.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(propertyName), _constants.VALUE_PROPERTY_PREFIX + propertyName);
  }
  /**
   * Object property, Array index
   */


  valuePropertyNames(...propertiesNames) {
    return this.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(...propertiesNames), _constants.VALUE_PROPERTY_PREFIX + propertiesNames.join('|'));
  }
  /**
   * Object property, Array index
   */


  propertyName(propertyName) {
    return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(propertyName), propertyName);
  }
  /**
   * Object property, Array index
   */


  propertyNames(...propertiesNames) {
    return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(...propertiesNames), propertiesNames.join('|'));
  }
  /**
   * Object property, Array index
   */


  propertyAll() {
    return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(), _constants.ANY_DISPLAY);
  }
  /**
   * Object property, Array index
   */


  propertyPredicate(predicate, description) {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeObject(_rulesSubscribe.SubscribeObjectType.Property, predicate), description);
  }
  /**
   * Object property, Array index
   */


  propertyRegexp(regexp) {
    if (!(regexp instanceof RegExp)) {
      throw new Error(`regexp (${regexp}) is not instance of RegExp`);
    }

    return this.propertyPredicate(name => regexp.test(name), regexp.toString());
  }
  /**
   * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
   */


  collection() {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeCollection(), _constants.COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKey(key) {
    return this.ruleSubscribe(new RuleSubscribeMapKeys(key), _constants.COLLECTION_PREFIX + key);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKeys(...keys) {
    return this.ruleSubscribe(new RuleSubscribeMapKeys(...keys), _constants.COLLECTION_PREFIX + keys.join('|'));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapAll() {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(), _constants.COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapPredicate(keyPredicate, description) {
    return this.ruleSubscribe(new _rulesSubscribe.RuleSubscribeMap(keyPredicate), description);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapRegexp(keyRegexp) {
    if (!(keyRegexp instanceof RegExp)) {
      throw new Error(`keyRegexp (${keyRegexp}) is not instance of RegExp`);
    }

    return this.mapPredicate(name => keyRegexp.test(name), keyRegexp.toString());
  }

  path(getValueFunc) {
    for (const propertyNames of (0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc)) {
      if (propertyNames.startsWith(_constants.COLLECTION_PREFIX)) {
        const keys = propertyNames.substring(1);

        if (keys === '') {
          this.collection();
        } else {
          this.mapKeys(...keys.split('|'));
        }
      } else if (propertyNames.startsWith(_constants.VALUE_PROPERTY_PREFIX)) {
        const valuePropertyNames = propertyNames.substring(1);

        if (valuePropertyNames === '') {
          throw new Error(`You should specify at least one value property name; path = ${getValueFunc}`);
        } else {
          this.valuePropertyNames(...valuePropertyNames.split('|'));
        }
      } else {
        this.propertyNames(...propertyNames.split('|'));
      }
    }

    return this;
  }

  any(...getChilds) {
    if (getChilds.length === 0) {
      throw new Error('any() parameters is empty');
    }

    const rule = new _rules.RuleAny(getChilds.map(o => {
      const subRule = o(new RuleBuilder()).result;

      if (!subRule) {
        throw new Error(`Any subRule=${rule}`);
      }

      return subRule;
    }));
    return this.rule(rule);
  }

  repeat(countMin, countMax, getChild) {
    const subRule = getChild(new RuleBuilder()).result;

    if (!subRule) {
      throw new Error(`getChild(...).rule = ${subRule}`);
    }

    if (countMax == null) {
      countMax = Number.MAX_SAFE_INTEGER;
    }

    if (countMin == null) {
      countMin = 0;
    }

    if (countMax < countMin || countMax <= 0) {
      return this;
    }

    let rule;

    if (countMax === countMin && countMax === 1) {
      rule = subRule;
    } else {
      rule = new _rules.RuleRepeat(countMin, countMax, getChild(new RuleBuilder()).result);
    }

    return this.rule(rule);
  }

  clone() {
    return new RuleBuilder(cloneRule(this.result));
  }

}

exports.RuleBuilder = RuleBuilder;

function cloneRule(rule) {
  if (rule == null) {
    return rule;
  }

  const clone = { ...rule
  };
  const {
    unsubscribers,
    next
  } = rule;

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
import { VALUE_PROPERTY_DEFAULT } from '../../helpers/value-property';
import { ANY_DISPLAY, COLLECTION_PREFIX, VALUE_PROPERTY_PREFIX } from './contracts/constants';
import { getFuncPropertiesPath } from './helpers/func-properties-path';
import { RuleAny, RuleNothing, RuleRepeat } from './rules';
import { RuleSubscribeCollection, RuleSubscribeMap, RuleSubscribeObject, SubscribeObjectType } from './rules-subscribe';
const RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.Property, null);
const RuleSubscribeObjectValuePropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.ValueProperty, null);
const RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

export class RuleBuilder {
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
    return this.rule(new RuleNothing());
  }
  /**
   * Object property, Array index
   */


  valuePropertyName(propertyName) {
    return this.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(propertyName), VALUE_PROPERTY_PREFIX + propertyName);
  }
  /**
   * Object property, Array index
   */


  valuePropertyNames(...propertiesNames) {
    return this.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(...propertiesNames), VALUE_PROPERTY_PREFIX + propertiesNames.join('|'));
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
    return this.ruleSubscribe(new RuleSubscribeObjectPropertyNames(), ANY_DISPLAY);
  }
  /**
   * Object property, Array index
   */


  propertyPredicate(predicate, description) {
    return this.ruleSubscribe(new RuleSubscribeObject(SubscribeObjectType.Property, predicate), description);
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
    return this.ruleSubscribe(new RuleSubscribeCollection(), COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKey(key) {
    return this.ruleSubscribe(new RuleSubscribeMapKeys(key), COLLECTION_PREFIX + key);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKeys(...keys) {
    return this.ruleSubscribe(new RuleSubscribeMapKeys(...keys), COLLECTION_PREFIX + keys.join('|'));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapAll() {
    return this.ruleSubscribe(new RuleSubscribeMap(), COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapPredicate(keyPredicate, description) {
    return this.ruleSubscribe(new RuleSubscribeMap(keyPredicate), description);
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
  /**
   * @deprecated because babel transform object.map property to unparseable code
   */


  path(getValueFunc) {
    for (const propertyNames of getFuncPropertiesPath(getValueFunc)) {
      if (propertyNames.startsWith(COLLECTION_PREFIX)) {
        const keys = propertyNames.substring(1);

        if (keys === '') {
          this.collection();
        } else {
          this.mapKeys(...keys.split('|'));
        }
      } else if (propertyNames.startsWith(VALUE_PROPERTY_PREFIX)) {
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

    const rule = new RuleAny(getChilds.map(o => {
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
      rule = new RuleRepeat(countMin, countMax, getChild(new RuleBuilder()).result);
    }

    return this.rule(rule);
  }

  clone() {
    return new RuleBuilder(cloneRule(this.result));
  }

}
export function cloneRule(rule) {
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
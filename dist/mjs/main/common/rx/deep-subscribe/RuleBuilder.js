import { VALUE_PROPERTY_DEFAULT } from '../../helpers/value-property';
import { ANY_DISPLAY, COLLECTION_PREFIX, VALUE_PROPERTY_PREFIX } from './contracts/constants';
import { RuleRepeatAction } from './contracts/rules';
import { getFuncPropertiesPath } from './helpers/func-properties-path';
import { RuleAny, RuleIf, RuleNever, RuleNothing, RuleRepeat } from './rules';
import { hasDefaultProperty, RuleSubscribeCollection, RuleSubscribeMap, RuleSubscribeObject, SubscribeObjectType } from './rules-subscribe';
const RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.Property, null);
const RuleSubscribeObjectValuePropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.ValueProperty, null);
const RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

export class RuleBuilder {
  constructor({
    rule,
    valuePropertyDefaultName = VALUE_PROPERTY_DEFAULT,
    autoInsertValuePropertyDefault = true
  } = {}) {
    this.valuePropertyDefaultName = valuePropertyDefaultName;
    this.autoInsertValuePropertyDefault = autoInsertValuePropertyDefault;

    if (rule != null) {
      this.ruleFirst = rule;
      let ruleLast;

      do {
        ruleLast = rule;
        rule = rule.next;
      } while (rule != null);

      this.ruleLast = ruleLast;
    }
  }

  noAutoRules() {
    this.autoInsertValuePropertyDefault = false;
    return this;
  }

  result() {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleFirst;
  }

  valuePropertyDefault() {
    return this.repeat(0, 10, o => hasDefaultProperty(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => b.ruleSubscribe(this.valuePropertyDefaultName === VALUE_PROPERTY_DEFAULT ? new RuleSubscribeObjectPropertyNames(VALUE_PROPERTY_PREFIX, VALUE_PROPERTY_DEFAULT) : new RuleSubscribeObjectValuePropertyNames(VALUE_PROPERTY_PREFIX + this.valuePropertyDefaultName, this.valuePropertyDefaultName)));
  }

  rule(rule) {
    const {
      ruleLast
    } = this;

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.ruleFirst = rule;
    }

    this.ruleLast = rule;
    return this;
  }

  ruleSubscribe(ruleSubscribe) {
    if (ruleSubscribe.unsubscribers) {
      throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.');
    }

    ruleSubscribe.unsubscribers = [];
    ruleSubscribe.unsubscribersCount = [];
    return this.rule(ruleSubscribe);
  }

  nothing() {
    return this.rule(new RuleNothing());
  }

  never() {
    return this.rule(RuleNever.instance);
  }
  /**
   * Object property, Array index
   */


  valuePropertyName(propertyName) {
    return this.if([o => typeof o === 'undefined', b => b.never()], [o => o instanceof Object && o.constructor !== Object && !Array.isArray(o), b => b.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(VALUE_PROPERTY_PREFIX + propertyName, propertyName))]);
  }
  /**
   * Object property, Array index
   */


  valuePropertyNames(...propertiesNames) {
    return this.if([o => typeof o === 'undefined', b => b.never()], [o => o instanceof Object && o.constructor !== Object && !Array.isArray(o), b => b.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(VALUE_PROPERTY_PREFIX + propertiesNames.join('|'), ...propertiesNames))]);
  }
  /**
   * valuePropertyNames - Object property, Array index
   */


  v(...propertiesNames) {
    return this.valuePropertyNames(...propertiesNames);
  }
  /**
   * Object property, Array index
   */


  propertyName(propertyName) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(propertyName, propertyName));
  }
  /**
   * Object property, Array index
   */


  propertyNames(...propertiesNames) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(propertiesNames.join('|'), ...propertiesNames));
  }
  /**
   * propertyNames
   * @param propertiesNames
   */


  p(...propertiesNames) {
    return this.propertyNames(...propertiesNames);
  }
  /**
   * Object property, Array index
   */


  propertyAny() {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(ANY_DISPLAY));
  }
  /**
   * Object property, Array index
   */


  propertyPredicate(predicate, description) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObject(SubscribeObjectType.Property, predicate, description));
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
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeCollection(COLLECTION_PREFIX));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKey(key) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMapKeys(COLLECTION_PREFIX + key, key));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKeys(...keys) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMapKeys(COLLECTION_PREFIX + keys.join('|'), ...keys));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapAny() {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMap(null, COLLECTION_PREFIX));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapPredicate(keyPredicate, description) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMap(keyPredicate, description));
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


  path(getValueFunc) // public path<TValue>(getValueFunc: RuleGetValueFunc<TObject, TValue, TValueKeys>)
  // 	: RuleBuilder<TRulePathObjectValueOf<TValue>, TValueKeys>
  {
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

  if(...exclusiveConditionRules) {
    if (exclusiveConditionRules.length === 0) {
      throw new Error('if() parameters is empty');
    }

    const rule = new RuleIf(exclusiveConditionRules.map(o => {
      if (Array.isArray(o)) {
        return [o[0], o[1](this.clone(true)).ruleFirst];
      } else {
        return o(this.clone(true)).ruleFirst;
      }
    }));
    return this.rule(rule);
  }

  any(...getChilds) {
    if (getChilds.length === 0) {
      throw new Error('any() parameters is empty');
    }

    const rule = new RuleAny(getChilds.map(o => {
      const subRule = o(this.clone(true)).result();

      if (!subRule) {
        throw new Error(`Any subRule=${rule}`);
      }

      return subRule;
    }));
    return this.rule(rule);
  }

  repeat(countMin, countMax, condition, getChild) {
    const subRule = getChild(this.clone(true)).ruleFirst;

    if (!subRule) {
      throw new Error(`getChild(...).rule = ${subRule}`);
    }

    if (countMax == null) {
      countMax = Number.MAX_SAFE_INTEGER;
    }

    if (countMin == null) {
      countMin = 0;
    } // if (countMax < countMin || countMax <= 0) {
    // 	return this as unknown as RuleBuilder<TValue, TValueKeys>
    // }


    let rule;

    if (countMax === countMin && countMax === 1 && !condition) {
      rule = subRule;
    } else {
      rule = new RuleRepeat(countMin, countMax, condition, getChild(this.clone(true)).ruleFirst);
    }

    return this.rule(rule);
  }

  clone(optionsOnly) {
    return new RuleBuilder({
      rule: optionsOnly || !this.ruleFirst ? null : this.ruleFirst.clone(),
      valuePropertyDefaultName: this.valuePropertyDefaultName,
      autoInsertValuePropertyDefault: this.autoInsertValuePropertyDefault
    });
  }

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
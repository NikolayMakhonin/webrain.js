import { VALUE_PROPERTY_DEFAULT } from '../../../../../helpers/value-property';
import { ANY_DISPLAY, CHANGE_COUNT_PREFIX, COLLECTION_PREFIX, VALUE_PROPERTY_PREFIX } from './contracts/constants';
import { RuleRepeatAction } from './contracts/rules';
import { RuleAny, RuleIf, RuleNever, RuleNothing, RuleRepeat } from './rules';
import { createSubscribeMap, createSubscribeObject, hasDefaultProperty, RuleSubscribe, subscribeChange, subscribeCollection, SubscribeObjectType } from './rules-subscribe';
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

  changeValuePropertyDefault(propertyName) {
    this.valuePropertyDefaultName = propertyName;
    return this;
  }

  noAutoRules() {
    this.autoInsertValuePropertyDefault = false;
    return this;
  }

  result() {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleFirst;
  }

  valuePropertyDefault() {
    return this.repeat(0, 10, o => hasDefaultProperty(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork, b => this.valuePropertyDefaultName === VALUE_PROPERTY_DEFAULT ? b.func(createSubscribeObject(SubscribeObjectType.ValueProperty, null, VALUE_PROPERTY_DEFAULT), SubscribeObjectType.ValueProperty, VALUE_PROPERTY_PREFIX) : b.func(createSubscribeObject(SubscribeObjectType.ValueProperty, null, this.valuePropertyDefaultName), SubscribeObjectType.ValueProperty, VALUE_PROPERTY_PREFIX + this.valuePropertyDefaultName));
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
    return this.rule(ruleSubscribe);
  }

  nothing() {
    return this.rule(new RuleNothing());
  }

  never() {
    return this.rule(RuleNever.instance);
  }
  /**
   * Custom func
   */


  func(subscribe, subType, description) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribe(subscribe, subType, description));
  }
  /**
   * Custom func
   */


  f(subscribe, subType, description) {
    return this.func(subscribe, subType, description);
  }
  /**
   * Object property, Array index
   */


  valuePropertyName(propertyName) {
    return this.if([o => typeof o === 'undefined', b => b.never()], [o => o instanceof Object && o.constructor !== Object && !Array.isArray(o), b => b.func(createSubscribeObject(SubscribeObjectType.ValueProperty, null, propertyName), SubscribeObjectType.ValueProperty, VALUE_PROPERTY_PREFIX + propertyName)]);
  }
  /**
   * Object property, Array index
   */


  valuePropertyNames(...propertiesNames) {
    return this.if([o => typeof o === 'undefined', b => b.never()], [o => o instanceof Object && o.constructor !== Object && !Array.isArray(o), b => b.func(createSubscribeObject(SubscribeObjectType.ValueProperty, null, ...propertiesNames), SubscribeObjectType.ValueProperty, VALUE_PROPERTY_PREFIX + propertiesNames.join('|'))]);
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
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeObject(SubscribeObjectType.Property, null, propertyName), SubscribeObjectType.Property, propertyName);
  }
  /**
   * Object property, Array index
   */


  propertyNames(...propertiesNames) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeObject(SubscribeObjectType.Property, null, ...propertiesNames), SubscribeObjectType.Property, propertiesNames.join('|'));
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
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeObject(SubscribeObjectType.Property, null), SubscribeObjectType.Property, ANY_DISPLAY);
  }
  /**
   * Object property, Array index
   */


  propertyPredicate(predicate, description) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeObject(SubscribeObjectType.Property, predicate), SubscribeObjectType.Property, description);
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
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(subscribeCollection, SubscribeObjectType.Property, COLLECTION_PREFIX);
  }

  change() {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(subscribeChange, SubscribeObjectType.Property, CHANGE_COUNT_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKey(key) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeMap(null, key), SubscribeObjectType.Property, COLLECTION_PREFIX + key);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapKeys(...keys) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeMap(null, ...keys), SubscribeObjectType.Property, COLLECTION_PREFIX + keys.join('|'));
  }
  /**
   * IMapChanged & Map, Map
   */


  mapAny() {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeMap(null), SubscribeObjectType.Property, COLLECTION_PREFIX);
  }
  /**
   * IMapChanged & Map, Map
   */


  mapPredicate(keyPredicate, description) {
    return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).func(createSubscribeMap(keyPredicate), SubscribeObjectType.Property, description);
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
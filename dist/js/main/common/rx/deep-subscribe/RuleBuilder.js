"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleBuilder = void 0;

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _funcPropertiesPath = require("./helpers/func-properties-path");

class RuleBuilder {
  _property(rule) {
    const {
      _ruleLast: ruleLast
    } = this;

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

  propertyRegexp(regexp) {
    if (!(regexp instanceof RegExp)) {
      throw new Error(`regexp (${regexp}) is not instance of RegExp`);
    }

    return this.propertyPredicate(name => regexp.test(name), regexp.toString());
  }

  propertyPredicate(predicate, description) {
    if (typeof predicate !== 'function') {
      throw new Error(`predicate (${predicate}) is not a function`);
    }

    return this._property({
      type: _rules.RuleType.Property,

      predicate(propertyName, object) {
        return Object.prototype.hasOwnProperty.call(object, propertyName) && predicate(propertyName, object);
      },

      *iterateObject(object) {
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key) && predicate(key, object)) {
            yield object[key];
          }
        }
      },

      description
    });
  }

  propertyAll() {
    return this._property({
      type: _rules.RuleType.Property,

      predicate(propertyName, object) {
        return Object.prototype.hasOwnProperty.call(object, propertyName);
      },

      *iterateObject(object) {
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            yield object[key];
          }
        }
      },

      description: '*'
    });
  }

  propertyName(propertyName) {
    if (typeof propertyName !== 'string') {
      throw new Error(`propertyName (${propertyName}) should be a string`);
    }

    if (propertyName === _constants.ANY) {
      return this.propertyAll();
    }

    return this._property({
      type: _rules.RuleType.Property,

      predicate(propName, object) {
        return propName === propertyName && Object.prototype.hasOwnProperty.call(object, propertyName);
      },

      *iterateObject(object) {
        for (const propName in object) {
          if (propName === propertyName && Object.prototype.hasOwnProperty.call(object, propertyName)) {
            yield object[propertyName];
          }
        }
      },

      description: propertyName
    });
  }

  propertyNames(...propertiesNames) {
    if (propertiesNames.length === 1) {
      return this.propertyName(propertiesNames[0]);
    }

    if (!propertiesNames.length) {
      throw new Error('propertiesNames is empty');
    }

    let properties;

    for (let i = 0, len = propertiesNames.length; i < len; i++) {
      const propertyName = propertiesNames[i];

      if (typeof propertyName !== 'string') {
        throw new Error(`propertyName (${typeof propertyName}) should be a string`);
      }

      if (propertyName === _constants.ANY) {
        return this.propertyAll();
      }

      if (!properties) {
        properties = {
          [propertyName]: true
        };
      } else {
        properties[propertyName] = true;
      }
    }

    return this._property({
      type: _rules.RuleType.Property,

      predicate(propertyName, object) {
        return !!properties[propertyName] && Object.prototype.hasOwnProperty.call(object, propertyName);
      },

      *iterateObject(object) {
        for (let i = 0, len = propertiesNames.length; i < len; i++) {
          const propertyName = propertiesNames[i];

          if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
            yield object[propertyName];
          }
        }
      },

      description: propertiesNames.join('|')
    });
  }

  path(getValueFunc) {
    for (const propertyName of (0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc)) {
      this.propertyName(propertyName);
    }

    return this;
  }

  any(...getChilds) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Any,
      rules: getChilds.map(o => o(new RuleBuilder()).rule)
    };

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

  repeat(countMin, countMax, getChild) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Repeat,
      countMin,
      countMax,
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

}

exports.RuleBuilder = RuleBuilder;
/* tslint:disable:no-identical-functions */
import { isIterable } from '../../../../../helpers/helpers';
import { VALUE_PROPERTY_DEFAULT } from '../../../../../helpers/value-property';
import { ValueKeyType } from './contracts/common';
import { ANY } from './contracts/constants';
import { RuleType } from './contracts/rules';
import { Rule } from './rules';

function forEachCollection(object, changeItem) {
  for (const item of object) {
    changeItem(item, object, null, ValueKeyType.CollectionAny);
  }
} // region subscribeObjectValue


function getFirstExistProperty(object, propertyNames) {
  for (let i = 0, len = propertyNames.length; i < len; i++) {
    const propertyName = propertyNames[i];

    if (allowSubscribePrototype ? propertyName in object : Object.prototype.hasOwnProperty.call(object, propertyName)) {
      return propertyName;
    }
  }

  return null;
}

export function subscribeObjectValue(propertyNames, object, changeItem) {
  if (!(object instanceof Object)) {
    changeItem(object, object, null, null);
    return null;
  }

  if (object.constructor === Object || Array.isArray(object)) {
    changeItem(object, object, null, null);
  }

  if (allowSubscribePrototype ? !(VALUE_PROPERTY_DEFAULT in object) : !Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) {
    return null;
  }

  let propertyName = getFirstExistProperty(object, propertyNames);

  if (propertyName == null) {
    propertyName = VALUE_PROPERTY_DEFAULT;
  }

  if (propertyName == null) {
    changeItem(object, object, null, null);
  } else {
    const value = object[propertyName];

    if (typeof value !== 'undefined') {
      changeItem(value, object, propertyName, ValueKeyType.ValueProperty);
    }
  }
} // endregion
// region subscribeObject

const allowSubscribePrototype = true;
export function hasDefaultProperty(object) {
  return object instanceof Object && (allowSubscribePrototype ? VALUE_PROPERTY_DEFAULT in object : Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) && object.constructor !== Object && !Array.isArray(object);
}
export function subscribeObject(propertyNames, propertyPredicate, object, changeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  if (propertyNames == null) {
    for (const propertyName in object) {
      if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, propertyName)) && (!propertyPredicate || propertyPredicate(propertyName, object))) {
        changeItem(object[propertyName], object, propertyName, ValueKeyType.Property);
      }
    }
  } else {
    if (Array.isArray(propertyNames)) {
      for (let i = 0, len = propertyNames.length; i < len; i++) {
        const propertyName = propertyNames[i];

        if (allowSubscribePrototype ? propertyName in object : Object.prototype.hasOwnProperty.call(object, propertyName)) {
          const value = object[propertyName];

          if (typeof value !== 'undefined') {
            changeItem(value, object, propertyName, ValueKeyType.Property);
          }
        }
      }
    } else {
      if (allowSubscribePrototype ? propertyNames in object : Object.prototype.hasOwnProperty.call(object, propertyNames)) {
        const value = object[propertyNames];

        if (typeof value !== 'undefined') {
          changeItem(value, object, propertyNames, ValueKeyType.Property);
        }
      }
    }
  }
} // endregion
// region subscribeMap

export function subscribeMap(keys, keyPredicate, object, changeItem) {
  if (!object || object[Symbol.toStringTag] !== 'Map' && !(object instanceof Map)) {
    return null;
  }

  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];

      if (object.has(key)) {
        changeItem(object.get(key), object, key, ValueKeyType.MapKey);
      }
    }
  } else {
    for (const entry of object) {
      if (!keyPredicate || keyPredicate(entry[0], object)) {
        changeItem(entry[1], object, entry[0], ValueKeyType.MapKey);
      }
    }
  }
} // endregion
// region subscribeCollection

export function subscribeCollection(object, changeItem) {
  if (!isIterable(object)) {
    return null;
  }

  if (Array.isArray(object)) {
    for (let i = 0, len = object.length; i < len; i++) {
      changeItem(object[i], object, i, ValueKeyType.Index);
    }
  } else if (object instanceof Map || object[Symbol.toStringTag] === 'Map') {
    subscribeMap(null, null, object, changeItem);
  } else {
    forEachCollection(object, changeItem);
  }

  return null;
} // endregion
// region subscribeChange

export function subscribeChange(object) {
  if (!isIterable(object)) {
    return null;
  }

  object[Symbol.iterator]();
} // endregion
// endregion
// region RuleSubscribeObject

function createPropertyPredicate(propertyNames) {
  if (!propertyNames || !propertyNames.length) {
    return null;
  }

  if (propertyNames.length === 1) {
    const propertyName = propertyNames[0] + '';

    if (propertyName === ANY) {
      return null;
    }

    return propName => {
      // PROF: 226 - 0.5%
      return propName === propertyName;
    };
  } else {
    const propertyNamesMap = {};

    for (let i = 0, len = propertyNames.length; i < len; i++) {
      const propertyName = propertyNames[i] + '';

      if (propertyName === ANY) {
        return null;
      }

      propertyNamesMap[propertyName] = true;
    }

    return propName => {
      return !!propertyNamesMap[propName];
    };
  }
}

export let SubscribeObjectType;

(function (SubscribeObjectType) {
  SubscribeObjectType[SubscribeObjectType["Property"] = 0] = "Property";
  SubscribeObjectType[SubscribeObjectType["ValueProperty"] = 1] = "ValueProperty";
})(SubscribeObjectType || (SubscribeObjectType = {}));

export class RuleSubscribe extends Rule {
  constructor(subscribe, subType, description) {
    super(RuleType.Action, description);
    this.subscribe = subscribe;
    this.subType = subType;
  }

  clone() {
    const clone = super.clone();
    const {
      subscribe
    } = this;

    if (subscribe != null) {
      clone.subscribe = subscribe;
    }

    if (this.unsubscribers) {
      clone.unsubscribers = [];
    }

    if (this.unsubscribersCount) {
      clone.unsubscribersCount = [];
    }

    return clone;
  }

}
export function createSubscribeObject(subType, propertyPredicate, ...propertyNames) {
  if (propertyNames && !propertyNames.length) {
    propertyNames = null;
  }

  if (propertyPredicate) {
    if (typeof propertyPredicate !== 'function') {
      throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`);
    }
  } else if (subType === SubscribeObjectType.Property) {
    propertyPredicate = createPropertyPredicate(propertyNames);

    if (!propertyPredicate) {
      propertyNames = null;
    }
  }

  switch (subType) {
    case SubscribeObjectType.Property:
      return (object, changeItem) => subscribeObject(propertyNames, propertyPredicate, object, changeItem);

    case SubscribeObjectType.ValueProperty:
      return (object, changeItem) => {
        subscribeObjectValue(propertyNames, object, changeItem);
      };

    default:
      throw new Error(`Unknown SubscribeObjectType: ${subType}`);
  }
} // endregion
// region RuleSubscribeMap

function createKeyPredicate(keys) {
  if (!keys || !keys.length) {
    return null;
  }

  if (keys.length === 1) {
    const key = keys[0]; // @ts-ignore

    if (key === ANY) {
      return null;
    }

    return k => {
      return k === key;
    };
  } else {
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]; // @ts-ignore

      if (key === ANY) {
        return null;
      }
    }

    return k => {
      return keys.indexOf(k) >= 0;
    };
  }
}

export function createSubscribeMap(keyPredicate, ...keys) {
  if (keys && !keys.length) {
    keys = null;
  }

  if (keyPredicate) {
    if (typeof keyPredicate !== 'function') {
      throw new Error(`keyPredicate (${keyPredicate}) is not a function`);
    }
  } else {
    keyPredicate = createKeyPredicate(keys);

    if (!keyPredicate) {
      keys = null;
    }
  }

  return (object, changeItem) => {
    subscribeMap(keys, keyPredicate, object, changeItem);
  };
} // endregion
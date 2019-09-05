/* tslint:disable:no-identical-functions */
import { checkIsFuncOrNull, isIterable } from '../../helpers/helpers';
import { VALUE_PROPERTY_DEFAULT } from '../../helpers/value-property';
import { ListChangedType } from '../../lists/contracts/IListChanged';
import { MapChangedType } from '../../lists/contracts/IMapChanged';
import { SetChangedType } from '../../lists/contracts/ISetChanged';
import { ANY, COLLECTION_PREFIX, VALUE_PROPERTY_PREFIX } from './contracts/constants';
import { RuleType } from './contracts/rules';
import { Rule } from './rules';

function forEachSimple(iterable, callbackfn) {
  for (const item of iterable) {
    callbackfn(item, COLLECTION_PREFIX);
  }
} // region subscribeObject


function getFirstExistProperty(object, propertyNames) {
  for (let i = 0, len = propertyNames.length; i < len; i++) {
    const propertyName = propertyNames[i];

    if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
      return propertyName;
    }
  }

  return null;
}

function subscribeObjectValue(propertyNames, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object) || object.constructor === Object || Array.isArray(object)) {
    subscribeItem(object, null);
    return () => {
      unsubscribeItem(object, null);
    };
  }

  let subscribePropertyName;

  const getSubscribePropertyName = () => {
    if (!Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) {
      return null;
    }

    const propertyName = getFirstExistProperty(object, propertyNames);

    if (propertyName == null) {
      return VALUE_PROPERTY_DEFAULT;
    }

    return propertyName;
  };

  const subscribeProperty = propertyName => {
    subscribePropertyName = propertyName;

    if (propertyName == null) {
      subscribeItem(object, null);
    } else {
      subscribeItem(object[propertyName], VALUE_PROPERTY_PREFIX + propertyName);
    }
  };

  const unsubscribeProperty = () => {
    if (subscribePropertyName == null) {
      unsubscribeItem(object, null);
    } else {
      unsubscribeItem(object[subscribePropertyName], VALUE_PROPERTY_PREFIX + subscribePropertyName);
    }

    subscribePropertyName = null;
  };

  const {
    propertyChanged
  } = object;
  let unsubscribe;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(({
      name,
      oldValue
    }) => {
      const newSubscribePropertyName = getSubscribePropertyName();

      if (name === subscribePropertyName) {
        if (typeof oldValue !== 'undefined') {
          unsubscribeItem(oldValue, VALUE_PROPERTY_PREFIX + subscribePropertyName);
        }
      } else if (subscribePropertyName !== newSubscribePropertyName) {
        unsubscribeProperty();
      }

      if (unsubscribe != null) {
        subscribeProperty(newSubscribePropertyName);
      }
    }));
  }

  if (immediateSubscribe) {
    subscribeProperty(getSubscribePropertyName());
  } else if (unsubscribe == null) {
    return null;
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    unsubscribeProperty();
  };
} // endregion
// region subscribeObject


const allowSubscribePrototype = true;
export function hasDefaultProperty(object) {
  return object instanceof Object && (allowSubscribePrototype ? VALUE_PROPERTY_DEFAULT in object : Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) && object.constructor !== Object && !Array.isArray(object);
}
export function subscribeDefaultProperty(object, immediateSubscribe, subscribeItem) {
  let unsubscribe;
  return subscribeObject(VALUE_PROPERTY_DEFAULT, o => o === VALUE_PROPERTY_DEFAULT, object, immediateSubscribe, (item, debugPropertyName) => {
    unsubscribe = subscribeItem(item, debugPropertyName);
  }, () => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}

function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  let unsubscribe;

  if (propertyNames !== VALUE_PROPERTY_DEFAULT && hasDefaultProperty(object)) {
    unsubscribe = subscribeDefaultProperty(object, immediateSubscribe, item => subscribeObject(propertyNames, propertyPredicate, item, immediateSubscribe, subscribeItem, unsubscribeItem));

    if (unsubscribe) {
      return unsubscribe;
    }
  }

  const {
    propertyChanged
  } = object;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(({
      name,
      oldValue,
      newValue
    }) => {
      // PROF: 623 - 1.3%
      if (!propertyPredicate || propertyPredicate(name, object)) {
        if (typeof oldValue !== 'undefined') {
          unsubscribeItem(oldValue, name + '');
        }

        if (unsubscribe && typeof newValue !== 'undefined') {
          subscribeItem(newValue, name + '');
        }
      }
    }));
  }

  const forEach = callbackfn => {
    if (propertyNames) {
      if (Array.isArray(propertyNames)) {
        for (let i = 0, len = propertyNames.length; i < len; i++) {
          const propertyName = propertyNames[i];

          if (allowSubscribePrototype ? propertyName in object : Object.prototype.hasOwnProperty.call(object, propertyName)) {
            callbackfn(object[propertyName], propertyName);
          }
        }
      } else {
        if (allowSubscribePrototype ? propertyNames in object : Object.prototype.hasOwnProperty.call(object, propertyNames)) {
          callbackfn(object[propertyNames], propertyNames);
        }
      }
    } else {
      for (const propertyName in object) {
        if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, propertyName)) && (!propertyPredicate || propertyPredicate(propertyName, object))) {
          callbackfn(object[propertyName], propertyName);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    forEach(unsubscribeItem);
  };
} // endregion
// region subscribeIterable


function subscribeIterable(object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object || !isIterable(object)) {
    return null;
  }

  const forEach = callbackfn => {
    for (const item of object) {
      callbackfn(item, COLLECTION_PREFIX);
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else {
    return null;
  }

  return () => {
    forEach(unsubscribeItem);
  };
} // endregion
// region subscribeList


function subscribeList(object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object || object[Symbol.toStringTag] !== 'List') {
    return null;
  }

  const {
    listChanged
  } = object;
  let unsubscribe;

  if (listChanged) {
    unsubscribe = checkIsFuncOrNull(listChanged.subscribe(({
      type,
      oldItems,
      newItems
    }) => {
      switch (type) {
        case ListChangedType.Added:
          if (unsubscribe) {
            for (let i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], COLLECTION_PREFIX);
            }
          }

          break;

        case ListChangedType.Removed:
          for (let i = 0, len = oldItems.length; i < len; i++) {
            unsubscribeItem(oldItems[i], COLLECTION_PREFIX);
          }

          break;

        case ListChangedType.Set:
          unsubscribeItem(oldItems[0], COLLECTION_PREFIX);

          if (unsubscribe) {
            subscribeItem(newItems[0], COLLECTION_PREFIX);
          }

          break;
      }
    }));
  }

  if (immediateSubscribe) {
    forEachSimple(object, subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    forEachSimple(object, unsubscribeItem);
  };
} // endregion
// region subscribeSet


function subscribeSet(object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object || object[Symbol.toStringTag] !== 'Set' && !(object instanceof Set)) {
    return null;
  }

  const {
    setChanged
  } = object;
  let unsubscribe;

  if (setChanged) {
    unsubscribe = checkIsFuncOrNull(setChanged.subscribe(({
      type,
      oldItems,
      newItems
    }) => {
      switch (type) {
        case SetChangedType.Added:
          if (unsubscribe) {
            for (let i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], COLLECTION_PREFIX);
            }
          }

          break;

        case SetChangedType.Removed:
          for (let i = 0, len = oldItems.length; i < len; i++) {
            unsubscribeItem(oldItems[i], COLLECTION_PREFIX);
          }

          break;
      }
    }));
  }

  if (immediateSubscribe) {
    forEachSimple(object, subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    forEachSimple(object, unsubscribeItem);
  };
} // endregion
// region subscribeMap


function subscribeMap(keys, keyPredicate, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object || object[Symbol.toStringTag] !== 'Map' && !(object instanceof Map)) {
    return null;
  }

  const {
    mapChanged
  } = object;
  let unsubscribe;

  if (mapChanged) {
    unsubscribe = checkIsFuncOrNull(mapChanged.subscribe(({
      type,
      key,
      oldValue,
      newValue
    }) => {
      if (!keyPredicate || keyPredicate(key, object)) {
        switch (type) {
          case MapChangedType.Added:
            if (unsubscribe) {
              subscribeItem(newValue, COLLECTION_PREFIX + key);
            }

            break;

          case MapChangedType.Removed:
            unsubscribeItem(oldValue, COLLECTION_PREFIX + key);
            break;

          case MapChangedType.Set:
            unsubscribeItem(oldValue, COLLECTION_PREFIX + key);

            if (unsubscribe) {
              subscribeItem(newValue, COLLECTION_PREFIX + key);
            }

            break;
        }
      }
    }));
  }

  const forEach = callbackfn => {
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];

        if (object.has(key)) {
          callbackfn(object.get(key), COLLECTION_PREFIX + key);
        }
      }
    } else {
      for (const entry of object) {
        if (!keyPredicate || keyPredicate(entry[0], object)) {
          callbackfn(entry[1], COLLECTION_PREFIX + entry[0]);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    forEach(unsubscribeItem);
  };
} // endregion
// region subscribeCollection


function subscribeCollection(object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object) {
    return null;
  }

  const unsubscribeList = subscribeList(object, immediateSubscribe, subscribeItem, unsubscribeItem);
  const unsubscribeSet = subscribeSet(object, immediateSubscribe, subscribeItem, unsubscribeItem);
  const unsubscribeMap = subscribeMap(null, null, object, immediateSubscribe, subscribeItem, unsubscribeItem);
  let unsubscribeIterable;

  if (!unsubscribeList && !unsubscribeSet && !unsubscribeMap) {
    unsubscribeIterable = subscribeIterable(object, immediateSubscribe, subscribeItem, unsubscribeItem);

    if (!unsubscribeIterable) {
      return null;
    }
  }

  return () => {
    if (unsubscribeList) {
      unsubscribeList();
    }

    if (unsubscribeSet) {
      unsubscribeSet();
    }

    if (unsubscribeMap) {
      unsubscribeMap();
    }

    if (unsubscribeIterable) {
      unsubscribeIterable();
    }
  };
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
  constructor() {
    super(RuleType.Action);
  }

  clone() {
    const clone = super.clone();
    const {
      subscribe
    } = this;

    if (subscribe != null) {
      clone.subscribe = subscribe;
    }

    return clone;
  }

}
export class RuleSubscribeObject extends RuleSubscribe {
  constructor(type, propertyPredicate, ...propertyNames) {
    super();

    if (propertyNames && !propertyNames.length) {
      propertyNames = null;
    }

    if (propertyPredicate) {
      if (typeof propertyPredicate !== 'function') {
        throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`);
      }
    } else if (type === SubscribeObjectType.Property) {
      propertyPredicate = createPropertyPredicate(propertyNames);

      if (!propertyPredicate) {
        propertyNames = null;
      }
    }

    switch (type) {
      case SubscribeObjectType.Property:
        this.subscribe = subscribeObject.bind(null, propertyNames, propertyPredicate);
        break;

      case SubscribeObjectType.ValueProperty:
        this.subscribe = subscribeObjectValue.bind(null, propertyNames);
        break;

      default:
        throw new Error(`Unknown SubscribeObjectType: ${type}`);
    }
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

export class RuleSubscribeMap extends RuleSubscribe {
  constructor(keyPredicate, ...keys) {
    super();

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

    this.subscribe = subscribeMap.bind(null, keys, keyPredicate);
  }

} // endregion
// region RuleSubscribeCollection

export class RuleSubscribeCollection extends RuleSubscribe {
  constructor() {
    super();
    this.subscribe = subscribeCollection;
  }

} // endregion
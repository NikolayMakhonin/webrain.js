"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleSubscribeCollection = exports.RuleSubscribeMap = exports.RuleSubscribeObject = void 0;

var _helpers = require("../../helpers/helpers");

var _IListChanged = require("../../lists/contracts/IListChanged");

var _IMapChanged = require("../../lists/contracts/IMapChanged");

var _ISetChanged = require("../../lists/contracts/ISetChanged");

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _common = require("./helpers/common");

/* tslint:disable:no-identical-functions */
// function propertyPredicateAll(propertyName: string, object) {
// 	return Object.prototype.hasOwnProperty.call(object, propertyName)
// }
// region subscribeObject
function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  const {
    propertyChanged
  } = object;
  let unsubscribe;

  if (propertyChanged) {
    unsubscribe = (0, _common.checkUnsubscribe)(propertyChanged.subscribe(({
      name,
      oldValue,
      newValue
    }) => {
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
      for (let i = 0, len = propertyNames.length; i < len; i++) {
        const propertyName = propertyNames[i];

        if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
          callbackfn(object[propertyName], propertyName);
        }
      }
    } else {
      for (const propertyName in object) {
        if (Object.prototype.hasOwnProperty.call(object, propertyName) && (!propertyPredicate || propertyPredicate(propertyName, object))) {
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
  if (!object || !(0, _helpers.isIterable)(object)) {
    return null;
  }

  const forEach = callbackfn => {
    for (const item of object) {
      callbackfn(item, _constants.COLLECTION_PREFIX);
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
    unsubscribe = (0, _common.checkUnsubscribe)(listChanged.subscribe(({
      type,
      oldItems,
      newItems
    }) => {
      switch (type) {
        case _IListChanged.ListChangedType.Added:
          if (unsubscribe) {
            for (let i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], _constants.COLLECTION_PREFIX);
            }
          }

          break;

        case _IListChanged.ListChangedType.Removed:
          for (let i = 0, len = oldItems.length; i < len; i++) {
            unsubscribeItem(oldItems[i], _constants.COLLECTION_PREFIX);
          }

          break;

        case _IListChanged.ListChangedType.Set:
          unsubscribeItem(oldItems[0], _constants.COLLECTION_PREFIX);

          if (unsubscribe) {
            subscribeItem(newItems[0], _constants.COLLECTION_PREFIX);
          }

          break;
      }
    }));
  }

  const forEach = callbackfn => {
    for (const item of object) {
      callbackfn(item, _constants.COLLECTION_PREFIX);
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
    unsubscribe = (0, _common.checkUnsubscribe)(setChanged.subscribe(({
      type,
      oldItems,
      newItems
    }) => {
      switch (type) {
        case _ISetChanged.SetChangedType.Added:
          if (unsubscribe) {
            for (let i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], _constants.COLLECTION_PREFIX);
            }
          }

          break;

        case _ISetChanged.SetChangedType.Removed:
          for (let i = 0, len = oldItems.length; i < len; i++) {
            unsubscribeItem(oldItems[i], _constants.COLLECTION_PREFIX);
          }

          break;
      }
    }));
  }

  const forEach = callbackfn => {
    for (const item of object) {
      callbackfn(item, _constants.COLLECTION_PREFIX);
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
    unsubscribe = (0, _common.checkUnsubscribe)(mapChanged.subscribe(({
      type,
      key,
      oldValue,
      newValue
    }) => {
      if (!keyPredicate || keyPredicate(key, object)) {
        switch (type) {
          case _IMapChanged.MapChangedType.Added:
            if (unsubscribe) {
              subscribeItem(newValue, _constants.COLLECTION_PREFIX + key);
            }

            break;

          case _IMapChanged.MapChangedType.Removed:
            unsubscribeItem(oldValue, _constants.COLLECTION_PREFIX + key);
            break;

          case _IMapChanged.MapChangedType.Set:
            unsubscribeItem(oldValue, _constants.COLLECTION_PREFIX + key);

            if (unsubscribe) {
              subscribeItem(newValue, _constants.COLLECTION_PREFIX + key);
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
          callbackfn(object.get(key), _constants.COLLECTION_PREFIX + key);
        }
      }
    } else {
      for (const entry of object) {
        if (!keyPredicate || keyPredicate(entry[0], object)) {
          callbackfn(entry[1], _constants.COLLECTION_PREFIX + entry[0]);
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

    if (propertyName === _constants.ANY) {
      return null;
    }

    return (propName, object) => {
      return propName === propertyName;
    };
  } else {
    const propertyNamesMap = {};

    for (let i = 0, len = propertyNames.length; i < len; i++) {
      const propertyName = propertyNames[i] + '';

      if (propertyName === _constants.ANY) {
        return null;
      }

      propertyNamesMap[propertyName] = true;
    }

    return (propName, object) => {
      return !!propertyNamesMap[propName];
    };
  }
}

class RuleSubscribeObject {
  constructor(propertyPredicate, ...propertyNames) {
    this.type = _rules.RuleType.Action;

    if (propertyNames && !propertyNames.length) {
      propertyNames = null;
    }

    if (propertyPredicate) {
      if (typeof propertyPredicate !== 'function') {
        throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`);
      }
    } else {
      propertyPredicate = createPropertyPredicate(propertyNames);

      if (!propertyPredicate) {
        propertyNames = null;
      }
    }

    this.subscribe = subscribeObject.bind(null, propertyNames, propertyPredicate);
  }

} // endregion
// region RuleSubscribeMap


exports.RuleSubscribeObject = RuleSubscribeObject;

function createKeyPredicate(keys) {
  if (!keys || !keys.length) {
    return null;
  }

  if (keys.length === 1) {
    const key = keys[0]; // @ts-ignore

    if (key === _constants.ANY) {
      return null;
    }

    return (k, object) => {
      return k === key;
    };
  } else {
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]; // @ts-ignore

      if (key === _constants.ANY) {
        return null;
      }
    }

    return (k, object) => {
      return keys.indexOf(k) >= 0;
    };
  }
}

class RuleSubscribeMap {
  constructor(keyPredicate, ...keys) {
    this.type = _rules.RuleType.Action;

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


exports.RuleSubscribeMap = RuleSubscribeMap;

class RuleSubscribeCollection {
  constructor() {
    this.type = _rules.RuleType.Action;
    this.subscribe = subscribeCollection;
  }

} // endregion


exports.RuleSubscribeCollection = RuleSubscribeCollection;
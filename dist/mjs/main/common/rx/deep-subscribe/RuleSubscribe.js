import _classCallCheck from "@babel/runtime/helpers/classCallCheck";

/* tslint:disable:no-identical-functions */
import { isIterable } from '../../helpers/helpers';
import { ListChangedType } from '../../lists/contracts/IListChanged';
import { MapChangedType } from '../../lists/contracts/IMapChanged';
import { SetChangedType } from '../../lists/contracts/ISetChanged';
import { ANY, COLLECTION_PREFIX } from './contracts/constants';
import { RuleType } from './contracts/rules';
import { checkUnsubscribe } from './helpers/common'; // function propertyPredicateAll(propertyName: string, object) {
// 	return Object.prototype.hasOwnProperty.call(object, propertyName)
// }
// region subscribeObject

function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  var propertyChanged = object.propertyChanged;
  var unsubscribe;

  if (propertyChanged) {
    unsubscribe = checkUnsubscribe(propertyChanged.subscribe(function (_ref) {
      var name = _ref.name,
          oldValue = _ref.oldValue,
          newValue = _ref.newValue;

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

  var forEach = function forEach(callbackfn) {
    if (propertyNames) {
      for (var i = 0, len = propertyNames.length; i < len; i++) {
        var _propertyName = propertyNames[i];

        if (Object.prototype.hasOwnProperty.call(object, _propertyName)) {
          callbackfn(object[_propertyName], _propertyName);
        }
      }
    } else {
      for (var _propertyName2 in object) {
        if (Object.prototype.hasOwnProperty.call(object, _propertyName2) && (!propertyPredicate || propertyPredicate(_propertyName2, object))) {
          callbackfn(object[_propertyName2], _propertyName2);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
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

  var forEach = function forEach(callbackfn) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = object[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _item = _step.value;
        callbackfn(_item, COLLECTION_PREFIX);
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
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else {
    return null;
  }

  return function () {
    forEach(unsubscribeItem);
  };
} // endregion
// region subscribeList


function subscribeList(object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object || object[Symbol.toStringTag] !== 'List') {
    return null;
  }

  var listChanged = object.listChanged;
  var unsubscribe;

  if (listChanged) {
    unsubscribe = checkUnsubscribe(listChanged.subscribe(function (_ref2) {
      var type = _ref2.type,
          oldItems = _ref2.oldItems,
          newItems = _ref2.newItems;

      switch (type) {
        case ListChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], COLLECTION_PREFIX);
            }
          }

          break;

        case ListChangedType.Removed:
          for (var _i = 0, _len = oldItems.length; _i < _len; _i++) {
            unsubscribeItem(oldItems[_i], COLLECTION_PREFIX);
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

  var forEach = function forEach(callbackfn) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = object[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _item2 = _step2.value;
        callbackfn(_item2, COLLECTION_PREFIX);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
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

  var setChanged = object.setChanged;
  var unsubscribe;

  if (setChanged) {
    unsubscribe = checkUnsubscribe(setChanged.subscribe(function (_ref3) {
      var type = _ref3.type,
          oldItems = _ref3.oldItems,
          newItems = _ref3.newItems;

      switch (type) {
        case SetChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], COLLECTION_PREFIX);
            }
          }

          break;

        case SetChangedType.Removed:
          for (var _i2 = 0, _len2 = oldItems.length; _i2 < _len2; _i2++) {
            unsubscribeItem(oldItems[_i2], COLLECTION_PREFIX);
          }

          break;
      }
    }));
  }

  var forEach = function forEach(callbackfn) {
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = object[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _item3 = _step3.value;
        callbackfn(_item3, COLLECTION_PREFIX);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
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

  var mapChanged = object.mapChanged;
  var unsubscribe;

  if (mapChanged) {
    unsubscribe = checkUnsubscribe(mapChanged.subscribe(function (_ref4) {
      var type = _ref4.type,
          key = _ref4.key,
          oldValue = _ref4.oldValue,
          newValue = _ref4.newValue;

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

  var forEach = function forEach(callbackfn) {
    if (keys) {
      for (var i = 0, len = keys.length; i < len; i++) {
        var _key = keys[i];

        if (object.has(_key)) {
          callbackfn(object.get(_key), COLLECTION_PREFIX + _key);
        }
      }
    } else {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = object[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var entry = _step4.value;

          if (!keyPredicate || keyPredicate(entry[0], object)) {
            callbackfn(entry[1], COLLECTION_PREFIX + entry[0]);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
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

  var unsubscribeList = subscribeList(object, immediateSubscribe, subscribeItem, unsubscribeItem);
  var unsubscribeSet = subscribeSet(object, immediateSubscribe, subscribeItem, unsubscribeItem);
  var unsubscribeMap = subscribeMap(null, null, object, immediateSubscribe, subscribeItem, unsubscribeItem);
  var unsubscribeIterable;

  if (!unsubscribeList && !unsubscribeSet && !unsubscribeMap) {
    unsubscribeIterable = subscribeIterable(object, immediateSubscribe, subscribeItem, unsubscribeItem);

    if (!unsubscribeIterable) {
      return null;
    }
  }

  return function () {
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
    var _propertyName3 = propertyNames[0] + '';

    if (_propertyName3 === ANY) {
      return null;
    }

    return function (propName, object) {
      return propName === _propertyName3;
    };
  } else {
    var propertyNamesMap = {};

    for (var i = 0, len = propertyNames.length; i < len; i++) {
      var _propertyName4 = propertyNames[i] + '';

      if (_propertyName4 === ANY) {
        return null;
      }

      propertyNamesMap[_propertyName4] = true;
    }

    return function (propName, object) {
      return !!propertyNamesMap[propName];
    };
  }
}

export var RuleSubscribeObject = function RuleSubscribeObject(propertyPredicate) {
  for (var _len3 = arguments.length, propertyNames = new Array(_len3 > 1 ? _len3 - 1 : 0), _key2 = 1; _key2 < _len3; _key2++) {
    propertyNames[_key2 - 1] = arguments[_key2];
  }

  _classCallCheck(this, RuleSubscribeObject);

  this.type = RuleType.Action;

  if (propertyNames && !propertyNames.length) {
    propertyNames = null;
  }

  if (propertyPredicate) {
    if (typeof propertyPredicate !== 'function') {
      throw new Error("propertyPredicate (".concat(propertyPredicate, ") is not a function"));
    }
  } else {
    propertyPredicate = createPropertyPredicate(propertyNames);

    if (!propertyPredicate) {
      propertyNames = null;
    }
  }

  this.subscribe = subscribeObject.bind(null, propertyNames, propertyPredicate);
}; // endregion
// region RuleSubscribeMap

function createKeyPredicate(keys) {
  if (!keys || !keys.length) {
    return null;
  }

  if (keys.length === 1) {
    var _key3 = keys[0]; // @ts-ignore

    if (_key3 === ANY) {
      return null;
    }

    return function (k, object) {
      return k === _key3;
    };
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      var _key4 = keys[i]; // @ts-ignore

      if (_key4 === ANY) {
        return null;
      }
    }

    return function (k, object) {
      return keys.indexOf(k) >= 0;
    };
  }
}

export var RuleSubscribeMap = function RuleSubscribeMap(keyPredicate) {
  for (var _len4 = arguments.length, keys = new Array(_len4 > 1 ? _len4 - 1 : 0), _key5 = 1; _key5 < _len4; _key5++) {
    keys[_key5 - 1] = arguments[_key5];
  }

  _classCallCheck(this, RuleSubscribeMap);

  this.type = RuleType.Action;

  if (keys && !keys.length) {
    keys = null;
  }

  if (keyPredicate) {
    if (typeof keyPredicate !== 'function') {
      throw new Error("keyPredicate (".concat(keyPredicate, ") is not a function"));
    }
  } else {
    keyPredicate = createKeyPredicate(keys);

    if (!keyPredicate) {
      keys = null;
    }
  }

  this.subscribe = subscribeMap.bind(null, keys, keyPredicate);
}; // endregion
// region RuleSubscribeCollection

export var RuleSubscribeCollection = function RuleSubscribeCollection() {
  _classCallCheck(this, RuleSubscribeCollection);

  this.type = RuleType.Action;
  this.subscribe = subscribeCollection;
}; // endregion
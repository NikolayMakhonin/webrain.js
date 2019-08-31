import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";

/* tslint:disable:no-identical-functions */
import { checkIsFuncOrNull, isIterable, VALUE_PROPERTY_DEFAULT } from '../../helpers/helpers';
import { ListChangedType } from '../../lists/contracts/IListChanged';
import { MapChangedType } from '../../lists/contracts/IMapChanged';
import { SetChangedType } from '../../lists/contracts/ISetChanged';
import { ANY, COLLECTION_PREFIX, VALUE_PROPERTY_PREFIX } from './contracts/constants';
import { RuleType } from './contracts/rules';
import { Rule } from './rules';

function forEachSimple(iterable, callbackfn) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _item = _step.value;
      callbackfn(_item, COLLECTION_PREFIX);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
} // region subscribeObject


function getFirstExistProperty(object, propertyNames) {
  for (var i = 0, len = propertyNames.length; i < len; i++) {
    var _propertyName = propertyNames[i];

    if (Object.prototype.hasOwnProperty.call(object, _propertyName)) {
      return _propertyName;
    }
  }

  return null;
}

function subscribeObjectValue(propertyNames, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object) || object.constructor === Object || Array.isArray(object)) {
    subscribeItem(object, null);
    return function () {
      unsubscribeItem(object, null);
    };
  }

  var subscribePropertyName;

  var getSubscribePropertyName = function getSubscribePropertyName() {
    if (!Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) {
      return null;
    }

    var propertyName = getFirstExistProperty(object, propertyNames);

    if (propertyName == null) {
      return VALUE_PROPERTY_DEFAULT;
    }

    return propertyName;
  };

  var subscribeProperty = function subscribeProperty(propertyName) {
    subscribePropertyName = propertyName;

    if (propertyName == null) {
      subscribeItem(object, null);
    } else {
      subscribeItem(object[propertyName], VALUE_PROPERTY_PREFIX + propertyName);
    }
  };

  var unsubscribeProperty = function unsubscribeProperty() {
    if (subscribePropertyName == null) {
      unsubscribeItem(object, null);
    } else {
      unsubscribeItem(object[subscribePropertyName], VALUE_PROPERTY_PREFIX + subscribePropertyName);
    }

    subscribePropertyName = null;
  };

  var propertyChanged = object.propertyChanged;
  var unsubscribe;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(function (_ref) {
      var name = _ref.name,
          oldValue = _ref.oldValue;
      var newSubscribePropertyName = getSubscribePropertyName();

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

  return function () {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    unsubscribeProperty();
  };
} // endregion
// region subscribeObject


var allowSubscribePrototype = true;
export function hasDefaultProperty(object) {
  return object instanceof Object && (allowSubscribePrototype ? VALUE_PROPERTY_DEFAULT in object : Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) && object.constructor !== Object && !Array.isArray(object);
}
export function subscribeDefaultProperty(object, immediateSubscribe, subscribeItem) {
  var unsubscribe;
  return subscribeObject(VALUE_PROPERTY_DEFAULT, function (o) {
    return o === VALUE_PROPERTY_DEFAULT;
  }, object, immediateSubscribe, function (item, debugPropertyName) {
    unsubscribe = subscribeItem(item, debugPropertyName);
  }, function () {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}

function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  var unsubscribe;

  if (propertyNames !== VALUE_PROPERTY_DEFAULT && hasDefaultProperty(object)) {
    unsubscribe = subscribeDefaultProperty(object, immediateSubscribe, function (item) {
      return subscribeObject(propertyNames, propertyPredicate, item, immediateSubscribe, subscribeItem, unsubscribeItem);
    });

    if (unsubscribe) {
      return unsubscribe;
    }
  }

  var propertyChanged = object.propertyChanged;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(function (_ref2) {
      var name = _ref2.name,
          oldValue = _ref2.oldValue,
          newValue = _ref2.newValue;

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

  var forEach = function forEach(callbackfn) {
    if (propertyNames) {
      if (Array.isArray(propertyNames)) {
        for (var i = 0, len = propertyNames.length; i < len; i++) {
          var _propertyName2 = propertyNames[i];

          if (allowSubscribePrototype ? _propertyName2 in object : Object.prototype.hasOwnProperty.call(object, _propertyName2)) {
            callbackfn(object[_propertyName2], _propertyName2);
          }
        }
      } else {
        if (allowSubscribePrototype ? propertyNames in object : Object.prototype.hasOwnProperty.call(object, propertyNames)) {
          callbackfn(object[propertyNames], propertyNames);
        }
      }
    } else {
      for (var _propertyName3 in object) {
        if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, _propertyName3)) && (!propertyPredicate || propertyPredicate(_propertyName3, object))) {
          callbackfn(object[_propertyName3], _propertyName3);
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
        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
          _iterator2["return"]();
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
    unsubscribe = checkIsFuncOrNull(listChanged.subscribe(function (_ref3) {
      var type = _ref3.type,
          oldItems = _ref3.oldItems,
          newItems = _ref3.newItems;

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

  if (immediateSubscribe) {
    forEachSimple(object, subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
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

  var setChanged = object.setChanged;
  var unsubscribe;

  if (setChanged) {
    unsubscribe = checkIsFuncOrNull(setChanged.subscribe(function (_ref4) {
      var type = _ref4.type,
          oldItems = _ref4.oldItems,
          newItems = _ref4.newItems;

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

  if (immediateSubscribe) {
    forEachSimple(object, subscribeItem);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
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

  var mapChanged = object.mapChanged;
  var unsubscribe;

  if (mapChanged) {
    unsubscribe = checkIsFuncOrNull(mapChanged.subscribe(function (_ref5) {
      var type = _ref5.type,
          key = _ref5.key,
          oldValue = _ref5.oldValue,
          newValue = _ref5.newValue;

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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = object[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var entry = _step3.value;

          if (!keyPredicate || keyPredicate(entry[0], object)) {
            callbackfn(entry[1], COLLECTION_PREFIX + entry[0]);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
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
    var _propertyName4 = propertyNames[0] + '';

    if (_propertyName4 === ANY) {
      return null;
    }

    return function (propName) {
      // PROF: 226 - 0.5%
      return propName === _propertyName4;
    };
  } else {
    var propertyNamesMap = {};

    for (var i = 0, len = propertyNames.length; i < len; i++) {
      var _propertyName5 = propertyNames[i] + '';

      if (_propertyName5 === ANY) {
        return null;
      }

      propertyNamesMap[_propertyName5] = true;
    }

    return function (propName) {
      return !!propertyNamesMap[propName];
    };
  }
}

export var SubscribeObjectType;

(function (SubscribeObjectType) {
  SubscribeObjectType[SubscribeObjectType["Property"] = 0] = "Property";
  SubscribeObjectType[SubscribeObjectType["ValueProperty"] = 1] = "ValueProperty";
})(SubscribeObjectType || (SubscribeObjectType = {}));

export var RuleSubscribe =
/*#__PURE__*/
function (_Rule) {
  _inherits(RuleSubscribe, _Rule);

  function RuleSubscribe() {
    _classCallCheck(this, RuleSubscribe);

    return _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribe).call(this, RuleType.Action));
  }

  _createClass(RuleSubscribe, [{
    key: "clone",
    value: function clone() {
      var clone = _get(_getPrototypeOf(RuleSubscribe.prototype), "clone", this).call(this);

      var subscribe = this.subscribe;

      if (subscribe != null) {
        clone.subscribe = subscribe;
      }

      return clone;
    }
  }]);

  return RuleSubscribe;
}(Rule);
export var RuleSubscribeObject =
/*#__PURE__*/
function (_RuleSubscribe) {
  _inherits(RuleSubscribeObject, _RuleSubscribe);

  function RuleSubscribeObject(type, propertyPredicate) {
    var _this;

    for (var _len3 = arguments.length, propertyNames = new Array(_len3 > 2 ? _len3 - 2 : 0), _key2 = 2; _key2 < _len3; _key2++) {
      propertyNames[_key2 - 2] = arguments[_key2];
    }

    _classCallCheck(this, RuleSubscribeObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeObject).call(this));

    if (propertyNames && !propertyNames.length) {
      propertyNames = null;
    }

    if (propertyPredicate) {
      if (typeof propertyPredicate !== 'function') {
        throw new Error("propertyPredicate (".concat(propertyPredicate, ") is not a function"));
      }
    } else if (type === SubscribeObjectType.Property) {
      propertyPredicate = createPropertyPredicate(propertyNames);

      if (!propertyPredicate) {
        propertyNames = null;
      }
    }

    switch (type) {
      case SubscribeObjectType.Property:
        _this.subscribe = subscribeObject.bind(null, propertyNames, propertyPredicate);
        break;

      case SubscribeObjectType.ValueProperty:
        _this.subscribe = subscribeObjectValue.bind(null, propertyNames);
        break;

      default:
        throw new Error("Unknown SubscribeObjectType: ".concat(type));
    }

    return _this;
  }

  return RuleSubscribeObject;
}(RuleSubscribe); // endregion
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

    return function (k) {
      return k === _key3;
    };
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      var _key4 = keys[i]; // @ts-ignore

      if (_key4 === ANY) {
        return null;
      }
    }

    return function (k) {
      return keys.indexOf(k) >= 0;
    };
  }
}

export var RuleSubscribeMap =
/*#__PURE__*/
function (_RuleSubscribe2) {
  _inherits(RuleSubscribeMap, _RuleSubscribe2);

  function RuleSubscribeMap(keyPredicate) {
    var _this2;

    for (var _len4 = arguments.length, keys = new Array(_len4 > 1 ? _len4 - 1 : 0), _key5 = 1; _key5 < _len4; _key5++) {
      keys[_key5 - 1] = arguments[_key5];
    }

    _classCallCheck(this, RuleSubscribeMap);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeMap).call(this));

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

    _this2.subscribe = subscribeMap.bind(null, keys, keyPredicate);
    return _this2;
  }

  return RuleSubscribeMap;
}(RuleSubscribe); // endregion
// region RuleSubscribeCollection

export var RuleSubscribeCollection =
/*#__PURE__*/
function (_RuleSubscribe3) {
  _inherits(RuleSubscribeCollection, _RuleSubscribe3);

  function RuleSubscribeCollection() {
    var _this3;

    _classCallCheck(this, RuleSubscribeCollection);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeCollection).call(this));
    _this3.subscribe = subscribeCollection;
    return _this3;
  }

  return RuleSubscribeCollection;
}(RuleSubscribe); // endregion
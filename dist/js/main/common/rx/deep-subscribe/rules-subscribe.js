"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.hasDefaultProperty = hasDefaultProperty;
exports.RuleSubscribeCollection = exports.RuleSubscribeMap = exports.RuleSubscribeObject = exports.RuleSubscribe = exports.SubscribeObjectType = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray4 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../helpers/helpers");

var _valueProperty = require("../../helpers/value-property");

var _IListChanged = require("../../lists/contracts/IListChanged");

var _IMapChanged = require("../../lists/contracts/IMapChanged");

var _ISetChanged = require("../../lists/contracts/ISetChanged");

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _rules2 = require("./rules");

/* tslint:disable:no-identical-functions */
function forEachSimple(iterable, callbackfn) {
  for (var _iterator = iterable, _isArray = (0, _isArray4.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var _item = _ref;
    callbackfn(_item, _constants.COLLECTION_PREFIX);
  }
} // region subscribeObjectValue


function getFirstExistProperty(object, propertyNames) {
  for (var i = 0, len = propertyNames.length; i < len; i++) {
    var _propertyName = propertyNames[i];

    if (allowSubscribePrototype ? _propertyName in object : Object.prototype.hasOwnProperty.call(object, _propertyName)) {
      return _propertyName;
    }
  }

  return null;
}

function subscribeObjectValue(propertyNames, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object)) {
    subscribeItem(object, null);
    return null;
  }

  if (object.constructor === Object || (0, _isArray4.default)(object)) {
    subscribeItem(object, null);
    return function () {
      unsubscribeItem(object, null);
    };
  }

  var subscribePropertyName;

  var getSubscribePropertyName = function getSubscribePropertyName() {
    if (allowSubscribePrototype ? !(_valueProperty.VALUE_PROPERTY_DEFAULT in object) : !Object.prototype.hasOwnProperty.call(object, _valueProperty.VALUE_PROPERTY_DEFAULT)) {
      return null;
    }

    var propertyName = getFirstExistProperty(object, propertyNames);

    if (propertyName == null) {
      return _valueProperty.VALUE_PROPERTY_DEFAULT;
    }

    return propertyName;
  };

  var subscribeProperty = function subscribeProperty(propertyName, isFirst) {
    subscribePropertyName = propertyName;

    if (propertyName == null) {
      subscribeItem(object, null);
    } else {
      var value = object[propertyName];

      if (typeof value !== 'undefined') {
        subscribeItem(value, _constants.VALUE_PROPERTY_PREFIX + propertyName);
      }

      if (isFirst) {
        subscribeItem(void 0, _constants.VALUE_PROPERTY_PREFIX + propertyName);
      }
    }
  };

  var unsubscribeProperty = function unsubscribeProperty(isLast) {
    if (subscribePropertyName == null) {
      unsubscribeItem(object, null);
    } else {
      if (isLast) {
        unsubscribeItem(void 0, _constants.VALUE_PROPERTY_PREFIX + subscribePropertyName);
      }

      var value = object[subscribePropertyName];

      if (typeof value !== 'undefined') {
        unsubscribeItem(object[subscribePropertyName], _constants.VALUE_PROPERTY_PREFIX + subscribePropertyName);
      }
    }

    subscribePropertyName = null;
  };

  var propertyChanged = object.propertyChanged;
  var unsubscribe;

  if (propertyChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(propertyChanged.subscribe(function (_ref2) {
      var name = _ref2.name,
          oldValue = _ref2.oldValue,
          newValue = _ref2.newValue;

      if (!unsubscribe && oldValue === newValue) {
        return;
      }

      var newSubscribePropertyName = getSubscribePropertyName();

      if (name === subscribePropertyName) {
        if (typeof oldValue !== 'undefined') {
          unsubscribeItem(oldValue, _constants.VALUE_PROPERTY_PREFIX + subscribePropertyName);
        }
      } else if (subscribePropertyName !== newSubscribePropertyName) {
        unsubscribeProperty(false);
      } else {
        return;
      }

      if (unsubscribe != null) {
        subscribeProperty(newSubscribePropertyName, false);
      }
    }));
  }

  if (immediateSubscribe) {
    subscribeProperty(getSubscribePropertyName(), true);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    unsubscribeProperty(true);
  };
} // endregion
// region subscribeObject


var allowSubscribePrototype = true;

function hasDefaultProperty(object) {
  return object instanceof Object && (allowSubscribePrototype ? _valueProperty.VALUE_PROPERTY_DEFAULT in object : Object.prototype.hasOwnProperty.call(object, _valueProperty.VALUE_PROPERTY_DEFAULT)) && object.constructor !== Object && !(0, _isArray4.default)(object);
} // export function subscribeDefaultProperty<TValue>(
// 	object: IPropertyChanged,
// 	immediateSubscribe: boolean,
// 	subscribeItem: (item: TValue, debugPropertyName: string) => IUnsubscribeOrVoid,
// ) {
// 	let unsubscribers: IUnsubscribe[]
// 	return subscribeObject<TValue>(
// 		VALUE_PROPERTY_DEFAULT,
// 		o => o === VALUE_PROPERTY_DEFAULT,
// 		object,
// 		immediateSubscribe,
// 		(item, debugPropertyName) => {
// 			const unsubscriber = subscribeItem(item, debugPropertyName)
// 			if (unsubscriber) {
// 				if (!unsubscribers) {
// 					unsubscribers = []
// 				}
// 				unsubscribers.push(unsubscriber)
// 			}
// 		},
// 		() => {
// 			if (unsubscribers) {
// 				const _unsubscribers = unsubscribers
// 				unsubscribers = null
// 				for (let i = 0, len = _unsubscribers.length; i < len; i++) {
// 					_unsubscribers[i]()
// 				}
// 			}
// 		})
// }


function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  var unsubscribe; // if (propertyNames !== VALUE_PROPERTY_DEFAULT && hasDefaultProperty(object)) {
  // 	unsubscribe = subscribeDefaultProperty(
  // 		object,
  // 		immediateSubscribe,
  // 		item => subscribeObject(
  // 			propertyNames,
  // 			propertyPredicate,
  // 			item as any,
  // 			immediateSubscribe,
  // 			subscribeItem,
  // 			unsubscribeItem),
  // 	)
  //
  // 	if (unsubscribe) {
  // 		return unsubscribe
  // 	}
  // }

  var propertyChanged = object.propertyChanged;

  if (propertyChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(propertyChanged.subscribe(function (_ref3) {
      var name = _ref3.name,
          oldValue = _ref3.oldValue,
          newValue = _ref3.newValue;

      if (!unsubscribe && oldValue === newValue) {
        return;
      } // PROF: 623 - 1.3%


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

  var forEach = function forEach(callbackfn, isSubscribe) {
    if (propertyNames == null) {
      for (var _propertyName2 in object) {
        if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, _propertyName2)) && (!propertyPredicate || propertyPredicate(_propertyName2, object))) {
          callbackfn(object[_propertyName2], _propertyName2);
        }
      }
    } else {
      if ((0, _isArray4.default)(propertyNames)) {
        for (var i = 0, len = propertyNames.length; i < len; i++) {
          var _propertyName3 = propertyNames[i];

          if (!isSubscribe) {
            callbackfn(void 0, _propertyName3);
          }

          if (allowSubscribePrototype ? _propertyName3 in object : Object.prototype.hasOwnProperty.call(object, _propertyName3)) {
            var value = object[_propertyName3];

            if (typeof value !== 'undefined') {
              callbackfn(value, _propertyName3);
            }
          }

          if (isSubscribe) {
            callbackfn(void 0, _propertyName3);
          }
        }
      } else {
        if (!isSubscribe) {
          callbackfn(void 0, propertyNames);
        }

        if (allowSubscribePrototype ? propertyNames in object : Object.prototype.hasOwnProperty.call(object, propertyNames)) {
          var _value = object[propertyNames];

          if (typeof _value !== 'undefined') {
            callbackfn(_value, propertyNames);
          }
        }

        if (isSubscribe) {
          callbackfn(void 0, propertyNames);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem, true);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    forEach(unsubscribeItem, false);
  };
} // endregion
// region subscribeIterable


function subscribeIterable(object, immediateSubscribe, subscribeItem, unsubscribeItem) {
  if (!object || typeof object === 'string' || !(0, _helpers.isIterable)(object)) {
    return null;
  }

  var forEach = function forEach(callbackfn) {
    for (var _iterator2 = object, _isArray2 = (0, _isArray4.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
      var _ref4;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref4 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref4 = _i2.value;
      }

      var _item2 = _ref4;
      callbackfn(_item2, _constants.COLLECTION_PREFIX);
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
  if (!object || object[_toStringTag.default] !== 'List') {
    return null;
  }

  var listChanged = object.listChanged;
  var unsubscribe;

  if (listChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(listChanged.subscribe(function (_ref5) {
      var type = _ref5.type,
          oldItems = _ref5.oldItems,
          newItems = _ref5.newItems;

      switch (type) {
        case _IListChanged.ListChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], _constants.COLLECTION_PREFIX);
            }
          }

          break;

        case _IListChanged.ListChangedType.Removed:
          for (var _i3 = 0, _len = oldItems.length; _i3 < _len; _i3++) {
            unsubscribeItem(oldItems[_i3], _constants.COLLECTION_PREFIX);
          }

          break;

        case _IListChanged.ListChangedType.Set:
          if (unsubscribe || oldItems[0] !== newItems[0]) {
            unsubscribeItem(oldItems[0], _constants.COLLECTION_PREFIX);
          }

          if (unsubscribe) {
            subscribeItem(newItems[0], _constants.COLLECTION_PREFIX);
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
  if (!object || object[_toStringTag.default] !== 'Set' && !(object instanceof _set.default)) {
    return null;
  }

  var setChanged = object.setChanged;
  var unsubscribe;

  if (setChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(setChanged.subscribe(function (_ref6) {
      var type = _ref6.type,
          oldItems = _ref6.oldItems,
          newItems = _ref6.newItems;

      switch (type) {
        case _ISetChanged.SetChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              subscribeItem(newItems[i], _constants.COLLECTION_PREFIX);
            }
          }

          break;

        case _ISetChanged.SetChangedType.Removed:
          for (var _i4 = 0, _len2 = oldItems.length; _i4 < _len2; _i4++) {
            unsubscribeItem(oldItems[_i4], _constants.COLLECTION_PREFIX);
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
  if (!object || object[_toStringTag.default] !== 'Map' && !(object instanceof _map.default)) {
    return null;
  }

  var mapChanged = object.mapChanged;
  var unsubscribe;

  if (mapChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(mapChanged.subscribe(function (_ref7) {
      var type = _ref7.type,
          key = _ref7.key,
          oldValue = _ref7.oldValue,
          newValue = _ref7.newValue;

      if (!unsubscribe && oldValue === newValue) {
        return;
      }

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

  var forEach = function forEach(callbackfn, isSubscribe) {
    if (keys) {
      for (var i = 0, len = keys.length; i < len; i++) {
        var _key = keys[i];

        if (!isSubscribe) {
          callbackfn(void 0, _constants.COLLECTION_PREFIX + _key);
        }

        if (object.has(_key)) {
          callbackfn(object.get(_key), _constants.COLLECTION_PREFIX + _key);
        }

        if (isSubscribe) {
          callbackfn(void 0, _constants.COLLECTION_PREFIX + _key);
        }
      }
    } else {
      for (var _iterator3 = object, _isArray3 = (0, _isArray4.default)(_iterator3), _i5 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);;) {
        var _ref8;

        if (_isArray3) {
          if (_i5 >= _iterator3.length) break;
          _ref8 = _iterator3[_i5++];
        } else {
          _i5 = _iterator3.next();
          if (_i5.done) break;
          _ref8 = _i5.value;
        }

        var entry = _ref8;

        if (!keyPredicate || keyPredicate(entry[0], object)) {
          callbackfn(entry[1], _constants.COLLECTION_PREFIX + entry[0]);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(subscribeItem, true);
  } else if (unsubscribe == null) {
    return null;
  }

  return function () {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    forEach(unsubscribeItem, false);
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

    if (_propertyName4 === _constants.ANY) {
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

      if (_propertyName5 === _constants.ANY) {
        return null;
      }

      propertyNamesMap[_propertyName5] = true;
    }

    return function (propName) {
      return !!propertyNamesMap[propName];
    };
  }
}

var SubscribeObjectType;
exports.SubscribeObjectType = SubscribeObjectType;

(function (SubscribeObjectType) {
  SubscribeObjectType[SubscribeObjectType["Property"] = 0] = "Property";
  SubscribeObjectType[SubscribeObjectType["ValueProperty"] = 1] = "ValueProperty";
})(SubscribeObjectType || (exports.SubscribeObjectType = SubscribeObjectType = {}));

var RuleSubscribe =
/*#__PURE__*/
function (_Rule) {
  (0, _inherits2.default)(RuleSubscribe, _Rule);

  function RuleSubscribe() {
    (0, _classCallCheck2.default)(this, RuleSubscribe);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribe).call(this, _rules.RuleType.Action));
  }

  (0, _createClass2.default)(RuleSubscribe, [{
    key: "clone",
    value: function clone() {
      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleSubscribe.prototype), "clone", this).call(this);
      var subscribe = this.subscribe;

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
  }]);
  return RuleSubscribe;
}(_rules2.Rule);

exports.RuleSubscribe = RuleSubscribe;

var RuleSubscribeObject =
/*#__PURE__*/
function (_RuleSubscribe) {
  (0, _inherits2.default)(RuleSubscribeObject, _RuleSubscribe);

  function RuleSubscribeObject(type, propertyPredicate) {
    var _this;

    for (var _len3 = arguments.length, propertyNames = new Array(_len3 > 2 ? _len3 - 2 : 0), _key2 = 2; _key2 < _len3; _key2++) {
      propertyNames[_key2 - 2] = arguments[_key2];
    }

    (0, _classCallCheck2.default)(this, RuleSubscribeObject);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeObject).call(this));

    if (propertyNames && !propertyNames.length) {
      propertyNames = null;
    }

    if (propertyPredicate) {
      if (typeof propertyPredicate !== 'function') {
        throw new Error("propertyPredicate (" + propertyPredicate + ") is not a function");
      }
    } else if (type === SubscribeObjectType.Property) {
      propertyPredicate = createPropertyPredicate(propertyNames);

      if (!propertyPredicate) {
        propertyNames = null;
      }
    }

    switch (type) {
      case SubscribeObjectType.Property:
        // @ts-ignore
        _this.subscribe = (0, _bind.default)(subscribeObject).call(subscribeObject, null, propertyNames, propertyPredicate);
        break;

      case SubscribeObjectType.ValueProperty:
        _this.subType = type; // @ts-ignore

        _this.subscribe = (0, _bind.default)(subscribeObjectValue).call(subscribeObjectValue, null, propertyNames);
        break;

      default:
        throw new Error("Unknown SubscribeObjectType: " + type);
    }

    return _this;
  }

  return RuleSubscribeObject;
}(RuleSubscribe); // endregion
// region RuleSubscribeMap


exports.RuleSubscribeObject = RuleSubscribeObject;

function createKeyPredicate(keys) {
  if (!keys || !keys.length) {
    return null;
  }

  if (keys.length === 1) {
    var _key3 = keys[0]; // @ts-ignore

    if (_key3 === _constants.ANY) {
      return null;
    }

    return function (k) {
      return k === _key3;
    };
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      var _key4 = keys[i]; // @ts-ignore

      if (_key4 === _constants.ANY) {
        return null;
      }
    }

    return function (k) {
      return (0, _indexOf.default)(keys).call(keys, k) >= 0;
    };
  }
}

var RuleSubscribeMap =
/*#__PURE__*/
function (_RuleSubscribe2) {
  (0, _inherits2.default)(RuleSubscribeMap, _RuleSubscribe2);

  function RuleSubscribeMap(keyPredicate) {
    var _this2;

    for (var _len4 = arguments.length, keys = new Array(_len4 > 1 ? _len4 - 1 : 0), _key5 = 1; _key5 < _len4; _key5++) {
      keys[_key5 - 1] = arguments[_key5];
    }

    (0, _classCallCheck2.default)(this, RuleSubscribeMap);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeMap).call(this));

    if (keys && !keys.length) {
      keys = null;
    }

    if (keyPredicate) {
      if (typeof keyPredicate !== 'function') {
        throw new Error("keyPredicate (" + keyPredicate + ") is not a function");
      }
    } else {
      keyPredicate = createKeyPredicate(keys);

      if (!keyPredicate) {
        keys = null;
      }
    } // @ts-ignore


    _this2.subscribe = (0, _bind.default)(subscribeMap).call(subscribeMap, null, keys, keyPredicate);
    return _this2;
  }

  return RuleSubscribeMap;
}(RuleSubscribe); // endregion
// region RuleSubscribeCollection


exports.RuleSubscribeMap = RuleSubscribeMap;

var RuleSubscribeCollection =
/*#__PURE__*/
function (_RuleSubscribe3) {
  (0, _inherits2.default)(RuleSubscribeCollection, _RuleSubscribe3);

  function RuleSubscribeCollection() {
    var _this3;

    (0, _classCallCheck2.default)(this, RuleSubscribeCollection);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeCollection).call(this)); // @ts-ignore

    _this3.subscribe = subscribeCollection;
    return _this3;
  }

  return RuleSubscribeCollection;
}(RuleSubscribe); // endregion


exports.RuleSubscribeCollection = RuleSubscribeCollection;
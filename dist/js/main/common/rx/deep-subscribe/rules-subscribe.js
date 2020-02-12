"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.hasDefaultProperty = hasDefaultProperty;
exports.getChangeId = getChangeId;
exports.RuleSubscribeChange = exports.RuleSubscribeCollection = exports.RuleSubscribeMap = exports.RuleSubscribeObject = exports.RuleSubscribe = exports.SubscribeObjectType = void 0;

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

var _isArray3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../helpers/helpers");

var _valueProperty = require("../../helpers/value-property");

var _IListChanged = require("../../lists/contracts/IListChanged");

var _IMapChanged = require("../../lists/contracts/IMapChanged");

var _ISetChanged = require("../../lists/contracts/ISetChanged");

var _common = require("./contracts/common");

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _rules2 = require("./rules");

/* tslint:disable:no-identical-functions */
function forEachCollection(iterable, changeItem, isSubscribe) {
  for (var _iterator = iterable, _isArray = (0, _isArray3.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var item = _ref;

    if (isSubscribe) {
      changeItem(null, void 0, item, _common.ValueChangeType.Subscribe, _common.ValueKeyType.CollectionAny);
    } else {
      changeItem(null, item, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.CollectionAny);
    }
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

function subscribeObjectValue(propertyNames, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!(object instanceof Object)) {
    changeItem(null, void 0, object, _common.ValueChangeType.Subscribe, null);
    return null;
  }

  if (object.constructor === Object || (0, _isArray3.default)(object)) {
    changeItem(null, void 0, object, _common.ValueChangeType.Subscribe, null);
    return function () {
      changeItem(null, object, void 0, _common.ValueChangeType.Unsubscribe, null);
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
      changeItem(null, void 0, object, _common.ValueChangeType.Subscribe, null);
    } else {
      var value = object[propertyName];

      if (typeof value !== 'undefined') {
        changeItem(propertyName, void 0, value, _common.ValueChangeType.Subscribe, _common.ValueKeyType.ValueProperty);
      }

      if (isFirst) {
        changeItem(propertyName, void 0, void 0, _common.ValueChangeType.Subscribe, _common.ValueKeyType.ValueProperty);
      }
    }
  };

  var unsubscribeProperty = function unsubscribeProperty(isLast) {
    if (subscribePropertyName == null) {
      changeItem(null, object, void 0, _common.ValueChangeType.Unsubscribe, null);
    } else {
      if (isLast) {
        changeItem(subscribePropertyName, void 0, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.ValueProperty);
      }

      var value = object[subscribePropertyName];

      if (typeof value !== 'undefined') {
        changeItem(subscribePropertyName, value, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.ValueProperty);
      }
    }

    subscribePropertyName = null;
  };

  var propertyChanged = object.propertyChanged;
  var unsubscribe;
  var subscribed;

  if (propertyChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(propertyChanged.subscribe(function (_ref2) {
      var name = _ref2.name,
          oldValue = _ref2.oldValue,
          newValue = _ref2.newValue;

      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      }

      var newSubscribePropertyName = getSubscribePropertyName();

      if (name === subscribePropertyName) {
        if (subscribePropertyName === newSubscribePropertyName && subscribePropertyName != null && unsubscribe != null && typeof oldValue !== 'undefined' && typeof newValue !== 'undefined') {
          changeItem(subscribePropertyName, oldValue, newValue, _common.ValueChangeType.Changed, _common.ValueKeyType.ValueProperty);
          return;
        }

        if (typeof oldValue !== 'undefined') {
          changeItem(subscribePropertyName, oldValue, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.ValueProperty);
        }
      } else if (subscribePropertyName !== newSubscribePropertyName) {
        unsubscribeProperty(false);
      } else {
        return;
      }

      if (unsubscribe != null) {
        subscribeProperty(newSubscribePropertyName, false);
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  if (immediateSubscribe) {
    subscribeProperty(getSubscribePropertyName(), true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    unsubscribeProperty(true);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeObject


var allowSubscribePrototype = true;

function hasDefaultProperty(object) {
  return object instanceof Object && (allowSubscribePrototype ? _valueProperty.VALUE_PROPERTY_DEFAULT in object : Object.prototype.hasOwnProperty.call(object, _valueProperty.VALUE_PROPERTY_DEFAULT)) && object.constructor !== Object && !(0, _isArray3.default)(object);
}

function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!(object instanceof Object)) {
    return null;
  }

  var propertyChanged = object.propertyChanged;
  var unsubscribe;
  var subscribed;

  if (propertyChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(propertyChanged.subscribe(function (_ref3) {
      var name = _ref3.name,
          oldValue = _ref3.oldValue,
          newValue = _ref3.newValue;

      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      } // PROF: 623 - 1.3%


      if (!propertyPredicate || propertyPredicate(name, object)) {
        if (unsubscribe && typeof oldValue !== 'undefined' && typeof newValue !== 'undefined') {
          changeItem(name, oldValue, newValue, _common.ValueChangeType.Changed, _common.ValueKeyType.Property);
        } else {
          if (typeof oldValue !== 'undefined') {
            changeItem(name, oldValue, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.Property);
          }

          if (unsubscribe && typeof newValue !== 'undefined') {
            changeItem(name, void 0, newValue, _common.ValueChangeType.Subscribe, _common.ValueKeyType.Property);
          }
        }
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  var forEach = function forEach(isSubscribe) {
    if (propertyNames == null) {
      for (var _propertyName2 in object) {
        if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, _propertyName2)) && (!propertyPredicate || propertyPredicate(_propertyName2, object))) {
          if (isSubscribe) {
            changeItem(_propertyName2, void 0, object[_propertyName2], _common.ValueChangeType.Subscribe, _common.ValueKeyType.Property);
          } else {
            changeItem(_propertyName2, object[_propertyName2], void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.Property);
          }
        }
      }
    } else {
      if ((0, _isArray3.default)(propertyNames)) {
        for (var i = 0, len = propertyNames.length; i < len; i++) {
          var _propertyName3 = propertyNames[i];

          if (!isSubscribe) {
            changeItem(_propertyName3, void 0, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.Property);
          }

          if (allowSubscribePrototype ? _propertyName3 in object : Object.prototype.hasOwnProperty.call(object, _propertyName3)) {
            var value = object[_propertyName3];

            if (typeof value !== 'undefined') {
              if (isSubscribe) {
                changeItem(_propertyName3, void 0, value, _common.ValueChangeType.Subscribe, _common.ValueKeyType.Property);
              } else {
                changeItem(_propertyName3, value, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.Property);
              }
            }
          }

          if (isSubscribe) {
            changeItem(_propertyName3, void 0, void 0, _common.ValueChangeType.Subscribe, _common.ValueKeyType.Property);
          }
        }
      } else {
        if (!isSubscribe) {
          changeItem(propertyNames, void 0, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.Property);
        }

        if (allowSubscribePrototype ? propertyNames in object : Object.prototype.hasOwnProperty.call(object, propertyNames)) {
          var _value = object[propertyNames];

          if (typeof _value !== 'undefined') {
            if (isSubscribe) {
              changeItem(propertyNames, void 0, _value, _common.ValueChangeType.Subscribe, _common.ValueKeyType.Property);
            } else {
              changeItem(propertyNames, _value, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.Property);
            }
          }
        }

        if (isSubscribe) {
          changeItem(propertyNames, void 0, void 0, _common.ValueChangeType.Subscribe, _common.ValueKeyType.Property);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEach(false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeIterable


function subscribeIterable(object, immediateSubscribe, changeItem) {
  if (!object || typeof object === 'string' || !(0, _helpers.isIterable)(object)) {
    return null;
  }

  if (immediateSubscribe) {
    forEachCollection(object, changeItem, true);
  } else {
    return null;
  }

  return function () {
    forEachCollection(object, changeItem, false);
  };
} // endregion
// region subscribeList


function subscribeList(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[_toStringTag.default] !== 'List') {
    return null;
  }

  var listChanged = object.listChanged;
  var unsubscribe;
  var subscribed;

  if (listChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(listChanged.subscribe(function (_ref4) {
      var type = _ref4.type,
          oldItems = _ref4.oldItems,
          newItems = _ref4.newItems;

      if (!subscribed) {
        return;
      }

      switch (type) {
        case _IListChanged.ListChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              changeItem(null, void 0, newItems[i], _common.ValueChangeType.Subscribe, _common.ValueKeyType.CollectionAny);
            }
          }

          break;

        case _IListChanged.ListChangedType.Removed:
          for (var _i2 = 0, _len = oldItems.length; _i2 < _len; _i2++) {
            changeItem(null, oldItems[_i2], void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.CollectionAny);
          }

          break;

        case _IListChanged.ListChangedType.Set:
          if (unsubscribe) {
            changeItem(null, oldItems[0], newItems[0], _common.ValueChangeType.Changed, _common.ValueKeyType.CollectionAny);
          } else if (oldItems[0] !== newItems[0]) {
            changeItem(null, oldItems[0], void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.CollectionAny);
          }

          break;
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  if (immediateSubscribe) {
    forEachCollection(object, changeItem, true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEachCollection(object, changeItem, false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeSet


function subscribeSet(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[_toStringTag.default] !== 'Set' && !(object instanceof _set.default)) {
    return null;
  }

  var setChanged = object.setChanged;
  var unsubscribe;
  var subscribed;

  if (setChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(setChanged.subscribe(function (_ref5) {
      var type = _ref5.type,
          oldItems = _ref5.oldItems,
          newItems = _ref5.newItems;

      if (!subscribed) {
        return;
      }

      switch (type) {
        case _ISetChanged.SetChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              changeItem(null, void 0, newItems[i], _common.ValueChangeType.Subscribe, _common.ValueKeyType.CollectionAny);
            }
          }

          break;

        case _ISetChanged.SetChangedType.Removed:
          for (var _i3 = 0, _len2 = oldItems.length; _i3 < _len2; _i3++) {
            changeItem(null, oldItems[_i3], void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.CollectionAny);
          }

          break;
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  if (immediateSubscribe) {
    forEachCollection(object, changeItem, true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEachCollection(object, changeItem, false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeMap


function subscribeMap(keys, keyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[_toStringTag.default] !== 'Map' && !(object instanceof _map.default)) {
    return null;
  }

  var mapChanged = object.mapChanged;
  var unsubscribe;
  var subscribed;

  if (mapChanged) {
    unsubscribe = (0, _helpers.checkIsFuncOrNull)(mapChanged.subscribe(function (_ref6) {
      var type = _ref6.type,
          key = _ref6.key,
          oldValue = _ref6.oldValue,
          newValue = _ref6.newValue;

      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      }

      if (!keyPredicate || keyPredicate(key, object)) {
        switch (type) {
          case _IMapChanged.MapChangedType.Added:
            if (unsubscribe) {
              changeItem(key, void 0, newValue, _common.ValueChangeType.Subscribe, _common.ValueKeyType.MapKey);
            }

            break;

          case _IMapChanged.MapChangedType.Removed:
            changeItem(key, oldValue, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.MapKey);
            break;

          case _IMapChanged.MapChangedType.Set:
            if (unsubscribe) {
              changeItem(key, oldValue, newValue, _common.ValueChangeType.Changed, _common.ValueKeyType.MapKey);
            } else {
              changeItem(key, oldValue, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.MapKey);
            }

            break;
        }
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  var forEach = function forEach(isSubscribe) {
    if (keys) {
      for (var i = 0, len = keys.length; i < len; i++) {
        var _key = keys[i];

        if (!isSubscribe) {
          changeItem(_key, void 0, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.MapKey);
        }

        if (object.has(_key)) {
          if (isSubscribe) {
            changeItem(_key, void 0, object.get(_key), _common.ValueChangeType.Subscribe, _common.ValueKeyType.MapKey);
          } else {
            changeItem(_key, object.get(_key), void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.MapKey);
          }
        }

        if (isSubscribe) {
          changeItem(_key, void 0, void 0, _common.ValueChangeType.Subscribe, _common.ValueKeyType.MapKey);
        }
      }
    } else {
      for (var _iterator2 = object, _isArray2 = (0, _isArray3.default)(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
        var _ref7;

        if (_isArray2) {
          if (_i4 >= _iterator2.length) break;
          _ref7 = _iterator2[_i4++];
        } else {
          _i4 = _iterator2.next();
          if (_i4.done) break;
          _ref7 = _i4.value;
        }

        var entry = _ref7;

        if (!keyPredicate || keyPredicate(entry[0], object)) {
          if (isSubscribe) {
            changeItem(entry[0], void 0, entry[1], _common.ValueChangeType.Subscribe, _common.ValueKeyType.MapKey);
          } else {
            changeItem(entry[0], entry[1], void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.MapKey);
          }
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEach(false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeCollection


function subscribeCollection(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object) {
    return null;
  }

  var unsubscribeList = subscribeList(object, immediateSubscribe, changeItem, propertiesPath, rule);
  var unsubscribeSet = subscribeSet(object, immediateSubscribe, changeItem, propertiesPath, rule);
  var unsubscribeMap = subscribeMap(null, null, object, immediateSubscribe, changeItem, propertiesPath, rule);
  var unsubscribeIterable;

  if (!unsubscribeList && !unsubscribeSet && !unsubscribeMap) {
    unsubscribeIterable = subscribeIterable(object, immediateSubscribe, changeItem);

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
// region subscribeChange


var _changeId = 0;

function getChangeId() {
  return ++_changeId;
}

function subscribeChange(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object) {
    return null;
  }

  var propertyChanged = object.propertyChanged,
      listChanged = object.listChanged,
      setChanged = object.setChanged,
      mapChanged = object.mapChanged;

  if (!propertyChanged && !listChanged && !setChanged && !mapChanged) {
    return null;
  }

  var changeId;

  var onChange = function onChange() {
    if (changeId != null) {
      var oldValue = changeId;
      changeId = getChangeId();
      changeItem(null, oldValue, changeId, _common.ValueChangeType.Changed, _common.ValueKeyType.ChangeCount);
    }
  };

  var unsubscribeObject = propertyChanged && propertyChanged.subscribe(onChange);
  var unsubscribeList = listChanged && listChanged.subscribe(onChange);
  var unsubscribeSet = setChanged && setChanged.subscribe(onChange);
  var unsubscribeMap = mapChanged && mapChanged.subscribe(onChange);
  changeId = getChangeId();
  changeItem(null, void 0, changeId, _common.ValueChangeType.Subscribe, _common.ValueKeyType.ChangeCount);
  return function () {
    if (unsubscribeObject) {
      unsubscribeObject();
    }

    if (unsubscribeList) {
      unsubscribeList();
    }

    if (unsubscribeSet) {
      unsubscribeSet();
    }

    if (unsubscribeMap) {
      unsubscribeMap();
    }

    changeItem(null, changeId, void 0, _common.ValueChangeType.Unsubscribe, _common.ValueKeyType.ChangeCount);
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

  function RuleSubscribe(description) {
    (0, _classCallCheck2.default)(this, RuleSubscribe);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribe).call(this, _rules.RuleType.Action, description));
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

  function RuleSubscribeObject(type, propertyPredicate, description) {
    var _this;

    for (var _len3 = arguments.length, propertyNames = new Array(_len3 > 3 ? _len3 - 3 : 0), _key2 = 3; _key2 < _len3; _key2++) {
      propertyNames[_key2 - 3] = arguments[_key2];
    }

    (0, _classCallCheck2.default)(this, RuleSubscribeObject);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeObject).call(this, description));

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

  function RuleSubscribeMap(keyPredicate, description) {
    var _this2;

    for (var _len4 = arguments.length, keys = new Array(_len4 > 2 ? _len4 - 2 : 0), _key5 = 2; _key5 < _len4; _key5++) {
      keys[_key5 - 2] = arguments[_key5];
    }

    (0, _classCallCheck2.default)(this, RuleSubscribeMap);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeMap).call(this, description));

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

  function RuleSubscribeCollection(description) {
    var _this3;

    (0, _classCallCheck2.default)(this, RuleSubscribeCollection);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeCollection).call(this, description)); // @ts-ignore

    _this3.subscribe = subscribeCollection;
    return _this3;
  }

  return RuleSubscribeCollection;
}(RuleSubscribe); // endregion
// region RuleSubscribeChange


exports.RuleSubscribeCollection = RuleSubscribeCollection;

var RuleSubscribeChange =
/*#__PURE__*/
function (_RuleSubscribe4) {
  (0, _inherits2.default)(RuleSubscribeChange, _RuleSubscribe4);

  function RuleSubscribeChange(description) {
    var _this4;

    (0, _classCallCheck2.default)(this, RuleSubscribeChange);
    _this4 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleSubscribeChange).call(this, description)); // @ts-ignore

    _this4.subscribe = subscribeChange;
    return _this4;
  }

  return RuleSubscribeChange;
}(RuleSubscribe); // endregion


exports.RuleSubscribeChange = RuleSubscribeChange;
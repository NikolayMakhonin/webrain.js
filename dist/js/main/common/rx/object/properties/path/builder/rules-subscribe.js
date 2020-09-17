"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.subscribeObjectValue = subscribeObjectValue;
exports.hasDefaultProperty = hasDefaultProperty;
exports.subscribeObject = subscribeObject;
exports.subscribeMap = subscribeMap;
exports.subscribeCollection = subscribeCollection;
exports.subscribeChange = subscribeChange;
exports.createSubscribeObject = createSubscribeObject;
exports.createSubscribeMap = createSubscribeMap;
exports.RuleSubscribe = exports.SubscribeObjectType = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../../../../helpers/helpers");

var _valueProperty = require("../../../../../helpers/value-property");

var _common = require("./contracts/common");

var _constants = require("./contracts/constants");

var _rules = require("./contracts/rules");

var _rules2 = require("./rules");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function _createForOfIteratorHelperLoose(o) { var _context2; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context2 = i.next).call(_context2, i); }

function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function forEachCollection(object, changeItem) {
  for (var _iterator = _createForOfIteratorHelperLoose(object), _step; !(_step = _iterator()).done;) {
    var item = _step.value;
    changeItem(item, object, null, _common.ValueKeyType.CollectionAny);
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

function subscribeObjectValue(propertyNames, object, changeItem) {
  if (!(object instanceof Object)) {
    changeItem(object, object, null, null);
    return null;
  }

  if (object.constructor === Object || (0, _isArray.default)(object)) {
    changeItem(object, object, null, null);
  }

  if (allowSubscribePrototype ? !(_valueProperty.VALUE_PROPERTY_DEFAULT in object) : !Object.prototype.hasOwnProperty.call(object, _valueProperty.VALUE_PROPERTY_DEFAULT)) {
    return null;
  }

  var propertyName = getFirstExistProperty(object, propertyNames);

  if (propertyName == null) {
    propertyName = _valueProperty.VALUE_PROPERTY_DEFAULT;
  }

  if (propertyName == null) {
    changeItem(object, object, null, null);
  } else {
    var value = object[propertyName];

    if (typeof value !== 'undefined') {
      changeItem(value, object, propertyName, _common.ValueKeyType.ValueProperty);
    }
  }
} // endregion
// region subscribeObject


var allowSubscribePrototype = true;

function hasDefaultProperty(object) {
  return object instanceof Object && (allowSubscribePrototype ? _valueProperty.VALUE_PROPERTY_DEFAULT in object : Object.prototype.hasOwnProperty.call(object, _valueProperty.VALUE_PROPERTY_DEFAULT)) && object.constructor !== Object && !(0, _isArray.default)(object);
}

function subscribeObject(propertyNames, propertyPredicate, object, changeItem) {
  if (!(object instanceof Object)) {
    return null;
  }

  if (propertyNames == null) {
    for (var _propertyName2 in object) {
      if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, _propertyName2)) && (!propertyPredicate || propertyPredicate(_propertyName2, object))) {
        changeItem(object[_propertyName2], object, _propertyName2, _common.ValueKeyType.Property);
      }
    }
  } else {
    if ((0, _isArray.default)(propertyNames)) {
      for (var i = 0, len = propertyNames.length; i < len; i++) {
        var _propertyName3 = propertyNames[i];

        if (allowSubscribePrototype ? _propertyName3 in object : Object.prototype.hasOwnProperty.call(object, _propertyName3)) {
          var value = object[_propertyName3];

          if (typeof value !== 'undefined') {
            changeItem(value, object, _propertyName3, _common.ValueKeyType.Property);
          }
        }
      }
    } else {
      if (allowSubscribePrototype ? propertyNames in object : Object.prototype.hasOwnProperty.call(object, propertyNames)) {
        var _value = object[propertyNames];

        if (typeof _value !== 'undefined') {
          changeItem(_value, object, propertyNames, _common.ValueKeyType.Property);
        }
      }
    }
  }
} // endregion
// region subscribeMap


function subscribeMap(keys, keyPredicate, object, changeItem) {
  if (!object || object[_toStringTag.default] !== 'Map' && !(object instanceof _map.default)) {
    return null;
  }

  if (keys) {
    for (var i = 0, len = keys.length; i < len; i++) {
      var _key = keys[i];

      if (object.has(_key)) {
        changeItem(object.get(_key), object, _key, _common.ValueKeyType.MapKey);
      }
    }
  } else {
    for (var _iterator2 = _createForOfIteratorHelperLoose(object), _step2; !(_step2 = _iterator2()).done;) {
      var entry = _step2.value;

      if (!keyPredicate || keyPredicate(entry[0], object)) {
        changeItem(entry[1], object, entry[0], _common.ValueKeyType.MapKey);
      }
    }
  }
} // endregion
// region subscribeCollection


function subscribeCollection(object, changeItem) {
  if (!(0, _helpers.isIterable)(object)) {
    return null;
  }

  if ((0, _isArray.default)(object)) {
    for (var i = 0, len = object.length; i < len; i++) {
      changeItem(object[i], object, i, _common.ValueKeyType.Index);
    }
  } else if (object instanceof _map.default || object[_toStringTag.default] === 'Map') {
    subscribeMap(null, null, object, changeItem);
  } else {
    forEachCollection(object, changeItem);
  }

  return null;
} // endregion
// region subscribeChange


function subscribeChange(object) {
  if (!(0, _helpers.isIterable)(object)) {
    return null;
  }

  (0, _getIterator2.default)(object);
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

var RuleSubscribe = /*#__PURE__*/function (_Rule) {
  (0, _inherits2.default)(RuleSubscribe, _Rule);

  var _super = _createSuper(RuleSubscribe);

  function RuleSubscribe(subscribe, subType, description) {
    var _this;

    (0, _classCallCheck2.default)(this, RuleSubscribe);
    _this = _super.call(this, _rules.RuleType.Action, description);
    _this.subscribe = subscribe;
    _this.subType = subType;
    return _this;
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

function createSubscribeObject(subType, propertyPredicate) {
  for (var _len = arguments.length, propertyNames = new Array(_len > 2 ? _len - 2 : 0), _key2 = 2; _key2 < _len; _key2++) {
    propertyNames[_key2 - 2] = arguments[_key2];
  }

  if (propertyNames && !propertyNames.length) {
    propertyNames = null;
  }

  if (propertyPredicate) {
    if (typeof propertyPredicate !== 'function') {
      throw new Error("propertyPredicate (" + propertyPredicate + ") is not a function");
    }
  } else if (subType === SubscribeObjectType.Property) {
    propertyPredicate = createPropertyPredicate(propertyNames);

    if (!propertyPredicate) {
      propertyNames = null;
    }
  }

  switch (subType) {
    case SubscribeObjectType.Property:
      return function (object, changeItem) {
        return subscribeObject(propertyNames, propertyPredicate, object, changeItem);
      };

    case SubscribeObjectType.ValueProperty:
      return function (object, changeItem) {
        subscribeObjectValue(propertyNames, object, changeItem);
      };

    default:
      throw new Error("Unknown SubscribeObjectType: " + subType);
  }
} // endregion
// region RuleSubscribeMap


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

function createSubscribeMap(keyPredicate) {
  for (var _len2 = arguments.length, keys = new Array(_len2 > 1 ? _len2 - 1 : 0), _key5 = 1; _key5 < _len2; _key5++) {
    keys[_key5 - 1] = arguments[_key5];
  }

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
  }

  return function (object, changeItem) {
    subscribeMap(keys, keyPredicate, object, changeItem);
  };
} // endregion
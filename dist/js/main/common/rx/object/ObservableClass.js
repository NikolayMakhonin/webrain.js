"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports._setExt = _setExt;
exports._set = _set;
exports.ObservableClass = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _webrainOptions = require("../../helpers/webrainOptions");

require("../extensions/autoConnect");

var _PropertyChangedObject = require("./PropertyChangedObject");

var ObservableClass =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inherits2.default)(ObservableClass, _PropertyChangedObjec);

  /** @internal */
  function ObservableClass() {
    var _this;

    (0, _classCallCheck2.default)(this, ObservableClass);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ObservableClass).call(this));
    (0, _defineProperty.default)((0, _assertThisInitialized2.default)(_this), '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
    return _this;
  }

  return ObservableClass;
}(_PropertyChangedObject.PropertyChangedObject);
/** @internal */


exports.ObservableClass = ObservableClass;

function _setExt(name, getValue, setValue, options, object, newValue) {
  if (!options) {
    return _set(name, getValue, setValue, object, newValue);
  }

  var oldValue = getValue ? getValue.call(object) : object.__fields[name];
  var equalsFunc = options.equalsFunc || _webrainOptions.webrainOptions.equalsFunc;

  if (oldValue === newValue || equalsFunc && equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  var fillFunc = options.fillFunc;

  if (fillFunc && oldValue != null && newValue != null && fillFunc.call(object, oldValue, newValue)) {
    return false;
  }

  var convertFunc = options.convertFunc;

  if (convertFunc) {
    newValue = convertFunc.call(object, newValue);
  } // if (oldValue === newValue) {
  // 	return false
  // }


  var beforeChange = options.beforeChange;

  if (beforeChange) {
    beforeChange.call(object, oldValue);
  }

  if (setValue) {
    setValue.call(object, newValue);
  } else {
    object.__fields[name] = newValue;
  }

  if (!options || !options.suppressPropertyChanged) {
    var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: name,
        oldValue: oldValue,
        newValue: newValue
      });
    }
  }

  var afterChange = options.afterChange;

  if (afterChange) {
    afterChange.call(object, newValue);
  }

  return true;
}
/** @internal */


function _set(name, getValue, setValue, object, newValue) {
  var oldValue = getValue.call(object);

  if (oldValue === newValue || _webrainOptions.webrainOptions.equalsFunc && _webrainOptions.webrainOptions.equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  setValue.call(object, newValue);
  var _object$__meta = object.__meta,
      propertyChangedDisabled = _object$__meta.propertyChangedDisabled,
      propertyChanged = _object$__meta.propertyChanged;

  if (!propertyChangedDisabled && propertyChanged) {
    propertyChanged.emit({
      name: name,
      oldValue: oldValue,
      newValue: newValue
    });
  }

  return true;
}
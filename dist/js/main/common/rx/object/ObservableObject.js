"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports._setExt = _setExt;
exports._set = _set;
exports.ObservableObject = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

require("../extensions/autoConnect");

var _PropertyChangedObject = require("./PropertyChangedObject");

var ObservableObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inheritsLoose2.default)(ObservableObject, _PropertyChangedObjec);

  /** @internal */
  function ObservableObject() {
    var _this;

    _this = _PropertyChangedObjec.call(this) || this;
    (0, _defineProperty.default)((0, _assertThisInitialized2.default)(_this), '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
    return _this;
  }

  return ObservableObject;
}(_PropertyChangedObject.PropertyChangedObject);
/** @internal */


exports.ObservableObject = ObservableObject;

function _setExt(name, getValue, setValue, options, object, newValue) {
  if (!options) {
    return _set(name, getValue, setValue, object, newValue);
  }

  var oldValue = getValue ? getValue(object) : object.__fields[name];
  var equalsFunc = options.equalsFunc;

  if (equalsFunc ? equalsFunc.call(object, oldValue, newValue) : oldValue === newValue) {
    return false;
  }

  var fillFunc = options.fillFunc;

  if (fillFunc && oldValue != null && newValue != null && fillFunc.call(object, oldValue, newValue)) {
    return false;
  }

  var convertFunc = options.convertFunc;

  if (convertFunc) {
    newValue = convertFunc.call(object, newValue);
  }

  if (oldValue === newValue) {
    return false;
  }

  var beforeChange = options.beforeChange;

  if (beforeChange) {
    beforeChange.call(object, oldValue);
  }

  if (setValue) {
    setValue(object, newValue);
  } else {
    object.__fields[name] = newValue;
  }

  var afterChange = options.afterChange;

  if (afterChange) {
    afterChange.call(object, newValue);
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

  return true;
}
/** @internal */


function _set(name, getValue, setValue, object, newValue) {
  var oldValue = getValue(object);

  if (oldValue === newValue) {
    return false;
  }

  setValue(object, newValue);
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
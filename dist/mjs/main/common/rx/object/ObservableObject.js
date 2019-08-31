import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import '../extensions/autoConnect';
import { PropertyChangedObject } from './PropertyChangedObject';
export var ObservableObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(ObservableObject, _PropertyChangedObjec);

  /** @internal */
  function ObservableObject() {
    var _this;

    _classCallCheck(this, ObservableObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableObject).call(this));
    Object.defineProperty(_assertThisInitialized(_this), '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
    return _this;
  }

  return ObservableObject;
}(PropertyChangedObject);
/** @internal */

export function _setExt(name, getValue, setValue, options, object, newValue) {
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

export function _set(name, getValue, setValue, object, newValue) {
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
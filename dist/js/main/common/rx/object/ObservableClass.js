"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports._setExt = _setExt;
exports._set = _set;
exports.ObservableClass = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _helpers = require("../../helpers/helpers");

var _webrainOptions = require("../../helpers/webrainOptions");

var _CallState = require("../../rx/depend/core/CallState");

var _PropertyChangedObject = require("./PropertyChangedObject");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var ObservableClass = /*#__PURE__*/function (_PropertyChangedObjec) {
  (0, _inherits2.default)(ObservableClass, _PropertyChangedObjec);

  var _super = _createSuper(ObservableClass);

  /** @internal */
  function ObservableClass() {
    var _this;

    (0, _classCallCheck2.default)(this, ObservableClass);
    _this = _super.call(this);
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

function _setExt(name, getValue, setValue, options, newValue) {
  if (!options) {
    return _set.call(this, name, getValue, setValue, newValue);
  }

  var oldValue = getValue ? getValue.call(this) : this.__fields[name];
  var equalsFunc = options.equalsFunc || _webrainOptions.webrainOptions.equalsFunc;

  if ((0, _helpers.equals)(oldValue, newValue) || equalsFunc && equalsFunc.call(this, oldValue, newValue)) {
    return false;
  }

  var fillFunc = options.fillFunc;

  if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
    return false;
  }

  var convertFunc = options.convertFunc;

  if (convertFunc) {
    newValue = convertFunc.call(this, oldValue, newValue);
  } // TODO uncomment this and run tests
  // if (equals(oldValue, newValue)) {
  // 	return false
  // }


  var beforeChange = options.beforeChange;

  if (beforeChange) {
    beforeChange.call(this, oldValue, newValue);
  }

  if (setValue) {
    setValue.call(this, newValue);
  } else {
    this.__fields[name] = newValue;
  }

  (0, _CallState.invalidateCallState)((0, _CallState.getCallState)(getValue).call(this));

  if (!options || !options.suppressPropertyChanged) {
    var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

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
    afterChange.call(this, oldValue, newValue);
  }

  return true;
}
/** @internal */


function _set(name, getValue, setValue, newValue) {
  var oldValue = getValue.call(this);

  if (_webrainOptions.webrainEquals.call(this, oldValue, newValue)) {
    return false;
  }

  setValue.call(this, newValue);
  (0, _CallState.invalidateCallState)((0, _CallState.getCallState)(getValue).call(this));
  var _this$__meta = this.__meta,
      propertyChangedDisabled = _this$__meta.propertyChangedDisabled,
      propertyChanged = _this$__meta.propertyChanged;

  if (!propertyChangedDisabled && propertyChanged) {
    propertyChanged.emit({
      name: name,
      oldValue: oldValue,
      newValue: newValue
    });
  }

  return true;
}
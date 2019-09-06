"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.SetChangedObject = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

var SetChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inherits2.default)(SetChangedObject, _PropertyChangedObjec);

  function SetChangedObject() {
    (0, _classCallCheck2.default)(this, SetChangedObject);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SetChangedObject).apply(this, arguments));
  }

  (0, _createClass2.default)(SetChangedObject, [{
    key: "onSetChanged",
    value: function onSetChanged(event) {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _setChanged = this._setChanged;

      if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
        return this;
      }

      _setChanged.emit(event);

      return this;
    }
  }, {
    key: "setChanged",
    get: function get() {
      var _setChanged = this._setChanged;

      if (!_setChanged) {
        this._setChanged = _setChanged = new _hasSubscribers.HasSubscribersSubject();
      }

      return _setChanged;
    }
  }, {
    key: "_setChangedIfCanEmit",
    get: function get() {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _setChanged = this._setChanged;
      return !propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers ? _setChanged : null;
    }
  }]);
  return SetChangedObject;
}(_PropertyChangedObject.PropertyChangedObject);

exports.SetChangedObject = SetChangedObject;
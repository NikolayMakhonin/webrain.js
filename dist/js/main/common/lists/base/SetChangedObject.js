"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.SetChangedObject = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

var SetChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inheritsLoose2.default)(SetChangedObject, _PropertyChangedObjec);

  function SetChangedObject() {
    return _PropertyChangedObjec.apply(this, arguments) || this;
  }

  var _proto = SetChangedObject.prototype;

  _proto.onSetChanged = function onSetChanged(event) {
    var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
    var _setChanged = this._setChanged;

    if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
      return this;
    }

    _setChanged.emit(event);

    return this;
  };

  (0, _createClass2.default)(SetChangedObject, [{
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
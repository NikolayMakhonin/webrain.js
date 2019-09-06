"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ListChangedObject = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

var ListChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  (0, _inheritsLoose2.default)(ListChangedObject, _PropertyChangedObjec);

  function ListChangedObject() {
    return _PropertyChangedObjec.apply(this, arguments) || this;
  }

  var _proto = ListChangedObject.prototype;

  _proto.onListChanged = function onListChanged(event) {
    var _listChanged = this._listChanged;

    if (!_listChanged || !_listChanged.hasSubscribers) {
      return this;
    }

    _listChanged.emit(event);

    return this;
  };

  (0, _createClass2.default)(ListChangedObject, [{
    key: "listChanged",
    get: function get() {
      var _listChanged = this._listChanged;

      if (!_listChanged) {
        this._listChanged = _listChanged = new _hasSubscribers.HasSubscribersSubject();
      }

      return _listChanged;
    }
  }, {
    key: "_listChangedIfCanEmit",
    get: function get() {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _listChanged = this._listChanged;
      return !propertyChangedDisabled && _listChanged && _listChanged.hasSubscribers ? _listChanged : null;
    }
  }]);
  return ListChangedObject;
}(_PropertyChangedObject.PropertyChangedObject);

exports.ListChangedObject = ListChangedObject;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Binder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var Binder = /*#__PURE__*/function () {
  function Binder(bind) {
    (0, _classCallCheck2.default)(this, Binder);
    this._bindsCount = 0;
    this._bind = bind;
  }

  (0, _createClass2.default)(Binder, [{
    key: "_unbind",
    value: function _unbind() {
      this._bindsCount--;

      if (this._bindsCount > 0) {
        return;
      }

      if (this._bindsCount < 0) {
        throw new Error('Unexpected behavior: this._bindsCount < 0');
      }

      this.__unbind();

      this.__unbind = null;
    }
  }, {
    key: "bind",
    value: function bind() {
      var _this = this;

      if (this.__unbind == null) {
        if (this._bindsCount !== 0) {
          throw new Error('Unexpected behavior: this._bindsCount !== 0');
        }

        this.__unbind = this._bind();
      } else if (this._bindsCount <= 0) {
        throw new Error('Unexpected behavior: this._bindsCount <= 0');
      }

      this._bindsCount++;
      var wasUnbind = false;
      return function () {
        if (wasUnbind) {
          return;
        }

        wasUnbind = true;

        _this._unbind();
      };
    }
  }]);
  return Binder;
}();

exports.Binder = Binder;
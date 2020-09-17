"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.SourceDestBuilder = exports.SourceDest = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _depend = require("../../../rx/depend/core/depend");

var _Binder = require("./Binder");

var SourceDest = /*#__PURE__*/function () {
  function SourceDest(source, dest) {
    (0, _classCallCheck2.default)(this, SourceDest);
    this._source = source;
    this._dest = typeof dest === 'function' ? dest : function (value) {
      return dest.set(value);
    };
  }

  (0, _createClass2.default)(SourceDest, [{
    key: "getOneWayBinder",
    value: function getOneWayBinder(dest) {
      return this._source.getOneWayBinder(dest);
    }
  }, {
    key: "getTwoWayBinder",
    value: function getTwoWayBinder(sourceDest) {
      var binder1 = this._source.getOneWayBinder(sourceDest);

      var binder2 = sourceDest.getOneWayBinder(this);

      var bind = function bind() {
        var unbind1 = (0, _bind.default)(binder1).call(binder1);
        var unbind2 = (0, _bind.default)(binder2).call(binder2);
        return function () {
          unbind1();
          unbind2();
        };
      };

      return new _Binder.Binder(bind);
    }
  }, {
    key: "set",
    value: function set(value) {
      this._dest(value);
    }
  }]);
  return SourceDest;
}();

exports.SourceDest = SourceDest;
SourceDest.prototype.getOneWayBinder = (0, _depend.depend)(SourceDest.prototype.getOneWayBinder);
SourceDest.prototype.getTwoWayBinder = (0, _depend.depend)(SourceDest.prototype.getTwoWayBinder);

var SourceDestBuilder = /*#__PURE__*/function () {
  function SourceDestBuilder(sourceBuilder, destBuilder) {
    (0, _classCallCheck2.default)(this, SourceDestBuilder);
    this._sourceBuilder = sourceBuilder;
    this._destBuilder = destBuilder;
  }

  (0, _createClass2.default)(SourceDestBuilder, [{
    key: "get",
    value: function get(object) {
      var source = this._sourceBuilder.get(object);

      var dest = this._destBuilder.get(object);

      return new SourceDest(source, dest);
    }
  }]);
  return SourceDestBuilder;
}();

exports.SourceDestBuilder = SourceDestBuilder;
SourceDestBuilder.prototype.get = (0, _depend.depend)(SourceDestBuilder.prototype.get);
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DestPathBuilder = exports.SourcePathBuilder = exports.SourcePath = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _CallState = require("../../../rx/depend/core/CallState");

var _contracts = require("../../../rx/depend/core/contracts");

var _depend = require("../../../rx/depend/core/depend");

var _builder = require("../../object/properties/path/builder");

var _Binder = require("./Binder");

var SourcePath = /*#__PURE__*/function () {
  function SourcePath(getValue) {
    (0, _classCallCheck2.default)(this, SourcePath);
    this._getValue = (0, _depend.depend)(getValue);
  }

  (0, _createClass2.default)(SourcePath, [{
    key: "getOneWayBinder",
    value: function getOneWayBinder(dest) {
      var getValue = this._getValue;
      var destFunc = typeof dest === 'function' ? dest : function (value) {
        return dest.set(value);
      };

      var bind = function bind() {
        return (0, _CallState.subscribeCallState)((0, _CallState.getOrCreateCallState)(getValue)(), function (state) {
          if (state.statusShort === _contracts.CallStatusShort.CalculatedValue) {
            destFunc(state.value);
          }
        });
      };

      return new _Binder.Binder(bind);
    }
  }]);
  return SourcePath;
}();

exports.SourcePath = SourcePath;
SourcePath.prototype.getOneWayBinder = (0, _depend.depend)(SourcePath.prototype.getOneWayBinder);

var SourcePathBuilder = /*#__PURE__*/function () {
  function SourcePathBuilder(pathBuilder) {
    (0, _classCallCheck2.default)(this, SourcePathBuilder);
    this._path = pathBuilder(new _builder.Path()).init();
  }

  (0, _createClass2.default)(SourcePathBuilder, [{
    key: "get",
    value: function get(object) {
      var path = this._path;

      var getValue = function getValue() {
        return path.get(object);
      };

      return new SourcePath(getValue);
    }
  }]);
  return SourcePathBuilder;
}();

exports.SourcePathBuilder = SourcePathBuilder;
SourcePathBuilder.prototype.get = (0, _depend.depend)(SourcePathBuilder.prototype.get);

var DestPathBuilder = /*#__PURE__*/function () {
  function DestPathBuilder(pathBuilder) {
    (0, _classCallCheck2.default)(this, DestPathBuilder);
    this._path = pathBuilder(new _builder.Path()).init();
  }

  (0, _createClass2.default)(DestPathBuilder, [{
    key: "get",
    value: function get(object) {
      var path = this._path;
      return function (value) {
        return path.set(object, value);
      };
    }
  }]);
  return DestPathBuilder;
}();

exports.DestPathBuilder = DestPathBuilder;
DestPathBuilder.prototype.get = (0, _depend.depend)(DestPathBuilder.prototype.get);
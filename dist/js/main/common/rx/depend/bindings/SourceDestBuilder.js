"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.sourceDestBuilder = sourceDestBuilder;
exports.sourceDest = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _depend = require("../../../rx/depend/core/depend");

var _Binder = require("./Binder");

var SourceDest = /*#__PURE__*/function () {
  function SourceDest(source, dest) {
    (0, _classCallCheck2.default)(this, SourceDest);
    this.source = source;
    this.dest = typeof dest === 'function' ? dest : function (value) {
      return dest.set(value);
    };
  }

  (0, _createClass2.default)(SourceDest, [{
    key: "getOneWayBinder",
    value: function getOneWayBinder(dest) {
      return this.source.getOneWayBinder(dest);
    } // tslint:disable-next-line:no-shadowed-variable

  }, {
    key: "getTwoWayBinder",
    value: function getTwoWayBinder(sourceDest) {
      var binder1 = this.source.getOneWayBinder(sourceDest.dest);
      var binder2 = sourceDest.source.getOneWayBinder(this.dest);

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
  }]);
  return SourceDest;
}();

SourceDest.prototype.getOneWayBinder = (0, _depend.depend)(SourceDest.prototype.getOneWayBinder);
SourceDest.prototype.getTwoWayBinder = (0, _depend.depend)(SourceDest.prototype.getTwoWayBinder); // tslint:disable-next-line:no-shadowed-variable

var sourceDest = (0, _depend.depend)(function sourceDest(source, dest) {
  return new SourceDest(source, dest);
});
exports.sourceDest = sourceDest;

var SourceDestBuilder = /*#__PURE__*/function () {
  function SourceDestBuilder(sourceBuilder, destBuilder) {
    (0, _classCallCheck2.default)(this, SourceDestBuilder);
    this._sourceBuilder = sourceBuilder;
    this._destBuilder = destBuilder;
  }

  (0, _createClass2.default)(SourceDestBuilder, [{
    key: "getSource",
    value: function getSource(object) {
      return this._sourceBuilder.getSource(object);
    }
  }, {
    key: "getDest",
    value: function getDest(object) {
      return this._destBuilder.getDest(object);
    }
  }, {
    key: "getSourceDest",
    value: function getSourceDest(object) {
      var source = this._sourceBuilder.getSource(object);

      var dest = this._destBuilder.getDest(object);

      return sourceDest(source, dest);
    }
  }]);
  return SourceDestBuilder;
}(); // region sourceDestBuilder
// tslint:disable-next-line:no-shadowed-variable


var _sourceDestBuilder = (0, _depend.depend)(function _sourceDestBuilder(sourceBuilder, destBuilder) {
  return new SourceDestBuilder(sourceBuilder, destBuilder);
});

function sourceDestBuilder(sourceBuilder, destBuilder) {
  return sourceBuilder == null && destBuilder == null ? _sourceDestBuilder : _sourceDestBuilder(sourceBuilder, destBuilder);
} // endregion
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.sourcePathBuilder = sourcePathBuilder;
exports.destPathBuilder = destPathBuilder;
exports.sourceDestPathBuilder = sourceDestPathBuilder;
exports.sourcePath = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _CallState = require("../../../rx/depend/core/CallState");

var _contracts = require("../../../rx/depend/core/contracts");

var _depend = require("../../../rx/depend/core/depend");

var _builder = require("../../object/properties/path/builder");

var _Binder = require("./Binder");

var _SourceDestBuilder = require("./SourceDestBuilder");

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

SourcePath.prototype.getOneWayBinder = (0, _depend.depend)(SourcePath.prototype.getOneWayBinder); // tslint:disable-next-line:no-shadowed-variable

var sourcePath = (0, _depend.depend)(function sourcePath(getValue) {
  return new SourcePath(getValue);
});
exports.sourcePath = sourcePath;

function resolvePathOrBuilder(pathOrBuilder) {
  return typeof pathOrBuilder === 'function' ? pathOrBuilder(new _builder.Path()).init() : pathOrBuilder;
}

var SourcePathBuilder = /*#__PURE__*/function () {
  function SourcePathBuilder(pathOrBuilder) {
    (0, _classCallCheck2.default)(this, SourcePathBuilder);
    this._path = resolvePathOrBuilder(pathOrBuilder);

    if (this._path == null) {
      throw new Error('path == null');
    }

    if (!this._path.canGet) {
      throw new Error('path.canGet is false');
    }
  }

  (0, _createClass2.default)(SourcePathBuilder, [{
    key: "getSource",
    value: function getSource(object) {
      var path = this._path;

      var getValue = function getValue() {
        return path.get(object);
      };

      return sourcePath(getValue);
    }
  }]);
  return SourcePathBuilder;
}();

SourcePathBuilder.prototype.getSource = (0, _depend.depend)(SourcePathBuilder.prototype.getSource); // region sourcePathBuilder
// tslint:disable-next-line:no-shadowed-variable

var _sourcePathBuilder = (0, _depend.depend)(function _sourcePathBuilder(pathOrBuilder) {
  return new SourcePathBuilder(pathOrBuilder);
});

function sourcePathBuilder(pathOrBuilder) {
  return pathOrBuilder == null ? _sourcePathBuilder : _sourcePathBuilder(pathOrBuilder);
} // endregion


var DestPathBuilder = /*#__PURE__*/function () {
  function DestPathBuilder(pathOrBuilder) {
    (0, _classCallCheck2.default)(this, DestPathBuilder);
    this._path = resolvePathOrBuilder(pathOrBuilder);

    if (this._path == null) {
      throw new Error('path == null');
    }

    if (!this._path.canSet) {
      throw new Error('path.canSet is false');
    }
  }

  (0, _createClass2.default)(DestPathBuilder, [{
    key: "getDest",
    value: function getDest(object) {
      var path = this._path;
      return function (value) {
        return path.set(object, value);
      };
    }
  }]);
  return DestPathBuilder;
}();

DestPathBuilder.prototype.getDest = (0, _depend.depend)(DestPathBuilder.prototype.getDest); // region destPathBuilder
// tslint:disable-next-line:no-shadowed-variable

var _destPathBuilder = (0, _depend.depend)(function _destPathBuilder(pathOrBuilder) {
  return new DestPathBuilder(pathOrBuilder);
});

function destPathBuilder(pathOrBuilder) {
  return pathOrBuilder == null ? _destPathBuilder : _destPathBuilder(pathOrBuilder);
} // endregion
// region sourceDestPathBuilder
// tslint:disable-next-line:no-shadowed-variable


var _sourceDestPathBuilder = (0, _depend.depend)(__sourceDestPathBuilder);

function __sourceDestPathBuilder(pathOrBuilderCommon, pathOrBuilderGetSet) {
  var pathGetSet;

  if (typeof pathOrBuilderCommon === 'function') {
    pathGetSet = (0, _builder.pathGetSetBuild)(pathOrBuilderCommon, pathOrBuilderGetSet);
  } else if (pathOrBuilderCommon instanceof _builder.PathGetSet) {
    if (pathOrBuilderGetSet != null) {
      throw new Error('The second argument should be null: ' + typeof pathOrBuilderGetSet);
    }

    pathGetSet = pathOrBuilderCommon;
  }

  var pathGet;
  var pathSet;

  if (pathGetSet != null) {
    pathGet = pathGetSet.pathGet;
    pathSet = pathGetSet.pathSet;
  } else {
    pathGet = pathOrBuilderCommon;
    pathSet = pathOrBuilderGetSet;
  }

  var sourceBuilder = sourcePathBuilder(pathGet);
  var destBuilder = destPathBuilder(pathSet);
  return (0, _SourceDestBuilder.sourceDestBuilder)(sourceBuilder, destBuilder);
}

function sourceDestPathBuilder(pathOrBuilderCommon, pathOrBuilderGetSet) {
  return pathOrBuilderCommon == null && pathOrBuilderGetSet == null ? _sourceDestPathBuilder : _sourceDestPathBuilder(pathOrBuilderCommon, pathOrBuilderGetSet);
} // endregion
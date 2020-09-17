"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.dependConnectorClass = dependConnectorClass;
exports.connectorFactory = connectorFactory;
exports.ConnectorBuilder = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _helpers = require("../../../helpers/helpers");

var _CallState = require("../../../rx/depend/core/CallState");

var _depend = require("../../../rx/depend/core/depend");

var _helpers2 = require("../../../rx/depend/helpers");

var _helpers3 = require("../helpers");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _Connector = require("./Connector");

var _helpers4 = require("./helpers");

var _builder = require("./path/builder");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var ConnectorBuilder = /*#__PURE__*/function (_ObservableObjectBuil) {
  (0, _inherits2.default)(ConnectorBuilder, _ObservableObjectBuil);

  var _super = _createSuper(ConnectorBuilder);

  function ConnectorBuilder(object, sourcePath) {
    var _this;

    (0, _classCallCheck2.default)(this, ConnectorBuilder);
    _this = _super.call(this, object);
    _this.sourcePath = sourcePath;
    return _this;
  } // region connectSimple


  (0, _createClass2.default)(ConnectorBuilder, [{
    key: "connectSimple",
    value: function connectSimple(name, common, getSet, options) {
      return this._connect(name, common, getSet, options);
    } // endregion
    // region connect

  }, {
    key: "connect",
    value: function connect(name, common, getSet, options) {
      return this._connect(name, common, getSet, options ? (0, _extends2.default)((0, _extends2.default)({}, options), {}, {
        isDepend: true
      }) : {
        isDepend: true
      });
    } // endregion
    // region connectLazy

  }, {
    key: "connectLazy",
    value: function connectLazy(name, common, getSet, options) {
      return this._connect(name, common, getSet, options ? (0, _extends2.default)((0, _extends2.default)({}, options), {}, {
        isDepend: true,
        isLazy: true
      }) : {
        isDepend: true,
        isLazy: true
      });
    } // endregion
    // region connectWait

  }, {
    key: "connectWait",
    value: function connectWait(name, common, getSet, options) {
      return this._connect(name, common, getSet, options ? (0, _extends2.default)((0, _extends2.default)({}, options), {}, {
        isDepend: true,
        isWait: true
      }) : {
        isDepend: true,
        isWait: true
      });
    } // endregion
    // region connectWaitLazy

  }, {
    key: "connectWaitLazy",
    value: function connectWaitLazy(name, common, getSet, options) {
      return this._connect(name, common, getSet, options ? (0, _extends2.default)((0, _extends2.default)({}, options), {}, {
        isDepend: true,
        isLazy: true,
        isWait: true
      }) : {
        isDepend: true,
        isLazy: true,
        isWait: true
      });
    } // endregion
    // region _connect

  }, {
    key: "_connect",
    value: function _connect(name, common, getSet, options) {
      var path = _builder.PathGetSet.build(common, getSet);

      var sourcePath = this.sourcePath;

      if (sourcePath != null) {
        path = (0, _concat.default)(_builder.PathGetSet).call(_builder.PathGetSet, sourcePath, path);
      }

      var _ref = options || {},
          hidden = _ref.hidden,
          isDepend = _ref.isDepend,
          isLazy = _ref.isLazy,
          isWait = _ref.isWait,
          waitCondition = _ref.waitCondition,
          waitTimeout = _ref.waitTimeout;

      var object = this.object;

      if (!path.canGet) {
        throw new Error('path.canGet == false');
      }

      var getValue = function getValue() {
        return path.get(this);
      };

      if (isDepend) {
        getValue = (0, _depend.depend)(getValue, null, (0, _helpers3.makeDependPropertySubscriber)(name));

        if (isWait) {
          getValue = (0, _helpers2.dependWait)(getValue, waitCondition, waitTimeout, isLazy);
        } else if (isLazy) {
          var _getValue = getValue;

          getValue = function getValue() {
            var state = (0, _CallState.getOrCreateCallState)(_getValue).apply(this, arguments);
            return state.getValue(true);
          };
        }
      }

      (0, _defineProperty.default)(object, name, {
        configurable: true,
        enumerable: !hidden,
        get: getValue,
        set: !path.canSet ? _helpers.missingSetter : function (value) {
          return path.set(this, value);
        }
      });
      return this;
    } // endregion

  }]);
  return ConnectorBuilder;
}(_ObservableObjectBuilder.ObservableObjectBuilder);

exports.ConnectorBuilder = ConnectorBuilder;

function dependConnectorClass(build, baseClass) {
  var sourcePath = new _builder.Path().f(function (o) {
    return o.connectorState;
  }).f(function (o) {
    return o.source;
  }).init();
  return (0, _helpers4.observableClass)(function (object) {
    return build(new ConnectorBuilder(object, sourcePath)).object;
  }, baseClass != null ? baseClass : _Connector.Connector);
}

function connectorFactory(_ref2) {
  var name = _ref2.name,
      build = _ref2.build,
      baseClass = _ref2.baseClass;
  var NewConnector = dependConnectorClass(build, baseClass);
  return function (source, _name) {
    return new NewConnector(source, _name != null ? _name : name);
  };
}
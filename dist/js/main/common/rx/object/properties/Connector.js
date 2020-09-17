"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Connector = exports.ConnectorState = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _ObservableClass3 = require("../ObservableClass");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var ConnectorState = /*#__PURE__*/function (_ObservableClass) {
  (0, _inherits2.default)(ConnectorState, _ObservableClass);

  var _super = _createSuper(ConnectorState);

  function ConnectorState() {
    (0, _classCallCheck2.default)(this, ConnectorState);
    return _super.apply(this, arguments);
  }

  return ConnectorState;
}(_ObservableClass3.ObservableClass);

exports.ConnectorState = ConnectorState;
new _ObservableObjectBuilder.ObservableObjectBuilder(ConnectorState.prototype).writable('source');

var Connector = /*#__PURE__*/function (_ObservableClass2) {
  (0, _inherits2.default)(Connector, _ObservableClass2);

  var _super2 = _createSuper(Connector);

  function Connector(source, name) {
    var _this;

    (0, _classCallCheck2.default)(this, Connector);
    _this = _super2.call(this);
    _this.connectorState.name = name;
    _this.connectorState.source = source;
    return _this;
  }

  return Connector;
}(_ObservableClass3.ObservableClass);

exports.Connector = Connector;
new _ObservableObjectBuilder.ObservableObjectBuilder(Connector.prototype).readable('connectorState', {
  hidden: true,
  factory: function factory() {
    return new ConnectorState();
  }
});
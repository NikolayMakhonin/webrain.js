"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Connector = exports.ConnectorState = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ObservableClass3 = require("../ObservableClass");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var ConnectorState =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(ConnectorState, _ObservableClass);

  function ConnectorState() {
    (0, _classCallCheck2.default)(this, ConnectorState);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ConnectorState).apply(this, arguments));
  }

  return ConnectorState;
}(_ObservableClass3.ObservableClass);

exports.ConnectorState = ConnectorState;
new _ObservableObjectBuilder.ObservableObjectBuilder(ConnectorState.prototype).writable('source');

var Connector =
/*#__PURE__*/
function (_ObservableClass2) {
  (0, _inherits2.default)(Connector, _ObservableClass2);

  function Connector(source, name) {
    var _this;

    (0, _classCallCheck2.default)(this, Connector);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Connector).call(this));
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
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.Connector = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ObservableObject2 = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var Connector =
/*#__PURE__*/
function (_ObservableObject) {
  (0, _inherits2.default)(Connector, _ObservableObject);

  function Connector(connectorSource) {
    var _this;

    (0, _classCallCheck2.default)(this, Connector);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Connector).call(this));
    _this.connectorSource = connectorSource;
    return _this;
  }

  return Connector;
}(_ObservableObject2.ObservableObject);

exports.Connector = Connector;
new _ObservableObjectBuilder.ObservableObjectBuilder(Connector.prototype).writable('connectorSource', {
  hidden: true
});
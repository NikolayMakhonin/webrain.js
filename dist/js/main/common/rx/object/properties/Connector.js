"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Connector = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _ObservableObject2 = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var Connector =
/*#__PURE__*/
function (_ObservableObject) {
  (0, _inheritsLoose2.default)(Connector, _ObservableObject);

  function Connector(connectorSource) {
    var _this;

    _this = _ObservableObject.call(this) || this;
    _this.connectorSource = connectorSource;
    return _this;
  }

  return Connector;
}(_ObservableObject2.ObservableObject);

exports.Connector = Connector;
new _ObservableObjectBuilder.ObservableObjectBuilder(Connector.prototype).writable('connectorSource', {
  hidden: true
});
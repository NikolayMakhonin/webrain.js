"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Connector = void 0;

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

class Connector extends _ObservableObject.ObservableObject {
  constructor(connectorSource) {
    super();
    this.connectorSource = connectorSource;
  }

}

exports.Connector = Connector;
new _ObservableObjectBuilder.ObservableObjectBuilder(Connector.prototype).writable('connectorSource', {
  hidden: true
});
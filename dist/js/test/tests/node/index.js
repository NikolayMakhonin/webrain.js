"use strict";

var _Assert = require("../../../main/common/test/Assert");

var _Mocha = require("../../../main/common/test/Mocha");

var _node = require("../../../main/node");

(0, _Mocha.describe)('node > main > index', function () {
  (0, _Mocha.it)('base', function () {
    _Assert.assert.ok(_node.ObservableClass);
  });
});
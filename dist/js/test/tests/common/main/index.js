"use strict";

var _common = require("../../../../main/common");

var _Assert = require("../../../../main/common/test/Assert");

var _Mocha = require("../../../../main/common/test/Mocha");

(0, _Mocha.describe)('common > main > index', function () {
  (0, _Mocha.it)('base', function () {
    _Assert.assert.ok(_common.ObservableClass);
  });
});
"use strict";

var _browser = require("../../../main/browser");

var _Assert = require("../../../main/common/test/Assert");

var _Mocha = require("../../../main/common/test/Mocha");

(0, _Mocha.describe)('browser > main > index', function () {
  (0, _Mocha.it)('base', function () {
    _Assert.assert.ok(_browser.ObservableClass);
  });
});
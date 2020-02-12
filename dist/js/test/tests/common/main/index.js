"use strict";

var _ObservableClass = require("../../../../main/common/rx/object/ObservableClass");

var _Assert = require("../../../../main/common/test/Assert");

var _Mocha = require("../../../../main/common/test/Mocha");

(0, _Mocha.describe)('common > main > index', function () {
  (0, _Mocha.it)('base', function () {
    _Assert.assert.ok(_ObservableClass.ObservableClass);
  });
});
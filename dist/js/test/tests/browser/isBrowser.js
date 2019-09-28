"use strict";

var _Assert = require("../../../main/common/test/Assert");

var _Mocha = require("../../../main/common/test/Mocha");

/* eslint-disable no-new-func */
(0, _Mocha.describe)('browser', function () {
  (0, _Mocha.it)('isBrowser', function () {
    // see: https://stackoverflow.com/a/31090240/5221762
    var isBrowser = new Function('try {return this===window;}catch(e){ return false;}'); // console.log(`${new Date()} isBrowser = ${isBrowser()};`)

    _Assert.assert.strictEqual(isBrowser(), true);
  });
});
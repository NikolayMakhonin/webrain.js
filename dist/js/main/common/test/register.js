"use strict";

var _Assert = require("./Assert");

var _Mocha = require("./Mocha");

global.assert = _Assert.assert;
global.describe = _Mocha.describe;
global.it = _Mocha.it;
global.xdescribe = _Mocha.xdescribe;
global.xit = _Mocha.xit;
"use strict";

var _Assert = require("../../../../main/common/test/Assert");

var _Mocha = require("../../../../main/common/test/Mocha");

var _parser = require("./src/helpers/parser");

/* tslint:disable:no-var-requires */
var fs = require('fs');

var path = require('path');

(0, _Mocha.describe)('node > v8 > parser', function () {
  (0, _Mocha.it)('parser', function () {
    var dir = path.resolve(__dirname, './src/helpers/node_4_9_1');
    var sourceFile = path.resolve(dir, 'runtime.h.txt');
    var jsFile = path.resolve(dir, 'runtime.js');
    var d_tsFile = path.resolve(dir, 'runtime.d.ts');

    if (!fs.existsSync(jsFile) || !fs.existsSync(d_tsFile)) {
      var content = fs.readFileSync(sourceFile, 'utf8');
      var result = (0, _parser.v8_runtime_h_to_js_functions)(content);

      _Assert.assert.ok(result.js && result.js.length);

      _Assert.assert.ok(result.d_ts && result.d_ts.length);

      if (!fs.existsSync(jsFile)) {
        fs.writeFileSync(jsFile, result.js, 'utf-8');
      }

      if (!fs.existsSync(d_tsFile)) {
        fs.writeFileSync(d_tsFile, result.d_ts, 'utf-8');
      }
    }
  });
});
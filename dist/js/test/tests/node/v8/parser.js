"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Assert = require("../../../../main/common/test/Assert");

var _Mocha = require("../../../../main/common/test/Mocha");

var _parser = require("./src/helpers/parser");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

/* tslint:disable:no-var-requires */
(0, _Mocha.describe)('node > v8 > parser', function () {
  (0, _Mocha.it)('parser', function () {
    var dir = _path.default.resolve(__dirname, './src/helpers/node_4_9_1');

    var sourceFile = _path.default.resolve(dir, 'runtime.h.txt');

    var jsFile = _path.default.resolve(dir, 'runtime.js');

    var d_tsFile = _path.default.resolve(dir, 'runtime.d.ts');

    if (!_fs.default.existsSync(jsFile) || !_fs.default.existsSync(d_tsFile)) {
      var content = _fs.default.readFileSync(sourceFile, 'utf8');

      var result = (0, _parser.v8_runtime_h_to_js_functions)(content);

      _Assert.assert.ok(result.js && result.js.length);

      _Assert.assert.ok(result.d_ts && result.d_ts.length);

      if (!_fs.default.existsSync(jsFile)) {
        _fs.default.writeFileSync(jsFile, result.js, 'utf-8');
      }

      if (!_fs.default.existsSync(d_tsFile)) {
        _fs.default.writeFileSync(d_tsFile, result.d_ts, 'utf-8');
      }
    }
  });
});
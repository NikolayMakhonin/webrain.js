"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _CallState = require("../../../../../main/common/rx/depend/core/CallState");

var _depend = require("../../../../../main/common/rx/depend/core/depend");

var _DependMap = require("../../../../../main/common/rx/depend/lists/DependMap");

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _helpers = require("../rx/depend/src/helpers");

(0, _Mocha.describe)('common > main > lists > DependMap', function () {
  this.timeout(20000);
  (0, _Mocha.it)('base', function () {
    var map = new _DependMap.DependMap();

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAll).call(map));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyKey).call(map));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyValue).call(map));

    _Assert.assert.strictEqual(map.size, 0);

    map.set(1, 2);

    _Assert.assert.strictEqual(map.get(1), 2);

    _Assert.assert.strictEqual(map.get(2), void 0);

    _Assert.assert.deepStrictEqual((0, _from.default)((0, _entries.default)(map).call(map)), [[1, 2]]);

    _Assert.assert.deepStrictEqual((0, _from.default)((0, _keys.default)(map).call(map)), [1]);

    _Assert.assert.deepStrictEqual((0, _from.default)((0, _values.default)(map).call(map)), [2]);

    map.clear();

    _Assert.assert.strictEqual(map.get(1), void 0);

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAll).call(map));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyKey).call(map));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyValue).call(map));

    (0, _depend.depend)(function () {
      _Assert.assert.strictEqual(map.size, 0);
    })();

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAll).call(map));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAnyKey).call(map));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyValue).call(map));

    (0, _depend.depend)(function () {
      map.set(1, 2);
    })();

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAll).call(map));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAnyKey).call(map));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependValue).call(map, 2));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyValue).call(map));

    (0, _depend.depend)(function () {
      _Assert.assert.strictEqual(map.get(2), void 0);
    })();

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAll).call(map));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAnyKey).call(map));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependValue).call(map, 2));

    _Assert.assert.notOk((0, _CallState.getCallState)(map.dependAnyValue).call(map));

    (0, _depend.depend)(function () {
      _Assert.assert.deepStrictEqual((0, _from.default)((0, _entries.default)(map).call(map)), [[1, 2]]);
    })();

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAll).call(map));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAnyKey).call(map));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependValue).call(map, 2));

    _Assert.assert.ok((0, _CallState.getCallState)(map.dependAnyValue).call(map));

    (0, _helpers.clearCallStates)();
  });
});
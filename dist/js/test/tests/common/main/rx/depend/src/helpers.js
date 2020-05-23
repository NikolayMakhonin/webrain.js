"use strict";

exports.__esModule = true;
exports.__makeDependentFunc = __makeDependentFunc;
exports.__invalidate = __invalidate;
exports.__outputCall = __outputCall;
exports.clearCallStates = clearCallStates;

var _CallState = require("../../../../../../../main/common/rx/depend/core/CallState");

var _depend = require("../../../../../../../main/common/rx/depend/core/depend");

var _Assert = require("../../../../../../../main/common/test/Assert");

// tslint:disable-next-line:no-shadowed-variable
// tslint:disable-next-line:no-shadowed-variable
function __makeDependentFunc(func) {
  if (typeof func === 'function') {
    return (0, _depend.depend)(func);
  }

  return null;
} // endregion


function __invalidate(state) {
  return state.invalidate();
}

function __outputCall(output) {
  return output.call(2, 5, 10);
}

function clearCallStates() {
  (0, _CallState.reduceCallStates)(2000000000, 0);

  _Assert.assert.strictEqual(_CallState.callStateHashTable && _CallState.callStateHashTable.size, 0);

  _Assert.assert.strictEqual(_CallState.valueIdToStateMap.size, 0);

  _Assert.assert.strictEqual(_CallState.valueToIdMap.size, 0);
}
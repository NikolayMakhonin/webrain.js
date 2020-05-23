// tslint:disable-next-line:no-shadowed-variable
import { callStateHashTable, reduceCallStates, valueIdToStateMap, valueToIdMap } from '../../../../../../../main/common/rx/depend/core/CallState';
import { depend } from '../../../../../../../main/common/rx/depend/core/depend';
import { assert } from '../../../../../../../main/common/test/Assert';
// tslint:disable-next-line:no-shadowed-variable
export function __makeDependentFunc(func) {
  if (typeof func === 'function') {
    return depend(func);
  }

  return null;
} // endregion

export function __invalidate(state) {
  return state.invalidate();
}
export function __outputCall(output) {
  return output.call(2, 5, 10);
}
export function clearCallStates() {
  reduceCallStates(2000000000, 0);
  assert.strictEqual(callStateHashTable && callStateHashTable.size, 0);
  assert.strictEqual(valueIdToStateMap.size, 0);
  assert.strictEqual(valueToIdMap.size, 0);
}
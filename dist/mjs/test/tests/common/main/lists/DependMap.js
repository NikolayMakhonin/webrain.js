import { getCallState } from '../../../../../main/common/rx/depend/core/CallState';
import { depend } from '../../../../../main/common/rx/depend/core/depend';
import { DependMap } from '../../../../../main/common/rx/depend/lists/DependMap';
import { assert } from '../../../../../main/common/test/Assert';
import { describe, it } from '../../../../../main/common/test/Mocha';
import { clearCallStates } from '../rx/depend/src/helpers';
describe('common > main > lists > DependMap', function () {
  this.timeout(20000);
  it('base', function () {
    const map = new DependMap();
    assert.notOk(getCallState(map.dependAll).call(map));
    assert.notOk(getCallState(map.dependAnyKey).call(map));
    assert.notOk(getCallState(map.dependAnyValue).call(map));
    assert.strictEqual(map.size, 0);
    map.set(1, 2);
    assert.strictEqual(map.get(1), 2);
    assert.strictEqual(map.get(2), void 0);
    assert.deepStrictEqual(Array.from(map.entries()), [[1, 2]]);
    assert.deepStrictEqual(Array.from(map.keys()), [1]);
    assert.deepStrictEqual(Array.from(map.values()), [2]);
    map.clear();
    assert.strictEqual(map.get(1), void 0);
    assert.notOk(getCallState(map.dependAll).call(map));
    assert.notOk(getCallState(map.dependAnyKey).call(map));
    assert.notOk(getCallState(map.dependAnyValue).call(map));
    depend(() => {
      assert.strictEqual(map.size, 0);
    })();
    assert.ok(getCallState(map.dependAll).call(map));
    assert.ok(getCallState(map.dependAnyKey).call(map));
    assert.notOk(getCallState(map.dependAnyValue).call(map));
    depend(() => {
      map.set(1, 2);
    })();
    assert.ok(getCallState(map.dependAll).call(map));
    assert.ok(getCallState(map.dependAnyKey).call(map));
    assert.notOk(getCallState(map.dependValue).call(map, 2));
    assert.notOk(getCallState(map.dependAnyValue).call(map));
    depend(() => {
      assert.strictEqual(map.get(2), void 0);
    })();
    assert.ok(getCallState(map.dependAll).call(map));
    assert.ok(getCallState(map.dependAnyKey).call(map));
    assert.ok(getCallState(map.dependValue).call(map, 2));
    assert.notOk(getCallState(map.dependAnyValue).call(map));
    depend(() => {
      assert.deepStrictEqual(Array.from(map.entries()), [[1, 2]]);
    })();
    assert.ok(getCallState(map.dependAll).call(map));
    assert.ok(getCallState(map.dependAnyKey).call(map));
    assert.ok(getCallState(map.dependValue).call(map, 2));
    assert.ok(getCallState(map.dependAnyValue).call(map));
    clearCallStates();
  });
});
import { ObservableClass } from '../../../main/common/rx/object/ObservableClass';
import { assert } from '../../../main/common/test/Assert';
import { describe, it } from '../../../main/common/test/Mocha';
describe('node > main > index', function () {
  it('base', function () {
    assert.ok(ObservableClass);
  });
});
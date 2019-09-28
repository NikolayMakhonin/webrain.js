import { ObservableClass } from '../../../../main/common';
import { assert } from '../../../../main/common/test/Assert';
import { describe, it } from '../../../../main/common/test/Mocha';
describe('common > main > index', function () {
  it('base', function () {
    assert.ok(ObservableClass);
  });
});
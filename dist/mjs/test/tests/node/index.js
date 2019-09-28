import { assert } from '../../../main/common/test/Assert';
import { describe, it } from '../../../main/common/test/Mocha';
import { ObservableObject } from '../../../main/node';
describe('node > main > index', function () {
  it('base', function () {
    assert.ok(ObservableObject);
  });
});
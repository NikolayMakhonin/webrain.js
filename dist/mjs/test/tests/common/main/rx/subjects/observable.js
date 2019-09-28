import { Observable } from '../../../../../../main/common/rx/subjects/observable';
import { assert } from '../../../../../../main/common/test/Assert';
import { describe, it } from '../../../../../../main/common/test/Mocha';
describe('common > main > rx > subjects > observable', function () {
  it('Observable', function () {
    class CustomObservable extends Observable {
      subscribe(subscriber) {
        throw new Error('Not implemented');
      }

    }

    const observable = new CustomObservable();
    let arg;
    const result = observable.call(o => {
      arg = o;
      return 'result';
    });
    assert.strictEqual(arg, observable);
    assert.strictEqual(result, 'result');
  });
});
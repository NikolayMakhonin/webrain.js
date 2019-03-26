import { Observable } from '../../../../../../main/common/rx/subjects/observable';
describe('common > main > rx > subjects > observable', function () {
  it('Observable', function () {
    var observable = new Observable();
    var arg;
    var result = observable.call(function (o) {
      arg = o;
      return 'result';
    });
    assert.strictEqual(arg, observable);
    assert.strictEqual(result, 'result');
  });
});
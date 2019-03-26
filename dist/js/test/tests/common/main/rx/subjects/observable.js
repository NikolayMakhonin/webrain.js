"use strict";

var _observable = require("../../../../../../main/common/rx/subjects/observable");

describe('common > main > rx > subjects > observable', function () {
  it('Observable', function () {
    const observable = new _observable.Observable();
    let arg;
    const result = observable.call(o => {
      arg = o;
      return 'result';
    });
    assert.strictEqual(arg, observable);
    assert.strictEqual(result, 'result');
  });
});
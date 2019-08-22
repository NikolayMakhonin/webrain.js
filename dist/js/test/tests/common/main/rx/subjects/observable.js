"use strict";

var _observable = require("../../../../../../main/common/rx/subjects/observable");

describe('common > main > rx > subjects > observable', function () {
  it('Observable', function () {
    class CustomObservable extends _observable.Observable {
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
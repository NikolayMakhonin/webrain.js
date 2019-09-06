"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _observable = require("../../../../../../main/common/rx/subjects/observable");

describe('common > main > rx > subjects > observable', function () {
  it('Observable', function () {
    var CustomObservable =
    /*#__PURE__*/
    function (_Observable) {
      (0, _inheritsLoose2.default)(CustomObservable, _Observable);

      function CustomObservable() {
        return _Observable.apply(this, arguments) || this;
      }

      var _proto = CustomObservable.prototype;

      _proto.subscribe = function subscribe(subscriber) {
        throw new Error('Not implemented');
      };

      return CustomObservable;
    }(_observable.Observable);

    var observable = new CustomObservable();
    var arg;
    var result = observable.call(function (o) {
      arg = o;
      return 'result';
    });
    assert.strictEqual(arg, observable);
    assert.strictEqual(result, 'result');
  });
});
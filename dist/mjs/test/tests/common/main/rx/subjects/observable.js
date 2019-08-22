import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { Observable } from '../../../../../../main/common/rx/subjects/observable';
describe('common > main > rx > subjects > observable', function () {
  it('Observable', function () {
    var CustomObservable =
    /*#__PURE__*/
    function (_Observable) {
      _inherits(CustomObservable, _Observable);

      function CustomObservable() {
        _classCallCheck(this, CustomObservable);

        return _possibleConstructorReturn(this, _getPrototypeOf(CustomObservable).apply(this, arguments));
      }

      _createClass(CustomObservable, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          throw new Error('Not implemented');
        }
      }]);

      return CustomObservable;
    }(Observable);

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
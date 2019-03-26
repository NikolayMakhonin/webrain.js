import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import { Subject } from './subject';
export function behavior(base) {
  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(Behavior, _base);

      function Behavior() {
        _classCallCheck(this, Behavior);

        return _possibleConstructorReturn(this, _getPrototypeOf(Behavior).apply(this, arguments));
      }

      _createClass(Behavior, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          var _this = this;

          if (!subscriber) {
            return null;
          }

          var unsubscribe = _get(_getPrototypeOf(Behavior.prototype), "subscribe", this).call(this, subscriber);

          var value = this.value;

          if (typeof value !== 'undefined') {
            subscriber(value);
          }

          return function () {
            if (!unsubscribe) {
              return;
            }

            try {
              // eslint-disable-next-line no-shadow
              var _value = _this.value,
                  unsubscribeValue = _this.unsubscribeValue;

              if (typeof unsubscribeValue !== 'undefined' && unsubscribeValue !== _value) {
                subscriber(unsubscribeValue);
              }
            } finally {
              unsubscribe();
              unsubscribe = null;
            }
          };
        }
      }, {
        key: "emit",
        value: function emit(value) {
          this.value = value;

          _get(_getPrototypeOf(Behavior.prototype), "emit", this).call(this, value);

          return this;
        }
      }]);

      return Behavior;
    }(base)
  );
}
export var BehaviorSubject = behavior(Subject);
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { Observable } from './observable';
export function subject(base) {
  // eslint-disable-next-line no-shadow
  // tslint:disable-next-line:no-shadowed-variable
  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(Subject, _base);

      function Subject() {
        _classCallCheck(this, Subject);

        return _possibleConstructorReturn(this, _getPrototypeOf(Subject).apply(this, arguments));
      }

      _createClass(Subject, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          var _this = this;

          if (!subscriber) {
            return null;
          }

          var _subscribers = this._subscribers;

          if (!_subscribers) {
            this._subscribers = [subscriber];
          } else {
            _subscribers[_subscribers.length] = subscriber;
          }

          return function () {
            if (!subscriber) {
              return;
            } // tslint:disable-next-line:no-shadowed-variable


            var _subscribers = _this._subscribers;
            var len = _subscribers.length;

            var index = _subscribers.indexOf(subscriber);

            if (index >= 0) {
              if (_this._subscribersInProcess === _subscribers) {
                var subscribers = new Array(len - 1);

                for (var i = 0; i < index; i++) {
                  subscribers[i] = _subscribers[i];
                }

                for (var _i = index + 1; _i < len; _i++) {
                  subscribers[_i - 1] = _subscribers[_i];
                }

                _this._subscribers = subscribers;
              } else {
                for (var _i2 = index + 1; _i2 < len; _i2++) {
                  _subscribers[_i2 - 1] = _subscribers[_i2];
                }

                _subscribers.length = len - 1;
              }
            }

            subscriber = null;
          };
        }
      }, {
        key: "emit",
        value: function emit(value) {
          var _subscribers = this._subscribers;

          if (!_subscribers) {
            return this;
          }

          if (this._subscribersInProcess !== _subscribers) {
            this._subscribersInProcess = _subscribers;
          }

          for (var i = 0, len = _subscribers.length; i < len; i++) {
            _subscribers[i](value);
          }

          if (this._subscribersInProcess === _subscribers) {
            this._subscribersInProcess = null;
          }

          return this;
        }
      }, {
        key: "hasSubscribers",
        get: function get() {
          return !!(this._subscribers && this._subscribers.length);
        }
      }]);

      return Subject;
    }(base)
  );
}
export var Subject = subject(Observable); // export function createSubjectClass(base, ...extensions) {
// 	for (const extension of extensions) {
// 		base = extension(base)
// 	}
//
// 	return base
// }
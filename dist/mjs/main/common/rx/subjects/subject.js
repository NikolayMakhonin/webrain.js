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
          if (!subscriber) {
            return null;
          }

          var _subscribers = this._subscribers;

          if (!_subscribers) {
            this._subscribers = _subscribers = [subscriber];
          } else {
            _subscribers[_subscribers.length] = subscriber;
          }

          return function () {
            if (!subscriber) {
              return;
            }

            var index = _subscribers.indexOf(subscriber);

            if (index >= 0) {
              _subscribers.splice(index, 1);
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

          _subscribers = _subscribers.slice();

          for (var i = 0, l = _subscribers.length; i < l; i++) {
            _subscribers[i](value);
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
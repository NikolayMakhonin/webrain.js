import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import { BehaviorSubject } from './behavior';
import { Subject } from './subject';

// eslint-disable-next-line no-shadow
// tslint:disable-next-line:no-shadowed-variable
function createHasSubscribersSubjectDefault(hasSubscribers) {
  var subject = new BehaviorSubject(hasSubscribers);
  subject.unsubscribeValue = null;
  return subject;
}

export function hasSubscribers(base) {
  var createHasSubscribersSubject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : createHasSubscribersSubjectDefault;
  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(HasSubscribers, _base);

      function HasSubscribers() {
        _classCallCheck(this, HasSubscribers);

        return _possibleConstructorReturn(this, _getPrototypeOf(HasSubscribers).apply(this, arguments));
      }

      _createClass(HasSubscribers, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          var _this = this;

          if (!subscriber) {
            return null;
          } // eslint-disable-next-line no-shadow
          // tslint:disable-next-line:no-shadowed-variable


          var hasSubscribers = this.hasSubscribers;

          var unsubscribe = _get(_getPrototypeOf(HasSubscribers.prototype), "subscribe", this).call(this, subscriber);

          if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
            this._hasSubscribersSubject.emit(true);
          }

          return function () {
            // eslint-disable-next-line no-shadow
            // tslint:disable-next-line:no-shadowed-variable
            var hasSubscribers = _this.hasSubscribers;
            unsubscribe();

            if (hasSubscribers && _this._hasSubscribersSubject && !_this.hasSubscribers) {
              _this._hasSubscribersSubject.emit(false);
            }
          };
        }
      }, {
        key: "hasSubscribersObservable",
        get: function get() {
          var _hasSubscribersSubject = this._hasSubscribersSubject;

          if (!_hasSubscribersSubject) {
            this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers);
          }

          return _hasSubscribersSubject;
        }
      }]);

      return HasSubscribers;
    }(base)
  );
}
export var HasSubscribersSubject = hasSubscribers(Subject);
export var HasSubscribersBehaviorSubject = hasSubscribers(BehaviorSubject);
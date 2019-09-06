"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.hasSubscribers = hasSubscribers;
exports.HasSubscribersBehaviorSubject = exports.HasSubscribersSubject = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _behavior = require("./behavior");

var _subject = require("./subject");

// eslint-disable-next-line no-shadow
// tslint:disable-next-line:no-shadowed-variable
function createHasSubscribersSubjectDefault(hasSubscribers) {
  var subject = new _behavior.BehaviorSubject(hasSubscribers);
  subject.unsubscribeValue = null;
  return subject;
}

function hasSubscribers(base, createHasSubscribersSubject) {
  if (createHasSubscribersSubject === void 0) {
    createHasSubscribersSubject = createHasSubscribersSubjectDefault;
  }

  return (
    /*#__PURE__*/
    function (_base) {
      (0, _inherits2.default)(HasSubscribers, _base);

      function HasSubscribers() {
        (0, _classCallCheck2.default)(this, HasSubscribers);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(HasSubscribers).apply(this, arguments));
      }

      (0, _createClass2.default)(HasSubscribers, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          var _this = this;

          if (!subscriber) {
            return null;
          } // eslint-disable-next-line no-shadow
          // tslint:disable-next-line:no-shadowed-variable


          var hasSubscribers = this.hasSubscribers;
          var unsubscribe = (0, _get2.default)((0, _getPrototypeOf2.default)(HasSubscribers.prototype), "subscribe", this).call(this, subscriber);

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

var HasSubscribersSubject = hasSubscribers(_subject.Subject);
exports.HasSubscribersSubject = HasSubscribersSubject;
var HasSubscribersBehaviorSubject = hasSubscribers(_behavior.BehaviorSubject);
exports.HasSubscribersBehaviorSubject = HasSubscribersBehaviorSubject;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.hasSubscribers = hasSubscribers;
exports.HasSubscribersBehaviorSubject = exports.HasSubscribersSubject = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

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
      (0, _inheritsLoose2.default)(HasSubscribers, _base);

      function HasSubscribers() {
        return _base.apply(this, arguments) || this;
      }

      var _proto = HasSubscribers.prototype;

      _proto.subscribe = function subscribe(subscriber) {
        var _this = this;

        if (!subscriber) {
          return null;
        } // eslint-disable-next-line no-shadow
        // tslint:disable-next-line:no-shadowed-variable


        var hasSubscribers = this.hasSubscribers;

        var unsubscribe = _base.prototype.subscribe.call(this, subscriber);

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
      };

      (0, _createClass2.default)(HasSubscribers, [{
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
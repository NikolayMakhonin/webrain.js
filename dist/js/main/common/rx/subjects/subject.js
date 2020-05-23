"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.subject = subject;
exports.Subject = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _observable = require("./observable");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function subject(base) {
  // eslint-disable-next-line no-shadow
  // tslint:disable-next-line:no-shadowed-variable
  return /*#__PURE__*/function (_base) {
    (0, _inherits2.default)(Subject, _base);

    var _super = _createSuper(Subject);

    function Subject() {
      (0, _classCallCheck2.default)(this, Subject);
      return _super.apply(this, arguments);
    }

    (0, _createClass2.default)(Subject, [{
      key: "subscribe",
      value: function subscribe(subscriber, description) {
        var _this = this;

        if (!subscriber) {
          return null;
        }

        if (description) {
          subscriber.description = description;
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
          var index = (0, _indexOf.default)(_subscribers).call(_subscribers, subscriber);

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
    }, {
      key: "subscribersCount",
      get: function get() {
        return this._subscribers && this._subscribers.length;
      }
    }]);
    return Subject;
  }(base);
}

var Subject = subject(_observable.Observable); // export function createSubjectClass(base, ...extensions) {
// 	for (const extension of extensions) {
// 		base = extension(base)
// 	}
//
// 	return base
// }

exports.Subject = Subject;
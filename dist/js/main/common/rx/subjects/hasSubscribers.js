"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.hasSubscribers = hasSubscribers;
exports.HasSubscribersBehaviorSubject = exports.HasSubscribersSubject = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _behavior = require("./behavior");

var _subject = require("./subject");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

// eslint-disable-next-line @typescript-eslint/no-shadow
function createHasSubscribersSubjectDefault(hasSubscribers) {
  var subject = new _behavior.BehaviorSubject(hasSubscribers);
  subject.unsubscribeValue = null;
  return subject;
}

function hasSubscribers(base, createHasSubscribersSubject) {
  if (createHasSubscribersSubject === void 0) {
    createHasSubscribersSubject = createHasSubscribersSubjectDefault;
  }

  return /*#__PURE__*/function (_base) {
    (0, _inherits2.default)(HasSubscribers, _base);

    var _super = _createSuper(HasSubscribers);

    function HasSubscribers() {
      (0, _classCallCheck2.default)(this, HasSubscribers);
      return _super.apply(this, arguments);
    }

    (0, _createClass2.default)(HasSubscribers, [{
      key: "subscribe",
      value: function subscribe(subscriber, description) {
        var _this = this;

        if (!subscriber) {
          return null;
        }

        if (description) {
          subscriber.description = description;
        } // eslint-disable-next-line @typescript-eslint/no-shadow


        var hasSubscribers = this.hasSubscribers;
        var unsubscribe = (0, _get2.default)((0, _getPrototypeOf2.default)(HasSubscribers.prototype), "subscribe", this).call(this, subscriber);

        if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
          this._hasSubscribersSubject.emit(true);
        }

        return function () {
          // eslint-disable-next-line @typescript-eslint/no-shadow
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
  }(base);
}

var HasSubscribersSubject = hasSubscribers(_subject.Subject);
exports.HasSubscribersSubject = HasSubscribersSubject;
var HasSubscribersBehaviorSubject = hasSubscribers(_behavior.BehaviorSubject);
exports.HasSubscribersBehaviorSubject = HasSubscribersBehaviorSubject;
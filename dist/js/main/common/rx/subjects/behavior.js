"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.behavior = behavior;
exports.BehaviorSubject = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _helpers = require("../../helpers/helpers");

var _subject = require("./subject");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function behavior(base) {
  return /*#__PURE__*/function (_base) {
    (0, _inherits2.default)(Behavior, _base);

    var _super = _createSuper(Behavior);

    function Behavior(value) {
      var _this;

      (0, _classCallCheck2.default)(this, Behavior);
      _this = _super.call(this);

      if (typeof value !== 'undefined') {
        _this.value = value;
      }

      return _this;
    }

    (0, _createClass2.default)(Behavior, [{
      key: "subscribe",
      value: function subscribe(subscriber, description) {
        var _this2 = this;

        if (!subscriber) {
          return null;
        }

        if (description) {
          subscriber.description = description;
        }

        var unsubscribe = (0, _get2.default)((0, _getPrototypeOf2.default)(Behavior.prototype), "subscribe", this).call(this, subscriber);
        var value = this.value;

        if (typeof value !== 'undefined') {
          subscriber(value);
        }

        return function () {
          var _unsubscribe = unsubscribe;

          if (!_unsubscribe) {
            return;
          }

          unsubscribe = null;

          try {
            // eslint-disable-next-line no-shadow
            // tslint:disable-next-line:no-shadowed-variable
            var _value = _this2.value,
                unsubscribeValue = _this2.unsubscribeValue;

            if (typeof unsubscribeValue !== 'undefined' && !(0, _helpers.equals)(unsubscribeValue, _value)) {
              subscriber(unsubscribeValue);
            }
          } finally {
            _unsubscribe();
          }
        };
      }
    }, {
      key: "emit",
      value: function emit(value) {
        this.value = value;
        (0, _get2.default)((0, _getPrototypeOf2.default)(Behavior.prototype), "emit", this).call(this, value);
        return this;
      }
    }]);
    return Behavior;
  }(base);
}

var BehaviorSubject = behavior(_subject.Subject);
exports.BehaviorSubject = BehaviorSubject;
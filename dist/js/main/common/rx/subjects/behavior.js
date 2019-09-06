"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.behavior = behavior;
exports.BehaviorSubject = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _subject = require("./subject");

function behavior(base) {
  return (
    /*#__PURE__*/
    function (_base) {
      (0, _inheritsLoose2.default)(Behavior, _base);

      function Behavior(value) {
        var _this;

        _this = _base.call(this) || this;

        if (typeof value !== 'undefined') {
          _this.value = value;
        }

        return _this;
      }

      var _proto = Behavior.prototype;

      _proto.subscribe = function subscribe(subscriber) {
        var _this2 = this;

        if (!subscriber) {
          return null;
        }

        var unsubscribe = _base.prototype.subscribe.call(this, subscriber);

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
            // tslint:disable-next-line:no-shadowed-variable
            var _value = _this2.value,
                unsubscribeValue = _this2.unsubscribeValue;

            if (typeof unsubscribeValue !== 'undefined' && unsubscribeValue !== _value) {
              subscriber(unsubscribeValue);
            }
          } finally {
            unsubscribe();
            unsubscribe = null;
          }
        };
      };

      _proto.emit = function emit(value) {
        this.value = value;

        _base.prototype.emit.call(this, value);

        return this;
      };

      return Behavior;
    }(base)
  );
}

var BehaviorSubject = behavior(_subject.Subject);
exports.BehaviorSubject = BehaviorSubject;
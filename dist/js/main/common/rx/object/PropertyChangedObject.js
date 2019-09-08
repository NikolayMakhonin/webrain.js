"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.PropertyChangedObject = exports.PropertyChangedSubject = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _hasSubscribers = require("../subjects/hasSubscribers");

var PropertyChangedSubject =
/*#__PURE__*/
function (_HasSubscribersSubjec) {
  (0, _inherits2.default)(PropertyChangedSubject, _HasSubscribersSubjec);

  function PropertyChangedSubject(object) {
    var _this;

    (0, _classCallCheck2.default)(this, PropertyChangedSubject);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PropertyChangedSubject).call(this));
    _this._object = object;
    return _this;
  }

  (0, _createClass2.default)(PropertyChangedSubject, [{
    key: "onPropertyChanged",
    value: function onPropertyChanged() {
      for (var i = 0, len = arguments.length; i < len; i++) {
        var event = i < 0 || arguments.length <= i ? undefined : arguments[i];

        if (event == null) {
          event = {};
        }

        if (typeof event !== 'object') {
          var value = this._object[event];
          event = {
            name: event,
            oldValue: value,
            newValue: value
          };
        }

        this.emit(event);
      }

      return this;
    }
  }]);
  return PropertyChangedSubject;
}(_hasSubscribers.HasSubscribersSubject);

exports.PropertyChangedSubject = PropertyChangedSubject;

var PropertyChangedObject =
/*#__PURE__*/
function () {
  /** @internal */
  function PropertyChangedObject() {
    (0, _classCallCheck2.default)(this, PropertyChangedObject);
    (0, _defineProperty.default)(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }
  /** @internal */


  (0, _createClass2.default)(PropertyChangedObject, [{
    key: "_setUnsubscriber",
    value: function _setUnsubscriber(propertyName, unsubscribe) {
      var __meta = this.__meta;
      var unsubscribers = __meta.unsubscribers;

      if (unsubscribers) {
        var oldUnsubscribe = unsubscribers[propertyName];

        if (oldUnsubscribe) {
          oldUnsubscribe();
        }
      }

      if (unsubscribe) {
        if (!unsubscribers) {
          __meta.unsubscribers = unsubscribers = {};
        }

        unsubscribers[propertyName] = unsubscribe;
      }
    } // region propertyChanged

  }, {
    key: "propertyChanged",
    get: function get() {
      var propertyChanged = this.__meta.propertyChanged;

      if (!propertyChanged) {
        this.__meta.propertyChanged = propertyChanged = new PropertyChangedSubject(this);
      }

      return propertyChanged;
    }
  }, {
    key: "propertyChangedIfCanEmit",
    get: function get() {
      var _this$__meta = this.__meta,
          propertyChangedDisabled = _this$__meta.propertyChangedDisabled,
          propertyChanged = _this$__meta.propertyChanged;
      return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
    } // endregion

  }]);
  return PropertyChangedObject;
}();

exports.PropertyChangedObject = PropertyChangedObject;
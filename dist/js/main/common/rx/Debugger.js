"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Debugger = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _subject = require("./subjects/subject");

var Debugger =
/*#__PURE__*/
function () {
  function Debugger() {
    (0, _classCallCheck2.default)(this, Debugger);
    this._dependencySubject = new _subject.Subject();
    this._connectorSubject = new _subject.Subject();
    this._invalidatedSubject = new _subject.Subject();
    this._calculatedSubject = new _subject.Subject();
    this._deepSubscribeSubject = new _subject.Subject();
    this._deepSubscribeLastValueSubject = new _subject.Subject();
    this._errorSubject = new _subject.Subject();
  } // region onDependencyChanged


  (0, _createClass2.default)(Debugger, [{
    key: "onDependencyChanged",
    value: function onDependencyChanged(target, value, parent, key, keyType) {
      if (this._dependencySubject.hasSubscribers) {
        this._dependencySubject.emit({
          target: target,
          value: value,
          parent: parent,
          key: key,
          keyType: keyType
        });
      }
    } // endregion
    // region onConnectorChanged

  }, {
    key: "onConnectorChanged",
    value: function onConnectorChanged(target, targetKey, value, parent, key, keyType) {
      if (this._connectorSubject.hasSubscribers) {
        this._connectorSubject.emit({
          target: target,
          targetKey: targetKey,
          value: value,
          parent: parent,
          key: key,
          keyType: keyType
        });
      }
    } // endregion
    // region onInvalidated

  }, {
    key: "onInvalidated",
    value: function onInvalidated(target, value) {
      if (this._invalidatedSubject.hasSubscribers) {
        this._invalidatedSubject.emit({
          target: target,
          value: value
        });
      }
    } // endregion
    // region onCalculated

  }, {
    key: "onCalculated",
    value: function onCalculated(target, oldValue, newValue) {
      if (this._calculatedSubject.hasSubscribers) {
        this._calculatedSubject.emit({
          target: target,
          newValue: newValue,
          oldValue: oldValue
        });
      }
    } // endregion
    // region onDeepSubscribe

  }, {
    key: "onDeepSubscribe",
    value: function onDeepSubscribe(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule, oldIsLeaf, newIsLeaf, target) {
      if (this._deepSubscribeSubject.hasSubscribers) {
        this._deepSubscribeSubject.emit({
          key: key,
          oldValue: oldValue,
          newValue: newValue,
          parent: parent,
          changeType: changeType,
          keyType: keyType,
          propertiesPath: propertiesPath,
          rule: rule,
          oldIsLeaf: oldIsLeaf,
          newIsLeaf: newIsLeaf,
          target: target
        });
      }
    } // endregion
    // region onDeepSubscribeLastValue

  }, {
    key: "onDeepSubscribeLastValue",
    value: function onDeepSubscribeLastValue(unsubscribedValue, subscribedValue, target) {
      if (this._deepSubscribeLastValueSubject.hasSubscribers) {
        this._deepSubscribeLastValueSubject.emit({
          unsubscribedValue: unsubscribedValue,
          subscribedValue: subscribedValue,
          target: target
        });
      }
    } // endregion
    // region onError

  }, {
    key: "onError",
    value: function onError(target, newValue, oldValue, err) {
      if (this._errorSubject.hasSubscribers) {
        this._errorSubject.emit({
          target: target,
          newValue: newValue,
          oldValue: oldValue,
          error: err
        });
      }
    } // endregion

  }, {
    key: "dependencyObservable",
    get: function get() {
      return this._dependencySubject;
    }
  }, {
    key: "connectorObservable",
    get: function get() {
      return this._connectorSubject;
    }
  }, {
    key: "invalidatedObservable",
    get: function get() {
      return this._invalidatedSubject;
    }
  }, {
    key: "calculatedObservable",
    get: function get() {
      return this._calculatedSubject;
    }
  }, {
    key: "deepSubscribeObservable",
    get: function get() {
      return this._deepSubscribeSubject;
    }
  }, {
    key: "deepSubscribeLastValueHasSubscribers",
    get: function get() {
      return this._deepSubscribeLastValueSubject.hasSubscribers;
    }
  }, {
    key: "deepSubscribeLastValueObservable",
    get: function get() {
      return this._deepSubscribeLastValueSubject;
    }
  }, {
    key: "errorObservable",
    get: function get() {
      return this._errorSubject;
    }
  }]);
  return Debugger;
}();

exports.Debugger = Debugger;
Debugger.Instance = new Debugger();
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.CalcObjectDebugger = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _subject = require("../../subjects/subject");

var CalcObjectDebugger =
/*#__PURE__*/
function () {
  function CalcObjectDebugger() {
    (0, _classCallCheck2.default)(this, CalcObjectDebugger);
    this._dependencySubject = new _subject.Subject();
    this._connectorSubject = new _subject.Subject();
    this._invalidatedSubject = new _subject.Subject();
    this._calculatedSubject = new _subject.Subject();
    this._errorSubject = new _subject.Subject();
  } // region onDependencyChanged


  (0, _createClass2.default)(CalcObjectDebugger, [{
    key: "onDependencyChanged",
    value: function onDependencyChanged(target, value, parent, propertyName) {
      if (this._dependencySubject.hasSubscribers) {
        this._dependencySubject.emit({
          target: target,
          value: value,
          parent: parent,
          propertyName: propertyName
        });
      }
    } // endregion
    // region onConnectorChanged

  }, {
    key: "onConnectorChanged",
    value: function onConnectorChanged(target, value, parent, propertyName) {
      if (this._connectorSubject.hasSubscribers) {
        this._connectorSubject.emit({
          target: target,
          value: value,
          parent: parent,
          propertyName: propertyName
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
    value: function onCalculated(target, newValue, oldValue) {
      if (this._calculatedSubject.hasSubscribers) {
        this._calculatedSubject.emit({
          target: target,
          newValue: newValue,
          oldValue: oldValue
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
          err: err
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
    key: "errorObservable",
    get: function get() {
      return this._errorSubject;
    }
  }]);
  return CalcObjectDebugger;
}();

exports.CalcObjectDebugger = CalcObjectDebugger;
CalcObjectDebugger.Instance = new CalcObjectDebugger();
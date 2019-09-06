"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcObjectDebugger = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _subject = require("../../subjects/subject");

var CalcObjectDebugger =
/*#__PURE__*/
function () {
  function CalcObjectDebugger() {
    this._dependencySubject = new _subject.Subject();
    this._connectorSubject = new _subject.Subject();
    this._invalidatedSubject = new _subject.Subject();
    this._calculatedSubject = new _subject.Subject();
    this._errorSubject = new _subject.Subject();
  } // region onDependencyChanged


  var _proto = CalcObjectDebugger.prototype;

  _proto.onDependencyChanged = function onDependencyChanged(target, value, parent, propertyName) {
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
  ;

  _proto.onConnectorChanged = function onConnectorChanged(target, value, parent, propertyName) {
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
  ;

  _proto.onInvalidated = function onInvalidated(target, value) {
    if (this._invalidatedSubject.hasSubscribers) {
      this._invalidatedSubject.emit({
        target: target,
        value: value
      });
    }
  } // endregion
  // region onCalculated
  ;

  _proto.onCalculated = function onCalculated(target, newValue, oldValue) {
    if (this._calculatedSubject.hasSubscribers) {
      this._calculatedSubject.emit({
        target: target,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  } // endregion
  // region onError
  ;

  _proto.onError = function onError(target, newValue, oldValue, err) {
    if (this._errorSubject.hasSubscribers) {
      this._errorSubject.emit({
        target: target,
        newValue: newValue,
        oldValue: oldValue,
        err: err
      });
    }
  } // endregion
  ;

  (0, _createClass2.default)(CalcObjectDebugger, [{
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
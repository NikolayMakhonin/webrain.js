import { Subject } from '../../subjects/subject';
export class CalcObjectDebugger {
  constructor() {
    this._dependencySubject = new Subject();
    this._connectorSubject = new Subject();
    this._invalidatedSubject = new Subject();
    this._calculatedSubject = new Subject();
    this._errorSubject = new Subject();
  } // region onDependencyChanged


  get dependencyObservable() {
    return this._dependencySubject;
  }

  onDependencyChanged(target, value, parent, propertyName) {
    if (this._dependencySubject.hasSubscribers) {
      this._dependencySubject.emit({
        target,
        value,
        parent,
        propertyName
      });
    }
  } // endregion
  // region onConnectorChanged


  get connectorObservable() {
    return this._connectorSubject;
  }

  onConnectorChanged(target, value, parent, propertyName) {
    if (this._connectorSubject.hasSubscribers) {
      this._connectorSubject.emit({
        target,
        value,
        parent,
        propertyName
      });
    }
  } // endregion
  // region onInvalidated


  get invalidatedObservable() {
    return this._invalidatedSubject;
  }

  onInvalidated(target, value) {
    if (this._invalidatedSubject.hasSubscribers) {
      this._invalidatedSubject.emit({
        target,
        value
      });
    }
  } // endregion
  // region onCalculated


  get calculatedObservable() {
    return this._calculatedSubject;
  }

  onCalculated(target, newValue, oldValue) {
    if (this._calculatedSubject.hasSubscribers) {
      this._calculatedSubject.emit({
        target,
        newValue,
        oldValue
      });
    }
  } // endregion
  // region onError


  get errorObservable() {
    return this._errorSubject;
  }

  onError(target, newValue, oldValue, err) {
    if (this._errorSubject.hasSubscribers) {
      this._errorSubject.emit({
        target,
        newValue,
        oldValue,
        err
      });
    }
  } // endregion


}
CalcObjectDebugger.Instance = new CalcObjectDebugger();
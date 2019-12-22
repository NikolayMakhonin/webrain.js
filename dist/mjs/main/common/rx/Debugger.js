import { Subject } from './subjects/subject';
export class Debugger {
  constructor() {
    this._dependencySubject = new Subject();
    this._connectorSubject = new Subject();
    this._invalidatedSubject = new Subject();
    this._calculatedSubject = new Subject();
    this._deepSubscribeSubject = new Subject();
    this._deepSubscribeLastValueSubject = new Subject();
    this._errorSubject = new Subject();
  } // region onDependencyChanged


  get dependencyObservable() {
    return this._dependencySubject;
  }

  onDependencyChanged(target, value, parent, key, keyType) {
    if (this._dependencySubject.hasSubscribers) {
      this._dependencySubject.emit({
        target,
        value,
        parent,
        key,
        keyType
      });
    }
  } // endregion
  // region onConnectorChanged


  get connectorObservable() {
    return this._connectorSubject;
  }

  onConnectorChanged(target, targetKey, value, parent, key, keyType) {
    if (this._connectorSubject.hasSubscribers) {
      this._connectorSubject.emit({
        target,
        targetKey,
        value,
        parent,
        key,
        keyType
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

  onCalculated(target, oldValue, newValue) {
    if (this._calculatedSubject.hasSubscribers) {
      this._calculatedSubject.emit({
        target,
        newValue,
        oldValue
      });
    }
  } // endregion
  // region onDeepSubscribe


  get deepSubscribeObservable() {
    return this._deepSubscribeSubject;
  }

  onDeepSubscribe(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule, oldIsLeaf, newIsLeaf, target) {
    if (this._deepSubscribeSubject.hasSubscribers) {
      this._deepSubscribeSubject.emit({
        key,
        oldValue,
        newValue,
        parent,
        changeType,
        keyType,
        propertiesPath,
        rule,
        oldIsLeaf,
        newIsLeaf,
        target
      });
    }
  } // endregion
  // region onDeepSubscribeLastValue


  get deepSubscribeLastValueHasSubscribers() {
    return this._deepSubscribeLastValueSubject.hasSubscribers;
  }

  get deepSubscribeLastValueObservable() {
    return this._deepSubscribeLastValueSubject;
  }

  onDeepSubscribeLastValue(unsubscribedValue, subscribedValue, target) {
    if (this._deepSubscribeLastValueSubject.hasSubscribers) {
      this._deepSubscribeLastValueSubject.emit({
        unsubscribedValue,
        subscribedValue,
        target
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
        error: err
      });
    }
  } // endregion


}
Debugger.Instance = new Debugger();
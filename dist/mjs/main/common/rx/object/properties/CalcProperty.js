import { isAsync } from '../../../async/async';
import { resolveAsyncFunc, ThenableSync } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { DeferredCalc } from '../../deferred-calc/DeferredCalc';
import { ObservableClass } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcObjectDebugger } from './CalcObjectDebugger';
import { Property } from './Property';
/** @return true: value changed; false: value not changed; null - auto */

export class CalcPropertyValue {
  constructor(property) {
    this.get = () => property;
  }

}
export class CalcProperty extends ObservableClass {
  constructor({
    calcFunc,
    name,
    calcOptions,
    valueOptions,
    initValue
  }) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    if (typeof initValue !== 'function') {
      this._initValue = initValue;
    }

    if (typeof name !== 'undefined') {
      this.name = name;
    }

    this._calcFunc = calcFunc;
    this._valueProperty = new Property(valueOptions, initValue);
    this._deferredCalc = new DeferredCalc(() => {
      this.onInvalidated();
    }, done => {
      const prevValue = this._valueProperty.value;
      const deferredValue = resolveAsyncFunc(() => {
        if (typeof this.input === 'undefined') {
          return false;
        }

        return this._calcFunc(this.input, this._valueProperty);
      }, valueChanged => {
        this._hasValue = true;
        const val = this._valueProperty.value;
        CalcObjectDebugger.Instance.onCalculated(this, val, prevValue);
        done(valueChanged != null ? valueChanged : prevValue !== val, prevValue, val);
        return val;
      }, err => {
        CalcObjectDebugger.Instance.onError(this, this._valueProperty.value, prevValue, err);
        const val = this._valueProperty.value;
        done(prevValue !== val, prevValue, val);
        return ThenableSync.createRejected(err);
      }, true);

      if (isAsync(deferredValue)) {
        this.setDeferredValue(deferredValue);
      }
    }, (isChanged, oldValue, newValue) => {
      if (isChanged) {
        this.setDeferredValue(newValue);
        this.onValueChanged(oldValue, newValue);
      }
    }, calcOptions);
  }

  setDeferredValue(newValue) {
    const oldValue = this._deferredValue;

    if (newValue === oldValue) {
      return;
    }

    this._deferredValue = newValue;
    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: VALUE_PROPERTY_DEFAULT,
        oldValue,
        newValue
      }, {
        name: 'wait',
        oldValue,
        newValue
      });
    }
  }

  onValueChanged(oldValue, newValue) {
    if (newValue === oldValue) {
      return;
    }

    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'last',
        oldValue,
        newValue
      });
    }
  }

  invalidate() {
    this._deferredCalc.invalidate();
  }

  onInvalidated() {
    CalcObjectDebugger.Instance.onInvalidated(this, this._valueProperty.value);
    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      this._deferredCalc.calc();
    }
  }

  get [VALUE_PROPERTY_DEFAULT]() {
    return this.wait;
  }

  get wait() {
    this._deferredCalc.calc();

    return this._deferredValue;
  }

  get last() {
    this._deferredCalc.calc();

    return this._valueProperty.value;
  }

  get lastOrWait() {
    this._deferredCalc.calc();

    return this._hasValue ? this._valueProperty.value : this._deferredValue;
  }

  clear() {
    if (this._valueProperty.value !== this._initValue) {
      const oldValue = this._valueProperty.value;
      const newValue = this._initValue;
      this._valueProperty.value = newValue;
      this.onValueChanged(oldValue, newValue);
      this.setDeferredValue(newValue);
      this.invalidate();
    }
  }

}
new ObservableObjectBuilder(CalcProperty.prototype).writable('input'); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
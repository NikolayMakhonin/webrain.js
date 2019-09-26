import { resolveAsyncFunc } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { DeferredCalc } from '../../deferred-calc/DeferredCalc';
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcObjectDebugger } from './CalcObjectDebugger';
import { Property } from './Property';
export class CalcPropertyValue {
  constructor(property) {
    this.get = () => property;
  }

}
export class CalcProperty extends ObservableObject {
  constructor(calcFunc, calcOptions, valueOptions, initValue) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    if (typeof initValue !== 'function') {
      this._initValue = initValue;
    }

    this._calcFunc = calcFunc;
    this._valueProperty = new Property(valueOptions, initValue);
    this._deferredCalc = new DeferredCalc(() => {
      this.onInvalidated();
    }, done => {
      const prevValue = this._valueProperty.value;
      this._deferredValue = resolveAsyncFunc(() => this._calcFunc(this.input, this._valueProperty), () => {
        this._hasValue = true;
        const val = this._valueProperty.value;
        CalcObjectDebugger.Instance.onCalculated(this, val, prevValue);
        done(prevValue !== val);
        return val;
      }, err => {
        CalcObjectDebugger.Instance.onError(this, this._valueProperty.value, prevValue, err);
        done(prevValue !== this._valueProperty.value);
        return err;
      }, true);
    }, isChanged => {
      if (isChanged) {
        this.onCalculated();
      }
    }, calcOptions);
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
      const oldValue = this._valueProperty.value;
      const newValue = this.last; // new CalcPropertyValue(this)

      propertyChangedIfCanEmit.onPropertyChanged({
        name: VALUE_PROPERTY_DEFAULT,
        oldValue,
        newValue
      }, {
        name: 'wait',
        oldValue,
        newValue
      }, {
        name: 'last',
        oldValue,
        newValue
      }, {
        name: 'lastOrWait',
        oldValue,
        newValue
      });
    }
  }

  onCalculated() {
    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      const oldValue = this._valueProperty.value;
      const newValue = this.last; // new CalcPropertyValue(this)

      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'last',
        oldValue,
        newValue
      }, {
        name: 'lastOrWait',
        oldValue,
        newValue
      });
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
      this._valueProperty.value = this._initValue;
      this.invalidate();
    }
  }

}
new ObservableObjectBuilder(CalcProperty.prototype).writable('input'); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
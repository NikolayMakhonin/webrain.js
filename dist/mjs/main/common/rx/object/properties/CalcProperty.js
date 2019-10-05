import { isAsync } from '../../../async/async';
import { resolveAsyncFunc } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { webrainOptions } from '../../../helpers/webrainOptions';
import { DeferredCalc } from '../../deferred-calc/DeferredCalc';
import { ObservableClass } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcObjectDebugger } from './CalcObjectDebugger';
export class CalcPropertyValue {
  constructor(property) {
    this.get = () => property;
  }

}
export class CalcPropertyState extends ObservableClass {
  constructor(calcOptions, initValue) {
    super();
    this.calcOptions = calcOptions;
    this.value = initValue;
  }

}
new ObservableObjectBuilder(CalcPropertyState.prototype).writable('input').writable('value');
export class CalcProperty extends ObservableClass {
  constructor({
    calcFunc,
    name,
    calcOptions,
    initValue
  }) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    if (typeof initValue !== 'function') {
      this._initValue = initValue;
    }

    if (!calcOptions) {
      calcOptions = {};
    }

    this._calcFunc = calcFunc;
    this.state = new CalcPropertyState(calcOptions, initValue);

    if (typeof name !== 'undefined') {
      this.state.name = name;
    }

    this._deferredCalc = new DeferredCalc(() => {
      this.onInvalidated();
    }, done => {
      const prevValue = this.state.value;
      const deferredValue = resolveAsyncFunc(() => {
        if (typeof this.state.input === 'undefined') {
          return false;
        }

        return this._calcFunc(this.state);
      }, isChangedForce => {
        this._hasValue = true;
        let val = this.state.value;

        if (webrainOptions.equalsFunc.call(this.state, prevValue, this.state.value)) {
          this.state.value = val = prevValue;
        }

        CalcObjectDebugger.Instance.onCalculated(this, prevValue, val);
        done(isChangedForce, prevValue, val);
        return val;
      }, err => {
        this._error = err;
        console.error(err);
        CalcObjectDebugger.Instance.onError(this, this.state.value, prevValue, err);
        let val = this.state.value;

        if (webrainOptions.equalsFunc.call(this.state, prevValue, this.state.value)) {
          this.state.value = val = prevValue;
        }

        done(prevValue !== val, prevValue, val);
        return val; // ThenableSync.createRejected(err)
      }, true);

      if (isAsync(deferredValue)) {
        this.setDeferredValue(deferredValue);
      }
    }, (isChangedForce, oldValue, newValue) => {
      if (isChangedForce || oldValue !== newValue) {
        if (!isChangedForce && isAsync(this._deferredValue)) {
          this._deferredValue = newValue;
        } else {
          this.setDeferredValue(newValue, isChangedForce);
        }

        this.onValueChanged(oldValue, newValue, isChangedForce);
      }
    }, calcOptions);
  }

  setDeferredValue(newValue, force) {
    const oldValue = this._deferredValue;

    if (!force && (webrainOptions.equalsFunc ? webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue === newValue)) {
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

  onValueChanged(oldValue, newValue, force) {
    if (!force && (webrainOptions.equalsFunc ? webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue === newValue)) {
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
    if (!this._error) {
      this._deferredCalc.invalidate();
    }
  }

  onInvalidated() {
    CalcObjectDebugger.Instance.onInvalidated(this, this.state.value);
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

    return this.state.value;
  }

  get lastOrWait() {
    this._deferredCalc.calc();

    return this._hasValue ? this.state.value : this._deferredValue;
  }

  clear() {
    if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(this, this.state.value, this._initValue) : this.state.value !== this._initValue) {
      const oldValue = this.state.value;
      const newValue = this._initValue;
      this.state.value = newValue;
      this.onValueChanged(oldValue, newValue);
      this.setDeferredValue(newValue);
      this.invalidate();
    }
  }

} // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']
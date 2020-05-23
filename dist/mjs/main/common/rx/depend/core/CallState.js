import { isAsync, isThenable } from '../../../async/async';
import { resolveAsync, ThenableSync } from '../../../async/ThenableSync';
import { isIterator, nextHash } from '../../../helpers/helpers';
import { webrainEquals, webrainOptions } from '../../../helpers/webrainOptions';
import { ObjectPool } from '../../../lists/ObjectPool';
import { PairingHeap } from '../../../lists/PairingHeap';
import { fastNow } from '../../../time/helpers';
import { Subject } from '../../subjects/subject';
import { CallStatusShort } from './contracts';
import { getCurrentState, setCurrentState } from './current-state';
import { InternalError } from './helpers'; // region CallStatus
// region Types

// endregion
// region Constants
export const Flag_None = 0;
export const Flag_Invalidating = 1;
export const Flag_Invalidated = 2;
export const Mask_Invalidate = 3;
export const Flag_Recalc = 4;
export const Flag_Parent_Invalidating = 8;
export const Flag_Parent_Invalidated = 16;
export const Mask_Parent_Invalidate = 24;
export const Flag_Parent_Recalc = 32;
export const Flag_Check = 128;
export const Flag_Calculating = 256;
export const Flag_Async = 512;
export const Flag_Calculated = 1024;
export const Mask_Calculate = 1920;
export const Flag_HasValue = 2048;
export const Flag_HasError = 4096;
export const Flag_InternalError = 8192;
export const Update_Invalidating = Flag_Invalidating;
export const Update_Invalidated = Flag_Invalidated;
export const Update_Recalc = 4;
export const Update_Invalidating_Recalc = 5;
export const Update_Invalidated_Recalc = 6;
export const Update_Check = Flag_Check;
export const Update_Check_Async = 640;
export const Update_Calculating = Flag_Calculating;
export const Update_Calculating_Async = 768;
export const Update_Calculated_Value = 3072;
export const Update_Calculated_Error = 5120;
export const Mask_Update_Invalidate = Update_Invalidating | Update_Invalidated | Update_Invalidating_Recalc | Update_Invalidated_Recalc;
export const Mask_Update = Mask_Update_Invalidate | Update_Check | Update_Check_Async | Update_Calculating | Update_Calculating_Async | Update_Calculated_Value | Update_Calculated_Error; // endregion
// TODO inline these methods
// region Properties
// region Invalidate

export function getInvalidate(status) {
  return status & Mask_Invalidate;
}
export function setInvalidate(status, value) {
  return status & ~Mask_Invalidate | value;
}
export function isInvalidating(status) {
  return (status & Flag_Invalidating) !== 0;
}
export function isInvalidated(status) {
  return (status & Flag_Invalidated) !== 0;
} // endregion
// region Recalc

export function isRecalc(status) {
  return (status & Flag_Recalc) !== 0;
}
export function setRecalc(status, value) {
  return value ? status | Flag_Recalc : status & ~Flag_Recalc;
} // endregion
// region Calculate

export function getCalculate(status) {
  return status & Mask_Calculate;
}
export function setCalculate(status, value) {
  return status & ~Mask_Calculate | value;
}
export function isCheck(status) {
  return (status & Flag_Check) !== 0;
}
export function isCalculating(status) {
  return (status & Flag_Calculating) !== 0;
}
export function isCalculated(status) {
  return (status & Flag_Calculated) !== 0;
} // endregion
// region HasValue

export function isHasValue(status) {
  return (status & Flag_HasValue) !== 0;
}
export function setHasValue(status, value) {
  return value ? status | Flag_HasValue : status & ~Flag_HasValue;
} // endregion
// region HasError

export function isHasError(status) {
  return (status & Flag_HasError) !== 0;
}
export function setHasError(status, value) {
  return value ? status | Flag_HasError : status & ~Flag_HasError;
} // endregion
// endregion
// region Methods
// export function checkStatus(status: CallStatus): boolean {
// 	if ((status & Mask_Invalidate) === Mask_Invalidate) {
// 		return false
// 	}
//
// 	if ((status & Flag_Recalc) !== 0 && (status & Mask_Invalidate) === 0) {
// 		return false
// 	}
//
// 	if ((status & Flag_Calculated) !== 0) {
// 		if ((status & Mask_Invalidate) !== 0) {
// 			return false
// 		}
// 		if ((status & Flag_Calculating) !== 0) {
// 			return false
// 		}
// 	}
//
// 	if ((status & Flag_Calculating) === 0 && (status & Flag_Async) !== 0) {
// 		return false
// 	}
//
// 	if ((status & (Mask_Invalidate | Mask_Calculate)) === 0) {
// 		return false
// 	}
//
// 	return true
// }

export function statusToString(status) {
  const buffer = [''];

  if ((status & Flag_Invalidating) !== 0) {
    buffer.push('Invalidating');
  }

  if ((status & Flag_Invalidated) !== 0) {
    buffer.push('Invalidated');
  }

  if ((status & Flag_Recalc) !== 0) {
    buffer.push('Recalc');
  }

  if ((status & Flag_Check) !== 0) {
    buffer.push('Check');
  }

  if ((status & Flag_Calculating) !== 0) {
    buffer.push('Calculating');
  }

  if ((status & Flag_Async) !== 0) {
    buffer.push('Async');
  }

  if ((status & Flag_Calculated) !== 0) {
    buffer.push('Calculated');
  }

  if ((status & Flag_HasError) !== 0) {
    buffer.push('HasError');
  }

  if ((status & Flag_HasValue) !== 0) {
    buffer.push('HasValue');
  }

  const remain = status & ~(Flag_Invalidating | Flag_Invalidated | Flag_Recalc | Flag_Check | Flag_Calculating | Flag_Async | Flag_Calculated | Flag_HasError | Flag_HasValue);

  if (remain !== 0) {
    buffer.push(remain + '');
  }

  return buffer.join(' | ');
}
export function toStatusShort(status) {
  if ((status & (Flag_Check | Flag_Calculating | Flag_Invalidating)) !== 0) {
    return CallStatusShort.Handling;
  }

  if ((status & Flag_Invalidated) !== 0) {
    return CallStatusShort.Invalidated;
  }

  if ((status & Flag_Calculated) !== 0) {
    if ((status & Flag_HasError) !== 0) {
      return CallStatusShort.CalculatedError;
    }

    if ((status & Flag_HasValue) !== 0) {
      return CallStatusShort.CalculatedValue;
    }
  }

  throw new InternalError(`Cannot convert CallStatus (${statusToString(status)}) to CallStatusShort`);
} // endregion
// endregion
// region constants
// tslint:disable-next-line:no-construct use-primitive-type

export const ALWAYS_CHANGE_VALUE = new String('ALWAYS_CHANGE_VALUE'); // tslint:disable-next-line:no-construct use-primitive-type

export const NO_CHANGE_VALUE = new String('NO_CHANGE_VALUE');
const Flag_Before_Calc = 1;
const Flag_After_Calc = 2;
const Mask_Invalidate_Parent = 3; // endregion
// region variables

let nextCallId = 1; // endregion
// region subscriberLinkPool

export const subscriberLinkPool = new ObjectPool(1000000);
export function releaseSubscriberLink(obj) {
  subscriberLinkPool.release(obj);
}
export function getSubscriberLink(state, subscriber, prev, next, isLazy) {
  const item = subscriberLinkPool.get();

  if (item != null) {
    item.state = state;
    item.value = subscriber;
    item.prev = prev;
    item.next = next;
    item.isLazy = isLazy;
    return item;
  }

  return {
    state,
    value: subscriber,
    prev,
    next,
    isLazy
  };
}
export function subscriberLinkDelete(item) {
  const {
    prev,
    next,
    state
  } = item;

  if (state == null) {
    return;
  }

  if (item === state._subscribersCalculating) {
    state._subscribersCalculating = prev;
  }

  if (prev == null) {
    if (next == null) {
      state._subscribersFirst = null;
      state._subscribersLast = null;
    } else {
      state._subscribersFirst = next;
      next.prev = null;
      item.next = null;
    }
  } else {
    if (next == null) {
      state._subscribersLast = prev;
      prev.next = null;
    } else {
      prev.next = next;
      next.prev = prev;
      item.next = null;
    }

    item.prev = null;
  }

  item.state = null;
  item.value = null;
  releaseSubscriberLink(item);
} // endregion
// region helpers
// tslint:disable-next-line:no-empty

function EMPTY_FUNC(...args) {}

export function invalidateParent(link, status) {
  const next = link.next;
  const childState = link.value;
  const childStatus = childState.status & Mask_Update_Invalidate; // this condition needed only for optimization

  if (childStatus === 0 || isRecalc(status) // TODO delete this and test
  || status !== childStatus && childStatus !== Update_Invalidated_Recalc && (childStatus === Update_Recalc || childStatus === Update_Invalidating || status !== Update_Invalidating && (childStatus === Update_Invalidated || status !== Update_Recalc))) {
    childState._updateInvalidate(status, false);
  }

  return next;
} // endregion

export class CallState {
  constructor(func, thisOuter, callWithArgs, funcCall, valueIds) {
    this._lastAccessTime = 0;
    this.status = Flag_Invalidated | Flag_Recalc;
    this.valueAsync = null;
    this.value = void 0;
    this.error = void 0;
    this._data = null;
    this.deferredOptions = null;
    this._deferredCalc = null;
    this._parentCallState = null;
    this._subscribersFirst = null;
    this._subscribersLast = null;
    this._subscribersCalculating = null;
    this._callId = 0;
    this._unsubscribers = null;
    this._unsubscribersLength = 0;
    this._changedSubject = null;
    this.func = func;
    this._this = thisOuter;
    this.callWithArgs = callWithArgs;
    this.funcCall = funcCall;
    this.valueIds = valueIds;
  } // region properties
  // region public/private


  get valueOrThrow() {
    if (isHasError(this.status)) {
      throw this.error;
    }

    return this.value;
  }

  get data() {
    let {
      _data
    } = this;

    if (_data == null) {
      this._data = _data = {};
    }

    return _data;
  }

  // endregion
  // region calculable
  // TODO hasDependent ...
  get hasSubscribers() {
    return this._changedSubject != null && this._changedSubject.hasSubscribers;
  }

  get statusShort() {
    return toStatusShort(this.status);
  }

  get statusString() {
    return statusToString(this.status);
  } // public get hasValue(): boolean {
  // 	return (this.status & Flag_HasValue) !== 0
  // }
  //
  // public get hasError(): boolean {
  // 	return (this.status & Flag_HasError) !== 0
  // }
  //
  // public get hasValueOrAsync(): boolean {
  // 	return (this.status & (Flag_HasValue | Flag_Async)) !== 0
  // }
  //
  // public get valueOrAsync(): IThenable<TInnerValue<TResultInner>> | TInnerValue<TResultInner> {
  // 	return this.valueAsync != null
  // 		? this.valueAsync
  // 		: this.value
  // }
  // endregion
  // endregion
  // region methods
  // region 1: calc


  getValue(isLazy, dontThrowOnError) {
    const currentState = getCurrentState();

    if (currentState != null && (currentState.status & Flag_Check) === 0) {
      currentState._subscribeDependency.call(currentState, this, !!isLazy);
    } // TODO: delete line and test


    this._callId = nextCallId++;
    const prevStatus = this.status;

    if (isCalculated(this.status)) {
      this._lastAccessTime = fastNow();
      return dontThrowOnError ? this.value : this.valueOrThrow;
    } else if (getCalculate(this.status) !== 0) {
      if ((this.status & Flag_Async) !== 0) {
        let parentCallState = currentState;

        while (parentCallState) {
          if (parentCallState === this) {
            this._internalError('Recursive async loop detected');
          }

          parentCallState = parentCallState._parentCallState;
        }

        if (isLazy) {
          return dontThrowOnError ? this.value : this.valueOrThrow;
        }

        return this.valueAsync;
      } else if ((this.status & (Flag_Check | Flag_Calculating)) !== 0) {
        this._internalError('Recursive sync loop detected');
      } else {
        this._internalError(`Unknown CallStatus: ${statusToString(this.status)}`);
      }
    } else if (getInvalidate(this.status) !== 0) {// nothing
    } else {
      this._internalError(`Unknown CallStatus: ${statusToString(this.status)}`);
    }

    this._parentCallState = currentState;
    setCurrentState(null);

    this._updateCheck();

    let shouldRecalc;

    if (isRecalc(prevStatus)) {
      shouldRecalc = true;
    } else {
      shouldRecalc = this._checkDependenciesChanged();
    }

    if (shouldRecalc === false) {
      setCurrentState(this._parentCallState);
      this._parentCallState = null;
      return dontThrowOnError ? this.value : this.valueOrThrow;
    }

    let value;

    if (shouldRecalc === true) {
      value = this._calc(dontThrowOnError);
    } else if (isIterator(shouldRecalc)) {
      value = resolveAsync(shouldRecalc, o => {
        if (o === false) {
          if ((this.status & Flag_Async) !== 0) {
            this._parentCallState = null;
          }

          return dontThrowOnError ? this.value : this.valueOrThrow;
        }

        return this._calc(dontThrowOnError);
      });
      setCurrentState(this._parentCallState);

      if (isThenable(value)) {
        this._updateCheckAsync(value);
      } else {
        this._parentCallState = null;
      }
    } else {
      this._internalError(`shouldRecalc == ${shouldRecalc}`);
    }

    if (isLazy && isThenable(value)) {
      return dontThrowOnError ? this.value : this.valueOrThrow;
    }

    return value;
  }

  _calc(dontThrowOnError) {
    this._updateCalculating();

    this._callId = nextCallId++;
    let _isAsync = false;

    try {
      setCurrentState(this);
      let value = this.funcCall(this);

      if (!isAsync(value)) {
        this._updateCalculatedValue(value);

        return value;
      }

      if (isThenable(value) && !(value instanceof ThenableSync)) {
        this._internalError('You should use iterator or ThenableSync instead Promise for async functions');
      }

      _isAsync = true; // Old method:
      // value = resolveAsync(
      // 	this._makeDependentIterator(value) as ThenableOrIteratorOrValue<TResultInner>,
      // )
      // New method (more functionality)

      value = resolveAsync(value, val => {
        if ((this.status & Flag_Async) !== 0) {
          this._parentCallState = null;
        }

        this._updateCalculatedValue(val);

        return val;
      }, error => {
        if ((this.status & Flag_Async) !== 0) {
          this._parentCallState = null;
        }

        this._updateCalculatedError(error);

        throw error;
      });

      if (isThenable(value)) {
        this._updateCalculatingAsync(value);
      }

      return value;
    } catch (error) {
      if (!_isAsync || error instanceof InternalError) {
        this._updateCalculatedError(error);
      }

      if (dontThrowOnError !== true || error instanceof InternalError) {
        throw error;
      }
    } finally {
      setCurrentState(this._parentCallState);

      if (!_isAsync) {
        this._parentCallState = null;
      }
    }
  } // private* _makeDependentIterator(
  // 	iterator: Iterator<TInnerValue<TResultInner>>,
  // 	nested?: boolean,
  // ): Iterator<TInnerValue<TResultInner>> {
  // 	setCurrentState(this)
  //
  // 	try {
  // 		let iteration = iterator.next()
  // 		let value: TIteratorOrValue<TInnerValue<TResultInner>>
  //
  // 		while (true) {
  // 			value = iteration.value
  //
  // 			if (isIterator(value)) {
  // 				value = this._makeDependentIterator(value as Iterator<TInnerValue<TResultInner>>, true)
  // 			}
  //
  // 			value = yield value as any
  //
  // 			if (iteration.done) {
  // 				break
  // 			}
  //
  // 			setCurrentState(this)
  // 			iteration = iterator.next(value as any)
  // 			setCurrentState(null)
  // 		}
  //
  // 		if ((this.status & Flag_Async) !== 0) {
  // 			// setCurrentState(this._parentCallState)
  // 			if (nested == null) {
  // 				this._parentCallState = null
  // 			}
  // 		}
  // 		if (nested == null) {
  // 			this._updateCalculatedValue(value as any)
  // 		}
  // 		return value
  // 	} catch (error) {
  // 		if ((this.status & Flag_Async) !== 0) {
  // 			// setCurrentState(this._parentCallState)
  // 			if (nested == null) {
  // 				this._parentCallState = null
  // 			}
  // 		}
  // 		if (nested == null) {
  // 			this._updateCalculatedError(error)
  // 		}
  // 		throw error
  // 	}
  // }
  // endregion
  // region 2: subscribe / unsubscribe


  _subscribeDependency(dependency, isLazy) {
    // TODO optimize it
    if ((this.status & Flag_Async) !== 0 || this._callId < dependency._callId) {
      const _unsubscribers = this._unsubscribers;

      for (let i = 0, len = this._unsubscribersLength; i < len; i++) {
        if (_unsubscribers[i].state === dependency) {
          return;
        }
      }
    }

    {
      const subscriberLink = dependency._subscribe(this, isLazy);

      const _unsubscribers = this._unsubscribers;

      if (_unsubscribers == null) {
        this._unsubscribers = [subscriberLink];
        this._unsubscribersLength = 1;
      } else {
        _unsubscribers[this._unsubscribersLength++] = subscriberLink;
      }
    }
  }

  _subscribe(subscriber, isLazy) {
    const _subscribersLast = this._subscribersLast;
    const subscriberLink = getSubscriberLink(this, subscriber, _subscribersLast, null, isLazy);

    if (_subscribersLast == null) {
      this._subscribersFirst = subscriberLink;
      this._subscribersLast = subscriberLink;
    } else if (isLazy && this._subscribersCalculating != null) {
      // insert after calculating
      const {
        _subscribersCalculating
      } = this;
      const {
        next
      } = _subscribersCalculating;

      if (next == null) {
        this._subscribersLast = subscriberLink;
      } else {
        subscriberLink.next = next;
        next.prev = subscriberLink;
      }

      _subscribersCalculating.next = subscriberLink;
      subscriberLink.prev = _subscribersCalculating;
      this._subscribersCalculating = subscriberLink;
    } else {
      _subscribersLast.next = subscriberLink;
      subscriberLink.prev = _subscribersLast;
      this._subscribersLast = subscriberLink;
    }

    return subscriberLink;
  }
  /** @internal */


  _unsubscribeDependencies(fromIndex) {
    const _unsubscribers = this._unsubscribers;

    if (_unsubscribers != null) {
      const len = this._unsubscribersLength;

      const _fromIndex = fromIndex == null ? 0 : fromIndex;

      for (let i = _fromIndex; i < len; i++) {
        const item = _unsubscribers[i];
        _unsubscribers[i] = null;
        subscriberLinkDelete(item);
      }

      this._unsubscribersLength = _fromIndex;

      if (_fromIndex < 256 && len > 256) {
        _unsubscribers.length = 256;
      }
    }
  } // endregion
  // region 3: check dependencies


  *_checkDependenciesChangedAsync(fromIndex) {
    const {
      _unsubscribers,
      _unsubscribersLength
    } = this;

    if (_unsubscribers != null) {
      for (let i = fromIndex || 0, len = _unsubscribersLength; i < len; i++) {
        const link = _unsubscribers[i];
        const dependencyState = link.state;
        const {
          isLazy
        } = link;

        if (getInvalidate(dependencyState.status) !== 0) {
          dependencyState.getValue(isLazy, true);
        }

        if ((this.status & Flag_Recalc) !== 0) {
          return true;
        }

        if (!isLazy && (dependencyState.status & Flag_Async) !== 0) {
          yield resolveAsync(dependencyState.valueAsync, null, EMPTY_FUNC);
        }

        if ((this.status & Flag_Recalc) !== 0) {
          return true;
        } // This is incorrect checking, because everything can happen after awaiting:
        // if (!isLazy && (
        // 	(dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0
        // 	|| (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0
        // )) {
        // 	this._internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`)
        // }

      }
    }

    this._updateCalculated();

    return false;
  }

  _checkDependenciesChanged() {
    const {
      _unsubscribers,
      _unsubscribersLength
    } = this;

    if (_unsubscribers != null) {
      for (let i = 0, len = _unsubscribersLength; i < len; i++) {
        const link = _unsubscribers[i];
        const dependencyState = link.state;
        const {
          isLazy
        } = link;

        if (getInvalidate(dependencyState.status) !== 0) {
          dependencyState.getValue(isLazy, true);
        }

        if ((this.status & Flag_Recalc) !== 0) {
          return true;
        }

        if (!isLazy && (dependencyState.status & Flag_Async) !== 0) {
          return this._checkDependenciesChangedAsync(i);
        }

        if (!isLazy && ((dependencyState.status & (Flag_Check | Flag_Calculating)) !== 0 || (dependencyState.status & (Flag_HasError | Flag_HasValue)) === 0)) {
          this._internalError(`Unexpected dependency status: ${statusToString(dependencyState.status)}`);
        }
      }
    }

    this._updateCalculated();

    return false;
  } // endregion
  // region 4: change value & status

  /** @internal */


  _internalError(message) {
    this._unsubscribeDependencies();

    const error = new InternalError(message);

    this._updateCalculatedError(error);

    throw error;
  }

  _updateCheck() {
    const prevStatus = this.status;

    if ((prevStatus & Mask_Invalidate) === 0) {
      this._internalError(`Set status ${statusToString(Update_Check)} called when current status is ${statusToString(prevStatus)}`);
    }

    this.status = prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate) | Flag_Check;
  }

  _updateCheckAsync(valueAsync) {
    const prevStatus = this.status;

    if (!isCheck(prevStatus)) {
      this._internalError(`Set status ${statusToString(Update_Check_Async)} called when current status is ${statusToString(prevStatus)}`);
    }

    this.valueAsync = valueAsync;
    this.status = prevStatus & ~Mask_Calculate | Update_Check_Async;
  }

  _updateCalculating() {
    const prevStatus = this.status;

    if ((prevStatus & (Mask_Invalidate | Flag_Check)) === 0) {
      this._internalError(`Set status ${statusToString(Update_Calculating)} called when current status is ${statusToString(prevStatus)}`);
    }

    if (this._unsubscribersLength !== 0) {
      this._internalError(`Set status ${statusToString(Update_Calculating)} called when _unsubscribersLength == ${this._unsubscribersLength}`);
    }

    this.status = prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate) | Flag_Calculating;
    this._subscribersCalculating = this._subscribersLast;
  }

  _updateCalculatingAsync(valueAsync) {
    const prevStatus = this.status;

    if (!isCalculating(prevStatus)) {
      this._internalError(`Set status ${statusToString(Update_Calculating_Async)} called when current status is ${statusToString(prevStatus)}`);
    }

    this.valueAsync = valueAsync;
    this.status = prevStatus & ~Mask_Calculate | Update_Calculating_Async;
  }

  _updateCalculated() {
    const prevStatus = this.status;

    if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
      this._internalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`);
    }

    this.status = prevStatus & (Flag_HasValue | Flag_HasError) | Flag_Calculated;
    this._subscribersCalculating = null;
    const invalidateStatus = getInvalidate(prevStatus);

    if (invalidateStatus !== 0) {
      this._updateInvalidate(invalidateStatus, false);
    }
  }

  _updateCalculatedValue(value) {
    const prevStatus = this.status;

    if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
      this._internalError(`Set status ${statusToString(Update_Calculated_Value)} called when current status is ${statusToString(prevStatus)}`);
    }

    if (this.valueAsync != null) {
      this.valueAsync = null;
    }

    this.status = Update_Calculated_Value;
    const prevValue = this.value;

    if (value !== NO_CHANGE_VALUE && ((prevStatus & (Flag_HasError | Flag_HasValue)) !== Flag_HasValue || value === ALWAYS_CHANGE_VALUE || !webrainEquals(prevValue, value))) {
      this.error = void 0;
      this.value = value;
      this._lastAccessTime = fastNow();

      this._afterCalc(prevStatus, true);

      this.onChanged();
    } else {
      this._afterCalc(prevStatus, false);
    }
  }

  _updateCalculatedError(error) {
    const prevStatus = this.status;

    if (error instanceof InternalError || (prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
      console.error('InternalError: ', error);
      this.status = Update_Calculated_Error | prevStatus & Flag_HasValue | Flag_InternalError;
      this._parentCallState = null;
      setCurrentState(null);
    } else {
      if (this.valueAsync != null) {
        this.valueAsync = null;
      }

      this.status = Update_Calculated_Error | prevStatus & Flag_HasValue;
    }

    const prevError = this.error;

    if (error !== NO_CHANGE_VALUE && ((prevStatus & Flag_HasError) === 0 || error === ALWAYS_CHANGE_VALUE || !webrainEquals(prevError, error))) {
      this.error = error;
      this._lastAccessTime = fastNow();

      this._afterCalc(prevStatus, true);

      this.onChanged();

      if (webrainOptions.callState.logCaughtErrors) {
        console.error(error);
      }
    } else {
      this._afterCalc(prevStatus, false);
    }
  }

  _afterCalc(prevStatus, valueChanged) {
    if ((prevStatus & Mask_Invalidate) !== 0) {
      if ((prevStatus & Flag_Recalc) !== 0) {
        this._updateInvalidate(Update_Invalidating, false);

        this._updateInvalidate(Update_Invalidated_Recalc, valueChanged);
      } else {
        this._updateInvalidate(Update_Invalidating, false);

        this._updateInvalidate(Update_Invalidated, valueChanged);
      }
    } else if (valueChanged) {
      this._invalidateParents(Flag_None, Update_Invalidating, Flag_None);

      this._invalidateParents(Flag_None, Update_Invalidated, Flag_None);

      this._invalidateParents(Update_Recalc, Update_Recalc, Flag_None);
    }

    this._subscribersCalculating = null;
  } // endregion
  // region 5: invalidate self and dependent


  invalidate() {
    this._updateInvalidate(Update_Invalidating, false);

    this._updateInvalidate(Update_Invalidated_Recalc, false);
  }
  /** @internal */


  _updateInvalidate(status, parentRecalc) {
    const prevStatus = this.status;
    let statusBefore = 0;
    let statusAfter = 0;

    if (status === Update_Recalc) {
      if (isCalculated(prevStatus)) {
        this._internalError(`Set status ${statusToString(Update_Recalc)} called when current status is ${statusToString(prevStatus)}`);
      }

      this.status = prevStatus | status;
    } else {
      if (isInvalidated(prevStatus)) {
        if (!isRecalc(prevStatus) && isRecalc(status)) {
          this.status = prevStatus | Flag_Recalc;
        }

        if (parentRecalc) {
          statusBefore = Update_Invalidated_Recalc;
        }
      } else if (status === Update_Invalidating || status === Update_Invalidating_Recalc) {
        this.status = prevStatus & ~(Mask_Invalidate | Flag_Calculated) | status;
        statusBefore = parentRecalc ? Update_Invalidating_Recalc : Update_Invalidating;
        statusAfter = Update_Invalidating;
      } else if (status === Update_Invalidated || status === Update_Invalidated_Recalc) {
        this.status = prevStatus & ~(Mask_Invalidate | Flag_Calculated) | status;
        statusBefore = parentRecalc ? Update_Invalidated_Recalc : Update_Invalidated;
        statusAfter = Update_Invalidated;
      } else {
        this._internalError(`Unknown status: ${statusToString(status)}`);
      }
    } // TODO


    if (isRecalc(status)) {
      // TODO emit debug event
      if ((this.status & Flag_Invalidating) !== 0) {
        this._internalError(`Set status ${statusToString(status)} called when current status is ${statusToString(prevStatus)}`);
      }

      if ((prevStatus & Flag_Calculating) === 0 && this._unsubscribersLength !== 0) {
        this._unsubscribeDependencies();
      }
    }

    if (isInvalidated(status) && !isInvalidated(prevStatus)) {
      this.onChanged();
    }

    if (statusBefore !== 0 || statusAfter !== 0) {
      this._invalidateParents(statusBefore, statusBefore, statusAfter);
    }
  }

  _invalidateParents(statusCalculated, statusCalculatingLazy, statusCalculating) {
    const {
      _subscribersFirst,
      _subscribersCalculating
    } = this;

    if (_subscribersFirst == null) {
      return;
    }

    let status;
    let statusLazy;
    let lastLink;
    let link;

    if (statusCalculated !== 0 || statusCalculatingLazy !== 0) {
      status = statusCalculated;
      statusLazy = statusCalculatingLazy;
      lastLink = _subscribersCalculating;
      link = this._subscribersFirst;
    } else if (statusCalculating !== 0 && _subscribersCalculating != null) {
      status = statusCalculating;
      statusLazy = statusCalculating;
      lastLink = null;
      link = _subscribersCalculating.next;
    } else {
      return;
    }

    for (; link !== null;) {
      const _status = link.isLazy ? statusLazy : status;

      const next = _status === 0 ? link.next : invalidateParent(link, _status);

      if (link === lastLink) {
        if (lastLink === _subscribersCalculating) {
          if (statusCalculating !== 0) {
            status = statusCalculating;
            lastLink = null;
          } else {
            break;
          }
        } else {
          this._internalError('Unexpected behavior 2');
        }
      }

      link = next;
    }
  } // endregion
  // region 6: subscribe other tools


  onChanged() {
    const {
      _changedSubject
    } = this;

    if (_changedSubject != null) {
      // TODO setTimeout needed until not resolved problem
      // with delete subscriber link during iterate subscribers links
      setTimeout(() => _changedSubject.emit(this), 0);
    }
  }
  /**
   * Subscribe "on invalidated" or "on calculated"
   * @param subscriber The first argument is {@link ICallState};
   * [statusShort]{@link ICallState.statusShort} is [Invalidated]{@link CallStatusShort.Invalidated},
   * [CalculatedValue]{@link CallStatusShort.CalculatedValue}
   * or [CalculatedError]{@link CallStatusShort.CalculatedError}
   */


  subscribe(subscriber) {
    let {
      _changedSubject
    } = this;

    if (_changedSubject == null) {
      this._changedSubject = _changedSubject = new Subject();
    }

    return _changedSubject.subscribe(subscriber);
  } // endregion
  // endregion


} // region get/create/delete ValueState

export const valueIdToStateMap = new Map();
export const valueToIdMap = new Map();
let nextValueId = 1;
export function getValueState(valueId) {
  return valueIdToStateMap.get(valueId);
}
export function getValueId(value) {
  const id = valueToIdMap.get(value);

  if (id == null) {
    return 0;
  }

  return id;
}
export function getOrCreateValueId(value) {
  let id = valueToIdMap.get(value);

  if (id == null) {
    id = nextValueId++;
    const state = {
      usageCount: 0,
      value
    };
    valueToIdMap.set(value, id);
    valueIdToStateMap.set(id, state);
  }

  return id;
}
export function deleteValueState(valueId, value) {
  if (!valueIdToStateMap.delete(valueId)) {
    throw new InternalError('value not found');
  }

  if (!valueToIdMap.delete(value)) {
    throw new InternalError('valueState not found');
  }
} // endregion
// region CallStateProviderState

const valueIdsBuffer = new Int32Array(100); // interface ICallStateProviderState<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TResultInner,
// > {
// 	func: Func<unknown, TArgs, unknown>
// 	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>
// 	initCallState: (state: CallState<TThisOuter, TArgs, TResultInner>) => void
// 	funcId: number
// 	funcHash: number
// }

// let currentCallStateProviderState: ICallStateProviderState<any, any, any> = null
function findCallState(callStates, countValueStates, _valueIdsBuffer) {
  for (let i = 0, len = callStates.length; i < len; i++) {
    const state = callStates[i];
    const valueIds = state.valueIds;

    if (valueIds.length === countValueStates) {
      let j = 0;

      for (; j < countValueStates; j++) {
        if (valueIds[j] !== _valueIdsBuffer[j]) {
          break;
        }
      }

      if (j === countValueStates) {
        return state;
      }
    }
  }

  return null;
} // tslint:disable-next-line:no-shadowed-variable


export function createCallStateProvider(func, funcCall, initCallState) {
  const funcId = nextValueId++;
  const funcHash = nextHash(17, funcId); // noinspection DuplicatedCode

  function _getCallState() {
    // region getCallState
    const countArgs = arguments.length;
    const countValueStates = countArgs + 2; // region calc hash

    const _valueIdsBuffer = valueIdsBuffer;
    _valueIdsBuffer[0] = funcId;
    let hash = funcHash;
    {
      const valueId = getValueId(this);

      if (valueId === 0) {
        return null;
      }

      _valueIdsBuffer[1] = valueId;
      hash = nextHash(hash, valueId);
    }

    for (let i = 0; i < countArgs; i++) {
      const valueId = getValueId(arguments[i]);

      if (valueId === 0) {
        return null;
      }

      _valueIdsBuffer[i + 2] = valueId;
      hash = nextHash(hash, valueId);
    } // endregion


    let callState;
    const callStates = callStateHashTable.get(hash);

    if (callStates != null) {
      callState = findCallState(callStates, countValueStates, _valueIdsBuffer);
    } // endregion


    return callState;
  }

  function createCallWithArgs() {
    const args = arguments;
    return function (_this, _func) {
      return _func.apply(_this, args);
    };
  } // noinspection DuplicatedCode


  function _getOrCreateCallState() {
    // region getCallState
    const countArgs = arguments.length;
    const countValueStates = countArgs + 2; // region calc hash

    const _valueIdsBuffer = valueIdsBuffer;
    _valueIdsBuffer[0] = funcId;
    let hash = funcHash;
    {
      const valueId = getOrCreateValueId(this);
      _valueIdsBuffer[1] = valueId;
      hash = nextHash(hash, valueId);
    }

    for (let i = 0; i < countArgs; i++) {
      const valueId = getOrCreateValueId(arguments[i]);
      _valueIdsBuffer[i + 2] = valueId;
      hash = nextHash(hash, valueId);
    } // endregion


    let callState;
    let callStates = callStateHashTable.get(hash);

    if (callStates != null) {
      callState = findCallState(callStates, countValueStates, _valueIdsBuffer);
    } // endregion


    if (callState != null) {
      return callState;
    } // const valueIdsClone: Int32Array = _valueIdsBuffer.slice(0, countValueStates)


    const valueIdsClone = new Int32Array(countValueStates);

    for (let i = 0; i < countValueStates; i++) {
      valueIdsClone[i] = _valueIdsBuffer[i];
    }

    for (let i = 0; i < countValueStates; i++) {
      if (i > 0) {
        const valueState = getValueState(_valueIdsBuffer[i]);
        valueState.usageCount++;
      }
    }

    callState = new CallState(func, this, createCallWithArgs.apply(null, arguments), funcCall, valueIdsClone);
    callStatesCount++;

    if (initCallState != null) {
      initCallState(callState);
    }

    if (callStates == null) {
      callStates = [callState];
      callStateHashTable.set(hash, callStates);
    } else {
      callStates.push(callState);
    }

    garbageCollectSchedule();
    return callState;
  }

  const state = {
    get: _getCallState,
    getOrCreate: _getOrCreateCallState,
    func,
    dependFunc: null,
    isBindThis: false
  };
  return state;
} // endregion
// region CallState Provider

const callStateProviderMap = new WeakMap(); // region getCallState / getOrCreateCallState

export function invalidateCallState(state) {
  if (state != null) {
    state.invalidate();
    return true;
  }

  return false;
}
export function subscribeCallState(callState, subscriber) {
  const unsubscribe = callState.subscribe(state => {
    switch (state.statusShort) {
      case CallStatusShort.Invalidated:
        state.getValue(false, true);
        break;

      case CallStatusShort.CalculatedValue:
      case CallStatusShort.CalculatedError:
        if (subscriber != null) {
          subscriber(state);
        }

        break;
    }
  });
  callState.getValue(false, true);
  return unsubscribe;
}
export function getCallState(func) {
  const callStateProvider = callStateProviderMap.get(func);

  if (callStateProvider == null) {
    return EMPTY_FUNC;
  } else {
    return callStateProvider.get;
  }
}
export function getOrCreateCallState(func) {
  const callStateProviderState = callStateProviderMap.get(func);

  if (callStateProviderState == null) {
    return EMPTY_FUNC;
  } else {
    // currentCallStateProviderState = callStateProviderState
    return callStateProviderState.getOrCreate; // return _getOrCreateCallState
  }
}
export function dependBindThis(_this, func) {
  const {
    dependFunc: _dependFunc,
    func: _func,
    get,
    getOrCreate,
    isBindThis
  } = callStateProviderMap.get(func);

  if (isBindThis) {
    throw new Error('Function already bind: ' + func);
  }

  const newCallStateProviderState = {
    dependFunc: newDependFunc,

    func() {
      return _func.apply(_this, arguments);
    },

    get() {
      return get.apply(_this, arguments);
    },

    getOrCreate() {
      return getOrCreate.apply(_this, arguments);
    },

    isBindThis: true
  };
  callStateProviderMap.set(newDependFunc, newCallStateProviderState);

  function newDependFunc() {
    return _dependFunc.apply(_this, arguments);
  }

  return newDependFunc;
} // endregion
// endregion
// region get/create/delete/reduce CallStates

export const callStateHashTable = new Map();
let callStatesCount = 0; // region deleteCallState

export function deleteCallState(callState) {
  callState._unsubscribeDependencies();

  const valueIds = callState.valueIds;
  let hash = 17;

  for (let i = 0, len = valueIds.length; i < len; i++) {
    const valueId = valueIds[i];
    hash = nextHash(hash, valueId);

    if (i > 0) {
      const valueState = getValueState(valueId);

      if (valueState != null) {
        const usageCount = valueState.usageCount;

        if (usageCount <= 0) {
          throw new InternalError('usageCount <= 0');
        } else if (usageCount === 1 && i > 0) {
          deleteValueState(valueId, valueState.value);
        } else {
          valueState.usageCount--;
        }
      }
    }
  } // search and delete callState


  const callStates = callStateHashTable.get(hash);
  const callStatesLastIndex = callStates.length - 1;

  if (callStatesLastIndex === -1) {
    throw new InternalError('callStates.length === 0');
  } else if (callStatesLastIndex === 0) {
    if (callStates[0] !== callState) {
      throw new InternalError('callStates[0] !== callState');
    }

    callStateHashTable.delete(hash);
  } else {
    let index = 0;

    for (index = 0; index <= callStatesLastIndex; index++) {
      if (callStates[index] === callState) {
        if (index !== callStatesLastIndex) {
          callStates[index] = callStates[callStatesLastIndex];
        }

        callStates.length = callStatesLastIndex;
        break;
      }
    }

    if (index > callStatesLastIndex) {
      throw new InternalError('callState not found');
    }
  }

  callStatesCount--;
} // endregion
// region reduceCallStates to free memory

export const reduceCallStatesHeap = new PairingHeap({
  objectPool: new ObjectPool(10000000),

  lessThanFunc(o1, o2) {
    return o1._lastAccessTime < o2._lastAccessTime;
  }

});

function reduceCallStatesHeapAdd(states, now, _minCallStateLifeTime) {
  for (let i = 0, len = states.length; i < len; i++) {
    const callState = states[i];

    if (callState._lastAccessTime + _minCallStateLifeTime <= now && callState._subscribersFirst == null && !callState.hasSubscribers && callState.statusShort !== CallStatusShort.Handling) {
      reduceCallStatesHeap.add(callState);
    }
  }
}

export function reduceCallStates(deleteSize, _minCallStateLifeTime) {
  const now = fastNow();
  callStateHashTable.forEach(state => {
    reduceCallStatesHeapAdd(state, now, _minCallStateLifeTime);
  });
  let countDeleted = 0;

  while (deleteSize > 0 && reduceCallStatesHeap.size > 0) {
    const callState = reduceCallStatesHeap.deleteMin();
    const {
      _unsubscribers,
      _unsubscribersLength
    } = callState;

    if (_unsubscribers != null) {
      for (let i = 0, len = _unsubscribersLength; i < len; i++) {
        const state = _unsubscribers[i].state;

        if (callState._lastAccessTime + _minCallStateLifeTime <= now && state._subscribersFirst === state._subscribersLast && !state.hasSubscribers && state.statusShort !== CallStatusShort.Handling) {
          reduceCallStatesHeap.add(state);
        }
      }
    }

    deleteCallState(callState);
    countDeleted++;
    deleteSize--;
  }

  reduceCallStatesHeap.clear();
  return countDeleted;
} // Garbage collector

function garbageCollect() {
  try {
    garbageCollectTimer = null;
    const {
      bulkSize,
      minLifeTime,
      interval,
      disabled
    } = webrainOptions.callState.garbageCollect;

    if (!disabled) {
      const time = fastNow();
      const countDeleted = reduceCallStates(bulkSize, minLifeTime);

      if (countDeleted > 0 || callStatesCount === 0) {
        console.debug(`CallState GC - deleted: ${countDeleted}, alive: ${callStatesCount}, ${(fastNow() - time) / countDeleted} ms/item`);
      }
    }

    garbageCollectSchedule();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

let garbageCollectTimer = null;

function garbageCollectSchedule() {
  if (callStatesCount > 0 && garbageCollectTimer === null) {
    const {
      interval,
      disabled
    } = webrainOptions.callState.garbageCollect;

    if (!disabled) {
      garbageCollectTimer = setTimeout(garbageCollect, interval);
    }
  }
} // endregion
// endregion
// region makeDependentFunc


export function createDependentFunc(func, callStateProvider, canAlwaysRecalc) {
  return function _dependentFunc() {
    const getState = canAlwaysRecalc && getCurrentState() == null ? callStateProvider.get : callStateProvider.getOrCreate;
    const state = getState.apply(this, arguments);
    return state != null ? state.getValue() : func.apply(this, arguments);
  };
}
/**
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */

export function makeDependentFunc(func, funcCall, initCallState, canAlwaysRecalc) {
  let callStateProvider = callStateProviderMap.get(func);

  if (callStateProvider != null) {
    return callStateProvider.dependFunc;
  }

  callStateProvider = createCallStateProvider(func, funcCall, initCallState);
  callStateProviderMap.set(func, callStateProvider);
  const dependFunc = createDependentFunc(func, callStateProvider, canAlwaysRecalc);
  callStateProvider.dependFunc = dependFunc;
  callStateProviderMap.set(dependFunc, callStateProvider);
  return dependFunc;
} // endregion
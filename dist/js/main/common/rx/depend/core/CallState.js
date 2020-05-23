"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getInvalidate = getInvalidate;
exports.setInvalidate = setInvalidate;
exports.isInvalidating = isInvalidating;
exports.isInvalidated = isInvalidated;
exports.isRecalc = isRecalc;
exports.setRecalc = setRecalc;
exports.getCalculate = getCalculate;
exports.setCalculate = setCalculate;
exports.isCheck = isCheck;
exports.isCalculating = isCalculating;
exports.isCalculated = isCalculated;
exports.isHasValue = isHasValue;
exports.setHasValue = setHasValue;
exports.isHasError = isHasError;
exports.setHasError = setHasError;
exports.statusToString = statusToString;
exports.toStatusShort = toStatusShort;
exports.releaseSubscriberLink = releaseSubscriberLink;
exports.getSubscriberLink = getSubscriberLink;
exports.subscriberLinkDelete = subscriberLinkDelete;
exports.invalidateParent = invalidateParent;
exports.getValueState = getValueState;
exports.getValueId = getValueId;
exports.getOrCreateValueId = getOrCreateValueId;
exports.deleteValueState = deleteValueState;
exports.createCallStateProvider = createCallStateProvider;
exports.invalidateCallState = invalidateCallState;
exports.subscribeCallState = subscribeCallState;
exports.getCallState = getCallState;
exports.getOrCreateCallState = getOrCreateCallState;
exports.dependBindThis = dependBindThis;
exports.deleteCallState = deleteCallState;
exports.reduceCallStates = reduceCallStates;
exports.createDependentFunc = createDependentFunc;
exports.makeDependentFunc = makeDependentFunc;
exports.reduceCallStatesHeap = exports.callStateHashTable = exports.valueToIdMap = exports.valueIdToStateMap = exports.CallState = exports.subscriberLinkPool = exports.NO_CHANGE_VALUE = exports.ALWAYS_CHANGE_VALUE = exports.Mask_Update = exports.Mask_Update_Invalidate = exports.Update_Calculated_Error = exports.Update_Calculated_Value = exports.Update_Calculating_Async = exports.Update_Calculating = exports.Update_Check_Async = exports.Update_Check = exports.Update_Invalidated_Recalc = exports.Update_Invalidating_Recalc = exports.Update_Recalc = exports.Update_Invalidated = exports.Update_Invalidating = exports.Flag_InternalError = exports.Flag_HasError = exports.Flag_HasValue = exports.Mask_Calculate = exports.Flag_Calculated = exports.Flag_Async = exports.Flag_Calculating = exports.Flag_Check = exports.Flag_Parent_Recalc = exports.Mask_Parent_Invalidate = exports.Flag_Parent_Invalidated = exports.Flag_Parent_Invalidating = exports.Flag_Recalc = exports.Mask_Invalidate = exports.Flag_Invalidated = exports.Flag_Invalidating = exports.Flag_None = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _weakMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/weak-map"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _async = require("../../../async/async");

var _ThenableSync = require("../../../async/ThenableSync");

var _helpers = require("../../../helpers/helpers");

var _webrainOptions = require("../../../helpers/webrainOptions");

var _ObjectPool = require("../../../lists/ObjectPool");

var _PairingHeap = require("../../../lists/PairingHeap");

var _helpers2 = require("../../../time/helpers");

var _subject = require("../../subjects/subject");

var _contracts = require("./contracts");

var _currentState = require("./current-state");

var _helpers3 = require("./helpers");

// endregion
// region Constants
var Flag_None = 0;
exports.Flag_None = Flag_None;
var Flag_Invalidating = 1;
exports.Flag_Invalidating = Flag_Invalidating;
var Flag_Invalidated = 2;
exports.Flag_Invalidated = Flag_Invalidated;
var Mask_Invalidate = 3;
exports.Mask_Invalidate = Mask_Invalidate;
var Flag_Recalc = 4;
exports.Flag_Recalc = Flag_Recalc;
var Flag_Parent_Invalidating = 8;
exports.Flag_Parent_Invalidating = Flag_Parent_Invalidating;
var Flag_Parent_Invalidated = 16;
exports.Flag_Parent_Invalidated = Flag_Parent_Invalidated;
var Mask_Parent_Invalidate = 24;
exports.Mask_Parent_Invalidate = Mask_Parent_Invalidate;
var Flag_Parent_Recalc = 32;
exports.Flag_Parent_Recalc = Flag_Parent_Recalc;
var Flag_Check = 128;
exports.Flag_Check = Flag_Check;
var Flag_Calculating = 256;
exports.Flag_Calculating = Flag_Calculating;
var Flag_Async = 512;
exports.Flag_Async = Flag_Async;
var Flag_Calculated = 1024;
exports.Flag_Calculated = Flag_Calculated;
var Mask_Calculate = 1920;
exports.Mask_Calculate = Mask_Calculate;
var Flag_HasValue = 2048;
exports.Flag_HasValue = Flag_HasValue;
var Flag_HasError = 4096;
exports.Flag_HasError = Flag_HasError;
var Flag_InternalError = 8192;
exports.Flag_InternalError = Flag_InternalError;
var Update_Invalidating = Flag_Invalidating;
exports.Update_Invalidating = Update_Invalidating;
var Update_Invalidated = Flag_Invalidated;
exports.Update_Invalidated = Update_Invalidated;
var Update_Recalc = 4;
exports.Update_Recalc = Update_Recalc;
var Update_Invalidating_Recalc = 5;
exports.Update_Invalidating_Recalc = Update_Invalidating_Recalc;
var Update_Invalidated_Recalc = 6;
exports.Update_Invalidated_Recalc = Update_Invalidated_Recalc;
var Update_Check = Flag_Check;
exports.Update_Check = Update_Check;
var Update_Check_Async = 640;
exports.Update_Check_Async = Update_Check_Async;
var Update_Calculating = Flag_Calculating;
exports.Update_Calculating = Update_Calculating;
var Update_Calculating_Async = 768;
exports.Update_Calculating_Async = Update_Calculating_Async;
var Update_Calculated_Value = 3072;
exports.Update_Calculated_Value = Update_Calculated_Value;
var Update_Calculated_Error = 5120;
exports.Update_Calculated_Error = Update_Calculated_Error;
var Mask_Update_Invalidate = Update_Invalidating | Update_Invalidated | Update_Invalidating_Recalc | Update_Invalidated_Recalc;
exports.Mask_Update_Invalidate = Mask_Update_Invalidate;
var Mask_Update = Mask_Update_Invalidate | Update_Check | Update_Check_Async | Update_Calculating | Update_Calculating_Async | Update_Calculated_Value | Update_Calculated_Error; // endregion
// TODO inline these methods
// region Properties
// region Invalidate

exports.Mask_Update = Mask_Update;

function getInvalidate(status) {
  return status & Mask_Invalidate;
}

function setInvalidate(status, value) {
  return status & ~Mask_Invalidate | value;
}

function isInvalidating(status) {
  return (status & Flag_Invalidating) !== 0;
}

function isInvalidated(status) {
  return (status & Flag_Invalidated) !== 0;
} // endregion
// region Recalc


function isRecalc(status) {
  return (status & Flag_Recalc) !== 0;
}

function setRecalc(status, value) {
  return value ? status | Flag_Recalc : status & ~Flag_Recalc;
} // endregion
// region Calculate


function getCalculate(status) {
  return status & Mask_Calculate;
}

function setCalculate(status, value) {
  return status & ~Mask_Calculate | value;
}

function isCheck(status) {
  return (status & Flag_Check) !== 0;
}

function isCalculating(status) {
  return (status & Flag_Calculating) !== 0;
}

function isCalculated(status) {
  return (status & Flag_Calculated) !== 0;
} // endregion
// region HasValue


function isHasValue(status) {
  return (status & Flag_HasValue) !== 0;
}

function setHasValue(status, value) {
  return value ? status | Flag_HasValue : status & ~Flag_HasValue;
} // endregion
// region HasError


function isHasError(status) {
  return (status & Flag_HasError) !== 0;
}

function setHasError(status, value) {
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


function statusToString(status) {
  var buffer = [''];

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

  var remain = status & ~(Flag_Invalidating | Flag_Invalidated | Flag_Recalc | Flag_Check | Flag_Calculating | Flag_Async | Flag_Calculated | Flag_HasError | Flag_HasValue);

  if (remain !== 0) {
    buffer.push(remain + '');
  }

  return buffer.join(' | ');
}

function toStatusShort(status) {
  if ((status & (Flag_Check | Flag_Calculating | Flag_Invalidating)) !== 0) {
    return _contracts.CallStatusShort.Handling;
  }

  if ((status & Flag_Invalidated) !== 0) {
    return _contracts.CallStatusShort.Invalidated;
  }

  if ((status & Flag_Calculated) !== 0) {
    if ((status & Flag_HasError) !== 0) {
      return _contracts.CallStatusShort.CalculatedError;
    }

    if ((status & Flag_HasValue) !== 0) {
      return _contracts.CallStatusShort.CalculatedValue;
    }
  }

  throw new _helpers3.InternalError("Cannot convert CallStatus (" + statusToString(status) + ") to CallStatusShort");
} // endregion
// endregion
// region constants
// tslint:disable-next-line:no-construct use-primitive-type


var ALWAYS_CHANGE_VALUE = new String('ALWAYS_CHANGE_VALUE'); // tslint:disable-next-line:no-construct use-primitive-type

exports.ALWAYS_CHANGE_VALUE = ALWAYS_CHANGE_VALUE;
var NO_CHANGE_VALUE = new String('NO_CHANGE_VALUE');
exports.NO_CHANGE_VALUE = NO_CHANGE_VALUE;
var Flag_Before_Calc = 1;
var Flag_After_Calc = 2;
var Mask_Invalidate_Parent = 3; // endregion
// region variables

var nextCallId = 1; // endregion
// region subscriberLinkPool

var subscriberLinkPool = new _ObjectPool.ObjectPool(1000000);
exports.subscriberLinkPool = subscriberLinkPool;

function releaseSubscriberLink(obj) {
  subscriberLinkPool.release(obj);
}

function getSubscriberLink(state, subscriber, prev, next, isLazy) {
  var item = subscriberLinkPool.get();

  if (item != null) {
    item.state = state;
    item.value = subscriber;
    item.prev = prev;
    item.next = next;
    item.isLazy = isLazy;
    return item;
  }

  return {
    state: state,
    value: subscriber,
    prev: prev,
    next: next,
    isLazy: isLazy
  };
}

function subscriberLinkDelete(item) {
  var prev = item.prev,
      next = item.next,
      state = item.state;

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


function EMPTY_FUNC() {}

function invalidateParent(link, status) {
  var next = link.next;
  var childState = link.value;
  var childStatus = childState.status & Mask_Update_Invalidate; // this condition needed only for optimization

  if (childStatus === 0 || isRecalc(status) // TODO delete this and test
  || status !== childStatus && childStatus !== Update_Invalidated_Recalc && (childStatus === Update_Recalc || childStatus === Update_Invalidating || status !== Update_Invalidating && (childStatus === Update_Invalidated || status !== Update_Recalc))) {
    childState._updateInvalidate(status, false);
  }

  return next;
} // endregion


var CallState = /*#__PURE__*/function () {
  function CallState(func, thisOuter, callWithArgs, funcCall, valueIds) {
    (0, _classCallCheck2.default)(this, CallState);
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


  (0, _createClass2.default)(CallState, [{
    key: "getValue",
    // public get hasValue(): boolean {
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
    value: function getValue(isLazy, dontThrowOnError) {
      var _this2 = this;

      var currentState = (0, _currentState.getCurrentState)();

      if (currentState != null && (currentState.status & Flag_Check) === 0) {
        currentState._subscribeDependency.call(currentState, this, !!isLazy);
      } // TODO: delete line and test


      this._callId = nextCallId++;
      var prevStatus = this.status;

      if (isCalculated(this.status)) {
        this._lastAccessTime = (0, _helpers2.fastNow)();
        return dontThrowOnError ? this.value : this.valueOrThrow;
      } else if (getCalculate(this.status) !== 0) {
        if ((this.status & Flag_Async) !== 0) {
          var parentCallState = currentState;

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
          this._internalError("Unknown CallStatus: " + statusToString(this.status));
        }
      } else if (getInvalidate(this.status) !== 0) {// nothing
      } else {
        this._internalError("Unknown CallStatus: " + statusToString(this.status));
      }

      this._parentCallState = currentState;
      (0, _currentState.setCurrentState)(null);

      this._updateCheck();

      var shouldRecalc;

      if (isRecalc(prevStatus)) {
        shouldRecalc = true;
      } else {
        shouldRecalc = this._checkDependenciesChanged();
      }

      if (shouldRecalc === false) {
        (0, _currentState.setCurrentState)(this._parentCallState);
        this._parentCallState = null;
        return dontThrowOnError ? this.value : this.valueOrThrow;
      }

      var value;

      if (shouldRecalc === true) {
        value = this._calc(dontThrowOnError);
      } else if ((0, _helpers.isIterator)(shouldRecalc)) {
        value = (0, _ThenableSync.resolveAsync)(shouldRecalc, function (o) {
          if (o === false) {
            if ((_this2.status & Flag_Async) !== 0) {
              _this2._parentCallState = null;
            }

            return dontThrowOnError ? _this2.value : _this2.valueOrThrow;
          }

          return _this2._calc(dontThrowOnError);
        });
        (0, _currentState.setCurrentState)(this._parentCallState);

        if ((0, _async.isThenable)(value)) {
          this._updateCheckAsync(value);
        } else {
          this._parentCallState = null;
        }
      } else {
        this._internalError("shouldRecalc == " + shouldRecalc);
      }

      if (isLazy && (0, _async.isThenable)(value)) {
        return dontThrowOnError ? this.value : this.valueOrThrow;
      }

      return value;
    }
  }, {
    key: "_calc",
    value: function _calc(dontThrowOnError) {
      var _this3 = this;

      this._updateCalculating();

      this._callId = nextCallId++;
      var _isAsync = false;

      try {
        (0, _currentState.setCurrentState)(this);
        var value = this.funcCall(this);

        if (!(0, _async.isAsync)(value)) {
          this._updateCalculatedValue(value);

          return value;
        }

        if ((0, _async.isThenable)(value) && !(value instanceof _ThenableSync.ThenableSync)) {
          this._internalError('You should use iterator or ThenableSync instead Promise for async functions');
        }

        _isAsync = true; // Old method:
        // value = resolveAsync(
        // 	this._makeDependentIterator(value) as ThenableOrIteratorOrValue<TResultInner>,
        // )
        // New method (more functionality)

        value = (0, _ThenableSync.resolveAsync)(value, function (val) {
          if ((_this3.status & Flag_Async) !== 0) {
            _this3._parentCallState = null;
          }

          _this3._updateCalculatedValue(val);

          return val;
        }, function (error) {
          if ((_this3.status & Flag_Async) !== 0) {
            _this3._parentCallState = null;
          }

          _this3._updateCalculatedError(error);

          throw error;
        });

        if ((0, _async.isThenable)(value)) {
          this._updateCalculatingAsync(value);
        }

        return value;
      } catch (error) {
        if (!_isAsync || error instanceof _helpers3.InternalError) {
          this._updateCalculatedError(error);
        }

        if (dontThrowOnError !== true || error instanceof _helpers3.InternalError) {
          throw error;
        }
      } finally {
        (0, _currentState.setCurrentState)(this._parentCallState);

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

  }, {
    key: "_subscribeDependency",
    value: function _subscribeDependency(dependency, isLazy) {
      // TODO optimize it
      if ((this.status & Flag_Async) !== 0 || this._callId < dependency._callId) {
        var _unsubscribers = this._unsubscribers;

        for (var i = 0, len = this._unsubscribersLength; i < len; i++) {
          if (_unsubscribers[i].state === dependency) {
            return;
          }
        }
      }

      {
        var subscriberLink = dependency._subscribe(this, isLazy);

        var _unsubscribers2 = this._unsubscribers;

        if (_unsubscribers2 == null) {
          this._unsubscribers = [subscriberLink];
          this._unsubscribersLength = 1;
        } else {
          _unsubscribers2[this._unsubscribersLength++] = subscriberLink;
        }
      }
    }
  }, {
    key: "_subscribe",
    value: function _subscribe(subscriber, isLazy) {
      var _subscribersLast = this._subscribersLast;
      var subscriberLink = getSubscriberLink(this, subscriber, _subscribersLast, null, isLazy);

      if (_subscribersLast == null) {
        this._subscribersFirst = subscriberLink;
        this._subscribersLast = subscriberLink;
      } else if (isLazy && this._subscribersCalculating != null) {
        // insert after calculating
        var _subscribersCalculating = this._subscribersCalculating;
        var next = _subscribersCalculating.next;

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

  }, {
    key: "_unsubscribeDependencies",
    value: function _unsubscribeDependencies(fromIndex) {
      var _unsubscribers = this._unsubscribers;

      if (_unsubscribers != null) {
        var len = this._unsubscribersLength;

        var _fromIndex = fromIndex == null ? 0 : fromIndex;

        for (var i = _fromIndex; i < len; i++) {
          var item = _unsubscribers[i];
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

  }, {
    key: "_checkDependenciesChangedAsync",
    value: /*#__PURE__*/_regenerator.default.mark(function _checkDependenciesChangedAsync(fromIndex) {
      var _unsubscribers, _unsubscribersLength, i, len, link, dependencyState, isLazy;

      return _regenerator.default.wrap(function _checkDependenciesChangedAsync$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _unsubscribers = this._unsubscribers, _unsubscribersLength = this._unsubscribersLength;

              if (!(_unsubscribers != null)) {
                _context.next = 18;
                break;
              }

              i = fromIndex || 0, len = _unsubscribersLength;

            case 3:
              if (!(i < len)) {
                _context.next = 18;
                break;
              }

              link = _unsubscribers[i];
              dependencyState = link.state;
              isLazy = link.isLazy;

              if (getInvalidate(dependencyState.status) !== 0) {
                dependencyState.getValue(isLazy, true);
              }

              if (!((this.status & Flag_Recalc) !== 0)) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("return", true);

            case 10:
              if (!(!isLazy && (dependencyState.status & Flag_Async) !== 0)) {
                _context.next = 13;
                break;
              }

              _context.next = 13;
              return (0, _ThenableSync.resolveAsync)(dependencyState.valueAsync, null, EMPTY_FUNC);

            case 13:
              if (!((this.status & Flag_Recalc) !== 0)) {
                _context.next = 15;
                break;
              }

              return _context.abrupt("return", true);

            case 15:
              i++;
              _context.next = 3;
              break;

            case 18:
              this._updateCalculated();

              return _context.abrupt("return", false);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _checkDependenciesChangedAsync, this);
    })
  }, {
    key: "_checkDependenciesChanged",
    value: function _checkDependenciesChanged() {
      var _unsubscribers = this._unsubscribers,
          _unsubscribersLength = this._unsubscribersLength;

      if (_unsubscribers != null) {
        for (var i = 0, len = _unsubscribersLength; i < len; i++) {
          var link = _unsubscribers[i];
          var dependencyState = link.state;
          var isLazy = link.isLazy;

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
            this._internalError("Unexpected dependency status: " + statusToString(dependencyState.status));
          }
        }
      }

      this._updateCalculated();

      return false;
    } // endregion
    // region 4: change value & status

    /** @internal */

  }, {
    key: "_internalError",
    value: function _internalError(message) {
      this._unsubscribeDependencies();

      var error = new _helpers3.InternalError(message);

      this._updateCalculatedError(error);

      throw error;
    }
  }, {
    key: "_updateCheck",
    value: function _updateCheck() {
      var prevStatus = this.status;

      if ((prevStatus & Mask_Invalidate) === 0) {
        this._internalError("Set status " + statusToString(Update_Check) + " called when current status is " + statusToString(prevStatus));
      }

      this.status = prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate) | Flag_Check;
    }
  }, {
    key: "_updateCheckAsync",
    value: function _updateCheckAsync(valueAsync) {
      var prevStatus = this.status;

      if (!isCheck(prevStatus)) {
        this._internalError("Set status " + statusToString(Update_Check_Async) + " called when current status is " + statusToString(prevStatus));
      }

      this.valueAsync = valueAsync;
      this.status = prevStatus & ~Mask_Calculate | Update_Check_Async;
    }
  }, {
    key: "_updateCalculating",
    value: function _updateCalculating() {
      var prevStatus = this.status;

      if ((prevStatus & (Mask_Invalidate | Flag_Check)) === 0) {
        this._internalError("Set status " + statusToString(Update_Calculating) + " called when current status is " + statusToString(prevStatus));
      }

      if (this._unsubscribersLength !== 0) {
        this._internalError("Set status " + statusToString(Update_Calculating) + " called when _unsubscribersLength == " + this._unsubscribersLength);
      }

      this.status = prevStatus & ~(Mask_Invalidate | Flag_Recalc | Mask_Calculate) | Flag_Calculating;
      this._subscribersCalculating = this._subscribersLast;
    }
  }, {
    key: "_updateCalculatingAsync",
    value: function _updateCalculatingAsync(valueAsync) {
      var prevStatus = this.status;

      if (!isCalculating(prevStatus)) {
        this._internalError("Set status " + statusToString(Update_Calculating_Async) + " called when current status is " + statusToString(prevStatus));
      }

      this.valueAsync = valueAsync;
      this.status = prevStatus & ~Mask_Calculate | Update_Calculating_Async;
    }
  }, {
    key: "_updateCalculated",
    value: function _updateCalculated() {
      var prevStatus = this.status;

      if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
        this._internalError("Set status " + statusToString(Update_Calculated_Value) + " called when current status is " + statusToString(prevStatus));
      }

      this.status = prevStatus & (Flag_HasValue | Flag_HasError) | Flag_Calculated;
      this._subscribersCalculating = null;
      var invalidateStatus = getInvalidate(prevStatus);

      if (invalidateStatus !== 0) {
        this._updateInvalidate(invalidateStatus, false);
      }
    }
  }, {
    key: "_updateCalculatedValue",
    value: function _updateCalculatedValue(value) {
      var prevStatus = this.status;

      if ((prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
        this._internalError("Set status " + statusToString(Update_Calculated_Value) + " called when current status is " + statusToString(prevStatus));
      }

      if (this.valueAsync != null) {
        this.valueAsync = null;
      }

      this.status = Update_Calculated_Value;
      var prevValue = this.value;

      if (value !== NO_CHANGE_VALUE && ((prevStatus & (Flag_HasError | Flag_HasValue)) !== Flag_HasValue || value === ALWAYS_CHANGE_VALUE || !(0, _webrainOptions.webrainEquals)(prevValue, value))) {
        this.error = void 0;
        this.value = value;
        this._lastAccessTime = (0, _helpers2.fastNow)();

        this._afterCalc(prevStatus, true);

        this.onChanged();
      } else {
        this._afterCalc(prevStatus, false);
      }
    }
  }, {
    key: "_updateCalculatedError",
    value: function _updateCalculatedError(error) {
      var prevStatus = this.status;

      if (error instanceof _helpers3.InternalError || (prevStatus & (Flag_Check | Flag_Calculating)) === 0) {
        console.error('InternalError: ', error);
        this.status = Update_Calculated_Error | prevStatus & Flag_HasValue | Flag_InternalError;
        this._parentCallState = null;
        (0, _currentState.setCurrentState)(null);
      } else {
        if (this.valueAsync != null) {
          this.valueAsync = null;
        }

        this.status = Update_Calculated_Error | prevStatus & Flag_HasValue;
      }

      var prevError = this.error;

      if (error !== NO_CHANGE_VALUE && ((prevStatus & Flag_HasError) === 0 || error === ALWAYS_CHANGE_VALUE || !(0, _webrainOptions.webrainEquals)(prevError, error))) {
        this.error = error;
        this._lastAccessTime = (0, _helpers2.fastNow)();

        this._afterCalc(prevStatus, true);

        this.onChanged();

        if (_webrainOptions.webrainOptions.callState.logCaughtErrors) {
          console.error(error);
        }
      } else {
        this._afterCalc(prevStatus, false);
      }
    }
  }, {
    key: "_afterCalc",
    value: function _afterCalc(prevStatus, valueChanged) {
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

  }, {
    key: "invalidate",
    value: function invalidate() {
      this._updateInvalidate(Update_Invalidating, false);

      this._updateInvalidate(Update_Invalidated_Recalc, false);
    }
    /** @internal */

  }, {
    key: "_updateInvalidate",
    value: function _updateInvalidate(status, parentRecalc) {
      var prevStatus = this.status;
      var statusBefore = 0;
      var statusAfter = 0;

      if (status === Update_Recalc) {
        if (isCalculated(prevStatus)) {
          this._internalError("Set status " + statusToString(Update_Recalc) + " called when current status is " + statusToString(prevStatus));
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
          this._internalError("Unknown status: " + statusToString(status));
        }
      } // TODO


      if (isRecalc(status)) {
        // TODO emit debug event
        if ((this.status & Flag_Invalidating) !== 0) {
          this._internalError("Set status " + statusToString(status) + " called when current status is " + statusToString(prevStatus));
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
  }, {
    key: "_invalidateParents",
    value: function _invalidateParents(statusCalculated, statusCalculatingLazy, statusCalculating) {
      var _subscribersFirst = this._subscribersFirst,
          _subscribersCalculating = this._subscribersCalculating;

      if (_subscribersFirst == null) {
        return;
      }

      var status;
      var statusLazy;
      var lastLink;
      var link;

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
        var _status = link.isLazy ? statusLazy : status;

        var next = _status === 0 ? link.next : invalidateParent(link, _status);

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

  }, {
    key: "onChanged",
    value: function onChanged() {
      var _this4 = this;

      var _changedSubject = this._changedSubject;

      if (_changedSubject != null) {
        // TODO setTimeout needed until not resolved problem
        // with delete subscriber link during iterate subscribers links
        (0, _setTimeout2.default)(function () {
          return _changedSubject.emit(_this4);
        }, 0);
      }
    }
    /**
     * Subscribe "on invalidated" or "on calculated"
     * @param subscriber The first argument is {@link ICallState};
     * [statusShort]{@link ICallState.statusShort} is [Invalidated]{@link CallStatusShort.Invalidated},
     * [CalculatedValue]{@link CallStatusShort.CalculatedValue}
     * or [CalculatedError]{@link CallStatusShort.CalculatedError}
     */

  }, {
    key: "subscribe",
    value: function subscribe(subscriber) {
      var _changedSubject = this._changedSubject;

      if (_changedSubject == null) {
        this._changedSubject = _changedSubject = new _subject.Subject();
      }

      return _changedSubject.subscribe(subscriber);
    } // endregion
    // endregion

  }, {
    key: "valueOrThrow",
    get: function get() {
      if (isHasError(this.status)) {
        throw this.error;
      }

      return this.value;
    }
  }, {
    key: "data",
    get: function get() {
      var _data = this._data;

      if (_data == null) {
        this._data = _data = {};
      }

      return _data;
    }
  }, {
    key: "hasSubscribers",
    // endregion
    // region calculable
    // TODO hasDependent ...
    get: function get() {
      return this._changedSubject != null && this._changedSubject.hasSubscribers;
    }
  }, {
    key: "statusShort",
    get: function get() {
      return toStatusShort(this.status);
    }
  }, {
    key: "statusString",
    get: function get() {
      return statusToString(this.status);
    }
  }]);
  return CallState;
}(); // region get/create/delete ValueState


exports.CallState = CallState;
var valueIdToStateMap = new _map.default();
exports.valueIdToStateMap = valueIdToStateMap;
var valueToIdMap = new _map.default();
exports.valueToIdMap = valueToIdMap;
var nextValueId = 1;

function getValueState(valueId) {
  return valueIdToStateMap.get(valueId);
}

function getValueId(value) {
  var id = valueToIdMap.get(value);

  if (id == null) {
    return 0;
  }

  return id;
}

function getOrCreateValueId(value) {
  var id = valueToIdMap.get(value);

  if (id == null) {
    id = nextValueId++;
    var _state = {
      usageCount: 0,
      value: value
    };
    valueToIdMap.set(value, id);
    valueIdToStateMap.set(id, _state);
  }

  return id;
}

function deleteValueState(valueId, value) {
  if (!valueIdToStateMap.delete(valueId)) {
    throw new _helpers3.InternalError('value not found');
  }

  if (!valueToIdMap.delete(value)) {
    throw new _helpers3.InternalError('valueState not found');
  }
} // endregion
// region CallStateProviderState


var valueIdsBuffer = new Int32Array(100); // interface ICallStateProviderState<
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
  for (var i = 0, len = callStates.length; i < len; i++) {
    var _state2 = callStates[i];
    var valueIds = _state2.valueIds;

    if (valueIds.length === countValueStates) {
      var j = 0;

      for (; j < countValueStates; j++) {
        if (valueIds[j] !== _valueIdsBuffer[j]) {
          break;
        }
      }

      if (j === countValueStates) {
        return _state2;
      }
    }
  }

  return null;
} // tslint:disable-next-line:no-shadowed-variable


function createCallStateProvider(func, funcCall, initCallState) {
  var funcId = nextValueId++;
  var funcHash = (0, _helpers.nextHash)(17, funcId); // noinspection DuplicatedCode

  function _getCallState() {
    // region getCallState
    var countArgs = arguments.length;
    var countValueStates = countArgs + 2; // region calc hash

    var _valueIdsBuffer = valueIdsBuffer;
    _valueIdsBuffer[0] = funcId;
    var hash = funcHash;
    {
      var valueId = getValueId(this);

      if (valueId === 0) {
        return null;
      }

      _valueIdsBuffer[1] = valueId;
      hash = (0, _helpers.nextHash)(hash, valueId);
    }

    for (var i = 0; i < countArgs; i++) {
      var _valueId = getValueId(arguments[i]);

      if (_valueId === 0) {
        return null;
      }

      _valueIdsBuffer[i + 2] = _valueId;
      hash = (0, _helpers.nextHash)(hash, _valueId);
    } // endregion


    var callState;
    var callStates = callStateHashTable.get(hash);

    if (callStates != null) {
      callState = findCallState(callStates, countValueStates, _valueIdsBuffer);
    } // endregion


    return callState;
  }

  function createCallWithArgs() {
    var args = arguments;
    return function (_this, _func) {
      return _func.apply(_this, args);
    };
  } // noinspection DuplicatedCode


  function _getOrCreateCallState() {
    // region getCallState
    var countArgs = arguments.length;
    var countValueStates = countArgs + 2; // region calc hash

    var _valueIdsBuffer = valueIdsBuffer;
    _valueIdsBuffer[0] = funcId;
    var hash = funcHash;
    {
      var valueId = getOrCreateValueId(this);
      _valueIdsBuffer[1] = valueId;
      hash = (0, _helpers.nextHash)(hash, valueId);
    }

    for (var i = 0; i < countArgs; i++) {
      var _valueId2 = getOrCreateValueId(arguments[i]);

      _valueIdsBuffer[i + 2] = _valueId2;
      hash = (0, _helpers.nextHash)(hash, _valueId2);
    } // endregion


    var callState;
    var callStates = callStateHashTable.get(hash);

    if (callStates != null) {
      callState = findCallState(callStates, countValueStates, _valueIdsBuffer);
    } // endregion


    if (callState != null) {
      return callState;
    } // const valueIdsClone: Int32Array = _valueIdsBuffer.slice(0, countValueStates)


    var valueIdsClone = new Int32Array(countValueStates);

    for (var _i = 0; _i < countValueStates; _i++) {
      valueIdsClone[_i] = _valueIdsBuffer[_i];
    }

    for (var _i2 = 0; _i2 < countValueStates; _i2++) {
      if (_i2 > 0) {
        var valueState = getValueState(_valueIdsBuffer[_i2]);
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

  var state = {
    get: _getCallState,
    getOrCreate: _getOrCreateCallState,
    func: func,
    dependFunc: null,
    isBindThis: false
  };
  return state;
} // endregion
// region CallState Provider


var callStateProviderMap = new _weakMap.default(); // region getCallState / getOrCreateCallState

function invalidateCallState(state) {
  if (state != null) {
    state.invalidate();
    return true;
  }

  return false;
}

function subscribeCallState(callState, subscriber) {
  var unsubscribe = callState.subscribe(function (state) {
    switch (state.statusShort) {
      case _contracts.CallStatusShort.Invalidated:
        state.getValue(false, true);
        break;

      case _contracts.CallStatusShort.CalculatedValue:
      case _contracts.CallStatusShort.CalculatedError:
        if (subscriber != null) {
          subscriber(state);
        }

        break;
    }
  });
  callState.getValue(false, true);
  return unsubscribe;
}

function getCallState(func) {
  var callStateProvider = callStateProviderMap.get(func);

  if (callStateProvider == null) {
    return EMPTY_FUNC;
  } else {
    return callStateProvider.get;
  }
}

function getOrCreateCallState(func) {
  var callStateProviderState = callStateProviderMap.get(func);

  if (callStateProviderState == null) {
    return EMPTY_FUNC;
  } else {
    // currentCallStateProviderState = callStateProviderState
    return callStateProviderState.getOrCreate; // return _getOrCreateCallState
  }
}

function dependBindThis(_this, func) {
  var _callStateProviderMap = callStateProviderMap.get(func),
      _dependFunc = _callStateProviderMap.dependFunc,
      _func = _callStateProviderMap.func,
      _get = _callStateProviderMap.get,
      _getOrCreate = _callStateProviderMap.getOrCreate,
      isBindThis = _callStateProviderMap.isBindThis;

  if (isBindThis) {
    throw new Error('Function already bind: ' + func);
  }

  var newCallStateProviderState = {
    dependFunc: newDependFunc,
    func: function func() {
      return _func.apply(_this, arguments);
    },
    get: function get() {
      return _get.apply(_this, arguments);
    },
    getOrCreate: function getOrCreate() {
      return _getOrCreate.apply(_this, arguments);
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


var callStateHashTable = new _map.default();
exports.callStateHashTable = callStateHashTable;
var callStatesCount = 0; // region deleteCallState

function deleteCallState(callState) {
  callState._unsubscribeDependencies();

  var valueIds = callState.valueIds;
  var hash = 17;

  for (var i = 0, len = valueIds.length; i < len; i++) {
    var valueId = valueIds[i];
    hash = (0, _helpers.nextHash)(hash, valueId);

    if (i > 0) {
      var valueState = getValueState(valueId);

      if (valueState != null) {
        var usageCount = valueState.usageCount;

        if (usageCount <= 0) {
          throw new _helpers3.InternalError('usageCount <= 0');
        } else if (usageCount === 1 && i > 0) {
          deleteValueState(valueId, valueState.value);
        } else {
          valueState.usageCount--;
        }
      }
    }
  } // search and delete callState


  var callStates = callStateHashTable.get(hash);
  var callStatesLastIndex = callStates.length - 1;

  if (callStatesLastIndex === -1) {
    throw new _helpers3.InternalError('callStates.length === 0');
  } else if (callStatesLastIndex === 0) {
    if (callStates[0] !== callState) {
      throw new _helpers3.InternalError('callStates[0] !== callState');
    }

    callStateHashTable.delete(hash);
  } else {
    var index = 0;

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
      throw new _helpers3.InternalError('callState not found');
    }
  }

  callStatesCount--;
} // endregion
// region reduceCallStates to free memory


var reduceCallStatesHeap = new _PairingHeap.PairingHeap({
  objectPool: new _ObjectPool.ObjectPool(10000000),
  lessThanFunc: function lessThanFunc(o1, o2) {
    return o1._lastAccessTime < o2._lastAccessTime;
  }
});
exports.reduceCallStatesHeap = reduceCallStatesHeap;

function reduceCallStatesHeapAdd(states, now, _minCallStateLifeTime) {
  for (var i = 0, len = states.length; i < len; i++) {
    var callState = states[i];

    if (callState._lastAccessTime + _minCallStateLifeTime <= now && callState._subscribersFirst == null && !callState.hasSubscribers && callState.statusShort !== _contracts.CallStatusShort.Handling) {
      reduceCallStatesHeap.add(callState);
    }
  }
}

function reduceCallStates(deleteSize, _minCallStateLifeTime) {
  var now = (0, _helpers2.fastNow)();
  (0, _forEach.default)(callStateHashTable).call(callStateHashTable, function (state) {
    reduceCallStatesHeapAdd(state, now, _minCallStateLifeTime);
  });
  var countDeleted = 0;

  while (deleteSize > 0 && reduceCallStatesHeap.size > 0) {
    var callState = reduceCallStatesHeap.deleteMin();
    var _unsubscribers = callState._unsubscribers,
        _unsubscribersLength = callState._unsubscribersLength;

    if (_unsubscribers != null) {
      for (var i = 0, len = _unsubscribersLength; i < len; i++) {
        var _state3 = _unsubscribers[i].state;

        if (callState._lastAccessTime + _minCallStateLifeTime <= now && _state3._subscribersFirst === _state3._subscribersLast && !_state3.hasSubscribers && _state3.statusShort !== _contracts.CallStatusShort.Handling) {
          reduceCallStatesHeap.add(_state3);
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
    var _webrainOptions$callS = _webrainOptions.webrainOptions.callState.garbageCollect,
        bulkSize = _webrainOptions$callS.bulkSize,
        minLifeTime = _webrainOptions$callS.minLifeTime,
        interval = _webrainOptions$callS.interval,
        disabled = _webrainOptions$callS.disabled;

    if (!disabled) {
      var time = (0, _helpers2.fastNow)();
      var countDeleted = reduceCallStates(bulkSize, minLifeTime);

      if (countDeleted > 0 || callStatesCount === 0) {
        console.debug("CallState GC - deleted: " + countDeleted + ", alive: " + callStatesCount + ", " + ((0, _helpers2.fastNow)() - time) / countDeleted + " ms/item");
      }
    }

    garbageCollectSchedule();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

var garbageCollectTimer = null;

function garbageCollectSchedule() {
  if (callStatesCount > 0 && garbageCollectTimer === null) {
    var _webrainOptions$callS2 = _webrainOptions.webrainOptions.callState.garbageCollect,
        interval = _webrainOptions$callS2.interval,
        disabled = _webrainOptions$callS2.disabled;

    if (!disabled) {
      garbageCollectTimer = (0, _setTimeout2.default)(garbageCollect, interval);
    }
  }
} // endregion
// endregion
// region makeDependentFunc


function createDependentFunc(func, callStateProvider, canAlwaysRecalc) {
  return function _dependentFunc() {
    var getState = canAlwaysRecalc && (0, _currentState.getCurrentState)() == null ? callStateProvider.get : callStateProvider.getOrCreate;
    var state = getState.apply(this, arguments);
    return state != null ? state.getValue() : func.apply(this, arguments);
  };
}
/**
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */


function makeDependentFunc(func, funcCall, initCallState, canAlwaysRecalc) {
  var callStateProvider = callStateProviderMap.get(func);

  if (callStateProvider != null) {
    return callStateProvider.dependFunc;
  }

  callStateProvider = createCallStateProvider(func, funcCall, initCallState);
  callStateProviderMap.set(func, callStateProvider);
  var dependFunc = createDependentFunc(func, callStateProvider, canAlwaysRecalc);
  callStateProvider.dependFunc = dependFunc;
  callStateProviderMap.set(dependFunc, callStateProvider);
  return dependFunc;
} // endregion
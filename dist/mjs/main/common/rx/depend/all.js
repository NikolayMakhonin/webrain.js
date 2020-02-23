import { isThenable } from '../../async/async';
import { resolveAsync } from '../../async/ThenableSync';
import { isIterator } from '../../helpers/helpers';
import { FuncCallStatus } from './contracts'; // invalidate,
// getFuncCallState,
// makeDependentFunc,
// region subscriberLinkPool

export class SubscriberLinkPool {
  constructor() {
    this.size = 0;
    this.maxSize = 1000000;
    this.stack = [];
  }

}
export const subscriberLinkPool = new SubscriberLinkPool();
export let poolFirst;
export let poolLast;
export function getSubscriberLinkFromPool() {
  // Pool as Linked List
  // const result = poolLast
  // if (result != null) {
  // 	const {prev} = result
  // 	if (prev == null) {
  // 		poolFirst = null
  // 		poolLast = null
  // 	} else {
  // 		prev.next = null
  // 		poolLast = prev
  // 	}
  // }
  // return result
  // Pool as Array
  // this.usedSize++
  const lastIndex = subscriberLinkPool.size - 1;

  if (lastIndex >= 0) {
    const obj = subscriberLinkPool.stack[lastIndex];
    subscriberLinkPool.stack[lastIndex] = null;
    subscriberLinkPool.size = lastIndex;

    if (obj == null) {
      throw new Error('obj == null');
    }

    return obj;
  }

  return null;
} // tslint:disable-next-line:no-shadowed-variable

export function releaseSubscriberLink(obj) {
  // Pool as Linked List
  // if (poolLast == null) {
  // 	poolFirst = obj
  // 	obj.prev = null
  // } else {
  // 	poolLast.next = obj
  // 	obj.prev = poolLast
  // }
  // obj.next = null
  // poolLast = obj
  // Pool as Array
  // this.usedSize--
  if (subscriberLinkPool.size < subscriberLinkPool.maxSize) {
    subscriberLinkPool.stack[subscriberLinkPool.size] = obj;
    subscriberLinkPool.size++;
  }
} // tslint:disable-next-line:no-shadowed-variable

export function getSubscriberLink(state, subscriber, prev, next) {
  const item = getSubscriberLinkFromPool();

  if (item != null) {
    item.state = state;
    item.value = subscriber;
    item.prev = prev;
    item.next = next;
    return item;
  }

  return {
    state,
    value: subscriber,
    prev,
    next
  };
} // endregion
// region subscribeDependency

export function subscriberLinkDelete(state, item) {
  if (state == null) {
    return;
  }

  const {
    prev,
    next
  } = item;

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
} // tslint:disable-next-line:no-shadowed-variable

export function unsubscribeDependencies(state) {
  const _unsubscribers = state._unsubscribers;

  if (_unsubscribers != null) {
    const len = state._unsubscribersLength;

    for (let i = 0; i < len; i++) {
      const item = _unsubscribers[i];
      _unsubscribers[i] = null; // subscriberLinkDelete(item.state, item)
      // region inline call

      {
        // tslint:disable-next-line:no-shadowed-variable
        const {
          prev,
          next,
          state
        } = item;

        if (state == null) {
          return;
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
    }

    state._unsubscribersLength = 0;

    if (len > 256) {
      _unsubscribers.length = 256;
    }
  }
}
export function _subscribe(state, subscriber) {
  const _subscribersLast = state._subscribersLast;
  const subscriberLink = getSubscriberLink(state, subscriber, _subscribersLast, null);

  if (_subscribersLast == null) {
    state._subscribersFirst = subscriberLink;
  } else {
    _subscribersLast.next = subscriberLink;
  }

  state._subscribersLast = subscriberLink;
  return subscriberLink;
} // tslint:disable-next-line:no-shadowed-variable

export function subscribeDependency(state, dependency) {
  if (dependency.callId > state.callId) {
    return;
  }

  const subscriberLink = _subscribe(dependency, state);

  const _unsubscribers = state._unsubscribers;

  if (_unsubscribers == null) {
    state._unsubscribers = [subscriberLink];
    state._unsubscribersLength = 1;
  } else {
    _unsubscribers[state._unsubscribersLength++] = subscriberLink;
  }
} // endregion
// region _createDependentFunc

const FuncCallStatus_Invalidating = 1;
const FuncCallStatus_Invalidated = 2;
const FuncCallStatus_Calculating = 3;
const FuncCallStatus_CalculatingAsync = 4;
const FuncCallStatus_Calculated = 5;
const FuncCallStatus_Error = 6;
export function update(state, status, valueAsyncOrValueOrError) {
  const prevStatus = state.status;

  switch (status) {
    case FuncCallStatus_Invalidating:
      if (prevStatus === FuncCallStatus_Invalidated) {
        return;
      }

      if (prevStatus !== FuncCallStatus_Invalidating && prevStatus !== FuncCallStatus_Calculated && prevStatus !== FuncCallStatus_Error) {
        throw new Error(`Set status ${status} called when current status is ${prevStatus}`);
      }

      break;

    case FuncCallStatus_Invalidated:
      if (prevStatus !== FuncCallStatus_Invalidating) {
        return;
      }

      break;

    case FuncCallStatus_Calculating:
      if (prevStatus != null && prevStatus !== FuncCallStatus_Invalidating && prevStatus !== FuncCallStatus_Invalidated) {
        throw new Error(`Set status ${status} called when current status is ${prevStatus}`);
      }

      break;

    case FuncCallStatus_CalculatingAsync:
      if (prevStatus !== FuncCallStatus_Calculating) {
        throw new Error(`Set status ${status} called when current status is ${prevStatus}`);
      }

      state.valueAsync = valueAsyncOrValueOrError;
      break;

    case FuncCallStatus_Calculated:
      if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
        throw new Error(`Set status ${status} called when current status is ${prevStatus}`);
      }

      if (typeof state.valueAsync !== 'undefined') {
        state.valueAsync = null;
      }

      state.error = void 0;
      state.value = valueAsyncOrValueOrError;
      state.hasError = false;
      state.hasValue = true;
      break;

    case FuncCallStatus_Error:
      if (prevStatus !== FuncCallStatus_Calculating && prevStatus !== FuncCallStatus_CalculatingAsync) {
        throw new Error(`Set status ${status} called when current status is ${prevStatus}`);
      }

      if (typeof state.valueAsync !== 'undefined') {
        state.valueAsync = null;
      }

      state.error = valueAsyncOrValueOrError;
      state.hasError = true;
      break;

    default:
      throw new Error('Unknown FuncCallStatus: ' + status);
  }

  state.status = status;

  switch (status) {
    case FuncCallStatus_Invalidating:
      // emit(state, status)
      // region inline call
      if (state._subscribersFirst != null) {
        // let clonesFirst
        // let clonesLast
        // for (let link = state._subscribersFirst; link; link = link.next) {
        // 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
        // 	if (clonesLast == null) {
        // 		clonesFirst = cloneLink
        // 	} else {
        // 		clonesLast.next = cloneLink
        // 	}
        // 	clonesLast = cloneLink
        // }
        for (let link = state._subscribersFirst; link;) {
          const next = link.next;

          if (link.value.status !== FuncCallStatus.Invalidating && link.value.status !== FuncCallStatus.Invalidated) {
            // invalidate(link.value, status)
            // region inline call
            {
              // tslint:disable-next-line:no-shadowed-variable
              const state = link.value;
              update(state, FuncCallStatus_Invalidating);
            } // endregion
            // link.value = null
            // link.next = null
            // releaseSubscriberLink(link)
          }

          link = next;
        }
      } // endregion


      break;

    case FuncCallStatus_Invalidated:
      // emit(state, status)
      // region inline call
      if (state._subscribersFirst != null) {
        // let clonesFirst
        // let clonesLast
        // for (let link = state._subscribersFirst; link; link = link.next) {
        // 	const cloneLink = getSubscriberLink(state, link.value, null, link.next)
        // 	if (clonesLast == null) {
        // 		clonesFirst = cloneLink
        // 	} else {
        // 		clonesLast.next = cloneLink
        // 	}
        // 	clonesLast = cloneLink
        // }
        for (let link = state._subscribersFirst; link;) {
          const next = link.next; // invalidate(link.value, status)
          // region inline call

          {
            // tslint:disable-next-line:no-shadowed-variable
            const state = link.value;
            update(state, FuncCallStatus_Invalidated);
          } // endregion
          // link.value = null
          // link.next = null
          // releaseSubscriberLink(link)

          link = next;
        }
      } // endregion


      break;
  }
} // tslint:disable-next-line:no-shadowed-variable

export function invalidate(state, status) {
  if (status == null) {
    update(state, FuncCallStatus_Invalidating);
    update(state, FuncCallStatus_Invalidated);
  } else {
    update(state, status);
  }
}
export function emit(state, status) {
  if (state._subscribersFirst != null) {
    let clonesFirst;
    let clonesLast;

    for (let link = state._subscribersFirst; link; link = link.next) {
      const cloneLink = getSubscriberLink(state, link.value, null, link.next);

      if (clonesLast == null) {
        clonesFirst = cloneLink;
      } else {
        clonesLast.next = cloneLink;
      }

      clonesLast = cloneLink;
    }

    for (let link = clonesFirst; link;) {
      invalidate(link.value, status);
      link.value = null;
      const next = link.next;
      link.next = null;
      releaseSubscriberLink(link);
      link = next;
    }
  }
}
export class FuncCallState {
  constructor(func, _this, callWithArgs) {
    this.status = FuncCallStatus_Invalidated;
    this.hasValue = false;
    this.hasError = false;
    this.valueAsync = null;
    this.value = void 0;
    this.error = void 0;
    this.parentCallState = null;
    this._subscribersFirst = null;
    this._subscribersLast = null;
    this.callId = 0;
    this._unsubscribers = null;
    this._unsubscribersLength = 0;
    this.func = func;
    this._this = _this;
    this.callWithArgs = callWithArgs;
  }

} // tslint:disable-next-line:no-shadowed-variable

export function createFuncCallState(func, _this, callWithArgs) {
  return new FuncCallState(func, _this, callWithArgs);
}
let currentState;
let nextCallId = 1;
export function _dependentFunc(state) {
  if (currentState != null) {
    subscribeDependency(currentState, state);
  }

  state.callId = nextCallId++;

  if (state.status != null) {
    switch (state.status) {
      case FuncCallStatus_Calculated:
        return state.value;

      case FuncCallStatus_Invalidating:
      case FuncCallStatus_Invalidated:
        break;

      case FuncCallStatus_CalculatingAsync:
        let parentCallState = state.parentCallState;

        while (parentCallState) {
          if (parentCallState === state) {
            throw new Error('Recursive async loop detected');
          }

          parentCallState = parentCallState.parentCallState;
        }

        return state.valueAsync;

      case FuncCallStatus_Error:
        throw state.error;

      case FuncCallStatus_Calculating:
        throw new Error('Recursive sync loop detected');

      default:
        throw new Error('Unknown FuncStatus: ' + state.status);
    }
  } // unsubscribeDependencies(state)
  // region inline call


  {
    const _unsubscribers = state._unsubscribers;

    if (_unsubscribers != null) {
      const len = state._unsubscribersLength;

      for (let i = 0; i < len; i++) {
        const item = _unsubscribers[i];
        _unsubscribers[i] = null; // subscriberLinkDelete(item.state, item)
        // region inline call

        {
          // tslint:disable-next-line:no-shadowed-variable
          const {
            prev,
            next,
            state
          } = item;

          if (state == null) {
            return;
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
      }

      state._unsubscribersLength = 0;

      if (len > 256) {
        _unsubscribers.length = 256;
      }
    }
  } // endregion

  state.parentCallState = currentState;
  currentState = state; // return tryInvoke.apply(state, arguments)

  try {
    update(state, FuncCallStatus_Calculating); // let value: any = state.func.apply(state._this, arguments)

    let value = state.callWithArgs(state._this, state.func);

    if (isIterator(value)) {
      value = resolveAsync(makeDependentIterator(state, value));

      if (isThenable(value)) {
        update(state, FuncCallStatus_CalculatingAsync, value);
      }

      return value;
    } else if (isThenable(value)) {
      throw new Error('You should use iterator instead thenable for async functions');
    }

    update(state, FuncCallStatus_Calculated, value);
    return value;
  } catch (error) {
    update(state, FuncCallStatus_Error, error);
    throw error;
  } finally {
    currentState = state.parentCallState;
    state.parentCallState = null;
  }
}
export function* makeDependentIterator(state, iterator, nested) {
  currentState = state;

  try {
    let iteration = iterator.next();

    while (!iteration.done) {
      let value = iteration.value;

      if (isIterator(value)) {
        value = makeDependentIterator(state, value, true);
      }

      value = yield value;
      currentState = state;
      iteration = iterator.next(value);
    }

    if (nested == null) {
      update(state, FuncCallStatus_Calculated, iteration.value);
    }

    return iteration.value;
  } catch (error) {
    if (nested == null) {
      update(state, FuncCallStatus_Error, error);
    }

    throw error;
  } finally {
    currentState = null;
    state.parentCallState = null;
  }
} // endregion
// region _getFuncCallState

export function isRefType(value) {
  return value != null && (typeof value === 'object' || typeof value === 'function');
}
export function createSemiWeakMap() {
  return {
    map: null,
    weakMap: null
  };
}
export function semiWeakMapGet(semiWeakMap, key) {
  let value;

  if (isRefType(key)) {
    const weakMap = semiWeakMap.weakMap;

    if (weakMap != null) {
      value = weakMap.get(key);
    }
  } else {
    const map = semiWeakMap.map;

    if (map != null) {
      value = map.get(key);
    }
  }

  return value == null ? null : value;
}
export function semiWeakMapSet(semiWeakMap, key, value) {
  if (isRefType(key)) {
    let weakMap = semiWeakMap.weakMap;

    if (weakMap == null) {
      semiWeakMap.weakMap = weakMap = new WeakMap();
    }

    weakMap.set(key, value);
  } else {
    let map = semiWeakMap.map;

    if (map == null) {
      semiWeakMap.map = map = new Map();
    }

    map.set(key, value);
  }
}
export function createCallWithArgs() {
  const args = arguments;
  return function (_this, func) {
    return func.apply(_this, args);
  };
} // tslint:disable-next-line:no-shadowed-variable

export function _getFuncCallState(func, funcStateMap) {
  return function () {
    const argumentsLength = arguments.length;
    let argsLengthStateMap = funcStateMap.get(argumentsLength);

    if (argsLengthStateMap == null) {
      argsLengthStateMap = createSemiWeakMap();
      funcStateMap.set(argumentsLength, argsLengthStateMap);
    }

    let state;
    let currentMap = semiWeakMapGet(argsLengthStateMap, this);

    if (argumentsLength !== 0) {
      if (currentMap == null) {
        currentMap = createSemiWeakMap();
        semiWeakMapSet(argsLengthStateMap, this, currentMap);
      }

      for (let i = 0; i < argumentsLength - 1; i++) {
        const arg = arguments[i];
        let nextStateMap = semiWeakMapGet(currentMap, arg);

        if (nextStateMap == null) {
          nextStateMap = createSemiWeakMap();
          semiWeakMapSet(currentMap, arg, nextStateMap);
        }

        currentMap = nextStateMap;
      }

      const lastArg = arguments[argumentsLength - 1];
      state = semiWeakMapGet(currentMap, lastArg);

      if (state == null) {
        state = createFuncCallState(func, this, createCallWithArgs.apply(null, arguments));
        semiWeakMapSet(currentMap, lastArg, state);
      }
    } else {
      state = semiWeakMapGet(argsLengthStateMap, this);

      if (state == null) {
        state = createFuncCallState(func, this, createCallWithArgs.apply(null, arguments));
        semiWeakMapSet(argsLengthStateMap, this, state);
      }
    }

    return state;
  };
} // endregion
// region facade

export function createDependentFunc(getState) {
  return function () {
    const state = getState.apply(this, arguments);
    return _dependentFunc(state);
  };
}
// tslint:disable-next-line:no-shadowed-variable
export function createMakeDependentFunc(rootStateMap) {
  // tslint:disable-next-line:no-shadowed-variable
  // tslint:disable-next-line:no-shadowed-variable
  // tslint:disable-next-line:no-shadowed-variable
  function makeDependentFunc(func) {
    if (rootStateMap.get(func)) {
      throw new Error('Multiple call makeDependentFunc() for func: ' + func);
    }

    const getState = _getFuncCallState(func, new Map());

    rootStateMap.set(func, getState);
    const dependentFunc = createDependentFunc(getState);
    rootStateMap.set(dependentFunc, getState);
    return dependentFunc;
  }

  return makeDependentFunc;
} // tslint:disable-next-line:no-empty

const emptyFunc = () => {}; // tslint:disable-next-line:no-shadowed-variable


export function createGetFuncCallState(rootStateMap) {
  // tslint:disable-next-line:no-shadowed-variable
  function getFuncCallState(func) {
    return rootStateMap.get(func) || emptyFunc;
  }

  return getFuncCallState;
}
const rootStateMap = new WeakMap(); // tslint:disable-next-line:no-shadowed-variable

export const getFuncCallState = createGetFuncCallState(rootStateMap); // tslint:disable-next-line:no-shadowed-variable

export const makeDependentFunc = createMakeDependentFunc(rootStateMap); // endregion
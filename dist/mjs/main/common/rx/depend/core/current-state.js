/* tslint:disable:no-circular-imports no-shadowed-variable */
import { registerStateProvider } from '../../../async/async';
import { isIterator } from '../../../helpers/helpers';
// region currentState
let currentState = null;
export function getCurrentState() {
  return currentState;
}
export function setCurrentState(state) {
  currentState = state;
}
registerStateProvider({
  getState: getCurrentState,
  setState: setCurrentState
}); // endregion
// region forceLazy

let _forceLazy = null;
export function getForceLazy() {
  return _forceLazy;
}
export function setForceLazy(value) {
  _forceLazy = value;
} // endregion
// region withMode

function* _withModeAsync(noSubscribe, forceLazy, iterator) {
  const prevState = noSubscribe ? getCurrentState() : null;
  const prevForceLazy = forceLazy != null ? getForceLazy() : null;

  try {
    if (noSubscribe) {
      setCurrentState(null);
    }

    if (forceLazy != null) {
      setForceLazy(forceLazy);
    }

    return yield iterator;
  } finally {
    if (noSubscribe) {
      setCurrentState(prevState);
    }

    if (forceLazy != null) {
      setForceLazy(prevForceLazy);
    }
  }
}

export function withMode(noSubscribe, forceLazy, func) {
  const prevState = noSubscribe ? getCurrentState() : null;
  const prevForceLazy = forceLazy != null ? getForceLazy() : null;
  let result;

  try {
    if (noSubscribe) {
      setCurrentState(null);
    }

    if (forceLazy != null) {
      setForceLazy(forceLazy);
    }

    result = func();
  } finally {
    if (noSubscribe) {
      setCurrentState(prevState);
    }

    if (forceLazy != null) {
      setForceLazy(prevForceLazy);
    }
  }

  if (isIterator(result)) {
    return _withModeAsync(noSubscribe, forceLazy, result);
  }

  return result;
} // endregion
// region noSubscribe

export function noSubscribe(func) {
  return withMode(true, null, func);
} // endregion
// region forceLazy

export function forceLazy(func) {
  return withMode(null, true, func);
} // endregion
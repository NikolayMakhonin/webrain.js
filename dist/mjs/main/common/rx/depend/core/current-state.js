/* tslint:disable:no-circular-imports */
import { isIterator } from '../../../helpers/helpers';
let currentState = null;
export function getCurrentState() {
  return currentState;
}
export function setCurrentState(state) {
  currentState = state;
}

function* _noSubscribeAsync(iterator) {
  const prevState = getCurrentState();

  try {
    setCurrentState(null);
    return yield iterator;
  } finally {
    setCurrentState(prevState);
  }
}

export function noSubscribe(func) {
  const prevState = getCurrentState();
  let result;

  try {
    setCurrentState(null);
    result = func();
  } finally {
    setCurrentState(prevState);
  }

  if (isIterator(result)) {
    return _noSubscribeAsync(result);
  }
}
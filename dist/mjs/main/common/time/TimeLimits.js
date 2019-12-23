import { isAsync } from '../async/async';
import { resolveAsyncAll, resolveAsyncAny } from '../async/ThenableSync';

function createSingleCallFunc(func) {
  if (!func) {
    return null;
  }

  let result;
  return () => {
    if (!func) {
      return result;
    }

    result = func();
    func = null;
    return result;
  };
}

export class TimeLimits {
  constructor(...timeLimits) {
    this.timeLimits = timeLimits;
  }

  getWaitTime() {
    const timeLimits = this.timeLimits;
    const len = timeLimits.length;
    let maxTime = 0;

    for (let i = 0; i < len; i++) {
      const waitTime = timeLimits[i].getWaitTime();

      if (waitTime == null) {
        return null;
      }

      if (waitTime > maxTime) {
        maxTime = waitTime;
      }
    }

    return maxTime;
  }

  wait(complete) {
    const waitTime = this.getWaitTime();

    if (waitTime === 0) {
      return complete ? complete() : null;
    }

    const timeLimits = this.getLeafTimeLimits();
    const len = timeLimits.length;
    const waiters = new Array(len);

    for (let i = 0; i < len; i++) {
      waiters[i] = timeLimits[i].wait();
    }

    return resolveAsyncAll(waiters, () => this.wait(complete));
  }

  run(func) {
    return this.wait(() => {
      const timeLimits = this.getLeafTimeLimits();
      const len = timeLimits.length;

      if (len === 0) {
        return func && func();
      }

      const singleCallFunc = createSingleCallFunc(func);
      let results;
      let resultsIsAsync = true;

      for (let i = 0; i < len; i++) {
        const result = timeLimits[i].run(singleCallFunc);

        if (resultsIsAsync) {
          if (isAsync(result)) {
            if (!results) {
              results = [];
            }

            results[i] = result;
          } else {
            results = result;
            resultsIsAsync = false;
          }
        }
      }

      return resultsIsAsync ? resolveAsyncAny(results) : results;
    });
  }

  get debug() {
    return this.timeLimits.map(o => o.debug);
  }

  getLeafTimeLimits(result = {}) {
    const timeLimits = this.timeLimits;
    const len = timeLimits.length;

    for (let i = 0; i < len; i++) {
      const timeLimit = timeLimits[i];

      if (timeLimit.getLeafTimeLimits) {
        timeLimit.getLeafTimeLimits(result);
      } else {
        result[timeLimit.id] = timeLimit;
      }
    }

    return Object.values(result);
  }

}
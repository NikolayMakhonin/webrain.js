import { timingDefault } from './timing';
export class DeferredCalc {
  constructor({
    shouldInvalidate,
    canBeCalcCallback,
    calcFunc,
    calcCompletedCallback,
    options,
    dontImmediateInvalidate
  }) {
    this._timerId = -1;
    this._timeNextPulse = -1;
    this._timeInvalidateFirst = -1;
    this._timeInvalidateLast = 0;
    this._canBeCalcEmitted = false;
    this._calcRequested = false;
    this._timeCalcStart = 0;
    this._timeCalcEnd = 0;
    this._shouldInvalidate = shouldInvalidate;
    this._canBeCalcCallback = canBeCalcCallback;
    this._calcFunc = calcFunc;
    this._calcCompletedCallback = calcCompletedCallback;
    this._options = options || {};
    this._timing = this._options.timing || timingDefault;

    this._pulseBind = () => {
      this._pulse();
    };

    if (!dontImmediateInvalidate) {
      this.invalidate();
    }
  } // region Properties
  // region minTimeBetweenCalc


  get minTimeBetweenCalc() {
    return this._options.minTimeBetweenCalc;
  }

  set minTimeBetweenCalc(value) {
    if (this._options.minTimeBetweenCalc === value) {
      return;
    }

    this._options.minTimeBetweenCalc = value;

    this._pulse();
  } // endregion
  // region throttleTime


  get throttleTime() {
    return this._options.throttleTime;
  }

  set throttleTime(value) {
    if (this._options.throttleTime === value) {
      return;
    }

    this._options.throttleTime = value;

    this._pulse();
  } // endregion
  // region maxThrottleTime


  get maxThrottleTime() {
    return this._options.maxThrottleTime;
  }

  set maxThrottleTime(value) {
    if (this._options.maxThrottleTime === value) {
      return;
    }

    this._options.maxThrottleTime = value;

    this._pulse();
  } // endregion
  // region delayBeforeCalc


  get delayBeforeCalc() {
    return this._options.delayBeforeCalc;
  }

  set delayBeforeCalc(value) {
    if (this._options.delayBeforeCalc === value) {
      return;
    }

    this._options.delayBeforeCalc = value;

    this._pulse();
  } // endregion
  // region autoInvalidateInterval


  get autoInvalidateInterval() {
    return this._options.autoInvalidateInterval;
  }

  set autoInvalidateInterval(value) {
    if (this._options.autoInvalidateInterval === value) {
      return;
    }

    this._options.autoInvalidateInterval = value;

    this._pulse();
  } // endregion
  // endregion
  // region Private methods


  _calc() {
    this._timeInvalidateFirst = -1;
    this._timeInvalidateLast = 0;
    this._canBeCalcEmitted = false;
    this._calcRequested = false;
    this._timeCalcStart = this._timing.now();
    this._timeCalcEnd = 0;

    this._pulse();

    if (this._calcFunc != null) {
      this._calcFunc();
    } else {
      this.done();
    }
  }

  done(v1, v2, v3, v4, v5) {
    this._timeCalcEnd = this._timing.now();

    if (this._calcCompletedCallback != null) {
      this._calcCompletedCallback(v1, v2, v3, v4, v5);
    }

    this._pulse();
  }

  _canBeCalc() {
    this._canBeCalcEmitted = true;

    if (this._canBeCalcCallback != null) {
      this._canBeCalcCallback();
    } else {
      this.calc();
    }
  }

  _getNextCalcTime() {
    const {
      throttleTime,
      maxThrottleTime,
      delayBeforeCalc,
      minTimeBetweenCalc
    } = this._options;
    let nextCalcTime = this._timeInvalidateLast + (throttleTime || 0);

    if (maxThrottleTime != null) {
      nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (maxThrottleTime || 0));
    }

    if (delayBeforeCalc != null) {
      nextCalcTime = Math.max(nextCalcTime, this._timeInvalidateFirst + (delayBeforeCalc || 0));
    }

    if (this._timeCalcEnd !== 0) {
      nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (minTimeBetweenCalc || 0));
    }

    return nextCalcTime;
  }

  _pulse() {
    // region Timer
    const {
      _timing
    } = this;

    const now = _timing.now();

    let {
      _timeNextPulse: timeNextPulse
    } = this;

    if (timeNextPulse < 0) {
      timeNextPulse = now;
    } else if (timeNextPulse <= now) {
      this._timerId = -1;
    } // endregion
    // region Can be calc


    if (!this._canBeCalcEmitted && !this._calcRequested && this._timeInvalidateLast !== 0 && (this._timeCalcEnd !== 0 || this._timeCalcStart === 0)) {
      const canBeCalcTime = this._getNextCalcTime();

      if (canBeCalcTime <= now) {
        this._canBeCalc();

        this._pulse();

        return;
      } else if (timeNextPulse <= now || canBeCalcTime < timeNextPulse) {
        timeNextPulse = canBeCalcTime;
      }
    } // endregion
    // region Calc


    if (this._calcRequested && (this._timeCalcEnd !== 0 || this._timeCalcStart === 0)) {
      const calcTime = this._getNextCalcTime();

      if (calcTime <= now) {
        this._calc();

        return;
      } else if (timeNextPulse <= now || calcTime < timeNextPulse) {
        timeNextPulse = calcTime;
      }
    } // endregion
    // region Auto invalidate


    const {
      autoInvalidateInterval
    } = this._options;

    if (autoInvalidateInterval && this._timeInvalidateLast === 0 && !(timeNextPulse > now && timeNextPulse !== this._timeNextPulse)) {
      const autoInvalidateTime = Math.max(this._timeCalcStart + autoInvalidateInterval, now);

      if (autoInvalidateTime <= now) {
        if (this._shouldInvalidate != null) {
          this._shouldInvalidate();
        } else {
          this.invalidate();
        }

        return;
      } else if (timeNextPulse <= now || autoInvalidateTime < timeNextPulse) {
        timeNextPulse = autoInvalidateTime;
      }
    } // endregion
    // region Timer


    if (timeNextPulse > now && timeNextPulse !== this._timeNextPulse) {
      const {
        _timerId: timerId
      } = this;

      if (timerId >= 0) {
        _timing.clearTimeout(timerId);
      }

      this._timeNextPulse = timeNextPulse;
      this._timerId = _timing.setTimeout(this._pulseBind, timeNextPulse - now + 1); // ( + 1) is  fix hung

      return;
    } // endregion

  }

  _invalidate() {
    const now = this._timing.now();

    if (this._timeInvalidateFirst < 0) {
      this._timeInvalidateFirst = now;
    }

    this._timeInvalidateLast = now;
  } // endregion
  // region Public methods


  invalidate() {
    this._invalidate();

    this._pulse();
  }

  calc() {
    if (!this._calcRequested && this._canBeCalcEmitted) {
      this._calcRequested = true;

      this._pulse();
    }
  }

  reCalc() {
    this._calcRequested = true;

    this._pulse();
  } // endregion


}
import { timingDefault } from './timing';
export class DeferredCalc {
  constructor(canBeCalcCallback, calcFunc, calcCompletedCallback, options) {
    this._canBeCalcCallback = canBeCalcCallback;
    this._calcFunc = calcFunc;
    this._calcCompletedCallback = calcCompletedCallback;

    if (options) {
      if (options.minTimeBetweenCalc) {
        this._minTimeBetweenCalc = options.minTimeBetweenCalc;
      }

      if (options.throttleTime) {
        this._throttleTime = options.throttleTime;
      }

      if (options.maxThrottleTime != null) {
        this._maxThrottleTime = options.maxThrottleTime;
      }

      if (options.autoInvalidateInterval != null) {
        this._autoInvalidateInterval = options.autoInvalidateInterval;
      }

      this._timing = options.timing || timingDefault;
    } else {
      this._timing = timingDefault;
    }

    this.invalidate();
  } // region Properties
  // region minTimeBetweenCalc


  get minTimeBetweenCalc() {
    return this._minTimeBetweenCalc;
  }

  set minTimeBetweenCalc(value) {
    if (this._minTimeBetweenCalc === value) {
      return;
    }

    this._minTimeBetweenCalc = value;

    this._pulse();
  } // endregion
  // region throttleTime


  get throttleTime() {
    return this._throttleTime;
  }

  set throttleTime(value) {
    if (this._throttleTime === value) {
      return;
    }

    this._throttleTime = value;

    this._pulse();
  } // endregion
  // region maxThrottleTime


  get maxThrottleTime() {
    return this._maxThrottleTime;
  }

  set maxThrottleTime(value) {
    if (this._maxThrottleTime === value) {
      return;
    }

    this._maxThrottleTime = value;

    this._pulse();
  } // endregion
  // region autoInvalidateInterval


  get autoInvalidateInterval() {
    return this._autoInvalidateInterval;
  }

  set autoInvalidateInterval(value) {
    if (this._autoInvalidateInterval === value) {
      return;
    }

    this._autoInvalidateInterval = value;

    this._pulse();
  } // endregion
  // endregion
  // region Private methods


  _calc() {
    this._timeInvalidateFirst = null;
    this._timeInvalidateLast = null;
    this._canBeCalcEmitted = false;
    this._calcRequested = false;
    this._timeCalcStart = this._timing.now();
    this._timeCalcEnd = null;

    this._pulse();

    this._calcFunc.call(this, (...args) => {
      this._timeCalcEnd = this._timing.now();

      this._calcCompletedCallback.apply(this, args);

      this._pulse();
    });
  }

  _canBeCalc() {
    this._canBeCalcEmitted = true;

    this._canBeCalcCallback.call(this);
  }

  _getNextCalcTime() {
    const {
      _throttleTime,
      _maxThrottleTime
    } = this;
    let nextCalcTime = this._timeInvalidateLast + (_throttleTime || 0);

    if (_maxThrottleTime != null) {
      nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (_maxThrottleTime || 0));
    }

    if (this._timeCalcEnd) {
      nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (this._minTimeBetweenCalc || 0));
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

    if (timeNextPulse == null) {
      timeNextPulse = now;
    } else if (timeNextPulse <= now) {
      this._timerId = null;
    } // endregion
    // region Auto invalidate


    const {
      _autoInvalidateInterval
    } = this;

    if (_autoInvalidateInterval != null) {
      const autoInvalidateTime = Math.max((this._timeCalcStart || 0) + _autoInvalidateInterval, (this._timeInvalidateLast || 0) + _autoInvalidateInterval, now);

      if (autoInvalidateTime <= now) {
        this._invalidate();
      } else if (timeNextPulse <= now || autoInvalidateTime < timeNextPulse) {
        timeNextPulse = autoInvalidateTime;
      }
    } // endregion
    // region Can be calc


    if (!this._canBeCalcEmitted && !this._calcRequested && this._timeInvalidateLast && (this._timeCalcEnd || !this._timeCalcStart)) {
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


    if (this._calcRequested && (this._timeCalcEnd || !this._timeCalcStart)) {
      const calcTime = this._getNextCalcTime();

      if (calcTime <= now) {
        this._calc();

        return;
      } else if (timeNextPulse <= now || calcTime < timeNextPulse) {
        timeNextPulse = calcTime;
      }
    } // endregion
    // region Timer


    if (timeNextPulse > now && timeNextPulse !== this._timeNextPulse) {
      const {
        _timerId: timerId
      } = this;

      if (timerId != null) {
        _timing.clearTimeout(timerId);
      }

      this._timeNextPulse = timeNextPulse;
      this._timerId = _timing.setTimeout(() => {
        this._pulse();
      }, timeNextPulse - now);
    } // endregion

  }

  _invalidate() {
    const now = this._timing.now();

    if (this._timeInvalidateFirst == null) {
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
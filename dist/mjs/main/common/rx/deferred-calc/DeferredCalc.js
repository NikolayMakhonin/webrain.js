import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { timingDefault } from './timing';
export var DeferredCalc =
/*#__PURE__*/
function () {
  function DeferredCalc(canBeCalcCallback, calcFunc, calcCompletedCallback, options) {
    _classCallCheck(this, DeferredCalc);

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


  _createClass(DeferredCalc, [{
    key: "_calc",
    // endregion
    // endregion
    // region Private methods
    value: function _calc() {
      var _this = this;

      this._timeInvalidateFirst = null;
      this._timeInvalidateLast = null;
      this._canBeCalcEmitted = false;
      this._calcRequested = false;
      this._timeCalcStart = this._timing.now();
      this._timeCalcEnd = null;

      this._pulse();

      this._calcFunc.call(this, function () {
        _this._timeCalcEnd = _this._timing.now();

        _this._calcCompletedCallback.call(_this);

        _this._pulse();
      });
    }
  }, {
    key: "_canBeCalc",
    value: function _canBeCalc() {
      this._canBeCalcEmitted = true;

      this._canBeCalcCallback.call(this);
    }
  }, {
    key: "_getNextCalcTime",
    value: function _getNextCalcTime() {
      var _throttleTime = this._throttleTime,
          _maxThrottleTime = this._maxThrottleTime;
      var nextCalcTime = this._timeInvalidateLast + (_throttleTime || 0);

      if (_maxThrottleTime != null) {
        nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (_maxThrottleTime || 0));
      }

      if (this._timeCalcEnd) {
        nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (this._minTimeBetweenCalc || 0));
      }

      return nextCalcTime;
    }
  }, {
    key: "_pulse",
    value: function _pulse() {
      var _this2 = this;

      // region Timer
      var _timing = this._timing;

      var now = _timing.now();

      var timeNextPulse = this._timeNextPulse;

      if (timeNextPulse == null) {
        timeNextPulse = now;
      } else if (timeNextPulse <= now) {
        this._timerId = null;
      } // endregion
      // region Auto invalidate


      var _autoInvalidateInterval = this._autoInvalidateInterval;

      if (_autoInvalidateInterval != null) {
        var autoInvalidateTime = Math.max((this._timeCalcStart || 0) + _autoInvalidateInterval, (this._timeInvalidateLast || 0) + _autoInvalidateInterval, now);

        if (autoInvalidateTime <= now) {
          this._invalidate();
        } else if (autoInvalidateTime > timeNextPulse) {
          timeNextPulse = autoInvalidateTime;
        }
      } // endregion
      // region Can be calc


      if (!this._canBeCalcEmitted && !this._calcRequested && this._timeInvalidateLast && (this._timeCalcEnd || !this._timeCalcStart)) {
        var canBeCalcTime = this._getNextCalcTime();

        if (canBeCalcTime <= now) {
          this._canBeCalc();

          this._pulse();

          return;
        } else if (canBeCalcTime > timeNextPulse) {
          timeNextPulse = canBeCalcTime;
        }
      } // endregion
      // region Calc


      if (this._calcRequested && (this._timeCalcEnd || !this._timeCalcStart)) {
        var calcTime = this._getNextCalcTime();

        if (calcTime <= now) {
          this._calc();

          return;
        } else if (calcTime > timeNextPulse) {
          timeNextPulse = calcTime;
        }
      } // endregion
      // region Timer


      if (timeNextPulse > now && timeNextPulse !== this._timeNextPulse) {
        var timerId = this._timerId;

        if (timerId != null) {
          _timing.clearTimeout(timerId);
        }

        this._timeNextPulse = timeNextPulse;
        this._timerId = _timing.setTimeout(function () {
          _this2._pulse();
        }, timeNextPulse - now);
      } // endregion

    }
  }, {
    key: "_invalidate",
    value: function _invalidate() {
      var now = this._timing.now();

      if (this._timeInvalidateFirst == null) {
        this._timeInvalidateFirst = now;
      }

      this._timeInvalidateLast = now;
    } // endregion
    // region Public methods

  }, {
    key: "invalidate",
    value: function invalidate() {
      this._invalidate();

      this._pulse();
    }
  }, {
    key: "calc",
    value: function calc() {
      if (!this._calcRequested && this._canBeCalcEmitted) {
        this._calcRequested = true;

        this._pulse();
      }
    }
  }, {
    key: "reCalc",
    value: function reCalc() {
      this._calcRequested = true;

      this._pulse();
    } // endregion

  }, {
    key: "minTimeBetweenCalc",
    get: function get() {
      return this._minTimeBetweenCalc;
    },
    set: function set(value) {
      if (this._minTimeBetweenCalc === value) {
        return;
      }

      this._minTimeBetweenCalc = value;

      this._pulse();
    } // endregion
    // region throttleTime

  }, {
    key: "throttleTime",
    get: function get() {
      return this._throttleTime;
    },
    set: function set(value) {
      if (this._throttleTime === value) {
        return;
      }

      this._throttleTime = value;

      this._pulse();
    } // endregion
    // region maxThrottleTime

  }, {
    key: "maxThrottleTime",
    get: function get() {
      return this._maxThrottleTime;
    },
    set: function set(value) {
      if (this._maxThrottleTime === value) {
        return;
      }

      this._maxThrottleTime = value;

      this._pulse();
    } // endregion
    // region autoInvalidateInterval

  }, {
    key: "autoInvalidateInterval",
    get: function get() {
      return this._autoInvalidateInterval;
    },
    set: function set(value) {
      if (this._autoInvalidateInterval === value) {
        return;
      }

      this._autoInvalidateInterval = value;

      this._pulse();
    }
  }]);

  return DeferredCalc;
}();
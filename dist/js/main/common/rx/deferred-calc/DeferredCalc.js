"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DeferredCalc = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _timing2 = require("./timing");

var DeferredCalc = /*#__PURE__*/function () {
  function DeferredCalc(_ref) {
    var _this = this;

    var shouldInvalidate = _ref.shouldInvalidate,
        canBeCalcCallback = _ref.canBeCalcCallback,
        calcFunc = _ref.calcFunc,
        calcCompletedCallback = _ref.calcCompletedCallback,
        options = _ref.options,
        dontImmediateInvalidate = _ref.dontImmediateInvalidate;
    (0, _classCallCheck2.default)(this, DeferredCalc);
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
    this._timing = this._options.timing || _timing2.timingDefault;

    this._pulseBind = function () {
      _this._pulse();
    };

    if (!dontImmediateInvalidate) {
      this.invalidate();
    }
  } // region Properties
  // region minTimeBetweenCalc


  (0, _createClass2.default)(DeferredCalc, [{
    key: "_calc",
    // endregion
    // endregion
    // region Private methods
    value: function _calc() {
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
  }, {
    key: "done",
    value: function done(v1, v2, v3, v4, v5) {
      this._timeCalcEnd = this._timing.now();

      if (this._calcCompletedCallback != null) {
        this._calcCompletedCallback(v1, v2, v3, v4, v5);
      }

      this._pulse();
    }
  }, {
    key: "_canBeCalc",
    value: function _canBeCalc() {
      this._canBeCalcEmitted = true;

      if (this._canBeCalcCallback != null) {
        this._canBeCalcCallback();
      } else {
        this.calc();
      }
    }
  }, {
    key: "_getNextCalcTime",
    value: function _getNextCalcTime() {
      var _this$_options = this._options,
          throttleTime = _this$_options.throttleTime,
          maxThrottleTime = _this$_options.maxThrottleTime,
          delayBeforeCalc = _this$_options.delayBeforeCalc,
          minTimeBetweenCalc = _this$_options.minTimeBetweenCalc;
      var nextCalcTime = this._timeInvalidateLast + (throttleTime || 0);

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
  }, {
    key: "_pulse",
    value: function _pulse() {
      // region Timer
      var _timing = this._timing;

      var now = _timing.now();

      var timeNextPulse = this._timeNextPulse;

      if (timeNextPulse < 0) {
        timeNextPulse = now;
      } else if (timeNextPulse <= now) {
        this._timerId = -1;
      } // endregion
      // region Can be calc


      if (!this._canBeCalcEmitted && !this._calcRequested && this._timeInvalidateLast !== 0 && (this._timeCalcEnd !== 0 || this._timeCalcStart === 0)) {
        var canBeCalcTime = this._getNextCalcTime();

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
        var calcTime = this._getNextCalcTime();

        if (calcTime <= now) {
          this._calc();

          return;
        } else if (timeNextPulse <= now || calcTime < timeNextPulse) {
          timeNextPulse = calcTime;
        }
      } // endregion
      // region Auto invalidate


      var autoInvalidateInterval = this._options.autoInvalidateInterval;

      if (autoInvalidateInterval && this._timeInvalidateLast === 0 && !(timeNextPulse > now && timeNextPulse !== this._timeNextPulse)) {
        var autoInvalidateTime = Math.max(this._timeCalcStart + autoInvalidateInterval, now);

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
        var timerId = this._timerId;

        if (timerId >= 0) {
          _timing.clearTimeout(timerId);
        }

        this._timeNextPulse = timeNextPulse;
        this._timerId = _timing.setTimeout(this._pulseBind, timeNextPulse - now + 1); // ( + 1) is  fix hung

        return;
      } // endregion

    }
  }, {
    key: "_invalidate",
    value: function _invalidate() {
      var now = this._timing.now();

      if (this._timeInvalidateFirst < 0) {
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
      return this._options.minTimeBetweenCalc;
    },
    set: function set(value) {
      if (this._options.minTimeBetweenCalc === value) {
        return;
      }

      this._options.minTimeBetweenCalc = value;

      this._pulse();
    } // endregion
    // region throttleTime

  }, {
    key: "throttleTime",
    get: function get() {
      return this._options.throttleTime;
    },
    set: function set(value) {
      if (this._options.throttleTime === value) {
        return;
      }

      this._options.throttleTime = value;

      this._pulse();
    } // endregion
    // region maxThrottleTime

  }, {
    key: "maxThrottleTime",
    get: function get() {
      return this._options.maxThrottleTime;
    },
    set: function set(value) {
      if (this._options.maxThrottleTime === value) {
        return;
      }

      this._options.maxThrottleTime = value;

      this._pulse();
    } // endregion
    // region delayBeforeCalc

  }, {
    key: "delayBeforeCalc",
    get: function get() {
      return this._options.delayBeforeCalc;
    },
    set: function set(value) {
      if (this._options.delayBeforeCalc === value) {
        return;
      }

      this._options.delayBeforeCalc = value;

      this._pulse();
    } // endregion
    // region autoInvalidateInterval

  }, {
    key: "autoInvalidateInterval",
    get: function get() {
      return this._options.autoInvalidateInterval;
    },
    set: function set(value) {
      if (this._options.autoInvalidateInterval === value) {
        return;
      }

      this._options.autoInvalidateInterval = value;

      this._pulse();
    }
  }]);
  return DeferredCalc;
}();

exports.DeferredCalc = DeferredCalc;
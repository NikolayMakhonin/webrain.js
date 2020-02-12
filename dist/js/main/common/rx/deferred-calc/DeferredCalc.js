"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DeferredCalc = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _timing2 = require("./timing");

var DeferredCalc =
/*#__PURE__*/
function () {
  function DeferredCalc(canBeCalcCallback, calcFunc, calcCompletedCallback, options) {
    (0, _classCallCheck2.default)(this, DeferredCalc);
    this._canBeCalcCallback = canBeCalcCallback;
    this._calcFunc = calcFunc;
    this._calcCompletedCallback = calcCompletedCallback;
    this._options = options || {};
    this._timing = this._options.timing || _timing2.timingDefault;
    this.invalidate();
  } // region Properties
  // region minTimeBetweenCalc


  (0, _createClass2.default)(DeferredCalc, [{
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

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this._calcCompletedCallback.apply(_this, args);

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
      var _this$_options = this._options,
          throttleTime = _this$_options.throttleTime,
          maxThrottleTime = _this$_options.maxThrottleTime,
          minTimeBetweenCalc = _this$_options.minTimeBetweenCalc;
      var nextCalcTime = this._timeInvalidateLast + (throttleTime || 0);

      if (maxThrottleTime != null) {
        nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (maxThrottleTime || 0));
      }

      if (this._timeCalcEnd) {
        nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (minTimeBetweenCalc || 0));
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


      var autoInvalidateInterval = this._options.autoInvalidateInterval;

      if (autoInvalidateInterval != null) {
        var autoInvalidateTime = Math.max((this._timeCalcStart || 0) + autoInvalidateInterval, (this._timeInvalidateLast || 0) + autoInvalidateInterval, now);

        if (autoInvalidateTime <= now) {
          this._invalidate();
        } else if (timeNextPulse <= now || autoInvalidateTime < timeNextPulse) {
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
        } else if (timeNextPulse <= now || canBeCalcTime < timeNextPulse) {
          timeNextPulse = canBeCalcTime;
        }
      } // endregion
      // region Calc


      if (this._calcRequested && (this._timeCalcEnd || !this._timeCalcStart)) {
        var calcTime = this._getNextCalcTime();

        if (calcTime <= now) {
          this._calc();

          return;
        } else if (timeNextPulse <= now || calcTime < timeNextPulse) {
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
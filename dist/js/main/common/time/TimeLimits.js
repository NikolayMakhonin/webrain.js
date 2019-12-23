"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TimeLimits = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _async = require("../async/async");

var _ThenableSync = require("../async/ThenableSync");

function createSingleCallFunc(func) {
  if (!func) {
    return null;
  }

  var result;
  return function () {
    if (!func) {
      return result;
    }

    result = func();
    func = null;
    return result;
  };
}

var TimeLimits =
/*#__PURE__*/
function () {
  function TimeLimits() {
    (0, _classCallCheck2.default)(this, TimeLimits);

    for (var _len = arguments.length, timeLimits = new Array(_len), _key = 0; _key < _len; _key++) {
      timeLimits[_key] = arguments[_key];
    }

    this.timeLimits = timeLimits;
  }

  (0, _createClass2.default)(TimeLimits, [{
    key: "getWaitTime",
    value: function getWaitTime() {
      var timeLimits = this.timeLimits;
      var len = timeLimits.length;
      var maxTime = 0;

      for (var i = 0; i < len; i++) {
        var waitTime = timeLimits[i].getWaitTime();

        if (waitTime == null) {
          return null;
        }

        if (waitTime > maxTime) {
          maxTime = waitTime;
        }
      }

      return maxTime;
    }
  }, {
    key: "wait",
    value: function wait(complete) {
      var _this = this;

      var waitTime = this.getWaitTime();

      if (waitTime === 0) {
        return complete ? complete() : null;
      }

      var timeLimits = this.getLeafTimeLimits();
      var len = timeLimits.length;
      var waiters = new Array(len);

      for (var i = 0; i < len; i++) {
        waiters[i] = timeLimits[i].wait();
      }

      return (0, _ThenableSync.resolveAsyncAll)(waiters, function () {
        return _this.wait(complete);
      });
    }
  }, {
    key: "run",
    value: function run(func) {
      var _this2 = this;

      return this.wait(function () {
        var timeLimits = _this2.getLeafTimeLimits();

        var len = timeLimits.length;

        if (len === 0) {
          return func && func();
        }

        var singleCallFunc = createSingleCallFunc(func);
        var results;
        var resultsIsAsync = true;

        for (var i = 0; i < len; i++) {
          var _result = timeLimits[i].run(singleCallFunc);

          if (resultsIsAsync) {
            if ((0, _async.isAsync)(_result)) {
              if (!results) {
                results = [];
              }

              results[i] = _result;
            } else {
              results = _result;
              resultsIsAsync = false;
            }
          }
        }

        return resultsIsAsync ? (0, _ThenableSync.resolveAsyncAny)(results) : results;
      });
    }
  }, {
    key: "getLeafTimeLimits",
    value: function getLeafTimeLimits(result) {
      if (result === void 0) {
        result = {};
      }

      var timeLimits = this.timeLimits;
      var len = timeLimits.length;

      for (var i = 0; i < len; i++) {
        var timeLimit = timeLimits[i];

        if (timeLimit.getLeafTimeLimits) {
          timeLimit.getLeafTimeLimits(result);
        } else {
          result[timeLimit.id] = timeLimit;
        }
      }

      return (0, _values.default)(result);
    }
  }, {
    key: "debug",
    get: function get() {
      var _context;

      return (0, _map.default)(_context = this.timeLimits).call(_context, function (o) {
        return o.debug;
      });
    }
  }]);
  return TimeLimits;
}();

exports.TimeLimits = TimeLimits;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TimeLimit = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _ThenableSync = require("../async/ThenableSync");

var _helpers = require("./helpers");

var nextId = 0;

var TimeLimit =
/*#__PURE__*/
function () {
  function TimeLimit(count, time) {
    (0, _classCallCheck2.default)(this, TimeLimit);
    this._history = [];
    this._queue = [];
    this._countActive = 0;
    this.count = count;
    this.time = time;
    this.id = nextId++;
  }

  (0, _createClass2.default)(TimeLimit, [{
    key: "getWaitTime",
    value: function getWaitTime() {
      var now = (0, _helpers.performanceNow)();
      var time = this.time;

      while (this._history.length) {
        if (now - this._history[0] <= time) {
          break;
        }

        this._history.shift();
      }

      if (this._history.length + this._countActive < this.count) {
        return 0;
      }

      return this._history.length ? now - this._history[0] : null;
    }
  }, {
    key: "wait",
    value: function wait(complete) {
      var _this = this;

      if (this._startTime == null) {
        this._startTime = (0, _helpers.performanceNow)();
      }

      var waitTime = this.getWaitTime();

      if (waitTime === 0) {
        var result = complete ? complete() : null;
        this.runQueue();
        return result;
      }

      var waiters = [];
      var queueAction;

      if (this._countActive) {
        waiters.push(new _ThenableSync.ThenableSync(function (resolve) {
          return queueAction = resolve;
        }));

        this._queue.push(queueAction);
      }

      if (waitTime) {
        waiters.push((0, _helpers.delay)(waitTime)); // console.log(`WAIT: ${waitTime}ms; ${new Date(new Date().getTime() + waitTime)}`)
      } // else {
      // 	await delay(0)
      // }


      return (0, _ThenableSync.resolveAsyncAny)(waiters).then(function () {
        var _context;

        var queueIndex = (0, _indexOf.default)(_context = _this._queue).call(_context, queueAction);

        if (queueIndex >= 0) {
          var _context2;

          (0, _splice.default)(_context2 = _this._queue).call(_context2, queueIndex, 1);
        } // if (waiters) {
        // 	new Date().getTime()
        // }


        return _this.wait(complete);
      });
    }
  }, {
    key: "runQueue",
    value: function runQueue() {
      var len = this.count - this._countActive;

      if (len > 0) {
        var _context3;

        var resolve = (0, _splice.default)(_context3 = this._queue).call(_context3, 0, len);
        len = resolve.length;

        for (var i = 0; i < len; i++) {
          resolve[i]();
        }
      } // console.log(countActive + '\t' + len + '\t' + queue.length)

    }
  }, {
    key: "run",
    value: function run(func) {
      var _this2 = this;

      return this.wait(function () {
        // console.log(countActive)
        _this2._countActive++;
        var result;

        try {
          result = func && func();
        } finally {
          var final = function final() {
            _this2._history.push((0, _helpers.performanceNow)());

            _this2._countActive--;

            _this2.runQueue();

            return;
          };

          if (result instanceof _promise.default) {
            result = result.catch(function (err) {
              final();
              throw err;
            }).then(function (o) {
              final();
              return o;
            });
          } else {
            final();
          }
        }

        return result;
      });
    }
  }, {
    key: "debug",
    get: function get() {
      var _context4,
          _this3 = this;

      if (this._startTime == null) {
        this._startTime = (0, _helpers.performanceNow)();
      }

      return {
        now: (0, _helpers.performanceNow)() - this._startTime,
        count: this.count,
        time: this.time,
        history: (0, _map.default)(_context4 = this._history).call(_context4, function (o) {
          return o - _this3._startTime;
        }),
        queue: this._queue.length,
        countActive: this._countActive
      };
    }
  }]);
  return TimeLimit;
}();

exports.TimeLimit = TimeLimit;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.TestTiming = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

function compareHandlers(o1, o2) {
  if (o1.time > o2.time) {
    return 1;
  }

  if (o1.time < o2.time) {
    return -1;
  }

  if (o1.id > o2.id) {
    return 1;
  }

  if (o1.id < o2.id) {
    return -1;
  }

  throw new Error('Duplicate timing handlers');
}

var TestTiming =
/*#__PURE__*/
function () {
  function TestTiming() {
    (0, _classCallCheck2.default)(this, TestTiming);
    this._handlers = [];
    this._now = 1;
    this._nextId = 0;
  }

  (0, _createClass2.default)(TestTiming, [{
    key: "addTime",
    value: function addTime(time) {
      this.setTime(this._now + time);
    }
  }, {
    key: "setTime",
    value: function setTime(time) {
      if (time <= 0) {
        throw new Error("time (".concat(time, " should be > 0)"));
      }

      var _handlers = this._handlers,
          now = this._now;

      while (true) {
        var minHandler = void 0;

        for (var id in _handlers) {
          if (Object.prototype.hasOwnProperty.call(_handlers, id)) {
            var handler = _handlers[id];

            if (handler.time <= time && (!minHandler || compareHandlers(handler, minHandler) < 0)) {
              minHandler = handler;
            }
          }
        }

        if (!minHandler) {
          break;
        }

        delete _handlers[minHandler.id];
        this._now = minHandler.time;
        minHandler.handler();
      }

      this._now = time;
    }
  }, {
    key: "now",
    value: function now() {
      return this._now;
    }
  }, {
    key: "setTimeout",
    value: function setTimeout(handler, timeout) {
      var id = this._nextId++;
      this._handlers[id] = {
        id: id,
        time: this._now + timeout,
        handler: handler
      };
      return id;
    }
  }, {
    key: "clearTimeout",
    value: function clearTimeout(handle) {
      delete this._handlers[handle];
    }
  }]);
  return TestTiming;
}();

exports.TestTiming = TestTiming;
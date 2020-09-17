"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObjectPool = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var ObjectPool = /*#__PURE__*/function () {
  function ObjectPool(maxSize) {
    (0, _classCallCheck2.default)(this, ObjectPool);
    this.size = 0;
    this._stack = [null];
    this.maxSize = maxSize;
  }

  (0, _createClass2.default)(ObjectPool, [{
    key: "get",
    value: function get() {
      // this.usedSize++
      var lastIndex = this.size - 1;

      if (lastIndex >= 0) {
        var obj = this._stack[lastIndex];
        this._stack[lastIndex] = null;
        this.size = lastIndex;

        if (obj === null) {
          throw new Error('obj === null');
        }

        return obj;
      }

      return null;
    }
  }, {
    key: "release",
    value: function release(obj) {
      // this.usedSize--
      if (this.size < this.maxSize) {
        this._stack[this.size] = obj;
        this.size++;
      }
    }
  }]);
  return ObjectPool;
}();

exports.ObjectPool = ObjectPool;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.arrayShuffle = arrayShuffle;
exports.Random = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _imul = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/math/imul"));

var _uuid = require("./uuid");

var _context;

function mulberry32(seed) {
  return function () {
    var t = seed += 0x6D2B79F5;
    t = (0, _imul.default)(t ^ t >>> 15, t | 1);
    t ^= t + (0, _imul.default)(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
/** Usage:
	* 1) arrayShuffle(array, () => Math.random())
	* 2) arrayShuffle(array, () => rnd.next())
	*/


function arrayShuffle(array, rnd) {
  (0, _sort.default)(array).call(array, function () {
    return rnd() > 0.5 ? 1 : -1;
  });
  return array;
}

var randomWithoutSeed = (0, _bind.default)(_context = Math.random).call(_context, Math);
/** Generate random number in range [0..1) like Math.random() or other, but can be pseudorandom with seed */

var Random =
/*#__PURE__*/
function () {
  function Random(seed) {
    (0, _classCallCheck2.default)(this, Random);
    this._rnd = seed ? mulberry32(seed) : randomWithoutSeed;
  }

  (0, _createClass2.default)(Random, [{
    key: "next",
    value: function next() {
      return this._rnd();
    }
  }, {
    key: "nextRange",
    value: function nextRange(from, to) {
      return this._rnd() * (to - from) + from;
    }
  }, {
    key: "nextInt",
    value: function nextInt(from, toExclusive) {
      if (toExclusive == null) {
        toExclusive = from;
        from = 0;
      }

      return Math.floor(this._rnd() * (toExclusive - from) + from);
    }
  }, {
    key: "nextBoolean",
    value: function nextBoolean(trueProbability) {
      if (trueProbability === void 0) {
        trueProbability = 0.5;
      }

      return this._rnd() < trueProbability;
    }
  }, {
    key: "nextBooleanOrNull",
    value: function nextBooleanOrNull(trueWeight, falseWeight, nullWeight) {
      if (trueWeight === void 0) {
        trueWeight = 1;
      }

      if (falseWeight === void 0) {
        falseWeight = 1;
      }

      if (nullWeight === void 0) {
        nullWeight = 1;
      }

      var value = this.next() * (trueWeight + falseWeight + nullWeight);

      if (value < trueWeight) {
        return true;
      }

      if (value < trueWeight + falseWeight) {
        return false;
      }

      return null;
    }
  }, {
    key: "nextTime",
    value: function nextTime(from, toExclusive) {
      if (from instanceof Date) {
        from = from.getTime();
      }

      if (toExclusive instanceof Date) {
        toExclusive = toExclusive.getTime();
      }

      return this.nextInt(from, toExclusive);
    }
  }, {
    key: "nextDate",
    value: function nextDate(from, toExclusive) {
      if (from instanceof Date) {
        from = from.getTime();
      }

      if (toExclusive instanceof Date) {
        toExclusive = toExclusive.getTime();
      }

      return new Date(this.nextInt(from, toExclusive));
    }
  }, {
    key: "pullArrayItem",
    value: function pullArrayItem(array) {
      var len = array.length;
      var index = this.nextInt(len);
      var item = array[index]; // remove item with shift

      for (var i = index + 1; i < len; i++) {
        array[i - 1] = array[i];
      }

      array.length = len - 1;
      return item;
    }
  }, {
    key: "nextArrayItem",
    value: function nextArrayItem(array) {
      return array[this.nextInt(array.length)];
    }
  }, {
    key: "nextArrayItems",
    value: function nextArrayItems(array, minCount, relativeMaxCount) {
      var _this = this;

      arrayShuffle(array, function () {
        return _this.next();
      });
      var result = [];
      var count = this.nextInt(Math.round(array.length * relativeMaxCount));
      return (0, _slice.default)(array).call(array, 0, count);
    }
  }, {
    key: "nextColor",
    value: function nextColor() {
      return '#' + this.nextInt(0x1000000).toString(16);
    }
  }, {
    key: "nextEnum",
    value: function nextEnum(enumType) {
      return this.nextArrayItem((0, _values.default)(enumType));
    }
  }, {
    key: "nextUuid",
    value: function nextUuid() {
      var _this2 = this;

      return (0, _uuid.uuid)(function () {
        return _this2.next();
      });
    }
  }]);
  return Random;
}();

exports.Random = Random;
Random.arrayShuffle = arrayShuffle;
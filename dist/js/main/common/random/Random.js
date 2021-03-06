"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.randomWithoutSeed = randomWithoutSeed;
exports.arrayShuffle = arrayShuffle;
exports.getRandomFunc = getRandomFunc;
exports.Random = void 0;

var _padStart = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/pad-start"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _imul = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/math/imul"));

var _uuid = require("./uuid");

var _enum = require("../helpers/enum");

// from here: https://stackoverflow.com/a/47593316/5221762
function mulberry32(seed) {
  return function _mulberry32() {
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


function randomWithoutSeed() {
  return Math.random();
} // from: https://stackoverflow.com/a/6274398/5221762


function arrayShuffle(array, rnd) {
  if (rnd == null) {
    rnd = randomWithoutSeed;
  }

  var counter = array.length; // While there are elements in the array

  while (counter > 0) {
    // Pick a random index
    var index = rnd() * counter | 0; // Decrease counter by 1

    counter--; // And swap the last element with it

    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function getRandomFunc(seed) {
  return seed != null ? mulberry32(seed) : randomWithoutSeed;
}
/** Generate random number in range [0..1) like Math.random() or other, but can be pseudorandom with seed */


var Random = /*#__PURE__*/function () {
  function Random(seed) {
    (0, _classCallCheck2.default)(this, Random);
    this._rnd = getRandomFunc(seed);
  }

  (0, _createClass2.default)(Random, [{
    key: "nextSeed",
    value: function nextSeed() {
      return this.nextInt(2 << 29);
    }
  }, {
    key: "nextRandom",
    value: function nextRandom() {
      return new Random(this.nextSeed());
    }
  }, {
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
    key: "nextArray",
    value: function nextArray(minCount, maxCount, createItem) {
      var result = [];
      var count = this.nextInt(minCount, maxCount);

      for (var i = 0; i < count; i++) {
        var item = createItem(this);
        result.push(item);
      }

      return result;
    }
  }, {
    key: "nextArrayItem",
    value: function nextArrayItem(array) {
      return array[this.nextInt(array.length)];
    }
  }, {
    key: "nextArrayItems",
    value: function nextArrayItems(array, minCount, maxCount, maxCountIsRelative) {
      if (maxCountIsRelative) {
        maxCount *= array.length;
      }

      var count = this.nextInt(minCount, maxCount);
      var result = [];

      for (var i = 0; i < count; i++) {
        result.push(this.nextArrayItem(array));
      }

      return result;
    }
  }, {
    key: "nextArrayItemsUnique",
    value: function nextArrayItemsUnique(array, minCount, maxCount, maxCountRelative) {
      var _this = this;

      arrayShuffle(array, function () {
        return _this.next();
      });

      if (maxCountRelative) {
        maxCount *= array.length;
      }

      var count = this.nextInt(minCount, maxCount);
      return (0, _slice.default)(array).call(array, 0, count);
    }
  }, {
    key: "nextColor",
    value: function nextColor() {
      var _context;

      return '#' + (0, _padStart.default)(_context = this.nextInt(0x1000000).toString(16)).call(_context, 6, '0');
    }
  }, {
    key: "nextEnum",
    value: function nextEnum(enumType) {
      return this.nextArrayItem((0, _enum.getEnumValues)(enumType));
    }
  }, {
    key: "nextEnums",
    value: function nextEnums(enumType) {
      return this.nextArrayItems((0, _enum.getEnumValues)(enumType), 0, 1, true);
    }
  }, {
    key: "nextEnumFlags",
    value: function nextEnumFlags(enumType) {
      var enums = this.nextArrayItems((0, _enum.getEnumFlags)(enumType), 0, 1, true);
      var flags = 0;

      for (var i = 0, len = enums.length; i < len; i++) {
        flags |= enums[i];
      }

      return flags;
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
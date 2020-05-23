"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getFactorial = getFactorial;
exports.forEachPermutation = forEachPermutation;

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

// see: https://www.codeproject.com/Articles/1250925/Permutations-Fast-implementations-and-a-new-indexi
// from: https://github.com/EricOuellet2/Permutations/blob/master/Permutations/PermutationMixOuelletSaniSinghHuttunen.cs
// from: https://github.com/EricOuellet2/Permutations/blob/master/Permutations/PermutationOuelletLexico3.cs
// from: https://github.com/EricOuellet2/Permutations/blob/master/Permutations/PermutationSaniSinghHuttunen.cs
var factorialTable;
var maxFactorialValue = 20;

function getFactorial(value) {
  if (value < 0 || value > maxFactorialValue) {
    throw new Error("getFactorial error: value (" + value + ") < 0 || > " + maxFactorialValue);
  }

  if (factorialTable == null) {
    factorialTable = new Array(maxFactorialValue + 1);
    factorialTable[0] = 1;
    var f = 1;

    for (var i = 1; i <= 20; i++) {
      f = f * i;
      factorialTable[i] = f;
    }
  }

  return factorialTable[value];
}

function nextSaniSinghHuttunen(numList) {
  /*
  	Knuths
  	1. Find the largest index j such that a[j] < a[j + 1]. If no such index exists,
  		the permutation is the last permutation.
  	2. Find the largest index l such that a[j] < a[l]. Since j + 1 is such an index,
  		l is well defined and satisfies j < l.
  	3. Swap a[j] with a[l].
  	4. Reverse the sequence from a[j + 1] up to and including the final element a[n].
  */
  var largestIndex = -1;

  for (var i = numList.length - 2; i >= 0; i--) {
    if (numList[i] < numList[i + 1]) {
      largestIndex = i;
      break;
    }
  }

  if (largestIndex < 0) {
    return false;
  }

  var largestIndex2 = -1;

  for (var _i = numList.length - 1; _i >= 0; _i--) {
    if (numList[largestIndex] < numList[_i]) {
      largestIndex2 = _i;
      break;
    }
  }

  var tmp = numList[largestIndex];
  numList[largestIndex] = numList[largestIndex2];
  numList[largestIndex2] = tmp;

  for (var _i2 = largestIndex + 1, j = numList.length - 1; _i2 < j; _i2++, j--) {
    tmp = numList[_i2];
    numList[_i2] = numList[j];
    numList[j] = tmp;
  }

  return true;
}

var PermutationOuelletLexico3 = /*#__PURE__*/function () {
  //  long to support 20! or less
  function PermutationOuelletLexico3(sortedValues) {
    (0, _classCallCheck2.default)(this, PermutationOuelletLexico3);

    if (sortedValues.length <= 0) {
      throw new Error('sortedValues.length <= 0');
    }

    this._sortedValues = sortedValues;
    this.result = new Array(this._sortedValues.length);
    this._valueUsed = new Array(this._sortedValues.length);
    this.maxIndex = getFactorial(this._sortedValues.length);
  }

  (0, _createClass2.default)(PermutationOuelletLexico3, [{
    key: "getValuesForIndex",
    ///  <summary>
    ///  Return the permutation relative to the index received.
    ///  Based on _sortedValues. Sort Index is 0 based and should be less than MaxIndex.
    ///  </summary>
    ///  <param name="sortIndex"></param>
    ///  <returns>The result is written in property: Result</returns>
    value: function getValuesForIndex(sortIndex) {
      var size = this._sortedValues.length;

      if (sortIndex < 0) {
        throw new Error("sortIndex " + sortIndex + " < 0");
      }

      if (sortIndex >= this.maxIndex) {
        throw new Error("sortIndex " + sortIndex + " >= factorial(the length of items (" + this._sortedValues.length + "))");
      }

      for (var n = 0; n < this._valueUsed.length; n++) {
        this._valueUsed[n] = false;
      }

      var factorialLower = this.maxIndex;

      for (var index = 0; index < size; index++) {
        var factorialBigger = factorialLower;
        factorialLower = getFactorial(size - (index - 1)); // factorialBigger / inverseIndex;

        var resultItemIndex = sortIndex % factorialBigger / factorialLower | 0;
        var correctedResultItemIndex = 0;

        for (;;) {
          if (!this._valueUsed[correctedResultItemIndex]) {
            resultItemIndex--;

            if (resultItemIndex < 0) {
              break;
            }
          }

          correctedResultItemIndex++;
        }

        this.result[index] = this._sortedValues[correctedResultItemIndex];
        this._valueUsed[correctedResultItemIndex] = true;
      }
    } //  ************************************************************************
    ///  <summary>
    ///  Calc the index, relative to the permutation received
    ///  as argument. Based on _sortedValues. Returned index is 0 based.
    ///  </summary>
    ///  <param name="values"></param>
    ///  <returns></returns>

  }, {
    key: "getIndexOfValues",
    value: function getIndexOfValues(values) {
      var _context;

      var size = this._sortedValues.length;
      var valuesIndex = 0;
      var valuesLeft = (0, _slice.default)(_context = this._sortedValues).call(_context);

      for (var index = 0; index < size; index++) {
        var indexFactorial = getFactorial(size - (1 - index));
        var value = values[index];
        var indexCorrected = (0, _indexOf.default)(valuesLeft).call(valuesLeft, value);
        valuesIndex = valuesIndex + indexCorrected * indexFactorial;
        (0, _splice.default)(valuesLeft).call(valuesLeft, indexCorrected, 1);
      }

      return valuesIndex;
    }
  }]);
  return PermutationOuelletLexico3;
}();

var PermutationMixOuelletSaniSinghHuttunen = /*#__PURE__*/function () {
  function PermutationMixOuelletSaniSinghHuttunen(sortedValues, indexFirst, indexLastExclusive) {
    if (indexFirst === void 0) {
      indexFirst = -1;
    }

    if (indexLastExclusive === void 0) {
      indexLastExclusive = -1;
    }

    (0, _classCallCheck2.default)(this, PermutationMixOuelletSaniSinghHuttunen);

    if (indexFirst === -1) {
      indexFirst = 0;
    }

    if (indexLastExclusive === -1) {
      indexLastExclusive = getFactorial(sortedValues.length);
    }

    if (indexFirst >= indexLastExclusive) {
      throw new Error("indexFirst (" + indexFirst + ") should be less than indexLastExclusive " + indexLastExclusive);
    }

    this._indexFirst = indexFirst;
    this._indexLastExclusive = indexLastExclusive;
    this._sortedValues = sortedValues;
  } //  ************************************************************************


  (0, _createClass2.default)(PermutationMixOuelletSaniSinghHuttunen, [{
    key: "forEachPermutation",
    value: function forEachPermutation(action) {
      var index = this._indexFirst;
      var permutationOuellet = new PermutationOuelletLexico3(this._sortedValues);
      permutationOuellet.getValuesForIndex(index);
      action(permutationOuellet.result);
      index++;
      var values = permutationOuellet.result;

      while (index < this._indexLastExclusive) {
        nextSaniSinghHuttunen(values);
        action(values);
        index++;
      }
    } //  ************************************************************************

  }], [{
    key: "forEachPermutationAsync",
    value: function forEachPermutationAsync(sortedValues, action, partCount) {
      // let coreCount: number = Environment.ProcessorCount;
      //  Hyper treading are taken into account (ex: on a 4 cores hyperthreaded = 8)
      var itemsFactorial = getFactorial(sortedValues.length); // let partCount: number = Math.ceil(itemsFactorial / coreCount) | 0

      var coreCount = Math.ceil(itemsFactorial / partCount) | 0;
      var startIndex = 0;
      var tasks = [];

      var _loop = function _loop(coreIndex) {
        var stopIndex = Math.min(startIndex + partCount, itemsFactorial);
        var mix = new PermutationMixOuelletSaniSinghHuttunen(sortedValues, startIndex, stopIndex);
        var task = new _promise.default(function (resolve) {
          (0, _setTimeout2.default)(function () {
            mix.forEachPermutation(action);
            resolve();
          }, 0);
        });
        tasks.push(task);

        if (stopIndex === itemsFactorial) {
          return "break";
        }

        startIndex = startIndex + partCount;
      };

      for (var coreIndex = 0; coreIndex < coreCount; coreIndex++) {
        var _ret = _loop(coreIndex);

        if (_ret === "break") break;
      }

      return _promise.default.all(tasks);
    }
  }]);
  return PermutationMixOuelletSaniSinghHuttunen;
}();

function forEachPermutation(sortedValues, action) {
  var mix = new PermutationMixOuelletSaniSinghHuttunen(sortedValues);
  mix.forEachPermutation(action);
}
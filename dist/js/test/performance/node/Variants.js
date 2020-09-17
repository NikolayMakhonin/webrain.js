"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _rdtsc = require("rdtsc");

var _calc = require("../../../main/common/test/calc");

var _calcMemAllocate = require("../../../main/common/test/calc-mem-allocate");

var _Mocha = require("../../../main/common/test/Mocha");

var _Variants = require("../../../main/common/test/Variants");

function _createForOfIteratorHelperLoose(o) { var _context2; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context2 = i.next).call(_context2, i); }

function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _Mocha.describe)('common > performance > Variants', function () {
  this.timeout(300000);
  var tree = [1, [2, 3], [4, 5, [6, 7]]];

  function iterateIterables(iterables) {
    for (var _iterator = _createForOfIteratorHelperLoose(iterables), _step; !(_step = _iterator()).done;) {
      var iterable = _step.value;

      for (var _iterator2 = _createForOfIteratorHelperLoose(iterable), _step2; !(_step2 = _iterator2()).done;) {
        var item = _step2.value;
      }
    }
  }

  (0, _Mocha.it)('mem', function () {
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 10000, function () {
      iterateIterables((0, _Variants.treeToSequenceVariants)(tree));
    }).toString());
  });
  (0, _Mocha.it)('perf', function () {
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      return iterateIterables((0, _Variants.treeToSequenceVariants)(tree));
    });
    console.log(result);
  });
});
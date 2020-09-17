"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.expandArray = expandArray;
exports.TestVariants = exports.THIS = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _marked = /*#__PURE__*/_regenerator.default.mark(generateOptions);

function _createForOfIteratorHelperLoose(o) { var _context3; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context3 = i.next).call(_context3, i); }

function _unsupportedIterableToArray(o, minLen) { var _context2; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context2 = Object.prototype.toString.call(o)).call(_context2, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function expandArray(array, output) {
  if (output === void 0) {
    output = [];
  }

  for (var _iterator = _createForOfIteratorHelperLoose(array), _step; !(_step = _iterator()).done;) {
    var item = _step.value;

    if (!item) {
      continue;
    }

    if ((0, _isArray.default)(item)) {
      expandArray(item, output);
    } else {
      output.push(item);
    }
  }

  return output;
}

var THIS = {};
exports.THIS = THIS;

// tslint:disable-next-line:no-shadowed-variable no-empty
var NONE = function NONE() {};

function generateOptions(base, optionsVariants, exclude) {
  var hasChilds, _key, _iterator2, _step2, _extends2, optionVariant, _variant, newOptionsVariants;

  return _regenerator.default.wrap(function generateOptions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, optionsVariants);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 17;
            break;
          }

          _key = _context.t1.value;

          if (!optionsVariants[_key]) {
            _context.next = 15;
            break;
          }

          _iterator2 = _createForOfIteratorHelperLoose(optionsVariants[_key]);

        case 5:
          if ((_step2 = _iterator2()).done) {
            _context.next = 14;
            break;
          }

          optionVariant = _step2.value;
          _variant = (0, _extends3.default)((0, _extends3.default)({}, base), {}, (_extends2 = {}, _extends2[_key] = optionVariant, _extends2));
          newOptionsVariants = (0, _extends3.default)({}, optionsVariants);
          newOptionsVariants[_key] = null;
          hasChilds = true;
          return _context.delegateYield(generateOptions(_variant, newOptionsVariants, exclude), "t2", 12);

        case 12:
          _context.next = 5;
          break;

        case 14:
          return _context.abrupt("break", 17);

        case 15:
          _context.next = 1;
          break;

        case 17:
          if (!(!hasChilds && (!exclude || !exclude(base)))) {
            _context.next = 20;
            break;
          }

          _context.next = 20;
          return base;

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
} // region Test Actions


var TestVariants = /*#__PURE__*/function () {
  function TestVariants() {
    (0, _classCallCheck2.default)(this, TestVariants);
  }

  (0, _createClass2.default)(TestVariants, [{
    key: "test",
    value: function test(testCases) {
      var optionsVariants = (0, _extends3.default)((0, _extends3.default)({}, this.baseOptionsVariants), testCases);
      var expected = testCases.expected;
      var exclude = testCases.exclude;
      delete optionsVariants.expected;
      delete optionsVariants.exclude;
      var actionsWithDescriptions = expandArray(optionsVariants.actions);
      delete optionsVariants.actions; // tslint:disable-next-line:prefer-const

      var variants = generateOptions({}, optionsVariants, exclude); // variants = Array.from(variants)

      for (var _iterator3 = _createForOfIteratorHelperLoose(actionsWithDescriptions), _step3; !(_step3 = _iterator3()).done;) {
        var actionsWithDescription = _step3.value;
        var actions = actionsWithDescription.actions,
            description = actionsWithDescription.description;

        if (typeof actionsWithDescription === 'function') {
          actions = [actionsWithDescription];
          description = '';
        }

        for (var _iterator4 = _createForOfIteratorHelperLoose(expandArray(actions)), _step4; !(_step4 = _iterator4()).done;) {
          var action = _step4.value;

          for (var _iterator5 = _createForOfIteratorHelperLoose(variants), _step5; !(_step5 = _iterator5()).done;) {
            var _variant2 = _step5.value;
            this.testVariant((0, _extends3.default)((0, _extends3.default)({}, _variant2), {}, {
              action: action,
              description: description,
              expected: expected
            }));
          }
        }
      }
    }
  }]);
  return TestVariants;
}();

exports.TestVariants = TestVariants;
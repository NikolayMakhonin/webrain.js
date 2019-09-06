"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.expandArray = expandArray;
exports.TestVariants = exports.THIS = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray6 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _marked =
/*#__PURE__*/
_regenerator.default.mark(generateOptions);

function expandArray(array, output) {
  if (output === void 0) {
    output = [];
  }

  for (var _iterator = array, _isArray = (0, _isArray6.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var item = _ref;

    if (!item) {
      continue;
    }

    if ((0, _isArray6.default)(item)) {
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
  var hasChilds, _key, _iterator2, _isArray2, _i2, _extends2, _ref2, optionVariant, _variant, newOptionsVariants;

  return _regenerator.default.wrap(function generateOptions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, optionsVariants);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 26;
            break;
          }

          _key = _context.t1.value;

          if (!optionsVariants[_key]) {
            _context.next = 24;
            break;
          }

          _iterator2 = optionsVariants[_key], _isArray2 = (0, _isArray6.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);

        case 5:
          if (!_isArray2) {
            _context.next = 11;
            break;
          }

          if (!(_i2 >= _iterator2.length)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("break", 23);

        case 8:
          _ref2 = _iterator2[_i2++];
          _context.next = 15;
          break;

        case 11:
          _i2 = _iterator2.next();

          if (!_i2.done) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("break", 23);

        case 14:
          _ref2 = _i2.value;

        case 15:
          optionVariant = _ref2;
          _variant = (0, _extends3.default)({}, base, (_extends2 = {}, _extends2[_key] = optionVariant, _extends2));
          newOptionsVariants = (0, _extends3.default)({}, optionsVariants);
          newOptionsVariants[_key] = null;
          hasChilds = true;
          return _context.delegateYield(generateOptions(_variant, newOptionsVariants, exclude), "t2", 21);

        case 21:
          _context.next = 5;
          break;

        case 23:
          return _context.abrupt("break", 26);

        case 24:
          _context.next = 1;
          break;

        case 26:
          if (!(!hasChilds && (!exclude || !exclude(base)))) {
            _context.next = 29;
            break;
          }

          _context.next = 29;
          return base;

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
} // region Test Actions


var TestVariants =
/*#__PURE__*/
function () {
  function TestVariants() {
    (0, _classCallCheck2.default)(this, TestVariants);
  }

  (0, _createClass2.default)(TestVariants, [{
    key: "test",
    value: function test(testCases) {
      var optionsVariants = (0, _extends3.default)({}, this.baseOptionsVariants, {}, testCases);
      var expected = testCases.expected;
      var exclude = testCases.exclude;
      delete optionsVariants.expected;
      delete optionsVariants.exclude;
      var actionsWithDescriptions = expandArray(optionsVariants.actions);
      delete optionsVariants.actions; // tslint:disable-next-line:prefer-const

      var variants = generateOptions({}, optionsVariants, exclude); // variants = Array.from(variants)

      for (var _iterator3 = actionsWithDescriptions, _isArray3 = (0, _isArray6.default)(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);;) {
        var _ref3;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref3 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref3 = _i3.value;
        }

        var actionsWithDescription = _ref3;
        var actions = actionsWithDescription.actions,
            description = actionsWithDescription.description;

        if (typeof actionsWithDescription === 'function') {
          actions = [actionsWithDescription];
          description = '';
        }

        for (var _iterator4 = expandArray(actions), _isArray4 = (0, _isArray6.default)(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator2.default)(_iterator4);;) {
          var _ref4;

          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            _ref4 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            _ref4 = _i4.value;
          }

          var action = _ref4;

          for (var _iterator5 = variants, _isArray5 = (0, _isArray6.default)(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator2.default)(_iterator5);;) {
            var _ref5;

            if (_isArray5) {
              if (_i5 >= _iterator5.length) break;
              _ref5 = _iterator5[_i5++];
            } else {
              _i5 = _iterator5.next();
              if (_i5.done) break;
              _ref5 = _i5.value;
            }

            var _variant2 = _ref5;
            this.testVariant((0, _extends3.default)({}, _variant2, {
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
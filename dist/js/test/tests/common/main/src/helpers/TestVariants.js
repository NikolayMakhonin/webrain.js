"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.expandArray = expandArray;
exports.TestVariants = exports.THIS = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _defineProperties = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-properties"));

var _getOwnPropertyDescriptors = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _getOwnPropertySymbols = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _marked =
/*#__PURE__*/
_regenerator.default.mark(generateOptions);

function ownKeys(object, enumerableOnly) { var keys = (0, _keys.default)(object); if (_getOwnPropertySymbols.default) { var symbols = (0, _getOwnPropertySymbols.default)(object); if (enumerableOnly) symbols = (0, _filter.default)(symbols).call(symbols, function (sym) { return (0, _getOwnPropertyDescriptor.default)(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { var _context2; (0, _forEach.default)(_context2 = ownKeys(source, true)).call(_context2, function (key) { (0, _defineProperty3.default)(target, key, source[key]); }); } else if (_getOwnPropertyDescriptors.default) { (0, _defineProperties.default)(target, (0, _getOwnPropertyDescriptors.default)(source)); } else { var _context3; (0, _forEach.default)(_context3 = ownKeys(source)).call(_context3, function (key) { (0, _defineProperty2.default)(target, key, (0, _getOwnPropertyDescriptor.default)(source, key)); }); } } return target; }

function expandArray(array) {
  var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator2.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return output;
}

var THIS = {};
exports.THIS = THIS;

// tslint:disable-next-line:no-shadowed-variable no-empty
var NONE = function NONE() {};

function generateOptions(base, optionsVariants, exclude) {
  var hasChilds, _key, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, optionVariant, _variant, newOptionsVariants;

  return _regenerator.default.wrap(function generateOptions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, optionsVariants);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 36;
            break;
          }

          _key = _context.t1.value;

          if (!optionsVariants[_key]) {
            _context.next = 34;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 7;
          _iterator2 = (0, _getIterator2.default)(optionsVariants[_key]);

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 19;
            break;
          }

          optionVariant = _step2.value;
          _variant = _objectSpread({}, base, (0, _defineProperty3.default)({}, _key, optionVariant));
          newOptionsVariants = _objectSpread({}, optionsVariants);
          newOptionsVariants[_key] = null;
          hasChilds = true;
          return _context.delegateYield(generateOptions(_variant, newOptionsVariants, exclude), "t2", 16);

        case 16:
          _iteratorNormalCompletion2 = true;
          _context.next = 9;
          break;

        case 19:
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t3 = _context["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t3;

        case 25:
          _context.prev = 25;
          _context.prev = 26;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 28:
          _context.prev = 28;

          if (!_didIteratorError2) {
            _context.next = 31;
            break;
          }

          throw _iteratorError2;

        case 31:
          return _context.finish(28);

        case 32:
          return _context.finish(25);

        case 33:
          return _context.abrupt("break", 36);

        case 34:
          _context.next = 1;
          break;

        case 36:
          if (!(!hasChilds && (!exclude || !exclude(base)))) {
            _context.next = 39;
            break;
          }

          _context.next = 39;
          return base;

        case 39:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[7, 21, 25, 33], [26,, 28, 32]]);
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
      var optionsVariants = _objectSpread({}, this.baseOptionsVariants, {}, testCases);

      var expected = testCases.expected;
      var exclude = testCases.exclude;
      delete optionsVariants.expected;
      delete optionsVariants.exclude;
      var actionsWithDescriptions = expandArray(optionsVariants.actions);
      delete optionsVariants.actions; // tslint:disable-next-line:prefer-const

      var variants = generateOptions({}, optionsVariants, exclude); // variants = Array.from(variants)

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator2.default)(actionsWithDescriptions), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var actionsWithDescription = _step3.value;
          var actions = actionsWithDescription.actions,
              description = actionsWithDescription.description;

          if (typeof actionsWithDescription === 'function') {
            actions = [actionsWithDescription];
            description = '';
          }

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = (0, _getIterator2.default)(expandArray(actions)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var action = _step4.value;
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = (0, _getIterator2.default)(variants), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var _variant2 = _step5.value;
                  this.testVariant(_objectSpread({}, _variant2, {
                    action: action,
                    description: description,
                    expected: expected
                  }));
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                    _iterator5.return();
                  }
                } finally {
                  if (_didIteratorError5) {
                    throw _iteratorError5;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);
  return TestVariants;
}();

exports.TestVariants = TestVariants;
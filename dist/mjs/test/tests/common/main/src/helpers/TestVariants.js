import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(generateOptions);

export function expandArray(array) {
  var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (!item) {
        continue;
      }

      if (Array.isArray(item)) {
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
export var THIS = {};

function generateOptions(base, optionsVariants, exclude) {
  var hasChilds, _key, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, optionVariant, _variant, newOptionsVariants;

  return _regeneratorRuntime.wrap(function generateOptions$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.t0 = _regeneratorRuntime.keys(optionsVariants);

        case 1:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 36;
            break;
          }

          _key = _context.t1.value;

          if (!Object.prototype.hasOwnProperty.call(optionsVariants, _key)) {
            _context.next = 34;
            break;
          }

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 7;
          _iterator2 = optionsVariants[_key][Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 19;
            break;
          }

          optionVariant = _step2.value;
          _variant = _objectSpread({}, base, _defineProperty({}, _key, optionVariant));
          newOptionsVariants = _objectSpread({}, optionsVariants);
          delete newOptionsVariants[_key];
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


export var TestVariants =
/*#__PURE__*/
function () {
  function TestVariants() {
    _classCallCheck(this, TestVariants);
  }

  _createClass(TestVariants, [{
    key: "test",
    value: function test(testCases) {
      var optionsVariants = _objectSpread({}, this.baseOptionsVariants, testCases);

      var expected = testCases.expected;
      var exclude = testCases.exclude;
      delete optionsVariants.expected;
      delete optionsVariants.exclude;
      var actionsWithDescriptions = expandArray(optionsVariants.actions);
      delete optionsVariants.actions;
      var variants = generateOptions({}, optionsVariants, exclude); // variants = Array.from(variants)

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = actionsWithDescriptions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
            for (var _iterator4 = expandArray(actions)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var action = _step4.value;
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = variants[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
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
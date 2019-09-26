"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.treeToSequenceVariants = treeToSequenceVariants;
exports.iterablesToArrays = iterablesToArrays;
exports.TreeToSequenceVariants = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _iterator3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var arrayEmpty = [];

var NextVariantItem =
/*#__PURE__*/
function () {
  function NextVariantItem(baseVariant, nextItem) {
    (0, _classCallCheck2.default)(this, NextVariantItem);
    this.baseVariant = baseVariant;
    this.nextItem = nextItem;
  }

  (0, _createClass2.default)(NextVariantItem, [{
    key: _iterator3.default,
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function value() {
      return _regenerator.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield(this.baseVariant, "t0", 1);

            case 1:
              _context.next = 3;
              return this.nextItem;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
  }]);
  return NextVariantItem;
}();

var NextVariantItems =
/*#__PURE__*/
function () {
  function NextVariantItems(baseVariant, nextItems) {
    (0, _classCallCheck2.default)(this, NextVariantItems);
    this.baseVariant = baseVariant;
    this.nextItems = nextItems;
  }

  (0, _createClass2.default)(NextVariantItems, [{
    key: _iterator3.default,
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function value() {
      return _regenerator.default.wrap(function value$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.delegateYield(this.baseVariant, "t0", 1);

            case 1:
              return _context2.delegateYield(this.nextItems, "t1", 2);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, value, this);
    })
  }]);
  return NextVariantItems;
}();

var TreeToSequenceVariants =
/*#__PURE__*/
function () {
  function TreeToSequenceVariants(tree, startIndex, variant) {
    if (startIndex === void 0) {
      startIndex = 0;
    }

    if (variant === void 0) {
      variant = arrayEmpty;
    }

    (0, _classCallCheck2.default)(this, TreeToSequenceVariants);
    this.tree = tree;
    this.startIndex = startIndex;
    this.variant = variant;
  }

  (0, _createClass2.default)(TreeToSequenceVariants, [{
    key: _iterator3.default,
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function value() {
      var variant, subTree, _iterator, _isArray, _i, _ref, subSequenceTree, subSequenceVariants, _iterator2, _isArray2, _i2, _ref2, subSequenceVariant;

      return _regenerator.default.wrap(function value$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(this.startIndex >= this.tree.length)) {
                _context3.next = 4;
                break;
              }

              _context3.next = 3;
              return this.variant;

            case 3:
              return _context3.abrupt("return");

            case 4:
              variant = this.variant;
              subTree = this.tree[this.startIndex];

              if (!(0, _isArray3.default)(subTree)) {
                _context3.next = 43;
                break;
              }

              _iterator = subTree, _isArray = (0, _isArray3.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);

            case 8:
              if (!_isArray) {
                _context3.next = 14;
                break;
              }

              if (!(_i >= _iterator.length)) {
                _context3.next = 11;
                break;
              }

              return _context3.abrupt("break", 41);

            case 11:
              _ref = _iterator[_i++];
              _context3.next = 18;
              break;

            case 14:
              _i = _iterator.next();

              if (!_i.done) {
                _context3.next = 17;
                break;
              }

              return _context3.abrupt("break", 41);

            case 17:
              _ref = _i.value;

            case 18:
              subSequenceTree = _ref;

              if (!(0, _isArray3.default)(subSequenceTree)) {
                _context3.next = 38;
                break;
              }

              subSequenceVariants = treeToSequenceVariants(subSequenceTree);
              _iterator2 = subSequenceVariants, _isArray2 = (0, _isArray3.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);

            case 22:
              if (!_isArray2) {
                _context3.next = 28;
                break;
              }

              if (!(_i2 >= _iterator2.length)) {
                _context3.next = 25;
                break;
              }

              return _context3.abrupt("break", 36);

            case 25:
              _ref2 = _iterator2[_i2++];
              _context3.next = 32;
              break;

            case 28:
              _i2 = _iterator2.next();

              if (!_i2.done) {
                _context3.next = 31;
                break;
              }

              return _context3.abrupt("break", 36);

            case 31:
              _ref2 = _i2.value;

            case 32:
              subSequenceVariant = _ref2;
              return _context3.delegateYield(treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItems(variant, subSequenceVariant)), "t0", 34);

            case 34:
              _context3.next = 22;
              break;

            case 36:
              _context3.next = 39;
              break;

            case 38:
              return _context3.delegateYield(treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItem(variant, subSequenceTree)), "t1", 39);

            case 39:
              _context3.next = 8;
              break;

            case 41:
              _context3.next = 44;
              break;

            case 43:
              return _context3.delegateYield(treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItem(variant, subTree)), "t2", 44);

            case 44:
            case "end":
              return _context3.stop();
          }
        }
      }, value, this);
    })
  }]);
  return TreeToSequenceVariants;
}();

exports.TreeToSequenceVariants = TreeToSequenceVariants;

function treeToSequenceVariants(tree, startIndex, variant) {
  if (startIndex === void 0) {
    startIndex = 0;
  }

  if (variant === void 0) {
    variant = arrayEmpty;
  }

  return new TreeToSequenceVariants(tree, startIndex, variant);
}

function iterablesToArrays(iterables) {
  var iterablesArray = (0, _from.default)(iterables);
  var arrays = (0, _map.default)(iterablesArray).call(iterablesArray, function (iterable) {
    return (0, _from.default)(iterable);
  });
  return arrays;
}
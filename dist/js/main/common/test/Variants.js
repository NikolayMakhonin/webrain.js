"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.treeToSequenceVariants = treeToSequenceVariants;
exports.iterablesToArrays = iterablesToArrays;
exports.TreeToSequenceVariants = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _iterator3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

function _createForOfIteratorHelperLoose(o) { var _context5; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context5 = i.next).call(_context5, i); }

function _unsupportedIterableToArray(o, minLen) { var _context4; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context4 = Object.prototype.toString.call(o)).call(_context4, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var arrayEmpty = [];

var NextVariantItem = /*#__PURE__*/function () {
  function NextVariantItem(baseVariant, nextItem) {
    (0, _classCallCheck2.default)(this, NextVariantItem);
    this.baseVariant = baseVariant;
    this.nextItem = nextItem;
  }

  (0, _createClass2.default)(NextVariantItem, [{
    key: _iterator3.default,
    value: /*#__PURE__*/_regenerator.default.mark(function value() {
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

var NextVariantItems = /*#__PURE__*/function () {
  function NextVariantItems(baseVariant, nextItems) {
    (0, _classCallCheck2.default)(this, NextVariantItems);
    this.baseVariant = baseVariant;
    this.nextItems = nextItems;
  }

  (0, _createClass2.default)(NextVariantItems, [{
    key: _iterator3.default,
    value: /*#__PURE__*/_regenerator.default.mark(function value() {
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

var TreeToSequenceVariants = /*#__PURE__*/function () {
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
    value: /*#__PURE__*/_regenerator.default.mark(function value() {
      var variant, subTree, _iterator, _step, subSequenceTree, subSequenceVariants, _iterator2, _step2, subSequenceVariant;

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

              if (!(0, _isArray.default)(subTree)) {
                _context3.next = 25;
                break;
              }

              _iterator = _createForOfIteratorHelperLoose(subTree);

            case 8:
              if ((_step = _iterator()).done) {
                _context3.next = 23;
                break;
              }

              subSequenceTree = _step.value;

              if (!(0, _isArray.default)(subSequenceTree)) {
                _context3.next = 20;
                break;
              }

              subSequenceVariants = treeToSequenceVariants(subSequenceTree);
              _iterator2 = _createForOfIteratorHelperLoose(subSequenceVariants);

            case 13:
              if ((_step2 = _iterator2()).done) {
                _context3.next = 18;
                break;
              }

              subSequenceVariant = _step2.value;
              return _context3.delegateYield(treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItems(variant, subSequenceVariant)), "t0", 16);

            case 16:
              _context3.next = 13;
              break;

            case 18:
              _context3.next = 21;
              break;

            case 20:
              return _context3.delegateYield(treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItem(variant, subSequenceTree)), "t1", 21);

            case 21:
              _context3.next = 8;
              break;

            case 23:
              _context3.next = 26;
              break;

            case 25:
              return _context3.delegateYield(treeToSequenceVariants(this.tree, this.startIndex + 1, new NextVariantItem(variant, subTree)), "t2", 26);

            case 26:
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
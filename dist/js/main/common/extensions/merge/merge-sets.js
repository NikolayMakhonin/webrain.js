"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createMergeSetWrapper = createMergeSetWrapper;
exports.MergeSetWrapper = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../../helpers/helpers");

var _mergeMaps = require("./merge-maps");

function _createForOfIteratorHelperLoose(o) { var _context2; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context2 = i.next).call(_context2, i); }

function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var MergeSetWrapper = /*#__PURE__*/function () {
  function MergeSetWrapper(set) {
    (0, _classCallCheck2.default)(this, MergeSetWrapper);
    this._set = set;
  }

  (0, _createClass2.default)(MergeSetWrapper, [{
    key: "delete",
    value: function _delete(key) {
      this._set.delete(key);
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      for (var _iterator = _createForOfIteratorHelperLoose(this._set), _step; !(_step = _iterator()).done;) {
        var _key = _step.value;
        callbackfn(_key);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return key;
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._set.has(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._set.add(value);
    }
  }]);
  return MergeSetWrapper;
}();

exports.MergeSetWrapper = MergeSetWrapper;

function createMergeSetWrapper(target, source, arrayOrIterableToSet) {
  if (source[_toStringTag.default] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && ((0, _isArray.default)(source) || (0, _helpers.isIterable)(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new _mergeMaps.MergeObjectWrapper(source, true);
  }

  throw new Error(target.constructor.name + " cannot be merge with " + source.constructor.name);
}
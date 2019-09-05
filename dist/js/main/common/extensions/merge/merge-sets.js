"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.createMergeSetWrapper = createMergeSetWrapper;
exports.MergeSetWrapper = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../../helpers/helpers");

var _mergeMaps = require("./merge-maps");

var MergeSetWrapper =
/*#__PURE__*/
function () {
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(this._set), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _key = _step.value;
          callbackfn(_key);
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
  var _context;

  if (source[_toStringTag.default] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && ((0, _isArray.default)(source) || (0, _helpers.isIterable)(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new _mergeMaps.MergeObjectWrapper(source, true);
  }

  throw new Error((0, _concat.default)(_context = "".concat(target.constructor.name, " cannot be merge with ")).call(_context, source.constructor.name));
}
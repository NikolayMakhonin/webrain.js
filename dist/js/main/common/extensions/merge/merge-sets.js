"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createMergeSetWrapper = createMergeSetWrapper;
exports.MergeSetWrapper = void 0;

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../helpers/helpers");

var _mergeMaps = require("./merge-maps");

var MergeSetWrapper =
/*#__PURE__*/
function () {
  function MergeSetWrapper(set) {
    this._set = set;
  }

  var _proto = MergeSetWrapper.prototype;

  _proto.delete = function _delete(key) {
    this._set.delete(key);
  };

  _proto.forEachKeys = function forEachKeys(callbackfn) {
    for (var _iterator = this._set, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _key = _ref;
      callbackfn(_key);
    }
  };

  _proto.get = function get(key) {
    return key;
  };

  _proto.has = function has(key) {
    return this._set.has(key);
  };

  _proto.set = function set(key, value) {
    this._set.add(value);
  };

  return MergeSetWrapper;
}();

exports.MergeSetWrapper = MergeSetWrapper;

function createMergeSetWrapper(target, source, arrayOrIterableToSet) {
  if (source[_toStringTag.default] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && ((0, _isArray2.default)(source) || (0, _helpers.isIterable)(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new _mergeMaps.MergeObjectWrapper(source, true);
  }

  throw new Error(target.constructor.name + " cannot be merge with " + source.constructor.name);
}
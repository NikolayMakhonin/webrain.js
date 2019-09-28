"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObservableObject = void 0;

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _mergeMaps = require("../../extensions/merge/merge-maps");

var _mergers = require("../../extensions/merge/mergers");

var _serializers = require("../../extensions/serialization/serializers");

require("../extensions/autoConnect");

var _ObservableClass2 = require("./ObservableClass");

var ObservableObject =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(ObservableObject, _ObservableClass);

  function ObservableObject() {
    (0, _classCallCheck2.default)(this, ObservableObject);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ObservableObject).apply(this, arguments));
  }

  return ObservableObject;
}(_ObservableClass2.ObservableClass);

exports.ObservableObject = ObservableObject;
(0, _mergers.registerMerger)(ObservableObject, {
  merger: {
    canMerge: function canMerge(target, source) {
      return source instanceof Object;
    },
    merge: function merge(_merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return new _mergeMaps.MergeObjectWrapper(source);
      }, _merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  },
  preferClone: function preferClone(o) {
    return (0, _isFrozen.default)(o) ? true : null;
  }
});
(0, _serializers.registerSerializer)(ObservableObject, {
  uuid: '1380d053394748e58406c1c0e62a2be9',
  serializer: {
    serialize: function serialize(_serialize, value, options) {
      return (0, _serializers.serializeObject)(_serialize, value, options);
    },
    deSerialize: function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var value = valueFactory();
      return (0, _serializers.deSerializeObject)(_deSerialize, serializedValue, value);
    }
  },
  valueFactory: function valueFactory() {
    return new ObservableObject();
  }
});
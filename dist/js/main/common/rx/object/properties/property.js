"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Property = void 0;

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _mergers = require("../../../extensions/merge/mergers");

var _serializers = require("../../../extensions/serialization/serializers");

var _ObservableObject2 = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _Symbol$toStringTag;

_Symbol$toStringTag = _toStringTag.default;

var Property =
/*#__PURE__*/
function (_ObservableObject) {
  (0, _inheritsLoose2.default)(Property, _ObservableObject);

  function Property(options, initValue) {
    var _this;

    _this = _ObservableObject.call(this) || this;
    _this[_Symbol$toStringTag] = 'Property';

    var _ref = options || {},
        merger = _ref.merger,
        mergeOptions = _ref.mergeOptions;

    if (merger != null) {
      _this.merger = merger;
    }

    if (mergeOptions != null) {
      _this.mergeOptions = mergeOptions;
    }

    if (typeof initValue !== 'undefined') {
      _this.value = initValue;
    }

    return _this;
  }

  var _proto = Property.prototype;

  // region set / fill / merge
  _proto.set = function set(value, clone, options) {
    var result = this.mergeValue(void 0, value, value, clone, clone, options);

    if (!result) {
      this.value = void 0;
    }

    return result;
  };

  _proto.fill = function fill(value, preferClone, options) {
    return this.mergeValue(this.value, value, value, preferClone, preferClone, options);
  };

  _proto.merge = function merge(older, newer, preferCloneOlder, preferCloneNewer, options) {
    return this.mergeValue(this.value, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region merge helpers
  ;

  _proto.mergeValue = function mergeValue(base, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return this._mergeValue((this.merger || _mergers.ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
  };

  _proto._mergeValue = function _mergeValue(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
    var _this2 = this;

    if (older instanceof Property) {
      older = older.value;
    } else {
      options = (0, _extends2.default)({}, options, {
        selfAsValueOlder: true
      });
    }

    if (newer instanceof Property) {
      newer = newer.value;
    } else {
      if (!options) {
        options = {};
      }

      options.selfAsValueNewer = true;
    }

    return merge(base, older, newer, function (o) {
      _this2.value = o;
    }, preferCloneOlder, preferCloneNewer, (0, _extends2.default)({}, this.mergeOptions, {}, options, {
      selfAsValueOlder: !(older instanceof Property),
      selfAsValueNewer: !(newer instanceof Property)
    }));
  } // endregion
  // region IMergeable
  ;

  _proto._canMerge = function _canMerge(source) {
    if (source.constructor === Property && this.value === source.value || this.value === source) {
      return null;
    }

    return true;
  };

  _proto._merge = function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer) {
    return this._mergeValue(merge, this.value, older, newer, preferCloneOlder, preferCloneNewer);
  } // endregion
  // region ISerializable
  ;

  _proto.serialize = function serialize(_serialize) {
    return {
      value: _serialize(this.value)
    };
  };

  _proto.deSerialize = function deSerialize(_deSerialize, serializedValue) {
    var _this3 = this;

    _deSerialize(serializedValue.value, function (o) {
      return _this3.value = o;
    });
  } // endregion
  ;

  return Property;
}(_ObservableObject2.ObservableObject);

exports.Property = Property;
Property.uuid = '6f2c51ccd8654baa9a93226e3374ccaf';
new _ObservableObjectBuilder.ObservableObjectBuilder(Property.prototype).writable('value');
(0, _mergers.registerMergeable)(Property);
(0, _serializers.registerSerializable)(Property);
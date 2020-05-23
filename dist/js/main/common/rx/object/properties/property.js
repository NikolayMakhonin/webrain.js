"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Property = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _mergers = require("../../../extensions/merge/mergers");

var _serializers = require("../../../extensions/serialization/serializers");

var _webrainOptions = require("../../../helpers/webrainOptions");

var _ObservableClass2 = require("../ObservableClass");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _Symbol$toStringTag;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

_Symbol$toStringTag = _toStringTag.default;

var Property = /*#__PURE__*/function (_ObservableClass) {
  (0, _inherits2.default)(Property, _ObservableClass);

  var _super = _createSuper(Property);

  function Property(options, initValue) {
    var _this;

    (0, _classCallCheck2.default)(this, Property);
    _this = _super.call(this);
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

  (0, _createClass2.default)(Property, [{
    key: "set",
    // region set / fill / merge
    value: function set(value, clone, options) {
      var result = this.mergeValue(void 0, value, value, clone, clone, options);

      if (!result) {
        this.value = void 0;
      }

      return result;
    }
  }, {
    key: "fill",
    value: function fill(value, preferClone, options) {
      return this.mergeValue(this.value, value, value, preferClone, preferClone, options);
    }
  }, {
    key: "merge",
    value: function merge(older, newer, preferCloneOlder, preferCloneNewer, options) {
      return this.mergeValue(this.value, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region merge helpers

  }, {
    key: "mergeValue",
    value: function mergeValue(base, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return this._mergeValue((this.merger || _mergers.ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  }, {
    key: "_mergeValue",
    value: function _mergeValue(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      if (older instanceof Property) {
        older = older.value;
      } else {
        options = (0, _extends2.default)((0, _extends2.default)({}, options), {}, {
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
      }, preferCloneOlder, preferCloneNewer, (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, this.mergeOptions), options), {}, {
        selfAsValueOlder: !(older instanceof Property),
        selfAsValueNewer: !(newer instanceof Property)
      }));
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (_webrainOptions.webrainOptions.equalsFunc ? source.constructor === Property && _webrainOptions.webrainOptions.equalsFunc.call(this, this.value, source.value) || _webrainOptions.webrainOptions.equalsFunc.call(this, this.value, source) : source.constructor === Property && this.value === source.value || this.value === source) {
        return null;
      }

      return true;
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer) {
      return this._mergeValue(merge, this.value, older, newer, preferCloneOlder, preferCloneNewer);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        value: _serialize(this.value)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {
      var _this3 = this;

      _deSerialize(serializedValue.value, function (o) {
        return _this3.value = o;
      });
    } // endregion

  }]);
  return Property;
}(_ObservableClass2.ObservableClass);

exports.Property = Property;
Property.uuid = '6f2c51ccd8654baa9a93226e3374ccaf';
new _ObservableObjectBuilder.ObservableObjectBuilder(Property.prototype).writable('value');
(0, _mergers.registerMergeable)(Property);
(0, _serializers.registerSerializable)(Property);
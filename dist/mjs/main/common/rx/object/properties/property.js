import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObjectMerger, registerMergeable } from '../../../extensions/merge/mergers';
import { registerSerializable } from '../../../extensions/serialization/serializers';
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
var _Symbol$toStringTag = Symbol.toStringTag;
export var Property =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(Property, _ObservableObject);

  function Property(options, value) {
    var _this;

    _classCallCheck(this, Property);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Property).call(this));
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

    if (typeof value !== 'undefined') {
      _this.value = value;
    }

    return _this;
  }

  _createClass(Property, [{
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
      return this._mergeValue((this.merger || ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  }, {
    key: "_mergeValue",
    value: function _mergeValue(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      if (older instanceof Property) {
        older = older.value;
      } else {
        options = _objectSpread({}, options, {
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
      }, preferCloneOlder, preferCloneNewer, _objectSpread({}, this.mergeOptions, options, {
        selfAsValueOlder: !(older instanceof Property),
        selfAsValueNewer: !(newer instanceof Property)
      }));
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === Property && this.value === source.value || this.value === source) {
        return null;
      }

      return true;
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return this._mergeValue(merge, this.value, older, newer, preferCloneOlder, preferCloneNewer);
    } // endregion
    // region ISerializable

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
}(ObservableObject);
Property.uuid = '6f2c51cc-d865-4baa-9a93-226e3374ccaf';
new ObservableObjectBuilder(Property.prototype).writable('value');
registerMergeable(Property);
registerSerializable(Property);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Property = void 0;

var _mergers = require("../../../extensions/merge/mergers");

var _serializers = require("../../../extensions/serialization/serializers");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

let _Symbol$toStringTag;

_Symbol$toStringTag = Symbol.toStringTag;

class Property extends _ObservableObject.ObservableObject {
  constructor(options, initValue) {
    super();
    this[_Symbol$toStringTag] = 'Property';
    const {
      merger,
      mergeOptions
    } = options || {};

    if (merger != null) {
      this.merger = merger;
    }

    if (mergeOptions != null) {
      this.mergeOptions = mergeOptions;
    }

    if (typeof initValue !== 'undefined') {
      this.value = initValue;
    }
  }

  // region set / fill / merge
  set(value, clone, options) {
    const result = this.mergeValue(void 0, value, value, clone, clone, options);

    if (!result) {
      this.value = void 0;
    }

    return result;
  }

  fill(value, preferClone, options) {
    return this.mergeValue(this.value, value, value, preferClone, preferClone, options);
  }

  merge(older, newer, preferCloneOlder, preferCloneNewer, options) {
    return this.mergeValue(this.value, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region merge helpers


  mergeValue(base, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return this._mergeValue((this.merger || _mergers.ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
  }

  _mergeValue(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
    if (older instanceof Property) {
      older = older.value;
    } else {
      options = { ...options,
        selfAsValueOlder: true
      };
    }

    if (newer instanceof Property) {
      newer = newer.value;
    } else {
      if (!options) {
        options = {};
      }

      options.selfAsValueNewer = true;
    }

    return merge(base, older, newer, o => {
      this.value = o;
    }, preferCloneOlder, preferCloneNewer, { ...this.mergeOptions,
      ...options,
      selfAsValueOlder: !(older instanceof Property),
      selfAsValueNewer: !(newer instanceof Property)
    });
  } // endregion
  // region IMergeable


  _canMerge(source) {
    if (source.constructor === Property && this.value === source.value || this.value === source) {
      return null;
    }

    return true;
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer) {
    return this._mergeValue(merge, this.value, older, newer, preferCloneOlder, preferCloneNewer);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      value: serialize(this.value)
    };
  }

  deSerialize(deSerialize, serializedValue) {
    deSerialize(serializedValue.value, o => this.value = o);
  } // endregion


}

exports.Property = Property;
Property.uuid = '6f2c51ccd8654baa9a93226e3374ccaf';
new _ObservableObjectBuilder.ObservableObjectBuilder(Property.prototype).writable('value');
(0, _mergers.registerMergeable)(Property);
(0, _serializers.registerSerializable)(Property);
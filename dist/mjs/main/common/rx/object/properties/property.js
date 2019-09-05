let _Symbol$toStringTag;

import { ObjectMerger, registerMergeable } from '../../../extensions/merge/mergers';
import { registerSerializable } from '../../../extensions/serialization/serializers';
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
_Symbol$toStringTag = Symbol.toStringTag;
export class Property extends ObservableObject {
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
    return this._mergeValue((this.merger || ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
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
Property.uuid = '6f2c51ccd8654baa9a93226e3374ccaf';
new ObservableObjectBuilder(Property.prototype).writable('value');
registerMergeable(Property);
registerSerializable(Property);
import { mergeMaps, MergeObjectWrapper } from '../../extensions/merge/merge-maps';
import { registerMerger } from '../../extensions/merge/mergers';
import { deSerializeObject, registerSerializer, serializeObject } from '../../extensions/serialization/serializers';
import '../extensions/autoConnect';
import { ObservableClass } from './ObservableClass';
export class ObservableObject extends ObservableClass {}
registerMerger(ObservableObject, {
  merger: {
    canMerge(target, source) {
      return source instanceof Object;
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps((target, source) => new MergeObjectWrapper(source), merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  },
  preferClone: o => Object.isFrozen(o) ? true : null
});
registerSerializer(ObservableObject, {
  uuid: '1380d053394748e58406c1c0e62a2be9',
  serializer: {
    serialize(serialize, value, options) {
      return serializeObject(serialize, value, options);
    },

    deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    }

  },
  valueFactory: () => new ObservableObject()
});
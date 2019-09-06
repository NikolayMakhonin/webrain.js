/* tslint:disable:no-nested-switch ban-types use-primitive-type */
import { isIterable, typeToDebugString } from '../../helpers/helpers';
import { canHaveUniqueId, getObjectUniqueId } from '../../helpers/object-unique-id';
import { fillMap, fillSet } from '../../lists/helpers/set';
import { TypeMetaCollection } from '../TypeMeta';
import { createMergeMapWrapper, mergeMaps } from './merge-maps';
import { createMergeSetWrapper } from './merge-sets'; // region MergerVisitor

class ValueState {
  constructor(mergerState, target, preferClone, selfAsValue, refs) {
    this.mergerState = mergerState;
    this.target = target;
    this.preferClone = preferClone;
    this.selfAsValue = selfAsValue;
    this.refs = refs;
    const {
      options
    } = this.mergerState;
    this.type = options && options.valueType || target.constructor;
  }

  resolveRef() {
    if (this._isRef == null) {
      if (this.selfAsValue) {
        this._isRef = false;
      } else {
        const ref = this.getRef();

        if (ref) {
          this.target = ref;
          this._isRef = true;
        } else {
          this._isRef = false;
        }
      }
    }
  }

  get isRef() {
    this.resolveRef();
    return this._isRef;
  }

  getRef() {
    const {
      refs
    } = this;

    if (refs) {
      const id = getObjectUniqueId(this.target);

      if (id != null) {
        const ref = refs[id];
        return ref;
      }
    }

    return null;
  }

  setRef(refObj) {
    const id = getObjectUniqueId(this.target);

    if (id != null) {
      let {
        refs
      } = this;

      if (refs == null) {
        this.refs = refs = [];
      }

      refs[id] = refObj;
    }
  }

  get meta() {
    let {
      _meta
    } = this;

    if (!_meta) {
      _meta = this.mergerState.mergerVisitor.typeMeta.getMeta(this.type);

      if (!_meta) {
        throw new Error(`Class (${this.type && this.type.name}) have no type meta`);
      }

      this._meta = _meta;
    }

    return _meta;
  }

  get merger() {
    let {
      _merger
    } = this;

    if (!_merger) {
      const {
        meta
      } = this;
      _merger = meta.merger;

      if (!_merger) {
        throw new Error(`Class (${this.type && this.type.name}) type meta have no merger`);
      }

      this._merger = _merger;
    }

    return _merger;
  }

  get merge() {
    const {
      merger
    } = this;

    if (!merger.merge) {
      throw new Error(`Class (${this.type && this.type.name}) merger have no merge method`);
    }

    return merger.merge;
  }

  get mustBeCloned() {
    let {
      _mustBeCloned
    } = this;

    if (_mustBeCloned == null) {
      const {
        options
      } = this.mergerState;
      const valueType = options && options.valueType;
      let metaPreferClone = this.meta.preferClone;

      if (typeof metaPreferClone === 'function') {
        metaPreferClone = metaPreferClone(this.target);
      }

      this._mustBeCloned = _mustBeCloned = (metaPreferClone != null ? metaPreferClone : this.preferClone && !this.isRef && !this.mergerState.mergerVisitor.getStatus(this.target)) || valueType && valueType !== this.target.constructor;
    }

    return _mustBeCloned;
  }

  get cloneInstance() {
    let {
      _cloneInstance
    } = this;

    if (_cloneInstance == null) {
      const {
        target,
        type
      } = this;
      const {
        options
      } = this.mergerState;

      _cloneInstance = (options && options.valueFactory || this.meta.valueFactory || (() => (!options || !options.valueType || this.target.constructor === (options && options.valueType)) && new type()))(target);

      if (!_cloneInstance) {
        throw new Error(`Class (${typeToDebugString(type)}) cannot be clone`);
      }

      if (_cloneInstance === target) {
        throw new Error(`Clone result === Source for (${typeToDebugString(type)})`);
      }

      if (_cloneInstance.constructor !== type) {
        throw new Error(`Clone type !== (${typeToDebugString(type)})`);
      }

      this._cloneInstance = _cloneInstance;
    }

    return _cloneInstance;
  }

  canMerge(source, target) {
    const canMerge = this.merger.canMerge;

    if (canMerge) {
      if (target == null) {
        target = this.target;

        if (this.isRef || source.isRef) {
          return target === source.target ? null : false;
        }
      }

      const result = canMerge(target, source.target);

      if (result == null) {
        return null;
      }

      if (typeof result !== 'boolean') {
        throw new Error(`Unknown canMerge() result (${result.constructor.name}) for ${this.type.name}`);
      }

      return result;
    }

    return this.target.constructor === source.constructor;
  }

  get clone() {
    let {
      _clone
    } = this;

    if (_clone == null) {
      const {
        target
      } = this;

      if (this.mustBeCloned) {
        _clone = this.cloneInstance;
        const canMergeResult = this.canMerge(this, _clone);

        switch (canMergeResult) {
          case null:
            break;

          case true:
            const {
              mergerVisitor,
              options
            } = this.mergerState;
            this.setRef(_clone); // mergerVisitor.setStatus(_clone, ObjectStatus.Cloned)

            const {
              preferClone,
              refs
            } = this;
            this.merge(mergerVisitor.getNextMerge(preferClone, preferClone, refs, refs, refs, options), _clone, target, target, () => {
              throw new Error(`Class (${this.type.name}) cannot be merged with clone`);
            }, preferClone, preferClone, options);
            break;

          case false:
            if (this.merger.merge) {
              throw new Error(`Class (${this.type.name}) cannot be merged with clone`);
            }

            break;
        }
      } else {
        _clone = target;
      }

      this._clone = _clone;
    }

    return _clone;
  }

}

class MergeState {
  // noinspection DuplicatedCode
  constructor(mergerVisitor, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
    this.mergerVisitor = mergerVisitor;
    this.base = base;
    this.older = older;
    this.newer = newer;
    this.set = set;
    this.preferCloneBase = preferCloneBase;
    this.preferCloneOlder = preferCloneOlder;
    this.preferCloneNewer = preferCloneNewer;
    this.refsBase = refsBase;
    this.refsOlder = refsOlder;
    this.refsNewer = refsNewer;
    this.options = options;
  }

  get baseState() {
    let {
      _baseState
    } = this;

    if (_baseState == null) {
      const {
        options
      } = this;
      this._baseState = _baseState = new ValueState(this, this.base, this.preferCloneBase, options && options.selfAsValueBase, this.refsBase);
    }

    return _baseState;
  }

  set baseState(value) {
    this._baseState = value;
  }

  get olderState() {
    let {
      _olderState
    } = this;

    if (_olderState == null) {
      const {
        options
      } = this;
      this._olderState = _olderState = new ValueState(this, this.older, this.preferCloneOlder, options && options.selfAsValueOlder, this.refsOlder);
    }

    return _olderState;
  }

  set olderState(value) {
    this._olderState = value;
  }

  get newerState() {
    let {
      _newerState
    } = this;

    if (_newerState == null) {
      const {
        options
      } = this;
      this._newerState = _newerState = new ValueState(this, this.newer, this.preferCloneNewer, options && options.selfAsValueNewer, this.refsNewer);
    }

    return _newerState;
  }

  set newerState(value) {
    this._newerState = value;
  }

  fillOlderNewer() {
    const {
      olderState,
      newerState
    } = this; // this.mergerVisitor.setStatus(olderState.clone, ObjectStatus.Merged)
    // const idNewer = getObjectUniqueId(newerState.target as any)
    // if (idNewer != null) {
    // 	refsNewer[idNewer] = olderState.clone
    // }

    const older = olderState.clone;
    newerState.setRef(older);
    const {
      options,
      set,
      preferCloneNewer,
      refsOlder,
      refsNewer
    } = this;
    let isSet;
    const result = olderState.merge(this.mergerVisitor.getNextMerge(preferCloneNewer, preferCloneNewer, refsOlder, refsNewer, refsNewer, options), older, newerState.target, newerState.target, set ? o => {
      // if (idNewer != null) {
      // 	refsNewer[idNewer] = o
      // }
      set(o);
      isSet = true;
    } : () => {
      throw new Error(`Class ${olderState.type.name} does not need cloning.` + 'You should use "preferClone: false" in merger options for this class');
    }, preferCloneNewer, preferCloneNewer, options);

    if (isSet) {
      return;
    }

    if (result || newerState.mustBeCloned) {
      set(older);
      return;
    }

    set(newerState.target);
  }

  mergeWithBase(olderState, newerState) {
    const {
      baseState
    } = this;
    const base = baseState.clone; // baseState.setRef(base)

    olderState.setRef(base);
    newerState.setRef(base);
    const {
      options,
      set
    } = this;
    const {
      refs: refsBase
    } = baseState;
    const {
      preferClone: preferCloneOlder,
      refs: refsOlder
    } = olderState;
    const {
      preferClone: preferCloneNewer,
      refs: refsNewer
    } = newerState;
    let isSet;
    const result = baseState.merge(this.mergerVisitor.getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options), base, olderState.target, newerState.target, // for String() etc., that cannot be changed
    set ? o => {
      baseState.setRef(o);
      olderState.setRef(o);
      newerState.setRef(o);
      set(o);
      isSet = true;
    } : () => {
      if (baseState.mustBeCloned) {
        throw new Error(`Class ${baseState.type.name} does not need cloning.` + 'You should use "preferClone: false" in merger options for this class');
      } else {
        isSet = true;
      }
    }, preferCloneOlder, preferCloneNewer, options);

    if (isSet) {
      return !!set;
    }

    if (!result) {
      return false;
    }

    if (baseState.mustBeCloned) {
      set(base);
    }

    return true;
  }

}

function mergePreferClone(o1, o2) {
  if (o1 || o2) {
    return true;
  }

  return o1 == null ? o2 : o1;
}

var ObjectStatus;

(function (ObjectStatus) {
  ObjectStatus[ObjectStatus["Cloned"] = 1] = "Cloned";
  ObjectStatus[ObjectStatus["Merged"] = 2] = "Merged";
})(ObjectStatus || (ObjectStatus = {}));

export class MergerVisitor {
  // public refs: IRef[]
  constructor(typeMeta) {
    this.typeMeta = typeMeta;
  }

  getStatus(object) {
    const {
      statuses
    } = this;

    if (!statuses) {
      return null;
    }

    const id = getObjectUniqueId(object);

    if (id == null) {
      throw new Error(`object is primitive: ${object}`);
    }

    return statuses[id];
  }

  setStatus(object, status) {
    let {
      statuses
    } = this;

    if (!statuses) {
      this.statuses = statuses = [];
    }

    const id = getObjectUniqueId(object);

    if (id == null) {
      throw new Error(`object is primitive: ${object}`);
    }

    statuses[id] = status;
    return object;
  } // noinspection JSUnusedLocalSymbols


  getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
    return (next_base, next_older, next_newer, next_set, next_preferCloneOlder, next_preferCloneNewer, next_options) => this.merge(next_base, next_older, next_newer, next_set, next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder, next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer, next_options, // next_options == null || next_options === options
    // 	? options
    // 	: (options == null ? next_options : {
    // 		...options,
    // 		...next_options,
    // 	}),
    refsBase, refsOlder, refsNewer);
  }

  merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options, refsBase, refsOlder, refsNewer) {
    let preferCloneBase = null;

    if (base === newer) {
      if (base === older) {
        return false;
      }

      preferCloneBase = preferCloneNewer;
      preferCloneNewer = preferCloneOlder;
      newer = older;
    }

    if (isPrimitive(newer)) {
      if (set) {
        set(newer);
        return true;
      }

      return false;
    }

    if (base === older) {
      preferCloneBase = preferCloneOlder = mergePreferClone(preferCloneBase, preferCloneOlder);
    }

    if (older === newer) {
      preferCloneOlder = preferCloneNewer = mergePreferClone(preferCloneOlder, preferCloneNewer);
    }

    const mergeState = new MergeState(this, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options); // region refs

    if (!isPrimitive(base) && mergeState.baseState.isRef) {
      mergeState.newerState.resolveRef();

      if (mergeState.baseState.target === mergeState.newerState.target) {
        if (!isPrimitive(older)) {
          mergeState.olderState.resolveRef();

          if (mergeState.baseState.target === mergeState.olderState.target) {
            return false;
          }
        }

        mergeState.baseState = mergeState.newerState;
        mergeState.newerState = mergeState.olderState;
        newer = mergeState.newerState.target;
      }

      if (!isPrimitive(older)) {
        mergeState.olderState.resolveRef();

        if (mergeState.baseState.target === mergeState.olderState.target) {
          mergeState.olderState.preferClone = mergePreferClone(mergeState.baseState.preferClone, mergeState.olderState.preferClone);
          mergeState.baseState = mergeState.olderState;
        }

        older = mergeState.olderState.target;
      }

      base = mergeState.baseState.target;
    }

    if (!isPrimitive(older)) {
      mergeState.olderState.resolveRef();
      mergeState.newerState.resolveRef();

      if ((mergeState.olderState.isRef || mergeState.newerState.isRef) && mergeState.olderState.target === mergeState.newerState.target) {
        mergeState.newerState.preferClone = mergePreferClone(mergeState.olderState.preferClone, mergeState.newerState.preferClone);
        mergeState.olderState = mergeState.newerState;
      }

      older = mergeState.olderState.target;
      newer = mergeState.newerState.target;
    } // endregion


    const fillOlderNewer = () => {
      switch (mergeState.olderState.canMerge(mergeState.newerState)) {
        case null:
          if (mergeState.olderState.mustBeCloned) {
            set(mergeState.newerState.clone);
          } else {
            if (mergeState.newerState.mustBeCloned) {
              set(mergeState.olderState.target);
            } else {
              set(mergeState.newerState.target);
            }
          }

          break;

        case false:
          set(mergeState.newerState.clone);
          break;

        case true:
          mergeState.fillOlderNewer();
          return true;
      }
    };

    if (isPrimitive(base)) {
      if (set) {
        if (isPrimitive(older) || older === newer) {
          set(mergeState.newerState.clone);
        } else {
          fillOlderNewer();
        }

        return true;
      }

      return false;
    }

    if (!set && mergeState.baseState.mustBeCloned) {
      return false;
    }

    if (isPrimitive(older)) {
      switch (mergeState.baseState.canMerge(mergeState.newerState)) {
        case null:
          if (set) {
            set(older);
            return true;
          }

          break;

        case false:
          if (set) {
            set(mergeState.newerState.clone);
            return true;
          }

          break;

        case true:
          if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
            if (set) {
              set(older);
              return true;
            }

            return false;
          }

          return true;
      }

      return false;
    }

    switch (mergeState.baseState.canMerge(mergeState.newerState)) {
      case false:
        if (set) {
          fillOlderNewer();
          return true;
        }

        return false;

      case null:
        switch (mergeState.baseState.canMerge(mergeState.olderState)) {
          case null:
            return false;

          case false:
            if (set) {
              set(mergeState.olderState.clone);
              return true;
            }

            return false;

          case true:
            return mergeState.mergeWithBase(mergeState.olderState, mergeState.olderState);
        }

        throw new Error('Unreachable code');
    }

    switch (mergeState.baseState.canMerge(mergeState.olderState)) {
      case null:
        return mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState);
      // if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
      // 	if (set) {
      // 		throw new Error('base != newer; base == older; base == newer')
      // 	}
      // 	return false
      // }
      // return true

      case false:
        if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
          if (set) {
            set(mergeState.olderState.clone);
            return true;
          }

          return false;
        }

        return true;

      case true:
        return mergeState.mergeWithBase(mergeState.olderState, mergeState.newerState);
    }

    throw new Error('Unreachable code');
  }

} // endregion
// region TypeMetaMergerCollection

export class TypeMetaMergerCollection extends TypeMetaCollection {
  constructor(proto) {
    super(proto || TypeMetaMergerCollection.default);
  }

  static makeTypeMetaMerger(type, meta) {
    return {
      valueFactory: () => new type(),
      ...meta,
      merger: {
        canMerge(target, source) {
          return target._canMerge ? target._canMerge(source) : target.constructor === source.constructor;
        },

        merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
          return base._merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options);
        },

        ...(meta ? meta.merger : {})
      }
    };
  }

  putMergeableType(type, meta) {
    return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, meta));
  }

}
TypeMetaMergerCollection.default = new TypeMetaMergerCollection();
export function registerMergeable(type, meta) {
  TypeMetaMergerCollection.default.putMergeableType(type, meta);
}
export function registerMerger(type, meta) {
  TypeMetaMergerCollection.default.putType(type, meta);
}
export function registerMergerPrimitive(type, meta) {
  registerMerger(type, {
    preferClone: false,
    ...meta,
    merger: {
      merge(merge, base, older, newer, set) {
        set(newer.valueOf());
        return true;
      },

      ...(meta ? meta.merger : {})
    }
  });
} // endregion
// region ObjectMerger

export class ObjectMerger {
  constructor(typeMeta) {
    this.typeMeta = new TypeMetaMergerCollection(typeMeta);
    this.merge = this.merge.bind(this);
  }

  merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
    const merger = new MergerVisitor(this.typeMeta);
    const mergedValue = merger.merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options);
    return mergedValue;
  }

} // endregion
// region Primitive Mergers
// Handled in MergerVisitor:

ObjectMerger.default = new ObjectMerger();

function isPrimitive(value) {
  return !canHaveUniqueId(value) || typeof value === 'function'; // value == null
  // || typeof value === 'number'
  // || typeof value === 'boolean'
}

registerMerger(String, {
  merger: {
    canMerge(target, source) {
      target = target.valueOf();
      source = source.valueOf();

      if (typeof source !== 'string') {
        return false;
      }

      if (target === source) {
        return null;
      }

      return true;
    },

    merge(merge, base, older, newer, set) {
      // base = base.valueOf()
      // older = older.valueOf()
      // newer = newer.valueOf()
      // if (base === newer) {
      // 	if (base === older) {
      // 		return false
      // 	}
      // 	set(older)
      // 	return true
      // }
      set(newer.valueOf());
      return true;
    }

  },
  preferClone: false
});
registerMergerPrimitive(Number);
registerMergerPrimitive(Boolean);
registerMergerPrimitive(Array);
registerMergerPrimitive(Error); // endregion
// region Array
// @ts-ignore
// registerMerger<any[], any[]>(Array, {
// 	merger: {
// 		canMerge(target: any[], source: any[]): boolean {
// 			return Array.isArray(source)
// 		},
// 		merge(
// 			merge: IMergeValue,
// 			base: any[],
// 			older: any[],
// 			newer: any[],
// 			set?: (value: any[]) => void,
// 			preferCloneOlder?: boolean,
// 			preferCloneNewer?: boolean,
// 			options?: IMergeOptions,
// 		): boolean {
// 			let changed = false
// 			const lenBase = base.length
// 			const lenOlder = older.length
// 			const lenNewer = newer.length
// 			for (let i = 0; i < lenNewer; i++) {
// 				if (i < lenBase) {
// 					if (i < lenOlder) {
// 						changed = merge(base[i], older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 							|| changed
// 					} else {
// 						changed = merge(base[i], newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 							|| changed
// 					}
// 				} else if (i < lenOlder) {
// 					changed = merge(EMPTY, older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 						|| changed
// 				} else {
// 					changed = merge(EMPTY, newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 						|| changed
// 				}
// 			}
// 		},
// 	},
// 	preferClone: o => Array.isFrozen(o) ? true : null,
// })
// endregion
// region Object

registerMerger(Object, {
  merger: {
    canMerge(target, source) {
      return source.constructor === Object;
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(createMergeMapWrapper, merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  },
  preferClone: o => Object.isFrozen(o) ? true : null
}); // endregion
// region Date

registerMerger(Date, {
  merger: {
    canMerge(target, source) {
      if (source.constructor !== Date) {
        return false;
      }

      return target.getTime() === source.getTime() ? null : false;
    }

  },
  valueFactory: source => new Date(source)
}); // endregion
// region Set

registerMerger(Set, {
  merger: {
    canMerge(target, source) {
      return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => fillSet(new Set(), arrayOrIterable)), merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  } // valueFactory: (source: Set<any>) => new Set(source),

}); // endregion
// region Map

registerMerger(Map, {
  merger: {
    // tslint:disable-next-line:no-identical-functions
    canMerge(target, source) {
      return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new Map(), arrayOrIterable)), merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  } // valueFactory: (source: Map<any, any>) => new Map(source),

}); // endregion
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeMapWrappers = mergeMapWrappers;
exports.createMergeMapWrapper = createMergeMapWrapper;
exports.mergeMaps = mergeMaps;
exports.MergeMapWrapper = exports.MergeObjectWrapper = void 0;

var _helpers = require("../../helpers/helpers");

/* tslint:disable:no-identical-functions */
function mergeMapWrappers(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  let changed = false;
  const addItems = [];

  const fill = (olderItem, newerItem) => {
    let setItem = _helpers.EMPTY;
    merge(_helpers.EMPTY, olderItem, newerItem, o => {
      setItem = o;
    }, preferCloneOlder, preferCloneNewer, options);

    if (setItem === _helpers.EMPTY) {
      throw new Error('setItem === NONE');
    }

    return setItem;
  };

  if (older === newer) {
    // [- n n]
    newer.forEachKeys(key => {
      if (!base.has(key)) {
        addItems.push([key, fill(_helpers.EMPTY, newer.get(key))]);
      }
    });
  } else {
    // [- - n]
    newer.forEachKeys(key => {
      if (!base.has(key) && !older.has(key)) {
        addItems.push([key, fill(_helpers.EMPTY, newer.get(key))]);
      }
    }); // [- o *]

    older.forEachKeys(key => {
      if (!base.has(key)) {
        if (!newer.has(key)) {
          addItems.push([key, fill(older.get(key), _helpers.EMPTY)]);
        } else {
          addItems.push([key, fill(older.get(key), newer.get(key))]);
        }
      }
    });
  }

  const deleteItems = []; // [b * *]

  base.forEachKeys(key => {
    changed = merge(base.get(key), older.has(key) ? older.get(key) : _helpers.EMPTY, newer.has(key) ? newer.get(key) : _helpers.EMPTY, o => {
      if (o === _helpers.EMPTY) {
        deleteItems.push(key);
      } else {
        base.set(key, o);
      }
    }, preferCloneOlder, preferCloneNewer, options) || changed;
  });
  let len = deleteItems.length;

  if (len > 0) {
    changed = true;

    for (let i = len - 1; i >= 0; i--) {
      base.delete(deleteItems[i]);
    }
  }

  len = addItems.length;

  if (len > 0) {
    changed = true;

    for (let i = 0; i < len; i++) {
      base.set.apply(base, addItems[i]);
    }
  }

  return changed;
}

class MergeObjectWrapper {
  constructor(object, keyAsValue) {
    this._object = object;

    if (keyAsValue) {
      this._keyAsValue = true;
    }
  }

  delete(key) {
    delete this._object[key];
  }

  forEachKeys(callbackfn) {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        callbackfn(key);
      }
    }
  }

  get(key) {
    return this._keyAsValue ? key : this._object[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this._object, key);
  }

  set(key, value) {
    this._object[key] = this._keyAsValue ? true : value;
  }

}

exports.MergeObjectWrapper = MergeObjectWrapper;

class MergeMapWrapper {
  constructor(map) {
    this._map = map;
  }

  delete(key) {
    this._map.delete(key);
  }

  forEachKeys(callbackfn) {
    for (const key of this._map.keys()) {
      callbackfn(key);
    }
  }

  get(key) {
    return this._map.get(key);
  }

  has(key) {
    return this._map.has(key);
  }

  set(key, value) {
    this._map.set(key, value);
  }

}

exports.MergeMapWrapper = MergeMapWrapper;

function createMergeMapWrapper(target, source, arrayOrIterableToMap) {
  if (source[Symbol.toStringTag] === 'Map') {
    return new MergeMapWrapper(source);
  }

  if (arrayOrIterableToMap && (Array.isArray(source) || (0, _helpers.isIterable)(source))) {
    return createMergeMapWrapper(target, arrayOrIterableToMap(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source);
  }

  throw new Error(`${target.constructor.name} cannot be merge with ${source.constructor.name}`);
} // 10039 cycles


function mergeMaps(createSourceMapWrapper, merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  const baseWrapper = createSourceMapWrapper(base, base);
  const olderWrapper = older === base ? baseWrapper : createSourceMapWrapper(base, older);
  const newerWrapper = newer === base ? baseWrapper : newer === older ? olderWrapper : createSourceMapWrapper(base, newer);
  return mergeMapWrappers(merge, baseWrapper, olderWrapper, newerWrapper, preferCloneOlder, preferCloneNewer, options);
}
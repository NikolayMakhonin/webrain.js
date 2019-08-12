import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

/* tslint:disable:no-identical-functions */
import { EMPTY, isIterable } from '../../helpers/helpers';
export function mergeMapWrappers(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  var changed = false;
  var addItems = [];

  var fill = function fill(olderItem, newerItem) {
    var setItem = EMPTY;
    merge(EMPTY, olderItem, newerItem, function (o) {
      setItem = o;
    }, preferCloneOlder, preferCloneNewer, options);

    if (setItem === EMPTY) {
      throw new Error('setItem === NONE');
    }

    return setItem;
  };

  if (older === newer) {
    // [- n n]
    newer.forEachKeys(function (key) {
      if (!base.has(key)) {
        addItems.push([key, fill(EMPTY, newer.get(key))]);
      }
    });
  } else {
    // [- - n]
    newer.forEachKeys(function (key) {
      if (!base.has(key) && !older.has(key)) {
        addItems.push([key, fill(EMPTY, newer.get(key))]);
      }
    }); // [- o *]

    older.forEachKeys(function (key) {
      if (!base.has(key)) {
        if (!newer.has(key)) {
          addItems.push([key, fill(older.get(key), EMPTY)]);
        } else {
          addItems.push([key, fill(older.get(key), newer.get(key))]);
        }
      }
    });
  }

  var deleteItems = []; // [b * *]

  base.forEachKeys(function (key) {
    changed = merge(base.get(key), older.has(key) ? older.get(key) : EMPTY, newer.has(key) ? newer.get(key) : EMPTY, function (o) {
      if (o === EMPTY) {
        deleteItems.push(key);
      } else {
        base.set(key, o);
      }
    }, preferCloneOlder, preferCloneNewer, options) || changed;
  });
  var len = deleteItems.length;

  if (len > 0) {
    changed = true;

    for (var i = len - 1; i >= 0; i--) {
      base.delete(deleteItems[i]);
    }
  }

  len = addItems.length;

  if (len > 0) {
    changed = true;

    for (var _i = 0; _i < len; _i++) {
      base.set.apply(base, addItems[_i]);
    }
  }

  return changed;
}
export var MergeObjectWrapper =
/*#__PURE__*/
function () {
  function MergeObjectWrapper(object, keyAsValue) {
    _classCallCheck(this, MergeObjectWrapper);

    this._object = object;

    if (keyAsValue) {
      this._keyAsValue = true;
    }
  }

  _createClass(MergeObjectWrapper, [{
    key: "delete",
    value: function _delete(key) {
      delete this._object[key];
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      var _object = this._object;

      for (var _key in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _key)) {
          callbackfn(_key);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._keyAsValue ? key : this._object[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return Object.prototype.hasOwnProperty.call(this._object, key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._object[key] = this._keyAsValue ? true : value;
    }
  }]);

  return MergeObjectWrapper;
}();
export var MergeMapWrapper =
/*#__PURE__*/
function () {
  function MergeMapWrapper(map) {
    _classCallCheck(this, MergeMapWrapper);

    this._map = map;
  }

  _createClass(MergeMapWrapper, [{
    key: "delete",
    value: function _delete(key) {
      this._map.delete(key);
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._map.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _key2 = _step.value;
          callbackfn(_key2);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._map.set(key, value);
    }
  }]);

  return MergeMapWrapper;
}();
export function createMergeMapWrapper(target, source, arrayOrIterableToMap) {
  if (source[Symbol.toStringTag] === 'Map') {
    return new MergeMapWrapper(source);
  }

  if (arrayOrIterableToMap && (Array.isArray(source) || isIterable(source))) {
    return createMergeMapWrapper(target, arrayOrIterableToMap(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source);
  }

  throw new Error("".concat(target.constructor.name, " cannot be merge with ").concat(source.constructor.name));
} // 10039 cycles

export function mergeMaps(createSourceMapWrapper, merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  var baseWrapper = createSourceMapWrapper(base, base);
  var olderWrapper = older === base ? baseWrapper : createSourceMapWrapper(base, older);
  var newerWrapper = newer === base ? baseWrapper : newer === older ? olderWrapper : createSourceMapWrapper(base, newer);
  return mergeMapWrappers(merge, baseWrapper, olderWrapper, newerWrapper, preferCloneOlder, preferCloneNewer, options);
}
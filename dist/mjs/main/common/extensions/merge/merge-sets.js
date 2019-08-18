import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { isIterable } from '../../helpers/helpers';
import { MergeObjectWrapper } from './merge-maps';
export var MergeSetWrapper =
/*#__PURE__*/
function () {
  function MergeSetWrapper(set) {
    _classCallCheck(this, MergeSetWrapper);

    this._set = set;
  }

  _createClass(MergeSetWrapper, [{
    key: "delete",
    value: function _delete(key) {
      this._set["delete"](key);
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _key = _step.value;
          callbackfn(_key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
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
      return key;
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._set.has(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._set.add(value);
    }
  }]);

  return MergeSetWrapper;
}();
export function createMergeSetWrapper(target, source, arrayOrIterableToSet) {
  if (source[Symbol.toStringTag] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && (Array.isArray(source) || isIterable(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source, true);
  }

  throw new Error("".concat(target.constructor.name, " cannot be merge with ").concat(source.constructor.name));
}
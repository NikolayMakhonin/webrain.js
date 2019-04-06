import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var ObjectMap =
/*#__PURE__*/
function () {
  function ObjectMap(object) {
    _classCallCheck(this, ObjectMap);

    this._object = object || {};
  }

  _createClass(ObjectMap, [{
    key: "set",
    value: function set(key, value) {
      this._object[key] = value;
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var _key in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _key)) {
          delete _object[_key];
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _object = this._object;

      if (!Object.prototype.hasOwnProperty.call(_object, key)) {
        return false;
      }

      delete _object[key];
      return true;
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      return this.entries();
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _object, _key2;

      return _regeneratorRuntime.wrap(function entries$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _object = this._object;
              _context.t0 = _regeneratorRuntime.keys(_object);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 9;
                break;
              }

              _key2 = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _key2)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return [_key2, _object[_key2]];

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _object = this._object;

      for (var _key3 in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _key3)) {
          callbackfn.call(thisArg, _object[_key3], _key3, this);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._object[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return Object.prototype.hasOwnProperty.call(this._object, key);
    }
  }, {
    key: "keys",
    value: function keys() {
      return Object.keys(this._object)[Symbol.iterator]();
    }
  }, {
    key: "values",
    value: function values() {
      return Object.values(this._object)[Symbol.iterator]();
    }
  }, {
    key: "size",
    get: function get() {
      return Object.keys(this._object).length;
    }
  }]);

  return ObjectMap;
}();
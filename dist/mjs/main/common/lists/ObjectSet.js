import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;
export var ObjectSet =
/*#__PURE__*/
function () {
  function ObjectSet(object) {
    _classCallCheck(this, ObjectSet);

    this[_Symbol$toStringTag] = 'Set';
    this._object = object || {};
  }

  _createClass(ObjectSet, [{
    key: "add",
    value: function add(value) {
      this._object[value] = true;
      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _object = this._object;

      if (!Object.prototype.hasOwnProperty.call(_object, value)) {
        return false;
      }

      delete _object[value];
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var _value in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _value)) {
          delete _object[_value];
        }
      }

      return this;
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return Object.keys(this._object)[Symbol.iterator]();
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _object, _value2;

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

              _value2 = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _value2)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return [_value2, _value2];

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

      for (var _value3 in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _value3)) {
          callbackfn.call(thisArg, _value3, _value3, this);
        }
      }
    }
  }, {
    key: "has",
    value: function has(value) {
      return Object.prototype.hasOwnProperty.call(this._object, value);
    }
  }, {
    key: "keys",
    value: function keys() {
      return this[Symbol.iterator]();
    }
  }, {
    key: "values",
    value: function values() {
      return this[Symbol.iterator]();
    }
  }, {
    key: "size",
    get: function get() {
      return Object.keys(this._object).length;
    }
  }]);

  return ObjectSet;
}();
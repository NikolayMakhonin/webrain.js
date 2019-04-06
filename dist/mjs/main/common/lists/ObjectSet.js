import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var ObjectSet =
/*#__PURE__*/
function () {
  function ObjectSet(object) {
    _classCallCheck(this, ObjectSet);

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
    key: Symbol.iterator,
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function value() {
      var _object, _value2;

      return _regeneratorRuntime.wrap(function value$(_context) {
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
              return _value2;

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _object, _value3;

      return _regeneratorRuntime.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _object = this._object;
              _context2.t0 = _regeneratorRuntime.keys(_object);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 9;
                break;
              }

              _value3 = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _value3)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return [_value3, _value3];

            case 7:
              _context2.next = 2;
              break;

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _object = this._object;

      for (var _value4 in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _value4)) {
          callbackfn.call(thisArg, _value4, _value4, this);
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
      return Object.keys(this._object)[Symbol.iterator]();
    }
  }, {
    key: "values",
    value: function values() {
      return Object.keys(this._object)[Symbol.iterator]();
    }
  }, {
    key: "size",
    get: function get() {
      return Object.keys(this._object).length;
    }
  }]);

  return ObjectSet;
}();
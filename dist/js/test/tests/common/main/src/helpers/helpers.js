"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createIterableIterator = createIterableIterator;
exports.createIterable = createIterable;
exports.createComplexObject = createComplexObject;
exports.CircularClass = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reverse = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reverse"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _iterator3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _mergers = require("../../../../../../main/common/extensions/merge/mergers");

var _serializers = require("../../../../../../main/common/extensions/serialization/serializers");

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _ObservableClass2 = require("../../../../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Property = require("../../../../../../main/common/rx/object/properties/Property");

var _marked2 = /*#__PURE__*/_regenerator.default.mark(createIterableIterator);

function _createForOfIteratorHelperLoose(o) { var _context7; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context7 = i.next).call(_context7, i); }

function _unsupportedIterableToArray(o, minLen) { var _context6; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context6 = Object.prototype.toString.call(o)).call(_context6, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var CircularClass = /*#__PURE__*/function (_ObservableClass) {
  (0, _inherits2.default)(CircularClass, _ObservableClass);

  var _super = _createSuper(CircularClass);

  function CircularClass(array, value) {
    var _this;

    (0, _classCallCheck2.default)(this, CircularClass);
    _this = _super.call(this);
    _this.array = array;
    _this.value = value;
    return _this;
  } // region IMergeable


  (0, _createClass2.default)(CircularClass, [{
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === CircularClass) {
        return null;
      }

      return source.constructor === CircularClass; // || Array.isArray(source)
      // || isIterable(source)
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      var changed = false;
      changed = merge(this.array, older.array, newer.array, function (o) {
        _this2.array = o;
      }) || changed;
      changed = merge(this.value, older.value, newer.value, function (o) {
        _this2.value = o;
      }) || changed;
      return changed;
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        array: _serialize(this.array),
        value: _serialize(this.value)
      };
    }
  }, {
    key: "deSerialize",
    value: /*#__PURE__*/_regenerator.default.mark(function deSerialize(_deSerialize, serializedValue) {
      return _regenerator.default.wrap(function deSerialize$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _deSerialize(serializedValue.value);

            case 2:
              this.value = _context.sent;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, deSerialize, this);
    }) // endregion

  }]);
  return CircularClass;
}(_ObservableClass2.ObservableClass);

exports.CircularClass = CircularClass;
CircularClass.uuid = 'e729e03fd0f449949f0f97da23c7bab8';
(0, _mergers.registerMergeable)(CircularClass);
(0, _serializers.registerSerializable)(CircularClass, {
  serializer: {
    deSerialize: function (_deSerialize2) {
      var _marked = /*#__PURE__*/_regenerator.default.mark(deSerialize);

      function deSerialize(_x, _x2, _x3) {
        var _args2 = arguments;
        return _regenerator.default.wrap(function deSerialize$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.delegateYield(_deSerialize2.apply(this, _args2), "t0", 1);

              case 1:
                return _context2.abrupt("return", _context2.t0);

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _marked, this);
      }

      deSerialize.toString = function () {
        return _deSerialize2.toString();
      };

      return deSerialize;
    }( /*#__PURE__*/_regenerator.default.mark(function _callee(deSerialize, serializedValue, valueFactory) {
      var array, value;
      return _regenerator.default.wrap(function _callee$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return deSerialize(serializedValue.array);

            case 2:
              array = _context3.sent;
              value = valueFactory(array);
              _context3.next = 6;
              return value.deSerialize(deSerialize, serializedValue);

            case 6:
              return _context3.abrupt("return", value);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee);
    }))
  }
});
new _ObservableObjectBuilder.ObservableObjectBuilder(CircularClass.prototype).writable('array');

function createIterableIterator(iterable) {
  var array, _iterator, _step, item;

  return _regenerator.default.wrap(function createIterableIterator$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          array = (0, _from.default)(iterable);
          _iterator = _createForOfIteratorHelperLoose(array);

        case 2:
          if ((_step = _iterator()).done) {
            _context4.next = 8;
            break;
          }

          item = _step.value;
          _context4.next = 6;
          return item;

        case 6:
          _context4.next = 2;
          break;

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked2);
}

function createIterable(iterable) {
  var _ref;

  var array = (0, _from.default)(iterable);
  return _ref = {}, _ref[_iterator3.default] = function () {
    return createIterableIterator(array);
  }, _ref;
}

function createComplexObject(options) {
  if (options === void 0) {
    options = {};
  }

  var array = [];
  var object = {};
  var circularClass = new CircularClass(array);
  circularClass.value = object;
  (0, _assign.default)(object, {
    _undefined: void 0,
    _null: null,
    _false: false,
    _stringEmpty: '',
    _zero: 0,
    true: true,
    string: 'string',
    date: new Date(12345),
    number: 123.45,
    'nan': NaN,
    'infinity': Infinity,
    '-infinity': -Infinity,
    StringEmpty: new String(''),
    String: new String('String'),
    Number: new Number(123),
    NaN: new Number(NaN),
    Infinity: new Number(Infinity),
    '-Infinity': new Number(-Infinity),
    Boolean: new Boolean(true),
    circularClass: options.circular && options.circularClass && circularClass,
    object: options.circular && object,
    array: options.array && array,
    set: options.set && new _set.default(),
    map: (0, _map2.default)(options) && new _map.default(),
    iterable: options.function && createIterable(array),
    // iterator: options.function && toIterableIterator(array),
    promiseSync: options.function && {
      then: function then(resolve) {
        return resolve(object);
      }
    },
    promiseAsync: options.function && {
      then: function then(resolve) {
        return (0, _setTimeout2.default)(function () {
          return resolve(object);
        }, 0);
      }
    },
    property: new _Property.Property(null, object)
  });

  var valueIsCollection = function valueIsCollection(value) {
    return value && ((0, _helpers.isIterable)(value) || value.constructor === Object);
  };

  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      var value = object[key];

      if (!value && !(0, _startsWith.default)(key).call(key, '_')) {
        delete object[key];
        continue;
      }

      if (options.circular || !valueIsCollection(value)) {
        if (object.sortedList) {
          object.sortedList.add(value);
        }

        if (object.set) {
          object.set.add(value);
        }

        if ((0, _map2.default)(object)) {
          (0, _map2.default)(object).set(value, value);
        }

        if (object.array) {
          array.push(value);
        }
      }
    }
  }

  for (var _iterator2 = _createForOfIteratorHelperLoose((0, _reverse.default)(_context5 = (0, _keys.default)(object)).call(_context5)), _step2; !(_step2 = _iterator2()).done;) {
    var _context5;

    var _key = _step2.value;

    if (Object.prototype.hasOwnProperty.call(object, _key)) {
      var _value = object[_key];

      if (!options.undefined && typeof _value === 'undefined') {
        delete object[_key];
      }

      if (options.circular || !valueIsCollection(_value)) {
        if (object.arraySet && _value && typeof _value === 'object') {
          object.arraySet.add(_value);
        }

        if (object.objectSet) {
          object.objectSet.add(_key);
        }

        if (object.arrayMap && _value && typeof _value === 'object') {
          object.arrayMap.set(_value, _value);
        }

        if (object.objectMap) {
          object.objectMap.set(_key, _value);
        }
      }
    }
  }

  return object;
}
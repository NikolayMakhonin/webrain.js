"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.createIterableIterator = createIterableIterator;
exports.createIterable = createIterable;
exports.createComplexObject = createComplexObject;
exports.CircularClass = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reverse = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reverse"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _iterator3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _mergers = require("../../../../../../main/common/extensions/merge/mergers");

var _serializers = require("../../../../../../main/common/extensions/serialization/serializers");

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _ArrayMap = require("../../../../../../main/common/lists/ArrayMap");

var _ArraySet = require("../../../../../../main/common/lists/ArraySet");

var _ObjectMap = require("../../../../../../main/common/lists/ObjectMap");

var _ObjectSet = require("../../../../../../main/common/lists/ObjectSet");

var _ObservableMap = require("../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _ObservableObject2 = require("../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Property = require("../../../../../../main/common/rx/object/properties/Property");

var _marked2 =
/*#__PURE__*/
_regenerator.default.mark(createIterableIterator);

var CircularClass =
/*#__PURE__*/
function (_ObservableObject) {
  (0, _inherits2.default)(CircularClass, _ObservableObject);

  function CircularClass(array, value) {
    var _this;

    (0, _classCallCheck2.default)(this, CircularClass);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CircularClass).call(this));
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
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue) {
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
}(_ObservableObject2.ObservableObject);

exports.CircularClass = CircularClass;
CircularClass.uuid = 'e729e03fd0f449949f0f97da23c7bab8';
(0, _mergers.registerMergeable)(CircularClass);
(0, _serializers.registerSerializable)(CircularClass, {
  serializer: {
    deSerialize: function (_deSerialize2) {
      var _marked =
      /*#__PURE__*/
      _regenerator.default.mark(deSerialize);

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
    }(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(deSerialize, serializedValue, valueFactory) {
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
  var array, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return _regenerator.default.wrap(function createIterableIterator$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          array = (0, _from.default)(iterable);
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context4.prev = 4;
          _iterator = (0, _getIterator2.default)(array);

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context4.next = 13;
            break;
          }

          item = _step.value;
          _context4.next = 10;
          return item;

        case 10:
          _iteratorNormalCompletion = true;
          _context4.next = 6;
          break;

        case 13:
          _context4.next = 19;
          break;

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](4);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 19:
          _context4.prev = 19;
          _context4.prev = 20;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 22:
          _context4.prev = 22;

          if (!_didIteratorError) {
            _context4.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return _context4.finish(22);

        case 26:
          return _context4.finish(19);

        case 27:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked2, null, [[4, 15, 19, 27], [20,, 22, 26]]);
}

function createIterable(iterable) {
  var array = (0, _from.default)(iterable);
  return (0, _defineProperty2.default)({}, _iterator3.default, function () {
    return createIterableIterator(array);
  });
}

function createComplexObject() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
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
    sortedList: options.sortedList && new _SortedList.SortedList(),
    set: options.set && new _set.default(),
    arraySet: options.arraySet && new _ArraySet.ArraySet(),
    objectSet: options.objectSet && new _ObjectSet.ObjectSet(),
    map: (0, _map2.default)(options) && new _map.default(),
    arrayMap: options.arrayMap && new _ArrayMap.ArrayMap(),
    objectMap: options.objectMap && new _ObjectMap.ObjectMap(),
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
  object.setObservable = options.set && options.observableSet && new _ObservableSet.ObservableSet(object.set);
  object.arraySetObservable = options.arraySet && options.observableSet && new _ObservableSet.ObservableSet(object.arraySet);
  object.objectSetObservable = options.objectSet && options.observableSet && new _ObservableSet.ObservableSet(object.objectSet);
  object.mapObservable = (0, _map2.default)(options) && options.observableMap && new _ObservableMap.ObservableMap((0, _map2.default)(object));
  object.arrayMapObservable = options.arrayMap && options.observableMap && new _ObservableMap.ObservableMap(object.arrayMap);
  object.objectMapObservable = options.objectMap && options.observableMap && new _ObservableMap.ObservableMap(object.objectMap);

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

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator2.default)((0, _reverse.default)(_context5 = (0, _keys.default)(object)).call(_context5)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _context5;

      var _key = _step2.value;

      if (Object.prototype.hasOwnProperty.call(object, _key)) {
        var _value = object[_key];

        if (!options.undefined && typeof _value === 'undefined') {
          delete object[_key];
        }

        if (options.circular || !valueIsCollection(_value)) {
          if (object.arraySet && _value && (0, _typeof2.default)(_value) === 'object') {
            object.arraySet.add(_value);
          }

          if (object.objectSet) {
            object.objectSet.add(_key);
          }

          if (object.arrayMap && _value && (0, _typeof2.default)(_value) === 'object') {
            object.arrayMap.set(_value, _value);
          }

          if (object.objectMap) {
            object.objectMap.set(_key, _value);
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return object;
}
import _typeof from "@babel/runtime/helpers/typeof";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(createIterableIterator);

/* tslint:disable:object-literal-key-quotes no-construct use-primitive-type */
import { registerMergeable } from '../../../../../../main/common/extensions/merge/mergers';
import { registerSerializable } from '../../../../../../main/common/extensions/serialization/serializers';
import { isIterable } from '../../../../../../main/common/helpers/helpers';
import { ArrayMap } from '../../../../../../main/common/lists/ArrayMap';
import { ArraySet } from '../../../../../../main/common/lists/ArraySet';
import { ObjectMap } from '../../../../../../main/common/lists/ObjectMap';
import { ObjectSet } from '../../../../../../main/common/lists/ObjectSet';
import { ObservableMap } from '../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../main/common/lists/SortedList';
import { ObservableObject } from '../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { Property } from '../../../../../../main/common/rx/object/properties/property';
export var CircularClass =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(CircularClass, _ObservableObject);

  function CircularClass(array, value) {
    var _this;

    _classCallCheck(this, CircularClass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CircularClass).call(this));
    _this.array = array;
    _this.value = value;
    return _this;
  } // region IMergeable


  _createClass(CircularClass, [{
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
    _regeneratorRuntime.mark(function deSerialize(_deSerialize, serializedValue) {
      return _regeneratorRuntime.wrap(function deSerialize$(_context) {
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
}(ObservableObject);
CircularClass.uuid = 'e729e03fd0f449949f0f97da23c7bab8';
registerMergeable(CircularClass);
registerSerializable(CircularClass, {
  serializer: {
    deSerialize: function (_deSerialize2) {
      function deSerialize(_x, _x2, _x3) {
        return _deSerialize2.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize2.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var array, value;
          return _regeneratorRuntime.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return deSerialize(serializedValue.array);

                case 2:
                  array = _context2.sent;
                  value = valueFactory(array);
                  _context2.next = 6;
                  return value.deSerialize(deSerialize, serializedValue);

                case 6:
                  return _context2.abrupt("return", value);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee);
        })()
      );
    })
  }
});
new ObservableObjectBuilder(CircularClass.prototype).writable('array');
export function createIterableIterator(iterable) {
  var array, _i, _array, item;

  return _regeneratorRuntime.wrap(function createIterableIterator$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          array = Array.from(iterable);
          _i = 0, _array = array;

        case 2:
          if (!(_i < _array.length)) {
            _context3.next = 9;
            break;
          }

          item = _array[_i];
          _context3.next = 6;
          return item;

        case 6:
          _i++;
          _context3.next = 2;
          break;

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked);
}
export function createIterable(iterable) {
  var array = Array.from(iterable);
  return _defineProperty({}, Symbol.iterator, function () {
    return createIterableIterator(array);
  });
}
export function createComplexObject() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var array = [];
  var object = {};
  var circularClass = new CircularClass(array);
  circularClass.value = object;
  Object.assign(object, {
    _undefined: void 0,
    _null: null,
    _false: false,
    _stringEmpty: '',
    _zero: 0,
    "true": true,
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
    sortedList: options.sortedList && new SortedList(),
    set: options.set && new Set(),
    arraySet: options.arraySet && new ArraySet(),
    objectSet: options.objectSet && new ObjectSet(),
    map: options.map && new Map(),
    arrayMap: options.arrayMap && new ArrayMap(),
    objectMap: options.objectMap && new ObjectMap(),
    iterable: options["function"] && createIterable(array),
    // iterator: options.function && toIterableIterator(array),
    promiseSync: options["function"] && {
      then: function then(resolve) {
        return resolve(object);
      }
    },
    promiseAsync: options["function"] && {
      then: function then(resolve) {
        return setTimeout(function () {
          return resolve(object);
        }, 0);
      }
    },
    property: new Property(null, object)
  });
  object.setObservable = options.set && options.observableSet && new ObservableSet(object.set);
  object.arraySetObservable = options.arraySet && options.observableSet && new ObservableSet(object.arraySet);
  object.objectSetObservable = options.objectSet && options.observableSet && new ObservableSet(object.objectSet);
  object.mapObservable = options.map && options.observableMap && new ObservableMap(object.map);
  object.arrayMapObservable = options.arrayMap && options.observableMap && new ObservableMap(object.arrayMap);
  object.objectMapObservable = options.objectMap && options.observableMap && new ObservableMap(object.objectMap);

  var valueIsCollection = function valueIsCollection(value) {
    return value && (isIterable(value) || value.constructor === Object);
  };

  for (var key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      var value = object[key];

      if (!value && !key.startsWith('_')) {
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

        if (object.map) {
          object.map.set(value, value);
        }

        if (object.array) {
          array.push(value);
        }
      }
    }
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(object).reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _key = _step.value;

      if (Object.prototype.hasOwnProperty.call(object, _key)) {
        var _value = object[_key];

        if (!options.undefined && typeof _value === 'undefined') {
          delete object[_key];
        }

        if (options.circular || !valueIsCollection(_value)) {
          if (object.arraySet && _value && _typeof(_value) === 'object') {
            object.arraySet.add(_value);
          }

          if (object.objectSet) {
            object.objectSet.add(_key);
          }

          if (object.arrayMap && _value && _typeof(_value) === 'object') {
            object.arrayMap.set(_value, _value);
          }

          if (object.objectMap) {
            object.objectMap.set(_key, _value);
          }
        }
      }
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

  return object;
}
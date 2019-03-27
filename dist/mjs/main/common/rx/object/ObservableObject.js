import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import '../extensions/autoConnect';
import { HasSubscribersSubject } from '../subjects/hasSubscribers';
export var ObservableObject =
/*#__PURE__*/
function () {
  function ObservableObject() {
    _classCallCheck(this, ObservableObject);

    Object.defineProperty(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {
        unsubscribers: {},
        propertyChanged: new HasSubscribersSubject()
      }
    });
    Object.defineProperty(this, '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }

  _createClass(ObservableObject, [{
    key: "onPropertyChanged",
    value: function onPropertyChanged() {
      for (var _len = arguments.length, propertyNames = new Array(_len), _key = 0; _key < _len; _key++) {
        propertyNames[_key] = arguments[_key];
      }

      if (propertyNames.length === 0) {
        this.propertyChanged.emit({});
      }

      propertyNames = expandAndDistinct(propertyNames);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = propertyNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var propertyName = _step.value;
          var value = this[propertyName];
          this.propertyChanged.emit({
            name: propertyName,
            oldValue: value,
            newValue: value
          });
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
    key: "_set",
    value: function _set(name, newValue, options) {
      var __fields = this.__fields;
      var oldValue = __fields[name];
      var equalsFunc = options.equalsFunc;

      if (equalsFunc ? equalsFunc(oldValue, newValue) : oldValue === newValue) {
        return false;
      }

      var fillFunc = options.fillFunc;

      if (fillFunc && oldValue != null && newValue != null && fillFunc(oldValue, newValue)) {
        return false;
      }

      var convertFunc = options.convertFunc;

      if (convertFunc) {
        newValue = convertFunc(newValue);
      }

      if (oldValue === newValue) {
        return false;
      }

      var beforeChange = options.beforeChange;

      if (beforeChange) {
        beforeChange(oldValue);
      }

      var _this$__meta = this.__meta,
          propertyChanged = _this$__meta.propertyChanged,
          unsubscribers = _this$__meta.unsubscribers;
      var unsubscribe = unsubscribers[name];

      if (unsubscribe) {
        unsubscribe();
      }

      __fields[name] = newValue;
      unsubscribers[name] = this._propagatePropertyChanged(name, newValue);
      var afterChange = options.afterChange;

      if (afterChange) {
        afterChange(newValue);
      }

      propertyChanged.emit({
        name: name,
        oldValue: oldValue,
        newValue: newValue
      });
      return true;
    }
  }, {
    key: "_propagatePropertyChanged",
    value: function _propagatePropertyChanged(propertyName, value) {
      var _this = this;

      if (!value) {
        return null;
      }

      var propertyChanged = value.propertyChanged;

      if (!propertyChanged) {
        return null;
      }

      var subscriber = function subscriber(event) {
        _this.propertyChanged.emit({
          name: propertyName,
          next: event
        });
      };

      return this.propertyChanged.hasSubscribersObservable.autoConnect(null, function () {
        return propertyChanged.subscribe(subscriber);
      });
    }
  }, {
    key: "propertyChanged",
    get: function get() {
      return this.__meta.propertyChanged;
    }
  }]);

  return ObservableObject;
}();

function expandAndDistinct(inputItems) {
  var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (inputItems == null) {
    return output;
  }

  if (Array.isArray(inputItems)) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = inputItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;
        expandAndDistinct(item, output, map);
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

    return output;
  }

  if (!map[inputItems]) {
    map[inputItems] = true;
    output[output.length] = inputItems;
  }

  return output;
}

export var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    _classCallCheck(this, ObservableObjectBuilder);

    this.object = object || new ObservableObject();
  }

  _createClass(ObservableObjectBuilder, [{
    key: "writable",
    value: function writable(name, options, initValue) {
      if (!options) {
        options = {};
      }

      var object = this.object;
      var __fields = object.__fields;

      if (__fields) {
        __fields[name] = object[name];
      }

      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return this.__fields[name];
        },
        set: function set(newValue) {
          this._set(name, newValue, options);
        }
      });

      if (__fields) {
        if (typeof initValue !== 'undefined') {
          var value = __fields[name];

          if (initValue === value) {
            var unsubscribers = object.__meta.unsubscribers;
            var unsubscribe = unsubscribers[name];

            if (unsubscribe) {
              unsubscribe();
            }

            unsubscribers[name] = object._propagatePropertyChanged(name, value);
          } else {
            object[name] = initValue;
          }
        }
      }

      return this;
    }
  }, {
    key: "readable",
    value: function readable(name, options, value) {
      var object = this.object;
      var __fields = object.__fields;

      if (__fields) {
        __fields[name] = object[name];
      }

      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return this.__fields[name];
        }
      });

      if (__fields) {
        if (typeof value !== 'undefined') {
          var oldValue = __fields[name];
          var unsubscribers = object.__meta.unsubscribers;
          var unsubscribe = unsubscribers[name];

          if (unsubscribe) {
            unsubscribe();
          }

          unsubscribers[name] = object._propagatePropertyChanged(name, value);

          if (value !== oldValue) {
            __fields[name] = value;
            var propertyChanged = object.__meta.propertyChanged;
            propertyChanged.emit({
              name: name,
              oldValue: oldValue,
              newValue: value
            });
          }
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var object = this.object;
      var oldValue = object[name];
      var __fields = object.__fields,
          __meta = object.__meta;

      if (__meta) {
        var unsubscribers = __meta.unsubscribers;
        var unsubscribe = unsubscribers[name];

        if (unsubscribe) {
          unsubscribe();
        }
      }

      delete object[name];

      if (__meta) {
        delete __fields[name];

        if (typeof oldValue !== 'undefined') {
          var propertyChanged = __meta.propertyChanged;
          propertyChanged.emit({
            name: name,
            oldValue: oldValue
          });
        }
      }

      return this;
    }
  }]);

  return ObservableObjectBuilder;
}();
import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import '../extensions/autoConnect';
import { HasSubscribersSubject } from '../subjects/hasSubscribers';

function expandAndDistinct(inputItems) {
  var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (inputItems == null) {
    return output;
  }

  if (Array.isArray(inputItems)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = inputItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        expandAndDistinct(item, output, map);
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

    return output;
  }

  if (!map[inputItems]) {
    map[inputItems] = true;
    output[output.length] = inputItems;
  }

  return output;
}

export var ObservableObject =
/*#__PURE__*/
function () {
  /** @internal */

  /** @internal */
  function ObservableObject() {
    _classCallCheck(this, ObservableObject);

    Object.defineProperty(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {
        unsubscribers: {}
      }
    });
    Object.defineProperty(this, '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  } // region propertyChanged


  _createClass(ObservableObject, [{
    key: "_emitPropertyChanged",
    value: function _emitPropertyChanged(eventsOrPropertyNames, emitFunc) {
      var _this = this;

      if (eventsOrPropertyNames === null) {
        return;
      }

      var toEvent = function toEvent(event) {
        if (event == null) {
          return {};
        }

        if (_typeof(event) !== 'object') {
          var value = _this[event];
          event = {
            name: event,
            oldValue: value,
            newValue: value
          };
        }

        return event;
      };

      if (!Array.isArray(eventsOrPropertyNames)) {
        emitFunc(toEvent(eventsOrPropertyNames));
      } else {
        var items = expandAndDistinct(eventsOrPropertyNames);

        for (var i = 0, len = items.length; i < len; i++) {
          emitFunc(toEvent(items[i]));
        }
      }
    }
  }, {
    key: "onPropertyChanged",
    value: function onPropertyChanged(eventsOrPropertyNames) {
      var _this$__meta = this.__meta,
          propertyChanged = _this$__meta.propertyChanged,
          deepPropertyChanged = _this$__meta.deepPropertyChanged;

      if (!propertyChanged && !deepPropertyChanged) {
        return this;
      }

      this._emitPropertyChanged(eventsOrPropertyNames, function (event) {
        if (propertyChanged) {
          propertyChanged.emit(event);
        }

        if (deepPropertyChanged) {
          deepPropertyChanged.emit(event);
        }
      });

      return this;
    }
  }, {
    key: "onDeepPropertyChanged",
    value: function onDeepPropertyChanged(eventsOrPropertyNames) {
      var deepPropertyChanged = this.__meta.deepPropertyChanged;

      if (!deepPropertyChanged) {
        return this;
      }

      this._emitPropertyChanged(eventsOrPropertyNames, function (event) {
        deepPropertyChanged.emit(event);
      });

      return this;
    } // endregion

    /** @internal */

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

      var unsubscribers = this.__meta.unsubscribers;
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

      this.onPropertyChanged({
        name: name,
        oldValue: oldValue,
        newValue: newValue
      });
      return true;
    }
    /** @internal */

  }, {
    key: "_propagatePropertyChanged",
    value: function _propagatePropertyChanged(propertyName, value) {
      var _this2 = this;

      if (!value) {
        return null;
      }

      var deepPropertyChanged = value.deepPropertyChanged;

      if (!deepPropertyChanged) {
        return null;
      }

      var subscriber = function subscriber(event) {
        _this2.deepPropertyChanged.emit({
          name: propertyName,
          next: event
        });
      };

      return this.deepPropertyChanged.hasSubscribersObservable.autoConnect(null, function () {
        return deepPropertyChanged.subscribe(subscriber);
      });
    }
  }, {
    key: "propertyChanged",
    get: function get() {
      var propertyChanged = this.__meta.propertyChanged;

      if (!propertyChanged) {
        this.__meta.propertyChanged = propertyChanged = new HasSubscribersSubject();
      }

      return propertyChanged;
    }
  }, {
    key: "deepPropertyChanged",
    get: function get() {
      var deepPropertyChanged = this.__meta.deepPropertyChanged;

      if (!deepPropertyChanged) {
        this.__meta.deepPropertyChanged = deepPropertyChanged = new HasSubscribersSubject();
      }

      return deepPropertyChanged;
    }
  }]);

  return ObservableObject;
}();
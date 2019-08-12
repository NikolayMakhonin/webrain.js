import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
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

export var PropertyChangedObject =
/*#__PURE__*/
function () {
  /** @internal */
  function PropertyChangedObject() {
    _classCallCheck(this, PropertyChangedObject);

    Object.defineProperty(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  } // region propertyChanged


  _createClass(PropertyChangedObject, [{
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
      var __meta = this.__meta;

      if (!__meta) {
        return this;
      }

      var _this$__meta = this.__meta,
          propertyChanged = _this$__meta.propertyChanged,
          propertyChangedDisabled = _this$__meta.propertyChangedDisabled;

      if (!propertyChanged || propertyChangedDisabled) {
        return this;
      }

      this._emitPropertyChanged(eventsOrPropertyNames, function (event) {
        if (propertyChanged) {
          propertyChanged.emit(event);
        }
      });

      return this;
    } // endregion

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
    key: "_propertyChangedIfCanEmit",
    get: function get() {
      var _this$__meta2 = this.__meta,
          propertyChangedDisabled = _this$__meta2.propertyChangedDisabled,
          propertyChanged = _this$__meta2.propertyChanged;
      return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
    }
  }]);

  return PropertyChangedObject;
}();
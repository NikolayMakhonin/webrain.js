import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { HasSubscribersSubject } from '../subjects/hasSubscribers';
// function expandAndDistinct(inputItems: any, output: string[] = [], map: any = {}): string[] {
// 	if (inputItems == null) {
// 		return output
// 	}
//
// 	if (Array.isArray(inputItems)) {
// 		for (const item of inputItems) {
// 			expandAndDistinct(item, output, map)
// 		}
// 		return output
// 	}
//
// 	if (!map[inputItems]) {
// 		map[inputItems] = true
// 		output[output.length] = inputItems
// 	}
//
// 	return output
// }
export var PropertyChangedSubject =
/*#__PURE__*/
function (_HasSubscribersSubjec) {
  _inherits(PropertyChangedSubject, _HasSubscribersSubjec);

  function PropertyChangedSubject(object) {
    var _this;

    _classCallCheck(this, PropertyChangedSubject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyChangedSubject).call(this));
    _this._object = object;
    return _this;
  }

  _createClass(PropertyChangedSubject, [{
    key: "onPropertyChanged",
    value: function onPropertyChanged() {
      for (var i = 0, len = arguments.length; i < len; i++) {
        var event = i < 0 || arguments.length <= i ? undefined : arguments[i];

        if (event == null) {
          event = {};
        }

        if (_typeof(event) !== 'object') {
          var value = this._object[event];
          event = {
            name: event,
            oldValue: value,
            newValue: value
          };
        }

        this.emit(event);
      }

      return this;
    }
  }]);

  return PropertyChangedSubject;
}(HasSubscribersSubject);
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
  }
  /** @internal */


  _createClass(PropertyChangedObject, [{
    key: "_setUnsubscriber",
    value: function _setUnsubscriber(propertyName, unsubscribe) {
      var __meta = this.__meta;
      var unsubscribers = __meta.unsubscribers;

      if (unsubscribers) {
        var oldUnsubscribe = unsubscribers[propertyName];

        if (oldUnsubscribe) {
          oldUnsubscribe();
        }
      }

      if (unsubscribe) {
        if (!unsubscribers) {
          __meta.unsubscribers = unsubscribers = {};
        }

        unsubscribers[propertyName] = unsubscribe;
      }
    } // region propertyChanged

  }, {
    key: "propertyChanged",
    get: function get() {
      var propertyChanged = this.__meta.propertyChanged;

      if (!propertyChanged) {
        this.__meta.propertyChanged = propertyChanged = new PropertyChangedSubject(this);
      }

      return propertyChanged;
    }
  }, {
    key: "propertyChangedIfCanEmit",
    get: function get() {
      var _this$__meta = this.__meta,
          propertyChangedDisabled = _this$__meta.propertyChangedDisabled,
          propertyChanged = _this$__meta.propertyChanged;
      return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
    } // endregion

  }]);

  return PropertyChangedObject;
}();
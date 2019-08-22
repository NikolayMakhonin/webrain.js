import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var PropertyChangedEvent =
/*#__PURE__*/
function () {
  function PropertyChangedEvent(name, oldValue, getNewValue) {
    _classCallCheck(this, PropertyChangedEvent);

    this.name = name;
    this.oldValue = oldValue;
    this._getNewValue = getNewValue;
  }

  _createClass(PropertyChangedEvent, [{
    key: "newValue",
    get: function get() {
      return this._getNewValue();
    }
  }]);

  return PropertyChangedEvent;
}();
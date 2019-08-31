import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
// Is slower than simple object
// export class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
// 	public name: string
// 	public oldValue: TValue
// 	public newValue: TValue
//
// 	constructor(name, oldValue: TValue, newValue: TValue) {
// 		this.name = name
// 		this.oldValue = oldValue
// 		this.newValue = newValue
// 	}
// }
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
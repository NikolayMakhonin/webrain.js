"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.PropertyChangedEvent = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

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
var PropertyChangedEvent =
/*#__PURE__*/
function () {
  function PropertyChangedEvent(name, oldValue, getNewValue) {
    (0, _classCallCheck2.default)(this, PropertyChangedEvent);
    this.name = name;
    this.oldValue = oldValue;
    this._getNewValue = getNewValue;
  }

  (0, _createClass2.default)(PropertyChangedEvent, [{
    key: "newValue",
    get: function get() {
      return this._getNewValue();
    }
  }]);
  return PropertyChangedEvent;
}();

exports.PropertyChangedEvent = PropertyChangedEvent;
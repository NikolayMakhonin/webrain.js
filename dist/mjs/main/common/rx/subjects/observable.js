import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    _classCallCheck(this, Observable);
  }

  _createClass(Observable, [{
    key: "call",
    value: function call(func) {
      return func(this);
    }
  }]);

  return Observable;
}();
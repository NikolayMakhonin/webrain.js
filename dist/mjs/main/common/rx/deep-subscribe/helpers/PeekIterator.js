import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
export var PeekIterator =
/*#__PURE__*/
function () {
  function PeekIterator(iterator) {
    _classCallCheck(this, PeekIterator);

    this._iterator = iterator;
  }

  _createClass(PeekIterator, [{
    key: "next",
    value: function next() {
      var iteration = this._buffer;

      if (iteration) {
        this._buffer = null;
        return iteration;
      }

      return this._iterator.next();
    }
  }, {
    key: "peek",
    value: function peek() {
      var iteration = this._buffer;

      if (!iteration) {
        this._buffer = iteration = this._iterator.next();
      }

      return iteration;
    }
  }]);

  return PeekIterator;
}();
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
var _Symbol$iterator = Symbol.iterator;
export var SortedList =
/*#__PURE__*/
function () {
  function SortedList() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        list = _ref.list,
        compare = _ref.compare,
        autoSort = _ref.autoSort,
        notAddIfExists = _ref.notAddIfExists;

    _classCallCheck(this, SortedList);

    this._list = [];

    // Object.assign(this, options)
    if (list) {
      this.addAll(list);
    }

    if (compare) {
      this._compare = compare;
    }

    if (autoSort) {
      this._autoSort = autoSort;
    }

    if (notAddIfExists) {
      this._notAddIfExists = notAddIfExists;
    }
  } // region Properties
  // region countSorted


  _createClass(SortedList, [{
    key: "addAll",
    // endregion
    // endregion
    value: function addAll(iterable) {// TODO
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this._list[Symbol.iterator]();
    }
  }, {
    key: "countSorted",
    get: function get() {
      return this._countSorted;
    } // endregion
    // region countSorted

  }, {
    key: "compare",
    get: function get() {
      return this._compare;
    } // endregion
    // region countSorted

  }, {
    key: "autoSort",
    get: function get() {
      return this._autoSort;
    },
    set: function set(value) {
      // tslint:disable-next-line:triple-equals
      if (this._autoSort == value) {
        this._autoSort = value;
        return;
      }

      this._autoSort = value; // if (value && this._countSorted !== this._count && CollectionChangedExt != null)
      // {
      // 	OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Resorted, -1, -1, null, null));
      // }
    }
  }]);

  return SortedList;
}();
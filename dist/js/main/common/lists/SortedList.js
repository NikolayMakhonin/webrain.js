"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortedList = void 0;
var _Symbol$iterator = Symbol.iterator;

class SortedList {
  constructor({
    list,
    compare,
    autoSort,
    notAddIfExists
  } = {}) {
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


  get countSorted() {
    return this._countSorted;
  } // endregion
  // region countSorted


  get compare() {
    return this._compare;
  } // endregion
  // region countSorted


  get autoSort() {
    return this._autoSort;
  }

  set autoSort(value) {
    // tslint:disable-next-line:triple-equals
    if (this._autoSort == value) {
      this._autoSort = value;
      return;
    }

    this._autoSort = value; // if (value && this._countSorted !== this._count && CollectionChangedExt != null)
    // {
    // 	OnCollectionChanged(new CollectionChangedEventArgs<T>(CollectionChangedType.Resorted, -1, -1, null, null));
    // }
  } // endregion
  // endregion


  addAll(iterable) {// TODO
  }

  [_Symbol$iterator]() {
    return this._list[Symbol.iterator]();
  }

}

exports.SortedList = SortedList;
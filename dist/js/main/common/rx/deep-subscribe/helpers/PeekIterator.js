"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PeekIterator = void 0;

class PeekIterator {
  constructor(iterator) {
    this._iterator = iterator;
  }

  next() {
    const iteration = this._buffer;

    if (iteration) {
      this._buffer = null;
      return iteration;
    }

    return this._iterator.next();
  }

  peek() {
    let iteration = this._buffer;

    if (!iteration) {
      this._buffer = iteration = this._iterator.next();
    }

    return iteration;
  }

}

exports.PeekIterator = PeekIterator;
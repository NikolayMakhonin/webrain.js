"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;

class Observable {
  call(func) {
    return func(this);
  }

}

exports.Observable = Observable;
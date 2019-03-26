"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;
const Observable = class {
  constructor(fields) {
    Object.assign(this, fields);
  }

  call(func) {
    return func(this);
  }

};
exports.Observable = Observable;
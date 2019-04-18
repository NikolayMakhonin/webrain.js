"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timingDefault = void 0;
const timingDefault = {
  now: Date.now,
  setTimeout: typeof window === 'undefined' ? setTimeout : setTimeout.bind(window),
  clearTimeout: typeof window === 'undefined' ? clearTimeout : clearTimeout.bind(window)
};
exports.timingDefault = timingDefault;
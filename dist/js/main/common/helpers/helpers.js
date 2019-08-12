"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIterable = isIterable;
exports.isIterator = isIterator;
exports.typeToDebugString = typeToDebugString;
exports.delay = delay;
exports.EMPTY = void 0;

function isIterable(value) {
  return value && typeof value[Symbol.iterator] === 'function';
}

function isIterator(value) {
  return value && typeof value[Symbol.iterator] === 'function' && typeof value.next === 'function';
}

function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable


const EMPTY = function EMPTY() {};

exports.EMPTY = EMPTY;

function delay(timeMilliseconds) {
  return new Promise(resolve => setTimeout(resolve, timeMilliseconds));
}
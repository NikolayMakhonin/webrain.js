"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateArray = generateArray;
exports.toIterable = toIterable;
exports.shuffle = shuffle;
exports.indexOfNaN = indexOfNaN;
exports.allValues = void 0;

function generateArray(size) {
  const arr = [];

  for (let i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}

function* toIterable(array) {
  for (const item of array) {
    yield item;
  }
}

function shuffle(array) {
  return array.slice().sort(() => Math.random() > 0.5 ? 1 : -1);
}

const allValues = [[], {}, '', 'NaN', 'null', 'undefined', '0', '1', 'true', 'false', 0, 1, true, false, null, undefined, -Infinity, Infinity, NaN];
exports.allValues = allValues;

function indexOfNaN(array) {
  for (let i = 0, len = array.length; i < len; i++) {
    const item = array[i];

    if (item !== item) {
      return i;
    }
  }
}
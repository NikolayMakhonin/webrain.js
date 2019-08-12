"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateArray = generateArray;
exports.shuffle = shuffle;
exports.indexOfNaN = indexOfNaN;
exports.convertToObject = convertToObject;
exports.allValues = void 0;

var _Assert = require("../../../../../../../main/common/test/Assert");

function generateArray(size) {
  const arr = [];

  for (let i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
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

const valueToObjectMap = new Map();

function convertToObject(value) {
  if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'value')) {
    _Assert.assert.fail('typeof value === ' + typeof value);
  }

  let obj = valueToObjectMap.get(value);

  if (!obj) {
    valueToObjectMap.set(value, obj = {
      value
    });
  }

  return obj;
}
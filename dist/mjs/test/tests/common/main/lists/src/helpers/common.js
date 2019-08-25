import _typeof from "@babel/runtime/helpers/typeof";
import { assert } from '../../../../../../../main/common/test/Assert';
export function generateArray(size) {
  var arr = [];

  for (var i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}
export function shuffle(array) {
  return array.slice().sort(function () {
    return Math.random() > 0.5 ? 1 : -1;
  });
}
export var allValues = [[], {}, '', 'NaN', 'null', 'undefined', '0', '1', 'true', 'false', 0, 1, true, false, null, undefined, -Infinity, Infinity, NaN];
export function indexOfNaN(array) {
  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i];

    if (item !== item) {
      return i;
    }
  }
}
var valueToObjectMap = new Map();
export function convertToObject(value) {
  if (value && _typeof(value) === 'object' && Object.prototype.hasOwnProperty.call(value, 'value')) {
    assert.fail('typeof value === ' + _typeof(value));
  }

  var obj = valueToObjectMap.get(value);

  if (!obj) {
    valueToObjectMap.set(value, obj = {
      value: value
    });
  }

  return obj;
}
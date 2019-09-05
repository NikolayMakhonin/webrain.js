import { assert } from '../../../../../../../main/common/test/Assert';
export function generateArray(size) {
  const arr = [];

  for (let i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}
export function shuffle(array) {
  return array.slice().sort(() => Math.random() > 0.5 ? 1 : -1);
}
export const allValues = [[], {}, '', 'NaN', 'null', 'undefined', '0', '1', 'true', 'false', 0, 1, true, false, null, undefined, -Infinity, Infinity, NaN];
export function indexOfNaN(array) {
  for (let i = 0, len = array.length; i < len; i++) {
    const item = array[i];

    if (item !== item) {
      return i;
    }
  }
}
const valueToObjectMap = new Map();
export function convertToObject(value) {
  if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'value')) {
    assert.fail('typeof value === ' + typeof value);
  }

  let obj = valueToObjectMap.get(value);

  if (!obj) {
    valueToObjectMap.set(value, obj = {
      value
    });
  }

  return obj;
}
"use strict";

exports.__esModule = true;
exports.defaultCompare = defaultCompare;
exports.binarySearch = binarySearch;
exports.move = move;

function defaultCompare(o1, o2) {
  if (o1 < o2) {
    return -1;
  }

  if (o1 > o2) {
    return 1;
  }

  return 0;
}
/**
 * @param array sorted array with compare func
 * @param item search item
 * @param start (optional) start index
 * @param end (optional) exclusive end index
 * @param compare (optional) custom compare func
 * @param bound (optional) (-1) first index; (1) last index; (0) doesn't matter
 */


function binarySearch(array, item, start, end, compare, bound) {
  if (!compare) {
    compare = defaultCompare;
  }

  var from = start == null ? 0 : start;
  var to = (end == null ? array.length : end) - 1;

  if (to < from) {
    return ~from;
  }

  var found = -1;

  while (from <= to) {
    var middle = from + to >>> 1;
    var compareResult = compare(array[middle], item);

    if (compareResult < 0) {
      from = middle + 1;
    } else if (compareResult > 0) {
      to = middle - 1;
    } else if (!bound) {
      return middle;
    } else if (bound < 0) {
      // First occurrence:
      found = middle;
      to = middle - 1;
    } else {
      // Last occurrence:
      found = middle;
      from = middle + 1;
    }
  }

  return found >= 0 ? found : -from - 1;
}

function move(array, start, end, moveIndex) {
  if (start >= end) {
    return false;
  }

  var len = array.length;

  if (len === 0) {
    return false;
  }

  var maxIndex = len - end + start;

  if (moveIndex > maxIndex) {
    moveIndex = maxIndex;
  }

  if (moveIndex === start) {
    return false;
  }

  var rangeLen = end - start;
  var shiftIn = moveIndex - start;
  var shiftOut = shiftIn > 0 ? -rangeLen : rangeLen;
  var count = 0;
  var startIndex = start;

  while (true) {
    var index = startIndex;
    var bufferItem = array[index];

    while (true) {
      index = index >= start && index < end ? index + shiftIn : index + shiftOut;
      count++;

      if (index !== startIndex) {
        var newBufferItem = array[index];
        array[index] = bufferItem;
        bufferItem = newBufferItem;
      } else {
        array[index] = bufferItem;
        break;
      }
    }

    if (count > rangeLen) {
      break;
    }

    startIndex++;
  }

  return true;
}
export function defaultCompare(o1, o2) {
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

export function binarySearch(array, item, start, end, compare, bound) {
  if (!compare) {
    compare = defaultCompare;
  }

  let from = start == null ? 0 : start;
  let to = (end == null ? array.length : end) - 1;

  if (to < from) {
    return ~from;
  }

  let found = -1;

  while (from <= to) {
    const middle = from + to >>> 1;
    const compareResult = compare(array[middle], item);

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
export function move(array, start, end, moveIndex) {
  if (start >= end) {
    return false;
  }

  const len = array.length;

  if (len === 0) {
    return false;
  }

  const maxIndex = len - end + start;

  if (moveIndex > maxIndex) {
    moveIndex = maxIndex;
  }

  if (moveIndex === start) {
    return false;
  }

  const rangeLen = end - start;
  const shiftIn = moveIndex - start;
  const shiftOut = shiftIn > 0 ? -rangeLen : rangeLen;
  let count = 0;
  let startIndex = start;

  while (true) {
    let index = startIndex;
    let bufferItem = array[index];

    while (true) {
      index = index >= start && index < end ? index + shiftIn : index + shiftOut;
      count++;

      if (index !== startIndex) {
        const newBufferItem = array[index];
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
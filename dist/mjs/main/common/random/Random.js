// from here: https://stackoverflow.com/a/47593316/5221762
import { uuid } from './uuid';

function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
/** Usage:
	* 1) arrayShuffle(array, () => Math.random())
	* 2) arrayShuffle(array, () => rnd.next())
	*/


export function arrayShuffle(array, rnd) {
  array.sort(() => rnd() > 0.5 ? 1 : -1);
  return array;
}
const randomWithoutSeed = Math.random.bind(Math);
/** Generate random number in range [0..1) like Math.random() or other, but can be pseudorandom with seed */

export class Random {
  constructor(seed) {
    this._rnd = seed ? mulberry32(seed) : randomWithoutSeed;
  }

  next() {
    return this._rnd();
  }

  nextRange(from, to) {
    return this._rnd() * (to - from) + from;
  }

  nextInt(from, toExclusive) {
    if (toExclusive == null) {
      toExclusive = from;
      from = 0;
    }

    return Math.floor(this._rnd() * (toExclusive - from) + from);
  }

  nextBoolean(trueProbability = 0.5) {
    return this._rnd() < trueProbability;
  }

  nextBooleanOrNull(trueWeight = 1, falseWeight = 1, nullWeight = 1) {
    const value = this.next() * (trueWeight + falseWeight + nullWeight);

    if (value < trueWeight) {
      return true;
    }

    if (value < trueWeight + falseWeight) {
      return false;
    }

    return null;
  }

  nextTime(from, toExclusive) {
    if (from instanceof Date) {
      from = from.getTime();
    }

    if (toExclusive instanceof Date) {
      toExclusive = toExclusive.getTime();
    }

    return this.nextInt(from, toExclusive);
  }

  nextDate(from, toExclusive) {
    if (from instanceof Date) {
      from = from.getTime();
    }

    if (toExclusive instanceof Date) {
      toExclusive = toExclusive.getTime();
    }

    return new Date(this.nextInt(from, toExclusive));
  }

  pullArrayItem(array) {
    const len = array.length;
    const index = this.nextInt(len);
    const item = array[index]; // remove item with shift

    for (let i = index + 1; i < len; i++) {
      array[i - 1] = array[i];
    }

    array.length = len - 1;
    return item;
  }

  nextArrayItem(array) {
    return array[this.nextInt(array.length)];
  }

  nextArrayItems(array, minCount, relativeMaxCount) {
    arrayShuffle(array, () => this.next());
    const result = [];
    const count = this.nextInt(Math.round(array.length * relativeMaxCount));
    return array.slice(0, count);
  }

  nextColor() {
    return '#' + this.nextInt(0x1000000).toString(16);
  }

  nextEnum(enumType) {
    return this.nextArrayItem(Object.values(enumType));
  }

  nextUuid() {
    return uuid(() => this.next());
  }

}
Random.arrayShuffle = arrayShuffle;
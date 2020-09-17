import { isIterable } from '../../helpers/helpers';
import { MergeObjectWrapper } from './merge-maps';
export class MergeSetWrapper {
  constructor(set) {
    this._set = set;
  }

  delete(key) {
    this._set.delete(key);
  }

  forEachKeys(callbackfn) {
    for (const key of this._set) {
      callbackfn(key);
    }
  }

  get(key) {
    return key;
  }

  has(key) {
    return this._set.has(key);
  }

  set(key, value) {
    this._set.add(value);
  }

}
export function createMergeSetWrapper(target, source, arrayOrIterableToSet) {
  if (source[Symbol.toStringTag] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && (Array.isArray(source) || isIterable(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source, true);
  }

  throw new Error(`${target.constructor.name} cannot be merge with ${source.constructor.name}`);
}
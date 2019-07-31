import {IMergeOptions, IMergeValue} from './contracts'
import {IMergeMapWrapper, mergeMapWrappers, MergeObjectWrapper} from './merge-maps'

export class MergeSetWrapper<V> implements IMergeMapWrapper<V, V> {
	private readonly _set: Set<V>

	constructor(set: Set<V>) {
		this._set = set
	}

	public delete(key: V): void {
		this._set.delete(key)
	}

	public forEachKeys(callbackfn: (key: V) => void): void {
		for (const key of this._set) {
			callbackfn(key)
		}
	}

	public get(key: V): V {
		return key
	}

	public has(key: V): boolean {
		return this._set.has(key)
	}

	public set(key: V, value: V): void {
		this._set.add(value)
	}
}

export function createMergeSetWrapper<V>(
	target: object | Set<V> | V[] | Iterable<V>,
	source: object | Set<V> | V[] | Iterable<V>,
	arrayOrIterableToSet: (array) => object | Set<V>,
) {
	if (source[Symbol.toStringTag] === 'Set') {
		return new MergeSetWrapper(source as Set<V>)
	}

	if (arrayOrIterableToSet && (Array.isArray(source) || Symbol.iterator in source)) {
		return createMergeSetWrapper(target, arrayOrIterableToSet(source), null)
	}

	if (source.constructor === Object) {
		return new MergeObjectWrapper(source, true)
	}

	throw new Error(`${target.constructor.name} cannot be merge with ${source.constructor.name}`)
}

export function mergeSets<TObject extends object>(
	arrayOrIterableToSet: (arrayOrIterable) => object | Set<any>,
	merge: IMergeValue,
	base: TObject,
	older: TObject,
	newer: TObject,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
	options?: IMergeOptions,
): boolean {
	const baseWrapper = createMergeSetWrapper(base, base, arrayOrIterableToSet)
	const olderWrapper = older === base ? baseWrapper : createMergeSetWrapper(base, older, arrayOrIterableToSet)
	const newerWrapper = newer === base
		? baseWrapper
		: (newer === older ? olderWrapper : createMergeSetWrapper(base, newer, arrayOrIterableToSet))

	return mergeMapWrappers(
		merge,
		baseWrapper,
		olderWrapper,
		newerWrapper,
		preferCloneOlder,
		preferCloneNewer,
		options,
	)
}

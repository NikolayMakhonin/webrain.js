/* tslint:disable:no-identical-functions */
import {IMergeValue} from './contracts'

// tslint:disable-next-line:no-empty no-shadowed-variable
const NONE: any = function NONE() {}

// // 13865 cycles
// export function mergeObjectOld<TObject extends object>(
// 	merge: IMergeValue,
// 	base: TObject,
// 	older: TObject,
// 	newer: TObject,
// 	preferCloneOlder?: boolean,
// 	preferCloneNewer?: boolean,
// ): boolean {
// 	let changed = false
//
// 	let deleted
//
// 	const deleteItem = (key: string) => {
// 		if (!deleted) {
// 			deleted = { [key]: true }
// 		} else {
// 			deleted[key] = true
// 		}
// 		delete base[key]
// 		changed = true
// 	}
//
// 	for (const key in base) {
// 		if (!Object.prototype.hasOwnProperty.call(older, key)
// 			|| !Object.prototype.hasOwnProperty.call(newer, key)
// 		) {
// 			deleteItem(key)
// 		}
// 	}
//
// 	for (const key in newer) {
// 		if (Object.prototype.hasOwnProperty.call(newer, key) && (!deleted || !deleted[key])) {
// 			const baseItem = Object.prototype.hasOwnProperty.call(base, key)
// 				? base[key]
// 				: NONE
//
// 			const newerItem = newer[key]
//
// 			const olderItem = newer === older
// 				? newerItem
// 				: (Object.prototype.hasOwnProperty.call(older, key)
// 					? older[key]
// 					: NONE)
//
// 			changed = merge(baseItem, olderItem, newerItem, o => {
// 				if (o === NONE) {
// 					deleteItem(key)
// 				} else {
// 					base[key] = o
// 				}
// 			}, preferCloneOlder, preferCloneNewer) || changed
// 		}
// 	}
//
// 	if (older !== newer) {
// 		for (const key in older) {
// 			if (!Object.prototype.hasOwnProperty.call(newer, key) && (!deleted || !deleted[key])) {
// 				const baseItem = Object.prototype.hasOwnProperty.call(base, key)
// 					? base[key]
// 					: NONE
//
// 				const olderItem = Object.prototype.hasOwnProperty.call(older, key)
// 					? older[key]
// 					: NONE
//
// 				changed = merge(baseItem, olderItem, olderItem, o => {
// 					if (o === NONE) {
// 						deleteItem(key)
// 					} else {
// 						base[key] = o
// 					}
// 				}, preferCloneOlder, preferCloneOlder) || changed
// 			}
// 		}
// 	}
//
// 	return changed
// }
//
// // 7984 cycles
// export function mergeObjectOld2<TObject extends object>(
// 	merge: IMergeValue,
// 	base: TObject,
// 	older: TObject,
// 	newer: TObject,
// 	preferCloneOlder?: boolean,
// 	preferCloneNewer?: boolean,
// ): boolean {
// 	let changed = false
//
// 	const addItems = []
//
// 	const fill = (
// 		olderItem: any,
// 		newerItem: any,
// 	): any => {
// 		let setItem: any = NONE
//
// 		merge(NONE, olderItem, newerItem, o => {
// 			setItem = o
// 		}, preferCloneOlder, preferCloneNewer)
//
// 		if (setItem === NONE) {
// 			throw new Error('setItem === NONE')
// 		}
//
// 		return setItem
// 	}
//
// 	if (older === newer) {
// 		// [- n n]
// 		for (const key in newer) {
// 			if (Object.prototype.hasOwnProperty.call(newer, key)
// 				&& !Object.prototype.hasOwnProperty.call(base, key)
// 			) {
// 				addItems.push([key, fill(NONE, newer[key])])
// 			}
// 		}
// 	} else {
// 		// [- - n]
// 		for (const key in newer) {
// 			if (Object.prototype.hasOwnProperty.call(newer, key)
// 				&& !Object.prototype.hasOwnProperty.call(base, key)
// 				&& !Object.prototype.hasOwnProperty.call(older, key)
// 			) {
// 				addItems.push([key, fill(NONE, newer[key])])
// 			}
// 		}
//
// 		// [- o *]
// 		for (const key in older) {
// 			if (Object.prototype.hasOwnProperty.call(older, key)
// 				&& !Object.prototype.hasOwnProperty.call(base, key)
// 			) {
// 				if (!Object.prototype.hasOwnProperty.call(newer, key)) {
// 					addItems.push([key, fill(older[key], NONE)])
// 				} else {
// 					addItems.push([key, fill(older[key], newer[key])])
// 				}
// 			}
// 		}
// 	}
//
// 	// [b * *]
// 	for (const key in base) {
// 		if (Object.prototype.hasOwnProperty.call(base, key)) {
// 			changed = merge(
// 				base[key],
// 				Object.prototype.hasOwnProperty.call(older, key) ? older[key] : NONE,
// 				Object.prototype.hasOwnProperty.call(newer, key) ? newer[key] : NONE,
// 				o => {
// 					if ((o as any) === NONE) {
// 						delete base[key]
// 						changed = true
// 					} else {
// 						base[key] = o
// 					}
// 				}, preferCloneOlder, preferCloneNewer) || changed
// 		}
// 	}
//
// 	const len = addItems.length
// 	if (len > 0) {
// 		changed = true
// 		for (let i = 0; i < len; i++) {
// 			const addItem = addItems[i]
// 			base[addItem[0]] = addItem[1]
// 		}
// 	}
//
// 	return changed
// }

interface IMergeMapWrapper<K, V> {
	has(key: K): boolean
	get(key: K): V
	set(key: K, value: V): void
	delete(key: K): void
	forEachKeys(callbackfn: (key: K) => void): void
}

function mergeMapWrappers<K, V>(
	merge: IMergeValue,
	base: IMergeMapWrapper<K, V>,
	older: IMergeMapWrapper<K, V>,
	newer: IMergeMapWrapper<K, V>,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
): boolean {
	let changed = false

	const addItems = []

	const fill = (
		olderItem: V,
		newerItem: V,
	): V => {
		let setItem: V = NONE

		merge(NONE, olderItem, newerItem, o => {
			setItem = o
		}, preferCloneOlder, preferCloneNewer)

		if (setItem === NONE) {
			throw new Error('setItem === NONE')
		}

		return setItem
	}

	if (older === newer) {
		// [- n n]
		newer.forEachKeys(key => {
			if (!base.has(key)) {
				addItems.push([key, fill(NONE, newer.get(key))])
			}
		})
	} else {
		// [- - n]
		newer.forEachKeys(key => {
			if (!base.has(key) && !older.has(key)) {
				addItems.push([key, fill(NONE, newer.get(key))])
			}
		})

		// [- o *]
		older.forEachKeys(key => {
			if (!base.has(key)) {
				if (!newer.has(key)) {
					addItems.push([key, fill(older.get(key), NONE)])
				} else {
					addItems.push([key, fill(older.get(key), newer.get(key))])
				}
			}
		})
	}

	// [b * *]
	base.forEachKeys(key => {
		changed = merge(
			base.get(key),
			older.has(key) ? older.get(key) : NONE,
			newer.has(key) ? newer.get(key) : NONE,
			o => {
				if ((o as any) === NONE) {
					base.delete(key)
					changed = true
				} else {
					base.set(key, o)
				}
			}, preferCloneOlder, preferCloneNewer) || changed
	})

	const len = addItems.length
	if (len > 0) {
		changed = true
		for (let i = 0; i < len; i++) {
			base.set.apply(base, addItems[i])
		}
	}

	return changed
}

export class MergeObjectWrapper implements IMergeMapWrapper<string, any> {
	private readonly _object: { [key: string]: any }

	constructor(object: { [key: string]: any }) {
		this._object = object
	}

	public delete(key: string): void {
		delete this._object[key]
	}

	public forEachKeys(callbackfn: (key: string) => void): void {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				callbackfn(key)
			}
		}
	}

	public get(key: string): any {
		return this._object[key]
	}

	public has(key: string): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, key)
	}

	public set(key: string, value: any): void {
		this._object[key] = value
	}
}

export class MergeMapWrapper<K, V> implements IMergeMapWrapper<K, V> {
	private readonly _map: Map<K, V>

	constructor(map: Map<K, V>) {
		this._map = map
	}

	public delete(key: K): void {
		this._map.delete(key)
	}

	public forEachKeys(callbackfn: (key: K) => void): void {
		for (const key of this._map.keys()) {
			callbackfn(key)
		}
	}

	public get(key: K): V {
		return this._map.get(key)
	}

	public has(key: K): boolean {
		return this._map.has(key)
	}

	public set(key: K, value: V): void {
		this._map.set(key, value)
	}
}

export function createMergeMapWrapper<K, V>(mapOrObject: object|Map<K, V>) {
	if (mapOrObject.constructor === Object) {
		return new MergeObjectWrapper(mapOrObject)
	}

	return new MergeMapWrapper(mapOrObject as Map<K, V>)
}

// 10039 cycles
export function mergeMapsOrObjects<TObject extends object>(
	merge: IMergeValue,
	base: TObject,
	older: TObject,
	newer: TObject,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
): boolean {
	const baseWrapper = createMergeMapWrapper(base)
	const olderWrapper = older === base ? baseWrapper : createMergeMapWrapper(older)
	const newerWrapper = newer === base
		? baseWrapper
		: (newer === older ? olderWrapper : createMergeMapWrapper(newer))

	return mergeMapWrappers(
		merge,
		baseWrapper,
		olderWrapper,
		newerWrapper,
		preferCloneOlder,
		preferCloneNewer,
	)
}

/* tslint:disable:no-identical-functions */
import {IMergeValue} from './contracts'

// tslint:disable-next-line:no-empty
function NONE() {}

export function mergeObject<TObject extends object>(
	merge: IMergeValue,
	base: TObject,
	older: TObject,
	newer: TObject,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
): boolean {
	let changed = false

	let deleted

	const deleteItem = (key: string) => {
		if (!deleted) {
			deleted = { [key]: true }
		} else {
			deleted[key] = true
		}
		delete base[key]
		changed = true
	}

	for (const key in base) {
		if (!Object.prototype.hasOwnProperty.call(older, key)
			|| !Object.prototype.hasOwnProperty.call(newer, key)
		) {
			deleteItem(key)
		}
	}

	for (const key in newer) {
		if (Object.prototype.hasOwnProperty.call(newer, key) && (!deleted || !deleted[key])) {
			const baseItem = Object.prototype.hasOwnProperty.call(base, key)
				? base[key]
				: NONE

			const newerItem = newer[key]

			const olderItem = newer === older
				? newerItem
				: (Object.prototype.hasOwnProperty.call(older, key)
					? older[key]
					: NONE)

			changed = merge(baseItem, olderItem, newerItem, o => {
				if (o === NONE) {
					deleteItem(key)
				} else {
					base[key] = o
				}
			}, preferCloneOlder, preferCloneNewer) || changed
		}
	}

	if (older !== newer) {
		for (const key in older) {
			if (!Object.prototype.hasOwnProperty.call(newer, key) && (!deleted || !deleted[key])) {
				const baseItem = Object.prototype.hasOwnProperty.call(base, key)
					? base[key]
					: NONE

				const olderItem = Object.prototype.hasOwnProperty.call(older, key)
					? older[key]
					: NONE

				changed = merge(baseItem, olderItem, olderItem, o => {
					if (o === NONE) {
						deleteItem(key)
					} else {
						base[key] = o
					}
				}, preferCloneOlder, preferCloneOlder) || changed
			}
		}
	}

	return changed
}

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

	if (older === newer) {
		// [- n n]
		older.forEachKeys(key => {
			if (!base.has(key)) {
				addItems.push([key, older.get(key)])
			}
		})
	} else {
		// [- - n]
		newer.forEachKeys(key => {
			if (!base.has(key) && !older.has(key)) {
				addItems.push([key, newer.get(key)])
			}
		})

		// [- o *]
		older.forEachKeys(key => {
			if (!base.has(key)) {
				if (!newer.has(key)) {
					addItems.push([key, older.get(key)])
				} else {
					let setItem = NONE

					merge(NONE, older.get(key), newer.get(key), o => {
						setItem = o
					}, preferCloneOlder, preferCloneOlder)

					if (setItem === NONE) {
						throw new Error('setItem === NONE')
					}

					addItems.push([key, setItem])
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

export function mergeObject2<TObject extends object>(
	merge: IMergeValue,
	base: TObject,
	older: TObject,
	newer: TObject,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
): boolean {
	return mergeMapWrappers(
		merge,
		new MergeObjectWrapper(base),
		new MergeObjectWrapper(older),
		new MergeObjectWrapper(newer),
		preferCloneOlder,
		preferCloneNewer,
	)
}

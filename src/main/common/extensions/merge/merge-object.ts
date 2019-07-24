/* tslint:disable:no-identical-functions */
import {IMergeValue} from './contracts'

// tslint:disable-next-line:no-empty
const NONE: any = function() {}

export function mergeObject<TObject extends object>(
	merge: IMergeValue,
	base: TObject,
	older: TObject,
	newer: TObject,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
): boolean {
	let changed = false

	for (const key in base) {
		if (!Object.prototype.hasOwnProperty.call(older, key)
			&& !Object.prototype.hasOwnProperty.call(newer, key)
		) {
			delete base[key]
			changed = true
		}
	}

	for (const key in newer) {
		if (Object.prototype.hasOwnProperty.call(newer, key)) {
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
					delete base[key]
				} else {
					base[key] = o
				}
			}, preferCloneOlder, preferCloneNewer) || changed
		}
	}

	if (older !== newer) {
		for (const key in older) {
			if (!Object.prototype.hasOwnProperty.call(newer, key)) {
				const baseItem = Object.prototype.hasOwnProperty.call(base, key)
					? base[key]
					: NONE

				const olderItem = Object.prototype.hasOwnProperty.call(older, key)
					? older[key]
					: NONE

				changed = merge(baseItem, olderItem, olderItem, o => {
					if (o === NONE) {
						delete base[key]
					} else {
						base[key] = o
					}
				}, preferCloneOlder, preferCloneOlder) || changed
			}
		}
	}

	return changed
}

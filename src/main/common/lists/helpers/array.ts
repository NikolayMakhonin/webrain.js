import {ICompare} from '../contracts/ICompare'

export function defaultCompare(o1, o2) {
	if (o1 < o2) {
		return -1
	}

	if (o1 > o2) {
		return 1
	}

	return 0
}

/**
 * @param array sorted array with compare func
 * @param item search item
 * @param start (optional) start index
 * @param end (optional) exclusive end index
 * @param compare (optional) custom compare func
 * @param bound (optional) (-1) first index; (1) last index; (0) doesn't matter
 */
export function binarySearch<T>(
	array: T[],
	item: T,
	start?: number,
	end?: number,
	compare?: ICompare<T>,
	bound?: number,
) {
	if (!compare) {
		compare = defaultCompare
	}

	let from = start == null ? 0 : start
	let to = (end == null ? array.length : end) - 1

	if (to < from) {
		return ~from
	}

	let found = -1

	while (from <= to) {
		const middle = (from + to) >>> 1

		const compareResult = compare(array[middle], item)

		if (compareResult < 0) {
			from = middle + 1
		} else if (compareResult > 0) {
			to = middle - 1
		} else if (!bound) {
			return middle
		} else if (bound < 0) {
			// First occurrence:
			found = middle
			to = middle - 1
		} else {
			// Last occurrence:
			found = middle
			from = middle + 1
		}
	}

	return found >= 0 ? found : -from - 1
}

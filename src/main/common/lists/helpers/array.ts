import {ICompare} from '../contracts/ICompare'

function defaultCompare(o1, o2) {
	if (o1 < o2) {
		return -1
	}

	if (o1 > o2) {
		return 1
	}

	return 0
}

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

// export function binarySearch<T>(array: T[], item: T, start?: number, end?: number, compare?: ICompare<T>) {
// 	if (!compare) {
// 		compare = defaultCompare
// 	}
//
// 	let from = start == null ? 0 : start
// 	let to = (end == null ? array.length : end) - 1
// 	while (from <= to) {
// 		const middle = (to + from) >> 1
// 		const compareResult = compare(item, array[middle])
// 		if (compareResult > 0) {
// 			from = middle + 1
// 		} else if (compareResult < 0) {
// 			to = middle - 1
// 		} else {
// 			return middle
// 		}
// 	}
// 	return -from - 1
// }

// function binarySearchBound<T>(array: T[], item: T, start?: number, end?: number, compare?: ICompare<T>) {
// 	if (!compare) {
// 		compare = defaultCompare
// 	}
//
// 	let lo = start == null ? -1 : start - 1
// 	let hi = end == null ? array.length : end
// 	while (1 + lo < hi) {
// 		const mi = lo + ((hi - lo) >> 1)
// 		const cmp = compare(array[mi], item)
// 		if (cmp < 0) {
// 			hi = mi
// 		} else if (cmp > 0) {
// 			lo = mi
// 		} else {
// 			hi = mi
// 		}
// 	}
// 	return hi
// }
//
// export function binarySearchFirst(array, item, compare) {
// 	if (!compare) {
// 		compare = defaultCompare
// 	}
//
// 	return binarySearchBound(array, (o) => compare(item, o) <= 0)
// }

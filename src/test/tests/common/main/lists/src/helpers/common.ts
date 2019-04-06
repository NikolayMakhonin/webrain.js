export function generateArray(size) {
	const arr = []
	for (let i = 0; i < size; i++) {
		arr.push(i)
	}

	return arr
}

export function *toIterable<T>(array: T[]): Iterable<T> {
	for (const item of array) {
		yield item
	}
}

export function shuffle(array) {
	return array.slice().sort(() => (Math.random() > 0.5 ? 1 : -1))
}

export const allValues = [
	[],
	{},
	'',
	'NaN',
	'null',
	'undefined',
	'0',
	'1',
	'true',
	'false',
	0,
	1,
	true,
	false,
	null,
	undefined,
	-Infinity,
	Infinity,
	NaN,
]

export function indexOfNaN(array) {
	for (let i = 0, len = array.length; i < len; i++) {
		const item = array[i]
		if (item !== item) {
			return i
		}
	}
}

export class FillCollection {

}

enum OperationType {
	Add,
	Remove,
	Set,
}

export function fillMultiple<TItem>(
	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
	items: TItem[],
): TItem {
	if (items.length < 1) {
		return null
	}

	if (items.length < 2) {
		return items[0]
	}

	let targetItem = items[0]
	for (let i = 1, len = items.length; i < len; i++) {
		const sourceItem = items[i]
		if (fill(targetItem, sourceItem) === false) {
			targetItem = sourceItem
		}
	}

	return targetItem
}

function fillCollectionPrivate<TItem>(
	target: TItem[],
	sourceMap: { [key: string]: TItem },
	getKey: (item: TItem) => string,
	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
	add: (key: string, item: TItem) => void,
	remove: (key: string, index: number) => void,
	set?: (key: string, item: TItem) => boolean,
): { [key: string]: TItem } {
	// Scan target

	const keys = []
	const targetNew = []
	const itemsSource = []
	const targetMap = {}
	for (let i = 0, len = target.length; i < len; i++) {
		const item = target[i]
		const key = getKey(item)
		keys[i] = key
		if (sourceMap && Object.prototype.hasOwnProperty.call(sourceMap, key)) {
			targetNew[i] = item
			itemsSource[i] = sourceMap[key]
			delete sourceMap[key]
			targetMap[key] = i
		} else {
			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
				const index = targetMap[key]
				if (fill(targetNew[index], item) === false) {
					targetNew[index] = item
				}
			}

			if (sourceMap) {
				targetNew[i] = null
				itemsSource[i] = null
			} else {
				targetNew[i] = item
				itemsSource[i] = item
				targetMap[key] = i
			}
		}
	}

	for (const key in targetMap) {
		if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
			targetMap[key] = targetNew[targetMap[key]]
		}
	}

	// Remove / Set Items

	const addItems = []

	for (let i = target.length; i--;) {
		let targetItem = targetNew[i]
		const key = keys[i]
		if (targetItem == null) {
			remove(key, i)
		} else {
			const sourceItem = itemsSource[i]
			if (targetItem !== sourceItem && fill(targetItem, sourceItem) === false) {
				targetItem = sourceItem
			}

			if (targetItem !== target[i]
				&& (!set || !set(key, targetItem))
			) {
				remove(key, i)
				addItems.push([key, targetItem])
			}
		}
	}

	// Add Items

	for (let i = 0, len = addItems.length; i < len; i++) {
		add.apply(null, addItems[i])
	}

	for (const key in sourceMap) {
		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
			add(key, sourceMap[key])
		}
	}

	return targetMap
}

export function fillCollection<TItem>(
	target: TItem[],
	source: TItem[],
	getKey: (item: TItem) => string,
	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
	add: (key: string, item: TItem) => void,
	remove: (key: string, index: number) => void,
	set?: (key: string, item: TItem) => boolean,
): void {
	if (target === source) {
		return
	}

	fillCollectionPrivate(source, null, getKey, )

	// Scan source

	const sourceMap = {}
	for (let i = 0, len = source.length; i < len; i++) {
		const item = source[i]
		const key = getKey(item)
		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
			sourceMap[key].push(item)
		} else {
			sourceMap[key] = [item]
		}
	}

	// Scan target

	const keys = []
	const targetNew = []
	const itemsSource = []
	const targetMap = {}
	for (let i = 0, len = target.length; i < len; i++) {
		const item = target[i]
		const key = getKey(item)
		keys[i] = key
		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
			targetNew[i] = item
			itemsSource[i] = sourceMap[key]
			delete sourceMap[key]
			targetMap[key] = i
		} else {
			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
				const index = targetMap[key]
				if (fill(targetNew[index], item) === false) {
					targetNew[index] = item
				}
			}
			targetNew[i] = null
			itemsSource[i] = null
		}
	}

	// Remove / Set Items

	const addItems = []

	for (let i = target.length; i--;) {
		let targetItem = targetNew[i]
		const key = keys[i]
		if (targetItem == null) {
			remove(key, i)
		} else {
			const sourceItems = itemsSource[i]
			if (sourceItems) {
				for (let j = 0, len = sourceItems.length; j < len; j++) {
					const sourceItem = sourceItems[j]
					if (fill(targetItem, sourceItem) === false) {
						targetItem = sourceItem
					}
				}
			}

			if (targetItem !== target[i]
				&& (!set || !set(key, targetItem))
			) {
				remove(key, i)
				addItems.push([key, targetItem])
			}
		}
	}

	// Add Items

	for (let i = 0, len = addItems.length; i < len; i++) {
		add.apply(null, addItems[i])
	}

	for (const key in sourceMap) {
		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
			add(key, sourceMap[key])
		}
	}
}

export function fillIterable<TItem>(
	target: Iterable<TItem>,
	source: Iterable<TItem>,
	getKey: (item: TItem) => string,
	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
	add: (key: string, item: TItem) => void,
	remove: (key: string, index: number) => void,
	set?: (key: string, item: TItem) => boolean,
): void {
	if (target === source) {
		return
	}

	fillCollection(Array.from(target), Array.from(source), getKey, fill, add, remove, set)
}

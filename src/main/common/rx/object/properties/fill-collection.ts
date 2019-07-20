export class MergeCollectionOptions<
	TTargetItem,
	TSourceItem,
	TCollection extends Iterable<TTargetItem>|TTargetItem[]
> {
	public getKey: (item: TTargetItem) => string
	public merge: (
		target: TTargetItem,
		older: TSourceItem,
		newer?: TSourceItem,
		set?: (value: TTargetItem) => void,
	) => boolean
	public add: (collection: TCollection, key: string, item: TTargetItem) => void
	public remove: (collection: TCollection, key: string, index: number) => void
	public set?: (collection: TCollection, key: string, item: TTargetItem) => boolean
}

interface CollectionMap<TItem> { [key: string]: TItem }

export class MergeCollection<
	TTargetItem,
	TSourceItem,
	TCollection extends Iterable<TTargetItem>|TTargetItem[]
> {
	private mergeOptions: MergeCollectionOptions<TTargetItem, TSourceItem, TCollection>

	constructor(
		mergeOptions?: MergeCollectionOptions<TTargetItem, TSourceItem, TCollection>,
	) {
		this.mergeOptions = mergeOptions
	}

	// public static fillFrom<TItem, TCollection extends Iterable<TItem>|TItem[]>(
	// 	target: TCollection|Iterable<TItem>|TItem[],
	// 	mergeOptions: MergeCollectionOptions<TItem, TCollection>,
	// ): MergeCollection<TItem> {
	// 	return new MergeCollection<TItem>()
	// 		.fillTo(target, null, null, mergeOptions)
	// }
	//
	// public fillTo<TCollection extends Iterable<TItem>|TItem[]>(
	// 	target: TCollection|Iterable<TItem>|TItem[],
	// 	mergeOptions?: MergeCollectionOptions<TItem, TCollection>,
	// ): this {
	// 	const targetArray = Array.isArray(target)
	// 		? target
	// 		: Array.from(target)
	//
	// 	if (mergeOptions) {
	// 		mergeOptions = this.mergeOptions
	// 			? Object.assign(this.mergeOptions, mergeOptions)
	// 			: Object.create(mergeOptions)
	// 		this.mergeOptions = mergeOptions
	// 	} else {
	// 		mergeOptions = this.mergeOptions || {} as any
	// 	}
	//
	// 	const {
	// 		getKey,
	// 		fill,
	// 		add,
	// 		remove,
	// 		set,
	// 	} = mergeOptions
	//
	// 	const {sourceMap} = this
	//
	// 	// Scan target
	//
	// 	const keys = []
	// 	const targetNew = []
	// 	const itemsSource = []
	// 	const targetMap = {}
	// 	for (let i = 0, len = targetArray.length; i < len; i++) {
	// 		const item = targetArray[i]
	// 		const key = getKey(item)
	// 		keys[i] = key
	// 		if (sourceMap && Object.prototype.hasOwnProperty.call(sourceMap, key)) {
	// 			targetNew[i] = item
	// 			itemsSource[i] = sourceMap[key]
	// 			delete sourceMap[key]
	// 			targetMap[key] = i
	// 		} else {
	// 			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
	// 				const index = targetMap[key]
	// 				if (fill(targetNew[index], item) === false) {
	// 					targetNew[index] = item
	// 					if (!sourceMap) {
	// 						itemsSource[index] = item
	// 					}
	// 				}
	// 				targetNew[i] = null
	// 				itemsSource[i] = null
	// 			} else if (sourceMap) {
	// 				targetNew[i] = null
	// 				itemsSource[i] = null
	// 			} else {
	// 				targetNew[i] = item
	// 				itemsSource[i] = item
	// 				targetMap[key] = i
	// 			}
	// 		}
	// 	}
	//
	// 	for (const key in targetMap) {
	// 		if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
	// 			targetMap[key] = targetNew[targetMap[key]]
	// 		}
	// 	}
	//
	// 	// Remove / Set Items
	//
	// 	const addItems = []
	//
	// 	for (let i = targetArray.length; i--;) {
	// 		let targetItem = targetNew[i]
	// 		const key = keys[i]
	// 		if (targetItem == null) {
	// 			remove(target as TCollection, key, i)
	// 		} else {
	// 			const sourceItem = itemsSource[i]
	// 			if (targetItem !== sourceItem && fill(targetItem, sourceItem) === false) {
	// 				targetItem = sourceItem
	// 			}
	//
	// 			if (targetItem !== targetArray[i]
	// 				&& (!set || !set(target as TCollection, key, targetItem))
	// 			) {
	// 				remove(target as TCollection, key, i)
	// 				addItems.push([target, key, targetItem])
	// 			}
	// 		}
	// 	}
	//
	// 	// Add Items
	//
	// 	for (let i = 0, len = addItems.length; i < len; i++) {
	// 		add.apply(null, addItems[i])
	// 	}
	//
	// 	if (sourceMap) {
	// 		for (const key in sourceMap) {
	// 			if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
	// 				add(target as TCollection, key, sourceMap[key])
	// 			}
	// 		}
	// 	}
	//
	// 	this.sourceMap = targetMap
	//
	// 	return this
	// }
	//
	// public older<TCollection extends Iterable<TItem>|TItem[]>(
	// 	older: TCollection|Iterable<TItem>|TItem[],
	// 	mergeOptions?: MergeCollectionOptions<TItem, TCollection>,
	// ): this {
	// 	this.olderMap = this._merge(older, null, null, mergeOptions)
	// 	return this
	// }
	//
	// public newer<TCollection extends Iterable<TItem>|TItem[]>(
	// 	newer: TCollection|Iterable<TItem>|TItem[],
	// 	mergeOptions?: MergeCollectionOptions<TItem, TCollection>,
	// ): this {
	// 	this.newerMap = this._merge(newer, null, null, mergeOptions)
	// 	return this
	// }

	public merge(
		target: TCollection,
		older?: CollectionMap<TSourceItem>,
		newer?: CollectionMap<TSourceItem>,
		mergeOptions?: MergeCollectionOptions<TTargetItem, TSourceItem, TCollection>,
		targetMapCallback?: (targetMap: CollectionMap<TTargetItem>) => void,
	): boolean {
		const targetArray = Array.isArray(target)
			? target
			: Array.from(target)

		if (mergeOptions) {
			mergeOptions = this.mergeOptions
				? Object.assign(Object.create(this.mergeOptions), mergeOptions)
				: Object.create(mergeOptions)
			this.mergeOptions = mergeOptions
		} else {
			mergeOptions = this.mergeOptions || {} as any
		}

		const {
			getKey,
			merge,
			add,
			remove,
			set,
		} = mergeOptions

		let changed = false
		// const fill = (item1, item2) => merge(item1, item2, item2)

		// Scan target

		const keys = []
		const targetNew = []
		const itemsOlder = []
		const itemsNewer = []
		const targetMap = {}
		let len = targetArray.length
		for (let i = 0; i < len; i++) {
			const item = targetArray[i]
			const key = getKey(item)
			keys[i] = key

			if (newer) {
				if (Object.prototype.hasOwnProperty.call(newer, key)) {
					if (Object.prototype.hasOwnProperty.call(older, key)) {
						targetNew[i] = item
						itemsOlder[i] = older[key]
						itemsNewer[i] = newer[key]
						delete older[key]
						delete newer[key]
						targetMap[key] = i
					} else {
						targetNew[i] = item
						const newItem = newer[key]
						itemsOlder[i] = void 0
						itemsNewer[i] = newItem
						delete newer[key]
						targetMap[key] = i
					}
				} else {
					if (older && Object.prototype.hasOwnProperty.call(older, key)) {
						targetNew[i] = item
						itemsOlder[i] = older[key]
						itemsNewer[i] = void 0
						delete older[key]
						targetMap[key] = i
					}
				}
			} else if (older && Object.prototype.hasOwnProperty.call(older, key)) {
				targetNew[i] = item
				const olderItem = older[key]
				itemsOlder[i] = olderItem
				itemsNewer[i] = olderItem
				delete older[key]
				targetMap[key] = i
			} else if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
				const index = targetMap[key]
				merge(targetNew[index], item, item, o => {
					targetNew[index] = o
					if (!older && !newer) {
						itemsOlder[index] = o
						itemsNewer[index] = o
					}
				})
				targetNew[i] = null
				itemsOlder[i] = null
				itemsNewer[i] = null
			} else if (older || newer) {
				targetNew[i] = null
				itemsOlder[i] = null
				itemsNewer[i] = null
			} else {
				targetNew[i] = item
				itemsOlder[i] = item
				itemsNewer[i] = item
				targetMap[key] = i
			}
		}

		for (const key in targetMap) {
			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
				targetMap[key] = targetNew[targetMap[key]]
			}
		}

		// Remove / Set Items

		const addItems = []

		for (let i = targetArray.length; i--;) {
			let targetItem = targetNew[i]
			const key = keys[i]
			if (targetItem == null) {
				remove(target as TCollection, key, i)
				changed = true
			} else {
				const olderItem = itemsOlder[i]
				const newerItem = itemsNewer[i]
				changed = merge(targetItem, olderItem, newerItem, o => targetItem = o) || changed
				if (targetItem !== targetArray[i] && (!set || !set(target as TCollection, key, targetItem))) {
					remove(target as TCollection, key, i)
					addItems.push([target, key, targetItem])
				}
			}
		}

		// Add Items

		len = addItems.length
		changed = changed || len > 0
		for (let i = 0; i < len; i++) {
			add.apply(null, addItems[i])
		}

		if (older) {
			for (const key in older) {
				if (Object.prototype.hasOwnProperty.call(older, key)) {
					const olderItem = older[key]
					merge(void 0, olderItem, olderItem, o => {
						add(target as TCollection, key, o)
					})
				}
			}
		}

		if (newer) {
			for (const key in newer) {
				if (Object.prototype.hasOwnProperty.call(newer, key)) {
					const newerItem = newer[key]
					merge(void 0, newerItem, newerItem, o => {
						add(target as TCollection, key, o)
					})
				}
			}
		}

		if (targetMapCallback) {
			targetMapCallback(targetMap)
		}

		return changed
	}
}

// function mergeCollections<TItem, TCollection extends Iterable<TItem>|TItem[]>(
// 	target: TCollection|Iterable<TItem>|TItem[],
// 	older: CollectionMap<TItem>,
// 	newer: CollectionMap<TItem>,
// 	mergeOptions?: MergeCollectionOptions<TItem, TCollection>,
// ): CollectionMap<TItem> {
// 	const targetArray = Array.isArray(target)
// 		? target
// 		: Array.from(target)
//
// 	const {
// 		getKey,
// 		fill,
// 		add,
// 		remove,
// 		set,
// 	} = mergeOptions || {} as any
//
// 	const {sourceMap} = this
//
// 	// Scan target
//
// 	const keys = []
// 	const targetNew = []
// 	const itemsSource = []
// 	const targetMap = {}
// 	for (let i = 0, len = targetArray.length; i < len; i++) {
// 		const item = targetArray[i]
// 		const key = getKey(item)
// 		keys[i] = key
// 		if (sourceMap && Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 			targetNew[i] = item
// 			itemsSource[i] = sourceMap[key]
// 			delete sourceMap[key]
// 			targetMap[key] = i
// 		} else {
// 			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
// 				const index = targetMap[key]
// 				if (fill(targetNew[index], item) === false) {
// 					targetNew[index] = item
// 					if (!sourceMap) {
// 						itemsSource[index] = item
// 					}
// 				}
// 				targetNew[i] = null
// 				itemsSource[i] = null
// 			} else if (sourceMap) {
// 				targetNew[i] = null
// 				itemsSource[i] = null
// 			} else {
// 				targetNew[i] = item
// 				itemsSource[i] = item
// 				targetMap[key] = i
// 			}
// 		}
// 	}
//
// 	for (const key in targetMap) {
// 		if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
// 			targetMap[key] = targetNew[targetMap[key]]
// 		}
// 	}
//
// 	// Remove / Set Items
//
// 	const addItems = []
//
// 	for (let i = targetArray.length; i--;) {
// 		let targetItem = targetNew[i]
// 		const key = keys[i]
// 		if (targetItem == null) {
// 			remove(target as TCollection, key, i)
// 		} else {
// 			const sourceItem = itemsSource[i]
// 			if (targetItem !== sourceItem && fill(targetItem, sourceItem) === false) {
// 				targetItem = sourceItem
// 			}
//
// 			if (targetItem !== targetArray[i]
// 				&& (!set || !set(target as TCollection, key, targetItem))
// 			) {
// 				remove(target as TCollection, key, i)
// 				addItems.push([target, key, targetItem])
// 			}
// 		}
// 	}
//
// 	// Add Items
//
// 	for (let i = 0, len = addItems.length; i < len; i++) {
// 		add.apply(null, addItems[i])
// 	}
//
// 	if (sourceMap) {
// 		for (const key in sourceMap) {
// 			if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 				add(target as TCollection, key, sourceMap[key])
// 			}
// 		}
// 	}
//
// 	return targetMap
// }

// export function fillMultiple<TItem>(
// 	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
// 	items: TItem[],
// ): TItem {
// 	if (items.length < 1) {
// 		return null
// 	}
//
// 	if (items.length < 2) {
// 		return items[0]
// 	}
//
// 	let targetItem = items[0]
// 	for (let i = 1, len = items.length; i < len; i++) {
// 		const sourceItem = items[i]
// 		if (fill(targetItem, sourceItem) === false) {
// 			targetItem = sourceItem
// 		}
// 	}
//
// 	return targetItem
// }
//
// function fillCollectionPrivate<TItem>(
// 	target: TItem[],
// 	sourceMap: CollectionMap<TItem>,
// 	getKey: (item: TItem) => string,
// 	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
// 	add: (key: string, item: TItem) => void,
// 	remove: (key: string, index: number) => void,
// 	set?: (key: string, item: TItem) => boolean,
// ): CollectionMap<TItem> {
// 	// Scan target
//
// 	const keys = []
// 	const targetNew = []
// 	const itemsSource = []
// 	const targetMap = {}
// 	for (let i = 0, len = target.length; i < len; i++) {
// 		const item = target[i]
// 		const key = getKey(item)
// 		keys[i] = key
// 		if (sourceMap && Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 			targetNew[i] = item
// 			itemsSource[i] = sourceMap[key]
// 			delete sourceMap[key]
// 			targetMap[key] = i
// 		} else {
// 			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
// 				const index = targetMap[key]
// 				if (fill(targetNew[index], item) === false) {
// 					targetNew[index] = item
// 				}
// 			}
//
// 			if (sourceMap) {
// 				targetNew[i] = null
// 				itemsSource[i] = null
// 			} else {
// 				targetNew[i] = item
// 				itemsSource[i] = item
// 				targetMap[key] = i
// 			}
// 		}
// 	}
//
// 	for (const key in targetMap) {
// 		if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
// 			targetMap[key] = targetNew[targetMap[key]]
// 		}
// 	}
//
// 	// Remove / Set Items
//
// 	const addItems = []
//
// 	for (let i = target.length; i--;) {
// 		let targetItem = targetNew[i]
// 		const key = keys[i]
// 		if (targetItem == null) {
// 			remove(key, i)
// 		} else {
// 			const sourceItem = itemsSource[i]
// 			if (targetItem !== sourceItem && fill(targetItem, sourceItem) === false) {
// 				targetItem = sourceItem
// 			}
//
// 			if (targetItem !== target[i]
// 				&& (!set || !set(key, targetItem))
// 			) {
// 				remove(key, i)
// 				addItems.push([key, targetItem])
// 			}
// 		}
// 	}
//
// 	// Add Items
//
// 	for (let i = 0, len = addItems.length; i < len; i++) {
// 		add.apply(null, addItems[i])
// 	}
//
// 	for (const key in sourceMap) {
// 		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 			add(key, sourceMap[key])
// 		}
// 	}
//
// 	return targetMap
// }
//
// export function fillCollection<TItem>(
// 	target: TItem[],
// 	source: TItem[],
// 	getKey: (item: TItem) => string,
// 	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
// 	add: (key: string, item: TItem) => void,
// 	remove: (key: string, index: number) => void,
// 	set?: (key: string, item: TItem) => boolean,
// ): void {
// 	if (target === source) {
// 		return
// 	}
//
// 	// fillCollectionPrivate(source, null, getKey, )
//
// 	// Scan source
//
// 	const sourceMap = {}
// 	for (let i = 0, len = source.length; i < len; i++) {
// 		const item = source[i]
// 		const key = getKey(item)
// 		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 			sourceMap[key].push(item)
// 		} else {
// 			sourceMap[key] = [item]
// 		}
// 	}
//
// 	// Scan target
//
// 	const keys = []
// 	const targetNew = []
// 	const itemsSource = []
// 	const targetMap = {}
// 	for (let i = 0, len = target.length; i < len; i++) {
// 		const item = target[i]
// 		const key = getKey(item)
// 		keys[i] = key
// 		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 			targetNew[i] = item
// 			itemsSource[i] = sourceMap[key]
// 			delete sourceMap[key]
// 			targetMap[key] = i
// 		} else {
// 			if (Object.prototype.hasOwnProperty.call(targetMap, key)) {
// 				const index = targetMap[key]
// 				if (fill(targetNew[index], item) === false) {
// 					targetNew[index] = item
// 				}
// 			}
// 			targetNew[i] = null
// 			itemsSource[i] = null
// 		}
// 	}
//
// 	// Remove / Set Items
//
// 	const addItems = []
//
// 	for (let i = target.length; i--;) {
// 		let targetItem = targetNew[i]
// 		const key = keys[i]
// 		if (targetItem == null) {
// 			remove(key, i)
// 		} else {
// 			const sourceItems = itemsSource[i]
// 			if (sourceItems) {
// 				for (let j = 0, len = sourceItems.length; j < len; j++) {
// 					const sourceItem = sourceItems[j]
// 					if (fill(targetItem, sourceItem) === false) {
// 						targetItem = sourceItem
// 					}
// 				}
// 			}
//
// 			if (targetItem !== target[i]
// 				&& (!set || !set(key, targetItem))
// 			) {
// 				remove(key, i)
// 				addItems.push([key, targetItem])
// 			}
// 		}
// 	}
//
// 	// Add Items
//
// 	for (let i = 0, len = addItems.length; i < len; i++) {
// 		add.apply(null, addItems[i])
// 	}
//
// 	for (const key in sourceMap) {
// 		if (Object.prototype.hasOwnProperty.call(sourceMap, key)) {
// 			add(key, sourceMap[key])
// 		}
// 	}
// }
//
// export function fillIterable<TItem>(
// 	target: Iterable<TItem>,
// 	source: Iterable<TItem>,
// 	getKey: (item: TItem) => string,
// 	fill: (targetItem: TItem, sourceItem: TItem) => boolean,
// 	add: (key: string, item: TItem) => void,
// 	remove: (key: string, index: number) => void,
// 	set?: (key: string, item: TItem) => boolean,
// ): void {
// 	if (target === source) {
// 		return
// 	}
//
// 	fillCollection(Array.from(target), Array.from(source), getKey, fill, add, remove, set)
// }

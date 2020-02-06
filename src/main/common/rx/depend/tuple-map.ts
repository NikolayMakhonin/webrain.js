//
// let nextObjectId: number = 1
//
// const UNIQUE_ID_PROPERTY_NAME = '458d576952bc489ab45e98ac7f296fd9'
//
// export function hasObjectUniqueId(object: object): boolean {
// 	return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME)
// }
//
// export function canHaveUniqueId(object: object): boolean {
// 	return !Object.isFrozen(object) || hasObjectUniqueId(object)
// }
//
// const ID_PROPERTY_NAME = 'fc93a7cf9a0e4a95b028f7b4681dc27d'
//
// export function getTupleUniqueId(this: Map<any, number>, ...args: any[]): number {
// 	if (arguments.length === 0) {
// 		// const id = this[ID_PROPERTY_NAME]
// 		// if (id != null) {
// 		// 	return id
// 		// }
// 		// const uniqueId = getNextObjectId()
// 		// this[ID_PROPERTY_NAME] = id
// 	}
//
//
// }
//
// // tslint:disable-next-line:ban-types
// export function freezeWithUniqueId<T extends object>(object: T): T {
// 	getObjectUniqueId(object)
// 	return Object.freeze(object)
// }
//
// // tslint:disable-next-line:ban-types
// export function isFrozenWithoutUniqueId(object: object): boolean {
// 	return !object || Object.isFrozen(object) && !hasObjectUniqueId(object)
// }

export interface ITupleMap<TItem> extends Map<any, ITupleMap<TItem>|TItem> {
	getTupleMap(item, ...items): ITupleMap<TItem>
	getTupleMap(this: ITupleMap<TItem>, item, ...items): ITupleMap<TItem>

	getTupleMapItem(createItem: () => TItem, item, ...items): TItem
	getTupleMapItem(this: ITupleMap<TItem>, createItem: () => TItem, item, ...items): TItem
}

const mapRoot: ITupleMap<any> = new Map() as ITupleMap<any>
mapRoot.getTupleMap = getTupleMap
mapRoot.getTupleMapItem = getTupleMapItem

export function getTupleMap(item, ...items): ITupleMap<any>
export function getTupleMap(this: ITupleMap<any>, item, ...items): ITupleMap<any>
export function getTupleMap(this: ITupleMap<any>): ITupleMap<any> {
	let map = this || mapRoot

	for (let i = 0, len = arguments.length; i < len; i++) {
		const arg = arguments[i]
		let nextMap = map.get(arg)
		if (!nextMap) {
			nextMap = new Map() as ITupleMap<any>
			nextMap.getTupleMap = getTupleMap
			nextMap.getTupleMapItem = getTupleMapItem
			map.set(arg, nextMap)
		}
		map = nextMap
	}

	return map
}

export function getTupleMapItem<TItem>(createItem: () => TItem, item, ...items): TItem
export function getTupleMapItem<TItem>(this: ITupleMap<TItem>, createItem: () => TItem, item, ...items): TItem
export function getTupleMapItem<TItem>(this: ITupleMap<TItem>, createItem: () => TItem): number {
	let map = this || mapRoot

	let arg
	for (let i = 1, len = arguments.length - 1; i < len; i++) {
		arg = arguments[i]
		let nextMap = map.get(arg)
		if (!nextMap) {
			nextMap = new Map() as ITupleMap<TItem>
			nextMap.getTupleMap = getTupleMap
			nextMap.getTupleMapItem = getTupleMapItem
			map.set(arg, nextMap)
		}
		map = nextMap
	}

	let item
	{
		arg = arguments[arguments.length - 1]
		item = this.get(arg)
		if (item == null) {
			item = createItem()
			this.set(arg, item)
		}
	}

	return item
}

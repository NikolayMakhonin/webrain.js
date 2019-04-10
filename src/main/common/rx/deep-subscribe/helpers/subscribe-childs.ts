import {IListChanged, ListChangedType} from '../../../lists/contracts/IListChanged'
import {IMapChanged} from '../../../lists/contracts/IMapChanged'
import {IPropertyChanged} from '../../../lists/contracts/IPropertyChanged'
import {ISetChanged} from '../../../lists/contracts/ISetChanged'
import {IUnsubscribe} from '../../subjects/subject'
import {ANY} from '../contracts/constants'

interface ISubscribeChildOptions<TObject, TChild> {
	object: TObject
	propertyPredicate: (propertyName) => boolean
	subscribeItem: (item: TChild) => void,
	unsubscribeItem: (item: TChild) => void,
}

type ISubscribeChilds<TObject, TChild>
	= (options: ISubscribeChildOptions<TObject, TChild>) => IUnsubscribe

// region subscribeChildsObject

function subscribeChildsObject<TValue>(
	{
		object,
		propertyPredicate,
		subscribeItem,
		unsubscribeItem,
	}: ISubscribeChildOptions<IPropertyChanged, TValue>,
) {
	const {propertyChanged} = object
	if (!propertyChanged) {
		return
	}

	const any = propertyPredicate(ANY)

	return propertyChanged
		.subscribe(event => {
			if (any || propertyPredicate(event.name)) {
				unsubscribeItem(event.oldValue)
				subscribeItem(event.newValue)
			}
		})
}

// endregion

// region subscribeChildsList

function subscribeChildsList<TItem>(
	{
		object,
		propertyPredicate,
		subscribeItem,
		unsubscribeItem,
	}: ISubscribeChildOptions<IListChanged<TItem>, TItem>,
) {
	const {listChanged} = object
	if (!listChanged) {
		return
	}

	if (!propertyPredicate(ANY)) {
		return null
	}

	return listChanged
		.subscribe(({type, oldItems, newItems}) => {
			switch (type) {
				case ListChangedType.Added:
					for (let i = 0, len = newItems.length; i < len; i++) {
						subscribeItem(newItems[i])
					}
					break
				case ListChangedType.Removed:
					for (let i = 0, len = oldItems.length; i < len; i++) {
						unsubscribeItem(oldItems[i])
					}
					break
				case ListChangedType.Set:
					unsubscribeItem(oldItems[0])
					subscribeItem(newItems[0])
					break
			}
		})
}

// endregion

// region subscribeChildsSet

function subscribeChildsSet<TItem>(
	{
		object,
		propertyPredicate,
		subscribeItem,
		unsubscribeItem,
	}: ISubscribeChildOptions<ISetChanged<TItem>, TItem>,
) {
	const {setChanged} = object
	if (!setChanged) {
		return
	}

	if (!propertyPredicate(ANY)) {
		return null
	}

	return setChanged
		.subscribe(({oldItems, newItems}) => {
			for (let i = 0, len = oldItems.length; i < len; i++) {
				unsubscribeItem(oldItems[i])
			}
			for (let i = 0, len = newItems.length; i < len; i++) {
				subscribeItem(newItems[i])
			}
		})
}

// endregion

// region subscribeChildsMap

function subscribeChildsMap<K, V>(
	{
		object,
		propertyPredicate,
		subscribeItem,
		unsubscribeItem,
	}: ISubscribeChildOptions<IMapChanged<K, V>, [K, V]>,
) {
	const {mapChanged} = object
	if (!mapChanged) {
		return
	}

	if (!propertyPredicate(ANY)) {
		return null
	}

	return mapChanged
		.subscribe(({key, oldValue, newValue}) => {
			unsubscribeItem([key, oldValue])
			subscribeItem([key, newValue])
		})
}

// endregion

// region subscribeChilds

const childSubscribers: Array<ISubscribeChilds<any, any>> = [
	subscribeChildsObject,
	subscribeChildsList,
	subscribeChildsSet,
	subscribeChildsMap,
]

export function subscribeChilds(options: ISubscribeChildOptions<any, any>): IUnsubscribe {
	let unsubscribers: IUnsubscribe[]

	for (let i = 0, len = childSubscribers.length; i < len; i++) {
		const unsubscribe = childSubscribers[i](options)
		if (unsubscribe) {
			if (!unsubscribers) {
				unsubscribers = [unsubscribe]
			} else {
				unsubscribers.push(unsubscribe)
			}
		}
	}

	if (!unsubscribers) {
		return null
	}

	return () => {
		for (let i = 0, len = unsubscribers.length; i < len; i++) {
			unsubscribers[i]()
		}
	}
}

// endregion

import {IListChanged, ListChangedType} from '../../../../../../../src/main/common/lists/contracts/IListChanged'
import {IMapChanged} from '../../../../../../../src/main/common/lists/contracts/IMapChanged'
import {IPropertyChanged} from '../../../../../../../src/main/common/lists/contracts/IPropertyChanged'
import {ISetChanged} from '../../../../../../../src/main/common/lists/contracts/ISetChanged'
import {IUnsubscribe} from '../../../../../../../src/main/common/rx/subjects/subject'
import {ANY, ANY_DISPLAY} from '../../../../../../../src/main/common/rx/deep-subscribe/contracts/constants'

interface ISubscribeChildOptions<TObject, TChild> {
	object: TObject
	propertyPredicate: (propertyName, object) => boolean
	subscribeItem: (item: TChild, debugPropertyName: string) => void,
	unsubscribeItem: (item: TChild, debugPropertyName: string) => void,
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
): IUnsubscribe {
	const {propertyChanged} = object
	if (!propertyChanged) {
		return null
	}

	const any = propertyPredicate(ANY, object)

	return propertyChanged
		.subscribe(event => {
			if (any || propertyPredicate(event.name, object)) {
				unsubscribeItem(event.oldValue, event.name as string)
				subscribeItem(event.newValue, event.name as string)
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
): IUnsubscribe {
	const {listChanged} = object
	if (!listChanged) {
		return null
	}

	if (!propertyPredicate(ANY, object)) {
		return null
	}

	return listChanged
		.subscribe(({type, oldItems, newItems}) => {
			switch (type) {
				case ListChangedType.Added:
					for (let i = 0, len = newItems.length; i < len; i++) {
						subscribeItem(newItems[i], ANY_DISPLAY)
					}
					break
				case ListChangedType.Removed:
					for (let i = 0, len = oldItems.length; i < len; i++) {
						unsubscribeItem(oldItems[i], ANY_DISPLAY)
					}
					break
				case ListChangedType.Set:
					unsubscribeItem(oldItems[0], ANY_DISPLAY)
					subscribeItem(newItems[0], ANY_DISPLAY)
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
): IUnsubscribe {
	const {setChanged} = object
	if (!setChanged) {
		return null
	}

	if (!propertyPredicate(ANY, object)) {
		return null
	}

	return setChanged
		.subscribe(({oldItems, newItems}) => {
			for (let i = 0, len = oldItems.length; i < len; i++) {
				unsubscribeItem(oldItems[i], ANY_DISPLAY)
			}
			for (let i = 0, len = newItems.length; i < len; i++) {
				subscribeItem(newItems[i], ANY_DISPLAY)
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
): IUnsubscribe {
	const {mapChanged} = object
	if (!mapChanged) {
		return null
	}

	if (!propertyPredicate(ANY, object)) {
		return null
	}

	return mapChanged
		.subscribe(({key, oldValue, newValue}) => {
			unsubscribeItem([key, oldValue], key as unknown as string)
			subscribeItem([key, newValue], key as unknown as string)
		})
}

// endregion

region subscribeChilds

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

endregion

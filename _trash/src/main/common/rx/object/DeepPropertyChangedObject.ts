import {IPropertyChanged, IPropertyChangedEvent} from '../../lists/contracts/IPropertyChanged'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../subjects/hasSubscribers'
import {IUnsubscribe} from '../subjects/subject'
import {PropertyChangedObject} from './PropertyChangedObject'

type EventOrPropertyName = string | number | IDeepPropertyChangedEvent | IPropertyChangedEvent
export type EventsOrPropertyNames = EventOrPropertyName | Array<EventOrPropertyName | any>

export type IAnyPropertyChangedEvent = IDeepPropertyChangedEvent | IPropertyChangedEvent

export interface IDeepPropertyChangedEvent {
	name?: string | number,
	next?: IAnyPropertyChangedEvent
}

export interface IDeepPropertyChanged {
	readonly deepPropertyChanged: IHasSubscribersSubject<IAnyPropertyChangedEvent>
}

export interface IDeepPropertyChangedObject extends IDeepPropertyChanged {
	readonly deepPropertyChanged: IHasSubscribersSubject<IAnyPropertyChangedEvent>
}

export class DeepPropertyChangedObject extends PropertyChangedObject implements IDeepPropertyChangedObject {
	/** @internal */
	public readonly __meta: {
		unsubscribers: {
			[key: string]: IUnsubscribe,
			[key: number]: IUnsubscribe,
		},
		propertyChanged?: IHasSubscribersSubject<IPropertyChangedEvent>,
		deepPropertyChanged?: IHasSubscribersSubject<IAnyPropertyChangedEvent>,
	}

	// region propertyChanged

	public get deepPropertyChanged(): IHasSubscribersSubject<IAnyPropertyChangedEvent> {
		let {deepPropertyChanged} = this.__meta
		if (!deepPropertyChanged) {
			this.__meta.deepPropertyChanged = deepPropertyChanged = new HasSubscribersSubject()
		}
		return deepPropertyChanged
	}

	public onPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this {
		const {propertyChanged, deepPropertyChanged} = this.__meta

		if (!propertyChanged && !deepPropertyChanged) {
			return this
		}

		this._emitPropertyChanged(eventsOrPropertyNames, (event: IPropertyChangedEvent) => {
			if (propertyChanged) {
				propertyChanged.emit(event)
			}

			if (deepPropertyChanged) {
				deepPropertyChanged.emit(event)
			}
		})

		return this
	}

	public onDeepPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this {
		const {deepPropertyChanged} = this.__meta

		if (!deepPropertyChanged) {
			return this
		}

		this._emitPropertyChanged(eventsOrPropertyNames, event => {
			deepPropertyChanged.emit(event)
		})

		return this
	}

	/** @internal */
	public _propagatePropertyChanged(
		propertyName: string | number,
		value: IDeepPropertyChanged | IPropertyChanged | any,
	): IUnsubscribe {
		this._setUnsubscriber(propertyName, null)

		if (!value) {
			return null
		}

		const deepPropertyChanged = value.deepPropertyChanged || value.propertyChanged

		if (!deepPropertyChanged) {
			return null
		}

		const subscriber = (event: IAnyPropertyChangedEvent) => {
			this.deepPropertyChanged.emit({
				name: propertyName,
				next: event,
			})
		}

		{
			const unsubscribe = this.deepPropertyChanged.hasSubscribersObservable
				.autoConnect(null, () => deepPropertyChanged.subscribe(subscriber))

			this._setUnsubscriber(propertyName, unsubscribe)

			return unsubscribe
		}
	}

	// endregion
}

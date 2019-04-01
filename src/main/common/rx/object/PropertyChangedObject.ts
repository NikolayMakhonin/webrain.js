import {HasSubscribersSubject, IHasSubscribersSubject} from '../subjects/hasSubscribers'

function expandAndDistinct(inputItems: any, output: string[] = [], map: any = {}): string[] {
	if (inputItems == null) {
		return output
	}

	if (Array.isArray(inputItems)) {
		for (const item of inputItems) {
			expandAndDistinct(item, output, map)
		}
		return output
	}

	if (!map[inputItems]) {
		map[inputItems] = true
		output[output.length] = inputItems
	}

	return output
}

export interface IPropertyChangedEvent {
	name?: string | number,
	oldValue?: any,
	newValue?: any,
}

type EventOrPropertyName = string | number | IPropertyChangedEvent
type EventsOrPropertyNames = EventOrPropertyName | Array<EventOrPropertyName | any>

export interface IPropertyChanged {
	readonly propertyChanged: IHasSubscribersSubject<IPropertyChangedEvent>
}

export interface IPropertyChangedObject extends IPropertyChanged {
	readonly propertyChanged: IHasSubscribersSubject<IPropertyChangedEvent>
	onPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this
}

export class PropertyChangedObject implements IPropertyChangedObject {
	/** @internal */
	public readonly __meta: {
		propertyChanged?: IHasSubscribersSubject<IPropertyChangedEvent>,
	}

	constructor() {
		Object.defineProperty(this, '__meta', {
			configurable: false,
			enumerable: false,
			writable: false,
			value: {},
		})
	}

	// region propertyChanged

	public get propertyChanged(): IHasSubscribersSubject<IPropertyChangedEvent> {
		let {propertyChanged} = this.__meta
		if (!propertyChanged) {
			this.__meta.propertyChanged = propertyChanged = new HasSubscribersSubject()
		}
		return propertyChanged
	}

	protected _emitPropertyChanged(
		eventsOrPropertyNames: EventsOrPropertyNames,
		emitFunc: (event: IPropertyChangedEvent) => void,
	) {
		if (eventsOrPropertyNames === null) {
			return
		}

		const toEvent = (event: EventOrPropertyName): IPropertyChangedEvent => {
			if (event == null) {
				return {}
			}

			if (typeof event !== 'object') {
				const value = this[event]
				event = {
					name    : event,
					oldValue: value,
					newValue: value,
				}
			}

			return event
		}

		if (!Array.isArray(eventsOrPropertyNames)) {
			emitFunc(toEvent(eventsOrPropertyNames))
		} else {
			const items = expandAndDistinct(eventsOrPropertyNames)

			for (let i = 0, len = items.length; i < len; i++) {
				emitFunc(toEvent(items[i]))
			}
		}
	}

	public onPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this {
		const {propertyChanged} = this.__meta

		if (!propertyChanged) {
			return this
		}

		this._emitPropertyChanged(eventsOrPropertyNames, (event: IPropertyChangedEvent) => {
			if (propertyChanged) {
				propertyChanged.emit(event)
			}
		})

		return this
	}

	// endregion
}

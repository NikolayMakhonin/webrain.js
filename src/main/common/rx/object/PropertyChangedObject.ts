import {
	EventOrPropertyName,
	EventsOrPropertyNames,
	IPropertyChangedEvent,
	IPropertyChangedObject,
} from '../../lists/contracts/IPropertyChanged'
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

export class PropertyChangedObject implements IPropertyChangedObject {
	/** @internal */
	public readonly __meta: {
		propertyChanged?: IHasSubscribersSubject<IPropertyChangedEvent>,
		propertyChangedDisabled?: boolean,
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

	protected get _propertyChangedIfCanEmit() {
		const {propertyChangedDisabled, propertyChanged} = this.__meta
		return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers
			? propertyChanged
			: null
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
		const {__meta} = this
		if (!__meta) {
			return this
		}

		const {propertyChanged, propertyChangedDisabled} = this.__meta

		if (!propertyChanged || propertyChangedDisabled) {
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

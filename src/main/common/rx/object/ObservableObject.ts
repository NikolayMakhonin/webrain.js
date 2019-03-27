import '../extensions/autoConnect'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../subjects/hasSubscribers'
import {IUnsubscribe} from '../subjects/subject'

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

type EventOrPropertyName = string | number | IDeepPropertyChangedEvent | IPropertyChangedEvent
export type EventsOrPropertyNames = EventOrPropertyName | Array<EventOrPropertyName | any>

export type IAnyPropertyChangedEvent = IDeepPropertyChangedEvent | IPropertyChangedEvent

export interface ISetOptions {
	equalsFunc?: (oldValue, newValue) => boolean,
	fillFunc?: (oldValue, newValue) => boolean,
	convertFunc?: (newValue) => any,
	beforeChange?: (oldValue) => void,
	afterChange?: (newValue) => void,
}

export interface IPropertyChangedEvent {
	name?: string | number,
	oldValue?: any,
	newValue?: any,
}

export interface IDeepPropertyChangedEvent {
	name?: string | number,
	next?: IAnyPropertyChangedEvent
}

export interface IDeepPropertyChanged {
	readonly deepPropertyChanged: IHasSubscribersSubject<IAnyPropertyChangedEvent>
}

export interface IObservableObject {
	readonly propertyChanged: IHasSubscribersSubject<IPropertyChangedEvent>
	readonly deepPropertyChanged: IHasSubscribersSubject<IAnyPropertyChangedEvent>

	onPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this

	onDeepPropertyChanged(eventsOrPropertyNames: EventsOrPropertyNames): this
}

export class ObservableObject implements IObservableObject {
	/** @internal */
	public readonly __meta: {
		unsubscribers: {
			[key: string]: IUnsubscribe,
			[key: number]: IUnsubscribe,
		},
		propertyChanged?: IHasSubscribersSubject<IPropertyChangedEvent>,
		deepPropertyChanged?: IHasSubscribersSubject<IAnyPropertyChangedEvent>,
	}

	/** @internal */
	public readonly __fields?: {
		[key: string]: any;
		[key: number]: any;
	}

	constructor() {
		Object.defineProperty(this, '__meta', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {
				unsubscribers: {},
			},
		})

		Object.defineProperty(this, '__fields', {
			configurable: false,
			enumerable  : false,
			writable    : false,
			value       : {},
		})
	}

	// region propertyChanged

	get propertyChanged(): IHasSubscribersSubject<IPropertyChangedEvent> {
		let {propertyChanged} = this.__meta
		if (!propertyChanged) {
			this.__meta.propertyChanged = propertyChanged = new HasSubscribersSubject()
		}
		return propertyChanged
	}

	get deepPropertyChanged(): IHasSubscribersSubject<IAnyPropertyChangedEvent> {
		let {deepPropertyChanged} = this.__meta
		if (!deepPropertyChanged) {
			this.__meta.deepPropertyChanged = deepPropertyChanged = new HasSubscribersSubject()
		}
		return deepPropertyChanged
	}

	public _emitPropertyChanged(
		eventsOrPropertyNames: EventsOrPropertyNames,
		emitFunc: (event: IAnyPropertyChangedEvent) => void,
	) {
		if (eventsOrPropertyNames === null) {
			return
		}

		const toEvent = (event: EventOrPropertyName): IAnyPropertyChangedEvent => {
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

		this._emitPropertyChanged(eventsOrPropertyNames, (event) => {
			deepPropertyChanged.emit(event)
		})

		return this
	}

	// endregion

	/** @internal */
	public _set(name: string | number, newValue, options: ISetOptions) {
		const {__fields} = this
		const oldValue =  __fields[name]

		const {equalsFunc} = options
		if (equalsFunc ? equalsFunc(oldValue, newValue) : oldValue === newValue) {
			return false
		}

		const {fillFunc} = options
		if (fillFunc && oldValue != null && newValue != null && fillFunc(oldValue, newValue)) {
			return false
		}

		const {convertFunc} = options
		if (convertFunc) {
			newValue = convertFunc(newValue)
		}

		if (oldValue === newValue) {
			return false
		}

		const {beforeChange} = options
		if (beforeChange) {
			beforeChange(oldValue)
		}

		const {unsubscribers} = this.__meta

		const unsubscribe = unsubscribers[name]
		if (unsubscribe) {
			unsubscribe()
		}

		__fields[name] = newValue

		unsubscribers[name] = this._propagatePropertyChanged(name, newValue)

		const {afterChange} = options
		if (afterChange) {
			afterChange(newValue)
		}

		this.onPropertyChanged({
			name,
			oldValue,
			newValue,
		})

		return true
	}

	/** @internal */
	public _propagatePropertyChanged(propertyName: string | number, value: IDeepPropertyChanged | any): IUnsubscribe {
		if (!value) {
			return null
		}

		const {deepPropertyChanged} = value

		if (!deepPropertyChanged) {
			return null
		}

		const subscriber = (event: IAnyPropertyChangedEvent) => {
			this.deepPropertyChanged.emit({
				name: propertyName,
				next: event,
			})
		}

		return this.deepPropertyChanged.hasSubscribersObservable
			.autoConnect(null, () => deepPropertyChanged.subscribe(subscriber))
	}
}

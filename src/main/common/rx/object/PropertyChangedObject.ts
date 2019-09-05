import {HasSubscribersSubject} from '../subjects/hasSubscribers'
import {IUnsubscribe} from '../subjects/observable'
import {
	EventOrPropertyName,
	IPropertyChangedEvent,
	IPropertyChangedObject, IPropertyChangedSubject,
} from './IPropertyChanged'

// function expandAndDistinct(inputItems: any, output: string[] = [], map: any = {}): string[] {
// 	if (inputItems == null) {
// 		return output
// 	}
//
// 	if (Array.isArray(inputItems)) {
// 		for (const item of inputItems) {
// 			expandAndDistinct(item, output, map)
// 		}
// 		return output
// 	}
//
// 	if (!map[inputItems]) {
// 		map[inputItems] = true
// 		output[output.length] = inputItems
// 	}
//
// 	return output
// }

export class PropertyChangedSubject
	extends HasSubscribersSubject<IPropertyChangedEvent>
	implements IPropertyChangedSubject
{
	private readonly _object

	constructor(object) {
		super()
		this._object = object
	}

	public onPropertyChanged(...eventsOrPropertyNames: EventOrPropertyName[]): this {
		for (let i = 0, len = eventsOrPropertyNames.length; i < len; i++) {
			let event = eventsOrPropertyNames[i]

			if (event == null) {
				event = {}
			}

			if (typeof event !== 'object') {
				const value = this._object[event]
				event = {
					name    : event,
					oldValue: value,
					newValue: value,
				}
			}

			this.emit(event)
		}

		return this
	}
}

export class PropertyChangedObject implements IPropertyChangedObject {
	/** @internal */
	public readonly __meta: {
		unsubscribers: {
			[key: string]: IUnsubscribe,
			[key: number]: IUnsubscribe,
		},
		propertyChanged?: IPropertyChangedSubject,
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

	/** @internal */
	public _setUnsubscriber(propertyName: string | number, unsubscribe: IUnsubscribe) {
		const {__meta} = this

		let {unsubscribers} = __meta
		if (unsubscribers) {
			const oldUnsubscribe = unsubscribers[propertyName]
			if (oldUnsubscribe) {
				oldUnsubscribe()
			}
		}

		if (unsubscribe) {
			if (!unsubscribers) {
				__meta.unsubscribers = unsubscribers = {}
			}
			unsubscribers[propertyName] = unsubscribe
		}
	}

	// region propertyChanged

	public get propertyChanged(): IPropertyChangedSubject {
		let {propertyChanged} = this.__meta
		if (!propertyChanged) {
			this.__meta.propertyChanged = propertyChanged = new PropertyChangedSubject(this)
		}
		return propertyChanged
	}

	public get propertyChangedIfCanEmit() {
		const {propertyChangedDisabled, propertyChanged} = this.__meta
		return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers
			? propertyChanged
			: null
	}

	// endregion
}

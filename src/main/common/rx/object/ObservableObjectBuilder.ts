import {PropertyChangedEvent} from '../../lists/contracts/IPropertyChanged'
import '../extensions/autoConnect'
import {ISetOptions, ObservableObject} from './ObservableObject'

export interface IGetOptions<T> {
	factory: () => T
	factorySetOptions?: ISetOptions
}

export class ObservableObjectBuilder<TObject extends ObservableObject> {
	public object: TObject

	constructor(object?: TObject) {
		this.object = object || new ObservableObject() as TObject
	}

	public writable<T>(name: string | number, options?: ISetOptions, initValue?: T): this {
		if (!options) {
			options = {}
		}

		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name]
		} else if (typeof initValue !== 'undefined') {
			throw new Error("You can't set initValue for prototype writable property")
		}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : true,
			get(this: TObject) {
				return this.__fields[name]
			},
			set(this: TObject, newValue) {
				this._set(name, newValue, options)
			},
		})

		if (__fields && typeof initValue !== 'undefined') {
			const value = __fields[name]
			if (initValue !== value) {
				object[name] = initValue
			}
		}

		return this
	}

	public readable<T>(name: string | number, options?: IGetOptions<T>, value?: T): this {
		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name]
		}

		let factory = options && options.factory
		if (factory) {
			if (typeof value !== 'undefined') {
				throw new Error("You can't use both: factory and value")
			}
		} else if (!__fields && typeof value !== 'undefined') {
			factory = () => value
		}

		const createInstanceProperty = instance => {
			Object.defineProperty(instance, name, {
				configurable: true,
				enumerable: true,
				get(this: TObject) {
					return this.__fields[name]
				},
			})
		}

		if (factory) {
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: true,
				get(this: TObject) {
					const factoryValue = factory.call(this)
					createInstanceProperty(this)
					const {__fields: fields} = this

					if (fields && typeof factoryValue !== 'undefined') {
						const oldValue = fields[name]
						if (factoryValue !== oldValue) {
							this._set(name, factoryValue, {
								...(options && options.factorySetOptions),
								suppressPropertyChanged: true,
							})
						}
					}

					return factoryValue
				},
			})

			if (__fields) {
				const oldValue = __fields[name]

				const {propertyChangedIfCanEmit} = object
				if (propertyChangedIfCanEmit) {
					propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(
						name,
						oldValue,
						() => object[name],
					))
				}
			}
		} else {
			createInstanceProperty(object)

			if (__fields && typeof value !== 'undefined') {
				const oldValue = __fields[name]

				if (value !== oldValue) {
					__fields[name] = value
					const {propertyChangedIfCanEmit} = object
					if (propertyChangedIfCanEmit) {
						propertyChangedIfCanEmit.onPropertyChanged({
							name,
							oldValue,
							newValue: value,
						})
					}
				}
			}
		}

		return this
	}

	public delete(name: string | number): this {
		const {object} = this
		const oldValue = object[name]

		object._setUnsubscriber(name, null)

		delete object[name]

		const {__fields} = object
		if (__fields) {
			delete __fields[name]
			if (typeof oldValue !== 'undefined') {
				const {propertyChangedIfCanEmit} = object
				if (propertyChangedIfCanEmit) {
					propertyChangedIfCanEmit.onPropertyChanged({
						name,
						oldValue,
					})
				}
			}
		}

		return this
	}
}

import {createFunction} from '../../helpers/helpers'
import {webrainOptions} from '../../helpers/webrainOptions'
import '../extensions/autoConnect'
import {PropertyChangedEvent} from './IPropertyChanged'
import {_set, _setExt, ISetOptions, ObservableClass} from './ObservableClass'

export interface IFieldOptions<TObject, TValue> {
	hidden?: boolean,
	getValue?: (this: TObject) => TValue
	setValue?: (this: TObject, value: TValue) => void
}

export interface IWritableFieldOptions<TObject, TValue> extends IFieldOptions<TObject, TValue> {
	setOptions?: ISetOptions<TObject, TValue>,
}

export interface IReadableFieldOptions<TObject, TValue> extends IWritableFieldOptions<TObject, TValue> {
	factory?: (this: TObject, initValue: TValue) => TValue
	init?: (this: TObject, initValue: TValue) => void
}

export interface IUpdatableFieldOptions<TObject, TValue> extends IReadableFieldOptions<TObject, TValue> {
	update?: (this: TObject, value: any) => TValue|void
}

export class ObservableObjectBuilder<TObject extends ObservableClass> {
	public object: TObject

	constructor(object?: TObject) {
		this.object = object || new ObservableClass() as TObject
	}

	public writable<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		name: Name,
		options?: IWritableFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const {
			setOptions,
			hidden,
		} = options || {} as any

		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name as any]
		} else if (typeof initValue !== 'undefined') {
			throw new Error("You can't set initValue for prototype writable property")
		}

		// optimization
		const getValue = options && options.getValue
			|| createFunction(() => (function() { return this.__fields[name] }), `return this.__fields["${name}"]`) as any
		const setValue = options && options.setValue
			|| createFunction(() => (function(v) { this.__fields[name] = v }), 'v', `this.__fields["${name}"] = v`) as any
		const set = setOptions
			? _setExt.bind(null, name, getValue, setValue, setOptions)
			: _set.bind(null, name, getValue, setValue)

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : !hidden,
			get(this: TObject) {
				return getValue.call(this)
			},
			set(this: TObject, newValue) {
				set(this, newValue)
			},
		})

		if (__fields && typeof initValue !== 'undefined') {
			const value = __fields[name]
			if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(object, value, initValue) : value !== initValue) {
				object[name as any] = initValue
			}
		}

		return this as any
	}

	public readable<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		name: Name,
		options?: IReadableFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this & { object: { readonly [newProp in Name]: TValue } } {
		return this.updatable(name, options, initValue)
	}

	public updatable<TValue, Name extends string | number>(
		name: Name,
		options?: IUpdatableFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const hidden = options && options.hidden

		const {object} = this

		const {__fields} = object

		if (__fields) {
			__fields[name] = object[name as any]
		}

		let factory = options && options.factory
		if (!factory && !__fields && typeof initValue !== 'undefined') {
			factory = o => o
		}

		const update = options && options.update

		// optimization
		const getValue = options && options.getValue
			|| createFunction(() => (function() { return this.__fields[name] }), `return this.__fields["${name}"]`) as any
		let setValue
		if (update || factory) {
			setValue = options && options.setValue
				|| createFunction(() => (function(v) { this.__fields[name] = v }), 'v', `this.__fields["${name}"] = v`) as any
		}

		let setOnUpdate
		if (update) {
			// tslint:disable-next-line
			const setOptions = options && options.setOptions
			setOnUpdate = setOptions
				? _setExt.bind(null, name, getValue, setValue, setOptions)
				: _set.bind(null, name, getValue, setValue)
		}

		let setOnInit
		if (factory) {
			const setOptions = {
				...(options && options.setOptions),
				suppressPropertyChanged: true,
			}
			setOnInit = setOptions
				? _setExt.bind(null, name, getValue, setValue, setOptions)
				: _set.bind(null, name, getValue, setValue)
		}

		const createInstanceProperty = instance => {
			const attributes: any = {
				configurable: true,
				enumerable: !hidden,
				get(this: TObject) {
					return getValue.call(this)
				},
			}
			if (update) {
				attributes.set = function(value) {
					const newValue = update.call(this, value)
					if (typeof newValue !== 'undefined') {
						setOnUpdate(this, newValue)
					}
				}
			}
			Object.defineProperty(instance, name, attributes)
		}

		const initializeValue = options && options.init
		if (factory) {
			const init = function(this: TObject) {
				const factoryValue = factory.call(this, initValue)
				createInstanceProperty(this)
				if (initializeValue) {
					initializeValue.call(this, factoryValue)
				}
				return factoryValue
			}

			const initAttributes: any = {
				configurable: true,
				enumerable: !hidden,
				get(this: TObject) {
					const factoryValue = init.call(this)
					if (typeof factoryValue !== 'undefined') {
						const oldValue = getValue.call(this)
						if (webrainOptions.equalsFunc
							? !webrainOptions.equalsFunc.call(this, oldValue, factoryValue)
							: oldValue !== factoryValue
						) {
							setOnInit(this, factoryValue)
						}
					}
					return factoryValue
				},
			}
			if (update) {
				initAttributes.set = function(this: TObject, value) {
					// tslint:disable:no-dead-store
					const factoryValue = init.call(this)
					const newValue = update.call(this, value)
					if (typeof newValue !== 'undefined') {
						const oldValue = getValue.call(this)
						if (webrainOptions.equalsFunc
							? !webrainOptions.equalsFunc.call(this, oldValue, newValue)
							: oldValue !== newValue
						) {
							setOnInit(this, newValue)
						}
					}
				}
			}
			Object.defineProperty(object, name, initAttributes)

			if (__fields) {
				const oldValue = __fields[name]

				const {propertyChangedIfCanEmit} = object
				if (propertyChangedIfCanEmit) {
					propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(
						name,
						oldValue,
						() => object[name as any],
					))
				}
			}
		} else {
			createInstanceProperty(object)

			if (__fields && typeof initValue !== 'undefined') {
				const oldValue = __fields[name]

				if (initializeValue) {
					initializeValue.call(this, initValue)
				}

				if (webrainOptions.equalsFunc
					? !webrainOptions.equalsFunc.call(object, oldValue, initValue)
					: oldValue !== initValue
				) {
					__fields[name] = initValue
					const {propertyChangedIfCanEmit} = object
					if (propertyChangedIfCanEmit) {
						propertyChangedIfCanEmit.onPropertyChanged({
							name,
							oldValue,
							newValue: initValue,
						})
					}
				}
			}
		}

		return this as any
	}

	public delete<
		Name extends string | number = Extract<keyof TObject, string|number>
	>(name: Name)
		: this & { object: { readonly [newProp in Name]: never } }
	{
		const {object} = this
		const oldValue = object[name as any]

		object._setUnsubscriber(name, null)

		delete object[name as any]

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

		return this as any
	}
}

// Test:
// export const obj = new ObservableObjectBuilder()
// 	.writable<number, 'prop1'>('prop1')
// 	.readable<string, 'prop2'>('prop2')
// 	.readable<string, 'prop3'>('prop3')
// 	.delete('prop3')
// 	.object
//
// export const x = obj.prop1 + obj.prop2 + obj.propertyChanged + obj.prop3

// const builder = new ObservableObjectBuilder(true as any)
//
// export function writable<T = any>(
// 	options?: IWritableFieldOptions,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }

// class Class extends ObservableClass {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }

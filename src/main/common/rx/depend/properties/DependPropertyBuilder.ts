import {_set, _setExt} from '../../object/ObservableClass'
import {IWritableFieldOptions} from '../../object/ObservableObjectBuilder'
import {getCallState, getOrCreateCallState, invalidateCallState} from '../core/CallState'
import {depend, dependX} from '../core/depend'

const getValueMaps = new WeakMap<object, {
	[key: string]: () => any,
	[key: number]: () => any,
}>()

function setPropertyGetValue<
	TObject extends object,
	Name extends string | number = Extract<keyof TObject, string|number>,
>(object: TObject, name: Name, getValue: (this: object) => any) {
	let getValueMap = getValueMaps.get(object)
	if (getValueMap == null) {
		getValueMap = {}
		getValueMaps.set(object, getValueMap)
	}
	getValueMap[name] = getValue
}

export function getPropertyGetValue<
	TObject extends object,
	Name extends string | number = Extract<keyof TObject, string|number>,
>(object: TObject, name: Name) {
	const getValueMap = getValueMaps.get(object)
	return getValueMap == null
		? null
		: getValueMap[name]
}

export function invalidateProperty<
	TObject extends object,
	Name extends string | number = Extract<keyof TObject, string|number>,
>(object: TObject, name: Name) {
	const getValue = getPropertyGetValue(object, name)
	return getValue == null
		? null
		: invalidateCallState(getCallState(getValue).call(object))
}

export class DependPropertyBuilder<TObject extends object> {
	public object: TObject
	public readonly isPrototype: boolean

	constructor(object?: TObject) {
		this.object = object || {} as any
		this.isPrototype = Object.prototype.hasOwnProperty.call(object, 'constructor')
	}

	public writable<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
	>(
		name: Name,
		options?: IWritableFieldOptions<TObject, TValue>,
		initValue?: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		const {object} = this

		function getValue() {
			return this.value
		}
		function setValue(value: TValue) {
			const state = getOrCreateCallState(getValue).call(this)
			state.value = value
			invalidateCallState(state)
		}

		const setOptions = options != null && options.setOptions
		const hidden = options != null && options.hidden

		const set = setOptions
			? _setExt.bind(null, name, getValue, setValue, setOptions)
			: _set.bind(null, name, getValue, setValue)

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : !hidden,
			get: depend(getValue, null, null, true),
			set,
		})

		if (this.isPrototype) {
			if (typeof initValue !== 'undefined') {
				throw new Error("You can't set initValue for prototype writable property")
			}
		} else {
			if (typeof initValue === 'undefined') {
				initValue = object[name as any]
			}
			if (typeof initValue !== 'undefined') {
				object[name as any] = initValue
			}
		}

		setPropertyGetValue(object, name, getValue)

		return this as any
	}
}

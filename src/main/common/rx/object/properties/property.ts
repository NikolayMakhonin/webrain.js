import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export const SetMode = {
	Default: 0,
	Fill   : 1,
	Clone  : 2,
}

export class Property<TValue> extends ObservableObject {
	protected readonly _valueFactory: () => TValue

	constructor(valueFactory: () => TValue) {
		super()
		this._valueFactory = valueFactory
	}

	public value: TValue

	public set(source, options): boolean {
		const {
			fill,
			clone,
			fillFunc,
			valueFactory,
		} = options

		return this._set(
			'value',
			source,
			{
				fillFunc: fill
					? fillFunc
					: null,

				convertFunc(sourceValue) {
					if (clone && sourceValue != null) {
						return cloneValue(sourceValue)
					}

					return sourceValue
				},
			},
		)

		function cloneValue(sourceValue) {
			if (fillFunc == null) {
				throw new Error('Cannot clone value, because fillFunc == null')
			}

			let value
			if (valueFactory != null) {
				value = valueFactory(sourceValue)
				if (value != null) {
					return value
				}
			}

			const {_valueFactory} = this
			if (!_valueFactory) {
				throw new Error('Cannot clone value, because this._valueFactory == null')
			}
			value = _valueFactory()

			if (!fillFunc(value, sourceValue)) {
				throw new Error('Cannot clone value, because fillFunc return false')
			}

			return value
		}
	}
}

new ObservableObjectBuilder(Property.prototype)
	.writable('value')

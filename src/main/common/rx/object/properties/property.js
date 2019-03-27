import {ObservableObject} from '../ObservableObject'

export const SetMode = {
	Default: 0,
	Fill   : 1,
	Clone  : 2
}

export class Property extends ObservableObject {
	constructor(valueFactory) {
		super()
		this._valueFactory = valueFactory
	}

	_valueField = {}

	get value() {
		return this._valueField.value
	}

	set value(value) {
		this.set(value)
	}

	set(source, options) {
		const {
			fill, clone, fillFunc, valueFactory
		} = options

		return this._set(
			'value',
			this._valueField,
			source,
			{
				fillFunc: fill
					? fillFunc
					: null,

				convert(sourceValue) {
					if (clone && sourceValue != null) {
						return cloneValue(sourceValue)
					}

					return sourceValue
				}
			}
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

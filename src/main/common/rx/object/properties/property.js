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

	set(setMode, source, options) {
		const {fillFunc} = options
		// const {valueFactory} = options

		return this._set(
			'value',
			this._valueField,
			source,
			{
				fillFunc: (setMode & SetMode.Fill) === 0
					? null
					: fillFunc,

				convert(sourceValue) {
					if (sourceValue != null && (setMode & SetMode.Clone) !== 0) {
						return clone(sourceValue)
					}

					return sourceValue
				}
			}
		)

		function clone(sourceValue) {
			if (fillFunc == null) {
				throw new Error('Cannot clone value, because fillFunc == null')
			}

			// let value
			// if (valueFactory != null) {
			// 	value = valueFactory(sourceValue)
			// 	if (value != null) {
			// 		return value
			// 	}
			// }

			const {valueFactory} = this
			if (!valueFactory) {
				throw new Error('Cannot clone value, because valueFactory == null')
			}
			const value = valueFactory()

			if (!fillFunc(value, sourceValue)) {
				throw new Error('Cannot clone value, because fillFunc return false')
			}

			return value
		}
	}
}

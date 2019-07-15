import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {fillObject} from './fill-object'

export interface ISetOptions<TValue> {
	fill?: boolean,
	clone?: boolean,
	fillFunc?: (target: TValue, source: TValue) => boolean,
	valueFactory?: () => TValue,
}

export class Property<TValue> extends ObservableObject {
	protected readonly _defaultOptions: ISetOptions<TValue>

	constructor(defaultOptions: ISetOptions<TValue>) {
		super()
		this._defaultOptions = fillObject({
			fill: true,
		}, defaultOptions, true)
	}

	public value: TValue

	public set(source, options?: ISetOptions<TValue>): boolean {
		const { fill, clone, fillFunc, valueFactory }
			= fillObject(Object.create(options), this._defaultOptions)

		// const { _defaultOptions } = this
		// if (options) {
		// 	if (_defaultOptions) {
		// 		fill = options.fill
		// 		if (fill == null) {
		// 			fill = _defaultOptions.fill
		// 		}
		//
		// 		clone = options.clone || _defaultOptions.clone
		// 		if (clone == null) {
		// 			clone = _defaultOptions.clone
		// 		}
		//
		// 		fillFunc = options.fillFunc || _defaultOptions.fillFunc
		// 		if (fillFunc == null) {
		// 			fillFunc = _defaultOptions.fillFunc
		// 		}
		//
		// 		valueFactory = options.valueFactory || _defaultOptions.valueFactory
		// 		if (valueFactory == null) {
		// 			valueFactory = _defaultOptions.valueFactory
		// 		}
		// 	} else {
		// 		fill = options.fill
		// 		clone = options.clone
		// 		fillFunc = options.fillFunc
		// 		valueFactory = options.valueFactory
		// 	}
		// } else if (_defaultOptions) {
		// 	fill = _defaultOptions.fill
		// 	clone = _defaultOptions.clone
		// 	fillFunc = _defaultOptions.fillFunc
		// 	valueFactory = _defaultOptions.valueFactory
		// }

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

			const factory = valueFactory || this._valueFactory
			if (!factory) {
				throw new Error('Cannot clone value, because valueFactory is null')
			}
			const value = factory()

			if (!fillFunc(value, sourceValue)) {
				throw new Error('Cannot clone value, because fillFunc return false')
			}

			return value
		}
	}
}

new ObservableObjectBuilder(Property.prototype)
	.writable('value')

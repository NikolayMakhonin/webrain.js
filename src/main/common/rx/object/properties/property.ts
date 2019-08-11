import {IMergeable, IMergeOptions, IMergeValue} from '../../../extensions/merge/contracts'
import {ObjectMerger, registerMergeable} from '../../../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializeValue,
} from '../../../extensions/serialization/contracts'
import {registerSerializable} from '../../../extensions/serialization/serializers'
import {TClass} from '../../../helpers/helpers'
import {ObservableObject} from '../ObservableObject'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export interface IPropertyOptions<TTarget, TSource> {
	merger?: ObjectMerger,
	valueType?: TClass<TTarget>,
	valueFactory?: (source: TTarget | TSource) => TTarget,
	mergeOptions?: IMergeOptions,
}

export class Property<TTarget, TSource>
	extends ObservableObject
	implements
		IMergeable<Property<TTarget, TSource>, any>,
		ISerializable
{
	protected merger?: ObjectMerger
	protected valueType?: TClass<TTarget>
	protected valueFactory?: (source: TTarget|TSource) => TTarget
	protected mergeOptions?: IMergeOptions

	constructor(
		options?: IPropertyOptions<TTarget, TSource>,
		value?: TTarget,
	) {
		super()

		const {
			merger,
			valueType,
			valueFactory,
			mergeOptions,
		} = options || {} as any

		if (merger != null) {
			this.merger = merger
		}
		if (valueType != null) {
			this.valueType = valueType
		}
		if (valueFactory != null) {
			this.valueFactory = valueFactory
		}
		if (mergeOptions != null) {
			this.mergeOptions = mergeOptions
		}
		if (typeof value !== 'undefined') {
			this.value = value
		}
	}

	public value: TTarget

	public readonly [Symbol.toStringTag]: string = 'Property'

	// region set / fill / merge

	public set(
		value: Property<TTarget|TSource, any> | TTarget | TSource,
		clone?: boolean,
		options?: IMergeOptions,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): boolean {
		const result = this.mergeValue(
			void 0,
			value,
			value,
			clone,
			clone,
			options,
			valueType,
			valueFactory,
		)

		if (!result) {
			this.value = void 0
		}

		return result
	}

	public fill(
		value: Property<TTarget|TSource, any> | TTarget | TSource,
		preferClone?: boolean,
		options?: IMergeOptions,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): boolean {
		return this.mergeValue(
			this.value,
			value,
			value,
			preferClone,
			preferClone,
			options,
			valueType,
			valueFactory,
		)
	}

	public merge(
		older: Property<TTarget|TSource, any> | TTarget | TSource,
		newer: Property<TTarget|TSource, any> | TTarget | TSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): boolean {
		return this.mergeValue(
			this.value,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
			valueType,
			valueFactory,
		)
	}

	// endregion

	// region merge helpers

	private mergeValue(
		base: TTarget,
		older: Property<TTarget|TSource, any> | TTarget | TSource,
		newer: Property<TTarget|TSource, any> | TTarget | TSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): boolean {
		return this._mergeValue(
			(this.merger || ObjectMerger.default).merge,
			base,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
			valueType,
			valueFactory,
		)
	}

	private _mergeValue(
		merge: IMergeValue,
		base: TTarget,
		older: Property<TTarget|TSource, any> | TTarget | TSource,
		newer: Property<TTarget|TSource, any> | TTarget | TSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): boolean {
		if (older instanceof Property) {
			older = (older as Property<TTarget|TSource, any>).value
		} else {
			options = {
				...options,
				selfAsValueOlder: true,
			}
		}

		if (newer instanceof Property) {
			newer = (newer as Property<TTarget|TSource, any>).value
		} else {
			if (!options) {
				options = {}
			}
			options.selfAsValueNewer = true
		}

		return merge(
			base,
			older,
			newer,
			o => { this.value = o },
			preferCloneOlder,
			preferCloneNewer,
			{
				...this.mergeOptions,
				...options,
				selfAsValueOlder: !(older instanceof Property),
				selfAsValueNewer: !(newer instanceof Property),
			},
			valueType == null ? this.valueType : valueType,
			valueFactory == null ? this.valueFactory : valueFactory,
		)
	}

	// endregion

	// region IMergeable

	public _canMerge(source: Property<TTarget, TSource>|TTarget|TSource): boolean {
		if (source.constructor === Property
			&& this.value === (source as Property<TTarget, TSource>).value
				|| this.value === source
		) {
			return null
		}

		return true
	}

	public _merge(
		merge: IMergeValue,
		older: Property<TTarget|TSource, any> | TTarget | TSource,
		newer: Property<TTarget|TSource, any> | TTarget | TSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): boolean {
		return this._mergeValue(
			merge,
			this.value,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
			valueType,
			valueFactory,
		)
	}

	// endregion

	// region ISerializable

	public static uuid: string = '6f2c51cc-d865-4baa-9a93-226e3374ccaf'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			value: serialize(this.value),
		}
	}

	public deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedObject,
	) {
		deSerialize(serializedValue.value, o => this.value = o)
	}

	// endregion
}

new ObservableObjectBuilder(Property.prototype)
	.writable('value')

registerMergeable(Property)

registerSerializable(Property)

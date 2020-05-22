import {IMergeable, IMergeValue, IMergeVisitorOptions} from '../../../extensions/merge/contracts'
import {ObjectMerger, registerMergeable} from '../../../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializeValue,
} from '../../../extensions/serialization/contracts'
import {registerSerializable} from '../../../extensions/serialization/serializers'
import {webrainOptions} from '../../../helpers/webrainOptions'
import {ObservableClass} from '../ObservableClass'
import {ObservableObjectBuilder} from '../ObservableObjectBuilder'

export interface IPropertyOptions<TTarget, TSource> {
	merger?: ObjectMerger,
	mergeOptions?: IMergeVisitorOptions<TTarget, TSource>,
}

export class Property<TValue, TMergeSource = TValue>
	extends ObservableClass
	implements
		IMergeable<Property<TValue, TMergeSource>>,
		ISerializable
{
	protected merger?: ObjectMerger
	protected mergeOptions?: IMergeVisitorOptions<TValue, TMergeSource>

	constructor(
		options?: IPropertyOptions<TValue, TMergeSource>,
		initValue?: TValue,
	) {
		super()

		const {
			merger,
			mergeOptions,
		} = options || {} as any

		if (merger != null) {
			this.merger = merger
		}
		if (mergeOptions != null) {
			this.mergeOptions = mergeOptions
		}
		if (typeof initValue !== 'undefined') {
			this.value = initValue
		}
	}

	public value: TValue

	public readonly [Symbol.toStringTag]: string = 'Property'

	// region set / fill / merge

	public set(
		value: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		clone?: boolean,
		options?: IMergeVisitorOptions<TValue, TMergeSource>,
	): boolean {
		const result = this.mergeValue(
			void 0,
			value,
			value,
			clone,
			clone,
			options,
		)

		if (!result) {
			this.value = void 0
		}

		return result
	}

	public fill(
		value: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		preferClone?: boolean,
		options?: IMergeVisitorOptions<TValue, TMergeSource>,
	): boolean {
		return this.mergeValue(
			this.value,
			value,
			value,
			preferClone,
			preferClone,
			options,
		)
	}

	public merge(
		older: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		newer: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeVisitorOptions<TValue, TMergeSource>,
	): boolean {
		return this.mergeValue(
			this.value,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
		)
	}

	// endregion

	// region merge helpers

	private mergeValue(
		base: TValue,
		older: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		newer: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeVisitorOptions<TValue, TMergeSource>,
	): boolean {
		return this._mergeValue(
			(this.merger || ObjectMerger.default).merge,
			base,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
		)
	}

	private _mergeValue(
		merge: IMergeValue,
		base: TValue,
		older: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		newer: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeVisitorOptions<TValue, TMergeSource>,
	): boolean {
		if (older instanceof Property) {
			older = older.value
		} else {
			options = {
				...options,
				selfAsValueOlder: true,
			}
		}

		if (newer instanceof Property) {
			newer = newer.value
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
		)
	}

	// endregion

	// region IMergeable

	public _canMerge(source: Property<TValue, TMergeSource>|TValue|TMergeSource): boolean {
		if (webrainOptions.equalsFunc
			? source.constructor === Property
				&& webrainOptions.equalsFunc.call(this, this.value, source.value)
				|| webrainOptions.equalsFunc.call(this, this.value, source)
			: source.constructor === Property && this.value === source.value
				|| this.value === source
		) {
			return null
		}

		return true
	}

	public _merge(
		merge: IMergeValue,
		older: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		newer: Property<TValue|TMergeSource, any> | TValue | TMergeSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
	): boolean {
		return this._mergeValue(
			merge,
			this.value,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
		)
	}

	// endregion

	// region ISerializable

	// noinspection SpellCheckingInspection
	public static uuid: string = '6f2c51ccd8654baa9a93226e3374ccaf'

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

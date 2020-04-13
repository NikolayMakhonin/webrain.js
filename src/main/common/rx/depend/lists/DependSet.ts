import {IMergeable, IMergeOptions, IMergeValue} from '../../../extensions/merge/contracts'
import {mergeMaps} from '../../../extensions/merge/merge-maps'
import {createMergeSetWrapper} from '../../../extensions/merge/merge-sets'
import {registerMergeable} from '../../../extensions/merge/mergers'
import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializeValue,
} from '../../../extensions/serialization/contracts'
import {registerSerializable} from '../../../extensions/serialization/serializers'
import {isIterable} from '../../../helpers/helpers'
import {fillSet} from '../../../lists/helpers/set'
import {ALWAYS_CHANGE_VALUE, invalidateCallState} from '../core/CallState'
import {depend, getCallState} from '../core/facade'

export class DependSet<V>
	implements Set<V>,
		IMergeable<DependSet<V>, object>,
		ISerializable
{
	private readonly _set: Set<V>

	constructor(
		set?: Set<V>,
	) {
		this._set = set || new Set<V>()
	}

	public readonly [Symbol.toStringTag]: string = 'Set'

	// region depend methods

	public dependAll() {
		return ALWAYS_CHANGE_VALUE
	}

	// noinspection JSUnusedLocalSymbols
	public dependValue(value: V) {
		this.dependAll()
		return ALWAYS_CHANGE_VALUE
	}

	public dependAnyValue() {
		this.dependAll()
		return ALWAYS_CHANGE_VALUE
	}

	// endregion

	// region read methods

	public has(value: V): boolean {
		this.dependValue(value)
		return this._set.has(value)
	}

	public get size(): number {
		this.dependAnyValue()
		return this._set.size
	}

	public entries(): IterableIterator<[V, V]> {
		this.dependAnyValue()
		return this._set.entries()
	}

	public keys(): IterableIterator<V> {
		this.dependAnyValue()
		return this._set.keys()
	}

	public values(): IterableIterator<V> {
		this.dependAnyValue()
		return this._set.values()
	}

	public forEach(callbackfn: (value: V, key: V, set: Set<V>) => void, thisArg?: any): void {
		this.dependAnyValue()
		this._set.forEach((k, v) => callbackfn.call(thisArg, k, v, this))
	}

	public [Symbol.iterator](): IterableIterator<V> {
		this.dependAnyValue()
		return this._set[Symbol.iterator]()
	}

	// endregion

	// region change methods

	public add(value: V): this {
		const {_set} = this
		const oldSize = _set.size

		_set.add(value)

		if (_set.size !== oldSize) {
			invalidateCallState(getCallState(this.dependAnyValue).call(this))
			invalidateCallState(getCallState(this.dependValue).call(this, value))
		}

		return this
	}

	public delete(value: V): boolean {
		const {_set} = this
		const oldSize = _set.size

		this._set.delete(value)

		if (_set.size !== oldSize) {
			invalidateCallState(getCallState(this.dependAnyValue).call(this))
			invalidateCallState(getCallState(this.dependValue).call(this, value))
			return true
		}

		return false
	}

	public clear(): void {
		const {size} = this._set
		if (size === 0) {
			return
		}

		this._set.clear()

		invalidateCallState(getCallState(this.dependAll).call(this))
	}

	// endregion

	// region IMergeable

	public _canMerge(source: DependSet<V>): boolean {
		const {_set} = this
		if ((_set as any).canMerge) {
			return (_set as any).canMerge(source)
		}

		if (source.constructor === DependSet
			&& this._set === source._set
		) {
			return null
		}

		return source.constructor === Object
			|| source[Symbol.toStringTag] === 'Set'
			|| Array.isArray(source)
			|| isIterable(source)
	}

	public _merge(
		merge: IMergeValue,
		older: DependSet<V> | V[] | Iterable<V>,
		newer: DependSet<V> | V[] | Iterable<V>,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean {
		this.dependAnyValue()
		return mergeMaps(
			(target, source) => createMergeSetWrapper(
				target,
				source,
				arrayOrIterable => fillSet(new (this._set.constructor as any)(), arrayOrIterable)),
			merge,
			this,
			older,
			newer,
			preferCloneOlder,
			preferCloneNewer,
			options,
		)
	}

	// endregion

	// region ISerializable

	// noinspection SpellCheckingInspection
	public static uuid: string = '0b5ba0da253c43a98944e34a82b61c06'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		this.dependAnyValue()
		return {
			set: serialize(this._set),
		}
	}

	public deSerialize(
		// deSerialize: IDeSerializeValue,
		// serializedValue: ISerializedObject,
	): void {
		// empty
	}

	// endregion
}

DependSet.prototype.dependAll = depend(DependSet.prototype.dependAll, null, null, true)
DependSet.prototype.dependAnyValue = depend(DependSet.prototype.dependAnyValue, null, null, true)
DependSet.prototype.dependValue = depend(DependSet.prototype.dependValue, null, null, true)

registerMergeable(DependSet)

registerSerializable(DependSet, {
	serializer: {
		*deSerialize<V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory: (set?: Set<V>) => DependSet<V>,
		): Iterator<DependSet<V>|any> {
			const innerSet = yield deSerialize<Set<V>>(serializedValue.set)
			const value = valueFactory(innerSet)
			// value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})

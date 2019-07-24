import {TClass, TypeMetaCollection} from '../TypeMeta'
import {
	IMergeable,
	IMergerVisitor, IMergeValue, IObjectMerger,
	ITypeMetaMerger, ITypeMetaMergerCollection, IValueMerger,
} from './contracts'
import {mergeObject} from './merge-object'

// region MergerVisitor

function isPrimitive(value) {
	return value == null
		|| typeof value === 'number'
		|| typeof value === 'boolean'
		|| typeof value === 'function'
}

class ValueState<TTarget, TSource> {
	public mergerState: MergeState<TTarget, TSource>
	public target: TTarget
	public type: TClass<TTarget>
	public preferClone: boolean

	constructor(
		mergerState: MergeState<TTarget, TSource>,
		target: TTarget,
		preferClone: boolean,
	) {
		this.mergerState = mergerState
		this.target = target
		this.preferClone = preferClone
		this.type = mergerState.valueType || target.constructor as any
	}

	private _meta: ITypeMetaMerger<TTarget, TSource>
	public get meta(): ITypeMetaMerger<TTarget, TSource> {
		let { _meta } = this
		if (!_meta) {
			_meta = this.mergerState.mergerVisitor.typeMeta.getMeta(this.type)
			if (!_meta) {
				throw new Error(`Class (${this.type && this.type.name}) have no type meta`)
			}
			this._meta = _meta
		}
		return _meta
	}

	private _merger: IValueMerger<TTarget, TSource>
	public get merger(): IValueMerger<TTarget, TSource> {
		let { _merger } = this
		if (!_merger) {
			const { meta } = this
			_merger = meta.merger
			if (!_merger) {
				throw new Error(`Class (${this.type && this.type.name}) type meta have no merger`)
			}
			if (!_merger.merge) {
				throw new Error(`Class (${this.type && this.type.name}) merger have no merge method`)
			}
			this._merger = _merger
		}
		return _merger
	}

	private _mustBeCloned: boolean
	public get mustBeCloned(): boolean {
		let { _mustBeCloned } = this
		if (_mustBeCloned == null) {
			const valueType = this.mergerState.valueType
			const metaPreferClone = this.meta.preferClone
			this._mustBeCloned = _mustBeCloned =
				(metaPreferClone == null ? this.preferClone : metaPreferClone)
				|| valueType && valueType !== this.target.constructor
		}
		return _mustBeCloned
	}

	private _cloneInstance: TTarget
	public get cloneInstance(): TTarget {
		let { _cloneInstance } = this
		if (_cloneInstance == null) {
			const {target, type} = this
			_cloneInstance = (this.mergerState.valueFactory
				|| this.meta.valueFactory
				|| (() => (!this.mergerState.valueType || this.target.constructor === this.mergerState.valueType) && new type())
			)(target)

			if (!_cloneInstance) {
				throw new Error(`Class (${type.name}) cannot be clone`)
			}

			if (_cloneInstance === target) {
				throw new Error(`Clone result === Source for (${type.name})`)
			}

			if (_cloneInstance.constructor !== type) {
				throw new Error(`Clone type !== (${type.name})`)
			}

			this._cloneInstance = _cloneInstance
		}
		return _cloneInstance
	}

	public canMerge(source: TTarget|TSource): boolean {
		const canMerge = this.merger.canMerge
		if (canMerge) {
			const result = canMerge(this.target, source)
			if (result == null) {
				return null
			}
			if (typeof result !== 'boolean') {
				throw new Error(`Unknown canMerge() result (${(result as any).constructor.name}) for ${this.type.name}`)
			}
			return result
		}
		return this.target.constructor !== this.type
	}

	private _clone: TTarget
	public get clone(): TTarget {
		let { _clone } = this
		if (_clone == null) {
			const { target } = this
			if (this.mustBeCloned) {
				_clone = this.cloneInstance

				const canMergeResult: boolean = this.canMerge(target)

				switch (canMergeResult) {
					case null:
						break
					case true:
						const { preferClone } = this
						this.merger.merge(
							this.mergerState.mergerVisitor.getNextMerge(preferClone, preferClone),
							_clone,
							target,
							target,
							() => {
								throw new Error(`Class (${this.type.name}) cannot be merged with clone`)
							},
							preferClone,
							preferClone,
						)
						break
					case false:
						throw new Error(`Class (${this.type.name}) cannot be merged with clone`)
				}
			} else {
				_clone = target
			}

			this._clone = _clone
		}

		return _clone
	}

	public fill(source: TTarget|TSource): boolean {
		const { preferClone } = this
		return this.merger.merge(
			this.mergerState.mergerVisitor.getNextMerge(preferClone, preferClone),
			this.clone,
			source,
			source,
			() => {
				throw new Error(`Class (${this.type.name}) cannot be merged`)
			},
			preferClone,
			preferClone,
		)
	}
}

class MergeState<TTarget, TSource> {
	public mergerVisitor: MergerVisitor
	public base: TTarget
	public older: TTarget|TSource
	public newer: TTarget|TSource
	public set: (value: TTarget) => void
	public preferCloneOlder: boolean
	public preferCloneNewer: boolean
	public valueType: TClass<TTarget>
	public valueFactory: (source: TTarget|TSource) => TTarget

	constructor(
		mergerVisitor: MergerVisitor,
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set: (value: TTarget) => void,
		preferCloneOlder: boolean,
		preferCloneNewer: boolean,
		valueType: TClass<TTarget>,
		valueFactory: (source: TTarget|TSource) => TTarget,
	) {
		this.mergerVisitor = mergerVisitor
		this.base = base
		this.older = older
		this.newer = newer
		this.set = set
		this.preferCloneOlder = preferCloneOlder
		this.preferCloneNewer = preferCloneNewer
		this.valueType = valueType
		this.valueFactory = valueFactory
	}

	private _baseState: ValueState<TTarget, TSource>
	public get baseState(): ValueState<TTarget, TSource> {
		let { _baseState } = this
		if (_baseState == null) {
			this._baseState = _baseState = new ValueState<TTarget, TSource>(
				this,
				this.base,
				false,
			)
		}
		return _baseState
	}

	private _olderState: ValueState<TTarget, TSource>
	public get olderState(): ValueState<TTarget, TSource> {
		let { _olderState } = this
		if (_olderState == null) {
			this._olderState = _olderState = new ValueState<TTarget, TSource>(
				this,
				this.older as any,
				this.preferCloneOlder,
			)
		}
		return _olderState
	}

	private _newerState: ValueState<TTarget, TSource>
	public get newerState(): ValueState<TTarget, TSource> {
		let { _newerState } = this
		if (_newerState == null) {
			this._newerState = _newerState = new ValueState<TTarget, TSource>(
				this,
				this.newer as any,
				this.older === this.newer
					? this.preferCloneOlder || this.preferCloneNewer
					: this.preferCloneNewer,
			)
		}
		return _newerState
	}

	public fill(
		targetState: ValueState<TTarget, TSource>,
		sourceState: ValueState<TTarget, TSource>,
	): boolean {
		const canMerge = targetState.canMerge(sourceState.target)
		const {base, set} = this

		let setItem
		let result
		if (canMerge === true) {
			result = targetState.fill(sourceState.target)
			setItem = targetState.clone
		} else {
			setItem = canMerge == null && !targetState.mustBeCloned
				? targetState.clone
				: sourceState.clone
			result = setItem !== base
		}

		if (setItem !== base && set) {
			set(setItem)
		}

		return result
	}
}

export class MergerVisitor implements IMergerVisitor {
	public readonly typeMeta: ITypeMetaMergerCollection

	constructor(typeMeta: ITypeMetaMergerCollection) {
		this.typeMeta = typeMeta
	}

	public getNextMerge(
		preferCloneOlder: boolean,
		preferCloneNewer: boolean,
	): IMergeValue {
		return <TNextTarget, TNextSource>(
			next_base: TNextTarget,
			next_older: TNextSource,
			next_newer: TNextSource,
			next_set?: (value: TNextTarget) => void,
			next_preferCloneOlder?: boolean,
			next_preferCloneNewer?: boolean,
			next_valueType?: TClass<TNextTarget>,
			next_valueFactory?: (source: TNextTarget|TNextSource) => TNextTarget,
		) => this.merge(
			next_base,
			next_older,
			next_newer,
			next_set,
			next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder,
			next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer,
			next_valueType,
			next_valueFactory,
		)
	}

	public merge<TTarget extends any, TSource extends any>(
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set?: (value: TTarget) => void,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource|any) => TTarget,
	): boolean {
		if (base === newer) {
			if (base === older) {
				return false
			}
			preferCloneNewer = preferCloneOlder
			newer = older
		}

		if (isPrimitive(newer)) {
			if (set) { set(newer as any) }
			return true
		}

		const mergeState = new MergeState(
			this,
			base,
			older,
			newer,
			set,
			preferCloneOlder,
			preferCloneNewer,
			valueType,
			valueFactory,
		)

		if (isPrimitive(base)) {
			if (set) {
				if (isPrimitive(older) || older === newer) {
					set(mergeState.newerState.clone)
				} else {
					mergeState.fill(
						mergeState.olderState,
						mergeState.newerState,
					)
				}
			}

			return true
		} else if (isPrimitive(older)) {
			switch (mergeState.baseState.canMerge(newer)) {
				case null:
					if (set) {
						set(older as any)
					}
					break
				case false:
					if (set) {
						set(mergeState.newerState.clone)
					}
					break
				case true:
					if (!mergeState.baseState.fill(newer) && set) {
						set(older as any)
					}
					break
			}

			return true
		} else {
			switch (mergeState.baseState.canMerge(newer)) {
				case null:
					return mergeState.fill(mergeState.baseState, mergeState.olderState)
				case false:
					return mergeState.fill(mergeState.olderState, mergeState.newerState)
			}

			switch (mergeState.baseState.canMerge(older)) {
				case null:
				case false:
					return mergeState.fill(mergeState.baseState, mergeState.newerState)
				case true:
					return mergeState.baseState.merger.merge(
						this.getNextMerge(preferCloneOlder, preferCloneNewer),
						base,
						older,
						newer,
						set,
						preferCloneOlder,
						preferCloneNewer,
					)
			}

			throw new Error('Unreachable code')
		}
	}
}

// endregion

// region TypeMetaMergerCollection

export type TMergeableClass<TObject extends IMergeable<TObject, TSource>, TSource extends any>
	= new (...args: any[]) => TObject

export class TypeMetaMergerCollection
	extends TypeMetaCollection<ITypeMetaMerger<any, any>>
	implements ITypeMetaMergerCollection {
	
	constructor(proto?: ITypeMetaMergerCollection) {
		super(proto || TypeMetaMergerCollection.default)
	}

	public static default: TypeMetaMergerCollection = new TypeMetaMergerCollection()

	private static makeTypeMetaMerger<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
		type: TMergeableClass<TTarget, TSource>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): ITypeMetaMerger<TTarget, TSource> {
		return {
			merger: {
				canMerge(target: TTarget, source: TTarget|TSource): boolean {
					return target.canMerge
						? target.canMerge(source)
						: target.constructor === (source as any).constructor
				},
				merge(
					merge: IMergeValue,
					base: TTarget,
					older: TTarget|TSource,
					newer: TTarget|TSource,
					set?: (value: TTarget) => void,
					preferCloneOlder?: boolean,
					preferCloneNewer?: boolean,
				): boolean {
					return base.merge(
						merge,
						older,
						newer,
						preferCloneOlder,
						preferCloneNewer,
					)
				},
			},
			valueFactory: valueFactory || (() => new (type as new () => TTarget)()),
		}
	}

	public putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
		type: TMergeableClass<TTarget, TSource>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
	): ITypeMetaMerger<TTarget, TSource> {
		return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, valueFactory))
	}
}

export function registerMergeable<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
	type: TMergeableClass<TTarget, TSource>,
	valueFactory?: (source: TTarget|TSource) => TTarget,
) {
	TypeMetaMergerCollection.default.putMergeableType(type, valueFactory)
}

export function registerMerger<TTarget extends any, TSource extends any>(
	type: TClass<TTarget>,
	meta: ITypeMetaMerger<TTarget, TSource>,
) {
	TypeMetaMergerCollection.default.putType(type, meta)
}

// endregion

// region ObjectMerger

export class ObjectMerger implements IObjectMerger {
	public typeMeta: ITypeMetaMergerCollection

	constructor(typeMeta?: ITypeMetaMergerCollection) {
		this.typeMeta = new TypeMetaMergerCollection(typeMeta)
	}

	public static default: ObjectMerger = new ObjectMerger()

	public merge<TTarget extends any, TSource extends any>(
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set?: (value: TTarget) => void,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource|any) => TTarget,
	): boolean {
		const merger = new MergerVisitor(this.typeMeta)
		const mergedValue = merger.merge(
			base,
			older,
			newer,
			set,
			preferCloneOlder,
			preferCloneNewer,
			valueType,
			valueFactory,
		)
		return mergedValue
	}
}

// endregion

// region Primitive Mergers

// Handled in MergerVisitor:
// undefined
// null
// number
// boolean

registerMerger<string, string>(String as any, {
	merger: {
		merge(
			merge: IMergeValue,
			base: string,
			older: string,
			newer: string,
			set?: (value: string) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
		): boolean {
			set(newer)
			return true
		},
	},
})

// endregion

// region Object

registerMerger<object, object>(Object, {
	merger: {
		canMerge(target: object, source: object): boolean {
			if (source == null || typeof source !== 'object' || Object.isFrozen(target)) {
				return false
			}
			return true
		},
		merge(
			merge: IMergeValue,
			base: object,
			older: object,
			newer: object,
			set?: (value: object) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
		): boolean {
			return mergeObject(merge, base, older, newer, preferCloneOlder, preferCloneNewer)
		},
	},
})

// endregion

// // region Helpers
//
// export function mergeArray(
// 	merge: IMergeValue,
// 	base: any[],
// 	older: any[],
// 	newer: any[],
// ): any[] {
// 	const mergedValue = []
// 	for (let i = 0; i < length; i++) {
// 		mergedValue[i] = merge(value[i])
// 	}
//
// 	return mergedValue
// }
//
// export function mergeIterable(
// 	merge: IMergeValue,
// 	base: Iterable<any>,
// 	older: Iterable<any>,
// 	newer: Iterable<any>,
// ): Iterable<any> {
// 	const mergedValue = []
// 	for (const item of value) {
// 		mergedValue.push(merge(item))
// 	}
// 	return mergedValue
// }
//
// // endregion
//
//
//
// // region Array
//
// registerMerger<any[]>(Array, {
// 	merger: {
// 		merge(merge: IMergeValue, value: any[]): IMergedValueArray {
// 			return mergeArray(merge, value)
// 		},
// 	},
// })
//
// // endregion
//
// // region Set
//
// registerMerger<Set<any>>(Set, {
// 	merger: {
// 		merge(merge: IMergeValue, value: Set<any>): IMergedValueArray {
// 			return mergeIterable(merge, value)
// 		},
// 	},
// })
//
// // endregion
//
// // region Map
//
// registerMerger<Map<any, any>>(Map, {
// 	merger: {
// 		merge(merge: IMergeValue, value: Map<any, any>): IMergedValueArray {
// 			return mergeIterable(item => [
// 				merge(item[0]),
// 				merge(item[1]),
// 			], value)
// 		},
// 	},
// })
//
// // endregion
//
// // region Date
//
// registerMerger<Date>(Date, {
// 	merger: {
// 		merge(merge: IMergeValue, value: Date): number {
// 			return value.getTime()
// 		},
// 	},
// })
//
// // endregion

// endregion

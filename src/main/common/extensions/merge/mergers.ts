/* tslint:disable:no-nested-switch */
import {TClass, TypeMetaCollection} from '../TypeMeta'
import {
	IMergeable,
	IMergerVisitor, IMergeValue, IObjectMerger,
	ITypeMetaMerger, ITypeMetaMergerCollection, IValueMerge, IValueMerger,
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
	public isBase: boolean

	constructor(
		mergerState: MergeState<TTarget, TSource>,
		target: TTarget,
		preferClone: boolean,
		isBase: boolean,
	) {
		this.mergerState = mergerState
		this.target = target
		this.preferClone = preferClone
		this.isBase = isBase
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
			this._merger = _merger
		}
		return _merger
	}

	public get merge(): IValueMerge<TTarget, TSource> {
		const {merger} = this
		if (!merger.merge) {
			throw new Error(`Class (${this.type && this.type.name}) merger have no merge method`)
		}
		return merger.merge
	}

	private _mustBeCloned: boolean
	public get mustBeCloned(): boolean {
		let { _mustBeCloned } = this
		if (_mustBeCloned == null) {
			const valueType = this.mergerState.valueType

			let metaPreferClone = this.meta.preferClone
			if (typeof metaPreferClone === 'function') {
				metaPreferClone = metaPreferClone(this.target)
			}

			this._mustBeCloned = _mustBeCloned =
				(metaPreferClone != null ? metaPreferClone : this.preferClone)
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

	public canMerge(source: TTarget|TSource, target?: TTarget): boolean {
		const canMerge = this.merger.canMerge
		if (canMerge) {
			if (target == null) {
				target = this.target
			}
			const result = canMerge(target, source)
			if (result == null) {
				return null
			}
			if (typeof result !== 'boolean') {
				throw new Error(`Unknown canMerge() result (${(result as any).constructor.name}) for ${this.type.name}`)
			}
			return result
		}
		return this.target.constructor === this.type
	}

	private _clone: TTarget
	public get clone(): TTarget {
		let { _clone } = this
		if (_clone == null) {
			const { target } = this
			if (this.mustBeCloned) {
				_clone = this.cloneInstance

				const canMergeResult: boolean = this.canMerge(target, _clone)

				switch (canMergeResult) {
					case null:
						break
					case true:
						const { preferClone } = this
						this.merge(
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
}

class MergeState<TTarget, TSource> {
	public mergerVisitor: MergerVisitor
	public base: TTarget
	public older: TTarget|TSource
	public newer: TTarget|TSource
	public set: (value: TTarget) => void
	public preferCloneOlder: boolean
	public preferCloneNewer: boolean
	public preferCloneBase: boolean
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
		preferCloneBase: boolean,
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
		this.preferCloneBase = preferCloneBase
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
				this.preferCloneBase,
				true,
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
				false,
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
				this.preferCloneNewer,
				false,
			)
		}
		return _newerState
	}

	public fillOlderNewer(): void {
		const { olderState, newerState, set } = this
		const { preferClone } = olderState
		let isSet
		let setItem
		const result = olderState.merge(
			this.mergerVisitor.getNextMerge(preferClone, preferClone),
			olderState.clone,
			newerState.target,
			newerState.target,
			set
				? o => {
					setItem = o
					isSet = true
				}
				: () => {
					throw new Error(`Class ${olderState.type.name} does not need cloning.` +
						'You should use "preferClone: false" in merger options for this class')
				},
			preferClone,
			preferClone,
		)

		if (isSet) {
			return
		}

		if (result || newerState.mustBeCloned) {
			set(olderState.clone)
			return
		}

		set(newerState.target)
	}

	public mergeWithBase(older: TTarget|TSource, newer: TTarget|TSource): boolean {
		const { baseState, set } = this
		const { preferClone } = baseState
		let isSet
		let setItem
		const result = baseState.merge(
			this.mergerVisitor.getNextMerge(preferClone, preferClone),
			baseState.clone,
			older,
			newer,
			set
				? o => {
					setItem = o
					isSet = true
				}
				: () => {
					throw new Error(`Class ${baseState.type.name} does not need cloning.` +
						'You should use "preferClone: false" in merger options for this class')
				},
			preferClone,
			preferClone,
		)

		if (isSet) {
			return !!set
		}

		if (!result) {
			return false
		}

		if (baseState.mustBeCloned) {
			set(baseState.clone)
		}

		return true
	}
}

function mergePreferClone(o1, o2) {
	if (o1 || o2) {
		return true
	}
	return o1 == null ? o2 : o1
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

	// public merge<TTarget extends any, TSource extends any>(
	// 	base: TTarget,
	// 	older: TTarget|TSource,
	// 	newer: TTarget|TSource,
	// 	set?: (value: TTarget) => void,
	// 	preferCloneOlder?: boolean,
	// 	preferCloneNewer?: boolean,
	// 	valueType?: TClass<TTarget>,
	// 	valueFactory?: (source: TTarget|TSource|any) => TTarget,
	// ): boolean {
	// 	let preferCloneBase = null
	// 	if (base === newer) {
	// 		if (base === older) {
	// 			return false
	// 		}
	// 		preferCloneBase = preferCloneNewer
	// 		preferCloneNewer = preferCloneOlder
	// 		newer = older
	// 	}
	//
	// 	if (isPrimitive(newer)) {
	// 		if (set) {
	// 			set(newer as any)
	// 			return true
	// 		}
	// 		return false
	// 	}
	//
	// 	if (base === older) {
	// 		preferCloneBase = preferCloneOlder = mergePreferClone(preferCloneBase, preferCloneOlder)
	// 	}
	// 	if (older === newer) {
	// 		preferCloneOlder = preferCloneNewer = mergePreferClone(preferCloneOlder, preferCloneNewer)
	// 	}
	//
	// 	const mergeState = new MergeState(
	// 		this,
	// 		base,
	// 		older,
	// 		newer,
	// 		set,
	// 		preferCloneOlder,
	// 		preferCloneNewer,
	// 		preferCloneBase,
	// 		valueType,
	// 		valueFactory,
	// 	)
	//
	// 	if (isPrimitive(base)) {
	// 		if (set) {
	// 			if (isPrimitive(older) || older === newer) {
	// 				set(mergeState.newerState.clone)
	// 			} else {
	// 				return mergeState.fill(
	// 					mergeState.olderState,
	// 					mergeState.newerState,
	// 				)
	// 			}
	//
	// 			return true
	// 		}
	//
	// 		return false
	// 	} else if (isPrimitive(older)) {
	// 		switch (mergeState.baseState.canMerge(newer)) {
	// 			case null:
	// 				if (set) {
	// 					set(older as any)
	// 					return true
	// 				}
	// 				break
	// 			case false:
	// 				if (set) {
	// 					set(mergeState.newerState.clone)
	// 					return true
	// 				}
	// 				break
	// 			case true:
	// 				const result = mergeState.baseState. fill(newer)
	// 				if (!result) {
	// 					if (set) {
	// 						set(older as any)
	// 						return true
	// 					}
	// 				} else if (mergeState.baseState.mustBeCloned) {
	// 					if (set) {
	// 						set(mergeState.baseState.clone)
	// 						return true
	// 					} else {
	// 						return false
	// 					}
	// 				}
	//
	// 				return result
	// 		}
	//
	// 		return false
	// 	} else {
	// 		switch (mergeState.baseState.canMerge(newer)) {
	// 			case null:
	// 				return mergeState.fill(mergeState.baseState, mergeState.olderState)
	// 			case false:
	// 				if (set) {
	// 					if (older === newer) {
	// 						set(mergeState.newerState.clone)
	// 						return true
	// 					} else {
	// 						return mergeState.fill(mergeState.olderState, mergeState.newerState)
	// 					}
	// 				} else {
	// 					return false
	// 				}
	// 		}
	//
	// 		switch (mergeState.baseState.canMerge(older)) {
	// 			case null:
	// 			case false:
	// 				if (mergeState.baseState.fill(newer)) {
	// 					if (mergeState.baseState.mustBeCloned) {
	// 						if (set) {
	// 							set(mergeState.baseState.clone)
	// 							return true
	// 						}
	// 						return false
	// 					} else {
	// 						return true
	// 					}
	// 				}
	//
	// 				return mergeState.fill(mergeState.baseState, mergeState.olderState)
	// 			case true:
	// 				let setItem = mergeState.baseState.clone
	// 				const result = mergeState.baseState.merge(
	// 					this.getNextMerge(preferCloneOlder, preferCloneNewer),
	// 					setItem,
	// 					older,
	// 					newer,
	// 					set ? o => setItem = o : null,
	// 					preferCloneOlder,
	// 					preferCloneNewer,
	// 				)
	//
	// 				if (setItem !== mergeState.baseState.clone) {
	// 					set(setItem)
	// 					return true
	// 				} else if (result && mergeState.baseState.mustBeCloned) {
	// 					if (set) {
	// 						set(mergeState.baseState.clone)
	// 					} else {
	// 						return false
	// 					}
	// 				}
	//
	// 				return result
	// 		}
	//
	// 		throw new Error('Unreachable code')
	// 	}
	// }

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
		let preferCloneBase = null
		if (base === newer) {
			if (base === older) {
				return false
			}
			preferCloneBase = preferCloneNewer
			preferCloneNewer = preferCloneOlder
			newer = older
		}

		if (isPrimitive(newer)) {
			if (set) {
				set(newer as any)
				return true
			}
			return false
		}

		if (base === older) {
			preferCloneBase = preferCloneOlder = mergePreferClone(preferCloneBase, preferCloneOlder)
		}
		if (older === newer) {
			preferCloneOlder = preferCloneNewer = mergePreferClone(preferCloneOlder, preferCloneNewer)
		}

		const mergeState = new MergeState(
			this,
			base,
			older,
			newer,
			set,
			preferCloneOlder,
			preferCloneNewer,
			preferCloneBase,
			valueType,
			valueFactory,
		)

		const fillOlderNewer = () => {
			switch (mergeState.olderState.canMerge(newer)) {
				case null:
					if (mergeState.olderState.mustBeCloned) {
						set(mergeState.newerState.clone)
					} else {
						if (mergeState.newerState.mustBeCloned) {
							set(mergeState.olderState.target)
						} else {
							set(mergeState.newerState.target)
						}
					}
					break
				case false:
					set(mergeState.newerState.clone)
					break
				case true:
					mergeState.fillOlderNewer()
					return true
			}
		}

		if (isPrimitive(base)) {
			if (set) {
				if (isPrimitive(older) || older === newer) {
					set(mergeState.newerState.clone)
				} else {
					fillOlderNewer()
				}

				return true
			}

			return false
		}

		if (!set && mergeState.baseState.mustBeCloned) {
			return false
		}

		if (isPrimitive(older)) {
			switch (mergeState.baseState.canMerge(newer)) {
				case null:
					if (set) {
						set(older as any)
						return true
					}
					break
				case false:
					if (set) {
						set(mergeState.newerState.clone)
						return true
					}
					break
				case true:
					if (!mergeState.mergeWithBase(newer, newer)) {
						if (set) {
							set(older as any)
							return true
						}
						return false
					}
					return true
			}

			return false
		}

		switch (mergeState.baseState.canMerge(newer)) {
			case false:
				if (set) {
					fillOlderNewer()
					return true
				}
				return false
			case null:
				switch (mergeState.baseState.canMerge(older)) {
					case null:
						return false
					case false:
						if (set) {
							set(mergeState.olderState.clone)
							return true
						}
						return false
					case true:
						return mergeState.mergeWithBase(older, older)
				}
				throw new Error('Unreachable code')
		}

		switch (mergeState.baseState.canMerge(older)) {
			case null:
				if (!mergeState.mergeWithBase(newer, newer)) {
					throw new Error('base == newer; base == older; base != newer')
				}
				return true
			case false:
				if (!mergeState.mergeWithBase(newer, newer)) {
					if (set) {
						set(mergeState.olderState.clone)
						return true
					}
					return false
				}
				return true
			case true:
				return mergeState.mergeWithBase(older, newer)
		}

		throw new Error('Unreachable code')
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
		// canMerge(target: object, source: object): boolean {
		// 	if (typeof source !== 'string') {
		// 		return false
		// 	}
		// 	return true
		// },
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
	preferClone: false,
})

// endregion

// region Object

registerMerger<object, object>(Object, {
	merger: {
		canMerge(target: object, source: object): boolean {
			if (source.constructor !== Object) { // || Object.isFrozen(target)) {
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
	preferClone: o => Object.isFrozen(o) ? true : null,
})

// endregion

// region Date

registerMerger<Date, Date>(Date, {
	merger: {
		canMerge(target: Date, source: Date): boolean {
			if (source.constructor !== Date) {
				return false
			}
			return target.getTime() === source.getTime()
				? null
				: false
		},
	},
	valueFactory: (source: Date) => new Date(source),
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

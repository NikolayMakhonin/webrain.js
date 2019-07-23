import {TClass, TypeMetaCollection} from '../TypeMeta'
import {
	IMergeable,
	IMergerVisitor, IMergeValue, IObjectMerger,
	ITypeMetaMerger, ITypeMetaMergerCollection, IValueMerger,
} from './contracts'

// region MergerVisitor

function isPrimitive(value) {
	return value == null
		|| typeof value === 'number'
		|| typeof value === 'boolean'
}

function getMerger<TTarget extends any, TSource extends any>(
	meta: ITypeMetaMerger<TTarget, TSource>,
	valueType: TClass<TTarget>,
): IValueMerger<TTarget, TSource> {
	const merger = meta.merger
	if (!merger) {
		throw new Error(`Class (${valueType && valueType.name}) type meta have no merger`)
	}

	if (!merger.merge) {
		throw new Error(`Class (${valueType && valueType.name}) merger have no merge method`)
	}

	return merger
}

class ValueState<TTarget, TSource> {
	private _mergerVisitor: MergerVisitor
	public target: TTarget
	public valueType: TClass<TTarget>
	public ctor: TClass<TTarget>
	public type: TClass<TTarget>
	public preferClone: boolean
	public valueFactory: (source: TTarget|TSource) => TTarget

	constructor(
		mergerVisitor: MergerVisitor,
		target: TTarget,
		valueType: TClass<TTarget>,
		valueFactory: (source: TTarget|TSource) => TTarget,
		preferClone: boolean,
	) {
		this._mergerVisitor = mergerVisitor
		this.target = target
		this.valueType = valueType
		this.valueFactory = valueFactory
		this.preferClone = preferClone
		this.ctor = target.constructor as any
		this.type = valueType || target.constructor as any
	}

	private _meta: ITypeMetaMerger<TTarget, TSource>
	public get meta(): ITypeMetaMerger<TTarget, TSource> {
		let { _meta } = this
		if (!_meta) {
			_meta = this._mergerVisitor.typeMeta.getMeta(this.type)
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
			const valueType = this.valueType
			const metaPreferClone = this.meta.preferClone
			this._mustBeCloned = _mustBeCloned =
				(metaPreferClone == null ? this.preferClone : metaPreferClone)
				|| valueType && valueType !== this.ctor
		}
		return _mustBeCloned
	}

	private _cloneInstance: TTarget
	public get cloneInstance(): TTarget {
		let { _cloneInstance } = this
		if (_cloneInstance == null) {
			const {target, type} = this
			_cloneInstance = (this.valueFactory
				|| this.meta.valueFactory
				|| (() => (!this.valueType || this.ctor === this.valueType) && new type())
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
		}
		return this.ctor !== this.type
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
							this._mergerVisitor.getNextMerge(preferClone, preferClone),
							_clone,
							target,
							target,
							o => {
								throw new Error(`Class (${this.type.name}) cannot be merged with clone`)
							},
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
			this._mergerVisitor.getNextMerge(preferClone, preferClone),
			this.clone,
			source,
			source,
			o => {
				throw new Error(`Class (${this.type.name}) cannot be merged`)
			},
		)
	}
}

export class MergerVisitor implements IMergerVisitor {
	public readonly typeMeta: ITypeMetaMergerCollection

	constructor(typeMeta: ITypeMetaMergerCollection) {
		this.typeMeta = typeMeta
	}

	// public mergeOld<TTarget extends any, TSource extends any>(
	// 	base: TTarget,
	// 	older: TTarget|TSource,
	// 	newer: TTarget|TSource,
	// 	set?: (value: TTarget) => void,
	// 	valueType?: TClass<TTarget>,
	// 	valueFactory?: () => TTarget,
	// 	preferClone?: boolean,
	// ): boolean {
	// 	if (base === newer) {
	// 		if (base === older) {
	// 			return false
	// 		}
	// 		newer = older
	// 	}
	//
	// 	if (newer == null
	// 		|| typeof newer === 'number'
	// 		|| typeof newer === 'boolean'
	// 	) {
	// 		if (set) { set(newer) }
	// 		return true
	// 	}
	//
	// 	let meta: ITypeMetaMerger<TTarget, TSource>
	// 	// multiple call
	// 	const getMeta = () => {
	// 		if (!meta) {
	// 			meta = this._typeMeta.getMeta(valueType || base.constructor)
	// 			if (!meta) {
	// 				throw new Error(`Class (${base.constructor.name}) have no type meta`)
	// 			}
	// 		}
	//
	// 		return meta
	// 	}
	//
	// 	let merger: IValueMerger<TTarget, TSource>
	// 	const getMerger = () => {
	// 		if (!merger) {
	// 			merger = getMeta().merger
	// 			if (!merger) {
	// 				throw new Error(`Class (${newer.constructor.name}) type meta have no merger`)
	// 			}
	//
	// 			if (!merger.merge) {
	// 				throw new Error(`Class (${newer.constructor.name}) merger have no merge method`)
	// 			}
	// 		}
	//
	// 		return merger
	// 	}
	//
	// 	if (base != null
	// 		&& typeof base !== 'number'
	// 		&& typeof base !== 'boolean'
	// 	) {
	// 		const canMerge = getMerger().canMerge
	// 		if (!canMerge && newer.constructor !== base.constructor
	// 			|| canMerge && !canMerge(base, newer)) {
	// 			if (set) {
	// 				set(newer)
	// 			}
	// 			return true
	// 		}
	// 	}
	//
	// 	const nextMerge: IMergeValue = <TNextTarget, TNextSource>(
	// 		next_base: TNextTarget,
	// 		next_older: TNextSource,
	// 		next_newer: TNextSource,
	// 		next_set?: (value: TNextTarget) => void,
	// 		next_valueType?: TClass<TNextTarget>,
	// 		next_valueFactory?: () => TNextTarget,
	// 		next_preferClone?: boolean,
	// 	) => this.merge(
	// 		next_base,
	// 		next_older,
	// 		next_newer,
	// 		next_set,
	// 		next_valueType,
	// 		next_valueFactory,
	// 		next_preferClone == null ? preferClone : next_preferClone,
	// 	)
	//
	// 	const merge = (setFunc: (value: TTarget) => void): boolean => getMerger().merge(
	// 		nextMerge,
	// 		base,
	// 		older,
	// 		newer,
	// 		setFunc,
	// 	)
	//
	// 	valueFactory = (valueType || valueFactory)
	// 		&& (preferClone || getMeta().preferClone)
	// 		&& (valueFactory || getMeta().valueFactory)
	//
	// 	const clone = value => {
	// 		let setValue
	// 		if (valueFactory) {
	// 			setValue = base = valueFactory()
	// 			merge(val => {
	// 				if (val !== base) {
	// 					throw new Error(`Class (${val.constructor.name}) cannot be clone using constructor and merger`)
	// 				}
	// 			})
	// 		} else {
	// 			setValue = value
	// 		}
	//
	// 		if (set) { set(setValue) }
	// 	}
	//
	// 	if (base == null
	// 		|| typeof base === 'number'
	// 		|| typeof base === 'boolean'
	// 	) {
	// 		clone(newer)
	// 		return true
	// 	}
	//
	// 	// if (merge(valueFactory
	// 	// 	? value => clone(newer)
	// 	// 	: set)
	// 	// ) {
	// 	// 	return true
	// 	// }
	// 	//
	// 	// if (newer === older) {
	// 	// 	return false
	// 	// }
	// 	//
	// 	// newer = older
	// 	//
	// 	// if (!canBeSource && newer.constructor !== base.constructor
	// 	// 	|| canBeSource && !meta.canBeSource(newer)) {
	// 	// 	if (set) { set(newer) }
	// 	// 	return true
	// 	// }
	//
	// 	return merge(valueFactory
	// 		? value => clone(newer)
	// 		: set)
	// }

	public getNextMerge(
		preferCloneOlder: boolean,
		preferCloneNewer: boolean,
	): IMergeValue {
		return <TNextTarget, TNextSource>(
			next_base: TNextTarget,
			next_older: TNextSource,
			next_newer: TNextSource,
			next_set?: (value: TNextTarget) => void,
			next_valueType?: TClass<TNextTarget>,
			next_valueFactory?: (source: TNextTarget|TNextSource) => TNextTarget,
			next_preferCloneOlder?: boolean,
			next_preferCloneNewer?: boolean,
		) => this.merge(
			next_base,
			next_older,
			next_newer,
			next_set,
			next_valueType,
			next_valueFactory,
			next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder,
			next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer,
		)
	}

	public merge<TTarget extends any, TSource extends any>(
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set?: (value: TTarget) => void,
		valueType?: TClass<TTarget>,
		valueFactory?: (source: TTarget|TSource) => TTarget,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
	): boolean {
		if (base === newer) {
			if (base === older) {
				return false
			}
			newer = older
		}

		if (isPrimitive(newer)) {
			if (set) { set(newer as any) }
			return true
		}

		// const fill = (
		// 	target: TTarget,
		// 	value: TTarget|TSource,
		// 	// tslint:disable-next-line:no-shadowed-variable
		// 	set: (value: TTarget) => void,
		// 	preferClone: boolean,
		// ) => {
		// 	const constructor = value.constructor as TClass<TTarget>
		// 	const type = valueType || constructor
		// 	const meta = this.getMeta<TTarget, TSource>(type)
		// 	const merger = getMerger(meta, type)
		//
		// 	const canMerge = merger.canMerge
		// 	const canMergeResult: boolean = canMerge
		// 		? canMerge(target, value)
		// 		: value.constructor !== type
		//
		// 	switch (canMergeResult) {
		// 		case null:
		// 			return true
		// 		case true:
		// 			return merger.merge(
		// 				this.getNextMerge(preferClone, preferClone),
		// 				base,
		// 				value,
		// 				value,
		// 				o => {
		// 					set(cloneIfNeeded(o, preferClone))
		// 				},
		// 			)
		// 		case false:
		// 			throw new Error(`Class (${type.name}) cannot be merged with clone`)
		// 		default:
		// 			throw new Error(`Unknown canMerge() result (${canMergeResult.constructor.name}) for ${type.name}`)
		// 	}
		// }

		if (isPrimitive(base)) {
			if (set) {
				if (isPrimitive(older) || older === newer) {
					const valueState = new ValueState<TTarget, TSource>(
						this,
						newer as any,
						valueType,
						valueFactory,
						older === newer
							? preferCloneOlder || preferCloneNewer
							: preferCloneNewer,
					)

					set(valueState.clone)

					return true
				} else {
					const olderState = new ValueState<TTarget, TSource>(
						this,
						older as any,
						valueType,
						valueFactory,
						preferCloneOlder,
					)

					const canMerge = olderState.canMerge(newer)
					if (canMerge === true) {
						olderState.fill(newer)
						set(olderState.clone)
					} else {
						const state = canMerge == null && !olderState.mustBeCloned
							? olderState
							: new ValueState<TTarget, TSource>(
								this,
								newer as any,
								valueType,
								valueFactory,
								preferCloneNewer,
							)

						set(state.clone)
					}
				}
			}

			return true
		} else if (isPrimitive(older)) {
			const baseState = new ValueState<TTarget, TSource>(
				this,
				base as any,
				valueType,
				valueFactory,
				false,
			)

			switch (baseState.canMerge(newer)) {
				case null:
					if (set) {
						set(older as any)
					}
					break
				case false:
					if (set) {
						const newerState = new ValueState<TTarget, TSource>(
							this,
							newer as any,
							valueType,
							valueFactory,
							preferCloneNewer,
						)

						set(newerState.clone)
					}
					break
				case true:
					if (!baseState.fill(newer) && set) {
						set(older as any)
					}
					break
			}

			return true
		} else {
			const baseState = new ValueState<TTarget, TSource>(
				this,
				base as any,
				valueType,
				valueFactory,
				false,
			)

			switch (baseState.canMerge(newer)) {
				case null:
					return baseState.fill(older)
				case false:
					if (set) {
						const newerState = new ValueState<TTarget, TSource>(
							this,
							newer as any,
							valueType,
							valueFactory,
							preferCloneNewer,
						)

						set(newerState.clone)
					}
					return true
				case true:
					if (!baseState.fill(newer) && set) {
						set(older as any)
					}
					break
			}


		}







			// if (base != null
		// 	&& typeof base !== 'number'
		// 	&& typeof base !== 'boolean'
		// ) {
		// 	const canMerge = getMerger().canMerge
		// 	if (!canMerge && newer.constructor !== base.constructor
		// 		|| canMerge && !canMerge(base, newer)) {
		// 		if (set) {
		// 			set(newer)
		// 		}
		// 		return true
		// 	}
		// }
		//
		//
		// const merge = (setFunc: (value: TTarget) => void): boolean => getMerger().merge(
		// 	nextMerge,
		// 	base,
		// 	older,
		// 	newer,
		// 	setFunc,
		// )
		//
		// valueFactory = (valueType || valueFactory)
		// 	&& (preferClone || getMeta().preferClone)
		// 	&& (valueFactory || getMeta().valueFactory)
		//
		// const clone = value => {
		// 	let setValue
		// 	if (valueFactory) {
		// 		setValue = base = valueFactory()
		// 		merge(val => {
		// 			if (val !== base) {
		// 				throw new Error(`Class (${val.constructor.name}) cannot be clone using constructor and merger`)
		// 			}
		// 		})
		// 	} else {
		// 		setValue = value
		// 	}
		//
		// 	if (set) { set(setValue) }
		// }
		//
		// if (base == null
		// 	|| typeof base === 'number'
		// 	|| typeof base === 'boolean'
		// ) {
		// 	clone(newer)
		// 	return true
		// }

		// return merge(valueFactory
		// 	? value => clone(newer)
		// 	: set)
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
		valueFactory?: () => TTarget,
	): ITypeMetaMerger<TTarget, TSource> {
		return {
			merger: {
				canMerge(target: TTarget, source: TTarget|TSource): boolean {
					return target.canMerge
						? target.canMerge(source)
						: target.constructor === source.constructor
				},
				merge(
					merge: IMergeValue,
					base: TTarget,
					older: TTarget|TSource,
					newer: TTarget|TSource,
					set?: (value: TTarget) => void,
				): boolean {
					return base.merge(
						merge,
						older,
						newer,
						set,
					)
				},
			},
			valueFactory: valueFactory || (() => new (type as new () => TTarget)()),
		}
	}

	public putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
		type: TMergeableClass<TTarget, TSource>,
		valueFactory?: () => TTarget,
	): ITypeMetaMerger<TTarget, TSource> {
		return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, valueFactory))
	}
}

export function registerMergeable<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
	type: TMergeableClass<TTarget, TSource>,
	valueFactory?: () => TTarget,
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
		valueType?: TClass<TTarget>,
		set?: (value: TTarget) => void,
		valueFactory?: () => TTarget,
		preferClone?: boolean,
	): boolean {
		const merger = new MergerVisitor(this.typeMeta)
		const mergedValue = merger.merge(base, older, newer, set, valueType, valueFactory, preferClone)
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
		): boolean {
			set(newer)
			return true
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
// // region Object
//
// registerMerger<object, object>(Object, {
// 	merger: {
// 		merge(
// 			merge: IMergeValue,
// 			base: object,
// 			older: object,
// 			newer: object,
// 			set?: (value: object) => void,
// 		): boolean {
// 			const mergedValue = {}
// 			for (const key in value) {
// 				if (Object.prototype.hasOwnProperty.call(value, key)) {
// 					mergedValue[key] = merge(value[key])
// 				}
// 			}
// 			return mergedValue
// 		},
// 		// merge2(merge: IMergeValue, value: object): IMergedObject {
// 		// 	const mergedValue = {}
// 		// 	for (const key in value) {
// 		// 		if (Object.prototype.hasOwnProperty.call(value, key)) {
// 		// 			mergedValue[key] = merge(value[key])
// 		// 		}
// 		// 	}
// 		// 	return mergedValue
// 		// },
// 	},
// })
//
// // endregion
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

import {TClass, TypeMetaCollection} from '../TypeMeta'
import {
	IMergeable,
	IMergerVisitor, IMergeValue, IObjectMerger,
	ITypeMetaMerger, ITypeMetaMergerCollection, IValueMerger,
} from './contracts'

// region MergerVisitor

export class MergerVisitor implements IMergerVisitor {
	private _typeMeta: ITypeMetaMergerCollection

	constructor(typeMeta: ITypeMetaMergerCollection) {
		this._typeMeta = typeMeta
	}

	public merge<TTarget extends any, TSource extends any>(
		base: TTarget,
		older: TSource,
		newer?: TSource,
		set?: (value: TTarget) => void,
		valueType?: TClass,
		valueFactory?: () => TTarget,
		preferClone?: boolean,
	): boolean {
		if (base as any === newer) {
			if (base as any === older) {
				return false
			}
			newer = older
		}

		if (newer == null
			|| typeof newer === 'number'
			|| typeof newer === 'boolean'
		) {
			if (set) { set(newer as any) }
			return true
		}

		let meta: ITypeMetaMerger<TTarget, TSource>
		// multiple call
		const getMeta = () => {
			if (!meta) {
				meta = this._typeMeta.getMeta(valueType || base.constructor)
				if (!meta) {
					throw new Error(`Class (${base.constructor.name}) have no type meta`)
				}
			}

			return meta
		}

		if (!getMeta().canBeSource || !meta.canBeSource(newer)) {
			if (set) { set(newer as any) }
			return true
		}

		let merger: IValueMerger<TTarget, TSource>
		const getMerger = () => {
			if (!merger) {
				merger = getMeta().merger
				if (!merger) {
					throw new Error(`Class (${newer.constructor.name}) type meta have no merger`)
				}

				if (!merger.merge) {
					throw new Error(`Class (${newer.constructor.name}) merger have no merge method`)
				}
			}

			return merger
		}

		const nextMerge: IMergeValue = <TNextTarget, TNextSource>(
			next_base: TNextTarget,
			next_older: TNextSource,
			next_newer?: TNextSource,
			next_set?: (value: TNextTarget) => void,
			next_valueType?: TClass,
			next_valueFactory?: () => TNextTarget,
			next_preferClone?: boolean,
		) => this.merge(
			next_base,
			next_older,
			next_newer,
			next_set,
			next_valueType,
			next_valueFactory,
			next_preferClone == null ? preferClone : next_preferClone,
		)

		const merge = (setFunc: (value: TTarget) => void): boolean => getMerger().merge(
			nextMerge,
			base,
			older,
			newer,
			setFunc,
		)

		valueFactory = (valueType || valueFactory)
			&& (preferClone || getMeta().preferClone)
			&& (valueFactory || getMeta().valueFactory)

		const clone = value => {
			let setValue
			if (valueFactory) {
				setValue = base = valueFactory()
				merge(val => {
					if (val !== base) {
						throw new Error(`Class (${val.constructor.name}) cannot be clone using constructor and merger`)
					}
				})
			} else {
				setValue = value
			}

			if (set) { set(setValue as any) }
		}

		if (base == null
			|| typeof base === 'number'
			|| typeof base === 'boolean'
		) {
			clone(newer)
			return true
		}

		// if (merge(valueFactory
		// 	? value => clone(newer)
		// 	: set)
		// ) {
		// 	return true
		// }
		//
		// if (newer === older) {
		// 	return false
		// }
		//
		// newer = older
		//
		// if (!getMeta().canBeSource || !meta.canBeSource(newer)) {
		// 	if (set) { set(newer as any) }
		// 	return true
		// }

		return merge(valueFactory
			? value => clone(newer)
			: set)
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
				merge(
					merge: IMergeValue,
					base: TTarget,
					older: TSource,
					newer?: TSource,
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
	type: TClass,
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
		older: TSource,
		newer?: TSource,
		valueType?: TClass,
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

registerMerger<string, string>(String, {
	merger: {
		merge(
			merge: IMergeValue,
			base: string,
			older: string,
			newer?: string,
			set?: (value: string) => void,
		): boolean {
			set(newer)
			return true
		},
	},
})

// endregion

// region Helpers

export function mergeArray(
	merge: IMergeValue,
	base: any[],
	older: any[],
	newer?: any[],
): any[] {
	const mergedValue = []
	for (let i = 0; i < length; i++) {
		mergedValue[i] = merge(value[i])
	}

	return mergedValue
}

export function mergeIterable(
	merge: IMergeValue,
	base: Iterable<any>,
	older: Iterable<any>,
	newer?: Iterable<any>,
): Iterable<any> {
	const mergedValue = []
	for (const item of value) {
		mergedValue.push(merge(item))
	}
	return mergedValue
}

// endregion

// region Object

registerMerger<object, object>(Object, {
	merger: {
		merge(
			merge: IMergeValue,
			base: object,
			older: object,
			newer?: object,
			set?: (value: object) => void,
		): boolean {
			const mergedValue = {}
			for (const key in value) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					mergedValue[key] = merge(value[key])
				}
			}
			return mergedValue
		},
		// merge2(merge: IMergeValue, value: object): IMergedObject {
		// 	const mergedValue = {}
		// 	for (const key in value) {
		// 		if (Object.prototype.hasOwnProperty.call(value, key)) {
		// 			mergedValue[key] = merge(value[key])
		// 		}
		// 	}
		// 	return mergedValue
		// },
	},
})

// endregion

// region Array

registerMerger<any[]>(Array, {
	merger: {
		merge(merge: IMergeValue, value: any[]): IMergedValueArray {
			return mergeArray(merge, value)
		},
	},
})

// endregion

// region Set

registerMerger<Set<any>>(Set, {
	merger: {
		merge(merge: IMergeValue, value: Set<any>): IMergedValueArray {
			return mergeIterable(merge, value)
		},
	},
})

// endregion

// region Map

registerMerger<Map<any, any>>(Map, {
	merger: {
		merge(merge: IMergeValue, value: Map<any, any>): IMergedValueArray {
			return mergeIterable(item => [
				merge(item[0]),
				merge(item[1]),
			], value)
		},
	},
})

// endregion

// region Date

registerMerger<Date>(Date, {
	merger: {
		merge(merge: IMergeValue, value: Date): number {
			return value.getTime()
		},
	},
})

// endregion

// endregion

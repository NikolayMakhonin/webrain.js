import {TClass, TypeMetaCollection} from '../TypeMeta'
import {
	IMergeable,
	IMergerVisitor, IMergeValue, IObjectMerger,
	ITypeMetaMerger, ITypeMetaMergerCollection,
} from './contracts'

// region MergerVisitor

export class MergerVisitor implements IMergerVisitor {
	private _typeMeta: ITypeMetaMergerCollection

	constructor(typeMeta: ITypeMetaMergerCollection) {
		this._typeMeta = typeMeta
	}

	public merge<TValue extends any>(base: TValue, older: TValue, newer?: TValue, valueType?: TClass): TValue {
		if (base === newer) {
			if (base === older) {
				return older
			}
			newer = older
		}

		if (base == null
			|| newer == null
			|| typeof base === 'number'
			|| typeof base === 'boolean'
			|| typeof newer === 'number'
			|| typeof newer === 'boolean'
			|| typeof base !== typeof newer
			|| base.constructor !== newer.constructor
		) {
			return newer
		}

		const meta = this._typeMeta.getMeta(valueType || base.constructor)
		if (!meta) {
			throw new Error(`Class (${base.constructor.name}) have no type meta`)
		}

		const merger = meta.merger
		if (!merger) {
			throw new Error(`Class (${newer.constructor.name}) type meta have no merger`)
		}

		if (!merger.merge) {
			throw new Error(`Class (${newer.constructor.name}) merger have no merge method`)
		}

		return merger.merge(this.merge.bind(this), base, older, newer)
	}
}

// endregion

// region TypeMetaMergerCollection

export type TMergeableClass<TObject extends IMergeable<TObject>>
	= new (...args: any[]) => TObject

export class TypeMetaMergerCollection
	extends TypeMetaCollection<ITypeMetaMerger<any>>
	implements ITypeMetaMergerCollection {
	
	constructor(proto?: ITypeMetaMergerCollection) {
		super(proto || TypeMetaMergerCollection.default)
	}

	public static default: TypeMetaMergerCollection = new TypeMetaMergerCollection()

	private static makeTypeMetaMerger<TObject extends IMergeable<TObject>>(
		type: TMergeableClass<TObject>,
		valueFactory?: () => TObject,
	): ITypeMetaMerger<TObject> {
		return {
			merger: {
				merge(
					merge: IMergeValue,
					base: TObject,
					older: TObject,
					newer?: TObject,
				): TObject {
					return base.merge(older, newer)
				},
			},
			valueFactory: valueFactory || (() => new (type as new () => TObject)()),
		}
	}

	public putMergeableType<TObject extends IMergeable<TObject>>(
		type: TMergeableClass<TObject>,
		valueFactory?: () => TObject,
	): ITypeMetaMerger<TObject> {
		return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, valueFactory))
	}
}

export function registerMergeable<TObject extends IMergeable<TObject>>(
	type: TMergeableClass<TObject>,
	valueFactory?: () => TObject,
) {
	TypeMetaMergerCollection.default.putMergeableType(type, valueFactory)
}

export function registerMerger<TValue extends any>(
	type: TClass,
	meta: ITypeMetaMerger<TValue>,
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

	public merge<TValue extends any>(
		base: TValue,
		older: TValue,
		newer?: TValue,
		valueType?: TClass,
	): TValue {
		const merger = new MergerVisitor(this.typeMeta)
		const mergedValue = merger.merge(base, older, newer, valueType)
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

registerMerger<string>(String, {
	merger: {
		merge(
			merge: IMergeValue,
			base: string,
			older: string,
			newer?: string
		): string {
			return newer // TODO
		}
	},
})

// endregion

// region Helpers

export function mergeArray(
	merge: IMergeValue,
	value: any[],
	length?: number,
): IMergedValueArray {
	if (length == null) {
		length = value.length
	}

	const mergedValue = []
	for (let i = 0; i < length; i++) {
		mergedValue[i] = merge(value[i])
	}

	return mergedValue
}

export function mergeIterable(
	merge: IMergeValue,
	value: Iterable<any>,
): IMergedValueArray {
	const mergedValue = []
	for (const item of value) {
		mergedValue.push(merge(item))
	}
	return mergedValue
}

// endregion

// region Object

registerMerger<object>(Object, {
	merger: {
		merge(merge: IMergeValue, value: object): IMergedObject {
			const mergedValue = {}
			for (const key in value) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					mergedValue[key] = merge(value[key])
				}
			}
			return mergedValue
		},
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

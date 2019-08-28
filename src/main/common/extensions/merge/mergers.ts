/* tslint:disable:no-nested-switch ban-types use-primitive-type */
import {isIterable, TClass, typeToDebugString} from '../../helpers/helpers'
import {canHaveUniqueId, getObjectUniqueId} from '../../lists/helpers/object-unique-id'
import {fillMap, fillSet} from '../../lists/helpers/set'
import {TypeMetaCollection} from '../TypeMeta'
import {
	IMergeable, IMergeOptions,
	IMergerVisitor, IMergeValue, IMergeVisitorOptions, IObjectMerger,
	ITypeMetaMerger, ITypeMetaMergerCollection, IValueMerge, IValueMerger,
} from './contracts'
import {createMergeMapWrapper, mergeMaps} from './merge-maps'
import {createMergeSetWrapper} from './merge-sets'

// region MergerVisitor

class ValueState<TTarget, TSource> {
	public mergerState: MergeState<TTarget, TSource>
	public target: TTarget
	public type: TClass<TTarget>
	public preferClone: boolean
	public selfAsValue: boolean
	public refs: any[]

	constructor(
		mergerState: MergeState<TTarget, TSource>,
		target: TTarget,
		preferClone: boolean,
		selfAsValue: boolean,
		refs: any[],
	) {
		this.mergerState = mergerState
		this.target = target
		this.preferClone = preferClone
		this.selfAsValue = selfAsValue
		this.refs = refs
		const {options} = this.mergerState
		this.type = options && options.valueType || target.constructor as any
	}

	public resolveRef() {
		if (this._isRef == null) {
			if (this.selfAsValue) {
				this._isRef = false
			} else {
				const ref = this.getRef()
				if (ref) {
					this.target = ref
					this._isRef = true
				} else {
					this._isRef = false
				}
			}
		}
	}

	private _isRef: boolean
	public get isRef(): boolean {
		this.resolveRef()
		return this._isRef
	}

	public getRef(): any {
		const {refs} = this
		if (refs) {
			const id = getObjectUniqueId(this.target as any)
			if (id != null) {
				const ref = refs[id]
				return ref
			}
		}
		return null
	}

	public setRef(refObj: any): void {
		const id = getObjectUniqueId(this.target as any)
		if (id != null) {
			let {refs} = this
			if (refs == null) {
				this.refs = refs = []
			}
			refs[id] = refObj
		}
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
			const {options} = this.mergerState
			const valueType = options && options.valueType

			let metaPreferClone = this.meta.preferClone
			if (typeof metaPreferClone === 'function') {
				metaPreferClone = metaPreferClone(this.target)
			}

			this._mustBeCloned = _mustBeCloned =
				(metaPreferClone != null
					? metaPreferClone
					: this.preferClone && !this.isRef && !this.mergerState.mergerVisitor.getStatus(this.target))
				|| valueType && valueType !== this.target.constructor
		}
		return _mustBeCloned
	}

	private _cloneInstance: TTarget
	public get cloneInstance(): TTarget {
		let { _cloneInstance } = this
		if (_cloneInstance == null) {
			const {target, type} = this
			const {options} = this.mergerState
			_cloneInstance = (options && options.valueFactory
				|| this.meta.valueFactory
				|| (() => (!options || !options.valueType
					|| this.target.constructor === (options && options.valueType)) && new type())
			)(target)

			if (!_cloneInstance) {
				throw new Error(`Class (${typeToDebugString(type)}) cannot be clone`)
			}

			if (_cloneInstance === target) {
				throw new Error(`Clone result === Source for (${typeToDebugString(type)})`)
			}

			if (_cloneInstance.constructor !== type) {
				throw new Error(`Clone type !== (${typeToDebugString(type)})`)
			}

			this._cloneInstance = _cloneInstance
		}
		return _cloneInstance
	}

	public canMerge(source: ValueState<TTarget, TSource>, target?: TTarget): boolean {
		const canMerge = this.merger.canMerge
		if (canMerge) {
			if (target == null) {
				target = this.target
				if (this.isRef || source.isRef) {
					return target === source.target
						? null
						: false
				}
			}

			const result = canMerge(target, source.target)
			if (result == null) {
				return null
			}
			if (typeof result !== 'boolean') {
				throw new Error(`Unknown canMerge() result (${(result as any).constructor.name}) for ${this.type.name}`)
			}
			return result
		}
		return this.target.constructor === source.constructor
	}

	private _clone: TTarget
	public get clone(): TTarget {
		let { _clone } = this
		if (_clone == null) {
			const { target } = this
			if (this.mustBeCloned) {
				_clone = this.cloneInstance

				const canMergeResult: boolean = this.canMerge(this, _clone)

				switch (canMergeResult) {
					case null:
						break
					case true:
						const {mergerVisitor, options} = this.mergerState

						this.setRef(_clone)
						// mergerVisitor.setStatus(_clone, ObjectStatus.Cloned)

						const { preferClone, refs } = this

						this.merge(
							mergerVisitor.getNextMerge(preferClone, preferClone, refs, refs, refs, options),
							_clone,
							target,
							target,
							() => {
								throw new Error(`Class (${this.type.name}) cannot be merged with clone`)
							},
							preferClone,
							preferClone,
							options,
						)
						break
					case false:
						if (this.merger.merge) {
							throw new Error(`Class (${this.type.name}) cannot be merged with clone`)
						}
						break
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
	public refsBase: any[]
	public refsOlder: any[]
	public refsNewer: any[]
	public options: IMergeVisitorOptions<TTarget, TSource>

	// noinspection DuplicatedCode
	constructor(
		mergerVisitor: MergerVisitor,
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set: (value: TTarget) => void,
		preferCloneBase: boolean,
		preferCloneOlder: boolean,
		preferCloneNewer: boolean,
		refsBase: any[],
		refsOlder: any[],
		refsNewer: any[],
		options: IMergeVisitorOptions<TTarget, TSource>,
	) {
		this.mergerVisitor = mergerVisitor
		this.base = base
		this.older = older
		this.newer = newer
		this.set = set
		this.preferCloneBase = preferCloneBase
		this.preferCloneOlder = preferCloneOlder
		this.preferCloneNewer = preferCloneNewer
		this.refsBase = refsBase
		this.refsOlder = refsOlder
		this.refsNewer = refsNewer
		this.options = options
	}

	private _baseState: ValueState<TTarget, TSource>
	public get baseState(): ValueState<TTarget, TSource> {
		let { _baseState } = this
		if (_baseState == null) {
			const {options} = this
			this._baseState = _baseState = new ValueState<TTarget, TSource>(
				this,
				this.base,
				this.preferCloneBase,
				options && options.selfAsValueBase,
				this.refsBase,
			)
		}
		return _baseState
	}

	public set baseState(value: ValueState<TTarget, TSource>) {
		this._baseState = value
	}

	private _olderState: ValueState<TTarget, TSource>
	public get olderState(): ValueState<TTarget, TSource> {
		let { _olderState } = this
		if (_olderState == null) {
			const {options} = this
			this._olderState = _olderState = new ValueState<TTarget, TSource>(
				this,
				this.older as any,
				this.preferCloneOlder,
				options && options.selfAsValueOlder,
				this.refsOlder,
			)
		}
		return _olderState
	}

	public set olderState(value: ValueState<TTarget, TSource>) {
		this._olderState = value
	}

	private _newerState: ValueState<TTarget, TSource>
	public get newerState(): ValueState<TTarget, TSource> {
		let { _newerState } = this
		if (_newerState == null) {
			const {options} = this
			this._newerState = _newerState = new ValueState<TTarget, TSource>(
				this,
				this.newer as any,
				this.preferCloneNewer,
				options && options.selfAsValueNewer,
				this.refsNewer,
			)
		}
		return _newerState
	}

	public set newerState(value: ValueState<TTarget, TSource>) {
		this._newerState = value
	}

	public fillOlderNewer(): void {
		const { olderState, newerState } = this

		// this.mergerVisitor.setStatus(olderState.clone, ObjectStatus.Merged)
		// const idNewer = getObjectUniqueId(newerState.target as any)
		// if (idNewer != null) {
		// 	refsNewer[idNewer] = olderState.clone
		// }

		const older = olderState.clone
		newerState.setRef(older)

		const { options, set, preferCloneNewer, refsOlder, refsNewer } = this

		let isSet
		const result = olderState.merge(
			this.mergerVisitor.getNextMerge(
				preferCloneNewer, preferCloneNewer, refsOlder, refsNewer, refsNewer, options,
			),
			older,
			newerState.target,
			newerState.target,
			set
				? o => {
					// if (idNewer != null) {
					// 	refsNewer[idNewer] = o
					// }
					set(o)
					isSet = true
				}
				: () => {
					throw new Error(`Class ${olderState.type.name} does not need cloning.` +
						'You should use "preferClone: false" in merger options for this class')
				},
			preferCloneNewer,
			preferCloneNewer,
			options,
		)

		if (isSet) {
			return
		}

		if (result || newerState.mustBeCloned) {
			set(older)
			return
		}

		set(newerState.target)
	}

	public mergeWithBase(olderState: ValueState<TTarget, TSource>, newerState: ValueState<TTarget, TSource>): boolean {
		const { baseState } = this

		const base = baseState.clone
		// baseState.setRef(base)
		olderState.setRef(base)
		newerState.setRef(base)

		const { options, set } = this
		const { refs: refsBase } = baseState
		const { preferClone: preferCloneOlder, refs: refsOlder } = olderState
		const { preferClone: preferCloneNewer, refs: refsNewer } = newerState

		let isSet
		const result = baseState.merge(
			this.mergerVisitor.getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options),

			base,
			olderState.target,
			newerState.target,

			// for String() etc., that cannot be changed
			set
				? o => {
					baseState.setRef(o)
					olderState.setRef(o)
					newerState.setRef(o)

					set(o)
					isSet = true
				}
				: () => {
					if (baseState.mustBeCloned) {
						throw new Error(`Class ${baseState.type.name} does not need cloning.` +
							'You should use "preferClone: false" in merger options for this class')
					} else {
						isSet = true
					}
				},
			preferCloneOlder,
			preferCloneNewer,
			options,
		)

		if (isSet) {
			return !!set
		}

		if (!result) {
			return false
		}

		if (baseState.mustBeCloned) {
			set(base)
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

enum ObjectStatus {
	Cloned = 1,
	Merged = 2,
}

export class MergerVisitor implements IMergerVisitor {
	public readonly typeMeta: ITypeMetaMergerCollection
	// public refs: IRef[]
	public statuses: ObjectStatus[]

	constructor(typeMeta: ITypeMetaMergerCollection) {
		this.typeMeta = typeMeta
	}

	public getStatus(object: any): ObjectStatus {
		const {statuses} = this
		if (!statuses) {
			return null
		}

		const id = getObjectUniqueId(object)
		if (id == null) {
			throw new Error(`object is primitive: ${object}`)
		}
		return statuses[id]
	}

	public setStatus(object: any, status: ObjectStatus): any {
		let {statuses} = this
		if (!statuses) {
			this.statuses = statuses = []
		}

		const id = getObjectUniqueId(object)
		if (id == null) {
			throw new Error(`object is primitive: ${object}`)
		}
		statuses[id] = status
		return object
	}

	// noinspection JSUnusedLocalSymbols
	public getNextMerge(
		preferCloneOlder: boolean,
		preferCloneNewer: boolean,
		refsBase: any[],
		refsOlder: any[],
		refsNewer: any[],
		options: IMergeVisitorOptions<any, any>,
	): IMergeValue {
		return <TNextTarget, TNextSource>(
			next_base: TNextTarget,
			next_older: TNextSource,
			next_newer: TNextSource,
			next_set?: (value: TNextTarget) => void,
			next_preferCloneOlder?: boolean,
			next_preferCloneNewer?: boolean,
			next_options?: IMergeVisitorOptions<TNextTarget, TNextSource>,
		) => this.merge(
			next_base,
			next_older,
			next_newer,
			next_set,
			next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder,
			next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer,
			next_options,
			// next_options == null || next_options === options
			// 	? options
			// 	: (options == null ? next_options : {
			// 		...options,
			// 		...next_options,
			// 	}),
			refsBase,
			refsOlder,
			refsNewer,
		)
	}

	public merge<TTarget = any, TSource = any>(
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set?: (value: TTarget) => void,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeVisitorOptions<TTarget, TSource>,
		refsBase?: any[],
		refsOlder?: any[],
		refsNewer?: any[],
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
			preferCloneBase,
			preferCloneOlder,
			preferCloneNewer,
			refsBase,
			refsOlder,
			refsNewer,
			options,
		)

		// region refs

		if (!isPrimitive(base) && mergeState.baseState.isRef) {
			mergeState.newerState.resolveRef()
			if (mergeState.baseState.target === mergeState.newerState.target) {
				if (!isPrimitive(older)) {
					mergeState.olderState.resolveRef()
					if (mergeState.baseState.target === mergeState.olderState.target) {
						return false
					}
				}

				mergeState.baseState = mergeState.newerState
				mergeState.newerState = mergeState.olderState
				newer = mergeState.newerState.target
			}

			if (!isPrimitive(older)) {
				mergeState.olderState.resolveRef()
				if (mergeState.baseState.target === mergeState.olderState.target) {
					mergeState.olderState.preferClone
						= mergePreferClone(
						mergeState.baseState.preferClone,
						mergeState.olderState.preferClone,
					)
					mergeState.baseState = mergeState.olderState
				}
				older = mergeState.olderState.target
			}

			base = mergeState.baseState.target
		}

		if (!isPrimitive(older)) {
			mergeState.olderState.resolveRef()
			mergeState.newerState.resolveRef()

			if ((mergeState.olderState.isRef || mergeState.newerState.isRef)
				&& mergeState.olderState.target === mergeState.newerState.target
			) {
				mergeState.newerState.preferClone
					= mergePreferClone(
					mergeState.olderState.preferClone,
					mergeState.newerState.preferClone,
				)
				mergeState.olderState = mergeState.newerState
			}

			older = mergeState.olderState.target
			newer = mergeState.newerState.target
		}

		// endregion

		const fillOlderNewer = () => {
			switch (mergeState.olderState.canMerge(mergeState.newerState)) {
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
			switch (mergeState.baseState.canMerge(mergeState.newerState)) {
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
					if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
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

		switch (mergeState.baseState.canMerge(mergeState.newerState)) {
			case false:
				if (set) {
					fillOlderNewer()
					return true
				}
				return false
			case null:
				switch (mergeState.baseState.canMerge(mergeState.olderState)) {
					case null:
						return false
					case false:
						if (set) {
							set(mergeState.olderState.clone)
							return true
						}
						return false
					case true:
						return mergeState.mergeWithBase(mergeState.olderState, mergeState.olderState)
				}
				throw new Error('Unreachable code')
		}

		switch (mergeState.baseState.canMerge(mergeState.olderState)) {
			case null:
				return mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)
				// if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
				// 	if (set) {
				// 		throw new Error('base != newer; base == older; base == newer')
				// 	}
				// 	return false
				// }
				// return true
			case false:
				if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
					if (set) {
						set(mergeState.olderState.clone)
						return true
					}
					return false
				}
				return true
			case true:
				return mergeState.mergeWithBase(mergeState.olderState, mergeState.newerState)
		}

		throw new Error('Unreachable code')
	}
}

// endregion

// region TypeMetaMergerCollection

export type TMergeableClass<TObject extends IMergeable<TObject, TSource>, TSource = any>
	= new (...args: any[]) => TObject

export class TypeMetaMergerCollection
	extends TypeMetaCollection<ITypeMetaMerger<any, any>>
	implements ITypeMetaMergerCollection {
	
	constructor(proto?: ITypeMetaMergerCollection) {
		super(proto || TypeMetaMergerCollection.default)
	}

	public static default: TypeMetaMergerCollection = new TypeMetaMergerCollection()

	private static makeTypeMetaMerger<TTarget extends IMergeable<TTarget, TSource>, TSource = any>(
		type: TMergeableClass<TTarget, TSource>,
		meta?: ITypeMetaMerger<TTarget, TSource>,
	): ITypeMetaMerger<TTarget, TSource> {
		return {
			valueFactory: () => new (type as new () => TTarget)(),
			...meta,
			merger: {
				canMerge(target: TTarget, source: TTarget|TSource): boolean {
					return target._canMerge
						? target._canMerge(source)
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
					options?: IMergeOptions,
				): boolean {
					return base._merge(
						merge,
						older,
						newer,
					 	preferCloneOlder,
						preferCloneNewer,
						options,
					)
				},
				...(meta ? meta.merger : {}),
			},
		}
	}

	public putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource = any>(
		type: TMergeableClass<TTarget, TSource>,
		meta?: ITypeMetaMerger<TTarget, TSource>,
	): ITypeMetaMerger<TTarget, TSource> {
		return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, meta))
	}
}

export function registerMergeable<TTarget extends IMergeable<TTarget, TSource>, TSource = any>(
	type: TMergeableClass<TTarget, TSource>,
	meta?: ITypeMetaMerger<TTarget, TSource>,
) {
	TypeMetaMergerCollection.default.putMergeableType(type, meta)
}

export function registerMerger<TTarget = any, TSource = any>(
	type: TClass<TTarget>,
	meta: ITypeMetaMerger<TTarget, TSource>,
) {
	TypeMetaMergerCollection.default.putType(type, meta)
}

export function registerMergerPrimitive<TTarget = any, TSource = any>(
	type: TClass<TTarget>,
	meta?: ITypeMetaMerger<TTarget, TSource>,
) {
	registerMerger(type, {
		preferClone: false,
		...meta,
		merger: {
			merge(
				merge: IMergeValue,
				base: TTarget,
				older: TTarget|TSource,
				newer: TTarget|TSource,
				set?: (value: any) => void,
				// preferCloneOlder?: boolean,
				// preferCloneNewer?: boolean,
				// options?: IMergeOptions,
			): boolean {
				set((newer as any).valueOf())
				return true
			},
			...(meta ? meta.merger : {}),
		},
	})
}

// endregion

// region ObjectMerger

export class ObjectMerger implements IObjectMerger {
	public typeMeta: ITypeMetaMergerCollection

	constructor(typeMeta?: ITypeMetaMergerCollection) {
		this.typeMeta = new TypeMetaMergerCollection(typeMeta)
		this.merge = this.merge.bind(this)
	}

	public static default: ObjectMerger = new ObjectMerger()

	public merge<TTarget = any, TSource = any>(
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set?: (value: TTarget) => void,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeVisitorOptions<TTarget, TSource>,
	): boolean {
		const merger = new MergerVisitor(this.typeMeta)
		const mergedValue = merger.merge(
			base,
			older,
			newer,
			set,
			preferCloneOlder,
			preferCloneNewer,
			options,
		)
		return mergedValue
	}
}

// endregion

// region Primitive Mergers

// Handled in MergerVisitor:

function isPrimitive(value) {
	return !canHaveUniqueId(value) || typeof value === 'function'
		// value == null
		// || typeof value === 'number'
		// || typeof value === 'boolean'
}

registerMerger<string, string>(String as any, {
	merger: {
		canMerge(target: string, source: string): boolean {
			target = target.valueOf()
			source = source.valueOf()

			if (typeof source !== 'string') {
				return false
			}

			if (target === source) {
				return null
			}

			return true
		},
		merge(
			merge: IMergeValue,
			base: string,
			older: string,
			newer: string,
			set?: (value: string) => void,
			// preferCloneOlder?: boolean,
			// preferCloneNewer?: boolean,
			// options?: IMergeOptions,
		): boolean {
			// base = base.valueOf()
			// older = older.valueOf()
			// newer = newer.valueOf()
			// if (base === newer) {
			// 	if (base === older) {
			// 		return false
			// 	}
			// 	set(older)
			// 	return true
			// }
			set(newer.valueOf())
			return true
		},
	},
	preferClone: false,
})

registerMergerPrimitive(Number)
registerMergerPrimitive(Boolean)
registerMergerPrimitive(Array)
registerMergerPrimitive(Error)

// endregion

// region Array

// @ts-ignore
// registerMerger<any[], any[]>(Array, {
// 	merger: {
// 		canMerge(target: any[], source: any[]): boolean {
// 			return Array.isArray(source)
// 		},
// 		merge(
// 			merge: IMergeValue,
// 			base: any[],
// 			older: any[],
// 			newer: any[],
// 			set?: (value: any[]) => void,
// 			preferCloneOlder?: boolean,
// 			preferCloneNewer?: boolean,
// 			options?: IMergeOptions,
// 		): boolean {
// 			let changed = false
// 			const lenBase = base.length
// 			const lenOlder = older.length
// 			const lenNewer = newer.length
// 			for (let i = 0; i < lenNewer; i++) {
// 				if (i < lenBase) {
// 					if (i < lenOlder) {
// 						changed = merge(base[i], older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 							|| changed
// 					} else {
// 						changed = merge(base[i], newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 							|| changed
// 					}
// 				} else if (i < lenOlder) {
// 					changed = merge(EMPTY, older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 						|| changed
// 				} else {
// 					changed = merge(EMPTY, newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 						|| changed
// 				}
// 			}
// 		},
// 	},
// 	preferClone: o => Array.isFrozen(o) ? true : null,
// })

// endregion

// region Object

registerMerger<object, object>(Object, {
	merger: {
		canMerge(target: object, source: object): boolean {
			return source.constructor === Object
		},
		merge(
			merge: IMergeValue,
			base: object,
			older: object,
			newer: object,
			set?: (value: object) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			return mergeMaps(
				createMergeMapWrapper,
				merge,
				base,
				older,
				newer,
				preferCloneOlder,
				preferCloneNewer,
				options,
			)
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

// region Set

registerMerger<Set<any>, Set<any>>(Set, {
	merger: {
		canMerge<T = any>(target: Set<T>, source: Set<T>): boolean {
			return source.constructor === Object
				|| source[Symbol.toStringTag] === 'Set'
				|| Array.isArray(source)
				|| isIterable(source)
		},
		merge<T>(
			merge: IMergeValue,
			base: Set<T>,
			older: Set<T> | T[] | Iterable<T>,
			newer: Set<T> | T[] | Iterable<T>,
			set?: (value: Set<T>) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			return mergeMaps(
				(target, source) => createMergeSetWrapper(
					target,
					source,
					arrayOrIterable => fillSet(new Set(), arrayOrIterable)),
				merge,
				base,
				older,
				newer,
				preferCloneOlder,
				preferCloneNewer,
				options,
			)
		},
	},
	// valueFactory: (source: Set<any>) => new Set(source),
})

// endregion

// region Map

registerMerger<Map<any, any>, Map<any, any>>(Map, {
	merger: {
		// tslint:disable-next-line:no-identical-functions
		canMerge<K = any, V = any>(target: Map<K, V>, source: Map<K, V>): boolean {
			return source.constructor === Object
				|| source[Symbol.toStringTag] === 'Map'
				|| Array.isArray(source)
				|| isIterable(source)
		},
		merge<K, V>(
			merge: IMergeValue,
			base: Map<K, V>,
			older: Map<K, V> | Array<[K, V]> | Iterable<[K, V]>,
			newer: Map<K, V> | Array<[K, V]> | Iterable<[K, V]>,
			set?: (value: Map<K, V>) => void,
			preferCloneOlder?: boolean,
			preferCloneNewer?: boolean,
			options?: IMergeOptions,
		): boolean {
			return mergeMaps(
				(target, source) => createMergeMapWrapper(
					target,
					source,
					arrayOrIterable => fillMap(new Map(), arrayOrIterable)),
				merge,
				base,
				older,
				newer,
				preferCloneOlder,
				preferCloneNewer,
				options,
			)
		},
	},
	// valueFactory: (source: Map<any, any>) => new Map(source),
})

// endregion

import {
	AsyncPropertyValueOf,
	IPathNode,
	TGetPropertyPathGet,
	TGetPropertyPathGetSet,
	TGetPropertyPathSet,
	TGetPropertyValue,
	TGetPropertyValueResult3,
	TGetValue1,
	TGetValue2, TPathNodes,
	TSetValue1,
	TSetValue2,
} from './constracts'
import {resolvePath} from './resolve'

type TPathOrArrayOrNode<TValue, TNextValue>
	= Path<TValue, TNextValue>|Array<IPathNode<TValue, TNextValue>>|IPathNode<TValue, TNextValue>

export function pathsConcat<V1, V2, V3>(
	...paths: [
		TPathOrArrayOrNode<V1, V2>,
		TPathOrArrayOrNode<V2, V3>,
	]
): Path<V1, V3>
export function pathsConcat<V1, V2, V3, V4>(
	...paths: [
		TPathOrArrayOrNode<V1, V2>,
		TPathOrArrayOrNode<V2, V3>,
		TPathOrArrayOrNode<V3, V4>,
	]
): Path<V1, V4>
export function pathsConcat<V1, V2, V3, V4, V5>(
	...paths: [
		TPathOrArrayOrNode<V1, V2>,
		TPathOrArrayOrNode<V2, V3>,
		TPathOrArrayOrNode<V3, V4>,
		TPathOrArrayOrNode<V4, V5>,
	]
): Path<V1, V5>
export function pathsConcat(
	...paths: Array<TPathOrArrayOrNode<any, any>>
): Path<any, any>
export function pathsConcat(
	...paths: Array<TPathOrArrayOrNode<any, any>>
): Path<any, any> {
	let isNewArray = false
	let result
	for (let i = 0, len = paths.length; i < len; i++) {
		let path = paths[i]
		if (path instanceof Path) {
			path = path.nodes
		}
		if (path != null) {
			if (Array.isArray(path)) {
				if (result == null) {
					result = path
				} else if (!isNewArray) {
					result = [...result, ...path]
					isNewArray = true
				} else {
					result.push(...path)
				}
			} else {
				if (result == null) {
					result = [isNewArray]
					isNewArray = true
				} else if (!isNewArray) {
					result = [...result, path]
					isNewArray = true
				} else {
					result.push(path)
				}
			}
		}
	}

	return result == null ? null : new Path(result).init()
}

function pathCanGetSet(pathNodes: Array<IPathNode<any, any>>): boolean {
	if (pathNodes == null) {
		return false
	}

	const len = pathNodes.length
	if (len === 0) {
		return false
	}

	for (let i = 0; i < len - 1; i++) {
		const node = pathNodes[i]
		if (node.getValue == null) {
			return false
		}
	}

	return true
}

function pathCanGet(pathNodes: Array<IPathNode<any, any>>): boolean {
	return pathCanGetSet(pathNodes) && pathNodes[pathNodes.length - 1].getValue != null
}

function pathCanSet(pathNodes: Array<IPathNode<any, any>>): boolean {
	return pathCanGetSet(pathNodes) && pathNodes[pathNodes.length - 1].setValue != null
}

function pathGetOrSetValue<TObject, TValue>(
	path: TPathNodes<TObject, TValue>,
	object: TObject,
): TGetPropertyValue<TValue|void> {
	let nextValue: TGetPropertyValue<any> = resolvePath(object)
	for (let i = 0, len = path.length - 1; i < len; i++) {
		const node = path[i]
		nextValue = nextValue(node.getValue, node.isValueProperty as any)
	}

	return nextValue
}

function pathGetValue<TObject, TValue>(
	path: TPathNodes<TObject, TValue>,
	object: TObject,
): TGetPropertyValue<TValue> {
	const nextValue = pathGetOrSetValue(path, object)
	if (path.length === 0) {
		return nextValue as any
	}

	const lastNode = path[path.length - 1]

	const getResult: any = nextValue(
		lastNode.getValue as any,
		lastNode.isValueProperty as any,
	)

	return getResult
}

function pathSetValue<TObject, TValue>(
	path: TPathNodes<TObject, TValue>,
	object: TObject,
	newValue: TValue,
): TGetPropertyValue<void> {
	const nextValue = pathGetOrSetValue(path, object)

	const lastNode = path[path.length - 1]

	const getResult: any = nextValue(
		lastNode.setValue as any,
		lastNode.isValueProperty as any,
		newValue,
	)

	return getResult
}

// function concatPropertyPaths(
// 	...paths: Array<IPathNode<any, any>|Array<IPathNode<any, any>>|PropertyPath<any, any>>
// ) {
// 	let get = []
// 	let set = []
//
// 	function appendNode(
// 		nodeGet: IPathNode<any, any>,
// 		nodeSet?: IPathNode<any, any>,
// 	): boolean {
// 		if (nodeGet.getValue == null) {
// 			get = null
// 			if (nodeSet) {
// 				set = null
// 			}
// 		}
// 		if (nodeGet.getValue == null) {
// 			get = null
// 			if (!last) {
// 				set = null
// 			}
// 		}
//
// 		return get == null && set == null
// 	}
//
// 	function appendNodes(
// 		array: Array<IPathNode<any, any>>,
// 		nodes: Array<IPathNode<any, any>>|IPathNode<any, any>,
// 	): boolean {
// 		if (Array.isArray(nodes)) {
// 			for (let i = 0, len = nodes.length; i < len; i++) {
// 				const node = nodes[i]
// 				if (node.getValue == null) {
// 					return false
// 				}
// 				array.push(node)
// 			}
// 		}
// 		return true
// 	}
//
// 	for (let i = 0, len = paths.length; i < len; i++) {
// 		const path = paths[i]
// 		if (i === len - 1) {
//
// 		} else {
// 			if (Array.isArray(path)) {
//
// 			} else if (path instanceof PropertyPath) {
//
// 			} else {
// 				if (path.getValue == null) {
// 					get = null
// 				}
// 			}
// 		}
//
// 		result.push(...paths[i])
// 	}
// 	return result
//
// }
//
// export class ConcatPropertyPaths<TObject, TValue, TNextValue>
// 	implements IPropertyPath<TObject, TNextValue>
// {
// 	private readonly _paths: Array<IPropertyPath<any, any>>
// 	public readonly canGet: boolean
// 	public readonly canSet: boolean
//
// 	constructor(...paths: Array<IPropertyPath<any, any>>) {
// 		this._paths = paths
//
// 		const len = paths.length
// 		if (len === 0) {
// 			throw new Error('paths.length === 0')
// 		}
//
// 		let canGet = true
// 		let canSet = true
//
// 		for (let i = 0; i < len; i++) {
// 			const path = paths[i]
// 			if (!path.canGet) {
// 				canGet = false
// 				if (i < len - 1) {
// 					canSet = false
// 				}
// 			}
// 			if (i >= len - 1 && !path.canSet) {
// 				canSet = false
// 			}
// 		}
//
// 		this.canGet = canGet
// 		this.canSet = canSet
// 	}
//
// 	public get(object: TObject): TGetPropertyValueResult3<TValue> {
// 		if (!this.canGet) {
// 			throw new Error('canGet === false')
// 		}
//
// 		const {_paths} = this
// 		for (let i = 0, len = _paths.length; i < len; i++) {
// 			const path = _paths[i]
//
// 			if (!path.canGet) {
// 				canGet = false
// 				if (i < len - 1) {
// 					canSet = false
// 				}
// 			}
// 			if (i >= len - 1 && !path.canSet) {
// 				canSet = false
// 			}
// 		}
// 		return getOrSet(this._get, object)()
// 	}
//
// 	public set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void> {
// 		return getOrSet(this._set, object, true, newValue)()
// 	}
//
// 	public concat<TNextValue>(
// 		nextPath: IPropertyPath<TValue, TNextValue>,
// 	): IPropertyPath<TObject, TNextValue> {
//
// 	}
// }

export class Path<TObject, TValue = TObject> {
	// public nodeFirst: IPathNode<TObject, any>
	// public nodeLast: IPathNode<any, TValue>
	public readonly nodes: TPathNodes<any, any>
	public readonly canGet: boolean
	public readonly canSet: boolean

	constructor(
		nodes?: TPathNodes<any, any>,
		canGet?: boolean,
		canSet?: boolean,
	) {
		this.nodes = nodes || []
		this.canGet = canGet
		this.canSet = canSet
	}

	public get(object: TObject): TGetPropertyValueResult3<TValue> {
		if (!this.canGet) {
			throw new Error('this.canGet == false')
		}
		return pathGetValue(this.nodes, object)()
	}

	public set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void> {
		if (!this.canSet) {
			throw new Error('this.canSet == false')
		}
		return pathSetValue(this.nodes, object, newValue)()
	}

	public init(): Path<TObject, AsyncPropertyValueOf<TValue>> {
		const canGetSet = pathCanGetSet(this.nodes);
		(this as any).canGet = canGetSet && (this.nodes)[this.nodes.length - 1].getValue != null;
		(this as any).canSet = canGetSet && (this.nodes)[this.nodes.length - 1].setValue != null
		return this as any
	}

	public fv<TNextValue>(
		getValue: TGetValue1<TValue, TNextValue>,
		setValue?: TSetValue1<TValue, TNextValue>,
	): Path<TObject, TNextValue> {
		return this.append(getValue, setValue, true)
	}

	public f<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		setValue?: TSetValue2<TValue, TNextValue>,
	): Path<TObject, TNextValue> {
		return this.append(getValue, setValue, false)
	}

	// public append(): Path<TObject, AsyncPropertyValueOf<TValue>>
	// public append<TNextValue>(
	// 	getValue: TGetValue1<TValue, TNextValue>,
	// 	isValueProperty: true,
	// ): Path<TObject, TNextValue>
	// public append<TNextValue>(
	// 	getValue: TGetValue2<TValue, TNextValue>,
	// 	isValueProperty?: false,
	// ): Path<TObject, TNextValue>
	public append<TNextValue>(
		getValue: TGetValue1<TValue, TNextValue>,
		setValue: TSetValue1<TValue, TNextValue>,
		isValueProperty: true,
	): Path<TObject, TNextValue>
	public append<TNextValue>(
		getValue: TGetValue2<TValue, TNextValue>,
		setValue?: TSetValue2<TValue, TNextValue>,
		isValueProperty?: false,
	): Path<TObject, TNextValue>
	public append<TNextValue>(
		getValue?: any,
		setValue?: any,
		isValueProperty?: any,
	): Path<TObject, TNextValue>
	{
		// let setValue
		// let isValueProperty: boolean
		// if (typeof arg2 === 'function') {
		// 	setValue = arg2
		// 	isValueProperty = !!arg3
		// } else {
		// 	setValue = null
		// 	isValueProperty = !!arg2
		// }

		// if (getValue == null && setValue == null) {
		// 	this.init()
		// 	return null
		// }

		this.nodes.push({
			getValue,
			setValue,
			isValueProperty,
		})

		return this as any
	}

	public concat<TNextValue>(nextPath: TPathOrArrayOrNode<TValue, TNextValue>) {
		return pathsConcat<TObject, TValue, TNextValue>(this, nextPath)
	}

	public clone(): Path<TObject, TValue> {
		return new Path(this.nodes, this.canGet, this.canSet)
	}

	public static readonly concat = pathsConcat
	// public static readonly build = pathBuild
}

// export function pathBuild<
// 	TInput,
// 	TValue = TInput
// >(): TGetPropertyPathGetSet<TInput, TValue> {
// 	const path = new Path()
//
// 	const get: any = <TNextValue>(getPath, arg2?, arg3?) => {
// 		if (path.append(getPath, arg2, arg3) == null) {
// 			return path
// 		}
// 		return get
// 	}
//
// 	return get
// }

export class PathGetSet<TObject, TValue> {
	public readonly pathGet: Path<TObject, TValue>
	public readonly pathSet: Path<TObject, TValue>

	constructor(
		pathGet?: Path<TObject, TValue>,
		pathSet?: Path<TObject, TValue>,
	) {
		const canGet = pathGet != null && pathGet.canGet
		const canSet = pathSet != null
			? pathSet.canSet
			: (pathGet != null && pathGet.canSet)
		this.pathGet = canGet ? pathGet : null
		this.pathSet = canSet ? pathSet : null
	}

	public get canGet(): boolean {
		return this.pathGet != null
	}

	public get canSet(): boolean {
		return this.pathSet != null
	}

	public get(object: TObject): TGetPropertyValueResult3<TValue> {
		return this.pathGet.get(object)
	}

	public set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void> {
		return this.pathSet.set(object, newValue)
	}

	public static concat<V1, V2, V3>(
		path: TPathOrArrayOrNode<V1, V2>,
		pathGetSet: PathGetSet<V2, V3>,
	): PathGetSet<V1, V3> {
		return new PathGetSet(
			pathGetSet == null ? path as any : Path.concat(path, pathGetSet.pathGet),
			pathGetSet == null ? path as any : Path.concat(path, pathGetSet.pathSet),
		)
	}

	public static readonly build = pathGetSetBuild
}

export type TGetNextPathGet<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPathGet<TObject, TValue>) => TGetPropertyPathGet<TObject, TNextValue>
export type TGetNextPathSet<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPathGet<TObject, TValue>) => TGetPropertyPathSet<TObject, TNextValue>
export type TGetNextPathGetSet<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPathGetSet<TObject, TValue>) => TGetPropertyPathGetSet<TObject, TNextValue>

export type TNextPath<TObject, TValue, TNextValue>
	= (path: Path<TObject, TValue>) => Path<TObject, TNextValue>

export interface INextPathGet<TObject, TValue, TNextValue> {
	get?: TNextPath<TObject, TValue, TNextValue>
}

export interface INextPathSet<TObject, TValue, TNextValue> {
	set?: TNextPath<TObject, TValue, TNextValue>
}

export interface INextPathGetSet<TObject, TValue, TNextValue>
	extends INextPathGet<TObject, TValue, TNextValue>,
		INextPathSet<TObject, TValue, TNextValue>
{ }

export function pathGetSetBuild<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TNextPath<TObject, TObject, TCommonValue>,
	getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
): PathGetSet<TObject, TValue> {
	const pathCommon: any = common == null ? null : common(new Path()).init()

	let pathGet: any
	let pathSet: any
	if (getSet != null) {
		const {get, set} = getSet
		if (get != null) {
			pathGet = get(new Path()).init()
		}
		if (set != null) {
			pathSet = set(new Path()).init()
		}
	}

	return new PathGetSet(
		pathsConcat(pathCommon, pathGet),
		pathsConcat(pathCommon, pathSet),
	)
}

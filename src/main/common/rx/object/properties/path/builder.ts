import {ThenableOrIteratorOrValue} from '../../../../async/async'
import {
	IPropertyPath, TGetPropertyPathGet,
	TGetPropertyPathGetSet, TGetPropertyPathSet,
	TGetPropertyValue,
	TGetPropertyValueResult3,
	TGetValue,
	TPropertyPathArray,
} from './constracts'
import {resolvePath} from './resolve'

function getOrSet<TObject, TValue>(
	path: TPropertyPathArray<TObject, TValue>,
	object: TObject,
	set?: false,
): TGetPropertyValueResult3<TValue>
function getOrSet<TObject, TValue>(
	path: TPropertyPathArray<TObject, TValue>,
	object: TObject,
	set: true,
	newValue?: TValue,
): TGetPropertyValueResult3<void>
function getOrSet<TObject, TValue>(
	path: TPropertyPathArray<TObject, TValue>,
	object: TObject,
	set?: boolean,
	newValue?: TValue,
): TGetPropertyValueResult3<TValue|void> {
	let nextValue: TGetPropertyValue<any> = resolvePath(object)
	for (let i = 0, len = path.length - 1; i < len; i++) {
		const node = path[i]
		nextValue = nextValue(node.getValue, node.isValueProperty as any)
	}

	if (path.length === 0) {
		return nextValue()
	}

	const lastNode = path[path.length - 1]

	const getResult: any = set
		? nextValue(lastNode.setValue as any, lastNode.isValueProperty as any, newValue)
		: nextValue(lastNode.getValue as any, lastNode.isValueProperty as any)

	return getResult()
}

export class PropertyPath<TObject, TValue> implements IPropertyPath<TObject, TValue> {
	private readonly _path: TPropertyPathArray<TObject, TValue>
	constructor(
		path: TPropertyPathArray<TObject, TValue>,
	) {
		this._path = path
	}

	public get(object: TObject): TGetPropertyValueResult3<TValue> {
		return getOrSet(this._path, object)
	}

	public set(object: TObject, newValue: TValue): TGetPropertyValueResult3<void> {
		return getOrSet(this._path, object, true, newValue)
	}
}

export function buildPath<
	TInput,
	TValue = TInput extends ThenableOrIteratorOrValue<infer V> ? V : TInput
>(): TGetPropertyPathGetSet<TInput, TValue> {
	const path: TPropertyPathArray<any, any> = []

	const get: any = <TNextValue>(getValue: TGetValue<TValue, TNextValue>, arg2?, arg3?) => {
		let setValue: TGetValue<TValue, TNextValue>
		let isValueProperty: boolean
		if (typeof arg2 === 'function') {
			setValue = arg2
			isValueProperty = !!arg3
		} else {
			setValue = null
			isValueProperty = !!arg2
		}

		if (getValue == null && setValue == null) {
			return path
		}

		path.push({
			getValue,
			setValue,
			isValueProperty,
		})

		return get
	}

	return get
}

export type TGetNextPathGet<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPathGet<TObject, TValue>) => TGetPropertyPathGet<TObject, TNextValue>
export type TGetNextPathSet<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPathGet<TObject, TValue>) => TGetPropertyPathSet<TObject, TNextValue>
export type TGetNextPathGetSet<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPathGetSet<TObject, TValue>) => TGetPropertyPathGetSet<TObject, TNextValue>

export interface IPropertyPathGet<TObject, TCommonValue, TValue> {
	get?: TGetNextPathGet<TObject, TCommonValue, TValue>
}

export interface IPropertyPathSet<TObject, TCommonValue, TValue> {
	set?: TGetNextPathSet<TObject, TCommonValue, void|TValue>
}

export interface IPropertyPathGetSet<TObject, TCommonValue, TValue>
	extends IPropertyPathGet<TObject, TCommonValue, TValue>,
		IPropertyPathSet<TObject, TCommonValue, TValue>
{ }

export function buildPropertyPath<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TGetNextPathGetSet<TObject, TObject, TCommonValue>,
	getSet?: IPropertyPathGetSet<TObject, TCommonValue, TValue>,
): IPropertyPath<TObject, TValue> {
	if (getSet != null) {
		const {get, set} = getSet
		if (get != null || set != null) {
			let commonPathArray
			if (common != null) {
				commonPathArray = common(buildPath())()
			}

			let getPathArray
			if (get != null) {
				getPathArray = get(buildPath())()
				if (common != null) {
					getPathArray = [...commonPathArray, ...getPathArray]
				}
			}

			let setPathArray
			if (set != null) {
				setPathArray = set(buildPath())()
				if (common != null) {
					setPathArray = [...commonPathArray, ...setPathArray]
				}
			}

			return {
				get: get == null ? null : object => getOrSet(getPathArray, object),
				set: set == null ? null : (object, newValue) => getOrSet(setPathArray, object, true, newValue),
			}
		}
	}

	return new PropertyPath(common(buildPath())() as any)
}

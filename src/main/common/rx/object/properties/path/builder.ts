import {ThenableOrIteratorOrValue} from '../../../../async/async'
import {
	IPropertyPath,
	TGetPropertyPath,
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

	const getResult = set
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
>(): TGetPropertyPath<TInput, TValue> {
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

export type TGetNextPath<TObject, TValue, TNextValue>
	= (nextValue: TGetPropertyPath<TObject, TValue>) => TGetPropertyPath<TObject, TNextValue>

export interface IPropertyPathOptions<TObject, TValue, TCommonValue = TObject> {
	common?: TGetNextPath<TObject, TObject, TCommonValue>
	get?: TGetNextPath<TObject, TCommonValue, TValue>
	set?: TGetNextPath<TObject, TCommonValue, void>
}

export function buildPropertyPath<TObject, TValue>(
	getSet: TGetNextPath<TObject, TObject, TValue>,
): IPropertyPath<TObject, TValue>
export function buildPropertyPath<TObject, TValue, TCommonValue>(
	options: IPropertyPathOptions<TObject, TValue, TCommonValue>,
): IPropertyPath<TObject, TValue>
export function buildPropertyPath<TObject, TValue, TCommonValue>(
	arg: TGetNextPath<TObject, TObject, TValue>
		| IPropertyPathOptions<TObject, TValue, TCommonValue>,
): IPropertyPath<TObject, TValue> {
	if (typeof arg === 'function') {
		return new PropertyPath(arg(buildPath())())
	} else {
		const {common, get, set} = arg
		if (get == null && set == null) {
			return new PropertyPath(common(buildPath())() as any)
		}

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

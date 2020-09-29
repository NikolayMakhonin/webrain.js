import {depend} from '../../../rx/depend/core/depend'
import {INextPathGetSet, Path, PathGetSet, pathGetSetBuild, TNextPath} from '../../object/properties/path/builder'
import {IGetSetValue, TGetValue, TSetValue} from './contracts'

// region helpers

function resolvePathOrBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, TValue>,
): Path<TObject, TValue> {
	return typeof pathOrBuilder === 'function'
		? pathOrBuilder(new Path()).init() as any
		: pathOrBuilder
}

// endregion

// region createPathGetValue

// tslint:disable-next-line:no-shadowed-variable
const _createPathGetValue = depend(function _createPathGetValue<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
): TGetValue<TObject, TValue> {
	const path = resolvePathOrBuilder(pathOrBuilder)
	if (path == null) {
		throw new Error('path == null')
	}
	if (!path.canGet) {
		throw new Error('path.canGet is false')
	}
	return object => path.get(object)
})

type TCreatePathGetValue<TObject> = <TValue>(
	pathOrBuilder: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
) => TGetValue<TObject, TValue>

export function createPathGetValue<TObject>(): TCreatePathGetValue<TObject>
export function createPathGetValue<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
): TGetValue<TObject, TValue>
export function createPathGetValue<TObject, TValue>(
	pathOrBuilder?: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
): TGetValue<TObject, TValue> | TCreatePathGetValue<TObject> {
	return pathOrBuilder == null
		? _createPathGetValue
		: _createPathGetValue(pathOrBuilder)
}

// endregion

// region createPathSetValue

// tslint:disable-next-line:no-shadowed-variable
const _createPathSetValue = depend(function _createPathSetValue<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
): TSetValue<TObject, TValue> {
	const path = resolvePathOrBuilder(pathOrBuilder)
	if (path == null) {
		throw new Error('path == null')
	}
	if (!path.canSet) {
		throw new Error('path.canSet is false')
	}
	return (object, value) => path.set(object, value)
})

type TCreatePathSetValue<TObject> = <TValue>(
	pathOrBuilder: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
) => TSetValue<TObject, TValue>

export function createPathSetValue<TObject>(): TCreatePathSetValue<TObject>
export function createPathSetValue<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
): TSetValue<TObject, TValue>
export function createPathSetValue<TObject, TValue>(
	pathOrBuilder?: Path<TObject, TValue>
		| TNextPath<TObject, TObject, TValue>,
): TSetValue<TObject, TValue> | TCreatePathSetValue<TObject> {
	return pathOrBuilder == null
		? _createPathSetValue
		: _createPathSetValue(pathOrBuilder)
}

// endregion

// region createPathGetSetValue

// tslint:disable-next-line:no-shadowed-variable
const _createPathGetSetValue = depend(__createPathGetSetValue)

function __createPathGetSetValue<TObject, TValue>(
	pathGetSet: PathGetSet<TObject, TValue>,
): IGetSetValue<TObject, TValue>
function __createPathGetSetValue<TObject, TValue>(
	pathGet: Path<TObject, TValue>,
	pathSet: Path<TObject, TValue>,
): IGetSetValue<TObject, TValue>
function __createPathGetSetValue<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TNextPath<TObject, TObject, TCommonValue>,
	getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
): IGetSetValue<TObject, TValue>
function __createPathGetSetValue<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	pathOrBuilderCommon: Path<TObject, TValue>
		| PathGetSet<TObject, TValue>
		| TNextPath<TObject, TObject, TCommonValue>,
	pathOrBuilderGetSet?: Path<TObject, TValue>
		| INextPathGetSet<TObject, TCommonValue, TValue>,
): IGetSetValue<TObject, TValue> {
	let pathGetSet: PathGetSet<TObject, TValue>
	if (typeof pathOrBuilderCommon === 'function') {
		pathGetSet = pathGetSetBuild(pathOrBuilderCommon, pathOrBuilderGetSet as any)
	} else if (pathOrBuilderCommon instanceof PathGetSet) {
		if (pathOrBuilderGetSet != null) {
			throw new Error('The second argument should be null: ' + typeof pathOrBuilderGetSet)
		}
		pathGetSet = pathOrBuilderCommon
	}

	let pathGet: Path<TObject, TValue>
	let pathSet: Path<TObject, TValue>

	if (pathGetSet != null) {
		pathGet = pathGetSet.pathGet
		pathSet = pathGetSet.pathSet
	} else {
		pathGet = pathOrBuilderCommon as any
		pathSet = pathOrBuilderGetSet as any
	}

	const getValue = createPathGetValue(pathGet)
	const setValue = createPathSetValue(pathSet)

	return {
		getValue,
		setValue,
	}
}

interface TCreatePathGetSetValue<TObject> {
	<TValue>(
		pathGetSet: PathGetSet<TObject, TValue>,
	): IGetSetValue<TObject, TValue>

	<TValue>(
		pathGet: Path<TObject, TValue>, pathSet: Path<TObject, TValue>,
	): IGetSetValue<TObject, TValue>

	<TCommonValue = TObject, TValue = TCommonValue>(
		common: TNextPath<TObject, TObject, TCommonValue>,
		getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
	): IGetSetValue<TObject, TValue>
}

export function createPathGetSetValue<TObject>()
	: TCreatePathGetSetValue<TObject>
export function createPathGetSetValue<TObject, TValue>(
	pathGetSet: PathGetSet<TObject, TValue>,
): IGetSetValue<TObject, TValue>
export function createPathGetSetValue<TObject, TValue>(
	pathGet: Path<TObject, TValue>,
	pathSet: Path<TObject, TValue>,
): IGetSetValue<TObject, TValue>
export function createPathGetSetValue<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TNextPath<TObject, TObject, TCommonValue>,
	getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
): IGetSetValue<TObject, TValue>
export function createPathGetSetValue<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	pathOrBuilderCommon?: Path<TObject, TValue>
		| PathGetSet<TObject, TValue>
		| TNextPath<TObject, TObject, TCommonValue>,
	pathOrBuilderGetSet?: Path<TObject, TValue>
		| INextPathGetSet<TObject, TCommonValue, TValue>,
): IGetSetValue<TObject, TValue> | TCreatePathGetSetValue<TObject> {
	return pathOrBuilderCommon == null && pathOrBuilderGetSet == null
		? _createPathGetSetValue
		: _createPathGetSetValue(
			pathOrBuilderCommon as any,
			pathOrBuilderGetSet as any,
		) as any
}

// endregion

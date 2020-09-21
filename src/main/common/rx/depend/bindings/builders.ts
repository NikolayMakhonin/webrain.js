import {ThenableOrIteratorOrValue} from '../../../async/async'
import {INextPathGetSet, Path, PathGetSet, pathGetSetBuild, TNextPath} from '../../object/properties/path/builder'
import {IDestBuilder, ISourceBuilder, ISourceDestBuilder} from './contracts'
import {SourceDestBuilder} from './SourceDestBuilder'
import {DestPathBuilder, SourcePathBuilder} from './SourceDestPathBuilder'

// region sourcePathBuilder

function _sourcePathBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) {
	return new SourcePathBuilder(pathOrBuilder)
}

type TSourcePathBuilder<TObject> = <TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) => ISourceBuilder<TObject, TValue>

export function sourcePathBuilder<TObject>(): TSourcePathBuilder<TObject>
export function sourcePathBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
): ISourceBuilder<TObject, TValue>
export function sourcePathBuilder<TObject, TValue>(
	pathOrBuilder?: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
): ISourceBuilder<TObject, TValue> | TSourcePathBuilder<TObject> {
	return pathOrBuilder == null
		? _sourcePathBuilder
		: _sourcePathBuilder(pathOrBuilder)
}

// endregion

// region destPathBuilder

function _destPathBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) {
	return new DestPathBuilder(pathOrBuilder)
}

type TDestPathBuilder<TObject> = <TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) => IDestBuilder<TObject, TValue>

export function destPathBuilder<TObject>(): TDestPathBuilder<TObject>
export function destPathBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
): IDestBuilder<TObject, TValue>
export function destPathBuilder<TObject, TValue>(
	pathOrBuilder?: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
): IDestBuilder<TObject, TValue> | TDestPathBuilder<TObject> {
	return pathOrBuilder == null
		? _destPathBuilder
		: _destPathBuilder(pathOrBuilder)
}

// endregion

// region sourceDestBuilder

function _sourceDestBuilder<TObject, TValue>(
	sourceBuilder: ISourceBuilder<TObject, TValue>,
	destBuilder: IDestBuilder<TObject, TValue>,
) {
	return new SourceDestBuilder(sourceBuilder, destBuilder)
}

type TSourceDestBuilder<TObject> = <TValue>(
	sourceBuilder: ISourceBuilder<TObject, TValue>,
	destBuilder: IDestBuilder<TObject, TValue>,
) => ISourceDestBuilder<TObject, TValue>

export function sourceDestBuilder<TObject>(): TSourceDestBuilder<TObject>
export function sourceDestBuilder<TObject, TValue>(
	sourceBuilder: ISourceBuilder<TObject, TValue>,
	destBuilder: IDestBuilder<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
export function sourceDestBuilder<TObject, TValue>(
	sourceBuilder?: ISourceBuilder<TObject, TValue>,
	destBuilder?: IDestBuilder<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue> | TSourceDestBuilder<TObject> {
	return sourceBuilder == null && destBuilder == null
		? _sourceDestBuilder
		: _sourceDestBuilder(sourceBuilder, destBuilder)
}

// endregion

// region sourceDestPathBuilder

function _sourceDestPathBuilder<TObject, TValue>(
	pathGetSet: PathGetSet<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
function _sourceDestPathBuilder<TObject, TValue>(
	pathGet: Path<TObject, TValue>,
	pathSet: Path<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
function _sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TNextPath<TObject, TObject, TCommonValue>,
	getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
): ISourceDestBuilder<TObject, TValue>
function _sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	pathOrBuilderCommon: Path<TObject, TValue>
		| PathGetSet<TObject, TValue>
		| TNextPath<TObject, TObject, TCommonValue>,
	pathOrBuilderGetSet?: Path<TObject, TValue>
		| INextPathGetSet<TObject, TCommonValue, TValue>,
): ISourceDestBuilder<TObject, TValue> {
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

	const sourceBuilder = new SourcePathBuilder(pathGet)
	const destBuilder = new DestPathBuilder(pathSet)

	return _sourceDestBuilder(sourceBuilder, destBuilder)
}

interface TSourceDestPathBuilder<TObject> {
	<TValue>(
		pathGetSet: PathGetSet<TObject, TValue>,
	): ISourceDestBuilder<TObject, TValue>

	<TValue>(
		pathGet: Path<TObject, TValue>, pathSet: Path<TObject, TValue>,
	): ISourceDestBuilder<TObject, TValue>

	<TCommonValue = TObject, TValue = TCommonValue>(
		common: TNextPath<TObject, TObject, TCommonValue>,
		getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
	): ISourceDestBuilder<TObject, TValue>
}

export function sourceDestPathBuilder<TObject>()
	: TSourceDestPathBuilder<TObject>
export function sourceDestPathBuilder<TObject, TValue>(
	pathGetSet: PathGetSet<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
export function sourceDestPathBuilder<TObject, TValue>(
	pathGet: Path<TObject, TValue>,
	pathSet: Path<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
export function sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TNextPath<TObject, TObject, TCommonValue>,
	getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
): ISourceDestBuilder<TObject, TValue>
export function sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	pathOrBuilderCommon?: Path<TObject, TValue>
		| PathGetSet<TObject, TValue>
		| TNextPath<TObject, TObject, TCommonValue>,
	pathOrBuilderGetSet?: Path<TObject, TValue>
		| INextPathGetSet<TObject, TCommonValue, TValue>,
): ISourceDestBuilder<TObject, TValue> | TSourceDestPathBuilder<TObject> {
	return pathOrBuilderCommon == null && pathOrBuilderGetSet == null
		? _sourceDestPathBuilder
		: _sourceDestPathBuilder<TObject, TCommonValue, TValue>(
			pathOrBuilderCommon as any,
			pathOrBuilderGetSet as any,
		)
}

// endregion

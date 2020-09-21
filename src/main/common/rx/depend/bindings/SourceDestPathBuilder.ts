import {ThenableOrIteratorOrValue} from '../../../async/async'
import {getOrCreateCallState, subscribeCallState} from '../../../rx/depend/core/CallState'
import {CallStatusShort} from '../../../rx/depend/core/contracts'
import {depend} from '../../../rx/depend/core/depend'
import {INextPathGetSet, Path, PathGetSet, pathGetSetBuild, TNextPath} from '../../object/properties/path/builder'
import {Binder} from './Binder'
import {IBinder, IDestBuilder, ISource, ISourceBuilder, ISourceDestBuilder, TDest, TDestFunc} from './contracts'
import {sourceDestBuilder} from './SourceDestBuilder'

class SourcePath<TValue> implements ISource<TValue> {
	private readonly _getValue: () => TValue
	constructor(getValue: () => ThenableOrIteratorOrValue<TValue>) {
		this._getValue = depend(getValue as any) as any
	}

	public getOneWayBinder(dest: TDest<TValue>): IBinder {
		const getValue = this._getValue

		const destFunc = typeof dest === 'function'
			? dest
			: value => dest.set(value)

		const bind = () => {
			return subscribeCallState(getOrCreateCallState(getValue)(), state => {
				if (state.statusShort === CallStatusShort.CalculatedValue) {
					destFunc(state.value as any)
				}
			})
		}

		return new Binder(bind)
	}
}

SourcePath.prototype.getOneWayBinder = depend(SourcePath.prototype.getOneWayBinder)

// tslint:disable-next-line:no-shadowed-variable
export const sourcePath = depend(function sourcePath<TValue>(getValue: () => ThenableOrIteratorOrValue<TValue>) {
	return new SourcePath(getValue)
})

function resolvePathOrBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) {
	return typeof pathOrBuilder === 'function'
		? pathOrBuilder(new Path()).init() as any
		: pathOrBuilder
}

class SourcePathBuilder<TObject, TValue> implements ISourceBuilder<TObject, TValue> {
	private readonly _path: Path<TObject, TValue>
	constructor(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>) {
		this._path = resolvePathOrBuilder(pathOrBuilder)
		if (this._path == null) {
			throw new Error('path == null')
		}
		if (!this._path.canGet) {
			throw new Error('path.canGet is false')
		}
	}

	public get(object: TObject): ISource<TValue> {
		const path = this._path
		const getValue = () => path.get(object) as TValue
		return sourcePath(getValue)
	}
}

SourcePathBuilder.prototype.get = depend(SourcePathBuilder.prototype.get)

// region sourcePathBuilder

// tslint:disable-next-line:no-shadowed-variable
const _sourcePathBuilder = depend(function _sourcePathBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) {
	return new SourcePathBuilder(pathOrBuilder)
})

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

class DestPathBuilder<TObject, TValue> implements IDestBuilder<TObject, TValue> {
	private readonly _path: Path<TObject, TValue>
	constructor(pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>) {
		this._path = resolvePathOrBuilder(pathOrBuilder)
		if (this._path == null) {
			throw new Error('path == null')
		}
		if (!this._path.canSet) {
			throw new Error('path.canSet is false')
		}
	}

	public get(object: TObject): TDestFunc<TValue> {
		const path = this._path
		return value => path.set(object, value)
	}
}

DestPathBuilder.prototype.get = depend(DestPathBuilder.prototype.get)

// region destPathBuilder

// tslint:disable-next-line:no-shadowed-variable
const _destPathBuilder = depend(function _destPathBuilder<TObject, TValue>(
	pathOrBuilder: Path<TObject, TValue> | TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>,
) {
	return new DestPathBuilder(pathOrBuilder)
})

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

// region sourceDestPathBuilder

// tslint:disable-next-line:no-shadowed-variable
const _sourceDestPathBuilder = depend(__sourceDestPathBuilder)

function __sourceDestPathBuilder<TObject, TValue>(
	pathGetSet: PathGetSet<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
function __sourceDestPathBuilder<TObject, TValue>(
	pathGet: Path<TObject, TValue>,
	pathSet: Path<TObject, TValue>,
): ISourceDestBuilder<TObject, TValue>
function __sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(
	common: TNextPath<TObject, TObject, TCommonValue>,
	getSet?: INextPathGetSet<TObject, TCommonValue, TValue>,
): ISourceDestBuilder<TObject, TValue>
function __sourceDestPathBuilder<TObject, TCommonValue = TObject, TValue = TCommonValue>(
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

	const sourceBuilder = sourcePathBuilder(pathGet)
	const destBuilder = destPathBuilder(pathSet)

	return sourceDestBuilder(sourceBuilder, destBuilder)
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
		: _sourceDestPathBuilder(
			pathOrBuilderCommon as any,
			pathOrBuilderGetSet as any,
		) as any
}

// endregion

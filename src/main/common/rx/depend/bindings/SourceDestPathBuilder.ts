import {ThenableOrIteratorOrValue} from '../../../async/async'
import {getOrCreateCallState, subscribeCallState} from '../../../rx/depend/core/CallState'
import {CallStatusShort} from '../../../rx/depend/core/contracts'
import {depend} from '../../../rx/depend/core/depend'
import {Path, TNextPath} from '../../object/properties/path/builder'
import {Binder} from './Binder'
import {IBinder, IDestBuilder, ISource, ISourceBuilder, TDest, TDestFunc} from './contracts'

export class SourcePath<TValue> implements ISource<TValue> {
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

export class SourcePathBuilder<TObject, TValue> implements ISourceBuilder<TObject, TValue> {
	private readonly _path: Path<TObject, TValue>
	constructor(pathBuilder: TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>) {
		this._path = pathBuilder(new Path()).init() as any
	}

	public get(object: TObject): ISource<TValue> {
		const path = this._path
		const getValue = () => path.get(object) as TValue
		return new SourcePath(getValue)
	}
}

SourcePathBuilder.prototype.get = depend(SourcePathBuilder.prototype.get)

export class DestPathBuilder<TObject, TValue> implements IDestBuilder<TObject, TValue> {
	private readonly _path: Path<TObject, TValue>
	constructor(pathBuilder: TNextPath<TObject, TObject, ThenableOrIteratorOrValue<TValue>>) {
		this._path = pathBuilder(new Path()).init() as any
	}

	public get(object: TObject): TDestFunc<TValue> {
		const path = this._path
		return value => path.set(object, value)
	}
}

DestPathBuilder.prototype.get = depend(DestPathBuilder.prototype.get)

import {depend} from '../../../rx/depend/core/depend'
import {Binder} from './Binder'
import {
	IBinder,
	IDestBuilder,
	ISource,
	ISourceBuilder,
	ISourceDest,
	ISourceDestBuilder,
	TDest,
	TDestFunc,
} from './contracts'

export class SourceDest<TValue> implements ISourceDest<TValue> {
	private readonly _source: ISource<TValue>
	private readonly _dest: TDestFunc<TValue>

	constructor(
		source: ISource<TValue>,
		dest: TDest<TValue>,
	) {
		this._source = source
		this._dest = typeof dest === 'function'
			? dest
			: value => dest.set(value)
	}

	public getOneWayBinder(dest: TDest<TValue>): IBinder {
		return this._source.getOneWayBinder(dest)
	}

	public getTwoWayBinder(sourceDest: ISourceDest<TValue>): IBinder {
		const binder1 = this._source.getOneWayBinder(sourceDest)
		const binder2 = sourceDest.getOneWayBinder(this)
		const bind = () => {
			const unbind1 = binder1.bind()
			const unbind2 = binder2.bind()
			return () => {
				unbind1()
				unbind2()
			}
		}
		return new Binder(bind)
	}

	public set(value: TValue): void {
		this._dest(value)
	}
}

SourceDest.prototype.getOneWayBinder = depend(SourceDest.prototype.getOneWayBinder)
SourceDest.prototype.getTwoWayBinder = depend(SourceDest.prototype.getTwoWayBinder)

export class SourceDestBuilder<TObject, TValue> implements ISourceDestBuilder<TObject, TValue> {
	private readonly _sourceBuilder: ISourceBuilder<TObject, TValue>
	private readonly _destBuilder: IDestBuilder<TObject, TValue>

	constructor(
		sourceBuilder: ISourceBuilder<TObject, TValue>,
		destBuilder: IDestBuilder<TObject, TValue>,
	) {
		this._sourceBuilder = sourceBuilder
		this._destBuilder = destBuilder
	}

	public get(object: TObject): ISourceDest<TValue> {
		const source = this._sourceBuilder.get(object)
		const dest = this._destBuilder.get(object)
		return new SourceDest(source, dest)
	}
}

SourceDestBuilder.prototype.get = depend(SourceDestBuilder.prototype.get)

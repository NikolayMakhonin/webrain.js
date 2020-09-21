import {depend} from '../../../rx/depend/core/depend'
import {Binder} from './Binder'
import {
	IBinder, IDest,
	IDestBuilder,
	ISource,
	ISourceBuilder,
	ISourceDest,
	ISourceDestBuilder,
	TDest,
	TDestFunc,
} from './contracts'

class SourceDest<TValue> implements ISourceDest<TValue> {
	public readonly source: ISource<TValue>
	public readonly dest: IDest<TValue> | TDestFunc<TValue>

	constructor(
		source: ISource<TValue>,
		dest: TDest<TValue>,
	) {
		this.source = source
		this.dest = typeof dest === 'function'
			? dest
			: value => dest.set(value)
	}

	public getOneWayBinder(dest: TDest<TValue>): IBinder {
		return this.source.getOneWayBinder(dest)
	}

	// tslint:disable-next-line:no-shadowed-variable
	public getTwoWayBinder(sourceDest: ISourceDest<TValue>): IBinder {
		const binder1 = this.source.getOneWayBinder(sourceDest.dest)
		const binder2 = sourceDest.source.getOneWayBinder(this.dest)
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
}

SourceDest.prototype.getOneWayBinder = depend(SourceDest.prototype.getOneWayBinder)
SourceDest.prototype.getTwoWayBinder = depend(SourceDest.prototype.getTwoWayBinder)

// tslint:disable-next-line:no-shadowed-variable
export const sourceDest = depend(function sourceDest<TValue>(
	source: ISource<TValue>,
	dest: TDest<TValue>,
) {
	return new SourceDest(source, dest)
})

class SourceDestBuilder<TObject, TValue> implements ISourceDestBuilder<TObject, TValue> {
	private readonly _sourceBuilder: ISourceBuilder<TObject, TValue>
	private readonly _destBuilder: IDestBuilder<TObject, TValue>

	constructor(
		sourceBuilder: ISourceBuilder<TObject, TValue>,
		destBuilder: IDestBuilder<TObject, TValue>,
	) {
		this._sourceBuilder = sourceBuilder
		this._destBuilder = destBuilder
	}

	public getSource(object: TObject): ISource<TValue> {
		return this._sourceBuilder.getSource(object)
	}

	public getDest(object: TObject): IDest<TValue> | TDestFunc<TValue> {
		return this._destBuilder.getDest(object)
	}

	public getSourceDest(object: TObject): ISourceDest<TValue> {
		const source = this._sourceBuilder.getSource(object)
		const dest = this._destBuilder.getDest(object)
		return sourceDest(source, dest)
	}
}

// region sourceDestBuilder

// tslint:disable-next-line:no-shadowed-variable
const _sourceDestBuilder = depend(function _sourceDestBuilder<TObject, TValue>(
	sourceBuilder: ISourceBuilder<TObject, TValue>,
	destBuilder: IDestBuilder<TObject, TValue>,
) {
	return new SourceDestBuilder(sourceBuilder, destBuilder)
})

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

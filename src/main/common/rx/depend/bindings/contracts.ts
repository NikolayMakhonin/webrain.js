export type IUnbind = () => void

export interface IBinder {
	bind(): IUnbind
}

export interface ISource<TValue> {
	getOneWayBinder(dest: TDest<TValue>): IBinder
}

export type TDestFunc<TValue> = (value: TValue) => void
export type TDest<TValue> = IDest<TValue>|TDestFunc<TValue>
export interface IDest<TValue> {
	set(value: TValue): void
}

export interface ISourceDest<TValue> extends ISource<TValue>, IDest<TValue> {
	getTwoWayBinder(sourceDest: ISourceDest<TValue>): IBinder
}

export interface ISourceBuilder<TObject, TValue> {
	get(object: TObject): ISource<TValue>
}

export interface IDestBuilder<TObject, TValue> {
	get(object: TObject): IDest<TValue> | TDestFunc<TValue>
}

export interface ISourceDestBuilder<TObject, TValue>
	extends ISourceBuilder<TObject, TValue>,
		IDestBuilder<TObject, TValue>
{
	get(object: TObject): ISourceDest<TValue>
}

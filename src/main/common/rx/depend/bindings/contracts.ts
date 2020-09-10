export type IUnbind = () => void

export interface IBinder {
	bind(): IUnbind
}

export interface ISource<TValue> {
	getOneWayBinder(dest: IDest<TValue>|((value: TValue) => void)): IBinder
}

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
	get(object: TObject): IDest<TValue>
}

export interface ISourceDestBuilder<TObject, TValue> {
	get(object: TObject): ISourceDest<TValue>
}

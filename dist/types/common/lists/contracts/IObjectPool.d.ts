export interface IObjectPool<TObject> {
    size: number;
    maxSize: number;
    get(): TObject;
    release(obj: TObject): void;
}

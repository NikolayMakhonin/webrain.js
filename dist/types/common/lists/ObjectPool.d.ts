import { IObjectPool } from './contracts/IObjectPool';
export declare class ObjectPool<TObject> implements IObjectPool<TObject> {
    size: number;
    maxSize: any;
    private readonly _stack;
    constructor(maxSize: number);
    get(): TObject;
    release(obj: TObject): void;
}

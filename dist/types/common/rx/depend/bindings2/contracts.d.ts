import { ThenableOrIteratorOrValue } from '../../../async/async';
export declare type IUnBind = () => void;
export interface IBinder {
    bind(): IUnBind;
}
export declare type TGetValue<TObject, TValue> = (obj: TObject) => ThenableOrIteratorOrValue<TValue>;
export declare type TSetValue<TObject, TValue> = (obj: TObject, value: TValue) => ThenableOrIteratorOrValue<void>;
export interface IGetSetValue<TObject, TValue> {
    getValue: TGetValue<TObject, TValue>;
    setValue: TSetValue<TObject, TValue>;
}

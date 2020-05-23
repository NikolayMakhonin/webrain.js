import { ObjectBuilder } from './ObjectBuilder';
import { ISetOptions, ObservableClass } from './ObservableClass';
export interface IFieldOptions<TObject, TValue> {
    hidden?: boolean;
    getValue?: (this: TObject) => TValue;
    setValue?: (this: TObject, value: TValue) => void;
}
export interface IWritableFieldOptions<TObject, TValue> extends IFieldOptions<TObject, TValue> {
    setOptions?: ISetOptions<TObject, TValue>;
}
export interface IReadableFieldOptions<TObject, TValue> extends IWritableFieldOptions<TObject, TValue> {
    factory?: (this: TObject, initValue: TValue) => TValue;
    init?: (this: TObject, initValue: TValue) => void;
}
export interface IUpdatableFieldOptions<TObject, TValue> extends IReadableFieldOptions<TObject, TValue> {
    update?: (this: TObject, value: any) => TValue | void;
}
export declare class ObservableObjectBuilder<TObject extends ObservableClass> extends ObjectBuilder<TObject> {
    constructor(object?: TObject);
    writable<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : any>(name: Name, options?: IWritableFieldOptions<TObject, TValue>, initValue?: TValue): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    readable<Name extends string | number = Extract<keyof TObject, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : any>(name: Name, options?: IReadableFieldOptions<TObject, TValue>, initValue?: TValue): this & {
        object: {
            readonly [newProp in Name]: TValue;
        };
    };
    updatable<TValue, Name extends string | number>(name: Name, options?: IUpdatableFieldOptions<TObject, TValue>, initValue?: TValue): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
    delete<Name extends string | number = Extract<keyof TObject, string | number>>(name: Name): this & {
        object: {
            readonly [newProp in Name]: never;
        };
    };
}

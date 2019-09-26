import '../extensions/autoConnect';
import { ISetOptions, ObservableObject } from './ObservableObject';
export interface IFieldOptions {
    hidden?: boolean;
    getValue?: () => any;
    setValue?: (value: any) => void;
}
export interface IWritableFieldOptions extends IFieldOptions {
    setOptions?: ISetOptions;
}
export interface IReadableFieldOptions<T> extends IWritableFieldOptions {
    factory?: (initValue: T) => T;
}
export interface IUpdatableFieldOptions<T> extends IWritableFieldOptions {
    factory?: (initValue: T) => T;
    update?: (value: any) => T | void;
}
export declare class ObservableObjectBuilder<TObject extends ObservableObject> {
    object: TObject;
    constructor(object?: TObject);
    writable<T, Name extends string | number>(name: Name, options?: IWritableFieldOptions, initValue?: T): this & {
        object: {
            [newProp in Name]: T;
        };
    };
    readable<T, Name extends string | number>(name: Name, options?: IReadableFieldOptions<T>, initValue?: T): this & {
        object: {
            readonly [newProp in Name]: T;
        };
    };
    updatable<T, Name extends string | number>(name: Name, options?: IUpdatableFieldOptions<T>, initValue?: T): this & {
        object: {
            [newProp in Name]: T;
        };
    };
    delete<Name extends string | number>(name: Name): this & {
        object: {
            readonly [newProp in Name]: never;
        };
    };
}

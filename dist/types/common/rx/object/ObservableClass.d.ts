import '../extensions/autoConnect';
import { PropertyChangedObject } from './PropertyChangedObject';
export interface ISetOptions<TObject, TValue> {
    equalsFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => boolean;
    fillFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => boolean;
    convertFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => any;
    beforeChange?: (this: TObject, oldValue: TValue, newValue: TValue) => void;
    afterChange?: (this: TObject, oldValue: TValue, newValue: TValue) => void;
    suppressPropertyChanged?: boolean;
}
export declare class ObservableClass extends PropertyChangedObject {
    /** @internal */
    readonly __fields?: {
        [key: string]: any;
        [key: number]: any;
    };
    constructor();
}
/** @internal */
export declare function _setExt(name: string | number, getValue: () => any, setValue: (v: any) => void, options: ISetOptions<any, any>, object: ObservableClass, newValue: any): boolean;
/** @internal */
export declare function _set(name: string | number, getValue: () => any, setValue: (v: any) => void, object: ObservableClass, newValue: any): boolean;

import '../extensions/autoConnect';
import { PropertyChangedObject } from './PropertyChangedObject';
export interface ISetOptions {
    equalsFunc?: (oldValue: any, newValue: any) => boolean;
    fillFunc?: (oldValue: any, newValue: any) => boolean;
    convertFunc?: (newValue: any) => any;
    beforeChange?: (oldValue: any) => void;
    afterChange?: (newValue: any) => void;
    suppressPropertyChanged?: boolean;
}
export declare class ObservableObject extends PropertyChangedObject {
    /** @internal */
    readonly __fields?: {
        [key: string]: any;
        [key: number]: any;
    };
    constructor();
}
/** @internal */
export declare function _setExt(name: string | number, getValue: (o: any) => any, setValue: (o: any, v: any) => void, options: ISetOptions, object: ObservableObject, newValue: any): boolean;
/** @internal */
export declare function _set(name: string | number, getValue: (o: any) => any, setValue: (o: any, v: any) => void, object: ObservableObject, newValue: any): boolean;

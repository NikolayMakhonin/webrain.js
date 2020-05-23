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
    constructor();
}

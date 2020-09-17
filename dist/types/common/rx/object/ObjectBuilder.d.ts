import { FuncAny, KeysOf } from '../../helpers/typescript';
export declare class ObjectBuilder<TObject> {
    object: TObject;
    constructor(object?: TObject);
    func<Name extends string | number = Extract<KeysOf<TObject, FuncAny>, string | number>, TValue = Name extends keyof TObject ? TObject[Name] : FuncAny>(name: Name, func: TValue): this & {
        object: {
            [newProp in Name]: TValue;
        };
    };
}

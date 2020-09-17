import { FuncAny, KeysOf } from '../../helpers/typescript';
import { ObjectBuilder } from './ObjectBuilder';
export declare class ClassBuilder<TObject> extends ObjectBuilder<TObject> {
    func<Name extends KeysOf<TObject, FuncAny>, TValue extends TObject[Name] = TObject[Name]>(name: Name, func: TValue): this;
}

import { NotFunction } from '../../../helpers/typescript';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableClass } from '../ObservableClass';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcProperty } from './CalcProperty';
import { ValueKeys } from './contracts';
export declare class CalcObjectBuilder<TObject extends ObservableClass, TValueKeys extends string | number = ValueKeys> extends ObservableObjectBuilder<TObject> {
    calc<TInput, TMergeSource, Name extends keyof TObject>(name: Name, inputOrFactory: ((source: TObject, name?: string) => TInput) | NotFunction<TInput>, calcFactory: (initValue?: TObject[Name]) => CalcProperty<TObject[Name], TInput>, initValue?: TObject[Name]): this & {
        object: { readonly [newProp in Extract<Name, string | number>]: CalcProperty<TObject[Name], TInput>; };
    };
    calcChanges<TInput, Name extends keyof TObject>(name: Name, buildRule: (builder: RuleBuilder<TInput, ValueKeys>) => RuleBuilder<any, ValueKeys>): this & {
        object: { readonly [newProp in Extract<Name, string | number>]: CalcProperty<TObject[Name], TInput>; };
    };
}

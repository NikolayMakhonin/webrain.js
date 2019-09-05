import { NotFunction } from '../../../helpers/typescript';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { CalcProperty } from './CalcProperty';
import { ValueKeys } from './contracts';
export declare class CalcObjectBuilder<TObject extends ObservableObject, TValueKeys extends string | number = ValueKeys> extends ObservableObjectBuilder<TObject> {
    calc<TValue, TInput, TMergeSource, Name extends string | number>(name: Name, inputOrFactory: ((source: TObject) => TInput) | NotFunction<TInput>, calcFactory: (initValue?: TValue) => CalcProperty<TValue, TInput, TMergeSource>, initValue?: TValue): this & {
        object: { readonly [newProp in Name]: CalcProperty<TValue, TInput, TMergeSource>; };
    };
    calcChanges<Name extends string | number>(name: Name, buildRule: (builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<any, TValueKeys>): this & {
        object: { readonly [newProp in Name]: CalcProperty<number, any, unknown>; };
    };
}

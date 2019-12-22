import { NotFunction } from '../../../helpers/typescript';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableClass } from '../ObservableClass';
import { IReadableFieldOptions, IWritableFieldOptions } from '../ObservableObjectBuilder';
import { CalcProperty } from './CalcProperty';
import { ConnectorBuilder } from './ConnectorBuilder';
import { ValueKeys } from './contracts';
export declare class CalcObjectBuilder<TObject extends ObservableClass, TValueKeys extends string | number = ValueKeys> extends ConnectorBuilder<TObject, TObject> {
    writable<Name extends keyof TObject>(name: Name, options?: IWritableFieldOptions<TObject, TObject[Name]>, initValue?: TObject[Name]): this;
    readable<Name extends keyof TObject>(name: Name, options?: IReadableFieldOptions<TObject, TObject[Name]>, initValue?: TObject[Name]): this;
    calc<TInput, Name extends keyof TObject>(name: Name, inputOrFactory: ((source: TObject, name?: string) => TInput) | NotFunction<TInput>, calcFactory: (initValue?: TObject[Name]) => CalcProperty<TObject[Name], TInput>, initValue?: TObject[Name]): this;
    calcChanges<TInput, Name extends keyof TObject>(name: Name, buildRule: (builder: RuleBuilder<TInput, ValueKeys>) => RuleBuilder<any, ValueKeys>): this;
    calcConnect<Name extends keyof TObject>(name: Name, buildRule: (builder: RuleBuilder<TObject, ValueKeys>) => RuleBuilder<TObject[Name], ValueKeys>, options?: IWritableFieldOptions<TObject, TObject[Name]>, initValue?: TObject[Name]): this;
}

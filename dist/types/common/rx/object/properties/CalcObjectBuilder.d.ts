import { IteratorOrValue, ThenableOrIteratorOrValue } from '../../../async/async';
import { FuncAny, NotFunc, TClass } from '../../../helpers/typescript';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { CallState } from '../../depend/core/CallState';
import { IDeferredOptions } from '../../depend/core/contracts';
import { ObservableClass } from '../ObservableClass';
import { IReadableFieldOptions, IWritableFieldOptions } from '../ObservableObjectBuilder';
import { ConnectorBuilder } from './ConnectorBuilder';
import { ValueKeys } from './contracts';
import { Path } from './path/builder';
export declare class CalcObjectBuilder<TObject extends ObservableClass, TConnectorSource = TObject, TCalcSource = TObject, TValueKeys extends string | number = ValueKeys> extends ConnectorBuilder<TObject, TConnectorSource> {
    readonly calcSourcePath?: Path<TObject, TCalcSource>;
    constructor(object?: TObject, connectorSourcePath?: Path<TObject, TConnectorSource>, calcSourcePath?: Path<TObject, TCalcSource>);
    func<Name extends keyof TObject, TValue = TObject[Name] & FuncAny>(name: Name, func: TValue): this;
    writable<Name extends keyof TObject>(name: Name, options?: IWritableFieldOptions<TObject, TObject[Name]>, initValue?: TObject[Name]): this;
    readable<Name extends keyof TObject>(name: Name, options?: IReadableFieldOptions<TObject, TObject[Name]>, initValue?: TObject[Name]): this;
    calcSimple<Name extends keyof TObject>(name: Name, func: (this: TCalcSource) => ThenableOrIteratorOrValue<TObject[Name]>): this & {
        object: {
            readonly [newProp in Name]: TObject[Name];
        };
    };
    calc<Name extends keyof TObject>(name: Name, func: (this: TCalcSource) => ThenableOrIteratorOrValue<TObject[Name]>, deferredOptions?: IDeferredOptions): this & {
        object: {
            readonly [newProp in Name]: TObject[Name];
        };
    };
    calcX<Name extends keyof TObject>(name: Name, func: (this: CallState<TObject, any[], TObject[Name]>) => ThenableOrIteratorOrValue<TObject[Name]>, deferredOptions?: IDeferredOptions): this & {
        object: {
            readonly [newProp in Name]: TObject[Name];
        };
    };
    nested<Name extends keyof TObject, TPropertyClass extends PropertyClass<TObject>>(name: Name, build: (builder: CalcObjectBuilder<PropertyClass<TObject>, TObject>) => {
        object: TPropertyClass;
    }): this & {
        object: {
            readonly [newProp in Name]: TObject[Name];
        };
    };
    nestedCalc<TInput, Name extends keyof TObject>(name: Name, inputOrFactory: ((source: TObject, name?: string) => TInput) | NotFunc<TInput>, calcFactory: (input: TInput, name?: string) => CalcPropertyClass<TObject[Name], TInput>): this;
}
export declare class PropertyClass<TObject> extends ObservableClass {
    constructor(object: TObject);
}
export declare function propertyClass<TObject, TPropertyClass extends TBaseClass, TBaseClass extends PropertyClass<TObject> = PropertyClass<TObject>>(build: (builder: CalcObjectBuilder<TBaseClass, TObject>) => {
    object: TPropertyClass;
}, baseClass?: TClass<[TObject], TBaseClass>): TClass<[TObject, string?], TPropertyClass>;
export declare class CalcPropertyClass<TValue, TInput> extends ObservableClass {
    input: TInput;
    readonly name: string;
    constructor(input: TInput, name?: string);
    [VALUE_PROPERTY_DEFAULT]: TValue;
}
export declare function calcPropertyClassX<TInput, TValue, TCalcPropertyClass extends TBaseClass, TBaseClass extends CalcPropertyClass<TValue, TInput> = CalcPropertyClass<TValue, TInput>>(func: (this: CallState<TCalcPropertyClass, any[], TValue>) => ThenableOrIteratorOrValue<TValue>, deferredOptions?: IDeferredOptions, baseClass?: TClass<[TInput], TBaseClass>): TClass<[TInput, string?], TCalcPropertyClass>;
export declare function calcPropertyClass<TInput, TValue, TCalcPropertyClass extends TBaseClass, TBaseClass extends CalcPropertyClass<TValue, TInput> = CalcPropertyClass<TValue, TInput>>(func: (this: TInput) => ThenableOrIteratorOrValue<TValue>, deferredOptions?: IDeferredOptions, baseClass?: TClass<[TInput, string?], TBaseClass>): TClass<[TInput, string?], TCalcPropertyClass>;
export declare function calcPropertyFactory<TInput, TValue>({ name, calcFunc, deferredOptions, }: {
    name?: string;
    calcFunc: (this: TInput) => IteratorOrValue<TValue>;
    deferredOptions?: IDeferredOptions;
}): (input: TInput, name?: string) => CalcPropertyClass<TValue, TInput>;
export declare function calcPropertyFactoryX<TInput, TValue>({ name, calcFunc, deferredOptions, }: {
    name?: string;
    calcFunc: (this: CallState<CalcPropertyClass<TValue, TInput>, any[], TValue>) => IteratorOrValue<TValue>;
    deferredOptions?: IDeferredOptions;
}): (input: TInput, name?: string) => CalcPropertyClass<TValue, TInput>;

import { IPropertiesPath, ValueKeyType } from '../contracts/common';
import { IRule } from '../contracts/rules';
export declare class PropertiesPath implements IPropertiesPath {
    value: any;
    parent: IPropertiesPath;
    key: any;
    keyType: ValueKeyType;
    rule: IRule;
    constructor(value: any, parent: IPropertiesPath, key: any, keyType: ValueKeyType, rule: IRule);
    private buildId;
    private _id;
    get id(): string;
    private buildString;
    private _description;
    toString(): string;
}

import { TClass } from '../helpers/helpers';
export interface ITypeMeta {
}
export interface ITypeMetaWithId extends ITypeMeta {
    uuid: string;
}
export interface ITypeMetaCollection<TMeta extends ITypeMeta> {
    getMeta(type: TClass<any>): TMeta;
    putType(type: TClass<any>, meta: TMeta): TMeta;
    deleteType(type: TClass<any>): TMeta;
}
export interface ITypeMetaCollectionWithId<TMeta extends ITypeMetaWithId> extends ITypeMetaCollection<TMeta> {
    getType(uuid: string): TClass<any>;
    deleteType(typeOrUuid: TClass<any> | string): TMeta;
}
export declare class TypeMetaCollection<TMeta extends ITypeMeta> implements ITypeMetaCollection<TMeta> {
    private readonly _typeMetaPropertyName;
    protected readonly _proto: ITypeMetaCollection<TMeta>;
    constructor(proto?: ITypeMetaCollection<TMeta>);
    getMeta(type: TClass<any>): TMeta;
    putType(type: TClass<any>, meta: TMeta): TMeta;
    deleteType(type: TClass<any>): TMeta;
}
export declare class TypeMetaCollectionWithId<TMeta extends ITypeMetaWithId> extends TypeMetaCollection<TMeta> implements ITypeMetaCollectionWithId<TMeta> {
    private readonly _typeMap;
    protected readonly _proto: ITypeMetaCollectionWithId<TMeta>;
    constructor(proto?: ITypeMetaCollectionWithId<TMeta>);
    getType(uuid: string): TClass<any>;
    putType(type: TClass<any>, meta: TMeta): TMeta;
    deleteType(typeOrUuid: TClass<any> | string): TMeta;
}

export declare type EnumTypeString<TEnum extends string> = {
    [key in string]: TEnum | string;
};
export declare type EnumTypeNumber<TEnum extends number> = {
    [key in string]: TEnum | number;
} | {
    [key in number]: string;
};
export declare type EnumType<TEnum extends string | number = string | number> = (TEnum extends string ? EnumTypeString<TEnum> : never) | (TEnum extends number ? EnumTypeNumber<TEnum> : never);
export declare type EnumOf<TEnumType> = TEnumType extends EnumType<infer U> ? U : never;
export declare function forEachEnum<TEnum extends string | number>(enumType: EnumType<TEnum>, callback: (value: TEnum, key: string) => boolean | void): void;
export declare function forEachEnumFlags<TEnum extends number>(enumType: EnumType<TEnum>, callback: (value: TEnum, name: string) => boolean | void): void;
export declare function getEnumValues<TEnum extends string | number>(enumType: EnumType<TEnum>): TEnum[];
export declare function getEnumFlags<TEnum extends number>(enumType: EnumType<TEnum>): TEnum[];

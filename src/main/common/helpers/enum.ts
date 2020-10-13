export type EnumTypeString<TEnum extends string> =
	{ [key in string]: TEnum | string; }

export type EnumTypeNumber<TEnum extends number> =
	{ [key in string]: TEnum | number; }
	| { [key in number]: string; }

export type EnumType<TEnum extends string | number = string | number> =
	(TEnum extends string ? EnumTypeString<TEnum> : never)
	| (TEnum extends number ? EnumTypeNumber<TEnum> : never)

export type EnumOf<TEnumType> = TEnumType extends EnumType<infer U>
	? U
	: never

export function forEachEnum<TEnum extends string | number>(
	enumType: EnumType<TEnum>,
	callback: (value: TEnum, key: string) => boolean|void,
) {
	for (const key in enumType) {
		if (Object.prototype.hasOwnProperty.call(enumType, key) && isNaN(Number(key))) {
			const value = enumType[key] as any
			if (callback(value, key)) {
				return
			}
		}
	}
}

const enumValuesCache = new Map<EnumType, string[] | number[]>()

export function getEnumValues<TEnum extends string | number>(
	enumType: EnumType<TEnum>,
): TEnum[] {
	let values: TEnum[] = enumValuesCache.get(enumType) as any

	if (values == null) {
		values = []
		forEachEnum(enumType, value => {
			values.push(value)
		})
	}

	return values
}

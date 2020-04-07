export interface ISetOptions<TObject, TValue> {
	equalsFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => boolean,
	fillFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => boolean,
	convertFunc?: (this: TObject, oldValue: TValue, newValue: TValue) => any,
	beforeChange?: (this: TObject, oldValue: TValue, newValue: TValue) => void,
	afterChange?: (this: TObject, oldValue: TValue, newValue: TValue) => void,
}

export interface IFieldOptions<TObject, TValue> {
	hidden?: boolean,
	getValue?: (this: TObject) => TValue
	setValue?: (this: TObject, value: TValue) => void
}

export interface IWritableFieldOptions<TObject, TValue> extends IFieldOptions<TObject, TValue> {
	setOptions?: ISetOptions<TObject, TValue>,
}

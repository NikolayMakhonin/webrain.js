import {FuncAny, KeysOf} from '../../helpers/typescript'

export class ObjectBuilder<TObject> {
	public object: TObject
	constructor(object?: TObject) {
		this.object = object || {} as TObject
	}

	public func<
		Name extends string | number = Extract<KeysOf<TObject, FuncAny>, string|number>,
		TValue = Name extends keyof TObject
			? TObject[Name]
			: FuncAny,
	>(
		name: Name,
		func: TValue,
	): this & { object: { [newProp in Name]: TValue } } {
		this.object[name as any] = func as any
		return this as any
	}
}

import {FuncAny, KeysOf} from '../../helpers/typescript'
import {ObjectBuilder} from './ObjectBuilder'

export class ClassBuilder<TObject> extends ObjectBuilder<TObject> {
	// @ts-ignore
	public func<Name extends KeysOf<TObject, FuncAny>,
		TValue extends TObject[Name] = TObject[Name]>(
		name: Name,
		func: TValue,
	): this {
		return super.func(name as any, func)
	}
}

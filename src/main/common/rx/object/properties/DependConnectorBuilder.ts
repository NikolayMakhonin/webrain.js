import {missingSetter} from '../../../helpers/helpers'
import {TClass} from '../../../helpers/typescript'
import {getOrCreateCallState} from '../../../rx/depend/core/CallState'
import {depend} from '../../../rx/depend/core/depend'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {IReadableFieldOptions} from '../ObservableObjectBuilder'
import {Connector} from './Connector'
import {ConnectorBuilder} from './ConnectorBuilder'
import {ValueKeys} from './contracts'
import {observableClass} from './helpers'
import {INextPathGetSet, Path, PathGetSet, TNextPath} from './path/builder'

export class DependConnectorBuilder<
	TObject extends Connector<TSource> | ObservableClass,
	TSource = TObject,
	TValueKeys extends string | number = ValueKeys
>
	extends ConnectorBuilder<TObject>
{
	public readonly sourcePath?: Path<TObject, TSource>

	constructor(
		object?: TObject,
		sourcePath?: Path<TObject, TSource>,
	) {
		super(object)
		this.sourcePath = sourcePath
	}

	public connectSimple<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectSimple<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectSimple<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TObject,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connectPath(name, false, false, common, getSet, options)
	}

	public connectPath<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectPath<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectPath<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connectPath(name, true, false, common, getSet, options)
	}

	public connectLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connectPath(name, true, true, common, getSet, options)
	}

	private _connectPath<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		isDepend: boolean,
		isLazy: boolean,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		let path = PathGetSet.build(common, getSet) as any
		const {sourcePath} = this
		if (sourcePath != null) {
			path = PathGetSet.concat(sourcePath, path)
		}

		const hidden = options && options.hidden

		const {object} = this

		if (!path.canGet) {
			throw new Error('path.canGet == false')
		}

		const getValue = isDepend
			? depend(function(this: typeof object) {
				return path.get(this)
			}, null, makeDependPropertySubscriber(name))
			: function(this: typeof object) {
				return path.get(this)
			}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : !hidden,
			get: isDepend && isLazy
				? function() {
					const state = getOrCreateCallState(getValue).apply(this, arguments)
					return state.getValue(true)
				}
				: getValue,
			set: !path.canSet ? missingSetter : function(value: TValue) {
				return path.set(this, value)
			},
		})

		return this as any
	}
}

export function dependConnectorClass<
	TSource,
	TConnectorClass extends TBaseClass,
	TBaseClass extends Connector<TSource>
		= Connector<TSource>,
>(
	build: (connectorBuilder: DependConnectorBuilder<TBaseClass, TSource>) => { object: TConnectorClass },
	baseClass?: TClass<[TSource, string?], TBaseClass>,
) {
	const sourcePath = new Path<TBaseClass>().f(o => o.connectorState).f(o => o.source).init()

	return observableClass<
		[TSource, string?],
		TBaseClass,
		TConnectorClass
	>(
		object => build(new DependConnectorBuilder<TBaseClass, TSource>(object, sourcePath as any)).object,
		baseClass != null ? baseClass : Connector as any,
	)
}

export function dependConnectorFactory<
	TSource extends ObservableClass,
	TConnectorClass extends TBaseClass,
	TBaseClass extends Connector<TSource>
		= Connector<TSource>,
>({
	name,
	build,
	baseClass,
}: {
	name?: string,
	build: (connectorBuilder: DependConnectorBuilder<TBaseClass, TSource>) => { object: TConnectorClass },
	baseClass?: new (source: TSource, name?: string) => TBaseClass,
}): (source: TSource, name?: string) => TConnectorClass {
	const NewConnector = dependConnectorClass(build, baseClass)
	return (source, _name) => new NewConnector(source, _name != null ? _name : name)
}

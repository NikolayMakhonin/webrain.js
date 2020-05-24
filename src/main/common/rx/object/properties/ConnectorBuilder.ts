import {missingSetter} from '../../../helpers/helpers'
import {TClass} from '../../../helpers/typescript'
import {getOrCreateCallState} from '../../../rx/depend/core/CallState'
import {depend} from '../../../rx/depend/core/depend'
import {dependWait} from '../../../rx/depend/helpers'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {IReadableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {Connector} from './Connector'
import {ValueKeys} from './contracts'
import {observableClass} from './helpers'
import {INextPathGetSet, Path, PathGetSet, TNextPath} from './path/builder'

export interface IConnectFieldOptions<TObject, TValue> extends IReadableFieldOptions<TObject, TValue> {
	isDepend?: boolean,
	isLazy?: boolean,
	isWait?: boolean,
	waitCondition?: (value: TValue) => boolean,
	waitTimeout?: number,
}

export class ConnectorBuilder<
	TObject extends Connector<TSource> | ObservableClass,
	TSource = TObject,
	TValueKeys extends string | number = ValueKeys
>
	extends ObservableObjectBuilder<TObject>
{
	public readonly sourcePath?: Path<TObject, TSource>

	constructor(
		object?: TObject,
		sourcePath?: Path<TObject, TSource>,
	) {
		super(object)
		this.sourcePath = sourcePath
	}

	// region connectSimple

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
		return this._connect(name, common, getSet, options)
	}

	// endregion

	// region connect
	
	public connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connect(name, common, getSet,
			options	? {
				...options,
				isDepend: true,
			} : {
				isDepend: true,
			})
	}

	// endregion

	// region connectLazy
	
	public connectLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connect(name, common, getSet,
			options	? {
				...options,
				isDepend: true,
				isLazy: true,
			} : {
				isDepend: true,
				isLazy: true,
			})
	}

	// endregion

	// region connectWait

	public connectWait<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectWait<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectWait<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connect(name, common, getSet,
			options	? {
				...options,
				isDepend: true,
				isWait: true,
			} : {
				isDepend: true,
				isWait: true,
			})
	}

	// endregion

	// region connectWaitLazy

	public connectWaitLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : TSource,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TValue>,
		getSet?: null|undefined,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectWaitLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } }
	public connectWaitLazy<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
		>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		return this._connect(name, common, getSet,
			options	? {
				...options,
				isDepend: true,
				isLazy: true,
				isWait: true,
			} : {
				isDepend: true,
				isLazy: true,
				isWait: true,
			})
	}

	// endregion

	// region _connect

	private _connect<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TCommonValue = TSource,
		TValue = Name extends keyof TObject ? TObject[Name] : TCommonValue,
	>(
		name: Name,
		common: TNextPath<TSource, TSource, TCommonValue>,
		getSet?: INextPathGetSet<TSource, TCommonValue, TValue>,
		options?: IConnectFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		let path = PathGetSet.build(common, getSet) as any
		const {sourcePath} = this
		if (sourcePath != null) {
			path = PathGetSet.concat(sourcePath, path)
		}

		const {
			hidden,
			isDepend,
			isLazy,
			isWait,
			waitCondition,
			waitTimeout,
		} = options || {}

		const {object} = this

		if (!path.canGet) {
			throw new Error('path.canGet == false')
		}

		let getValue = function(this: typeof object) {
			return path.get(this)
		}
		if (isDepend) {
			getValue = depend(getValue, null, makeDependPropertySubscriber(name))
			if (isWait) {
				getValue = dependWait(getValue, waitCondition as any, waitTimeout, isLazy)
			} else if (isLazy) {
				const _getValue = getValue
				getValue = function() {
					const state = getOrCreateCallState(_getValue).apply(this, arguments)
					return state.getValue(true)
				}
			}
		}

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : !hidden,
			get: getValue,
			set: !path.canSet ? missingSetter : function(value: TValue) {
				return path.set(this, value)
			},
		})

		return this as any
	}

	// endregion
}

export function dependConnectorClass<
	TSource,
	TConnectorClass extends TBaseClass,
	TBaseClass extends Connector<TSource>
		= Connector<TSource>,
>(
	build: (connectorBuilder: ConnectorBuilder<TBaseClass, TSource>) => { object: TConnectorClass },
	baseClass?: TClass<[TSource, string?], TBaseClass>,
) {
	const sourcePath = new Path<TBaseClass>().f(o => o.connectorState).f(o => o.source).init()

	return observableClass<
		[TSource, string?],
		TBaseClass,
		TConnectorClass
	>(
		object => build(new ConnectorBuilder<TBaseClass, TSource>(object, sourcePath as any)).object,
		baseClass != null ? baseClass : Connector as any,
	)
}

export function connectorFactory<
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
	build: (connectorBuilder: ConnectorBuilder<TBaseClass, TSource>) => { object: TConnectorClass },
	baseClass?: new (source: TSource, name?: string) => TBaseClass,
}): (source: TSource, name?: string) => TConnectorClass {
	const NewConnector = dependConnectorClass(build as any, baseClass as any)
	return (source, _name) => new NewConnector(source, _name != null ? _name : name) as any
}

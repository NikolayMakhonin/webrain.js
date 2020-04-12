import {depend} from '../../../rx/depend/core/depend'
import {makeDependPropertySubscriber} from '../helpers'
import {ObservableClass} from '../ObservableClass'
import {IReadableFieldOptions} from '../ObservableObjectBuilder'
import {Connector} from './Connector'
import {ConnectorBuilder} from './ConnectorBuilder'
import {ValueKeys} from './contracts'
import {buildPropertyPath, IPropertyPathGetSet, pathsConcat, PathGetSet, TGetNextPathGetSet} from './path/builder'
import {TPathNodes} from './path/constracts'

export class DependConnectorBuilder<
	TObject extends Connector<TSource> | ObservableClass,
	TSource = TObject,
	TValueKeys extends string | number = ValueKeys
>
	extends ConnectorBuilder<TObject>
{
	public readonly sourcePath?: TPathNodes<TObject, TSource>

	constructor(
		object?: TObject,
		sourcePath?: TPathNodes<TObject, TSource>,
	) {
		super(object)
		this.sourcePath = sourcePath
	}

	public connectPath<
		Name extends string | number = Extract<keyof TObject, string|number>,
		TValue = Name extends keyof TObject ? TObject[Name] : any,
		TCommonValue = TObject,
	>(
		name: Name,
		common: TGetNextPathGetSet<TSource, TSource, TCommonValue>,
		getSet?: IPropertyPathGetSet<TSource, TCommonValue, TValue>,
		options?: IReadableFieldOptions<TSource, TValue>,
	): this & { object: { [newProp in Name]: TValue } } {
		let path: PathGetSet<TObject, TValue> = buildPropertyPath(common, getSet) as any
		const {sourcePath} = this
		if (sourcePath != null) {
			path = new PathGetSet(
				pathsConcat(sourcePath, path == null ? null : path.nodesGet),
				pathsConcat(sourcePath, path == null ? null : path.nodesSet),
			) as any
		}

		const hidden = options && options.hidden

		const {object} = this

		Object.defineProperty(object, name, {
			configurable: true,
			enumerable  : !hidden,
			get: !path.canSet ? null : depend(function(this: typeof object) {
				return path.get(this)
			}, null, makeDependPropertySubscriber(name)),
			set: !path.canGet ? null : function(value: TValue) {
				return path.set(this, value)
			},
		})

		return this as any
	}
}

export function dependConnectorClass<
	TSource extends ObservableClass,
	TConnector extends Connector<TSource>,
>({
	buildRule,
	baseClass,
}: {
	buildRule: (connectorBuilder: DependConnectorBuilder<Connector<TSource>, TSource>) => { object: TConnector },
	baseClass?: new (source: TSource) => Connector<TSource>,
}): new (source: TSource, name?: string) => TConnector {
	// @ts-ignore
	class NewConnector extends (baseClass || Connector) implements Connector<TSource> { }

	// @ts-ignore
	buildRule(new DependConnectorBuilder<NewConnector, TSource>(
		NewConnector.prototype,
	))

	return NewConnector as unknown as new (source: TSource) => TConnector
}

export function dependConnectorFactory<
	TSource extends ObservableClass,
	TConnector extends Connector<TSource>,
>({
	name,
	buildRule,
	baseClass,
}: {
	name?: string,
	buildRule: (connectorBuilder: DependConnectorBuilder<Connector<TSource>, TSource>) => { object: TConnector },
	baseClass?: new (source: TSource, name?: string) => Connector<TSource>,
}): (source: TSource, name?: string) => TConnector {
	const NewConnector = dependConnectorClass({buildRule, baseClass})
	return (source, sourceName) => new NewConnector(source, name || sourceName) as unknown as TConnector
}
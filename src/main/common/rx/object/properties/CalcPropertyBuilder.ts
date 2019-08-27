import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ObservableObject} from '../ObservableObject'
import {CalcProperty} from './CalcProperty'
import {Connector} from './Connector'
import {ValueKeys} from './contracts'
import {DependenciesBuilder} from './DependenciesBuilder'

export class CalcPropertyDependenciesBuilder<
	TTarget extends CalcProperty<TSource, any, any>,
	TSource,
	TValueKeys extends string | number = ValueKeys
> extends DependenciesBuilder<TTarget, TSource, TValueKeys> {

	public invalidateOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		predicate?: (value, parent) => boolean,
	): this {
		this.actionOn(buildRule, target => { target.invalidate() }, predicate)
		return this
	}

	public clearOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		predicate?: (value, parent) => boolean,
	): this {
		this.actionOn(buildRule, target => { target.clear() }, predicate)
		return this
	}
}

export function connectorClass<
	TSource extends ObservableObject,
	TConnector extends ObservableObject,
>(
	build: (connectorBuilder: ConnectorBuilder<ObservableObject, TSource>) => { object: TConnector },
): new (source: TSource) => TConnector {
	class NewConnector extends Connector<TSource> { }

	build(new ConnectorBuilder<NewConnector, TSource>(
		NewConnector.prototype,
		b => b.propertyName('connectorSource'),
	))

	return NewConnector as unknown as new (source: TSource) => TConnector
}

export function connectorFactory<
	TSource extends ObservableObject,
	TConnector extends ObservableObject,
>(
	build: (connectorBuilder: ConnectorBuilder<ObservableObject, TSource>) => { object: TConnector },
): (source: TSource) => TConnector {
	const NewConnector = connectorClass(build)
	return source => new NewConnector(source) as unknown as TConnector
}

// const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableObject, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }

// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }

import {createFunction} from '../../../helpers/helpers'
import {depend} from '../../../rx/depend/core/depend'
import {Debugger} from '../../Debugger'
import {ValueKeyType} from '../../deep-subscribe/contracts/common'
import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {setObjectValue} from '../../deep-subscribe/helpers/common'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {makeDependPropertySubscriber} from '../helpers'
import {_set, _setExt, ObservableClass} from '../ObservableClass'
import {IReadableFieldOptions, IWritableFieldOptions, ObservableObjectBuilder} from '../ObservableObjectBuilder'
import {CalcObjectBuilder} from './CalcObjectBuilder'
import {Connector} from './Connector'
import {ConnectorBuilder} from './ConnectorBuilder'
import {ValueKeys} from './contracts'
import {DependCalcProperty} from './DependCalcProperty'
import {buildPropertyPath, IPropertyPathGetSet, TGetNextPathGet, TGetNextPathGetSet} from './path/builder'

const buildSourceRule: <TSource, TValueKeys extends string | number = ValueKeys>
	(builder: RuleBuilder<DependCalcPropertyState<TSource>, TValueKeys>)
		=> RuleBuilder<TSource, TValueKeys> = b => b.p('source')

export function connectorClass<
	TInput,
	TValue,
	TDependCalcProperty extends DependCalcProperty<TInput>
>(
	func: (this: TInput) => TValue,
	baseClass?: new (source: TInput) => DependCalcProperty<TInput>,
): new (input?: TInput) => TDependCalcProperty {
	// @ts-ignore
	class NewDependCalcProperty extends (baseClass || DependCalcProperty) implements DependCalcProperty<TInput> { }

	// @ts-ignore
	const builder = new CalcObjectBuilder<NewDependCalcProperty, TInput>(
		NewDependCalcProperty.prototype,
	)
		.dependCalc()

	return NewDependCalcProperty as unknown as new (source: TInput) => TDependCalcProperty
}

export function connectorFactory<
	TSource extends ObservableClass,
	TDependCalcProperty extends DependCalcProperty<TSource>,
>({
	name,
	buildRule,
	baseClass,
}: {
	name?: string,
	buildRule: (connectorBuilder: DependCalcPropertyBuilder<DependCalcProperty<TSource>, TSource>) => { object: TDependCalcProperty },
	baseClass?: new (source: TSource, name?: string) => DependCalcProperty<TSource>,
}): (source: TSource, name?: string) => TDependCalcProperty {
	const NewDependCalcProperty = connectorClass({buildRule, baseClass})
	return (source, sourceName) => new NewDependCalcProperty(source, name || sourceName) as unknown as TDependCalcProperty
}

// const builder = new DependCalcPropertyBuilder(true as any)
//
// export function connect<TObject extends ObservableClass, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }

// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }

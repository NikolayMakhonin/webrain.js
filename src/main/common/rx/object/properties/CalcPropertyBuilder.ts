import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {ObservableObject} from '../ObservableObject'
import {CalcProperty, CalcPropertyFunc} from './CalcProperty'
import {CalcPropertyDependenciesBuilder} from './CalcPropertyDependenciesBuilder'
import {Connector} from './Connector'
import {ValueKeys} from './contracts'
import {IPropertyOptions} from './property'

export function calcPropertyFactory<
	TInput, TValue, TMergeSource,
	TTarget extends CalcProperty<TInput, TValue, TMergeSource> = CalcProperty<TInput, TValue, TMergeSource>,
>(
	calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
	calcOptions: IDeferredCalcOptions,
	valueOptions?: IPropertyOptions<TValue, TMergeSource>,
	initValue?: TValue,
	buildDependencies?: (
		dependenciesBuilder: CalcPropertyDependenciesBuilder<CalcProperty<TInput, TValue, TMergeSource>, TInput>
	) => void,
): () => CalcProperty<TInput, TValue, TMergeSource> {
	let dependencies
	if (buildDependencies) {
		const dependenciesBuilder = new CalcPropertyDependenciesBuilder<TTarget, TInput>(
			b => b.propertyName('input'),
		)
		buildDependencies(dependenciesBuilder)
		dependencies = dependenciesBuilder.dependencies
	}

	return () => {
		const calcProperty = new CalcProperty()
		if (dependencies) {
			for (let i = 0, len = dependencies.length; i < len; i++) {
				const [rule, action] = dependencies[i]
				deepSubscribeRule(
					calcProperty,
					(value, parent, propertyName)
						=> action(calcProperty, value, parent, propertyName),
					true,
					rule
				)
			}
		}
	}
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

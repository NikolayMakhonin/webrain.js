import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {CalcProperty, CalcPropertyFunc} from './CalcProperty'
import {CalcPropertyDependenciesBuilder} from './CalcPropertyDependenciesBuilder'
import {subscribeDependencies} from './DependenciesBuilder'
import {IPropertyOptions} from './Property'

export function calcPropertyFactory<
	TValue, TInput, TMergeSource,
	TTarget extends CalcProperty<TValue, TInput, TMergeSource> = CalcProperty<TValue, TInput, TMergeSource>,
>(
	buildDependencies: null | ((
		dependenciesBuilder: CalcPropertyDependenciesBuilder<CalcProperty<TValue, TInput, TMergeSource>, TInput>,
	) => void),
	calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
	calcOptions?: IDeferredCalcOptions,
	valueOptions?: IPropertyOptions<TValue, TMergeSource>,
	initValue?: TValue,
): () => CalcProperty<TValue, TInput, TMergeSource> {
	let dependencies
	if (buildDependencies) {
		const dependenciesBuilder = new CalcPropertyDependenciesBuilder<TTarget, TInput>(
			b => b.valuePropertyName('input'),
		)
		buildDependencies(dependenciesBuilder)
		dependencies = dependenciesBuilder.dependencies
	}

	return () => {
		const calcProperty = new CalcProperty(calcFunc, calcOptions, valueOptions, initValue)
		if (dependencies) {
			subscribeDependencies(calcProperty, calcProperty, dependencies)
		}
		return calcProperty
	}
}

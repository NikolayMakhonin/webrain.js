import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {CalcProperty, CalcPropertyFunc} from './CalcProperty'
import {CalcPropertyDependenciesBuilder} from './CalcPropertyDependenciesBuilder'
import {subscribeDependencies} from './DependenciesBuilder'
import {IPropertyOptions} from './property'

export function calcPropertyFactory<
	TInput, TValue, TMergeSource,
	TTarget extends CalcProperty<TInput, TValue, TMergeSource> = CalcProperty<TInput, TValue, TMergeSource>,
>(
	calcFunc: CalcPropertyFunc<TInput, TValue, TMergeSource>,
	calcOptions?: IDeferredCalcOptions,
	valueOptions?: IPropertyOptions<TValue, TMergeSource>,
	initValue?: TValue,
	buildDependencies?: (
		dependenciesBuilder: CalcPropertyDependenciesBuilder<CalcProperty<TInput, TValue, TMergeSource>, TInput>,
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
		const calcProperty = new CalcProperty(calcFunc, calcOptions, valueOptions, initValue)
		if (dependencies) {
			subscribeDependencies(calcProperty, calcProperty, dependencies)
		}
		return calcProperty
	}
}

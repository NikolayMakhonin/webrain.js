import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {CalcProperty} from './CalcProperty'
import {CalcPropertyDependenciesBuilder} from './CalcPropertyDependenciesBuilder'
import {CalcPropertyFunc} from './contracts'
import {subscribeDependencies} from './DependenciesBuilder'

export function calcPropertyFactory<
	TValue, TInput,
	TTarget extends CalcProperty<TValue, TInput> = CalcProperty<TValue, TInput>,
>({
	dependencies: buildDependencies,
	calcFunc,
	name,
	calcOptions,
	initValue,
}: {
	dependencies: null | ((
		dependenciesBuilder: CalcPropertyDependenciesBuilder<CalcProperty<TValue, TInput>, TInput>,
	) => void),
	calcFunc: CalcPropertyFunc<TValue, TInput>,
	name?: string,
	calcOptions?: IDeferredCalcOptions,
	initValue?: TValue,
}): () => CalcProperty<TValue, TInput> {
	let dependencies
	if (buildDependencies) {
		const dependenciesBuilder = new CalcPropertyDependenciesBuilder<TTarget, TInput>(
			b => b.propertyName('input'),
		)
		buildDependencies(dependenciesBuilder)
		dependencies = dependenciesBuilder.dependencies
	}

	return () => {
		const calcProperty = new CalcProperty({
			calcFunc,
			name,
			calcOptions,
			initValue,
		})

		if (dependencies) {
			// subscribeDependencies(calcProperty.state, calcProperty, dependencies)
			let states
			let unsubscribe
			calcProperty
				.propertyChanged
				.hasSubscribersObservable
				.subscribe(hasSubscribers => {
					if (unsubscribe) {
						states = unsubscribe()
						unsubscribe = null
					}

					if (hasSubscribers) {
						unsubscribe = subscribeDependencies(calcProperty.state, calcProperty, dependencies, states)
					}
				}, `CalcProperty.${calcProperty.state.name}.hasSubscribersObservable for subscribeDependencies`)
		}

		return calcProperty
	}
}

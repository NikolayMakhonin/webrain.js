import {isThenable} from '../../async/async'
import {ThenableSync} from '../../async/ThenableSync'
import {webrainOptions} from '../../helpers/webrainOptions'
import {createConnector} from '../object/properties/helpers'
import {IUnsubscribe} from '../subjects/observable'
import {dependBindThis, getOrCreateCallState, subscribeCallState} from './core/CallState'
import {CallStatusShort, Func, TInnerValue} from './core/contracts'
import {dependX} from './core/depend'

function simpleCondition(value) {
	return value != null
}

export function dependWait<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
	condition?: (value: TInnerValue<TResultInner>) => boolean,
	timeout?: number,
	isLazy?: boolean,
) {
	if (condition == null) {
		condition = simpleCondition
	}

	if (timeout == null) {
		timeout = webrainOptions.timeouts.dependWait
	}

	return dependX(function() {
		const state = this

		const funcState = getOrCreateCallState(func).apply(state._this, arguments)
		const value = funcState.getValue(isLazy)

		if (!isThenable(value) && condition(value)) {
			return value
		}

		return new ThenableSync((resolve, reject) => {
			let unsubscribe = funcState.subscribe(() => {
				if (unsubscribe == null) {
					return
				}

				switch (funcState.statusShort) {
					case CallStatusShort.CalculatedValue:
						if (condition(funcState.value)) {
							unsubscribe()
							unsubscribe = null
							resolve(funcState.value)
						}
						break
					case CallStatusShort.CalculatedError:
						unsubscribe()
						unsubscribe = null
						reject(funcState.error)
						break
					case CallStatusShort.Invalidated:
						funcState.getValue(false, true)
						break
				}
			})

			if (timeout != null && timeout > 0) {
				setTimeout(() => {
					if (unsubscribe == null) {
						return
					}

					unsubscribe()
					unsubscribe = null
					reject(new Error('Timeout error'))
				}, timeout)
			}
		})
	})
}

export function autoCalc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
): Func<TThisOuter, TArgs, IUnsubscribe> {
	return function() {
		return subscribeCallState(
			getOrCreateCallState(func).apply(this, arguments),
		)
	}
}

export function autoCalcConnect<
	TObject,
	TConnector,
>(
	object: TObject,
	connectorFactory: (source: TObject, name?: string) => TConnector,
	func: Func<TConnector, [], any>,
) {
	return autoCalc(dependBindThis(
		createConnector(
			object,
			connectorFactory,
		),
		func,
	))
}

export function dependWrapThis<
	TThis,
	TWrapThis,
	TArgs extends any[],
	TResult
>(
	wrapThis: (_this: TThis) => TWrapThis,
	func: Func<TWrapThis, TArgs, TResult>,
): (_this: TThis) => Func<never, TArgs, TResult> {
	return function(_this: TThis) {
		return dependBindThis(wrapThis(_this), func)
	}
}

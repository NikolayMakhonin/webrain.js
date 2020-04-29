import {resolveAsync, ThenableSync} from '../../../../async/ThenableSync'
import {ALWAYS_CHANGE_VALUE, getOrCreateCallState, subscribeCallState} from '../../../../rx/depend/core/CallState'
import {depend} from '../../../../rx/depend/core/depend'
import {CallStatusShort, ICallState} from '../../../depend/core/contracts'
import {ISubscriber, IUnsubscribe} from '../../../subjects/observable'
import {IRuleBuilder} from './builder/contracts/IRuleBuilder'
import {IRule} from './builder/contracts/rules'
import {RuleBuilder} from './builder/RuleBuilder'
import {SubscribeObjectType} from './builder/rules-subscribe'
import {forEachRule} from './forEachRule'
import {resolveValueProperty} from './resolve'

const dependForEachRule = depend(function<TObject, TValue>(this: TObject, rule: IRule, emitLastValue: boolean) {
	return resolveAsync(
		new ThenableSync((resolve, reject) => {
			let rejected = false
			let lastValue
			let asyncCount = 1

			forEachRule<TObject, TValue>(rule, this, value => {
				lastValue = value
			}, null, null, null, (subRule, object, next) => {
				if (rejected) {
					return
				}

				asyncCount++
				resolveAsync(
					object,
					o => {
						if (rejected) {
							return
						}

						subRule.subscribe(o, next)

						asyncCount--
						if (asyncCount < 0) {
							throw new Error(`asyncCount == ${asyncCount}`)
						}
						if (asyncCount === 0) {
							resolve(lastValue)
						}
					},
					err => {
						if (rejected) {
							return
						}

						rejected = true
						reject(err)
					},
					null,
					subRule.subType === SubscribeObjectType.ValueProperty
						? null
						: resolveValueProperty,
				)
			})

			asyncCount--
			if (asyncCount < 0) {
				throw new Error(`asyncCount == ${asyncCount}`)
			}
			if (!rejected && asyncCount === 0) {
				resolve(lastValue)
			}
		}),
		emitLastValue ? null : o => ALWAYS_CHANGE_VALUE,
		null,
		null,
		resolveValueProperty,
	)
})

export type TSubscribeFunc<TObject, TValue> = (
	object?: TObject|undefined|null,
	subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>,
) => IUnsubscribe

export function dependDeepSubscriber<TObject, TValue>({
	object,
	rule,
	build,
	subscriber,
	emitLastValue,
}: {
	object?: TObject,
	rule?: IRule,
	build?: (builder: IRuleBuilder<TObject>) => IRuleBuilder<TValue>,
	subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>,
	emitLastValue?: boolean,
}): TSubscribeFunc<TObject, TValue> {
	if (rule == null) {
		rule = build(new RuleBuilder({
			autoInsertValuePropertyDefault: false,
		})).result()
	}

	return function subscribe(
		_object: TObject,
		_subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>,
	) {
		if (!_subscriber) {
			_subscriber = subscriber
		}
		return subscribeCallState(
			getOrCreateCallState(dependForEachRule).call(
				_object || object,
				rule,
				emitLastValue,
			) as ICallState<TObject, [IRule], TValue>,
			state => {
				if (state.statusShort === CallStatusShort.CalculatedError) {
					console.error(state.error)
				}
				_subscriber(state)
			},
		)
	}
}

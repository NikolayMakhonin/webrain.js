import {resolveAsync, ThenableSync} from '../../../../async/ThenableSync'
import {ALWAYS_CHANGE_VALUE, getOrCreateCallState, subscribeCallState} from '../../../../rx/depend/core/CallState'
import {depend} from '../../../../rx/depend/core/depend'
import {CallStatusShort, ICallState} from '../../../depend/core/contracts'
import {ISubscriber} from '../../../subjects/observable'
import {IRuleBuilder} from './builder/contracts/IRuleBuilder'
import {IRule} from './builder/contracts/rules'
import {RuleBuilder} from './builder/RuleBuilder'
import {SubscribeObjectType} from './builder/rules-subscribe'
import {forEachRule} from './forEachRule'
import {resolveValueProperty} from './resolve'

const dependForEachRule = depend(function<TObject, TValue>(this: TObject, rule: IRule) {
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
		o => ALWAYS_CHANGE_VALUE,
		null,
		null,
		resolveValueProperty,
	)
})

export function dependDeepSubscriber<TObject, TValue>({
	rule,
	build,
	subscriber,
}: {
	rule?: IRule,
	build?: (builder: IRuleBuilder<TObject>) => IRuleBuilder<TValue>,
	subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>,
}) {
	if (rule == null) {
		rule = build(new RuleBuilder({
			autoInsertValuePropertyDefault: false,
		})).result()
	}

	return function subscribe(
		object: TObject,
		_subscriber?: ISubscriber<ICallState<TObject, [IRule], TValue>>,
	) {
		return subscribeCallState(
			getOrCreateCallState(dependForEachRule).call(object, rule) as ICallState<TObject, [IRule], TValue>,
			subscriber || _subscriber,
		)
	}
}

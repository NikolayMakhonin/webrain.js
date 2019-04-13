/* tslint:disable */
import {ArraySet} from '../../lists/ArraySet'
import {IPropertyChanged} from '../../lists/contracts/IPropertyChanged'
import {ISetChanged} from '../../lists/contracts/ISetChanged'
import {IObservable} from '../subjects/observable'
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'
import {subscribeChilds} from './helpers/subscribe-childs'
import {IRuleOrIterable, iterateRule} from './iterate-rule'
import {IRuleSubscribe} from "./contracts/rule-subscribe";

export interface IDeepSubscribeOptions {

}

function deepSubscribe<TValue>(
	object: any,
	rule: IRule,
	bind: (value: TValue) => IUnsubscribe,
	options: IDeepSubscribeOptions,
): IUnsubscribe {
	return _deepSubscribe<TValue>(
		object,
		iterateRule(rule)[Symbol.iterator](),
		bind,
		options,
	)
}

function *_deepSubscribe<TValue>(
	object: any,
	ruleIterator: Iterator<IRuleOrIterable>,
	bind: (value: TValue) => IUnsubscribe,
	options: IDeepSubscribeOptions,
	propertiesPath?: string,
): any {
	const iteration = ruleIterator.next()
	if (iteration.done) {
		return null
	}

	const ruleOrIterable = iteration.value

	if (ruleOrIterable[Symbol.iterator]) {
		const unsubscribers: IUnsubscribe[] = []
		for (const ruleIterable of ruleOrIterable as Iterable<IRuleOrIterable>) {
			unsubscribers.push(_deepSubscribe(
				object,
				ruleIterable[Symbol.iterator](),
				bind,
				options,
			))
		}

		return () => {
			for (let i = 0, len = unsubscribers.length; i < len; i++) {
				unsubscribers[i]()
			}
		}
	} else {
		const rule = ruleOrIterable as IRuleSubscribe
		const unsubscribers = new ArraySet<IUnsubscribe>()

		function subscribeItem(item, debugPropertyName: string) {
			let unsubscribe = item.unsubscribe // TODO
			if (!unsubscribe) {
				unsubscribe = _deepSubscribe(
					object,
					ruleIterator,
					bind,
					options,
					(propertiesPath ? propertiesPath + '.' : '')
						+ debugPropertyName + '(' + rule.description + ')',
				)
				item.unsubscribe = unsubscribe // TODO
			}
		}

		function unsubscribeItem(item, debugPropertyName: string) {
			const unsubscribe = item.unsubscribe // TODO
			if (unsubscribe) {
				unsubscribe()
				delete item.unsubscribe // TODO
			}
		}

		{
			const unsubscribe = subscribeChilds({
				object,
				propertyPredicate: rule.predicate,
				subscribeItem,
				unsubscribeItem,
			})

			if (unsubscribe) {
				unsubscribers.add(unsubscribe)
			}
		}

		for (const item of rule.iterateObject(object)) {
			subscribeItem(item)
		}

		return () => {
			for (const item of rule.iterateObject(object)) {
				unsubscribeItem(item)
			}
		}
	}
}

function deepSubscribeOld<TValue>(
	object: any,
	rule: IRule,
	bind: (value: TValue) => IUnsubscribe,
	options: IDeepSubscribeOptions,
): IUnsubscribe {
	const ruleNext = nextRule(rule)

	if (object.propertyChanged) {
		(object as IPropertyChanged)
			.propertyChanged
			.subscribe(event => {

				const unsubscribe = deepSubscribe(
					event.newValue,
					ruleNext,
					value => {

					},
					options)
			})
	} else if (object.setChanged) {
		(object as ISetChanged<any>)
			.setChanged
			.subscribe(event => {

				for (const newItem of event.newItems) {
					const unsubscribe = deepSubscribe(
						newItem,
						ruleNext,
						value => {

						},
						options)
				}
			})
	} else if (object.mapChanged) {

	} else if (object.listChanged) {

	}

}

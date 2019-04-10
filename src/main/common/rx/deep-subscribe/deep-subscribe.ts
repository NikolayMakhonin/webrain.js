import {IPropertyChanged} from '../../lists/contracts/IPropertyChanged'
import {ISetChanged} from '../../lists/contracts/ISetChanged'
import {IObservable} from '../subjects/observable'
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'

export interface IDeepSubscribeOptions {

}

function nextRule(rule: IRule): IRule {

}

function deepSubscribe<TValue>(
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

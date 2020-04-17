import {webrainOptions} from '../../helpers/webrainOptions'
import {CallStatusShort, ICallStateAny} from '../depend/core/contracts'

export function makeDependPropertySubscriber(name: string | number) {
	return function initDependCalcState(state: ICallStateAny) {
		let value
		let dependUnsubscribe
		state._this.propertyChanged.hasSubscribersObservable
			.subscribe(hasSubscribers => {
				if (dependUnsubscribe) {
					dependUnsubscribe()
					dependUnsubscribe = null
				}

				if (hasSubscribers) {
					value = state.value
					state.getValue()
					if (state.statusShort === CallStatusShort.CalculatedValue) {
						value = state.value
					}

					dependUnsubscribe = state
						.subscribe(async () => {
							if (state.statusShort === CallStatusShort.Invalidated) {
								const oldValue = value
								const newValue = await state.getValue()
								value = newValue
								if (!(oldValue === newValue || webrainOptions.equalsFunc && webrainOptions.equalsFunc(oldValue, newValue))) {
									state._this.propertyChanged.emit({
										name,
										oldValue,
										newValue,
									})
								}
							}
						})
				}
			})
	}
}

import {isAsync} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {webrainOptions} from '../../helpers/webrainOptions'

export function makeDependPropertySubscriber(name: string | number) {
	return function initDependCalcState(state) {
		let value
		let dependUnsubscribe
		state._this.propertyChanged.hasSubscribersObservable
			.subscribe(hasSubscribers => {
				if (dependUnsubscribe) {
					dependUnsubscribe()
					dependUnsubscribe = null
				}

				if (hasSubscribers) {
					value = state.getValue()
					dependUnsubscribe = state
						.subscribe(() => {
							const newValue = state.getValue()
							// resolveAsync(state.getValue(), newValue => {
							const oldValue = value
							value = newValue
							if (!(oldValue === newValue || webrainOptions.equalsFunc && webrainOptions.equalsFunc(oldValue, newValue))) {
								state._this.propertyChanged.emit({
									name,
									oldValue,
									newValue,
								})
							}
							// })
						})
				}
			})
	}
}

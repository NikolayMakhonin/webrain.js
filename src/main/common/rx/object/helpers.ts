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
					dependUnsubscribe = state
						.subscribe(() => {
							const oldValue = value
							value = state.getValue()
							state._this.propertyChanged.onPropertyChanged({
								name,
								oldValue,
								newValue: value,
							})
						})
				}
			})
	}
}

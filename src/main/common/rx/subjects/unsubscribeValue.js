export function unsubscribeValue(base) {
	return class UnsubscribeValue extends base {
		subscribe(subscriber) {
			const unsubscribe = super.subscribe(subscriber)

			let unsubscribed
			return () => {
				if (unsubscribed) {
					return
				}
				unsubscribed = true

				subscriber(this.unsubscribeValue)
				unsubscribe()
			}
		}
	}
}

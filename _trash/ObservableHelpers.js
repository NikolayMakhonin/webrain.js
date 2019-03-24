export function autoConnect(subscribeFunc, connectPredicate, connectFunc) {
	let disconnect
	const unsubscribe = subscribeFunc(value => {
		if (connectPredicate && connectPredicate(value) || !connectPredicate && value) {
			if (!disconnect) {
				disconnect = connectFunc()
			}
		} else {
			if (disconnect) {
				disconnect()
			}
			disconnect = null
		}
	})

	return () => {
		unsubscribe()
		if (disconnect) {
			disconnect()
		}
	}
}

export function checkUnsubscribe(unsubscribe: () => void) {
	if (unsubscribe != null && typeof unsubscribe !== 'function') {
		throw new Error(`Subscribe function should return null/undefined or unsubscribe function, but not ${unsubscribe}`)
	}
	return unsubscribe
}

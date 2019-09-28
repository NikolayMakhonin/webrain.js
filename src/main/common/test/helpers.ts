function getGlobalScope() {
	if (typeof window !== 'undefined') {
		return window
	}
	if (typeof self !== 'undefined') {
		return self
	}
	if (typeof global !== 'undefined') {
		return global
	}
	return null
}

export const globalScope: any = getGlobalScope()

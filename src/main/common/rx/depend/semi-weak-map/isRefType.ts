export function isRefType(value): boolean {
	return value != null && (typeof value === 'object' || typeof value === 'function')
}

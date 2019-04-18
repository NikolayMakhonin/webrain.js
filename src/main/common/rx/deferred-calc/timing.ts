export interface ITiming {
	now(): number
	setTimeout(handler: () => void, timeout: number): number
	clearTimeout(handle: number)
}

export const timingDefault: ITiming = {
	now: Date.now,
	setTimeout: typeof window === 'undefined'
		? setTimeout
		: setTimeout.bind(window),
	clearTimeout: typeof window === 'undefined'
		? clearTimeout
		: clearTimeout.bind(window),
}

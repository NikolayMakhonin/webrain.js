import {Thenable} from '../async/async'

export const performanceNow = typeof performance !== 'undefined'
	// eslint-disable-next-line no-undef
	? (): number => performance.now()
	: (): number => {
		const time = process.hrtime()
		return time[0] * 1000 + time[1] * 0.000001
	}

export function delay(timeMilliseconds): Thenable {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

// region fast now

let _fastNow = Date.now()
let lastAccessTime = 0
function fastNowUpdate() {
	_fastNow = Date.now()
	if (_fastNow - lastAccessTime > 5000) {
		clearInterval(fastNowTimer)
		fastNowTimer = null
	}
}

let fastNowTimer = null
function fastNowSchedule() {
	lastAccessTime = _fastNow
	if (fastNowTimer === null) {
		fastNowTimer = setInterval(fastNowUpdate, 1000)
	}
}

/** Precision - 1 second */
export function fastNow() {
	fastNowSchedule()
	return _fastNow
}

// endregion

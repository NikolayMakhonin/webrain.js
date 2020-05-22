import {afterAll} from '../../../main/common/test/Mocha'

let disableTimers = false
const oldSetTimeout = global.setTimeout
const oldSetInterval = global.setInterval

const timeouts = [];
(global as any).setTimeout = function(func, time) {
	if (disableTimers) {
		return
	}
	const id = oldSetTimeout.apply(null, arguments)
	if (time > 1000) {
		timeouts.push(id)
	}
	return id
}

const intervals = [];
(global as any).setInterval = function() {
	if (disableTimers) {
		return
	}
	const id = oldSetInterval.apply(null, arguments)
	intervals.push(id)
	return id
}

afterAll(() => {
	disableTimers = true
	for (let i = 0; i < timeouts.length; i++) {
		clearTimeout(timeouts[i])
	}
	for (let i = 0; i < intervals.length; i++) {
		clearInterval(intervals[i])
	}
})

/* tslint:disable:no-shadowed-variable */

export let now

if (typeof performance !== 'undefined' && performance.now) {
	now = performance.now.bind(performance)
} else {
	const start = process.hrtime()
	now = function now() {
		const end = process.hrtime(start)
		return end[0] * 1000 + end[1] / 1000000
	}
}

import {assert} from './Assert'
import {globalScope} from './helpers'

export const xit: (name, func: (this: {
	timeout(time: number),
}) => any) => void = globalScope.xit

export const xdescribe: (name, func: (this: {
	timeout(time: number),
}) => any) => void = globalScope.xdescribe

export function describe(name, func: (this: {
	timeout(time: number),
}) => any) {
	return globalScope.describe.call(this, name, function() {
		return func.call(this)
	})
}
Object.assign(describe, globalScope.describe)

function isFuncWithoutParameters(func) {
	return /^(async\s+)?(function)?\s*?\*?\s*?(\s+\w+)?\(\s*\)/s.test(func.toString())
}

export function it(name, func: (this: {
	timeout(time: number),
}) => any) {
	return globalScope.it.call(this, name, isFuncWithoutParameters(func)
		? function() {
			try {
				unScheduleAfterAll()

				const result = func.call(this)

				if (result && typeof result.then === 'function') {
					return result
						.then(o => {
							assert.assertNotHandledErrors()
							return o
						})
						.catch(err => {
							assert.assertNotHandledErrors()
							throw err
						})
				}

				assert.assertNotHandledErrors()
				return result
			} finally {
				scheduleAfterAll()
				assert.assertNotHandledErrors()
			}
		}
		: function(done) {
			try {
				unScheduleAfterAll()
				return func.call(this, err => {
					assert.assertNotHandledErrors()
					done(err)
				})
			} finally {
				scheduleAfterAll()
				assert.assertNotHandledErrors()
			}
		})
}
Object.assign(it, globalScope.it)

// region after all

let _afterAll = []
export function afterAll(func: () => void) {
	_afterAll.push(func)
}

function runAfterAll() {
	console.debug('Mocha runAfterAll()')
	const funcs = _afterAll
	_afterAll = null
	for (let i = 0; i < funcs.length; i++) {
		funcs[i]()
	}
}

let afterAllTimer
function scheduleAfterAll() {
	unScheduleAfterAll()
	afterAllTimer = setTimeout(runAfterAll, 1000)
}

function unScheduleAfterAll() {
	if (afterAllTimer != null) {
		clearTimeout(afterAllTimer)
		afterAllTimer = null
	}
}

// endregion

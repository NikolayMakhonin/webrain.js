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
				assert.assertNotHandledErrors()
			}
		}
		: function(done) {
			try {
				return func.call(this, err => {
					assert.assertNotHandledErrors()
					done(err)
				})
			} finally {
				assert.assertNotHandledErrors()
			}
		})
}
Object.assign(it, globalScope.it)

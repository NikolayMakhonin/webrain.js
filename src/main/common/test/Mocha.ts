import {assert} from './Assert'
import {globalScope} from './helpers'

export const { xit, xdescribe } = globalScope

export function describe(name, func) {
	return globalScope.describe.call(this, name, function() {
		return func.call(this)
	})
}
Object.assign(describe, globalScope.describe)

function isFuncWithoutParameters(func) {
	return /^(async\s+)?(function)?\s*?\*?\s*?(\s+\w+)?\(\s*\)/s.test(func.toString())
}

export function it(name, func) {
	return globalScope.it.call(this, name, isFuncWithoutParameters(func)
		? function() {
			const result = func.call(this)

			if (result && typeof result.then === 'function') {
				return result
					.then(o => {
						assert.assertNotHandledErrors()
						return o
					})
			}

			assert.assertNotHandledErrors()
			return result
		}
		: function(done) {
			return func.call(this, err => {
				assert.assertNotHandledErrors()
				done(err)
			})
		})
}
Object.assign(it, globalScope.it)

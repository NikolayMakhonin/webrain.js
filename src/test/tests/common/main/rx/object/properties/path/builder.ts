/* tslint:disable:no-duplicate-string */
import {VALUE_PROPERTY_DEFAULT} from '../../../../../../../../main/common/helpers/value-property'
import {getOrCreateCallState, invalidateCallState} from '../../../../../../../../main/common/rx/depend/core/CallState'
import {getCurrentState} from '../../../../../../../../main/common/rx/depend/core/current-state'
import {dependX} from '../../../../../../../../main/common/rx/depend/core/depend'
import {buildPropertyPath} from '../../../../../../../../main/common/rx/object/properties/path/builder'
import {IPropertyPath} from '../../../../../../../../main/common/rx/object/properties/path/constracts'
/* eslint-disable guard-for-in */
import {assert} from '../../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../../main/common/test/Mocha'
import {delay} from '../../../../../../../../main/common/time/helpers'

describe('common > main > rx > properties > builder', function() {
	it('base', async function() {
		let currentState = null
		function checkCurrentState() {
			assert.strictEqual(getCurrentState(), currentState)
		}

		const innerObject = {
			[VALUE_PROPERTY_DEFAULT]: 100,
			d: 1,
		}

		const object = {
			[VALUE_PROPERTY_DEFAULT]: 101,
			a: {
				get b() {
					checkCurrentState()
					return (async () => {
						checkCurrentState()
						await delay(0)
						assert.strictEqual(getCurrentState(), null)
						// checkCurrentState()
						return {
							get c() {
								checkCurrentState()
								return (function*() {
									checkCurrentState()
									yield delay(0)
									checkCurrentState()
									return innerObject
								})()
							},
						}
					})()
				},
			},
		}

		const paths: Array<IPropertyPath<typeof object, number>> = [
			buildPropertyPath({
				common: b => b(o => o.a, true)(o => o.b),
				get: b => b(o => o.c)(o => o.d, true),
				set: b => b(o => o.c)(null, (o, v) => { o.d = v }, true),
			}),
			buildPropertyPath({
				common: b => b(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, (o, v) => { o.d = v }, true),
			}),
			buildPropertyPath({
				get: b => b(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true),
				set: b => b(o => o.a, true)(o => o.b)(o => o.c)(null, (o, v) => { o.d = v }, true),
			}),
			buildPropertyPath<typeof object, number, number>(
				b => b(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, (o, v) => { o.d = v }, true),
			),
		]

		for (let i = 0, len = paths.length; i < len; i++) {
			const path = paths[i]
			const getValue = dependX(function() {
				assert.strictEqual(this, currentState)
				checkCurrentState()
				const val = path.get(object)
				checkCurrentState()
				return val
			})

			const callState = getOrCreateCallState(getValue)()

			checkCurrentState()

			currentState = callState
			let value = await getValue()
			currentState = null

			checkCurrentState()
			assert.strictEqual(value, 1)

			await path.set(object, 2)

			currentState = callState
			value = await getValue()
			currentState = null

			checkCurrentState()
			assert.strictEqual(value, 1)
			invalidateCallState(callState)

			currentState = callState
			const valueAsync = getValue()
			currentState = null
			
			checkCurrentState()
			
			currentState = callState
			value = await valueAsync
			currentState = null
			
			checkCurrentState()
			assert.strictEqual(value, 2)

			await path.set(object, 1)
			invalidateCallState(callState)

			currentState = callState
			value = await getValue()
			currentState = null

			assert.strictEqual(currentState, null)
			checkCurrentState()
			assert.strictEqual(value, 1)
		}

		checkCurrentState()
	})
})

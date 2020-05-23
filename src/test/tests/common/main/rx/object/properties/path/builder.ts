/* tslint:disable:no-duplicate-string new-parens */
import {ThenableIterator} from '../../../../../../../../main/common/async/async'
import {resolveAsync, ThenableSync} from '../../../../../../../../main/common/async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../../../../../../main/common/helpers/value-property'
import {getOrCreateCallState, invalidateCallState} from '../../../../../../../../main/common/rx/depend/core/CallState'
import {getCurrentState} from '../../../../../../../../main/common/rx/depend/core/current-state'
import {dependX} from '../../../../../../../../main/common/rx/depend/core/depend'
import {PathGetSet, pathGetSetBuild} from '../../../../../../../../main/common/rx/object/properties/path/builder'
/* eslint-disable guard-for-in */
import {assert} from '../../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../../main/common/test/Mocha'
import {delay} from '../../../../../../../../main/common/time/helpers'

describe('common > main > rx > properties > builder', function() {
	it('base', async function() {
		let currentState = null
		function checkCurrentState() {
			const _currentState = getCurrentState()
			if (_currentState !== currentState) {
				assert.strictEqual(_currentState, currentState)
			}
		}

		const innerObject = new class {
			public [VALUE_PROPERTY_DEFAULT] = 100
			public d = '1'
		}

		const object = new class {
			public [VALUE_PROPERTY_DEFAULT] = 101
			public a = {
				[VALUE_PROPERTY_DEFAULT]: 101,
				get b() {
					checkCurrentState()
					return resolveAsync(delay(0), () => {
						checkCurrentState()
						return delay(0)
					})
						.then(() => {
							checkCurrentState()
							return {
								get c() {
									checkCurrentState()
									const iterator: ThenableIterator<typeof innerObject> = (function*() {
										checkCurrentState()
										yield delay(0)
										checkCurrentState()
										return innerObject
									})()

									return iterator
								},
							}
						})
				},
			}
		}

		// const x: HasDefaultValueOf<typeof object> = null
		// const p1: TGetNextPath<typeof object, typeof object, typeof object.a> = null
		// const p2: TGetPropertyPath<typeof object, typeof object> = null
		// const p3: TGetPropertyValue<typeof object> = null
		// const d1 = p1(
		// 	b => b(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true)
		// )
		// const d2 = p2(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true)()
		// const d3 = p3(o => o.a, true)(o => o.b)(o => o.c)(o => o.d, true)()

		const paths: Array<PathGetSet<typeof object, string>> = [
			pathGetSetBuild(b => b.fv(o => o.a).f(o => o.b), {
				get: b => b.f(o => o.c).fv(o => o.d),
				set: b => b.f(o => o.c).fv(o => o.d, (o, v) => { o.d = v }),
			}),
			pathGetSetBuild(null, {
				get: b => b.fv(o => o.a).f(o => o.b).f(o => o.c).fv(o => o.d),
				set: b => b.fv(o => o.a).f(o => o.b).f(o => o.c).fv(o => o.d, (o, v) => { o.d = v }),
			}),
			pathGetSetBuild(
				b => b.fv(o => o.a).f(o => o.b).f(o => o.c).fv(o => o.d, (o, v) => { o.d = v }),
			),
		]

		for (let isDeferred = 0; isDeferred <= 1; isDeferred++) {
			for (let i = 0, len = paths.length; i < len; i++) {
				console.log('path: ' + i)

				const path = paths[i]
				const getValue = dependX(function() {
					assert.strictEqual(this, currentState, currentState.func + '')
					checkCurrentState()
					const val = path.get(object)
					checkCurrentState()
					return val
				}, isDeferred ? {
					delayBeforeCalc: 10,
				} : null)

				const callState = getOrCreateCallState(getValue)()

				checkCurrentState()

				currentState = callState
				let value = await getValue()
				currentState = null

				checkCurrentState()
				assert.strictEqual(value, '1')

				await path.set(object, '2')

				currentState = callState
				value = await getValue()
				currentState = null

				checkCurrentState()
				assert.strictEqual(value, '1')
				invalidateCallState(callState)

				currentState = callState
				const valueAsync = getValue()
				currentState = null

				checkCurrentState()

				currentState = callState
				value = await valueAsync
				currentState = null

				checkCurrentState()
				assert.strictEqual(value, '2')

				await path.set(object, '1')
				invalidateCallState(callState)

				currentState = callState
				value = await getValue()
				currentState = null

				assert.strictEqual(currentState, null)
				checkCurrentState()
				assert.strictEqual(value, '1')
			}
		}

		checkCurrentState()
	})
})

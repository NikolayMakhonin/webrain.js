/* tslint:disable:no-duplicate-string new-parens */
import {resolveAsync} from '../../../../../../../../main/common/async/ThenableSync'
import {VALUE_PROPERTY_DEFAULT} from '../../../../../../../../main/common/helpers/value-property'
import {
	ALWAYS_CHANGE_VALUE,
	getCallState,
	invalidateCallState,
} from '../../../../../../../../main/common/rx/depend/core/CallState'
import {depend} from '../../../../../../../../main/common/rx/depend/core/depend'
import {deepSubscriber} from '../../../../../../../../main/common/rx/object/properties/path/deepSubscriber'
/* eslint-disable guard-for-in */
import {assert} from '../../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../../main/common/test/Mocha'
import {delay} from '../../../../../../../../main/common/time/helpers'

describe('common > main > rx > properties > deepSubscribe', function() {
	it('base', async function() {
		let visits: string[] = []

		class InnerClass {
			public [VALUE_PROPERTY_DEFAULT]: string
			get d() {
				visits.push('d')
				return 'd'
			}
		}

		let value = 'value'
		const getValue = depend(function() {
			visits.push(value)
			return value
		}, null, null, true)

		Object.defineProperty(InnerClass.prototype, VALUE_PROPERTY_DEFAULT, {
			configurable: true,
			enumerable  : true,
			get: getValue,
		})

		const innerObject = new InnerClass()

		function invalidate() {
			invalidateCallState(getCallState(getValue).call(innerObject))
		}

		const object = new class {
			get [VALUE_PROPERTY_DEFAULT]() {
				visits.push('def')
				return 'def'
			}
			get a() {
				visits.push('a')
				return [{
					get [VALUE_PROPERTY_DEFAULT]() {
						visits.push('def')
						return 'def'
					},
					get b() {
						visits.push('b')
						return resolveAsync(delay(0), () => {
							return delay(0)
						})
							.then(() => {
								return new Set([{
									get c() {
										visits.push('c')
										const iterator = (function*() {
											yield delay(0)
											return new Map([['key', innerObject]])
										})()

										return iterator
									},
								}])
							})
					},
				}]
			}
		}

		let values = []

		assert.deepStrictEqual(visits, [])

		const unsubscribe = deepSubscriber({
			build: b => b
				.v('a')
				.collection()
				.p('b')
				.collection()
				.p('c')
				.any(
					b2 => b2.collection(),
					b2 => b2.mapAny(),
				),
			subscriber(state) {
				values.push(state.value)
			},
		})(object)

		await delay(10)
		await delay(10)
		await delay(10)

		assert.deepStrictEqual(visits, ['a', 'b', 'c', 'value'])
		assert.deepStrictEqual(values, [ALWAYS_CHANGE_VALUE])

		visits = []
		values = []

		invalidate()

		await delay(10)
		await delay(10)
		await delay(10)

		assert.deepStrictEqual(visits, ['value'])
		assert.deepStrictEqual(values, [])

		visits = []
		values = []

		value = 'value2'
		invalidate()

		await delay(10)
		await delay(10)
		await delay(10)

		assert.deepStrictEqual(visits, ['value2', 'a', 'b', 'c'])
		assert.deepStrictEqual(values, [ALWAYS_CHANGE_VALUE])

		visits = []
		values = []

		unsubscribe()
		value = 'value2'
		invalidate()

		await delay(10)
		await delay(10)
		await delay(10)

		assert.deepStrictEqual(visits, [])
		assert.deepStrictEqual(values, [])
	})
})

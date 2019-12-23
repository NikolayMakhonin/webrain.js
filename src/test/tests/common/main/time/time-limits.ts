import {isAsync} from '../../../../../main/common/async/async'
import {assert} from '../../../../../main/common/test/Assert'
import {describe, it, xdescribe, xit} from '../../../../../main/common/test/Mocha'
import { delay } from '../../../../../main/common/time/helpers'
import { TimeLimit } from '../../../../../main/common/time/TimeLimit'
import { TimeLimits } from '../../../../../main/common/time/TimeLimits'

xdescribe('time-limits', function() {
	it('TimeLimit: constructor', async function() {
		const timeLimit = new TimeLimit(5, 0.1)
		assert.strictEqual(timeLimit.count, 5)
		assert.strictEqual(timeLimit.time, 0.1)
		assert.strictEqual(typeof timeLimit.getWaitTime, 'function')
		assert.strictEqual(typeof timeLimit.wait, 'function')
		assert.strictEqual(typeof timeLimit.run, 'function')
	})

	const timeoutCoef = 7 * 2

	function addTimeLimits(result, prefix, timeLimit) {
		function add(key, timeLimits) {
			result[key] = timeLimits(key)
		}

		add(prefix + 'timeLimit', key => timeLimit(key))
		add(prefix + 'new TimeLimits(timeLimit)', key => new TimeLimits(timeLimit(key)))
		add(prefix + 'new TimeLimits(timeLimit, timeLimit)',
			key => new TimeLimits(timeLimit(key), timeLimit(key)))
		add(prefix + 'new TimeLimits(timeLimit, timeLimit, timeLimit)',
			key => new TimeLimits(timeLimit(key), timeLimit(key), timeLimit(key)))
		add(prefix + 'new TimeLimits(new TimeLimits(timeLimit))',
			key => new TimeLimits(new TimeLimits(timeLimit(key))))
		add(prefix + 'new TimeLimits(new TimeLimits(new TimeLimits(timeLimit)))',
			key => new TimeLimits(new TimeLimits(new TimeLimits(timeLimit(key)))))
		add(prefix + 'new TimeLimits(...<complex>...)', key => new TimeLimits(
			new TimeLimits(new TimeLimits(timeLimit(key))),
			new TimeLimits(new TimeLimits(timeLimit(key), timeLimit(key))),
			new TimeLimits(new TimeLimits(
					timeLimit(key),	timeLimit(key),
					new TimeLimits(
						new TimeLimits(timeLimit(key)),
						new TimeLimits(timeLimit(key), timeLimit(key)),
					),
				),
			),
		))
	}

	function generateTimeLimits(count, time) {
		const result = {}
		const equalTimeLimits = {}
		addTimeLimits(result, '(equal) ', key => {
			let timeLimit = equalTimeLimits[key]
			if (!timeLimit) {
				timeLimit = new TimeLimit(count, time)
				equalTimeLimits[key] = timeLimit
			}
			return timeLimit
		})
		addTimeLimits(result, '(diff) ', key => new TimeLimit(count, time))
		return result
	}

	async function timeLimitsIterator(count, time, iterate) {
		const timeLimits = generateTimeLimits(count, time)
		for (const name in timeLimits) {
			if (!timeLimits.hasOwnProperty(name)) {
				continue
			}

			// console.log('TimeLimits: ' + name)
			const timeLimit = timeLimits[name]

			try {
				await iterate(timeLimit)
			} catch (e) {
				console.log('Error in ' + name)
				throw e
			}
		}
	}

	it('TimeLimit: result', async function() {
		this.timeout(2000 * timeoutCoef)

		assert.strictEqual(new TimeLimits().run(() => '1'), '1')

		await timeLimitsIterator(3, 100, async timeLimit => {
			let result

			result = timeLimit.run(() => '1')
			assert.strictEqual(result, '1')

			result = await timeLimit.run(() => '2')
			assert.strictEqual(result, '2')

			result = await timeLimit.run(async () => '3')
			assert.strictEqual(result, '3')

			result = timeLimit.run(() => '4')
			assert.ok(isAsync(result), result + '')
			result = await result
			assert.strictEqual(result, '4')
		})
	})

	it('TimeLimit: countActive', async function() {
		this.timeout(30000 * timeoutCoef)

		await timeLimitsIterator(3, 10, async timeLimit => {
			let countActive = 0
			const func = async () => {
				// assert.ok(countActive < 3)
				// console.log('countActive = ' + countActive)
				countActive++
				await delay(10)
				countActive--
				return true
			}

			assert.strictEqual(countActive, 0)

			const tasks = []
			for (let i = 0; i < 100; i++) {
				tasks.push(timeLimit.run(func))
			}

			await Promise.all(tasks)

			if (countActive) {
				console.log(JSON.stringify(timeLimit.debug), tasks)
			}

			assert.strictEqual(countActive, 0)
		})
	})

	it('TimeLimit', async function() {
		this.timeout(30000 * timeoutCoef)

		await timeLimitsIterator(5, 100, async timeLimit => {
			let callCount = 0
			const func = () => {
				return callCount++
			}

			const EPSILON = 20

			let nextTestNumber = 0
			const test = async (checkTimeFrom, checkTimeTo) => {
				const testNumber = nextTestNumber++

				const t0 = new Date().getTime()

				const result = await timeLimit.run(func)
				assert.ok(typeof result === 'number')

				const t1 = new Date().getTime()

				if (checkTimeFrom != null) {
					assert.ok(t1 - t0 >= checkTimeFrom - EPSILON, `${testNumber}: t1 - t0 (${t1 - t0}) < ${checkTimeFrom}\n${JSON.stringify(timeLimit.debug, null, 4)}`)
				}

				if (checkTimeTo != null) {
					if (t1 - t0 > checkTimeTo + EPSILON) {
						const error = new Error(`${testNumber}: t1 - t0 (${t1 - t0}) > ${checkTimeTo}\n${JSON.stringify(timeLimit.debug, null, 4)}`);
						(error as any).type = 'BigDelay'
						throw error
					}
					assert.ok(t1 - t0 <= checkTimeTo + EPSILON, `${testNumber}: t1 - t0 (${t1 - t0}) > ${checkTimeTo}\n${JSON.stringify(timeLimit.debug, null, 4)}`)
				}

				// console.log(`${testNumber}: ${JSON.stringify(timeLimit.debug, null ,4)}`)
			}

			let bigDelayMaxCount = 0

			for (let i = 2; i--;) {
				nextTestNumber = 0
				try {
					await test(null, 2)
					await test(null, 2)
					await test(null, 2)
					await test(null, 2)
					await test(null, 2)

					// console.log(JSON.stringify(JSON.stringify(timeLimit.debug), null, 4))

					assert.strictEqual(callCount, 5) // , `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)
					callCount = 0

					await Promise.all([
						test(100, 300),
					])

					assert.strictEqual(callCount, 1, `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)
					callCount = 0
					await delay(EPSILON)

					await test(null, 2)
					await test(null, 2)
					await test(null, 2)
					await test(null, 2)

					assert.strictEqual(callCount, 4, `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)
					callCount = 0

					await delay(300)
					// console.log(JSON.stringify(JSON.stringify(timeLimit.debug), null, 4))

					await test(null, 2)
					await test(null, 2)
					await test(null, 2)
					await test(null, 2)
					await test(null, 2)

					assert.strictEqual(callCount, 5, `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)
					callCount = 0

					await test(100, 300)

					assert.strictEqual(callCount, 1, `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)
					callCount = 0

					await delay(300)

					assert.strictEqual(callCount, 0, `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)
				} catch (e) {
					if (bigDelayMaxCount-- <= 0 || e.type !== 'BigDelay') {
						throw e
					}
					console.log(e.type, e.message)
				}
			}
		})
	})
})

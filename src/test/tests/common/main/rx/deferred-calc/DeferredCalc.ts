/* tslint:disable:no-empty no-identical-functions */
import {DeferredCalc} from '../../../../../../main/common/rx/deferred-calc/DeferredCalc'
import {timingDefault} from '../../../../../../main/common/rx/deferred-calc/timing'
import {assert} from '../../../../../../main/common/test/Assert'
import {assertEvents, EventType, IEvent, TestDeferredCalc, timing} from './src/TestDeferred'
import {TestTiming} from './src/timing'

declare const after

describe('common > main > rx > deferred-calc > DeferredCalc', function() {
	this.timeout(20000)

	const testDeferredCalc = TestDeferredCalc.test

	after(function() {
		console.log('Total DeferredCalc tests >= ' + TestDeferredCalc.totalTests)
	})

	it('base', function() {
		testDeferredCalc({
			calcTime: [0, 1, 10],
			throttleTime: [null, 0],
			maxThrottleTime: [null, 0, 1, 10],
			minTimeBetweenCalc: [null, 0, 1, 10],
			autoInvalidateInterval: [null, 0, 1, 10],
			expected: {
				events: [
					{
						time: 0,
						type: EventType.CanBeCalc,
					},
				],
			},
			actions: [
				deferredCalc => {
				},
				deferredCalc => timing.addTime(0),
				deferredCalc => timing.addTime(1),
				deferredCalc => timing.addTime(10),
				deferredCalc => timing.addTime(100),
				deferredCalc => {
					deferredCalc.invalidate()
					timing.addTime(100)
					deferredCalc.invalidate()
					timing.addTime(100)
				},
			],
		})
	})

	it('throttleTime', function() {
		testDeferredCalc({
			calcTime: [0],
			throttleTime: [null, 0],
			maxThrottleTime: [null, 0, 1, 10],
			minTimeBetweenCalc: [null, 0, 1, 10],
			autoInvalidateInterval: [null],
			expected: {
				events: [
					{
						time: 0,
						type: EventType.CanBeCalc,
					},
					{
						time: 0,
						type: EventType.Calc,
					},
					{
						time: 0,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					deferredCalc.calc()
				},
				deferredCalc => {
					deferredCalc.calc()
					timing.addTime(0)
				},
			],
		})

		testDeferredCalc({
			calcTime: [5],
			throttleTime: [10],
			maxThrottleTime: [null, 100],
			minTimeBetweenCalc: [null, 0, 1, 5],
			autoInvalidateInterval: [null],
			expected: {
				events: [
					{
						time: 28,
						type: EventType.CanBeCalc,
					},
					{
						time: 30,
						type: EventType.Calc,
					},
					{
						time: 35,
						type: EventType.Completed,
					},
					{
						time: 49,
						type: EventType.Calc,
					},
					{
						time: 54,
						type: EventType.Completed,
					},
					{
						time: 63,
						type: EventType.CanBeCalc,
					},
					{
						time: 64,
						type: EventType.Calc,
					},
					{
						time: 69,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					deferredCalc.invalidate()
					timing.addTime(0)
					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(9)
					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(9)
					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(12) // 30

					deferredCalc.calc()
					timing.addTime(0)

					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(9)
					deferredCalc.invalidate()
					deferredCalc.calc()
					timing.addTime(0)
					timing.addTime(10)

					timing.addTime(4)

					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(11)

					deferredCalc.calc()
					timing.addTime(9)
				},
			],
		})
	})

	it('maxThrottleTime', function() {
		testDeferredCalc({
			calcTime: [0],
			throttleTime: [10],
			maxThrottleTime: [0],
			minTimeBetweenCalc: [null, 0, 1, 10],
			autoInvalidateInterval: [null],
			expected: {
				events: [
					{
						time: 0,
						type: EventType.CanBeCalc,
					},
					{
						time: 0,
						type: EventType.Calc,
					},
					{
						time: 0,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					deferredCalc.calc()
				},
				deferredCalc => {
					deferredCalc.calc()
					timing.addTime(0)
				},
			],
		})

		testDeferredCalc({
			calcTime: [5],
			throttleTime: [5],
			maxThrottleTime: [10],
			minTimeBetweenCalc: [null, 0, 1, 5],
			autoInvalidateInterval: [null],
			expected: {
				events: [
					{
						time: 10,
						type: EventType.CanBeCalc,
					},
					{
						time: 12,
						type: EventType.Calc,
					},
					{
						time: 17,
						type: EventType.Completed,
					},
					{
						time: 22,
						type: EventType.Calc,
					},
					{
						time: 27,
						type: EventType.Completed,
					},
					{
						time: 32,
						type: EventType.CanBeCalc,
					},
					{
						time: 32,
						type: EventType.Calc,
					},
					{
						time: 37,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					deferredCalc.invalidate()
					timing.addTime(4)
					deferredCalc.invalidate()
					timing.addTime(4)
					deferredCalc.invalidate()
					timing.addTime(4) // 12

					deferredCalc.calc()

					deferredCalc.invalidate()
					timing.addTime(4)
					deferredCalc.invalidate()
					timing.addTime(4)
					deferredCalc.invalidate()
					timing.addTime(1)
					deferredCalc.calc()
					timing.addTime(1)

					deferredCalc.invalidate()
					timing.addTime(4)
					deferredCalc.invalidate()
					timing.addTime(4)
					deferredCalc.invalidate()
					timing.addTime(2)
					deferredCalc.calc()
					timing.addTime(5)
				},
			],
		})
	})

	it('minTimeBetweenCalc', function() {
		testDeferredCalc({
			calcTime: [0],
			throttleTime: [0],
			maxThrottleTime: [0],
			minTimeBetweenCalc: [5],
			autoInvalidateInterval: [null],
			expected: {
				events: [
					{
						time: 0,
						type: EventType.CanBeCalc,
					},
					{
						time: 0,
						type: EventType.Calc,
					},
					{
						time: 0,
						type: EventType.Completed,
					},
					{
						time: 5,
						type: EventType.Calc,
					},
					{
						time: 5,
						type: EventType.Completed,
					},
					{
						time: 14,
						type: EventType.Calc,
					},
					{
						time: 14,
						type: EventType.Completed,
					},
					{
						time: 19,
						type: EventType.Calc,
					},
					{
						time: 19,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					deferredCalc.calc()
					timing.addTime(3)
					deferredCalc.calc()
					timing.addTime(1)
					deferredCalc.calc()
					timing.addTime(10)
					deferredCalc.calc()
					deferredCalc.calc()
					timing.addTime(5)
				},
			],
		})
	})

	it('autoInvalidateInterval', function() {
		testDeferredCalc({
			calcTime: [5],
			throttleTime: [0],
			maxThrottleTime: [0],
			minTimeBetweenCalc: [20],
			autoInvalidateInterval: [15],
			autoCalc: [true],
			expected: {
				events: [
					{
						time: 0,
						type: EventType.CanBeCalc,
					},
					{
						time: 0,
						type: EventType.Calc,
					},
					{
						time: 5,
						type: EventType.Completed,
					},

					{
						time: 25,
						type: EventType.CanBeCalc,
					},
					{
						time: 25,
						type: EventType.Calc,
					},
					{
						time: 30,
						type: EventType.Completed,
					},

					{
						time: 50,
						type: EventType.CanBeCalc,
					},
					{
						time: 50,
						type: EventType.Calc,
					},
					{
						time: 55,
						type: EventType.Completed,
					},

					{
						time: 75,
						type: EventType.CanBeCalc,
					},
					{
						time: 75,
						type: EventType.Calc,
					},
					{
						time: 80,
						type: EventType.Completed,
					},

					{
						time: 100,
						type: EventType.CanBeCalc,
					},
					{
						time: 100,
						type: EventType.Calc,
					},
					{
						time: 105,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					timing.addTime(100)
					deferredCalc.autoInvalidateInterval = null
					timing.addTime(5)
				},
			],
		})

		testDeferredCalc({
			calcTime: [10],
			throttleTime: [0],
			maxThrottleTime: [0],
			minTimeBetweenCalc: [20],
			autoInvalidateInterval: [5],
			autoCalc: [true],
			expected: {
				events: [
					{
						time: 0,
						type: EventType.CanBeCalc,
					},
					{
						time: 0,
						type: EventType.Calc,
					},
					{
						time: 10,
						type: EventType.Completed,
					},

					{
						time: 30,
						type: EventType.CanBeCalc,
					},
					{
						time: 30,
						type: EventType.Calc,
					},
					{
						time: 40,
						type: EventType.Completed,
					},

					{
						time: 60,
						type: EventType.CanBeCalc,
					},
					{
						time: 60,
						type: EventType.Calc,
					},
					{
						time: 70,
						type: EventType.Completed,
					},

					{
						time: 90,
						type: EventType.CanBeCalc,
					},
					{
						time: 90,
						type: EventType.Calc,
					},
					{
						time: 100,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					timing.addTime(90)
					deferredCalc.autoInvalidateInterval = null
					timing.addTime(10)
				},
			],
		})
	})

	it('real timing', async function() {
		let events: IEvent[] = []
		const startTestTime = timingDefault.now()

		const deferredCalc = new DeferredCalc({
			autoInvalidateInterval: 9,
			throttleTime: 10,
			maxThrottleTime: 100,
			minTimeBetweenCalc: 5,
			canBeCalcCallback() {
				events.push({
					time: timingDefault.now() - startTestTime,
					type: EventType.CanBeCalc,
				})
				this.calc()
			},
			calcFunc(done) {
				events.push({
					time: timingDefault.now() - startTestTime,
					type: EventType.Calc,
				})
				done()
			},
			calcCompletedCallback() {
				events.push({
					time: timingDefault.now() - startTestTime,
					type: EventType.Completed,
				})
			},
		})

		await new Promise(resolve => setTimeout(resolve, 100))
		deferredCalc.autoInvalidateInterval = null
		await new Promise(resolve => setTimeout(resolve, 10))

		for (let i = 0; i < events.length; i++) {
			assert.ok(events[i].time >= 100)
			assert.ok(events[i].time < 150)
		}

		assertEvents(events.map(o => ({ type: o.type })), [
			{ type: EventType.CanBeCalc },
			{ type: EventType.Calc },
			{ type: EventType.Completed },
		])
		events = []

		await new Promise(resolve => setTimeout(resolve, 100))

		assert.deepStrictEqual(events, [])
	})

	it('properties', async function() {
		const canBeCalcCallback = () => {}
		const calcFunc = () => {}
		const calcCompletedCallback = () => {}

		const deferredCalc = new DeferredCalc({
			autoInvalidateInterval: 1,
			throttleTime: 2,
			maxThrottleTime: 3,
			minTimeBetweenCalc: 4,
			canBeCalcCallback: () => {},
			calcFunc: () => {},
			calcCompletedCallback: () => {},
			timing: new TestTiming(),
		})

		assert.strictEqual(deferredCalc.autoInvalidateInterval, 1)
		assert.strictEqual(deferredCalc.throttleTime, 2)
		assert.strictEqual(deferredCalc.maxThrottleTime, 3)
		assert.strictEqual(deferredCalc.minTimeBetweenCalc, 4)

		deferredCalc.autoInvalidateInterval = 11
		deferredCalc.throttleTime = 12
		deferredCalc.maxThrottleTime = 13
		deferredCalc.minTimeBetweenCalc = 14

		assert.strictEqual(deferredCalc.autoInvalidateInterval, 11)
		assert.strictEqual(deferredCalc.throttleTime, 12)
		assert.strictEqual(deferredCalc.maxThrottleTime, 13)
		assert.strictEqual(deferredCalc.minTimeBetweenCalc, 14)
	})
})

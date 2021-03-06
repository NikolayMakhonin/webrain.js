/* tslint:disable:no-empty no-identical-functions */
import {DeferredCalc} from '../../../../../../main/common/rx/deferred-calc/DeferredCalc'
import {timingDefault} from '../../../../../../main/common/rx/deferred-calc/timing'
import {assert} from '../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../main/common/test/Mocha'
import {assertEvents, EventType, IEvent, TestDeferredCalc, TestTimingForDeferredCalc, timing} from './src/TestDeferred'

declare const after

describe('common > main > rx > deferred-calc > DeferredCalc', function () {
	this.timeout(20000)

	const testDeferredCalc = TestDeferredCalc.test

	after(function () {
		console.log('Total DeferredCalc tests >= ' + TestDeferredCalc.totalTests)
	})

	it('init', function () {
		testDeferredCalc({
			calcTime              : [0, 1, 10],
			throttleTime          : [null, 0],
			maxThrottleTime       : [null, 0, 1, 10],
			minTimeBetweenCalc    : [null, 0, 1, 10],
			autoInvalidateInterval: [null, 0, 1, 10],
			expected              : {
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

	it('calc only after invalidate', function () {
		testDeferredCalc({
			calcTime              : [5],
			throttleTime          : [null, 0],
			maxThrottleTime       : [null, 0, 10],
			minTimeBetweenCalc    : [null, 0],
			autoInvalidateInterval: [null],
			expected              : {
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
						time: 15,
						type: EventType.CanBeCalc,
					},
					{
						time: 15,
						type: EventType.Calc,
					},
					{
						time: 20,
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
						time: 30,
						type: EventType.CanBeCalc,
					},

					{
						time: 35,
						type: EventType.Calc,
					},
					{
						time: 40,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					deferredCalc.calc()
					deferredCalc.calc()
					deferredCalc.calc()
					timing.addTime(5)
					deferredCalc.calc()
					deferredCalc.calc()
					timing.addTime(5)
					deferredCalc.calc()
					timing.addTime(5) // 15

					deferredCalc.invalidate()
					deferredCalc.calc()
					deferredCalc.calc()
					timing.addTime(5)
					deferredCalc.calc()
					deferredCalc.calc()
					timing.addTime(5)

					deferredCalc.invalidate()
					deferredCalc.calc()
					deferredCalc.invalidate()
					deferredCalc.calc()
					timing.addTime(4)
					deferredCalc.calc()
					timing.addTime(1)
					timing.addTime(5)

					deferredCalc.calc()
					timing.addTime(5)
				},
			],
		})
	})

	it('throttleTime', function () {
		testDeferredCalc({
			calcTime              : [0],
			throttleTime          : [null, 0],
			maxThrottleTime       : [null, 0, 1, 10],
			minTimeBetweenCalc    : [null, 0, 1, 10],
			autoInvalidateInterval: [null],
			expected              : {
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
			calcTime              : [5],
			throttleTime          : [10],
			maxThrottleTime       : [null, 100],
			minTimeBetweenCalc    : [null, 0, 1, 5],
			autoInvalidateInterval: [null],
			expected              : {
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
					timing.addTime(9) // 18
					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(12) // 30

					deferredCalc.calc()
					timing.addTime(0)

					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(9) // 39
					deferredCalc.invalidate()
					deferredCalc.reCalc()
					timing.addTime(0)
					timing.addTime(10) // 49

					timing.addTime(4) // 53

					deferredCalc.invalidate()
					timing.addTime(0)
					timing.addTime(11) // 64

					deferredCalc.calc()
					timing.addTime(9)
				},
			],
		})
	})

	it('maxThrottleTime', function () {
		testDeferredCalc({
			calcTime              : [0],
			throttleTime          : [10],
			maxThrottleTime       : [0],
			minTimeBetweenCalc    : [null, 0, 1, 10],
			autoInvalidateInterval: [null],
			expected              : {
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
			calcTime              : [5],
			throttleTime          : [5],
			maxThrottleTime       : [10],
			minTimeBetweenCalc    : [null, 0, 1, 5],
			autoInvalidateInterval: [null],
			expected              : {
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
					timing.addTime(4) // 16
					deferredCalc.invalidate()
					timing.addTime(4) // 20
					deferredCalc.invalidate()
					timing.addTime(1) // 21
					deferredCalc.reCalc()
					timing.addTime(1) // 22

					deferredCalc.invalidate()
					timing.addTime(4) // 26
					deferredCalc.invalidate()
					timing.addTime(4) // 30
					deferredCalc.invalidate()
					timing.addTime(2) // 32
					deferredCalc.calc()
					timing.addTime(5)
				},
			],
		})
	})

	it('minTimeBetweenCalc', function () {
		testDeferredCalc({
			calcTime              : [0],
			throttleTime          : [0],
			maxThrottleTime       : [0],
			minTimeBetweenCalc    : [5],
			autoInvalidateInterval: [null],
			expected              : {
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
						type: EventType.CanBeCalc,
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
					deferredCalc.invalidate()
					timing.addTime(1)
					deferredCalc.calc()
					timing.addTime(10)
					deferredCalc.reCalc()
					deferredCalc.reCalc()
					timing.addTime(5)
				},
			],
		})
	})

	it('autoInvalidateInterval', function () {
		testDeferredCalc({
			calcTime              : [5],
			throttleTime          : [10],
			maxThrottleTime       : [20],
			minTimeBetweenCalc    : [40],
			autoInvalidateInterval: [100],
			autoCalc              : [true],
			expected              : {
				events: [
					{
						time: 10,
						type: EventType.CanBeCalc,
					},
					{
						time: 10,
						type: EventType.Calc,
					},
					{
						time: 15,
						type: EventType.Completed,
					},

					{
						time: 120,
						type: EventType.CanBeCalc,
					},
					{
						time: 120,
						type: EventType.Calc,
					},
					{
						time: 125,
						type: EventType.Completed,
					},

					{
						time: 230,
						type: EventType.CanBeCalc,
					},
					{
						time: 230,
						type: EventType.Calc,
					},
					{
						time: 235,
						type: EventType.Completed,
					},

					{
						time: 275,
						type: EventType.CanBeCalc,
					},
					{
						time: 275,
						type: EventType.Calc,
					},
					{
						time: 280,
						type: EventType.Completed,
					},

					{
						time: 385,
						type: EventType.CanBeCalc,
					},
					{
						time: 385,
						type: EventType.Calc,
					},
					{
						time: 390,
						type: EventType.Completed,
					},

					{
						time: 495,
						type: EventType.CanBeCalc,
					},
					{
						time: 495,
						type: EventType.Calc,
					},
					{
						time: 500,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					timing.addTime(250)
					deferredCalc.invalidate()
					timing.addTime(250)
					deferredCalc.autoInvalidateInterval = null
				},
			],
		})

		testDeferredCalc({
			calcTime              : [5],
			throttleTime          : [0],
			maxThrottleTime       : [0],
			minTimeBetweenCalc    : [20],
			autoInvalidateInterval: [15],
			autoCalc              : [true],
			expected              : {
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
			calcTime              : [10],
			throttleTime          : [0],
			maxThrottleTime       : [0],
			minTimeBetweenCalc    : [20],
			autoInvalidateInterval: [5],
			autoCalc              : [true],
			expected              : {
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

	async function realTiming() {
		let events: IEvent[] = []
		const timeCoef = 4
		const startTestTime = timingDefault.now()

		const deferredCalc = new DeferredCalc({
			canBeCalcCallback() {
				events.push({
					time: timingDefault.now() - startTestTime,
					type: EventType.CanBeCalc,
				})
				this.calc()
			},
			calcFunc() {
				events.push({
					time: timingDefault.now() - startTestTime,
					type: EventType.Calc,
				})
				this.done()
			},
			calcCompletedCallback() {
				events.push({
					time: timingDefault.now() - startTestTime,
					type: EventType.Completed,
				})
			},
			options: {
				autoInvalidateInterval: 9 * timeCoef,
				throttleTime          : 10 * timeCoef,
				maxThrottleTime       : 100 * timeCoef,
				minTimeBetweenCalc    : 5 * timeCoef,
			},
		})

		await new Promise(resolve => setTimeout(resolve, 100 * timeCoef))
		deferredCalc.autoInvalidateInterval = null
		await new Promise(resolve => setTimeout(resolve, 20 * timeCoef))

		assert.strictEqual(events.length % 3, 0)
		assert.ok(events.length / 3 > 2)

		const checkEventTypes = [
			EventType.CanBeCalc,
			EventType.Calc,
			EventType.Completed,
		]

		for (let i = 0; i < events.length; i++) {
			const event = events[i]
			assert.ok(event.time < (100 + 20) * timeCoef, event.time + '')
			assert.strictEqual(event.type, checkEventTypes[i % 3])
		}

		events = []

		await new Promise(resolve => setTimeout(resolve, (100 + 20) * timeCoef))

		assert.deepStrictEqual(events, [])
	}

	it('real timing', async function () {
		// this.timeout(600000)
		for (let i = 0; i < 1; i++) {
			await realTiming()
		}
	})

	it('properties', async function () {
		const canBeCalcCallback = () => {}
		const calcFunc = () => {}
		const calcCompletedCallback = () => {}

		const deferredCalc = new DeferredCalc({
			canBeCalcCallback() {},
			calcFunc() {},
			calcCompletedCallback() {},
			options: {
				autoInvalidateInterval: 1,
				throttleTime          : 2,
				maxThrottleTime       : 3,
				minTimeBetweenCalc    : 4,
				timing                : new TestTimingForDeferredCalc(),
			},
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

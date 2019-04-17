/* tslint:disable:no-empty */
import {EventType, TestDeferredCalc, timing} from './src/TestDeferred'

declare const assert
declare const after

describe('common > main > rx > deferred-calc > DeferredCalc', function() {
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
				deferredCalc => {},
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
						type: EventType.Calc,
					},
					{
						time: 25,
						type: EventType.Completed,
					},
				],
			},
			actions: [
				deferredCalc => {
					timing.addTime(100)
					deferredCalc.autoInvalidateInterval = null
				},
			],
		})
	})
})

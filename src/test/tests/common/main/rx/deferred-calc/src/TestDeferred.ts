import {
	IPropertyChanged,
	IPropertyChangedEvent,
} from '../../../../../../../main/common/lists/contracts/IPropertyChanged'
import {DeferredCalc} from '../../../../../../../main/common/rx/deferred-calc/DeferredCalc'
import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants, THIS} from '../../../helpers/TestVariants'
import {TestTiming} from './timing'

declare const assert

export type IDeferredCalcAction = (set: DeferredCalc) => any

export enum EventType {
	CanBeCalc,
	Calc,
	Completed,
}

export interface IEvent {
	time: number
	type: EventType
}

interface IDeferredCalcOptionsVariant {
	calcTime?: number,
	minTimeBetweenCalc?: number,
	throttleTime?: number,
	maxThrottleTime?: number,
	autoInvalidateInterval?: number,
	reuseSetInstance?: boolean
}

interface IDeferredCalcExpected {
	/**
	 * canBeCalc, calc, completed
	 */
	events?: IEvent[]
	error?: new () => Error,
	returnValue?: any,
	propertyChanged?: IPropertyChangedEvent[],
}

interface IDeferredCalcOptionsVariants extends IOptionsVariants {
	calcTime?: number[],
	minTimeBetweenCalc?: number[],
	throttleTime?: number[],
	maxThrottleTime?: number[],
	autoInvalidateInterval?: number[],
	reuseSetInstance?: boolean[]
}

export const timing = new TestTiming()
let staticCalcTime
let testStartTime
let staticEvents: IEvent[] = []
const staticDeferredCalc = new DeferredCalc({
	timing,
	canBeCalcCallback: () => {
		staticEvents.push({
			time: timing.now() - testStartTime,
			type: EventType.CanBeCalc,
		})
	},
	calcFunc: done => {
		staticEvents.push({
			time: timing.now() - testStartTime,
			type: EventType.Calc,
		})
		if (!staticCalcTime) {
			done()
		} else {
			timing.setTimeout(done, staticCalcTime)
		}
	},
	calcCompletedCallback: () => {
		staticEvents.push({
			time: timing.now() - testStartTime,
			type: EventType.Completed,
		})
	},
})

function eventsToDisplay(events: IEvent[]): IEvent[] {
	return events.map(event => {
		return {
			...event,
			type: EventType[event.type] as any
		}
	})
}

function assertEvents(events: IEvent[], excepted: IEvent[]) {
	events = eventsToDisplay(events)
	excepted = eventsToDisplay(excepted)
	assert.deepStrictEqual(events, excepted)
}

export class TestDeferredCalc extends TestVariants<
	IDeferredCalcAction,
	IDeferredCalcExpected,
	IDeferredCalcOptionsVariant,
	IDeferredCalcOptionsVariants
> {
	private constructor() {
		super()
	}

	public static totalTests: number = 0

	protected baseOptionsVariants: IDeferredCalcOptionsVariants = {
		calcTime: [0],
		throttleTime: [null],
		maxThrottleTime: [null],
		minTimeBetweenCalc: [null],
		autoInvalidateInterval: [null],
		reuseSetInstance: [false, true],
	}

	protected testVariant(
		options: IDeferredCalcOptionsVariant & IOptionsVariant<IDeferredCalcAction, IDeferredCalcExpected>,
	) {
		let error
		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
			let unsubscribePropertyChanged
			try {
				let expectedEvents: IEvent[] = options.expected.events.slice()
				let events: IEvent[]
				let deferredCalc: DeferredCalc

				if (options.reuseSetInstance) {
					staticCalcTime = 0
					staticDeferredCalc.minTimeBetweenCalc = null
					staticDeferredCalc.throttleTime = null
					staticDeferredCalc.maxThrottleTime = null
					staticDeferredCalc.autoInvalidateInterval = null
					staticDeferredCalc.calc()
					timing.addTime(100)
					testStartTime = timing.now()

					events = staticEvents = []
					deferredCalc = staticDeferredCalc
					staticCalcTime = options.calcTime
					staticDeferredCalc.minTimeBetweenCalc = options.minTimeBetweenCalc
					staticDeferredCalc.throttleTime = options.throttleTime
					staticDeferredCalc.maxThrottleTime = options.maxThrottleTime
					staticDeferredCalc.autoInvalidateInterval = options.autoInvalidateInterval
					staticDeferredCalc.invalidate()
				} else {
					testStartTime = timing.now()
					events = []
					const calcTime = options.calcTime
					deferredCalc = new DeferredCalc({
						timing,
						canBeCalcCallback: () => {
							events.push({
								time: timing.now() - testStartTime,
								type: EventType.CanBeCalc,
							})
						},
						calcFunc: done => {
							events.push({
								time: timing.now() - testStartTime,
								type: EventType.Calc,
							})
							if (!calcTime) {
								done()
							} else {
								timing.setTimeout(done, calcTime)
							}
						},
						calcCompletedCallback: () => {
							events.push({
								time: timing.now() - testStartTime,
								type: EventType.Completed,
							})
						},
						minTimeBetweenCalc: options.minTimeBetweenCalc,
						throttleTime: options.throttleTime,
						maxThrottleTime: options.maxThrottleTime,
						autoInvalidateInterval: options.autoInvalidateInterval,
					})
				}

				assertEvents(events, [{
					time: 0,
					type: EventType.CanBeCalc,
				}])

				events.splice(0, events.length)

				const propertyChangedEvents = []
				if ((deferredCalc as unknown as IPropertyChanged).propertyChanged) {
					unsubscribePropertyChanged = (deferredCalc as unknown as IPropertyChanged).propertyChanged.subscribe(event => {
						propertyChangedEvents.push(event)
					})
				}

				if (options.expected.error) {
					assert.throws(() => options.action(deferredCalc), options.expected.error)
				} else {
					assert.deepStrictEqual(options.action(deferredCalc), options.expected.returnValue === THIS
						? deferredCalc
						: options.expected.returnValue)
				}

				assertEvents(events, expectedEvents)
				events.splice(0, events.length)

				timing.addTime(Math.max(
					options.throttleTime || 0,
					options.maxThrottleTime || 0,
					options.minTimeBetweenCalc || 0,
					options.autoInvalidateInterval || 0,
				) + options.calcTime + 1)

				assertEvents(events, [])

				if (unsubscribePropertyChanged) {
					unsubscribePropertyChanged()
				}

				assert.deepStrictEqual(propertyChangedEvents, options.expected.propertyChanged || [])

				break
			} catch (ex) {
				if (!debugIteration) {
					console.log(`Error in: ${
						options.description
						}\n${
						JSON.stringify(options, null, 4)
						}\n${options.action.toString()}\n${ex.stack}`)
					error = ex
				}
			} finally {
				if (unsubscribePropertyChanged) {
					unsubscribePropertyChanged()
				}
				TestDeferredCalc.totalTests++
			}
		}

		if (error) {
			throw error
		}
	}

	private static readonly _instance: TestDeferredCalc = new TestDeferredCalc()

	public static test(testCases: ITestCase<IDeferredCalcAction, IDeferredCalcExpected> & IDeferredCalcOptionsVariants) {
		TestDeferredCalc._instance.test(testCases)
	}
}

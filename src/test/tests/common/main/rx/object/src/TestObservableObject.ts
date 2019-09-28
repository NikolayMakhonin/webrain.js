// import {
// 	IPropertyChanged,
// 	IPropertyChangedEvent,
// } from '../../../../../../../main/common/lists/contracts/IPropertyChanged'
// import {ObservableClass} from '../../../../../../../main/common/rx/object/ObservableClass'
// import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
// import {IOptionsVariant, IOptionsVariants, ITestCase, TestVariants, THIS} from '../../../helpers/TestVariants'
//
// export type IObservableObjectAction = (set: ObservableClass) => any
//
// export enum PropertyType {
// 	None,
// 	Simple,
// 	Writable,
// 	Readable,
// }
//
// export enum ValueType {
// 	Undefined,
// 	Null,
// 	Value,
// }
//
// interface IObservableObjectOptionsVariant {
// 	basePrototype1?: PropertyType[],
// 	basePrototype2?: PropertyType[],
// 	prototype1?: PropertyType[],
// 	prototype2?: PropertyType[],
// 	baseInstance1?: PropertyType[],
// 	baseInstance2?: PropertyType[],
// 	instance1?: PropertyType[],
// 	instance2?: PropertyType[],
//
// 	basePrototypeValue1?: ValueType[],
// 	basePrototypeValue2?: ValueType[],
// 	prototypeValue1?: ValueType[],
// 	prototypeValue2?: ValueType[],
// 	baseInstanceValue1?: ValueType[],
// 	baseInstanceValue2?: ValueType[],
// 	instanceValue1?: ValueType[],
// 	instanceValue2?: ValueType[],
// }
//
// interface IObservableObjectExpected {
// 	error?: new () => Error,
// 	returnValue?: any,
// 	propertyChanged?: IPropertyChangedEvent[],
// }
//
// interface IObservableObjectOptionsVariants extends IOptionsVariants {
// 	calcTime?: number[],
// 	minTimeBetweenCalc?: number[],
// 	throttleTime?: number[],
// 	maxThrottleTime?: number[],
// 	autoInvalidateInterval?: number[],
// 	reuseSetInstance?: boolean[]
// 	autoCalc?: boolean[]
// }
//
// export interface IClass {
// 	builder: ObservableObjectBuilder
// 	proto: IClass
// }
//
// export class BaseClass1 extends ObservableClass implements IClass {
// 	public builder = new ObservableObjectBuilder(this)
// 	public proto: IClass = BaseClass1.prototype
// }
// BaseClass1.prototype.builder = new ObservableObjectBuilder(BaseClass1.prototype)
//
// export class BaseClass2 extends BaseClass1 implements IClass {
// 	public builder = new ObservableObjectBuilder(this)
// 	public proto: IClass = BaseClass2.prototype
// }
// BaseClass2.prototype.builder = new ObservableObjectBuilder(BaseClass2.prototype)
//
// export class Class1 extends BaseClass1 implements IClass {
// 	public builder = new ObservableObjectBuilder(this)
// 	public proto: IClass = Class1.prototype
// }
// Class1.prototype.builder = new ObservableObjectBuilder(Class1.prototype)
//
// export class Class2 extends BaseClass2 implements IClass {
// 	public builder = new ObservableObjectBuilder(this)
// 	public proto: IClass = Class2.prototype
// }
// Class2.prototype.builder = new ObservableObjectBuilder(Class2.prototype)
//
// export class TestObject {
// 	public instanceBase1 = new BaseClass1()
// 	public instanceBase2 = new BaseClass2()
// 	public instance1 = new Class1()
// 	public instance2 = new Class2()
// }
//
// let staticObservableObject
// staticObservableObject = new ObservableClass()
//
// export function assertEvents(events: IEvent[], excepted: IEvent[]) {
// 	events = eventsToDisplay(events)
// 	excepted = eventsToDisplay(excepted)
// 	assert.deepStrictEqual(events, excepted)
// }
//
// export class TestObservableObject extends TestVariants<
// 	IObservableObjectAction,
// 	IObservableObjectExpected,
// 	IObservableObjectOptionsVariant,
// 	IObservableObjectOptionsVariants
// > {
// 	private constructor() {
// 		super()
// 	}
//
// 	public static totalTests: number = 0
//
// 	protected baseOptionsVariants: IObservableObjectOptionsVariants = {
// 		calcTime: [0],
// 		throttleTime: [null],
// 		maxThrottleTime: [null],
// 		minTimeBetweenCalc: [null],
// 		autoInvalidateInterval: [null],
// 		reuseSetInstance: [false, true],
// 		autoCalc: [false],
// 	}
//
// 	protected testVariant(
// 		options: IObservableObjectOptionsVariant & IOptionsVariant<IObservableObjectAction, IObservableObjectExpected>,
// 	) {
// 		let error
// 		for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
// 			let unsubscribePropertyChanged
// 			try {
// 				let expectedEvents: IEvent[] = options.expected.events.slice()
// 				let events: IEvent[]
// 				let observableObject: ObservableClass
//
// 				if (options.reuseSetInstance) {
// 					staticCalcTime = 0
// 					staticAutoCalc = false
// 					staticObservableObject.minTimeBetweenCalc = null
// 					staticObservableObject.throttleTime = null
// 					staticObservableObject.maxThrottleTime = null
// 					staticObservableObject.autoInvalidateInterval = null
// 					staticObservableObject.calc()
// 					timing.addTime(options.minTimeBetweenCalc)
// 					testStartTime = timing.now()
//
// 					events = staticEvents = []
// 					observableObject = staticObservableObject
// 					staticAutoCalc = options.autoCalc
// 					staticCalcTime = options.calcTime
// 					staticObservableObject.minTimeBetweenCalc = options.minTimeBetweenCalc
// 					staticObservableObject.throttleTime = options.throttleTime
// 					staticObservableObject.maxThrottleTime = options.maxThrottleTime
// 					staticObservableObject.autoInvalidateInterval = options.autoInvalidateInterval
// 					staticObservableObject.invalidate()
// 				} else {
// 					testStartTime = timing.now()
// 					events = []
// 					const autoCalc = options.autoCalc
// 					const calcTime = options.calcTime
// 					observableObject = new ObservableClass({
// 						timing,
// 						canBeCalcCallback() {
// 							if (observableObject) {
// 								assert.strictEqual(this, observableObject)
// 							} else {
// 								assert.ok(this)
// 							}
//
// 							events.push({
// 								time: timing.now() - testStartTime,
// 								type: EventType.CanBeCalc,
// 							})
// 							if (autoCalc) {
// 								this.calc()
// 							}
// 						},
// 						calcFunc(done) {
// 							if (observableObject) {
// 								assert.strictEqual(this, observableObject)
// 							} else {
// 								assert.ok(this)
// 							}
//
// 							events.push({
// 								time: timing.now() - testStartTime,
// 								type: EventType.Calc,
// 							})
// 							if (!calcTime) {
// 								done()
// 							} else {
// 								timing.setTimeout(done, calcTime)
// 							}
// 						},
// 						calcCompletedCallback() {
// 							if (observableObject) {
// 								assert.strictEqual(this, observableObject)
// 							} else {
// 								assert.ok(this)
// 							}
//
// 							events.push({
// 								time: timing.now() - testStartTime,
// 								type: EventType.Completed,
// 							})
// 						},
// 						minTimeBetweenCalc: options.minTimeBetweenCalc,
// 						throttleTime: options.throttleTime,
// 						maxThrottleTime: options.maxThrottleTime,
// 						autoInvalidateInterval: options.autoInvalidateInterval,
// 					})
// 				}
//
// 				const propertyChangedEvents = []
// 				if ((observableObject as unknown as IPropertyChanged).propertyChanged) {
// 					unsubscribePropertyChanged
// 					= (observableObject as unknown as IPropertyChanged).propertyChanged.subscribe(event => {
// 						propertyChangedEvents.push(event)
// 					})
// 				}
//
// 				if (options.expected.error) {
// 					assert.throws(() => options.action(observableObject), options.expected.error)
// 				} else {
// 					assert.deepStrictEqual(options.action(observableObject), options.expected.returnValue === THIS
// 						? observableObject
// 						: options.expected.returnValue)
// 				}
//
// 				assertEvents(events, expectedEvents)
// 				events.splice(0, events.length)
//
// 				timing.addTime(Math.max(
// 					options.throttleTime || 0,
// 					options.maxThrottleTime || 0,
// 					options.minTimeBetweenCalc || 0,
// 					options.autoInvalidateInterval || 0,
// 				) + options.calcTime + 1)
//
// 				assertEvents(events, [])
//
// 				if (unsubscribePropertyChanged) {
// 					unsubscribePropertyChanged()
// 				}
//
// 				assert.deepStrictEqual(propertyChangedEvents, options.expected.propertyChanged || [])
//
// 				break
// 			} catch (ex) {
// 				if (!debugIteration) {
// 					console.log(`Error in: ${
// 						options.description
// 						}\n${
// 						JSON.stringify(options, null, 4)
// 						}\n${options.action.toString()}\n${ex.stack}`)
// 					error = ex
// 				}
// 			} finally {
// 				if (unsubscribePropertyChanged) {
// 					unsubscribePropertyChanged()
// 				}
// 				TestObservableObject.totalTests++
// 			}
// 		}
//
// 		if (error) {
// 			throw error
// 		}
// 	}
//
// 	private static readonly _instance: TestObservableObject = new TestObservableObject()
//
// 	public static test(
// 	testCases: ITestCase<IObservableObjectAction, IObservableObjectExpected> & IObservableObjectOptionsVariants
// 	) {
// 		TestObservableObject._instance.test(testCases)
// 	}
// }

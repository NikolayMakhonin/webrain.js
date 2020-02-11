import {assert} from '../../../../../main/common/test/Assert'
import * as v8 from './runtime'

export {v8}

type TAnyFunc = (...args: any[]) => any

// https://gist.github.com/naugtur/4b03a9f9f72346a9f79d7969728a849f
const optimizationStatusDescriptions = [
	'IsFunction',
	'NeverOptimize',
	'AlwaysOptimize',
	'MaybeDeopted',
	'Optimized',
	'TurboFanned',
	'Interpreted',
	'MarkedForOptimization',
	'MarkedForConcurrentOptimization',
	'OptimizingConcurrently',
	'IsExecuting',
	'TopmostFrameIsTurboFanned',
	'LiteMode',
	'MarkedForDeoptimization',
]

export enum OptimizationStatus {
	IsFunction = 1,
	NeverOptimize = 2,
	AlwaysOptimize = 4,
	MaybeDeopted = 8,
	Optimized = 16,
	TurboFanned = 32,
	Interpreted = 64,
	MarkedForOptimization = 128,
	MarkedForConcurrentOptimization = 256,
	OptimizingConcurrently = 512,
	IsExecuting = 1024,
	TopmostFrameIsTurboFanned = 2048,
	LiteMode = 4096,
	MarkedForDeoptimization = 8192,
}

export function optimizationStatusToString(status: OptimizationStatus) {
	const result = []
	let _status = status
	for (let i = 0, len = optimizationStatusDescriptions.length; i < len; i++) {
		if ((_status & 1) === 1) {
			result.push(optimizationStatusDescriptions[i])
		}
		_status >>= 1
	}
	if (_status) {
		result.push('unknown')
	}
	return status + ': [' + result.join(', ') + ']'
}

export function getFuncOptimizationStatusString(funcs: { [name: string]: TAnyFunc}) {
	const result = {}
	for (const name in funcs) {
		if (Object.prototype.hasOwnProperty.call(funcs, name)) {
			const status = v8.GetOptimizationStatus(funcs[name])
			result[name] = optimizationStatusToString(status)
		}
	}
	return result
}

export function assertFuncOptimizationStatus(
	name: string,
	func: TAnyFunc,
	shouldFlags: OptimizationStatus,
	shouldNotFlags: OptimizationStatus = 0,
) {
	const status = v8.GetOptimizationStatus(func)
	assert.strictEqual(optimizationStatusToString(status), optimizationStatusToString(status | shouldFlags), name)
	assert.strictEqual(optimizationStatusToString(status), optimizationStatusToString(status & ~shouldNotFlags), name)
}

export function getObjectOptimizationInfo(obj) {
	return {
		HasFastPackedElements: v8.HasFastPackedElements(obj),
		HasDictionaryElements: v8.HasDictionaryElements(obj),
		HasDoubleElements: v8.HasDoubleElements(obj),
		// HasElementsInALargeObjectSpace: v8.HasElementsInALargeObjectSpace(obj),
		HasFastElements: v8.HasFastElements(obj),
		HasFastProperties: v8.HasFastProperties(obj),
		HasFixedBigInt64Elements: v8.HasFixedBigInt64Elements(obj),
		HasFixedBigUint64Elements: v8.HasFixedBigUint64Elements(obj),
		HasFixedFloat32Elements: v8.HasFixedFloat32Elements(obj),
		HasFixedFloat64Elements: v8.HasFixedFloat64Elements(obj),
		HasFixedInt16Elements: v8.HasFixedInt16Elements(obj),
		HasFixedInt32Elements: v8.HasFixedInt32Elements(obj),
		HasFixedInt8Elements: v8.HasFixedInt8Elements(obj),
		HasFixedUint16Elements: v8.HasFixedUint16Elements(obj),
		HasFixedUint32Elements: v8.HasFixedUint32Elements(obj),
		HasFixedUint8ClampedElements: v8.HasFixedUint8ClampedElements(obj),
		HasFixedUint8Elements: v8.HasFixedUint8Elements(obj),
		HasHoleyElements: v8.HasHoleyElements(obj),
		HasObjectElements: v8.HasObjectElements(obj),
		HasPackedElements: v8.HasPackedElements(obj),
		HasSloppyArgumentsElements: v8.HasSloppyArgumentsElements(obj),
		HasSmiElements: v8.HasSmiElements(obj),
		HasSmiOrObjectElements: v8.HasSmiOrObjectElements(obj),
		HeapObjectVerify: v8.HeapObjectVerify(obj),
	}
}

export type TObjectOptimizationInfo = { [key in keyof ReturnType<typeof getObjectOptimizationInfo>]?: boolean }

export function filterObjectByKeys(obj: object, keys: { [key: string]: any }) {
	const objFiltered = {}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)
			&& Object.prototype.hasOwnProperty.call(keys, key))
		{
			objFiltered[key] = obj[key]
		}
	}

	return objFiltered
}

export function assertIsOptimized(objectsOrFuncs: { [name: string]: TAnyFunc|object}) {
	const actual = {}
	const expected = {}
	for (const name in objectsOrFuncs) {
		if (Object.prototype.hasOwnProperty.call(objectsOrFuncs, name)) {
			const obj = objectsOrFuncs[name]
			if (typeof obj === 'function') {
				const status = v8.GetOptimizationStatus(obj as TAnyFunc)
				const shouldFlags = OptimizationStatus.IsFunction | OptimizationStatus.Optimized | OptimizationStatus.TurboFanned
				const shouldNotFlags = OptimizationStatus.NeverOptimize | OptimizationStatus.IsExecuting |
					OptimizationStatus.MaybeDeopted | OptimizationStatus.LiteMode |
					OptimizationStatus.MarkedForDeoptimization

				let actualStatus = status & (shouldFlags | shouldNotFlags)
				let expectedStatus = actualStatus | shouldFlags
				const differentFlags = actualStatus ^ expectedStatus
				actualStatus &= differentFlags
				expectedStatus &= differentFlags

				if (actualStatus !== expectedStatus) {
					actual[name] = optimizationStatusToString(actualStatus)
					expected[name] = optimizationStatusToString(expectedStatus)
				}
			} else if (obj != null && typeof obj === 'object') {
				const shouldInfo = Array.isArray(obj)
					? {
						HasFastPackedElements: true,
						HasDictionaryElements: false,
						HasDoubleElements: true,
						HasFastElements: true,
					}
					: {
						HasDictionaryElements: false,
						HasFastElements: true,
						HasHoleyElements: true,
						HasObjectElements: true,
						HasSmiOrObjectElements: true,
					}

				const objInfo = getObjectOptimizationInfo(obj)
				const actualInfo = {}
				const expectedInfo = {}
				let hasError
				for (const key in shouldInfo) {
					if (Object.prototype.hasOwnProperty.call(shouldInfo, key)) {
						// tslint:disable-next-line:no-collapsible-if
						if (objInfo[key] !== shouldInfo[key]) {
							actualInfo[key] = objInfo[key]
							expectedInfo[key] = shouldInfo[key]
							hasError = true
						}
					}
				}
				if (hasError) {
					actual[name] = actualInfo
					expected[name] = expectedInfo
				}
			} else {
				throw new Error(`object type === ${typeof obj}`)
			}
		}
	}

	assert.deepStrictEqual(actual, expected)
}

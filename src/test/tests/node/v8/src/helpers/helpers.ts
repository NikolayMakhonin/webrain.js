import {assert} from '../../../../../../main/common/test/Assert'
import {
	getObjectOptimizationInfo,
	optimizationStatusToString,
	shouldArrayOptimizationInfo,
	shouldNotOptimizationStatus,
	shouldObjectOptimizationInfo,
	shouldOptimizationStatus,
	v8,
} from './common/helpers'
import {OptimizationStatus, TAnyFunc} from './contracts'

function _checkIsOptimized(obj: TAnyFunc|object, optimized: Set<any> = null, scanned: Set<any> = new Set()) {
	if (scanned.has(obj)) {
		return null
	}
	scanned.add(obj)

	if (typeof obj === 'function') {
		const status = v8.GetOptimizationStatus(obj as TAnyFunc)

		let actualStatus = status & (shouldOptimizationStatus | shouldNotOptimizationStatus)
		if ((status & OptimizationStatus.MarkedForOptimization) !== 0) {
			actualStatus |= OptimizationStatus.Optimized | OptimizationStatus.TurboFanned
		}
		let expectedStatus = actualStatus | shouldOptimizationStatus
		const differentFlags = actualStatus ^ expectedStatus
		actualStatus &= differentFlags
		expectedStatus &= differentFlags

		const actualFunc = {}
		const expectedFunc = {}
		let hasError

		if (actualStatus !== expectedStatus) {
			if (optimized && !optimized.has(obj)) {
				return null
			}

			actualFunc['()'] = optimizationStatusToString(status)
			expectedFunc['()'] = optimizationStatusToString(expectedStatus)
			hasError = true
		}

		if (obj.prototype) {
			const res = _checkIsOptimized(obj.prototype, optimized, scanned)
			if (res) {
				hasError = true;
				(actualFunc as any)._prototype = res.actual;
				(expectedFunc as any)._prototype = res.expected
			}
		}

		if (hasError) {
			return {
				actual: actualFunc,
				expected: expectedFunc,
			}
		}
	} else if (obj != null && typeof obj === 'object') {
		if (obj.valueOf() !== obj) {
			return null
		}

		if (obj instanceof Int8Array
			|| obj instanceof Int16Array
			|| obj instanceof Int32Array
			|| obj instanceof BigInt64Array
			|| obj instanceof Uint8Array
			|| obj instanceof Uint16Array
			|| obj instanceof Uint32Array
			|| obj instanceof BigUint64Array
			|| obj instanceof Float32Array
			|| obj instanceof Float64Array
			|| obj instanceof Uint8ClampedArray
		) {
			return null
		}

		const shouldInfo = Array.isArray(obj)
			? shouldArrayOptimizationInfo
			: shouldObjectOptimizationInfo

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
			return {
				actual: actualInfo,
				expected: expectedInfo,
			}
		} else {
			if (Array.isArray(obj)) {
				const actualArr = []
				const expectedArr = []
				for (let i = 0, len = obj.length; i < len; i++) {
					const item = obj[i]
					if (typeof item === 'function' || item != null && typeof item === 'object') {
						const res = _checkIsOptimized(item, optimized, scanned)
						if (res) {
							hasError = true
							actualArr.push(res.actual)
							expectedArr.push(res.expected)
						}
					}
				}
				if (hasError) {
					return {
						actual: actualArr,
						expected: expectedArr,
					}
				}
			} else {
				const actualObj = {}
				const expectedObj = {}
				// tslint:disable-next-line:forin
				for (const key in obj) {
					const item = obj[key]
					if (typeof item === 'function' || item != null && typeof item === 'object') {
						const res = _checkIsOptimized(item, optimized, scanned)
						if (res) {
							hasError = true
							actualObj[key] = res.actual
							expectedObj[key] = res.expected
						}
					}
				}
				if (hasError) {
					return {
						actual: actualObj,
						expected: expectedObj,
					}
				}
			}
		}
	} else {
		throw new Error(`object type === ${obj == null ? obj : typeof obj}`)
	}

	if (optimized) {
		optimized.add(obj)
	}

	return null
}

export function checkIsOptimized(objectOrFunc: TAnyFunc|object, optimized: Set<any> = null) {
	return !_checkIsOptimized(objectOrFunc, optimized)
}

export function assertIsOptimized(objectOrFunc: TAnyFunc|object, optimized: Set<any> = null) {
	const res = _checkIsOptimized(objectOrFunc, optimized)
	if (res) {
		const {
			actual,
			expected,
		} = res
		assert.deepStrictEqual(actual, expected)
		assert.notOk(res)
	}
}

export function assertIsNotOptimized(objectOrFunc: TAnyFunc|object, optimized: Set<any> = null) {
	const res = _checkIsOptimized(objectOrFunc, optimized)
	assert.ok(res)
}

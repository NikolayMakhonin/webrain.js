import {OptimizationStatus} from '../contracts'
import * as node_4_9_1 from '../node_4_9_1/helpers'
import * as node_latest from '../node_latest/helpers'

export function filterObjectByKeys(obj: object, keys: { [key: string]: any }) {
	const objFiltered = {}
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)
			&& Object.prototype.hasOwnProperty.call(keys, key)) {
			objFiltered[key] = obj[key]
		}
	}

	return objFiltered
}

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

const node_current = process.version === 'v4.9.1'
	? node_4_9_1
	: node_latest

export const v8 = node_current.v8
export const shouldArrayOptimizationInfo = node_current.shouldArrayOptimizationInfo
export const shouldObjectOptimizationInfo = node_current.shouldObjectOptimizationInfo
export const getObjectOptimizationInfo = node_current.getObjectOptimizationInfo
export const shouldOptimizationStatus = node_current.shouldOptimizationStatus
export const shouldNotOptimizationStatus = node_current.shouldNotOptimizationStatus

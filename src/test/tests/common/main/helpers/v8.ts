import {assert} from '../../../../../main/common/test/Assert'
import {getOptimizationStatus} from './v8-funcs'

export {
	getOptimizationStatus,
}

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

export function getOptimizationStatusString(func: TAnyFunc) {
	const status = getOptimizationStatus(func)
	return optimizationStatusToString(status)
}

export function assertOptimizationStatus(
	func: TAnyFunc,
	shouldFlags: OptimizationStatus,
	shouldNotFlags: OptimizationStatus = 0,
) {
	const status = getOptimizationStatus(func)
	assert.strictEqual(optimizationStatusToString(status), optimizationStatusToString(status | shouldFlags))
	assert.strictEqual(optimizationStatusToString(status), optimizationStatusToString(status & ~shouldNotFlags))
}

export function assertIsOptimized(func: TAnyFunc) {
	assertOptimizationStatus(
		func,

		OptimizationStatus.IsFunction | OptimizationStatus.Optimized | OptimizationStatus.TurboFanned,

		OptimizationStatus.NeverOptimize | OptimizationStatus.IsExecuting |
		OptimizationStatus.MaybeDeopted | OptimizationStatus.LiteMode |
		OptimizationStatus.MarkedForDeoptimization,
	)
}

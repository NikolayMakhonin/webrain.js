import {assert} from '../../../../../main/common/test/Assert'
import {getOptimizationStatus} from './v8-funcs'

export {
	getOptimizationStatus,
}

type TAnyFunc = (...args: any[]) => any

// https://gist.github.com/naugtur/4b03a9f9f72346a9f79d7969728a849f
const optimizationStatusDescriptions = [
	'is function',
	'is never optimized',
	'is always optimized',
	'is maybe deoptimized',
	'is optimized',
	'is optimized by TurboFan',
	'is interpreted',
	'is marked for optimization',
	'is marked for concurrent optimization',
	'is optimizing concurrently',
	'is executing',
	'topmost frame is turbo fanned',
]

export enum OptimizationStatus {
	IsFunction = 1,
	IsNeverOptimized = 2,
	IsAlwaysOptimized = 4,
	IsMayBeOptimized = 8,
	IsOptimized = 16,
	IsOptimizedByTurboFan = 32,
	IsInterpreted = 64,
	IsMarkedForOptimization = 128,
	IsMarkedForConcurrentOptimization = 256,
	IsOptimizingConcurrently = 512,
	IsExecuting = 1024,
	TopMostFrameIsTurboFanned = 2048,
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
		OptimizationStatus.IsFunction | OptimizationStatus.IsOptimized | OptimizationStatus.IsOptimizedByTurboFan,
		OptimizationStatus.IsNeverOptimized | OptimizationStatus.IsExecuting,
	)
}

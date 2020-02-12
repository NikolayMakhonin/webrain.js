import {OptimizationStatus} from '../contracts'
import * as v8 from './runtime'

enum _OptimizationStatus {
	Optimized = 1,
	NotOptimized = 2,
	AlwaysOptimized = 3,
	NeverOptimized = 4,
	MaybeDeoptimized = 6,
	TurboFanned = 7,
	// Interpreted = 8, // not in node 4.9.1
}

function convertOptimizationStatus(status: _OptimizationStatus): OptimizationStatus {
	switch (status) {
		case _OptimizationStatus.NotOptimized:
			return OptimizationStatus.IsFunction | OptimizationStatus.Interpreted
		case _OptimizationStatus.Optimized:
			return OptimizationStatus.IsFunction | OptimizationStatus.Optimized
		case _OptimizationStatus.AlwaysOptimized:
			return OptimizationStatus.IsFunction | OptimizationStatus.AlwaysOptimize
		case _OptimizationStatus.NeverOptimized:
			return OptimizationStatus.IsFunction | OptimizationStatus.NeverOptimize
		case _OptimizationStatus.MaybeDeoptimized:
			return OptimizationStatus.IsFunction | OptimizationStatus.MaybeDeopted
		case _OptimizationStatus.TurboFanned:
			return OptimizationStatus.IsFunction | OptimizationStatus.Optimized | OptimizationStatus.TurboFanned
		default:
			throw new Error('Unknown _OptimizationStatus: ' + status)
	}
}

function GetOptimizationStatus(fn) {
	return convertOptimizationStatus(v8.GetOptimizationStatus(fn))
}

export default {
	...v8,
	GetOptimizationStatus,
}

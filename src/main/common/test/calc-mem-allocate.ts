// @ts-ignore
import {runInRealtimePriority} from 'rdtsc'
import {calc, CalcStatReport, CalcType} from './calc'

function _calcMemAllocate(
	calcType: CalcType,
	countTests: number,
	testFunc: (...args: any[]) => void,
	...testFuncArgs: any[]
): CalcStatReport {
	return calc(calcType, countTests, (...args) => {
		let heapUsed = process.memoryUsage().heapUsed
		testFunc(...args)
		heapUsed = process.memoryUsage().heapUsed - heapUsed
		return heapUsed < 0 ? null : [heapUsed]
	}, ...testFuncArgs)
}

export function calcMemAllocate(
	calcType: CalcType,
	countTests: number,
	testFunc: (...args: any[]) => void,
	...testFuncArgs: any[]
) {
	return runInRealtimePriority(() => {
		// tslint:disable-next-line:no-empty
		const zero = _calcMemAllocate(calcType, countTests, () => {
			// empty
		}, ...testFuncArgs)
		const value = _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs)
		return value.subtract(zero)
	})
}

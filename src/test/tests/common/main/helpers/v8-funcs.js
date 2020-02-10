// see: https://github.com/v8/v8/blob/master/src/runtime/runtime.h
// see: https://www.npmjs.com/package/v8-natives

export function getOptimizationStatus(fn) {
	return %GetOptimizationStatus(fn)
}

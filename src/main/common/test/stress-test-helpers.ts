// import path from "path";
//
// // region throwOnConsoleError
//
// let lastConsoleError = null
// async function throwOnConsoleError(level: 'error'|'warn', func) {
// 	lastConsoleError = null
// 	const origConsoleError = console.error
// 	const origConsoleWarn = console.warn
// 	try {
// 		console.error = function() {
// 			lastConsoleError = Array.from(arguments)
// 			origConsoleError.apply(this, arguments)
// 			throw Array.from(arguments).map(o => objectToString(o)).join('\r\n')
// 		}
// 		if (level === 'warn') {
// 			console.warn = function() {
// 				lastConsoleError = Array.from(arguments)
// 				origConsoleWarn.apply(this, arguments)
// 				throw Array.from(arguments).map(o => objectToString(o)).join('\r\n')
// 			}
// 		}
//
// 		const result = await func()
//
// 		if (lastConsoleError) {
// 			throw lastConsoleError
// 		}
//
// 		return result
// 	} finally {
// 		console.error = origConsoleError
// 		console.warn = origConsoleWarn
// 	}
// }
//
// // endregion
//
// // region searchBestError
//
// async function searchBestError<TMetrics = any>({
// 	name,
// 	iterations,
// 	testFunc,
// 	compareMetrics,
// 	customSeed,
// 	metricsMin,
// }: {
// 	name: string,
// 	iterations: number,
// 	testFunc: (seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
// 	compareMetrics: (metrics1, metrics2) => boolean,
// 	customSeed?: number,
// 	metricsMin?: TMetrics,
// }) {
// 	const testCasesFile = path.resolve(`./tmp/pouchdb/_TestCases/${name}.txt`)
// 	const testCasesDir = path.dirname(testCasesFile)
// 	if (!await fse.pathExists(testCasesDir)) {
// 		await fse.mkdir(testCasesDir)
// 	}
// 	await fse.writeFile(testCasesFile, '')
//
// 	let i = 0
// 	let seedMin = null
// 	let errorMin = null
// 	let reportMin = null
// 	while (true) {
// 		const seed = customSeed != null ? customSeed : new Random().nextInt(2 << 29)
// 		const metrics = {} as TMetrics
//
// 		try {
// 			await testFunc(seed, metrics, metricsMin || {} as any)
// 		} catch (error) {
// 			if (customSeed != null) {
// 				console.log(`customSeed: ${customSeed}`, metrics)
// 				throw error
// 			} else if (errorMin == null || compareMetrics(metrics, metricsMin)) {
// 				metricsMin = {...metrics}
// 				seedMin = seed
// 				errorMin = error
// 				reportMin = `\r\n\r\ncustomSeed: ${
// 					seedMin
// 				},\r\nmetricsMin: ${
// 					JSON.stringify(metricsMin)
// 				},\r\n${
// 					errorMin.stack || errorMin
// 				}`
// 				console.log(reportMin)
// 				await fse.appendFile(
// 					testCasesFile,
// 					reportMin,
// 				)
// 			}
// 		}
//
// 		i++
// 		if (customSeed != null || i >= iterations) {
// 			if (errorMin) {
// 				console.log(reportMin)
// 				throw errorMin
// 			} else {
// 				return
// 			}
// 		}
// 	}
// }
//
// // endregion

import path from 'path'
import {Random} from '../../common/random/Random'
import {ThenableOrIteratorOrValue} from "../../common/async/async";
import {searchBestErrorBuilder, TSearchBestError} from "../../common/test/RandomTest";

// region searchBestErrorBuilder

export function searchBestErrorBuilderNode<TMetrics = any>({
	compareMetrics,
	onFound,
	consoleOnlyBestErrors,
}: {
	compareMetrics: (metrics1, metrics2) => boolean,
	onFound?: (reportMin: string) => void,
	consoleOnlyBestErrors?: boolean,
}): TSearchBestError<TMetrics> {
	return searchBestErrorBuilder({
		compareMetrics,
		consoleOnlyBestErrors,
		onFound(reportMin) {

			if (onFound) {
				onFound(reportMin)
			}
		},
	})
}

// endregion

// region searchBestError

async function searchBestErrorNode<TMetrics = any>({
	name,
	iterations,
	testFunc,
	compareMetrics,
	customSeed,
	metricsMin,
}: {
	name: string,
	iterations: number,
	testFunc: (seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
	compareMetrics: (metrics1, metrics2) => boolean,
	customSeed?: number,
	metricsMin?: TMetrics,
}) {
	const testCasesFile = path.resolve(`./tmp/pouchdb/_TestCases/${name}.txt`)
	const testCasesDir = path.dirname(testCasesFile)
	if (!await fse.pathExists(testCasesDir)) {
		await fse.mkdir(testCasesDir)
	}
	await fse.writeFile(testCasesFile, '')

	await fse.appendFile(
		testCasesFile,
		reportMin,
	)
}

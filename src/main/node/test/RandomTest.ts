import path from 'path'
import {ThenableOrIteratorOrValue} from '../../common/async/async'
import {ISearchBestErrorParams, searchBestErrorBuilder, TSearchBestError} from '../../common/test/RandomTest'
// tslint:disable-next-line:no-var-requires
const fse = require('fs-extra')

// region searchBestErrorBuilder

export function searchBestErrorBuilderNode<TContext, TMetrics>({
	reportFilePath,
	onFound,
	consoleOnlyBestErrors,
}: {
	reportFilePath: string,
	onFound?: (reportMin: string) => ThenableOrIteratorOrValue<any>,
	consoleOnlyBestErrors?: boolean,
}): TSearchBestError<TContext, TMetrics> {
	const testCasesFile = path.resolve(reportFilePath)
	const testCasesDir = path.dirname(testCasesFile)

	const searchBestError = searchBestErrorBuilder<TContext>({
		consoleOnlyBestErrors,
		*onFound(reportMin) {
			yield fse.appendFile(
				testCasesFile,
				reportMin,
			)

			if (onFound) {
				onFound(reportMin)
			}
		},
	})

	return function*(
		_this: TContext,
		{
			customSeed,
			metricsMin,
			stopPredicate,
			createMetrics,
			compareMetrics,
			func,
		}: ISearchBestErrorParams<TMetrics> & {
			createMetrics: () => ThenableOrIteratorOrValue<TMetrics>,
			compareMetrics: (metrics1, metrics2) => boolean,
			func: (seed: number, metrics: TMetrics, metricsMin: TMetrics) => void | Promise<void>,
		},
	) {
		if (!(yield fse.pathExists(testCasesDir))) {
			yield fse.mkdirp(testCasesDir)
		}
		yield fse.writeFile(testCasesFile, '')

		yield searchBestError(
			_this,
			{
				customSeed,
				metricsMin,
				stopPredicate,
				createMetrics,
				compareMetrics,
				func,
			},
		)
	}
}

// endregion

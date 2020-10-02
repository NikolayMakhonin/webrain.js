import path from 'path'
import fse from 'fs-extra'
import {ThenableOrIteratorOrValue} from '../../common/async/async'
import {
	ISearchBestErrorMetrics,
	ISearchBestErrorParams,
	searchBestErrorBuilder,
	TSearchBestError,
} from '../../common/test/randomTest'
// tslint:disable-next-line:no-var-requires

// region searchBestErrorBuilder

export function searchBestErrorBuilderNode<TMetrics>({
	reportFilePath,
	onFound,
	consoleOnlyBestErrors,
}: {
	reportFilePath: string,
	onFound?: (reportMin: string) => ThenableOrIteratorOrValue<any>,
	consoleOnlyBestErrors?: boolean,
}): TSearchBestError<TMetrics> {
	const testCasesFile = path.resolve(reportFilePath)
	const testCasesDir = path.dirname(testCasesFile)

	const searchBestError = searchBestErrorBuilder<TMetrics>({
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

	return function *<TContext>(
		_this: TContext,
		{
			customSeed,
			metricsMin,
			stopPredicate,
			createMetrics,
			compareMetrics,
			func,
		}: ISearchBestErrorParams<TMetrics> & {
			createMetrics: (metrics: ISearchBestErrorMetrics) => ThenableOrIteratorOrValue<TMetrics>,
			compareMetrics: (metrics1, metrics2) => number,
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

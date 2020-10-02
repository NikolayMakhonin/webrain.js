import path from 'path';
import fse from 'fs-extra';
import { searchBestErrorBuilder } from '../../common/test/randomTest'; // tslint:disable-next-line:no-var-requires
// region searchBestErrorBuilder

export function searchBestErrorBuilderNode({
  reportFilePath,
  onFound,
  consoleOnlyBestErrors
}) {
  const testCasesFile = path.resolve(reportFilePath);
  const testCasesDir = path.dirname(testCasesFile);
  const searchBestError = searchBestErrorBuilder({
    consoleOnlyBestErrors,

    *onFound(reportMin) {
      yield fse.appendFile(testCasesFile, reportMin);

      if (onFound) {
        onFound(reportMin);
      }
    }

  });
  return function* (_this, {
    customSeed,
    metricsMin,
    stopPredicate,
    createMetrics,
    compareMetrics,
    func
  }) {
    if (!(yield fse.pathExists(testCasesDir))) {
      yield fse.mkdirp(testCasesDir);
    }

    yield fse.writeFile(testCasesFile, '');
    yield searchBestError(_this, {
      customSeed,
      metricsMin,
      stopPredicate,
      createMetrics,
      compareMetrics,
      func
    });
  };
} // endregion
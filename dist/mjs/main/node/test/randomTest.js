import path from 'path';
import { searchBestErrorBuilder } from '../../common/test/randomTest'; // tslint:disable-next-line:no-var-requires

const fse = require('fs-extra'); // region searchBestErrorBuilder


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
"use strict";

var _rdtsc = require("rdtsc");

var _ThenableSync = require("../../../main/common/async/ThenableSync");

var _Mocha = require("../../../main/common/test/Mocha");

/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
(0, _Mocha.describe)('common > async', function () {
  this.timeout(300000);
  (0, _Mocha.it)('ThenableSync then resolve', function () {
    var _resolve;

    function executor(resolve) {
      _resolve = resolve;
    }

    function then(o) {
      return o + 1;
    }

    var thenable;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      thenable = new _ThenableSync.ThenableSync(executor);
    }, function () {
      thenable.then(then);

      _resolve();

      thenable.then(then);
    });
    /*
    absoluteDiff: [ 93, 1603 ],
    absoluteDiff: [ 88, 1721 ],
    absoluteDiff: [ 107, 1725 ],
    absoluteDiff: [ 76, 1847 ],
    absoluteDiff: [ 100, 1879 ],
    absoluteDiff: [ 72, 1648 ],
    absoluteDiff: [ 107, 1655 ],
    absoluteDiff: [ 65, 1674 ],
    absoluteDiff: [ 69, 1805 ],
     absoluteDiff: [ 69, 1560 ],
    absoluteDiff: [ 62, 1549 ],
    absoluteDiff: [ 77, 1495 ],
     absoluteDiff: [ 92, 1610 ],
    absoluteDiff: [ 85, 1449 ],
    absoluteDiff: [ 76, 1441 ],
     absoluteDiff: [ 88, 1418 ],
     */

    console.log(result);
  });
});
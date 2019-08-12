"use strict";

var _helpers = require("../../../../../main/common/helpers/helpers");

var _TestThenableSync = require("./src/TestThenableSync");

describe('common > main > helpers > ThenableSync', function () {
  this.timeout(60000);
  const testThenableSync = _TestThenableSync.TestThenableSync.test;
  after(function () {
    console.log('Total ThenableSync tests >= ' + _TestThenableSync.TestThenableSync.totalTests);
  });
  it('variants', function () {
    testThenableSync({
      expected: {
        value: o => {
          if (o.value && (0, _helpers.isIterable)(o.value) && o.value.next) {
            return _TestThenableSync.ITERABLE;
          }

          return o.value;
        }
      },
      actions: null
    });
  }); // xit('performance', function() {
  // 	this.timeout(120000)
  //
  // 	const time0 = new Date().getTime()
  // 	do {
  // 		let resolve
  // 		let result
  //
  // 		new ThenableSync(o => {
  // 			resolve = o
  // 		})
  // 			.then(o => true)
  // 			.then(o => (result = o))
  //
  // 		resolve(1)
  // 	} while (new Date().getTime() - time0 < 60000)
  // })
});
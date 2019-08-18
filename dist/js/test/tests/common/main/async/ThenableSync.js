"use strict";

var _TestThenableSync = require("./src/TestThenableSync");

describe('common > main > helpers > ThenableSync', function () {
  this.timeout(120000);
  const testThenableSync = _TestThenableSync.TestThenableSync.test;
  after(function () {
    console.log('Total ThenableSync tests >= ' + _TestThenableSync.TestThenableSync.totalTests);
  });
  it('variants', function () {
    testThenableSync({
      exclude: o => {
        if (o.thenValue0 === _TestThenableSync.ValueType.IteratorThrow && o.thenValue1 === _TestThenableSync.ValueType.IteratorThrow) {
          return true;
        }

        if (o.createValue0 === _TestThenableSync.ValueType.IteratorThrow && o.createValue1 === _TestThenableSync.ValueType.IteratorThrow) {
          return true;
        }

        return false;
      },
      expected: {
        value: o => {
          return o.value;
        }
      },
      actions: null
    });
  }); //
  // it('variants', function() {
  // 	testThenableSync({
  // 		exclude: o => {
  // 			if ((o.type === ResolveType.Rejected
  // 				|| o.type === ResolveType.Throwed
  // 				|| o.type === ResolveType.Reject
  // 				|| o.valueType === ResolveType.Rejected
  // 				|| o.valueType === ResolveType.Throwed
  // 				|| o.valueType === ResolveType.Reject)
  // 				&& (o.getValueWithResolve || o.createWithIterator)) {
  // 				return true
  // 			}
  //
  // 			return false
  // 		},
  // 		expected: {
  // 			value: o => {
  // 				return o.value
  // 			},
  // 		},
  // 		actions: null,
  // 	})
  // })
  // xit('performance', function() {
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
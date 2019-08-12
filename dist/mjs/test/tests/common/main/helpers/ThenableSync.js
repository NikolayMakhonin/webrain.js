import { isIterable } from '../../../../../main/common/helpers/helpers';
import { ITERABLE, TestThenableSync } from './src/TestThenableSync';
describe('common > main > helpers > ThenableSync', function () {
  this.timeout(60000);
  var testThenableSync = TestThenableSync.test;
  after(function () {
    console.log('Total ThenableSync tests >= ' + TestThenableSync.totalTests);
  });
  it('variants', function () {
    testThenableSync({
      expected: {
        value: function value(o) {
          if (o.value && isIterable(o.value) && o.value.next) {
            return ITERABLE;
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
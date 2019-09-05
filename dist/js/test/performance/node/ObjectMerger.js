"use strict";

var _rdtsc = require("rdtsc");

var _mergers = require("../../../main/common/extensions/merge/mergers");

/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
describe('common > extensions > merge > ObjectMerger', function () {
  this.timeout(300000);
  var merger = new _mergers.ObjectMerger();

  function getRandomValue(values) {
    return values[Math.floor(Math.random() * values.length)];
  } // function perfTest(name: string, values: any[]) {
  // 	let time = new Date().getTime()
  // 	let count = 0
  // 	while (true) {
  // 		merger.merge(
  // 			getRandomValue(values),
  // 			getRandomValue(values),
  // 			getRandomValue(values),
  // 			o => {},
  // 			Math.random() > 0.5,
  // 			Math.random() > 0.5,
  // 		)
  //
  // 		count++
  // 		if (new Date().getTime() - time > 20000) {
  // 			break
  // 		}
  // 	}
  //
  // 	time = (new Date().getTime() - time) / 1000
  // 	console.log(`${name} - Count tests: ${count} - Operations per second: ${count / time}\r\n\r\n`)
  // }
  // it('all', function() {
  // 	perfTest('all', [
  // 		null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
  // 		null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
  // 		null, void 0, 0, 1, false, true, '', '1', {}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 }, Object.freeze({ x: {y: 1} }), new Date(1), new Date(2),
  // 	])
  // })


  it('objects', function () {
    // perfTest('objects', [
    // 	{}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 },
    // 	{}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 },
    // 	{}, { a: {a: 1, b: 2}, b: 3 }, { a: {b: 4, c: 5}, c: 6 }, { a: {a: 7, b: 8}, d: 9 },
    // ])
    var result = (0, _rdtsc.calcPerformance)(120000, function () {// no operations
    }, function () {
      return merger.merge({
        a: {
          a: 1,
          b: 2
        },
        b: 3
      }, {
        a: {
          b: 4,
          c: 5
        },
        c: 6
      }, {
        a: {
          a: 7,
          b: 8
        },
        d: 9
      }, function (o) {}, true, true);
    });
    console.log(result);
  });
});
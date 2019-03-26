"use strict";

class x {}

const y = function (base) {
  return class y extends base {};
}(x);

const z = function (base) {
  return class z extends base {};
}(y);

new z(); // describe('common > env > modules', function () {
// 	it('class', function () {
// 		class x {
//
// 		}
//
// 		assert.ok(new x())
//
// 		const y = (function (base) {
// 			return class y extends base {
//
// 			}
// 		})(x)
//
// 		assert.ok(new y())
//
// 		const z = (function (base) {
// 			return class z extends base {
//
// 			}
// 		})(y)
//
// 		assert.ok(new z())
// 	})
// })
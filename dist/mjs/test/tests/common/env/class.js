import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";

var x = function x() {
  _classCallCheck(this, x);
};

var y = function (base) {
  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(y, _base);

      function y() {
        _classCallCheck(this, y);

        return _possibleConstructorReturn(this, _getPrototypeOf(y).apply(this, arguments));
      }

      return y;
    }(base)
  );
}(x);

var z = function (base) {
  return (
    /*#__PURE__*/
    function (_base2) {
      _inherits(z, _base2);

      function z() {
        _classCallCheck(this, z);

        return _possibleConstructorReturn(this, _getPrototypeOf(z).apply(this, arguments));
      }

      return z;
    }(base)
  );
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
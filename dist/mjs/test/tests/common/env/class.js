import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";

/* eslint-disable no-new,new-cap */
describe('common > env > modules', function () {
  it('class', function () {
    var x = function x() {
      _classCallCheck(this, x);
    };

    new x();

    var y =
    /*#__PURE__*/
    function (_x) {
      _inherits(y, _x);

      function y() {
        _classCallCheck(this, y);

        return _possibleConstructorReturn(this, _getPrototypeOf(y).apply(this, arguments));
      }

      return y;
    }(x);

    new y();

    var z =
    /*#__PURE__*/
    function (_y) {
      _inherits(z, _y);

      function z() {
        _classCallCheck(this, z);

        return _possibleConstructorReturn(this, _getPrototypeOf(z).apply(this, arguments));
      }

      return z;
    }(y);

    new z();
  });
});
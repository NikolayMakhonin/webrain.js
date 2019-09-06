"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

/* eslint-disable no-new,new-cap */
describe('common > env > modules', function () {
  it('class', function () {
    var x = function x() {};

    new x();

    var y =
    /*#__PURE__*/
    function (_x) {
      (0, _inheritsLoose2.default)(y, _x);

      function y() {
        return _x.apply(this, arguments) || this;
      }

      return y;
    }(x);

    new y();

    var z =
    /*#__PURE__*/
    function (_y) {
      (0, _inheritsLoose2.default)(z, _y);

      function z() {
        return _y.apply(this, arguments) || this;
      }

      return z;
    }(y);

    new z();
  });
});
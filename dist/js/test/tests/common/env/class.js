"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _Mocha = require("../../../../main/common/test/Mocha");

/* eslint-disable no-new,new-cap */
(0, _Mocha.describe)('common > env > modules', function () {
  (0, _Mocha.it)('class', function () {
    var x = function x() {
      (0, _classCallCheck2.default)(this, x);
    };

    new x();

    var y =
    /*#__PURE__*/
    function (_x) {
      (0, _inherits2.default)(y, _x);

      function y() {
        (0, _classCallCheck2.default)(this, y);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(y).apply(this, arguments));
      }

      return y;
    }(x);

    new y();

    var z =
    /*#__PURE__*/
    function (_y) {
      (0, _inherits2.default)(z, _y);

      function z() {
        (0, _classCallCheck2.default)(this, z);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(z).apply(this, arguments));
      }

      return z;
    }(y);

    new z();
  });
});
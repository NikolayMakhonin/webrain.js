"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _Mocha = require("../../../../main/common/test/Mocha");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

/* eslint-disable no-new,new-cap */
(0, _Mocha.describe)('common > env > modules', function () {
  (0, _Mocha.it)('class', function () {
    var x = function x() {
      (0, _classCallCheck2.default)(this, x);
    };

    new x();

    var y = /*#__PURE__*/function (_x) {
      (0, _inherits2.default)(y, _x);

      var _super = _createSuper(y);

      function y() {
        (0, _classCallCheck2.default)(this, y);
        return _super.apply(this, arguments);
      }

      return y;
    }(x);

    new y();

    var z = /*#__PURE__*/function (_y) {
      (0, _inherits2.default)(z, _y);

      var _super2 = _createSuper(z);

      function z() {
        (0, _classCallCheck2.default)(this, z);
        return _super2.apply(this, arguments);
      }

      return z;
    }(y);

    new z();
  });
});
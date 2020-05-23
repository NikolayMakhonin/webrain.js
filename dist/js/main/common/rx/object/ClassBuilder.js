"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ClassBuilder = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _ObjectBuilder2 = require("./ObjectBuilder");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var ClassBuilder = /*#__PURE__*/function (_ObjectBuilder) {
  (0, _inherits2.default)(ClassBuilder, _ObjectBuilder);

  var _super = _createSuper(ClassBuilder);

  function ClassBuilder() {
    (0, _classCallCheck2.default)(this, ClassBuilder);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ClassBuilder, [{
    key: "func",
    // @ts-ignore
    value: function func(name, _func) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(ClassBuilder.prototype), "func", this).call(this, name, _func);
    }
  }]);
  return ClassBuilder;
}(_ObjectBuilder2.ObjectBuilder);

exports.ClassBuilder = ClassBuilder;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.observableClass = observableClass;
exports.createConnector = createConnector;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _ObservableClass = require("../ObservableClass");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function observableClass(build, baseClass) {
  var NewPropertyClass = /*#__PURE__*/function (_ref) {
    (0, _inherits2.default)(NewPropertyClass, _ref);

    var _super = _createSuper(NewPropertyClass);

    function NewPropertyClass() {
      (0, _classCallCheck2.default)(this, NewPropertyClass);
      return _super.apply(this, arguments);
    }

    return NewPropertyClass;
  }(baseClass != null ? baseClass : _ObservableClass.ObservableClass);

  build(NewPropertyClass.prototype);
  return NewPropertyClass;
}

function createConnector(object, factory) {
  return factory(object);
}
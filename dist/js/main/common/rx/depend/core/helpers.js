"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.InternalError = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/wrapNativeSuper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

// import {ThenableSync} from '../../../async/ThenableSync'
// import {Func, TCall} from './contracts'
// export function createCallWithArgs<TArgs extends any[]>(...args: TArgs): TCall<TArgs>
// export function createCallWithArgs<TArgs extends any[]>(): TCall<TArgs> {
// 	const args = arguments
// 	return function(_this, func) {
// 		return func.apply(_this, args)
// 	}
// }
var InternalError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(InternalError, _Error);

  var _super = _createSuper(InternalError);

  function InternalError() {
    (0, _classCallCheck2.default)(this, InternalError);
    return _super.apply(this, arguments);
  }

  return InternalError;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));

exports.InternalError = InternalError;
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.Observable = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    (0, _classCallCheck2.default)(this, Observable);
  }

  (0, _createClass2.default)(Observable, [{
    key: "call",
    value: function call(func) {
      return func(this);
    }
  }]);
  return Observable;
}();

exports.Observable = Observable;
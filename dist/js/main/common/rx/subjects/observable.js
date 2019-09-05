"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

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
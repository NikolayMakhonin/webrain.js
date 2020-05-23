"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObjectBuilder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var ObjectBuilder = /*#__PURE__*/function () {
  function ObjectBuilder(object) {
    (0, _classCallCheck2.default)(this, ObjectBuilder);
    this.object = object || {};
  }

  (0, _createClass2.default)(ObjectBuilder, [{
    key: "func",
    value: function func(name, _func) {
      this.object[name] = _func;
      return this;
    }
  }]);
  return ObjectBuilder;
}();

exports.ObjectBuilder = ObjectBuilder;
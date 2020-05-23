"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _observable = require("../../../../../../main/common/rx/subjects/observable");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

(0, _Mocha.describe)('common > main > rx > subjects > observable', function () {
  (0, _Mocha.it)('Observable', function () {
    var CustomObservable = /*#__PURE__*/function (_Observable) {
      (0, _inherits2.default)(CustomObservable, _Observable);

      var _super = _createSuper(CustomObservable);

      function CustomObservable() {
        (0, _classCallCheck2.default)(this, CustomObservable);
        return _super.apply(this, arguments);
      }

      (0, _createClass2.default)(CustomObservable, [{
        key: "subscribe",
        value: function subscribe(subscriber) {
          throw new Error('Not implemented');
        }
      }]);
      return CustomObservable;
    }(_observable.Observable);

    var observable = new CustomObservable();
    var arg;
    var result = observable.call(function (o) {
      arg = o;
      return 'result';
    });

    _Assert.assert.strictEqual(arg, observable);

    _Assert.assert.strictEqual(result, 'result');
  });
});